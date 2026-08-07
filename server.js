const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-clear';
const MUNICIPAL_AUTH_KEY = process.env.MUNICIPAL_AUTH_KEY || 'HX291Z';

// Database setup
function getDirectConnectionString() {
  const urlStr = process.env.DATABASE_URL;
  if (!urlStr) {
    throw new Error("DATABASE_URL is not set in environment variables.");
  }

  if (urlStr.startsWith('prisma+postgres://')) {
    try {
      const url = new URL(urlStr);
      const apiKey = url.searchParams.get('api_key');
      if (apiKey) {
        const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
        const data = JSON.parse(decoded);
        if (data.databaseUrl) {
          return data.databaseUrl;
        }
      }
    } catch (e) {
      console.error("Failed to parse prisma+postgres URL, fallback to original:", e);
    }
  }

  return urlStr;
}

const pool = new pg.Pool({ connectionString: getDirectConnectionString() });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, 'media', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function saveBase64Image(base64Str) {
  if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image')) {
    return base64Str;
  }

  try {
    const matches = base64Str.match(/^data:image\/([A-Za-z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');
    
    const hash = crypto.createHash('md5').update(dataBuffer).digest('hex');
    const filename = `${Date.now()}-${hash}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, dataBuffer);
    
    return `/media/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to save base64 image:', err);
    return base64Str;
  }
}

app.use(express.json({ limit: '10mb' })); // Support larger base64 uploads
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media')));

// Middlewares
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, username, role, district }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid session. Please log in again." });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
    }
    next();
  };
};

// --- AUTHENTICATION ENDPOINTS ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role, district, authKey } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const targetRole = (role === 'civil' || role === 'citizen') ? 'citizen' : 'municipal';

  if (targetRole === 'municipal') {
    if (authKey !== MUNICIPAL_AUTH_KEY) {
      return res.status(400).json({ error: "Invalid municipal authorization key." });
    }
    if (!district) {
      return res.status(400).json({ error: "Municipal officers must specify a district." });
    }
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: 'insensitive' } },
          { email: { equals: email, mode: 'insensitive' } }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username or email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: targetRole,
        district: targetRole === 'municipal' ? district.toUpperCase() : null,
        authKey: targetRole === 'municipal' ? authKey : null
      }
    });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, district: user.district },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role, district: user.district }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error during registration." });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: "Email/username and password are required." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: emailOrUsername, mode: 'insensitive' } },
          { email: { equals: emailOrUsername, mode: 'insensitive' } }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isAuthKeyValid = user.authKey === password;

    if (!isPasswordValid && !isAuthKeyValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, district: user.district },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role, district: user.district }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

// Get profile
app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({
    id: req.user.userId,
    username: req.user.username,
    role: req.user.role,
    district: req.user.district,
    avatar: '/images/avatar.png'
  });
});

app.get('/api/user', requireAuth, async (req, res) => {
  res.json({
    id: req.user.userId,
    username: req.user.username,
    role: req.user.role,
    district: req.user.district,
    avatar: '/images/avatar.png'
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

app.post('/api/user/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

// --- REPORT ENDPOINTS ---

// Get all reports with filters
app.get('/api/issues', requireAuth, async (req, res) => {
  const { subLocation, myIssues, search, followedOnly, userId } = req.query;
  const filter = {};

  if (subLocation) {
    filter.subLocation = {
      equals: subLocation.toUpperCase(),
    };
  }

  if (myIssues === 'true') {
    filter.OR = [
      { authorId: req.user.userId },
      { followers: { some: { userId: req.user.userId } } }
    ];
  }

  if (followedOnly === 'true') {
    filter.followers = {
      some: { userId: req.user.userId }
    };
  }

  if (userId) {
    filter.authorId = userId;
  }

  if (search) {
    const query = search.toLowerCase();
    filter.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { subLocation: { contains: query, mode: 'insensitive' } }
    ];
  }

  try {
    const reports = await prisma.report.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' }
        },
        timeline: {
          orderBy: { timestamp: 'asc' }
        },
        followers: true
      }
    });

    const isOfficer = req.user.role === 'municipal';

    const formattedReports = reports.map(issue => {
      const isAuthor = issue.authorId === req.user.userId;
      const authorName = (issue.isAnonymous && !isOfficer && !isAuthor) ? "Anonymous" : issue.author.username;

      return {
        id: issue.id,
        title: issue.title,
        location: issue.location,
        subLocation: issue.subLocation,
        description: issue.description,
        images: issue.images,
        imageType: issue.imageType,
        upvotes: issue.upvotes,
        downvotes: 0,
        followed: issue.followers.some(f => f.userId === req.user.userId),
        reported: false,
        comments: issue.comments.map(c => ({
          id: c.id,
          user: c.author.username,
          text: c.text,
          timestamp: c.createdAt.toISOString()
        })),
        createdAt: issue.createdAt.toISOString(),
        status: issue.status,
        internalNotes: issue.internalNotes,
        resolutionImages: issue.resolutionImages,
        resolutionNote: issue.resolutionNote || "",
        timeline: issue.timeline.map(t => ({
          status: t.status,
          timestamp: t.timestamp.toISOString()
        })),
        authorId: issue.authorId,
        authorName,
        isAnonymous: issue.isAnonymous,
        rejectionReason: issue.rejectionReason || "",
        rejectedAt: issue.rejectedAt ? issue.rejectedAt.toISOString() : "",
        appealMessage: issue.appealMessage || "",
        additionalImages: issue.additionalImages,
        appealedAt: issue.appealedAt ? issue.appealedAt.toISOString() : "",
        links: issue.links,
        coordinates: { lat: issue.latitude, lng: issue.longitude }
      };
    });

    res.json(formattedReports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports." });
  }
});

// Create report
app.post('/api/issues', requireAuth, requireRole('citizen'), async (req, res) => {
  const { title, description, location, subLocation, imageType, coordinates, images, links, isAnonymous } = req.body;
  if (!title || !location || !subLocation) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const latitude = coordinates ? parseFloat(coordinates.lat) : 30.7333;
  const longitude = coordinates ? parseFloat(coordinates.lng) : 76.7794;

  const savedImages = (images || []).map(img => saveBase64Image(img));

  try {
    const report = await prisma.$transaction(async (tx) => {
      const newReport = await tx.report.create({
        data: {
          title,
          description: description || "",
          location,
          subLocation: subLocation.toUpperCase(),
          latitude,
          longitude,
          imageType: imageType || "default",
          images: savedImages,
          links: links || [],
          upvotes: 1,
          status: "Review Queue",
          isAnonymous: !!isAnonymous,
          authorId: req.user.userId,
          timeline: {
            create: {
              status: "Review Queue"
            }
          }
        },
        include: {
          author: true,
          comments: {
            include: { author: true }
          },
          timeline: true,
          followers: true
        }
      });

      // User automatically upvotes and follows their own report
      await tx.reportUpvote.create({
        data: {
          userId: req.user.userId,
          reportId: newReport.id
        }
      });

      await tx.reportFollow.create({
        data: {
          userId: req.user.userId,
          reportId: newReport.id
        }
      });

      return newReport;
    });

    const isOfficer = req.user.role === 'municipal';
    const isAuthor = report.authorId === req.user.userId;
    const authorName = (report.isAnonymous && !isOfficer && !isAuthor) ? "Anonymous" : report.author.username;

    res.status(201).json({
      id: report.id,
      title: report.title,
      location: report.location,
      subLocation: report.subLocation,
      description: report.description,
      images: report.images,
      imageType: report.imageType,
      upvotes: report.upvotes,
      downvotes: 0,
      followed: true,
      reported: false,
      comments: [],
      createdAt: report.createdAt.toISOString(),
      status: report.status,
      internalNotes: report.internalNotes,
      resolutionImages: report.resolutionImages,
      resolutionNote: report.resolutionNote || "",
      timeline: [{ status: "Review Queue", timestamp: report.createdAt.toISOString() }],
      authorId: report.authorId,
      authorName,
      isAnonymous: report.isAnonymous,
      rejectionReason: "",
      rejectedAt: "",
      appealMessage: "",
      additionalImages: [],
      appealedAt: "",
      links: report.links,
      coordinates: { lat: report.latitude, lng: report.longitude }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create report." });
  }
});

// Retrieve specific report details
app.get('/api/issues/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const issue = await prisma.report.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' }
        },
        timeline: {
          orderBy: { timestamp: 'asc' }
        },
        followers: true
      }
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const isOfficer = req.user.role === 'municipal';
    const isAuthor = issue.authorId === req.user.userId;
    const authorName = (issue.isAnonymous && !isOfficer && !isAuthor) ? "Anonymous" : issue.author.username;

    res.json({
      id: issue.id,
      title: issue.title,
      location: issue.location,
      subLocation: issue.subLocation,
      description: issue.description,
      images: issue.images,
      imageType: issue.imageType,
      upvotes: issue.upvotes,
      downvotes: 0,
      followed: issue.followers.some(f => f.userId === req.user.userId),
      reported: false,
      comments: issue.comments.map(c => ({
        id: c.id,
        user: c.author.username,
        text: c.text,
        timestamp: c.createdAt.toISOString()
      })),
      createdAt: issue.createdAt.toISOString(),
      status: issue.status,
      internalNotes: issue.internalNotes,
      resolutionImages: issue.resolutionImages,
      resolutionNote: issue.resolutionNote || "",
      timeline: issue.timeline.map(t => ({
        status: t.status,
        timestamp: t.timestamp.toISOString()
      })),
      authorId: issue.authorId,
      authorName,
      isAnonymous: issue.isAnonymous,
      rejectionReason: issue.rejectionReason || "",
      rejectedAt: issue.rejectedAt ? issue.rejectedAt.toISOString() : "",
      appealMessage: issue.appealMessage || "",
      additionalImages: issue.additionalImages,
      appealedAt: issue.appealedAt ? issue.appealedAt.toISOString() : "",
      links: issue.links,
      coordinates: { lat: issue.latitude, lng: issue.longitude }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve report details." });
  }
});

// Vote (upvote only)
app.post('/api/issues/:id/vote', requireAuth, requireRole('citizen'), async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    const existingUpvote = await prisma.reportUpvote.findUnique({
      where: {
        userId_reportId: {
          userId: req.user.userId,
          reportId: id
        }
      }
    });

    if (existingUpvote) {
      return res.status(400).json({ error: "You have already upvoted this report." });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.reportUpvote.create({
        data: {
          userId: req.user.userId,
          reportId: id
        }
      });

      return tx.report.update({
        where: { id },
        data: {
          upvotes: { increment: 1 }
        }
      });
    });

    res.json({ upvotes: updated.upvotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit upvote." });
  }
});

// Toggle follow
app.post('/api/issues/:id/follow', requireAuth, requireRole('citizen'), async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const existingFollow = await prisma.reportFollow.findUnique({
      where: {
        userId_reportId: {
          userId: req.user.userId,
          reportId: id
        }
      }
    });

    let followed = false;
    if (existingFollow) {
      await prisma.reportFollow.delete({
        where: {
          userId_reportId: {
            userId: req.user.userId,
            reportId: id
          }
        }
      });
      followed = false;
    } else {
      await prisma.reportFollow.create({
        data: {
          userId: req.user.userId,
          reportId: id
        }
      });
      followed = true;
    }

    res.json({ followed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle follow state." });
  }
});

// Update status (Municipality Triage)
app.patch('/api/issues/:id/status', requireAuth, requireRole('municipal'), async (req, res) => {
  const id = parseInt(req.params.id);
  const { status, resolutionImages, resolutionNote, rejectionReason, rejectReason } = req.body;

  const validStatuses = ["Review Queue", "Acknowledged", "In Progress", "Resolved", "Rejected", "Pending Review"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const updateData = { status };

  if (status === "Resolved") {
    if (!resolutionImages || resolutionImages.length === 0) {
      return res.status(400).json({ error: "Resolution image is required" });
    }
    if (!resolutionNote || resolutionNote.trim() === "") {
      return res.status(400).json({ error: "Resolution note is required" });
    }
    updateData.resolutionImages = (resolutionImages || []).map(img => saveBase64Image(img));
    updateData.resolutionNote = resolutionNote;
  }

  if (status === "Rejected") {
    const actualRejectionReason = rejectionReason || rejectReason;
    if (!actualRejectionReason || actualRejectionReason.trim() === "") {
      return res.status(400).json({ error: "Rejection reason is required" });
    }
    updateData.rejectionReason = actualRejectionReason;
    updateData.rejectedAt = new Date();
  }

  try {
    const report = await prisma.report.update({
      where: { id },
      data: {
        ...updateData,
        timeline: {
          create: {
            status
          }
        }
      },
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' }
        },
        timeline: {
          orderBy: { timestamp: 'asc' }
        },
        followers: true
      }
    });

    // Notify followers
    const message = `Report "${report.title}" status updated to ${status}.`;
    for (const f of report.followers) {
      await prisma.notification.create({
        data: {
          userId: f.userId,
          reportId: report.id,
          message,
          status
        }
      });
    }

    const isOfficer = req.user.role === 'municipal';
    const isAuthor = report.authorId === req.user.userId;
    const authorName = (report.isAnonymous && !isOfficer && !isAuthor) ? "Anonymous" : report.author.username;

    res.json({
      id: report.id,
      title: report.title,
      location: report.location,
      subLocation: report.subLocation,
      description: report.description,
      images: report.images,
      imageType: report.imageType,
      upvotes: report.upvotes,
      downvotes: 0,
      followed: report.followers.some(f => f.userId === req.user.userId),
      reported: false,
      comments: report.comments.map(c => ({
        id: c.id,
        user: c.author.username,
        text: c.text,
        timestamp: c.createdAt.toISOString()
      })),
      createdAt: report.createdAt.toISOString(),
      status: report.status,
      internalNotes: report.internalNotes,
      resolutionImages: report.resolutionImages,
      resolutionNote: report.resolutionNote || "",
      timeline: report.timeline.map(t => ({
        status: t.status,
        timestamp: t.timestamp.toISOString()
      })),
      authorId: report.authorId,
      authorName,
      isAnonymous: report.isAnonymous,
      rejectionReason: report.rejectionReason || "",
      rejectedAt: report.rejectedAt ? report.rejectedAt.toISOString() : "",
      appealMessage: report.appealMessage || "",
      additionalImages: report.additionalImages,
      appealedAt: report.appealedAt ? report.appealedAt.toISOString() : "",
      links: report.links,
      coordinates: { lat: report.latitude, lng: report.longitude }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update report status." });
  }
});

// Appeal rejected report
app.post('/api/issues/:id/appeal', requireAuth, requireRole('citizen'), async (req, res) => {
  const id = parseInt(req.params.id);
  const { appealMessage, additionalImages } = req.body;

  try {
    const issue = await prisma.report.findUnique({ where: { id } });
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    if (issue.status !== "Rejected") {
      return res.status(400).json({ error: "Only rejected reports can be appealed" });
    }

    if (!additionalImages || additionalImages.length === 0) {
      return res.status(400).json({ error: "At least one additional photo is required" });
    }

    const savedAppealImages = (additionalImages || []).map(img => saveBase64Image(img));

    let finalMessage = appealMessage || "";
    if (issue.appealMessage) {
      finalMessage = issue.appealMessage + "\n\n" + finalMessage;
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        status: "Pending Review",
        appealMessage: finalMessage,
        additionalImages: [...(issue.additionalImages || []), ...savedAppealImages],
        appealedAt: new Date(),
        timeline: {
          create: {
            status: "Pending Review"
          }
        }
      },
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' }
        },
        timeline: {
          orderBy: { timestamp: 'asc' }
        },
        followers: true
      }
    });

    // Notify followers of appeal status change
    const message = `Appeal submitted for report "${report.title}". Status is now Pending Review.`;
    for (const f of report.followers) {
      await prisma.notification.create({
        data: {
          userId: f.userId,
          reportId: report.id,
          message,
          status: "Pending Review"
        }
      });
    }

    const isOfficer = req.user.role === 'municipal';
    const isAuthor = report.authorId === req.user.userId;
    const authorName = (report.isAnonymous && !isOfficer && !isAuthor) ? "Anonymous" : report.author.username;

    res.json({
      id: report.id,
      title: report.title,
      location: report.location,
      subLocation: report.subLocation,
      description: report.description,
      images: report.images,
      imageType: report.imageType,
      upvotes: report.upvotes,
      downvotes: 0,
      followed: report.followers.some(f => f.userId === req.user.userId),
      reported: false,
      comments: report.comments.map(c => ({
        id: c.id,
        user: c.author.username,
        text: c.text,
        timestamp: c.createdAt.toISOString()
      })),
      createdAt: report.createdAt.toISOString(),
      status: report.status,
      internalNotes: report.internalNotes,
      resolutionImages: report.resolutionImages,
      resolutionNote: report.resolutionNote || "",
      timeline: report.timeline.map(t => ({
        status: t.status,
        timestamp: t.timestamp.toISOString()
      })),
      authorId: report.authorId,
      authorName,
      isAnonymous: report.isAnonymous,
      rejectionReason: report.rejectionReason || "",
      rejectedAt: report.rejectedAt ? report.rejectedAt.toISOString() : "",
      appealMessage: report.appealMessage || "",
      additionalImages: report.additionalImages,
      appealedAt: report.appealedAt ? report.appealedAt.toISOString() : "",
      links: report.links,
      coordinates: { lat: report.latitude, lng: report.longitude }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit appeal." });
  }
});

// Update internal notes
app.patch('/api/issues/:id/notes', requireAuth, requireRole('municipal'), async (req, res) => {
  const id = parseInt(req.params.id);
  const { internalNotes } = req.body;

  try {
    await prisma.report.update({
      where: { id },
      data: {
        internalNotes: internalNotes || ""
      }
    });

    res.json({ success: true, internalNotes: internalNotes || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update internal notes." });
  }
});

// Add comment
app.post('/api/issues/:id/comments', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        reportId: id,
        authorId: req.user.userId,
        text
      },
      include: {
        author: true
      }
    });

    res.status(201).json({
      id: comment.id,
      user: comment.author.username,
      text: comment.text,
      timestamp: "Just now"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit comment." });
  }
});

// --- NOTICES ENDPOINTS ---

// Get all notices
app.get('/api/notices', requireAuth, async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedNotices = notices.map(n => ({
      id: n.id,
      title: n.title,
      description: n.description,
      location: n.location,
      subLocation: n.subLocation,
      type: n.type,
      createdAt: n.createdAt.toISOString(),
      expiryDate: n.expiryDate ? n.expiryDate.toISOString().split('T')[0] : null
    }));

    res.json(formattedNotices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notices." });
  }
});

// Create notice
app.post('/api/notices', requireAuth, requireRole('municipal'), async (req, res) => {
  const { title, description, subLocation, type, expiryDate } = req.body;
  if (!title || !description || !subLocation || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        title,
        description,
        location: "Punjab",
        subLocation: subLocation.toUpperCase(),
        type,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        authorId: req.user.userId
      }
    });

    res.status(201).json({
      id: notice.id,
      title: notice.title,
      description: notice.description,
      location: notice.location,
      subLocation: notice.subLocation,
      type: notice.type,
      createdAt: notice.createdAt.toISOString(),
      expiryDate: notice.expiryDate ? notice.expiryDate.toISOString().split('T')[0] : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create notice." });
  }
});

// --- NOTIFICATIONS ENDPOINTS ---

// Get notifications
app.get('/api/notifications', requireAuth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.notification.update({
      where: { id },
      data: { read: true }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notification." });
  }
});

// Dismiss all notifications
app.post('/api/notifications/clear', requireAuth, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, read: false },
      data: { read: true }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear notifications." });
  }
});

// Serve frontend routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`C.L.E.A.R. Server running on port ${PORT}`);
});
