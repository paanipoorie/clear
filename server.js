const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' })); // support larger base64 uploads
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database
let issues = [
  {
    id: 1,
    title: "Illegal dumping behind residential area",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    description: "Piles of trash bags and plastic debris accumulating behind the residential block, causing odor and attracting stray animals.",
    imageType: "dumping",
    upvotes: 42,
    downvotes: 3,
    followed: false,
    reported: false,
    comments: [
      { id: 1, user: "Karan", text: "This has been building up for two weeks. Needs immediate collection.", timestamp: "2 hours ago" },
      { id: 2, user: "Simran", text: "Contacted local council last Tuesday but no action taken yet.", timestamp: "1 hour ago" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "Acknowledged",
    verifications: 15,
    internalNotes: "Assigned to the Sector 4 cleanliness squad. Cleanup scheduled for Friday morning.",
    resolutionImages: [],
    resolutionNote: "",
    timeline: [
      { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() }
    ]
  },
  {
    id: 2,
    title: "open waste burning causing the smoke",
    location: "Punjab",
    subLocation: "LUDHIANA",
    description: "Dry leaves and plastic waste being burned in the open field opposite the public school, causing severe smoke and breathing difficulties.",
    imageType: "burning",
    upvotes: 28,
    downvotes: 1,
    followed: false,
    reported: false,
    comments: [
      { id: 1, user: "Amrit", text: "This happens every evening around 5 PM. It's a major health hazard.", timestamp: "3 hours ago" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    status: "Review Queue",
    verifications: 8,
    internalNotes: "",
    resolutionImages: [],
    resolutionNote: "",
    timeline: [
      { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() }
    ]
  },
  {
    id: 3,
    title: "Unclogged drain overflowing onto main road",
    location: "Punjab",
    subLocation: "PATIALA",
    description: "Monsoon clogging in the sewer drainage system leading to wastewater overflowing onto the public street, creating a traffic bottleneck and hygiene issue.",
    imageType: "water",
    upvotes: 15,
    downvotes: 0,
    followed: false,
    reported: false,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    status: "In Progress",
    verifications: 3,
    internalNotes: "Contracted plumbing team dispatched to clear blockages.",
    resolutionImages: [],
    resolutionNote: "",
    timeline: [
      { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
      { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
      { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
    ]
  },
  {
    id: 4,
    title: "Hazardous chemical leakage in industrial park",
    location: "Punjab",
    subLocation: "LUDHIANA",
    description: "Chemical containers leaking near the storm drain in sector 4. Corrosive fluid pooling on the ground.",
    imageType: "default",
    upvotes: 65,
    downvotes: 2,
    followed: true,
    reported: false,
    comments: [
      { id: 1, user: "Rajesh", text: "Reported this to safety officer yesterday.", timestamp: "1 day ago" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "Resolved",
    verifications: 28,
    internalNotes: "Hazardous response team dispatched. Sealed leak and neutralised soil.",
    resolutionImages: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"], // mockup image
    resolutionNote: "Our chemical containment team successfully sealed the containers and cleaned up the spill using absorbent sand. The storm drain was verified clean.",
    timeline: [
      { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
      { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString() },
      { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString() },
      { status: "Resolved", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
    ]
  }
];

let notices = [
  {
    id: 1,
    title: "Air Quality Advisory - PM2.5 Alert",
    description: "Due to seasonal stubble burning and low wind speeds, air quality in Ludhiana has dropped to 'Poor'. Senior citizens and children are advised to limit outdoor exposure.",
    location: "Punjab",
    subLocation: "LUDHIANA",
    type: "Warning",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0] // 7 days from now
  },
  {
    id: 2,
    title: "Cleanliness Drive: Sector 32",
    description: "The Municipal Corporation is organizing a community waste cleaning and sorting drive this Sunday. Cleanup tools and refreshments will be provided.",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    type: "Drive / Campaign",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0] // 2 days from now
  }
];

let currentUser = {
  username: "user",
  avatar: "/images/avatar.png"
};

// Simulated Notification store
let notifications = [];

// API Routes

// Get all issues with filters (subLocation, myIssues, search, followedOnly)
app.get('/api/issues', (req, res) => {
  const { subLocation, myIssues, search, followedOnly } = req.query;
  let filteredIssues = [...issues];

  if (subLocation) {
    filteredIssues = filteredIssues.filter(issue => 
      issue.subLocation.toUpperCase() === subLocation.toUpperCase()
    );
  }

  if (myIssues === 'true') {
    filteredIssues = filteredIssues.filter(issue => issue.id === 1 || issue.followed);
  }

  if (followedOnly === 'true') {
    filteredIssues = filteredIssues.filter(issue => issue.followed);
  }

  if (search) {
    const query = search.toLowerCase();
    filteredIssues = filteredIssues.filter(issue => 
      issue.title.toLowerCase().includes(query) || 
      issue.description.toLowerCase().includes(query) ||
      issue.subLocation.toLowerCase().includes(query)
    );
  }

  // Sort by newest
  filteredIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(filteredIssues);
});

// Create a new issue
app.post('/api/issues', (req, res) => {
  const { title, description, location, subLocation, imageType, coordinates, images, links } = req.body;
  if (!title || !location || !subLocation) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newIssue = {
    id: issues.length + 1,
    title,
    description: description || "",
    location,
    subLocation: subLocation.toUpperCase(),
    imageType: imageType || "default",
    coordinates: coordinates || null,
    images: images || [],
    links: links || [],
    upvotes: 1,
    downvotes: 0,
    followed: false,
    reported: false,
    comments: [],
    createdAt: new Date().toISOString(),
    status: "Review Queue",
    verifications: 0,
    internalNotes: "",
    resolutionImages: [],
    resolutionNote: "",
    timeline: [
      { status: "Review Queue", timestamp: new Date().toISOString() }
    ]
  };

  issues.push(newIssue);
  res.status(201).json(newIssue);
});

// Vote (upvote / downvote)
app.post('/api/issues/:id/vote', (req, res) => {
  const id = parseInt(req.params.id);
  const { direction } = req.body; // 'up' or 'down'

  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (direction === 'up') {
    issue.upvotes += 1;
  } else if (direction === 'down') {
    issue.downvotes += 1;
  }

  res.json({ upvotes: issue.upvotes, downvotes: issue.downvotes });
});

// Toggle Verification
app.post('/api/issues/:id/verify', (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (!issue.verifiedByCurrentUser) {
    issue.verifications += 1;
    issue.verifiedByCurrentUser = true;
  } else {
    issue.verifications = Math.max(0, issue.verifications - 1);
    issue.verifiedByCurrentUser = false;
  }

  res.json({ verifications: issue.verifications, verified: issue.verifiedByCurrentUser });
});

// Toggle Follow Post
app.post('/api/issues/:id/follow', (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  issue.followed = !issue.followed;
  res.json({ followed: issue.followed });
});

// Report Post
app.post('/api/issues/:id/report', (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  issue.reported = true;
  res.json({ reported: issue.reported });
});

// Update Status (Municipality Triage)
app.patch('/api/issues/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status, resolutionImages, resolutionNote, rejectReason } = req.body;
  
  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  const validStatuses = ["Review Queue", "Acknowledged", "In Progress", "Resolved", "Rejected"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  if (status === "Resolved") {
    if (!resolutionImages || resolutionImages.length === 0) {
      return res.status(400).json({ error: "Resolution image is required" });
    }
    if (!resolutionNote || resolutionNote.trim() === "") {
      return res.status(400).json({ error: "Resolution note is required" });
    }
    issue.resolutionImages = resolutionImages;
    issue.resolutionNote = resolutionNote;
  }

  if (status === "Rejected") {
    issue.rejectReason = rejectReason || "Rejected by Municipal Review Officer";
  }

  if (status) {
    issue.status = status;
    issue.timeline.push({
      status,
      timestamp: new Date().toISOString()
    });

    // Notify followers
    if (issue.followed) {
      notifications.push({
        issueId: issue.id,
        issueTitle: issue.title,
        status: status,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }

  res.json(issue);
});

// Save Internal notes
app.patch('/api/issues/:id/notes', (req, res) => {
  const id = parseInt(req.params.id);
  const { internalNotes } = req.body;

  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  issue.internalNotes = internalNotes || "";
  res.json({ success: true, internalNotes: issue.internalNotes });
});

// Add Comment
app.post('/api/issues/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const issue = issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  const newComment = {
    id: issue.comments.length + 1,
    user: currentUser.username,
    text,
    timestamp: "Just now"
  };

  issue.comments.push(newComment);
  res.status(201).json(newComment);
});

// Get Current User Profile
app.get('/api/user', (req, res) => {
  res.json(currentUser);
});

// Simulate Logout
app.post('/api/user/logout', (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Notices Endpoints
app.get('/api/notices', (req, res) => {
  // Sort notices by newest
  const sortedNotices = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedNotices);
});

app.post('/api/notices', (req, res) => {
  const { title, description, subLocation, type, expiryDate } = req.body;
  if (!title || !description || !subLocation || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newNotice = {
    id: notices.length + 1,
    title,
    description,
    location: "Punjab",
    subLocation: subLocation.toUpperCase(),
    type,
    createdAt: new Date().toISOString(),
    expiryDate: expiryDate || null
  };

  notices.push(newNotice);
  res.status(201).json(newNotice);
});

// Fallback to serving index.html for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`C.L.E.AR. Server running on port ${PORT}`);
});
