const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
  }
];

let currentUser = {
  username: "user",
  avatar: "/images/avatar.png"
};

// API Routes

// Get all issues with filters (subLocation, myIssues, search)
app.get('/api/issues', (req, res) => {
  const { subLocation, myIssues, search } = req.query;
  let filteredIssues = [...issues];

  if (subLocation) {
    filteredIssues = filteredIssues.filter(issue => 
      issue.subLocation.toUpperCase() === subLocation.toUpperCase()
    );
  }

  if (myIssues === 'true') {
    // In our simplified system, we simulate that the user created Issue 1 and Issue 3
    // Or we filter by issues where the user has followed or created. Let's filter by issues created by user.
    // Let's assume issues with id: 1 and 3 are created by 'user' (the current user) or followed by the user.
    // Let's make it issues created/followed by user for representation.
    filteredIssues = filteredIssues.filter(issue => issue.id === 1 || issue.followed);
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
    createdAt: new Date().toISOString()
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

// Fallback to serving index.html for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`C.L.E.AR. Server running on port ${PORT}`);
});
