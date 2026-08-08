// Workspace configuration completely removed.

// Mock Backend & History No-Op for local file:// protocol
if (window.location.protocol === 'file:') {
  window.history.pushState = function() {};
  window.history.replaceState = function() {};

  window.fetch = async function(url, options = {}) {
    const urlObj = new URL(url, 'http://localhost');
    const path = urlObj.pathname;
    const method = (options.method || 'GET').toUpperCase();
    const query = Object.fromEntries(urlObj.searchParams.entries());
    let body = null;
    if (options.body) {
      try {
        body = JSON.parse(options.body);
      } catch (e) {
        body = options.body;
      }
    }

    const getIssues = () => {
      let data = localStorage.getItem('clear_issues');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.some(issue => issue.title === "Illegal dumping behind residential area" || parsed.length !== 9)) {
            localStorage.removeItem('clear_issues');
            data = null;
          }
        } catch (e) {
          localStorage.removeItem('clear_issues');
          data = null;
        }
      }
      if (!data) {
        const defaults = [
          {
            id: 1,
            title: "Hazardous chemical leakage in Industrial Phase 9",
            location: "Punjab",
            subLocation: "SAS NAGAR",
            description: "Chemical containers leaking near the storm drain in Sector 66 industrial park. Corrosive fluid pooling on the ground.",
            images: ["/media/issues/chemicalwasteleakage.jpg"],
            imageType: "default",
            upvotes: 34,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [
              { id: 1, user: "Abhyudaya", text: "I passed by Phase 9 yesterday. The chemical smell was very strong. Glad it's resolved.", timestamp: "8 hours ago" },
              { id: 2, user: "Naman", text: "Thanks to the municipal officer for the quick cleanup!", timestamp: "6 hours ago" }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            status: "Resolved",
            internalNotes: "Hazardous response team dispatched. Sealed leak and neutralised soil.",
            resolutionImages: ["/media/issues/chemicalwasteleakage.jpg"],
            resolutionNote: "Our chemical containment team successfully sealed the containers and cleaned up the spill using absorbent sand. The storm drain was verified clean.",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
              { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
              { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
              { status: "Resolved", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() }
            ],
            authorId: "user1",
            authorName: "Nishant",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.6850, lng: 76.7280 }
          },
          {
            id: 2,
            title: "Construction debris dumped on protected wetlands",
            location: "Punjab",
            subLocation: "SAS NAGAR",
            description: "Tons of brick, concrete, and metal debris dumped overnight near the wetlands. Appears to be from a commercial site.",
            images: ["/media/issues/constdebrisatprotectedland.jpg"],
            imageType: "default",
            upvotes: 12,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
            status: "In Progress",
            internalNotes: "Wetland conservation team notified. Cleanup contractor assigned.",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
              { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
              { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
            ],
            authorId: "user2",
            authorName: "Abhyudaya",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.6750, lng: 76.7150 }
          },
          {
            id: 3,
            title: "Dead fish floating due to water contamination",
            location: "Punjab",
            subLocation: "LUDHIANA",
            description: "Large numbers of dead fish spotted floating in the lake. Highly likely due to illegal chemical discharge from upstream factories.",
            images: ["/media/issues/deadfishwatercontamination.jpg"],
            imageType: "default",
            upvotes: 45,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [
              { id: 1, user: "Nishant", text: "This is a serious environmental threat. Upstream industrial outlets must be audited.", timestamp: "3 hours ago" }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
            status: "Review Queue",
            internalNotes: "",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
            ],
            authorId: "user3",
            authorName: "Naman",
            isAnonymous: true,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.9020, lng: 75.8530 }
          },
          {
            id: 4,
            title: "Toxic foam accumulation in the local canal",
            location: "Punjab",
            subLocation: "LUDHIANA",
            description: "Thick white foam covering the canal surface near the residential bridge. Strong chemical odor is spreading.",
            images: ["/media/issues/foamcanal.jpg"],
            imageType: "default",
            upvotes: 27,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
            status: "Acknowledged",
            internalNotes: "Env inspection team has taken water samples for lab testing.",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
              { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
            ],
            authorId: "user4",
            authorName: "Aashmi",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.8950, lng: 75.8620 }
          },
          {
            id: 5,
            title: "Illegal garbage dumping behind residential sector",
            location: "Punjab",
            subLocation: "SAS NAGAR",
            description: "Massive pile of domestic waste and plastic packages dumped next to the park entrance. Attracting stray dogs and flies.",
            images: ["/media/issues/garbagedumping.jpg"],
            imageType: "default",
            upvotes: 18,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [
              { id: 1, user: "Aashmi", text: "Finally, this eyesore has been cleared! Hopefully, people stop dumping here.", timestamp: "2 hours ago" }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            status: "Resolved",
            internalNotes: "Municipal cleanup crew dispatched. Removed garbage and cleaned area.",
            resolutionImages: ["/media/issues/garbagedumping.jpg"],
            resolutionNote: "The sanitation team cleared the entire garbage pile and disinfected the area. Surveillance cameras will be installed to prevent future dumping.",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
              { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
              { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
              { status: "Resolved", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() }
            ],
            authorId: "user1",
            authorName: "Nishant",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.6900, lng: 76.7320 }
          },
          {
            id: 6,
            title: "Oil spill spreading in the drainage canal",
            location: "Punjab",
            subLocation: "PATIALA",
            description: "Black oil sheen observed covering the water surface in the storm drain. Urgently needs containment before it reaches the main river.",
            images: ["/media/issues/oilspilldrainagecanal.jpg"],
            imageType: "default",
            upvotes: 8,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            status: "Review Queue",
            internalNotes: "",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
            ],
            authorId: "user2",
            authorName: "Abhyudaya",
            isAnonymous: true,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.3420, lng: 76.3880 }
          },
          {
            id: 7,
            title: "Open waste burning causing severe smoke and smog",
            location: "Punjab",
            subLocation: "SAS NAGAR",
            description: "Dry leaves, plastic bags, and industrial waste being burned in an open field opposite the public school.",
            images: ["/media/issues/openwasteburning.jpg"],
            imageType: "default",
            upvotes: 15,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
            status: "Acknowledged",
            internalNotes: "Security patrol dispatched to identify the offenders.",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
              { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
            ],
            authorId: "user3",
            authorName: "Naman",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.6720, lng: 76.7260 }
          },
          {
            id: 8,
            title: "Blocked storm drain overflowing onto street",
            location: "Punjab",
            subLocation: "PATIALA",
            description: "Severe blockages in the sewer drainage system causing wastewater to overflow onto the public street, causing traffic bottlenecks.",
            images: ["/media/issues/overflowingdrain.jpg"],
            imageType: "default",
            upvotes: 22,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
            status: "In Progress",
            internalNotes: "Plumbing team dispatched with suction machine to clear blockage.",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
              { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
              { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
            ],
            authorId: "user4",
            authorName: "Aashmi",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.3350, lng: 76.3820 }
          },
          {
            id: 9,
            title: "Unauthorized cutting of mature trees",
            location: "Punjab",
            subLocation: "SAS NAGAR",
            description: "Several healthy mature trees are being cut down along the boundary wall of Phase 7 without any municipal permit or notice.",
            images: ["/media/issues/treecutwithoutauth.jpg"],
            imageType: "default",
            upvotes: 29,
            downvotes: 0,
            followed: true,
            reported: false,
            comments: [],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            status: "Review Queue",
            internalNotes: "",
            resolutionImages: [],
            resolutionNote: "",
            timeline: [
              { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
            ],
            authorId: "user1",
            authorName: "Nishant",
            isAnonymous: false,
            rejectionReason: "",
            rejectedAt: "",
            appealMessage: "",
            additionalImages: [],
            appealedAt: "",
            links: [],
            coordinates: { lat: 30.6800, lng: 76.7200 }
          }
        ];
        localStorage.setItem('clear_issues', JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(data);
    };

    const setIssues = (issues) => {
      localStorage.setItem('clear_issues', JSON.stringify(issues));
    };

    const getNotices = () => {
      let data = localStorage.getItem('clear_notices');
      if (!data) {
        const defaults = [
          {
            id: 1,
            title: "Air Quality Advisory - PM2.5 Alert",
            description: "Due to seasonal stubble burning and low wind speeds, air quality in Ludhiana has dropped to 'Poor'. Senior citizens and children are advised to limit outdoor exposure.",
            location: "Punjab",
            subLocation: "LUDHIANA",
            type: "Warning",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0]
          },
          {
            id: 2,
            title: "Cleanliness Drive: Sector 32",
            description: "The Municipal Corporation is organizing a community waste cleaning and sorting drive this Sunday. Cleanup tools and refreshments will be provided.",
            location: "Punjab",
            subLocation: "SAS NAGAR",
            type: "Drive / Campaign",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0]
          }
        ];
        localStorage.setItem('clear_notices', JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(data);
    };

    const setNotices = (notices) => {
      localStorage.setItem('clear_notices', JSON.stringify(notices));
    };

    const getUser = () => {
      const storedUsername = localStorage.getItem('clear_username');
      if (storedUsername) {
        const users = JSON.parse(localStorage.getItem('clear_users') || '[]');
        const found = users.find(u => u.username.toLowerCase() === storedUsername.toLowerCase());
        if (found) {
          return {
            id: found.id || found.username,
            username: found.username,
            role: (found.role === 'civil' || found.role === 'citizen') ? 'citizen' : 'municipal',
            district: found.district || 'LUDHIANA'
          };
        }
      }
      return { id: 'user', username: 'user', role: 'citizen' };
    };

    let responseData = null;
    let status = 200;

    if (path.endsWith('/api/user')) {
      responseData = getUser();
    } else if (path.endsWith('/api/user/logout')) {
      responseData = { success: true, message: "Logged out successfully" };
    } else if (path.endsWith('/api/notices')) {
      if (method === 'POST') {
        const notices = getNotices();
        const newNotice = {
          id: notices.length + 1,
          title: body.title,
          description: body.description,
          location: "Punjab",
          subLocation: (body.subLocation || "LUDHIANA").toUpperCase(),
          type: body.type,
          createdAt: new Date().toISOString(),
          expiryDate: body.expiryDate || null
        };
        notices.push(newNotice);
        setNotices(notices);
        responseData = newNotice;
        status = 201;
      } else {
        const notices = getNotices();
        responseData = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else if (path.match(/\/api\/issues\/(\d+)\/follow$/)) {
      const match = path.match(/\/api\/issues\/(\d+)\/follow$/);
      const id = parseInt(match[1]);
      const issues = getIssues();
      const issue = issues.find(i => i.id === id);
      if (issue) {
        issue.followed = !issue.followed;
        setIssues(issues);
        responseData = issue;
      } else {
        status = 404;
        responseData = { error: "Issue not found" };
      }
    } else if (path.match(/\/api\/issues\/(\d+)\/vote$/)) {
      const match = path.match(/\/api\/issues\/(\d+)\/vote$/);
      const id = parseInt(match[1]);
      const { type } = body || { type: 'up' };
      const issues = getIssues();
      const issue = issues.find(i => i.id === id);
      if (issue) {
        if (type === 'up') {
          issue.upvotes = (issue.upvotes || 0) + 1;
        } else if (type === 'down') {
          issue.downvotes = (issue.downvotes || 0) + 1;
        }
        setIssues(issues);
        responseData = issue;
      } else {
        status = 404;
        responseData = { error: "Issue not found" };
      }
    } else if (path.match(/\/api\/issues\/(\d+)\/status$/)) {
      const match = path.match(/\/api\/issues\/(\d+)\/status$/);
      const id = parseInt(match[1]);
      const { status: newStatus, rejectionReason, resolutionNote, resolutionImages } = body;
      const issues = getIssues();
      const issue = issues.find(i => i.id === id);
      if (issue) {
        issue.status = newStatus;
        if (newStatus === 'Rejected') {
          issue.rejectionReason = rejectionReason || "";
          issue.rejectedAt = new Date().toISOString();
        } else if (newStatus === 'Resolved') {
          issue.resolutionNote = resolutionNote || "";
          issue.resolutionImages = resolutionImages || [];
        }
        issue.timeline = issue.timeline || [];
        issue.timeline.push({
          status: newStatus,
          timestamp: new Date().toISOString()
        });
        setIssues(issues);
        responseData = issue;
      } else {
        status = 404;
        responseData = { error: "Issue not found" };
      }
    } else if (path.match(/\/api\/issues\/(\d+)\/appeal$/)) {
      const match = path.match(/\/api\/issues\/(\d+)\/appeal$/);
      const id = parseInt(match[1]);
      const { appealMessage, additionalImages } = body;
      const issues = getIssues();
      const issue = issues.find(i => i.id === id);
      if (issue) {
        issue.status = "Pending Review";
        issue.appealMessage = issue.appealMessage ? (issue.appealMessage + "\n\n" + (appealMessage || "")) : (appealMessage || "");
        issue.additionalImages = [...(issue.additionalImages || []), ...(additionalImages || [])];
        issue.appealedAt = new Date().toISOString();
        issue.timeline = issue.timeline || [];
        issue.timeline.push({
          status: "Pending Review",
          timestamp: issue.appealedAt
        });
        setIssues(issues);
        responseData = issue;
      } else {
        status = 404;
        responseData = { error: "Issue not found" };
      }
    } else if (path.match(/\/api\/issues\/(\d+)\/comments$/)) {
      const match = path.match(/\/api\/issues\/(\d+)\/comments$/);
      const id = parseInt(match[1]);
      const { text } = body;
      const issues = getIssues();
      const issue = issues.find(i => i.id === id);
      if (issue) {
        const currentUser = getUser();
        const newComment = {
          id: (issue.comments || []).length + 1,
          user: currentUser.username,
          text,
          timestamp: "Just now"
        };
        issue.comments = issue.comments || [];
        issue.comments.push(newComment);
        setIssues(issues);
        responseData = newComment;
        status = 201;
      } else {
        status = 404;
        responseData = { error: "Issue not found" };
      }
    } else if (path.match(/\/api\/issues\/(\d+)\/notes$/)) {
      const match = path.match(/\/api\/issues\/(\d+)\/notes$/);
      const id = parseInt(match[1]);
      const { internalNotes } = body;
      const issues = getIssues();
      const issue = issues.find(i => i.id === id);
      if (issue) {
        issue.internalNotes = internalNotes || "";
        setIssues(issues);
        responseData = { success: true, internalNotes: issue.internalNotes };
      } else {
        status = 404;
        responseData = { error: "Issue not found" };
      }
    } else if (path.endsWith('/api/issues')) {
      if (method === 'POST') {
        const issues = getIssues();
        const currentUser = getUser();
        const newIssue = {
          id: issues.length + 1,
          title: body.title,
          description: body.description,
          location: body.location || "Punjab",
          subLocation: (body.subLocation || "LUDHIANA").toUpperCase(),
          imageType: body.imageType || "default",
          images: body.images || [],
          upvotes: 0,
          downvotes: 0,
          followed: false,
          reported: false,
          comments: [],
          createdAt: new Date().toISOString(),
          status: "Review Queue",
          internalNotes: "",
          resolutionImages: [],
          resolutionNote: "",
          timeline: [
            { status: "Review Queue", timestamp: new Date().toISOString() }
          ],
          authorId: currentUser.id,
          authorName: currentUser.username
        };
        issues.push(newIssue);
        setIssues(issues);
        responseData = newIssue;
        status = 201;
      } else {
        let filteredIssues = getIssues();
        const { subLocation, myIssues, search, followedOnly, userId } = query;
        if (subLocation) {
          filteredIssues = filteredIssues.filter(issue => 
            issue.subLocation.toUpperCase() === subLocation.toUpperCase()
          );
        }
        if (myIssues === 'true') {
          if (userId) {
            filteredIssues = filteredIssues.filter(issue => issue.authorId === userId);
          } else {
            filteredIssues = filteredIssues.filter(issue => issue.id === 1 || issue.followed);
          }
        }
        if (followedOnly === 'true') {
          filteredIssues = filteredIssues.filter(issue => issue.followed);
        }
        if (search) {
          const q = search.toLowerCase();
          filteredIssues = filteredIssues.filter(issue => 
            issue.title.toLowerCase().includes(q) || 
            issue.description.toLowerCase().includes(q) ||
            issue.subLocation.toLowerCase().includes(q)
          );
        }
        responseData = filteredIssues;
      }
    }

    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => responseData,
      text: async () => JSON.stringify(responseData)
    };
  };
}

// Application State
const state = {
  activePortal: 'landing', // 'landing', 'public', 'municipality'
  currentSubLocation: '',
  showMyIssues: false,
  showFollowedOnly: false,
  showNoticesOnly: false,
  searchQuery: '',
  currentUser: {
    id: 'user',
    username: 'user',
    role: 'Resident Reporter'
  },
  activeOpsTab: 'triage', // 'triage', 'notices'
  selectedIssueForOps: null
};

let MOCK_MUNICIPALITY_DISTRICT = 'LUDHIANA';
const MOCK_MUNICIPALITY_STATE = 'Punjab';

// Map and attachments editor state
let mapInstance = null;
let mapMarker = null;
let selectedCoordinates = null;
let attachedImages = [];
let attachedLinks = [];
let appealImagesBase64 = [];

// Punjab districts center coordinates
const districtCoords = {
  'AMRITSAR': { lat: 31.6340, lng: 74.8723 },
  'BARNALA': { lat: 30.3797, lng: 75.5469 },
  'BATHINDA': { lat: 30.2110, lng: 74.9455 },
  'FARIDKOT': { lat: 30.6762, lng: 74.7583 },
  'FATEHGARH SAHIB': { lat: 30.6496, lng: 76.3869 },
  'FAZILKA': { lat: 30.4036, lng: 74.0322 },
  'FIROZPUR': { lat: 30.9256, lng: 74.6063 },
  'GURDASPUR': { lat: 32.0408, lng: 75.4053 },
  'HOSHIARPUR': { lat: 31.5143, lng: 75.9115 },
  'JALANDHAR': { lat: 31.3260, lng: 75.5762 },
  'KAPURTHALA': { lat: 31.3832, lng: 75.3833 },
  'LUDHIANA': { lat: 30.9010, lng: 75.8573 },
  'MALERKOTLA': { lat: 30.5250, lng: 75.8900 },
  'MANSA': { lat: 29.9881, lng: 75.3912 },
  'MOGA': { lat: 30.8170, lng: 75.1717 },
  'PATHANKOT': { lat: 32.2659, lng: 75.6461 },
  'PATIALA': { lat: 30.3398, lng: 76.3869 },
  'RUPNAGAR': { lat: 30.9753, lng: 76.5273 },
  'SAS NAGAR': { lat: 30.6970, lng: 76.6993 },
  'SANGRUR': { lat: 30.2450, lng: 75.8423 },
  'SBS NAGAR': { lat: 31.1256, lng: 76.1264 },
  'SRI MUKTSAR SAHIB': { lat: 30.4739, lng: 74.5142 },
  'TARN TARAN': { lat: 31.4522, lng: 74.9272 }
};

// DOM Elements
const mainAppLayout = document.getElementById('mainAppLayout');
const landingPortal = document.getElementById('landingPortal');
const feedContainer = document.getElementById('feed');
const feedTitle = document.getElementById('feedTitle');
const searchInput = document.getElementById('searchInput');
const exploreBtn = document.getElementById('exploreBtn');
const followingBtn = document.getElementById('followingBtn');
const noticesBtn = document.getElementById('noticesBtn');
const createIssueBtn = document.getElementById('createIssueBtn');
const createModal = document.getElementById('createModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const createIssueForm = document.getElementById('createIssueForm');
const locationBoxBtn = document.getElementById('locationBoxBtn');
const sublocationList = document.getElementById('sublocationList');
const sublocationButtons = document.querySelectorAll('.sublocation-btn');
const profileMenuTrigger = document.getElementById('profileMenuTrigger');
const profileDropdown = document.getElementById('profileDropdown');
const myIssuesBtn = document.getElementById('myIssuesBtn');
const logoutBtn = document.getElementById('logoutBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.querySelector('.sidebar');
const toastContainer = document.getElementById('toastContainer');

// Role Viewports
const citizenViewport = document.getElementById('citizenViewport');
const municipalTriageViewport = document.getElementById('municipalTriageViewport');
const municipalResolvedViewport = document.getElementById('municipalResolvedViewport');
const municipalNoticesViewport = document.getElementById('municipalNoticesViewport');

// Active ops tab selector helper
const opsTriageTabBtn = document.getElementById('opsTriageTabBtn');
const opsResolvedTabBtn = document.getElementById('opsResolvedTabBtn');
const opsNoticesTabBtn = document.getElementById('opsNoticesTabBtn');

// Init application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Authentication UX Helper Functions
function showAuthScreen(screenId) {
  const screens = ['authLandingScreen', 'authLoginScreen', 'authRegisterScreen'];
  
  // Find current active screen element
  let currentScreen = null;
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.classList.contains('active')) {
      currentScreen = el;
    }
  });

  const targetScreen = document.getElementById(screenId);
  if (!targetScreen) return;

  const authHeader = document.getElementById('authHeader');
  if (authHeader) {
    authHeader.style.display = 'none';
  }

  if (currentScreen && currentScreen.id !== screenId) {
    // Fade out current active screen
    currentScreen.style.opacity = '0';
    currentScreen.classList.remove('active');
    
    setTimeout(() => {
      currentScreen.style.display = 'none';
      
      // Prepare and display target screen (always flex to center cards)
      targetScreen.style.display = 'flex';
      // Trigger browser reflow
      targetScreen.offsetHeight;
      
      // Fade in target screen
      targetScreen.style.opacity = '1';
      targetScreen.classList.add('active');
    }, 200);
  } else {
    // Immediate display setup (e.g. initial load)
    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        el.classList.remove('active');
        el.style.opacity = '0';
      }
    });

    targetScreen.style.display = 'flex';
    targetScreen.offsetHeight;
    targetScreen.style.opacity = '1';
    targetScreen.classList.add('active');
  }
}

function getOrInitializeUsers() {
  let users = JSON.parse(localStorage.getItem('clear_users') || '[]');
  
  // Base default users including new requested mocks
  const defaultUsers = [
    { id: 'user1', username: 'Nishant', email: 'user1@clear.com', password: 'password', role: 'citizen' },
    { id: 'user2', username: 'Abhyudaya', email: 'user2@clear.com', password: 'password', role: 'citizen' },
    { id: 'user3', username: 'Naman', email: 'user3@clear.com', password: 'password', role: 'citizen' },
    { id: 'user4', username: 'Aashmi', email: 'user4@clear.com', password: 'password', role: 'citizen' },
    { id: 'municipal1', username: 'municipal1', email: 'municipal1@clear.gov', password: 'password', authKey: 'HX291Z', role: 'municipal', district: 'SAS NAGAR' },
    { id: 'municipal2', username: 'municipal2', email: 'municipal2@clear.gov', password: 'password', authKey: 'HX291A', role: 'municipal', district: 'LUDHIANA' }
  ];

  let modified = false;
  
  // Ensure all existing stored users have IDs
  users.forEach(u => {
    if (!u.id) {
      if (u.username === 'Nishant') u.id = 'user1';
      else if (u.username === 'Abhyudaya') u.id = 'user2';
      else u.id = 'user-' + u.username.toLowerCase().replace(/[^a-z0-9]/g, '-');
      modified = true;
    }
  });

  defaultUsers.forEach(du => {
    if (!users.some(u => u.username.toLowerCase() === du.username.toLowerCase() || (du.email && u.email && u.email.toLowerCase() === du.email.toLowerCase()))) {
      users.push(du);
      modified = true;
    }
  });

  if (modified || localStorage.getItem('clear_users') === null) {
    localStorage.setItem('clear_users', JSON.stringify(users));
  }
  return users;
}

function authenticateUser(emailOrUsername, password) {
  let users = getOrInitializeUsers();
  const user = users.find(u => 
    (u.username.toLowerCase() === emailOrUsername.toLowerCase() || (u.email && u.email.toLowerCase() === emailOrUsername.toLowerCase())) && 
    (u.password === password || u.authKey === password)
  );
  if (user) {
    user.role = (user.role === 'civil' || user.role === 'citizen') ? 'citizen' : 'municipal';
  }
  return user;
}

function registerNewUser(username, email, password, role = 'citizen', district = '') {
  let users = getOrInitializeUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Username already exists' };
  }
  if (users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }
  const targetRole = (role === 'civil' || role === 'citizen') ? 'citizen' : 'municipal';
  const id = 'user-' + username.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newUser = { id, username, email, password, role: targetRole, district };
  users.push(newUser);
  localStorage.setItem('clear_users', JSON.stringify(users));
  return { success: true, user: newUser };
}

function handleRouting() {
  const isAuthenticated = localStorage.getItem('clear_user_authenticated') === 'true';
  const path = window.location.pathname;

  if (isAuthenticated) {
    const userRole = state.currentUser ? state.currentUser.role : 'citizen';
    
    if (path === '/citizen/dashboard') {
      if (userRole === 'citizen') {
        switchPortal('public');
      } else {
        window.history.replaceState(null, '', '/municipal/dashboard');
        switchPortal('municipality');
      }
    } else if (path === '/municipal/dashboard') {
      if (userRole === 'municipal') {
        switchPortal('municipality');
      } else {
        window.history.replaceState(null, '', '/citizen/dashboard');
        switchPortal('public');
      }
    } else {
      if (userRole === 'municipal') {
        window.history.replaceState(null, '', '/municipal/dashboard');
        switchPortal('municipality');
      } else {
        window.history.replaceState(null, '', '/citizen/dashboard');
        switchPortal('public');
      }
    }
  } else {
    if (path !== '/' && path !== '/index.html') {
      window.history.replaceState(null, '', '/');
    }
    switchPortal('landing');
  }
}

async function initApp() {
  initTheme();
  await fetchUser();
  setupEventListeners();
  handleRouting();

  // Render NoticeForm
  const noticeCreator = document.getElementById('noticeCreatorPanel');
  if (noticeCreator) {
    const existingForm = noticeCreator.querySelector('form');
    if (existingForm) existingForm.remove();
    noticeCreator.appendChild(NoticeForm());
  }
}

// Switch between Role selector landing vs app portals
function switchPortal(portalName) {
  state.activePortal = portalName;
  
  // Close details overlay if open
  document.getElementById('opsSidePanel').classList.remove('open');
  cleanupOpsDetailMap();

  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    if (portalName === 'municipality') {
      mainContent.classList.add('municipality-portal');
    } else {
      mainContent.classList.remove('municipality-portal');
    }
  }
  
  if (portalName === 'landing') {
    const isAuthenticated = localStorage.getItem('clear_user_authenticated') === 'true';
    if (isAuthenticated) {
      handleRouting();
      return;
    }
    landingPortal.style.display = 'flex';
    mainAppLayout.style.display = 'none';
    showAuthScreen('authLandingScreen');
  } else {
    landingPortal.style.display = 'none';
    mainAppLayout.style.display = 'flex';
    
    // Toggle sidebar groups
    const citizenNavs = document.querySelectorAll('.citizen-only-nav');
    const municipalNavs = document.querySelectorAll('.municipal-only-nav');
    
    if (portalName === 'public') {
      // Setup Citizen Portal
      citizenNavs.forEach(el => el.style.display = '');
      municipalNavs.forEach(el => el.style.display = 'none');
      
      citizenViewport.style.display = 'block';
      municipalTriageViewport.style.display = 'none';
      municipalResolvedViewport.style.display = 'none';
      municipalNoticesViewport.style.display = 'none';
      
      document.getElementById('userRoleLabel').textContent = 'Resident Reporter';
      
      // Reset sidebar active states
      updateSidebarActiveBtn(exploreBtn);
      
      state.showNoticesOnly = false;
      state.showMyIssues = false;
      state.showFollowedOnly = false;
      
      fetchIssues();
    } else if (portalName === 'municipality') {
      // Setup Municipal Portal
      citizenNavs.forEach(el => el.style.display = 'none');
      municipalNavs.forEach(el => el.style.display = '');
      
      citizenViewport.style.display = 'none';
      
      document.getElementById('userRoleLabel').textContent = `Operations Officer (${MOCK_MUNICIPALITY_DISTRICT})`;
      
      // Select Triage tab by default
      switchOpsTab('triage');
    }
  }
}

// Switch Municipal Sub-tabs
function switchOpsTab(tabName) {
  state.activeOpsTab = tabName;

  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.classList.remove('tab-triage', 'tab-resolved', 'tab-notices');
    mainContent.classList.add(`tab-${tabName}`);
  }
  
  if (tabName === 'triage') {
    updateSidebarActiveBtn(opsTriageTabBtn);
    municipalTriageViewport.style.display = 'block';
    municipalResolvedViewport.style.display = 'none';
    municipalNoticesViewport.style.display = 'none';
  } else if (tabName === 'resolved') {
    updateSidebarActiveBtn(opsResolvedTabBtn);
    municipalTriageViewport.style.display = 'none';
    municipalResolvedViewport.style.display = 'block';
    municipalNoticesViewport.style.display = 'none';
  } else if (tabName === 'notices') {
    updateSidebarActiveBtn(opsNoticesTabBtn);
    municipalTriageViewport.style.display = 'none';
    municipalResolvedViewport.style.display = 'none';
    municipalNoticesViewport.style.display = 'block';
  }
  
  fetchOpsData();
}

function updateSidebarActiveBtn(activeBtn) {
  const allBtns = [exploreBtn, followingBtn, noticesBtn, opsTriageTabBtn, opsResolvedTabBtn, opsNoticesTabBtn];
  allBtns.forEach(btn => {
    if (btn) {
      if (btn === activeBtn) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
}

// REST API helper functions

async function fetchNotificationsCount() {
  const dot = document.querySelector('#notificationBtn .notification-dot');
  if (!dot) return;
  try {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const notifications = await res.json();
      const unreadCount = notifications.filter(n => !n.read).length;
      dot.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  } catch (err) {
    console.error('Error fetching notification count:', err);
  }
}

async function loadAndRenderNotifications(dropdown) {
  const listContainer = dropdown.querySelector('#notificationsList');
  try {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const notifications = await res.json();
      
      const unreadCount = notifications.filter(n => !n.read).length;
      const dot = document.querySelector('#notificationBtn .notification-dot');
      if (dot) {
        dot.style.display = unreadCount > 0 ? 'block' : 'none';
      }

      if (notifications.length === 0) {
        listContainer.innerHTML = `<div class="notification-list-empty">No updates yet.</div>`;
        return;
      }

      listContainer.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}" data-report-id="${n.reportId}">
          <div class="notification-item-message">${escapeHTML(n.message)}</div>
          <div class="notification-item-time">${timeAgo(n.createdAt)}</div>
        </div>
      `).join('');

      listContainer.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', async () => {
          const id = item.dataset.id;
          const reportId = item.dataset.reportId;
          
          try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
          } catch (err) {
            console.error('Error marking notification as read:', err);
          }

          dropdown.classList.remove('open');
          
          try {
            const reportRes = await fetch(`/api/issues/${reportId}`);
            if (reportRes.ok) {
              const report = await reportRes.json();
              openOpsDetailPanel(report);
            }
          } catch (err) {
            console.error('Error fetching issue details:', err);
          }
        });
      });
    }
  } catch (err) {
    console.error('Error loading notifications:', err);
    listContainer.innerHTML = `<div class="notification-list-empty">Error loading updates.</div>`;
  }
}

async function fetchUser() {
  try {
    const res = await fetch('/api/user');
    if (res.ok) {
      const user = await res.json();
      state.currentUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        district: user.district || 'LUDHIANA'
      };
      if (user.district) {
        MOCK_MUNICIPALITY_DISTRICT = user.district;
      }
      document.getElementById('usernameLabel').textContent = user.username;
      
      // Fetch notification count on startup
      await fetchNotificationsCount();
    } else {
      localStorage.removeItem('clear_user_authenticated');
      localStorage.removeItem('clear_username');
    }
  } catch (err) {
    console.error('Error fetching user:', err);
  }
}

// Calculate Urgency Priority automatically based on signals
function calculatePriorityLabel(issue) {
  const upvotes = issue.upvotes || 0;
  const createdAt = new Date(issue.createdAt);
  const hoursWaiting = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));

  // Score = upvotes (1.5) + hours waiting (0.15)
  const score = (upvotes * 1.5) + (hoursWaiting * 0.15);
  
  if (score < 8) return 'Low';
  if (score < 20) return 'Medium';
  return 'High';
}

// Fetch official bulletins
async function fetchNotices() {
  try {
    const res = await fetch('/api/notices');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error loading notices:', err);
  }
  return [];
}

async function fetchIssues() {
  if (state.showNoticesOnly) {
    // Show spinner
    feedContainer.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading notices...</p>
      </div>
    `;
    if (feedTitle) feedTitle.textContent = "Official Notices";
    
    const noticesList = await fetchNotices();
    renderPublicNotices(noticesList);
    return;
  }

  // Show spinner
  feedContainer.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading civic reports...</p>
    </div>
  `;

  // Build query params
  const params = new URLSearchParams();
  if (state.currentSubLocation) params.append('subLocation', state.currentSubLocation);
  if (state.showMyIssues) {
    params.append('myIssues', 'true');
    if (state.currentUser && state.currentUser.id) {
      params.append('userId', state.currentUser.id);
    }
  }
  if (state.showFollowedOnly) params.append('followedOnly', 'true');
  if (state.searchQuery) params.append('search', state.searchQuery);

  try {
    const res = await fetch(`/api/issues?${params.toString()}`);
    if (res.ok) {
      const issues = await res.json();
      renderIssues(issues);
    } else {
      feedContainer.innerHTML = `
        <div class="empty-state">
          <p>Failed to retrieve environmental reports. Please reload page.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading reports:', err);
    feedContainer.innerHTML = `
      <div class="empty-state">
        <p>Network error. Cannot load environmental reports.</p>
      </div>
    `;
  }
}

// Render notices list on public feed notices tab
function renderPublicNotices(notices) {
  if (notices.length === 0) {
    feedContainer.innerHTML = `
      <div class="empty-state">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-muted-text); margin-bottom: 16px; width: 48px; height: 48px;">
          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <h3>No official bulletins published</h3>
        <p>Your local municipalities have not issued any advisories or warning bulletins at this time.</p>
      </div>
    `;
    return;
  }

  feedContainer.innerHTML = '';
  notices.forEach(notice => {
    // Filter public notices by active sublocation if set
    if (state.currentSubLocation && notice.subLocation.toUpperCase() !== state.currentSubLocation.toUpperCase()) {
      return;
    }

    const card = document.createElement('article');
    card.className = 'ops-notice-card-item';
    card.style.backgroundColor = 'var(--color-card-bg)';
    card.style.border = '1px solid var(--color-border)';
    card.style.borderRadius = 'var(--radius-md)';
    card.style.padding = '20px';
    card.style.marginBottom = '16px';
    card.style.boxShadow = 'var(--color-shadow)';

    let badgeClass = 'type-advisory';
    if (notice.type === 'Warning') badgeClass = 'type-warning';
    else if (notice.type === 'Public Notice') badgeClass = 'type-public-notice';
    else if (notice.type === 'Drive / Campaign') badgeClass = 'type-drive-campaign';

    card.innerHTML = `
      <div class="ops-notice-card-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
        <h3 class="ops-notice-card-title" style="font-size:15px; font-weight:700; color:var(--color-primary-text); margin:0;">${escapeHTML(notice.title)}</h3>
        <span class="ops-notice-badge ${badgeClass}">${escapeHTML(notice.type)}</span>
      </div>
      <p class="ops-notice-desc" style="font-size:13px; color:var(--color-secondary-text); line-height:1.5; margin-bottom:14px; margin-top: 0;">${escapeHTML(notice.description)}</p>
      <div class="ops-notice-meta" style="display:flex; justify-content:space-between; font-size:10px; color:var(--color-muted-text); border-top:1px dashed var(--color-border); padding-top:8px;">
        <span>📍 District: <strong>${escapeHTML(notice.subLocation)}</strong></span>
        <span>Published: ${new Date(notice.createdAt).toLocaleDateString()} ${notice.expiryDate ? `&bull; Expiry: ${new Date(notice.expiryDate).toLocaleDateString()}` : ''}</span>
      </div>
    `;
    feedContainer.appendChild(card);
  });

  if (feedContainer.innerHTML === '') {
    feedContainer.innerHTML = `
      <div class="empty-state">
        <h3>No bulletins found in ${state.currentSubLocation}</h3>
        <p>Try switching to All Punjab to see bulletins from other districts.</p>
      </div>
    `;
  }
}

// Render Issues Feed for Citizen Portal
function renderIssues(issues) {
  if (feedTitle) {
    if (state.showMyIssues) {
      feedTitle.textContent = "My Registered Issues";
    } else if (state.showFollowedOnly) {
      feedTitle.textContent = "Reports You Follow";
    } else if (state.currentSubLocation) {
      feedTitle.textContent = `Reports in ${state.currentSubLocation}`;
    } else {
      feedTitle.textContent = "Active Local Reports";
    }
  }
  
  // Filter issues for citizen portal view
  const filteredIssues = issues.filter(issue => {
    // Filter out rejected issues unless showMyIssues is true
    if (issue.status === 'Rejected' && !state.showMyIssues) return false;
    // Explorer (active feed) should NEVER display resolved reports
    if (!state.showFollowedOnly && !state.showMyIssues && issue.status === 'Resolved') return false;
    return true;
  });

  if (filteredIssues.length === 0) {
    if (state.showMyIssues) {
      feedContainer.innerHTML = `
        <div class="empty-state">
          <svg class="icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-muted-text); margin-bottom: 16px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3 style="font-size: 18px; font-weight: 700; color: var(--color-primary-text); margin-bottom: 8px;">No reports yet</h3>
          <p style="font-size: 14px; color: var(--color-secondary-text); margin-bottom: 20px;">You haven't submitted any environmental reports.</p>
          <button class="btn btn-primary" onclick="document.getElementById('createIssueBtn').click()">
            <svg class="icon stroke-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Report
          </button>
        </div>
      `;
    } else {
      feedContainer.innerHTML = `
        <div class="empty-state">
          <svg class="icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No environmental reports found</h3>
          <p>Try resetting filters, clearing your search, or submit a new environmental issue report.</p>
        </div>
      `;
    }
    return;
  }

  feedContainer.innerHTML = '';
  filteredIssues.forEach(issue => {
    feedContainer.appendChild(ReportPost(issue));
  });
}

// Helper to get image array for an issue (enforcing placeholder images)
function getIssueImages(issue) {
  if (issue.images && issue.images.length > 0) {
    return issue.images;
  }
  const placeholders = {
    dumping: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=60",
    burning: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop&q=60",
    water: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?w=800&auto=format&fit=crop&q=60",
    default: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&auto=format&fit=crop&q=60"
  };
  return [placeholders[issue.imageType] || placeholders.default];
}

// Reusable Post Card component creator
function ReportPost(issue) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.id = `issue-${issue.id}`;

  // Image (mandatory, fallback to placeholder)
  const mainImages = (issue.status === 'Resolved' && issue.resolutionImages && issue.resolutionImages.length > 0)
    ? issue.resolutionImages
    : getIssueImages(issue);

  const imageHTML = `
    <div class="post-card-image-wrapper">
      <img src="${mainImages[0]}" class="post-card-image" alt="Report photo">
    </div>
  `;

  // Get author name
  let authorName = issue.authorName;
  if (issue.isAnonymous) {
    authorName = "Anonymous";
  } else {
    if (!authorName && issue.authorId) {
      const users = JSON.parse(localStorage.getItem('clear_users') || '[]');
      const found = users.find(u => u.id === issue.authorId || u.username.toLowerCase() === issue.authorId.toLowerCase());
      if (found) {
        authorName = found.username;
      } else {
        authorName = issue.authorId;
      }
    }
    if (!authorName) {
      authorName = "Anonymous";
    }
  }

  // Order:
  // Title
  // Author & District & Time elapsed
  // Image (mandatory)
  // Description preview
  // Action bar
  let statusClass = '';
  if (issue.status === 'Review Queue' || issue.status === 'Pending Review') statusClass = 'status-review-queue';
  else if (issue.status === 'Acknowledged') statusClass = 'status-acknowledged';
  else if (issue.status === 'In Progress') statusClass = 'status-in-progress';
  else if (issue.status === 'Resolved') statusClass = 'status-resolved';
  else if (issue.status === 'Rejected') statusClass = 'status-rejected';

  const statusBadge = `<span class="status-badge-inline ${statusClass}">${escapeHTML(issue.status)}</span>`;

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; width: 100%;">
      <h3 class="post-card-title" style="margin: 0; flex-grow: 1;">${escapeHTML(issue.title)}</h3>
      ${statusBadge}
    </div>
    <div class="post-card-meta" style="font-weight: 400; color: var(--color-text-muted); font-size: 12.5px; margin-top: 4px;">
      Posted by ${escapeHTML(authorName)} &bull; ${escapeHTML(issue.subLocation)} &bull; ${timeAgo(issue.createdAt)}
    </div>
    ${imageHTML}
    ${issue.description ? `<p class="post-card-desc-preview">${escapeHTML(issue.description)}</p>` : ''}
    <div class="post-card-actions">
      <!-- Upvote button -->
      <button class="action-pill upvote-btn" aria-label="Upvote">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon icon-sm">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span class="upvote-count">${issue.upvotes}</span>
        <span>Upvotes</span>
      </button>
      
      <!-- Comments button -->
      <button class="action-pill comment-trigger-btn" aria-label="Comments">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon icon-sm">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="comment-count">${issue.comments ? issue.comments.length : 0}</span>
        <span>Comments</span>
      </button>
      
      <!-- Follow button (📍) -->
      <button class="action-pill follow-btn ${issue.followed ? 'followed-active' : ''}" aria-label="Follow report">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon icon-sm">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Follow</span>
      </button>
      
      <!-- Share button -->
      <button class="action-pill share-btn" aria-label="Share post">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon icon-sm">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span>Share</span>
      </button>
    </div>
  `;

  bindCardEvents(card, issue);
  return card;
}

// Bind interactive event handlers to citizen post cards
function bindCardEvents(card, issue) {
  // Clicking anywhere on the post card opens the detail page/drawer
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // If user clicked any action button inside the card, ignore
    if (e.target.closest('.post-card-actions')) return;
    openOpsDetailPanel(issue);
  });

  // Follow Action in action bar
  const followBtn = card.querySelector('.follow-btn');
  followBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/issues/${issue.id}/follow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        issue.followed = data.followed;
        followBtn.classList.toggle('followed-active', data.followed);
        showToast(data.followed ? 'Following report for updates' : 'Unfollowed report');
        
        // If we are showing followed reports only, refresh feed immediately
        if (state.showFollowedOnly) {
          fetchIssues();
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Upvote Action
  const upvoteBtn = card.querySelector('.upvote-btn');
  upvoteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/issues/${issue.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'up' })
      });
      if (res.ok) {
        const data = await res.json();
        card.querySelector('.upvote-count').textContent = data.upvotes;
        upvoteBtn.classList.add('vote-btn-active-up');
        showToast('Upvoted environmental report');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Comments trigger button opens details drawer and focuses input
  const commentTrigger = card.querySelector('.comment-trigger-btn');
  commentTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    openOpsDetailPanel(issue);
    setTimeout(() => {
      const input = document.getElementById('opsDetailCommentInput');
      if (input) input.focus();
    }, 300);
  });

  // Share URL Action
  const shareBtn = card.querySelector('.share-btn');
  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/issue/${issue.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      showToast('Copied report link to clipboard');
    }).catch(err => {
      showToast(`Link: ${postUrl}`);
    });
  });
}

// Helper for formatting time relative to now
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

// Component: KanbanColumn
function KanbanColumn(title, countId, cardsContainerId) {
  const col = document.createElement('div');
  col.className = 'kanban-col';
  col.id = `col-${cardsContainerId}`;
  col.innerHTML = `
    <div class="kanban-col-header">
      <h3>${escapeHTML(title)}</h3>
      <span class="count-badge" id="${countId}">0</span>
    </div>
    <div class="kanban-col-cards" id="${cardsContainerId}"></div>
  `;
  return col;
}

// Component: KanbanIssueCard
function KanbanIssueCard(issue) {
  const card = document.createElement('div');
  card.className = 'ops-issue-card';
  card.id = `ops-card-${issue.id}`;
  
  const verificationCount = issue.verificationCount || Math.max(0, Math.floor(issue.upvotes / 4));
  const timeStr = timeAgo(issue.createdAt);
  const desc = issue.description || 'No description supplied.';

  card.innerHTML = `
    <h4 class="ops-card-title">${escapeHTML(issue.title)}</h4>
    <div class="ops-card-district">${escapeHTML(issue.subLocation)}</div>
    <p class="ops-card-desc-preview">${escapeHTML(desc)}</p>
    <div class="ops-card-meta-info">
      <span class="ops-card-stat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-xs" style="width:12px; height:12px;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${verificationCount} verifications</span>
      </span>
      <span class="ops-card-stat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon-xs" style="width:12px; height:12px;">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span>${issue.upvotes} upvotes</span>
      </span>
      <span class="ops-card-time">${timeStr}</span>
    </div>
  `;

  card.addEventListener('click', (e) => {
    openOpsDetailPanel(issue);
  });

  return card;
}

// Component: MunicipalityActionPanel
function MunicipalityActionPanel(issue) {
  const container = document.createElement('div');
  container.className = 'municipality-action-panel';
  
  let contentHTML = `
    <span class="panel-action-title">Municipality Actions</span>
  `;

  if (issue.status === 'Review Queue' || issue.status === 'Pending Review') {
    contentHTML += `
      <div class="panel-action-subtitle">Awaiting triage decision</div>
      <div class="triage-btn-group">
        <button class="btn btn-ops-triage btn-ops-triage-primary" id="drawerAckBtn">Acknowledge</button>
        <button class="btn btn-ops-triage btn-ops-triage-danger" id="drawerRejBtn">Reject</button>
        <button class="btn btn-ops-triage btn-ops-triage-secondary" id="drawerDupBtn">Mark Duplicate</button>
      </div>
    `;
  } else if (issue.status === 'Acknowledged') {
    contentHTML += `
      <div class="panel-action-subtitle">Ready to launch field crews:</div>
      <div class="triage-btn-group">
        <button class="btn btn-ops-triage btn-ops-triage-warning" id="drawerStartBtn">Start Work</button>
      </div>
    `;
  } else if (issue.status === 'In Progress') {
    contentHTML += `
      <div class="panel-action-subtitle">Action ongoing. Ready to resolve?</div>
      <div class="triage-btn-group">
        <button class="btn btn-ops-triage btn-ops-triage-success" id="drawerResolveBtn">Resolve Report</button>
      </div>
    `;
  } else if (issue.status === 'Resolved') {
    contentHTML += `
      <div class="panel-action-subtitle status-resolved-label">Issue successfully resolved.</div>
    `;
  } else if (issue.status === 'Rejected') {
    contentHTML += `
      <div class="panel-action-subtitle status-rejected-label">Rejection decision completed.</div>
    `;
  }

  container.innerHTML = contentHTML;

  // Bind events
  const ack = container.querySelector('#drawerAckBtn');
  if (ack) ack.addEventListener('click', () => updateIssueStatus(issue.id, 'Acknowledged'));

  const rej = container.querySelector('#drawerRejBtn');
  if (rej) rej.addEventListener('click', () => {
    const modal = document.getElementById('rejectModal');
    if (modal) {
      modal.classList.add('open');
      document.getElementById('rejectSubmitForm').reset();
      document.getElementById('rejectCustomReasonGroup').style.display = 'none';
      document.getElementById('rejectCustomReasonInput').required = false;
    }
  });

  const dup = container.querySelector('#drawerDupBtn');
  if (dup) dup.addEventListener('click', () => {
    showToast('Duplicate flag marked (Triage placeholder)');
  });

  const start = container.querySelector('#drawerStartBtn');
  if (start) start.addEventListener('click', () => updateIssueStatus(issue.id, 'In Progress'));

  const resolve = container.querySelector('#drawerResolveBtn');
  if (resolve) resolve.addEventListener('click', () => {
    document.getElementById('resolutionModal').classList.add('open');
  });

  return container;
}

// Component: NoticeCard
function NoticeCard(notice) {
  const item = document.createElement('div');
  item.className = 'ops-notice-card-item';
  
  let typeClass = 'type-advisory';
  if (notice.type === 'Warning') typeClass = 'type-warning';
  else if (notice.type === 'Public Notice') typeClass = 'type-public';
  else if (notice.type === 'Drive / Campaign') typeClass = 'type-drive-campaign';

  item.innerHTML = `
    <div class="ops-notice-card-header">
      <h4 class="ops-notice-card-title">${escapeHTML(notice.title)}</h4>
      <span class="badge ${typeClass}">${escapeHTML(notice.type)}</span>
    </div>
    <p class="ops-notice-desc">${escapeHTML(notice.description)}</p>
    <div class="ops-notice-meta">
      <span>District: <strong>${escapeHTML(notice.subLocation)}</strong></span>
      <span>Published: ${new Date(notice.createdAt).toLocaleDateString()}</span>
    </div>
  `;
  return item;
}

// Component: NoticeForm
function NoticeForm() {
  const form = document.createElement('form');
  form.id = 'noticePublishForm';
  form.className = 'ops-notice-form';
  form.innerHTML = `
    <div class="form-group">
      <label for="noticeTitle">Notice Title</label>
      <input type="text" id="noticeTitle" placeholder="e.g. Scheduled Sewer Cleaning" required maxlength="100">
    </div>
    
    <div class="form-group" style="flex-grow: 1; display: flex; flex-direction: column;">
      <label for="noticeDescription">Description / Message</label>
      <textarea id="noticeDescription" placeholder="Detail warnings, schedules, or impact area information..." required maxlength="500" style="flex-grow: 1; resize: none; min-height: 120px;"></textarea>
    </div>

    <div class="form-row">
      <input type="hidden" id="noticeDistrict" value="${MOCK_MUNICIPALITY_DISTRICT}">
      <div class="form-group" style="width: 100%;">
        <label for="noticeType">Notice Type</label>
        <select id="noticeType" required>
          <option value="Advisory">Advisory</option>
          <option value="Warning">Warning</option>
          <option value="Public Notice">Public Notice</option>
          <option value="Drive / Campaign">Drive / Campaign</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label for="noticeExpiry">Optional Expiry Date</label>
      <input type="date" id="noticeExpiry">
    </div>

    <button type="submit" class="btn btn-primary btn-block" id="btnPublishNotice" style="margin-top: 12px; width: 100%;">Publish Bulletin</button>
  `;

  // Bind submit event within the component
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.querySelector('#noticeTitle').value.trim();
    const description = form.querySelector('#noticeDescription').value.trim();
    const subLocation = form.querySelector('#noticeDistrict').value;
    const type = form.querySelector('#noticeType').value;
    const expiryDate = form.querySelector('#noticeExpiry').value;

    if (!title || !description || !subLocation || !type) {
      showToast('Please fill in all required notice fields');
      return;
    }

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, subLocation, type, expiryDate })
      });
      if (res.ok) {
        showToast(`Official ${type} notice published successfully`);
        form.reset();
        fetchOpsData(); // Reload ops bulletins
      } else {
        showToast('Failed to publish bulletin');
      }
    } catch (err) {
      console.error(err);
    }
  });

  return form;
}

// Theme Toggle Functionality
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  
  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      localStorage.setItem('clear_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      localStorage.setItem('clear_theme', 'light');
    }
  };

  // Default to light theme if no theme has been saved yet
  const savedTheme = localStorage.getItem('clear_theme') || 'light';
  
  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Add click listener
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Role selector toggles for Login screen
  const loginRoleCivilBtn = document.getElementById('loginRoleCivil');
  const loginRoleMunicipalBtn = document.getElementById('loginRoleMunicipal');
  const loginCivilFields = document.getElementById('loginCivilFields');
  const loginMunicipalFields = document.getElementById('loginMunicipalFields');

  if (loginRoleCivilBtn && loginRoleMunicipalBtn) {
    loginRoleCivilBtn.addEventListener('click', () => {
      loginRoleCivilBtn.classList.add('active');
      loginRoleMunicipalBtn.classList.remove('active');
      if (loginCivilFields) loginCivilFields.style.display = 'block';
      if (loginMunicipalFields) loginMunicipalFields.style.display = 'none';
      
      document.getElementById('loginCivilEmail').setAttribute('required', 'true');
      document.getElementById('loginCivilPassword').setAttribute('required', 'true');
      document.getElementById('loginMunicipalEmail').removeAttribute('required');
      document.getElementById('loginMunicipalAuthKey').removeAttribute('required');
    });

    loginRoleMunicipalBtn.addEventListener('click', () => {
      loginRoleMunicipalBtn.classList.add('active');
      loginRoleCivilBtn.classList.remove('active');
      if (loginCivilFields) loginCivilFields.style.display = 'none';
      if (loginMunicipalFields) loginMunicipalFields.style.display = 'block';
      
      document.getElementById('loginCivilEmail').removeAttribute('required');
      document.getElementById('loginCivilPassword').removeAttribute('required');
      document.getElementById('loginMunicipalEmail').setAttribute('required', 'true');
      document.getElementById('loginMunicipalAuthKey').setAttribute('required', 'true');
    });
  }

  // Role selector toggles for Register screen
  const registerRoleCivilBtn = document.getElementById('registerRoleCivil');
  const registerRoleMunicipalBtn = document.getElementById('registerRoleMunicipal');
  const registerCivilFields = document.getElementById('registerCivilFields');
  const registerMunicipalFields = document.getElementById('registerMunicipalFields');

  if (registerRoleCivilBtn && registerRoleMunicipalBtn) {
    registerRoleCivilBtn.addEventListener('click', () => {
      registerRoleCivilBtn.classList.add('active');
      registerRoleMunicipalBtn.classList.remove('active');
      if (registerCivilFields) registerCivilFields.style.display = 'block';
      if (registerMunicipalFields) registerMunicipalFields.style.display = 'none';
      
      document.getElementById('registerCivilEmail').setAttribute('required', 'true');
      document.getElementById('registerCivilName').setAttribute('required', 'true');
      document.getElementById('registerCivilPassword').setAttribute('required', 'true');
      document.getElementById('registerCivilConfirmPassword').setAttribute('required', 'true');
      
      document.getElementById('registerMunicipalEmail').removeAttribute('required');
      document.getElementById('registerMunicipalUsername').removeAttribute('required');
      document.getElementById('registerMunicipalDistrict').removeAttribute('required');
      document.getElementById('registerMunicipalAuthKey').removeAttribute('required');
    });

    registerRoleMunicipalBtn.addEventListener('click', () => {
      registerRoleMunicipalBtn.classList.add('active');
      registerRoleCivilBtn.classList.remove('active');
      if (registerCivilFields) registerCivilFields.style.display = 'none';
      if (registerMunicipalFields) registerMunicipalFields.style.display = 'block';
      
      document.getElementById('registerCivilEmail').removeAttribute('required');
      document.getElementById('registerCivilName').removeAttribute('required');
      document.getElementById('registerCivilPassword').removeAttribute('required');
      document.getElementById('registerCivilConfirmPassword').removeAttribute('required');
      
      document.getElementById('registerMunicipalEmail').setAttribute('required', 'true');
      document.getElementById('registerMunicipalUsername').setAttribute('required', 'true');
      document.getElementById('registerMunicipalDistrict').setAttribute('required', 'true');
      document.getElementById('registerMunicipalAuthKey').setAttribute('required', 'true');
    });
  }

  // New Auth flow triggers
  const goToLoginBtn = document.getElementById('goToLoginBtn');
  if (goToLoginBtn) {
    goToLoginBtn.addEventListener('click', () => showAuthScreen('authLoginScreen'));
  }
  
  const goToRegisterBtn = document.getElementById('goToRegisterBtn');
  if (goToRegisterBtn) {
    goToRegisterBtn.addEventListener('click', () => showAuthScreen('authRegisterScreen'));
  }
  
  const loginBackBtn = document.getElementById('loginBackBtn');
  if (loginBackBtn) {
    loginBackBtn.addEventListener('click', () => showAuthScreen('authLandingScreen'));
  }
  
  const registerBackBtn = document.getElementById('registerBackBtn');
  if (registerBackBtn) {
    registerBackBtn.addEventListener('click', () => showAuthScreen('authLandingScreen'));
  }
  
  const linkToRegister = document.getElementById('linkToRegister');
  if (linkToRegister) {
    linkToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthScreen('authRegisterScreen');
    });
  }
  
  const linkToLogin = document.getElementById('linkToLogin');
  if (linkToLogin) {
    linkToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthScreen('authLoginScreen');
    });
  }
  
  // Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const isCivil = loginRoleCivilBtn ? loginRoleCivilBtn.classList.contains('active') : true;
      let emailOrUsername = '';
      let password = '';
      
      if (isCivil) {
        emailOrUsername = document.getElementById('loginCivilEmail').value.trim();
        password = document.getElementById('loginCivilPassword').value;
      } else {
        emailOrUsername = document.getElementById('loginMunicipalEmail').value.trim();
        password = document.getElementById('loginMunicipalAuthKey').value;
      }
      
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrUsername, password })
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.user;
          localStorage.setItem('clear_user_authenticated', 'true');
          localStorage.setItem('clear_username', user.username);
          
          state.currentUser = {
            id: user.id,
            username: user.username,
            avatar: '/images/avatar.png',
            role: user.role,
            district: user.district || 'LUDHIANA'
          };
          
          if (user.district) {
            MOCK_MUNICIPALITY_DISTRICT = user.district;
          }
          
          const usernameLabel = document.getElementById('usernameLabel');
          if (usernameLabel) usernameLabel.textContent = user.username;
          
          showToast(`Welcome back, ${user.username}!`);
          loginForm.reset();
          
          if (state.currentUser.role === 'municipal') {
            window.history.pushState(null, '', '/municipal/dashboard');
            switchPortal('municipality');
          } else {
            window.history.pushState(null, '', '/citizen/dashboard');
            switchPortal('public');
          }
        } else {
          const err = await res.json();
          showToast(err.error || 'Invalid email, username or password/auth key.');
        }
      } catch (err) {
        showToast('Connection error. Failed to log in.');
      }
    });
  }
  
  // Register Form Submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const isCivil = registerRoleCivilBtn ? registerRoleCivilBtn.classList.contains('active') : true;
      let email = '';
      let username = '';
      let password = '';
      let confirmPassword = '';
      let district = '';
      let authKey = '';
      
      if (isCivil) {
        email = document.getElementById('registerCivilEmail').value.trim();
        const name = document.getElementById('registerCivilName').value.trim();
        password = document.getElementById('registerCivilPassword').value;
        confirmPassword = document.getElementById('registerCivilConfirmPassword').value;
        username = name || email.split('@')[0];
      } else {
        email = document.getElementById('registerMunicipalEmail').value.trim();
        username = document.getElementById('registerMunicipalUsername').value.trim();
        district = document.getElementById('registerMunicipalDistrict').value;
        password = document.getElementById('registerMunicipalAuthKey').value;
        confirmPassword = password;
        authKey = password;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match.');
        return;
      }
      
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, role: isCivil ? 'citizen' : 'municipal', district, authKey })
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.user;
          localStorage.setItem('clear_user_authenticated', 'true');
          localStorage.setItem('clear_username', user.username);
          
          state.currentUser = {
            id: user.id,
            username: user.username,
            avatar: '/images/avatar.png',
            role: user.role,
            district: user.district || 'LUDHIANA'
          };
          
          if (user.district) {
            MOCK_MUNICIPALITY_DISTRICT = user.district;
          }
          
          const usernameLabel = document.getElementById('usernameLabel');
          if (usernameLabel) usernameLabel.textContent = user.username;
          
          showToast('Account created successfully!');
          registerForm.reset();
          
          if (state.currentUser.role === 'municipal') {
            window.history.pushState(null, '', '/municipal/dashboard');
            switchPortal('municipality');
          } else {
            window.history.pushState(null, '', '/citizen/dashboard');
            switchPortal('public');
          }
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to create account.');
        }
      } catch (err) {
        showToast('Connection error. Failed to create account.');
      }
    });
  }

  // Handle browser navigation (back/forward buttons)
  window.addEventListener('popstate', () => {
    handleRouting();
  });

  // Ops Tab Buttons Click Handling (Sidebar)
  opsTriageTabBtn.addEventListener('click', () => switchOpsTab('triage'));
  opsResolvedTabBtn.addEventListener('click', () => switchOpsTab('resolved'));
  opsNoticesTabBtn.addEventListener('click', () => switchOpsTab('notices'));

  // Mobile menu sidebar toggle
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  // Toggle sublocation list dropdown
  locationBoxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = sublocationList.classList.toggle('open');
    locationBoxBtn.classList.toggle('open', isOpen);
    locationBoxBtn.setAttribute('aria-expanded', isOpen);

    const searchContainer = document.getElementById('districtSearchContainer');
    if (searchContainer) {
      searchContainer.style.display = isOpen ? 'block' : 'none';
      if (isOpen) {
        const input = document.getElementById('districtSearchInput');
        if (input) {
          input.value = '';
          input.focus();
        }
        filterDistricts('');
      }
    }
  });

  // District filter search
  const districtSearchInput = document.getElementById('districtSearchInput');
  if (districtSearchInput) {
    districtSearchInput.addEventListener('input', (e) => {
      filterDistricts(e.target.value);
    });
    districtSearchInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Explore button clicked
  exploreBtn.addEventListener('click', () => {
    state.currentSubLocation = '';
    state.showMyIssues = false;
    state.showFollowedOnly = false;
    state.showNoticesOnly = false;
    state.searchQuery = '';
    searchInput.value = '';
    document.getElementById('selectedLocationName').textContent = 'Punjab';
    
    updateSidebarActiveBtn(exploreBtn);
    sublocationButtons.forEach(b => {
      if (b.dataset.sub === '') b.classList.add('active');
      else b.classList.remove('active');
    });

    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  // Following button clicked
  followingBtn.addEventListener('click', () => {
    state.currentSubLocation = '';
    state.showMyIssues = false;
    state.showFollowedOnly = true;
    state.showNoticesOnly = false;
    state.searchQuery = '';
    searchInput.value = '';
    document.getElementById('selectedLocationName').textContent = 'Punjab';

    updateSidebarActiveBtn(followingBtn);
    sublocationButtons.forEach(b => b.classList.remove('active'));

    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  // Notices button clicked (Citizen view)
  noticesBtn.addEventListener('click', () => {
    state.currentSubLocation = '';
    state.showMyIssues = false;
    state.showFollowedOnly = false;
    state.showNoticesOnly = true;
    state.searchQuery = '';
    searchInput.value = '';
    document.getElementById('selectedLocationName').textContent = 'Punjab';

    updateSidebarActiveBtn(noticesBtn);
    sublocationButtons.forEach(b => b.classList.remove('active'));

    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  // Location selector list change filter
  sublocationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sublocationButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const label = btn.dataset.sub || 'Punjab';
      document.getElementById('selectedLocationName').textContent = label;
      state.currentSubLocation = btn.dataset.sub;
      
      sublocationList.classList.remove('open');
      locationBoxBtn.classList.remove('open');
      locationBoxBtn.setAttribute('aria-expanded', 'false');

      const searchContainer = document.getElementById('districtSearchContainer');
      if (searchContainer) searchContainer.style.display = 'none';

      if (state.activePortal === 'public') {
        // Reset citizen visual active button to Explore unless viewing notices
        if (!state.showNoticesOnly) {
          state.showFollowedOnly = false;
          state.showMyIssues = false;
          updateSidebarActiveBtn(exploreBtn);
        }
        fetchIssues();
      } else if (state.activePortal === 'municipality') {
        fetchOpsData();
      }
      
      sidebar.classList.remove('open');
    });
  });

  // Profile triggers
  profileMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('open');
  });

  myIssuesBtn.addEventListener('click', () => {
    state.showMyIssues = true;
    state.currentSubLocation = '';
    state.showFollowedOnly = false;
    state.showNoticesOnly = false;
    document.getElementById('selectedLocationName').textContent = 'Punjab';
    
    sublocationButtons.forEach(b => b.classList.remove('active'));
    updateSidebarActiveBtn(null);
    profileDropdown.classList.remove('open');
    
    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  logoutBtn.addEventListener('click', async () => {
    profileDropdown.classList.remove('open');
    localStorage.removeItem('clear_user_authenticated');
    localStorage.removeItem('clear_username');
    try {
      const res = await fetch('/api/user/logout', { method: 'POST' });
      if (res.ok) {
        showToast('Logged out successfully');
      }
    } catch (err) {
      console.error(err);
    }
    window.history.pushState(null, '', '/');
    switchPortal('landing');
  });

  // Notifications Bell Setup
  const notificationBtn = document.getElementById('notificationBtn');
  if (notificationBtn) {
    let dropdown = document.querySelector('.notifications-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'notifications-dropdown';
      dropdown.innerHTML = `
        <div class="notifications-dropdown-header">
          <h3>Alerts & Updates</h3>
          <button class="notifications-clear-btn" id="clearAllNotificationsBtn">Dismiss All</button>
        </div>
        <div id="notificationsList" class="notification-list-container">
          <div class="notification-list-empty">Loading notifications...</div>
        </div>
      `;
      notificationBtn.parentElement.appendChild(dropdown);
    }

    notificationBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      if (isOpen) {
        await loadAndRenderNotifications(dropdown);
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== notificationBtn && !notificationBtn.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    const clearAllBtn = dropdown.querySelector('#clearAllNotificationsBtn');
    clearAllBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        const res = await fetch('/api/notifications/clear', { method: 'POST' });
        if (res.ok) {
          showToast('All notifications dismissed');
          await loadAndRenderNotifications(dropdown);
        }
      } catch (err) {
        console.error('Error clearing notifications:', err);
      }
    });
  }

  // Editor helper functions for location, photos, and links
  function resetEditorState() {
    selectedCoordinates = null;
    attachedImages = [];
    attachedLinks = [];

    // Reset form fields
    createIssueForm.reset();
    const anonCheckbox = document.getElementById('postAnonymously');
    if (anonCheckbox) {
      anonCheckbox.checked = false;
    }

    const locationBtn = document.getElementById('modalLocationBtn');
    if (locationBtn) {
      locationBtn.classList.remove('selected');
      document.getElementById('locationBtnText').textContent = 'Add Location';
    }

    const statusText = document.getElementById('locationStatusText');
    if (statusText) {
      statusText.style.display = 'none';
      statusText.textContent = '';
    }

    const subLocSelect = document.getElementById('issueSubLocation');
    if (subLocSelect) {
      subLocSelect.disabled = true;
      subLocSelect.innerHTML = `
        <option value="" disabled selected>Select District (Confirm Location First)</option>
        <option value="AMRITSAR">AMRITSAR</option>
        <option value="BARNALA">BARNALA</option>
        <option value="BATHINDA">BATHINDA</option>
        <option value="FARIDKOT">FARIDKOT</option>
        <option value="FATEHGARH SAHIB">FATEHGARH SAHIB</option>
        <option value="FAZILKA">FAZILKA</option>
        <option value="FIROZPUR">FIROZPUR</option>
        <option value="GURDASPUR">GURDASPUR</option>
        <option value="HOSHIARPUR">HOSHIARPUR</option>
        <option value="JALANDHAR">JALANDHAR</option>
        <option value="KAPURTHALA">KAPURTHALA</option>
        <option value="LUDHIANA">LUDHIANA</option>
        <option value="MALERKOTLA">MALERKOTLA</option>
        <option value="MANSA">MANSA</option>
        <option value="MOGA">MOGA</option>
        <option value="PATHANKOT">PATHANKOT</option>
        <option value="PATIALA">PATIALA</option>
        <option value="RUPNAGAR">RUPNAGAR</option>
        <option value="SAS NAGAR">SAS NAGAR</option>
        <option value="SANGRUR">SANGRUR</option>
        <option value="SBS NAGAR">SBS NAGAR</option>
        <option value="SRI MUKTSAR SAHIB">SRI MUKTSAR SAHIB</option>
        <option value="TARN TARAN">TARN TARAN</option>
      `;
    }

    const previewsGrid = document.getElementById('photoPreviewsGrid');
    if (previewsGrid) previewsGrid.innerHTML = '';

    const linksList = document.getElementById('attachedLinksList');
    if (linksList) linksList.innerHTML = '';

    const inlineLinkContainer = document.getElementById('inlineLinkContainer');
    if (inlineLinkContainer) inlineLinkContainer.style.display = 'none';

    const linkInput = document.getElementById('issueLinkInput');
    if (linkInput) linkInput.value = '';

    const mapPicker = document.getElementById('mapPickerContainer');
    if (mapPicker) mapPicker.style.display = 'none';

    if (mapMarker) {
      mapMarker.remove();
      mapMarker = null;
    }
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
  }

  function openMapPicker() {
    const container = document.getElementById('mapPickerContainer');
    container.style.display = 'block';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          initLeafletMap(lat, lng);
        },
        (error) => {
          console.warn('Geolocation error/denied. Defaulting to Punjab center.', error);
          initLeafletMap(31.1471, 75.3412);
        }
      );
    } else {
      initLeafletMap(31.1471, 75.3412);
    }
  }

  function initLeafletMap(lat, lng) {
    if (!mapInstance) {
      mapInstance = L.map('modalMap').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);
      
      mapInstance.on('click', (e) => {
        setMapMarker(e.latlng.lat, e.latlng.lng);
      });
    } else {
      mapInstance.setView([lat, lng], 13);
    }

    setMapMarker(lat, lng);
    
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 100);
  }

  function setMapMarker(lat, lng) {
    const latlng = [lat, lng];
    selectedCoordinates = { lat, lng };

    if (mapMarker) {
      mapMarker.setLatLng(latlng);
    } else {
      mapMarker = L.marker(latlng, { draggable: true }).addTo(mapInstance);
      mapMarker.on('dragend', () => {
        const pos = mapMarker.getLatLng();
        selectedCoordinates = { lat: pos.lat, lng: pos.lng };
      });
    }
  }

  // Create modal triggers
  createIssueBtn.addEventListener('click', () => {
    createModal.classList.add('open');
    sidebar.classList.remove('open');
    resetEditorState();
  });

  closeModalBtn.addEventListener('click', () => {
    createModal.classList.remove('open');
    resetEditorState();
  });

  cancelModalBtn.addEventListener('click', () => {
    createModal.classList.remove('open');
    resetEditorState();
  });

  modalLocationBtn.addEventListener('click', () => {
    const picker = document.getElementById('mapPickerContainer');
    if (picker.style.display === 'none') {
      openMapPicker();
    } else {
      picker.style.display = 'none';
    }
  });

  // Confirm Location Map Button
  const confirmMapBtn = document.getElementById('confirmMapBtn');
  confirmMapBtn.addEventListener('click', () => {
    if (!selectedCoordinates) {
      showToast('Please drop a pin on the map first.');
      return;
    }

    document.getElementById('mapPickerContainer').style.display = 'none';

    modalLocationBtn.classList.add('selected');
    document.getElementById('locationBtnText').textContent = 'Location Confirmed';

    const statusBadge = document.getElementById('locationStatusText');
    statusBadge.style.display = 'inline-flex';
    statusBadge.innerHTML = `📍 ${selectedCoordinates.lat.toFixed(4)}, ${selectedCoordinates.lng.toFixed(4)}`;

    const subLocSelect = document.getElementById('issueSubLocation');
    subLocSelect.disabled = false;
    subLocSelect.focus();
    
    showToast('Location coordinates confirmed');
  });

  const cancelMapBtn = document.getElementById('cancelMapBtn');
  cancelMapBtn.addEventListener('click', () => {
    document.getElementById('mapPickerContainer').style.display = 'none';
  });

  // Photo Attachments (Multiple files upload + Base64 conversion)
  const photosInput = document.getElementById('issuePhotos');
  const previewsGrid = document.getElementById('photoPreviewsGrid');
  
  photosInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        
        if (attachedImages.includes(dataUrl)) return;
        attachedImages.push(dataUrl);
        
        const previewItem = document.createElement('div');
        previewItem.className = 'photo-preview-item';
        previewItem.innerHTML = `
          <img src="${dataUrl}" alt="Attached preview">
          <button type="button" class="photo-preview-remove" aria-label="Remove photo">&times;</button>
        `;
        
        previewItem.querySelector('.photo-preview-remove').addEventListener('click', () => {
          const idx = attachedImages.indexOf(dataUrl);
          if (idx > -1) attachedImages.splice(idx, 1);
          previewItem.remove();
        });
        
        previewsGrid.appendChild(previewItem);
      };
      reader.readAsDataURL(file);
    });
  });

  // Link Attachments (Add to list + remove action)
  const linkIconBtn = document.getElementById('linkIconBtn');
  const inlineLinkContainer = document.getElementById('inlineLinkContainer');
  const cancelLinkBtn = document.getElementById('cancelLinkBtn');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const linkInput = document.getElementById('issueLinkInput');
  const linksList = document.getElementById('attachedLinksList');

  linkIconBtn.addEventListener('click', () => {
    if (inlineLinkContainer.style.display === 'none') {
      inlineLinkContainer.style.display = 'flex';
      linkInput.focus();
    } else {
      inlineLinkContainer.style.display = 'none';
      linkInput.value = '';
    }
  });

  cancelLinkBtn.addEventListener('click', () => {
    inlineLinkContainer.style.display = 'none';
    linkInput.value = '';
  });

  addLinkBtn.addEventListener('click', () => {
    const linkVal = linkInput.value.trim();
    if (!linkVal) return;
    
    try {
      new URL(linkVal);
    } catch (_) {
      showToast('Please enter a valid URL (including http/https)');
      return;
    }
    
    if (attachedLinks.includes(linkVal)) {
      showToast('Link already attached');
      return;
    }

    attachedLinks.push(linkVal);

    const linkItem = document.createElement('li');
    linkItem.className = 'attached-link-item';
    linkItem.innerHTML = `
      <a href="${linkVal}" target="_blank" rel="noopener noreferrer">${escapeHTML(linkVal)}</a>
      <button type="button" class="attached-link-remove" aria-label="Remove link">&times;</button>
    `;

    linkItem.querySelector('.attached-link-remove').addEventListener('click', () => {
      const idx = attachedLinks.indexOf(linkVal);
      if (idx > -1) attachedLinks.splice(idx, 1);
      linkItem.remove();
    });

    linksList.appendChild(linkItem);
    inlineLinkContainer.style.display = 'none';
    linkInput.value = '';
    showToast('Link attached');
  });

  linkInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLinkBtn.click();
    }
  });

  // Create issue submission
  createIssueForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('issueTitle').value.trim();
    const subLocation = document.getElementById('issueSubLocation').value;
    const description = document.getElementById('issueDescription').value.trim();
    const isAnonymous = document.getElementById('postAnonymously') ? document.getElementById('postAnonymously').checked : false;

    if (!selectedCoordinates) {
      showToast('Please confirm location on the map first.');
      return;
    }
    if (!subLocation) {
      showToast('Please select a district.');
      return;
    }
    if (!title) {
      showToast('Please specify a title.');
      return;
    }

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location: 'Punjab',
          subLocation,
          imageType: 'default',
          description,
          coordinates: selectedCoordinates,
          images: attachedImages,
          links: attachedLinks,
          authorId: state.currentUser ? state.currentUser.id : 'user',
          authorName: state.currentUser ? state.currentUser.username : 'user',
          isAnonymous: isAnonymous
        })
      });

      if (res.ok) {
        createModal.classList.remove('open');
        resetEditorState();
        showToast('Environmental report registered successfully');
        fetchIssues();
      } else {
        showToast('Error registering report. Please check fields.');
      }
    } catch (err) {
      console.error('Error creating issue:', err);
      showToast('Connection error. Failed to send report.');
    }
  });

  // Search input with debounce (250ms)
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    state.searchQuery = e.target.value.trim();
    searchTimeout = setTimeout(() => {
      if (state.activePortal === 'public') {
        fetchIssues();
      } else if (state.activePortal === 'municipality') {
        fetchOpsData();
      }
    }, 250);
  });

  // Track Location Modal closing
  const trackModal = document.getElementById('trackModal');
  const closeTrackModalBtn = document.getElementById('closeTrackModalBtn');
  if (closeTrackModalBtn) {
    closeTrackModalBtn.addEventListener('click', () => {
      trackModal.classList.remove('open');
    });
  }

  // Close dropdowns/menus when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileMenuTrigger) {
      profileDropdown.classList.remove('open');
    }
    if (!e.target.closest('.post-card-options')) {
      document.querySelectorAll('.post-options-dropdown.open').forEach(d => {
        d.classList.remove('open');
      });
    }
    const searchContainer = document.getElementById('districtSearchContainer');
    if (sublocationList && !sublocationList.contains(e.target) && !locationBoxBtn.contains(e.target) && (!searchContainer || !searchContainer.contains(e.target))) {
      sublocationList.classList.remove('open');
      locationBoxBtn.classList.remove('open');
      locationBoxBtn.setAttribute('aria-expanded', 'false');
      if (searchContainer) searchContainer.style.display = 'none';
    }
    if (trackModal && e.target === trackModal) {
      trackModal.classList.remove('open');
    }
  });

  // ==========================================
  // MUNICIPALITY OPERATIONS INTERACTIVE HANDLERS
  // ==========================================

  // Ops details side panel close
  const opsSidePanel = document.getElementById('opsSidePanel');
  document.getElementById('closeOpsSidePanel').addEventListener('click', () => {
    opsSidePanel.classList.remove('open');
    state.selectedIssueForOps = null;
    cleanupOpsDetailMap();
  });

  const exportReportPdfBtn = document.getElementById('exportReportPdfBtn');
  if (exportReportPdfBtn) {
    exportReportPdfBtn.addEventListener('click', () => {
      if (state.selectedIssueForOps) {
        exportIssueToPdf(state.selectedIssueForOps);
      } else {
        showToast('No report selected');
      }
    });
  }



  // Resolution modal closing
  const resModal = document.getElementById('resolutionModal');
  document.getElementById('closeResolutionModalBtn').addEventListener('click', () => {
    resModal.classList.remove('open');
    resetResolutionForm();
  });
  document.getElementById('cancelResolutionModalBtn').addEventListener('click', () => {
    resModal.classList.remove('open');
    resetResolutionForm();
  });

  // Resolution Photo input change base64 conversion
  const resPhotoInput = document.getElementById('resolutionPhotosInput');
  const resPhotoPreview = document.getElementById('resolutionPhotoPreview');
  const resImgEl = document.getElementById('resImgEl');
  let resolutionImageBase64 = null;

  resPhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      resolutionImageBase64 = event.target.result;
      resImgEl.src = resolutionImageBase64;
      resPhotoPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('removeResImgBtn').addEventListener('click', () => {
    resolutionImageBase64 = null;
    resImgEl.src = '';
    resPhotoPreview.style.display = 'none';
    resPhotoInput.value = '';
  });

  function resetResolutionForm() {
    document.getElementById('resolutionSubmitForm').reset();
    resolutionImageBase64 = null;
    resImgEl.src = '';
    resPhotoPreview.style.display = 'none';
  }

  // Confirm Resolution form submit
  document.getElementById('resolutionSubmitForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = document.getElementById('resolutionNoteInput').value.trim();
    
    if (!resolutionImageBase64) {
      showToast('At least one resolution photo is required');
      return;
    }
    if (!note || note.length < 10) {
      showToast('Resolution note requires at least 10 characters');
      return;
    }

    try {
      const res = await fetch(`/api/issues/${state.selectedIssueForOps.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Resolved',
          resolutionImages: [resolutionImageBase64],
          resolutionNote: note
        })
      });

      if (res.ok) {
        resModal.classList.remove('open');
        resetResolutionForm();
        
        // Notify user followers simulator
        showToast('Followers notified: Report marked Resolved!');
        
        // Reload details side panel if visible
        const updatedIssue = await res.json();
        state.selectedIssueForOps = updatedIssue;
        renderOpsDetailPanel(updatedIssue);
        
        fetchOpsData(); // Reload Kanban board
      } else {
        showToast('Error marking issue resolved');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error resolving issue');
    }
  });

  // Reject Modal dropdown handler
  const rejectReasonDropdown = document.getElementById('rejectReasonDropdown');
  const rejectCustomReasonGroup = document.getElementById('rejectCustomReasonGroup');
  const rejectCustomReasonInput = document.getElementById('rejectCustomReasonInput');
  if (rejectReasonDropdown) {
    rejectReasonDropdown.addEventListener('change', () => {
      if (rejectReasonDropdown.value === 'Other') {
        rejectCustomReasonGroup.style.display = 'block';
        rejectCustomReasonInput.required = true;
      } else {
        rejectCustomReasonGroup.style.display = 'none';
        rejectCustomReasonInput.required = false;
      }
    });
  }

  // Reject Modal close/cancel buttons
  const rejectModal = document.getElementById('rejectModal');
  const closeRejectBtn = document.getElementById('closeRejectModalBtn');
  const cancelRejectBtn = document.getElementById('cancelRejectModalBtn');
  if (closeRejectBtn) {
    closeRejectBtn.addEventListener('click', () => {
      rejectModal.classList.remove('open');
    });
  }
  if (cancelRejectBtn) {
    cancelRejectBtn.addEventListener('click', () => {
      rejectModal.classList.remove('open');
    });
  }

  // Confirm Reject form submit
  const rejectSubmitForm = document.getElementById('rejectSubmitForm');
  if (rejectSubmitForm) {
    rejectSubmitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const issue = state.selectedIssueForOps;
      if (!issue) return;

      let reason = rejectReasonDropdown.value;
      if (reason === 'Other') {
        reason = rejectCustomReasonInput.value.trim();
      }

      if (!reason) {
        showToast('Rejection reason is required');
        return;
      }

      try {
        const res = await fetch(`/api/issues/${issue.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'Rejected',
            rejectionReason: reason
          })
        });

        if (res.ok) {
          rejectModal.classList.remove('open');
          showToast('Report rejected successfully');
          const updated = await res.json();
          state.selectedIssueForOps = updated;
          renderOpsDetailPanel(updated);
          fetchOpsData();
        } else {
          showToast('Error rejecting report');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error rejecting report');
      }
    });
  }

  // Appeal Modal file conversion and previews
  const appealPhotosInput = document.getElementById('appealPhotosInput');
  const appealPhotoPreview = document.getElementById('appealPhotoPreview');
  if (appealPhotosInput) {
    appealPhotosInput.addEventListener('change', (e) => {
      appealPhotoPreview.innerHTML = '';
      appealImagesBase64 = [];
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          
          if (appealImagesBase64.includes(dataUrl)) return;
          appealImagesBase64.push(dataUrl);
          
          const previewItem = document.createElement('div');
          previewItem.className = 'photo-preview-item';
          previewItem.innerHTML = `
            <img src="${dataUrl}" alt="Appeal preview">
            <button type="button" class="photo-preview-remove" aria-label="Remove photo">&times;</button>
          `;
          
          previewItem.querySelector('.photo-preview-remove').addEventListener('click', () => {
            const idx = appealImagesBase64.indexOf(dataUrl);
            if (idx > -1) appealImagesBase64.splice(idx, 1);
            previewItem.remove();
            if (appealImagesBase64.length === 0) {
              appealPhotosInput.value = '';
            }
          });
          
          appealPhotoPreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Appeal Modal close/cancel buttons
  const appealModal = document.getElementById('appealModal');
  const closeAppealBtn = document.getElementById('closeAppealModalBtn');
  const cancelAppealBtn = document.getElementById('cancelAppealModalBtn');
  if (closeAppealBtn) {
    closeAppealBtn.addEventListener('click', () => {
      appealModal.classList.remove('open');
    });
  }
  if (cancelAppealBtn) {
    cancelAppealBtn.addEventListener('click', () => {
      appealModal.classList.remove('open');
    });
  }

  // Appeal Button click handler (opens modal)
  const opsDetailAppealBtn = document.getElementById('opsDetailAppealBtn');
  if (opsDetailAppealBtn) {
    opsDetailAppealBtn.addEventListener('click', () => {
      if (appealModal) {
        appealModal.classList.add('open');
        document.getElementById('appealSubmitForm').reset();
        appealPhotoPreview.innerHTML = '';
        appealImagesBase64 = [];
      }
    });
  }

  // Confirm Appeal form submit
  const appealSubmitForm = document.getElementById('appealSubmitForm');
  if (appealSubmitForm) {
    appealSubmitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const issue = state.selectedIssueForOps;
      if (!issue) return;

      if (appealImagesBase64.length === 0) {
        showToast('At least one additional photo is required');
        return;
      }

      const explanation = document.getElementById('appealExplanationInput').value.trim();

      try {
        const res = await fetch(`/api/issues/${issue.id}/appeal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appealMessage: explanation,
            additionalImages: appealImagesBase64
          })
        });

        if (res.ok) {
          appealModal.classList.remove('open');
          showToast('Additional evidence submitted. Report is now Pending Review.');
          const updated = await res.json();
          state.selectedIssueForOps = updated;
          renderOpsDetailPanel(updated);
          fetchIssues();
        } else {
          showToast('Error submitting appeal');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error submitting appeal');
      }
    });
  }

  // Sidebar Drawer Comment Submission Form
  const detailCommentForm = document.getElementById('opsDetailCommentForm');
  if (detailCommentForm) {
    detailCommentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const issue = state.selectedIssueForOps;
      if (!issue) return;
      
      const input = document.getElementById('opsDetailCommentInput');
      const text = input.value.trim();
      if (!text) return;

      try {
        const res = await fetch(`/api/issues/${issue.id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        if (res.ok) {
          const newComment = await res.json();
          issue.comments.push(newComment);
          input.value = '';
          renderOpsDetailPanelComments(issue);
          showToast('Comment posted');
          
          // Refresh the main feed to update comment count badge on the card
          fetchIssues();
        }
      } catch (err) {
        console.error(err);
        showToast('Error posting comment');
      }
    });
  }

  // Supporting Attachment Event Listeners (Bounty 1)
  const attachmentFileInput = document.getElementById('attachmentFileInput');
  const attachmentFileName = document.getElementById('attachmentFileName');
  const attachmentFilePreviewContainer = document.getElementById('attachmentFilePreviewContainer');
  const attachmentFilePreview = document.getElementById('attachmentFilePreview');
  const saveAttachmentBtn = document.getElementById('saveAttachmentBtn');
  const removeAttachmentBtn = document.getElementById('removeAttachmentBtn');
  const attachmentUrlInput = document.getElementById('attachmentUrlInput');

  if (attachmentFileInput) {
    attachmentFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) {
        attachmentFileName.textContent = 'No image selected';
        attachmentFilePreviewContainer.style.display = 'none';
        attachmentFilePreview.src = '';
        selectedAttachmentBase64 = null;
        return;
      }

      attachmentFileName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (evt) => {
        selectedAttachmentBase64 = evt.target.result;
        attachmentFilePreview.src = evt.target.result;
        attachmentFilePreviewContainer.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  if (saveAttachmentBtn) {
    saveAttachmentBtn.addEventListener('click', async () => {
      const issue = state.selectedIssueForOps;
      if (!issue) return;

      const myAttachment = state.currentUser ? (issue.attachments || []).find(att => att.contributorId === state.currentUser.id || att.contributorId === state.currentUser.username) : null;
      const urlValue = attachmentUrlInput ? attachmentUrlInput.value.trim() : '';
      const payload = {
        attachmentImage: selectedAttachmentBase64 || (myAttachment ? myAttachment.attachmentImage : null),
        attachmentLink: urlValue || null
      };

      try {
        const res = await fetch(`/api/issues/${issue.id}/attachment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const result = await res.json();
          if (!issue.attachments) {
            issue.attachments = [];
          }
          const index = issue.attachments.findIndex(att => att.contributorId === state.currentUser.id || att.contributorId === state.currentUser.username);
          if (index !== -1) {
            if (result.attachmentImage || result.attachmentLink) {
              issue.attachments[index] = {
                id: result.id || issue.attachments[index].id,
                contributorId: result.contributorId,
                contributorName: result.contributorName,
                attachmentImage: result.attachmentImage,
                attachmentLink: result.attachmentLink,
                createdAt: new Date().toISOString()
              };
            } else {
              issue.attachments.splice(index, 1);
            }
          } else {
            issue.attachments.push({
              id: result.id || Date.now(),
              contributorId: result.contributorId,
              contributorName: result.contributorName,
              attachmentImage: result.attachmentImage,
              attachmentLink: result.attachmentLink,
              createdAt: new Date().toISOString()
            });
          }
          
          showToast('Attachment saved successfully');
          renderOpsDetailPanel(issue);
          fetchIssues();
        } else {
          const errData = await res.json();
          showToast(errData.error || 'Failed to save attachment');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error saving attachment');
      }
    });
  }

  if (removeAttachmentBtn) {
    removeAttachmentBtn.addEventListener('click', async () => {
      const issue = state.selectedIssueForOps;
      if (!issue) return;

      if (!confirm('Are you sure you want to remove your attachment?')) {
        return;
      }

      try {
        const res = await fetch(`/api/issues/${issue.id}/attachment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attachmentImage: null,
            attachmentLink: null
          })
        });

        if (res.ok) {
          if (issue.attachments) {
            const index = issue.attachments.findIndex(att => att.contributorId === state.currentUser.id || att.contributorId === state.currentUser.username);
            if (index !== -1) {
              issue.attachments.splice(index, 1);
            }
          }
          
          if (attachmentFileInput) attachmentFileInput.value = '';
          if (attachmentFileName) attachmentFileName.textContent = 'No image selected';
          if (attachmentFilePreviewContainer) attachmentFilePreviewContainer.style.display = 'none';
          if (attachmentFilePreview) attachmentFilePreview.src = '';
          if (attachmentUrlInput) attachmentUrlInput.value = '';
          selectedAttachmentBase64 = null;

          showToast('Attachment removed successfully');
          renderOpsDetailPanel(issue);
          fetchIssues();
        } else {
          const errData = await res.json();
          showToast(errData.error || 'Failed to remove attachment');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error removing attachment');
      }
    });
  }

}

// Track Modal State
let selectedAttachmentBase64 = null;
let trackMapInstance = null;
let trackMapMarker = null;

// Show report location on the Track Map
function showReportLocation(issue) {
  const trackModal = document.getElementById('trackModal');
  if (!trackModal) return;

  trackModal.classList.add('open');

  document.getElementById('trackModalTitle').textContent = issue.title;
  document.getElementById('trackLocationName').textContent = 'District: ' + issue.subLocation;

  let lat = 31.1471;
  let lng = 75.3412;
  let hasExact = false;

  if (issue.coordinates && issue.coordinates.lat && issue.coordinates.lng) {
    lat = issue.coordinates.lat;
    lng = issue.coordinates.lng;
    hasExact = true;
  } else if (districtCoords[issue.subLocation.toUpperCase()]) {
    const coords = districtCoords[issue.subLocation.toUpperCase()];
    lat = coords.lat;
    lng = coords.lng;
  }

  const coordsText = document.getElementById('trackCoordsText');
  if (hasExact) {
    coordsText.textContent = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    coordsText.style.backgroundColor = 'var(--color-accent-soft)';
    coordsText.style.color = 'var(--color-accent)';
  } else {
    coordsText.textContent = `📍 District Center`;
    coordsText.style.backgroundColor = '#f1f5f9';
    coordsText.style.color = 'var(--color-secondary-text)';
  }

  // Initialize or update tracking map
  setTimeout(() => {
    if (!trackMapInstance) {
      trackMapInstance = L.map('trackMap').setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(trackMapInstance);
    } else {
      trackMapInstance.setView([lat, lng], 14);
    }

    if (trackMapMarker) {
      trackMapMarker.setLatLng([lat, lng]);
    } else {
      trackMapMarker = L.marker([lat, lng]).addTo(trackMapInstance);
    }

    trackMapInstance.invalidateSize();
  }, 100);
}

// Show toast notifications
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon icon-sm">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================================
// MUNICIPALITY OPERATIONS DASHBOARD LOGIC
// ==========================================

// Calculate priority score for sorting the Review Queue
function calculatePriorityScore(issue) {
  const upvotes = issue.upvotes || 0;
  const createdAt = new Date(issue.createdAt);
  const hoursWaiting = Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60));

  // Score = upvotes (1.5) + hours waiting (0.15)
  return (upvotes * 1.5) + (hoursWaiting * 0.15);
}

async function fetchOpsData() {
  if (state.activePortal !== 'municipality') return;

  try {
    const issuesRes = await fetch('/api/issues');
    if (!issuesRes.ok) return;
    let issues = await issuesRes.json();

    // Filter issues by the municipality's assigned district
    issues = issues.filter(issue => issue.subLocation.toUpperCase() === MOCK_MUNICIPALITY_DISTRICT);

    // Support search query filter on Kanban columns
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      issues = issues.filter(issue => 
        issue.title.toLowerCase().includes(q) || 
        issue.description.toLowerCase().includes(q)
      );
    }

    // Render summaries
    renderOpsDashboardSummaries(issues);

    if (state.activeOpsTab === 'triage') {
      renderKanbanBoard(issues);
    } else if (state.activeOpsTab === 'resolved') {
      renderResolvedIssuesFeed(issues);
    } else if (state.activeOpsTab === 'notices') {
      const notices = await fetchNotices();
      renderOpsNoticesFeed(notices);
    }
  } catch (err) {
    console.error('Error fetching Ops data:', err);
  }
}

// Display three dashboard summary metrics cards (excluding Resolved Today)
function renderOpsDashboardSummaries(issues) {
  const pending = issues.filter(i => i.status === 'Review Queue' || i.status === 'Pending Review').length;
  const acknowledged = issues.filter(i => i.status === 'Acknowledged').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;

  document.getElementById('countPending').textContent = pending;
  document.getElementById('countAcknowledged').textContent = acknowledged;
  document.getElementById('countInProgress').textContent = inProgress;
}

// Render notices in Ops Notices Management Tab
function renderOpsNoticesFeed(notices) {
  const feed = document.getElementById('opsNoticesFeed');
  if (!feed) return;
  
  // Filter notices list by the municipality's assigned district
  const districtNotices = notices.filter(n => n.subLocation.toUpperCase() === MOCK_MUNICIPALITY_DISTRICT.toUpperCase());

  if (districtNotices.length === 0) {
    feed.innerHTML = '<p class="empty-notices-msg">No notices published yet.</p>';
    return;
  }

  feed.innerHTML = '';
  districtNotices.forEach(n => {
    feed.appendChild(NoticeCard(n));
  });
}

// Render Resolved reports in Resolved Issues tab
function renderResolvedIssuesFeed(issues) {
  const feed = document.getElementById('opsResolvedFeed');
  if (!feed) return;
  
  // Filter for resolved issues
  let resolvedIssues = issues.filter(i => i.status === 'Resolved');
  
  // Sort by resolution time (most recent first)
  resolvedIssues.sort((a, b) => {
    const timeA = a.timeline ? new Date(a.timeline[a.timeline.length - 1].timestamp).getTime() : new Date(a.createdAt).getTime();
    const timeB = b.timeline ? new Date(b.timeline[b.timeline.length - 1].timestamp).getTime() : new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  if (resolvedIssues.length === 0) {
    feed.innerHTML = '<p class="empty-resolved-msg">No resolved reports yet.</p>';
    return;
  }

  feed.innerHTML = '';
  resolvedIssues.forEach(issue => {
    // Reuse the exact same ReportPost component used by the public Explore feed
    feed.appendChild(ReportPost(issue));
  });
}

// Render Kanban Column Boards (excluding Resolved column)
function renderKanbanBoard(issues) {
  const wrapper = document.querySelector('.kanban-board-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';
  
  wrapper.appendChild(KanbanColumn('Review Queue', 'countColPending', 'cardsReviewQueue'));
  wrapper.appendChild(KanbanColumn('Acknowledged', 'countColAcknowledged', 'cardsAcknowledged'));
  wrapper.appendChild(KanbanColumn('In Progress', 'countColInProgress', 'cardsInProgress'));

  const cols = {
    'Review Queue': document.getElementById('cardsReviewQueue'),
    'Acknowledged': document.getElementById('cardsAcknowledged'),
    'In Progress': document.getElementById('cardsInProgress')
  };

  // Counts
  const counts = {
    'Review Queue': 0,
    'Acknowledged': 0,
    'In Progress': 0
  };

  // Sort Review Queue / Pending Review issues by score descending
  const reviewQueueIssues = issues
    .filter(i => i.status === 'Review Queue' || i.status === 'Pending Review')
    .sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));
  
  const acknowledgedIssues = issues.filter(i => i.status === 'Acknowledged');
  const inProgressIssues = issues.filter(i => i.status === 'In Progress');

  const renderList = [
    ...reviewQueueIssues,
    ...acknowledgedIssues,
    ...inProgressIssues
  ];

  renderList.forEach(issue => {
    if (issue.status === 'Rejected' || issue.status === 'Resolved') return;

    const key = issue.status === 'Pending Review' ? 'Review Queue' : issue.status;
    counts[key] += 1;
    const colContainer = cols[key];
    if (!colContainer) return;

    // Use Reusable Component: KanbanIssueCard
    const card = KanbanIssueCard(issue);
    colContainer.appendChild(card);
  });

  document.getElementById('countColPending').textContent = counts['Review Queue'];
  document.getElementById('countColAcknowledged').textContent = counts['Acknowledged'];
  document.getElementById('countColInProgress').textContent = counts['In Progress'];
}

// REST call to update status
async function updateIssueStatus(id, newStatus, resolutionImages = null, resolutionNote = null, rejectReason = null) {
  try {
    const body = { status: newStatus };
    if (resolutionImages) body.resolutionImages = resolutionImages;
    if (resolutionNote) body.resolutionNote = resolutionNote;
    if (rejectReason) {
      body.rejectReason = rejectReason;
      body.rejectionReason = rejectReason;
    }

    const res = await fetch(`/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      showToast(`Status updated to: ${newStatus}`);
      fetchOpsData();
      
      if (state.selectedIssueForOps && state.selectedIssueForOps.id === id) {
        const updated = await res.json();
        state.selectedIssueForOps = updated;
        renderOpsDetailPanel(updated);
      }
    } else {
      const data = await res.json();
      showToast(data.error || 'Failed to update report status');
    }
  } catch (err) {
    console.error(err);
    showToast('Network error updating status');
  }
}

// Side detail map
let opsDetailMapInstance = null;
let opsDetailMapMarker = null;

function cleanupOpsDetailMap() {
  if (opsDetailMapMarker) {
    opsDetailMapMarker.remove();
    opsDetailMapMarker = null;
  }
  if (opsDetailMapInstance) {
    opsDetailMapInstance.remove();
    opsDetailMapInstance = null;
  }
}

function exportIssueToPdf(issue) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('Failed to open export window. Please allow popups.');
    return;
  }

  // Get author name
  let authorName = issue.authorName;
  if (issue.isAnonymous) {
    authorName = "Anonymous";
  } else if (!authorName && issue.authorId) {
    const users = JSON.parse(localStorage.getItem('clear_users') || '[]');
    const found = users.find(u => u.id === issue.authorId || u.username.toLowerCase() === issue.authorId.toLowerCase());
    authorName = found ? found.username : issue.authorId;
  }
  if (!authorName) authorName = "Anonymous";

  // Date parsing
  const createdDateStr = new Date(issue.createdAt).toLocaleString();
  
  // Resolution Date
  const resolvedStep = issue.timeline ? issue.timeline.find(t => t.status === 'Resolved') : null;
  const resolvedDateStr = resolvedStep ? new Date(resolvedStep.timestamp).toLocaleString() : new Date(issue.createdAt).toLocaleString();

  // Get absolute URLs for images
  const getAbsoluteUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return window.location.origin + url;
  };

  const beforeImg = getIssueImages(issue)[0] || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60";
  const beforeImgUrl = getAbsoluteUrl(beforeImg);

  const afterImg = issue.resolutionImages && issue.resolutionImages[0] || "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60";
  const afterImgUrl = getAbsoluteUrl(afterImg);

  // Attachments HTML
  let attachmentsHtml = '';
  if (issue.attachments && issue.attachments.length > 0) {
    attachmentsHtml = `
      <div class="section-title">Supporting Evidence & Attachments</div>
      <ul class="attachments-list">
        ${issue.attachments.map(att => {
          const isMyAtt = state.currentUser && (att.contributorId === state.currentUser.id || att.contributorId === state.currentUser.username);
          const name = isMyAtt ? 'You' : att.contributorName;
          let attDetails = `<strong>Contributed by ${escapeHTML(name)}</strong>`;
          if (att.attachmentImage) {
            attDetails += `<div style="margin-top: 6px;"><img src="${getAbsoluteUrl(att.attachmentImage)}" style="max-height: 120px; border-radius: 4px; border: 1px solid #171F14;" /></div>`;
          }
          if (att.attachmentLink) {
            attDetails += `<div style="margin-top: 4px;"><a href="${att.attachmentLink}" target="_blank" style="color: #4F8B3B; text-decoration: underline;">${escapeHTML(att.attachmentLink)}</a></div>`;
          }
          return `<li class="attachment-item" style="display: block; margin-bottom: 12px; border: 1px solid #171F14; padding: 10px; border-radius: 4px; background: #FAFBF9;">${attDetails}</li>`;
        }).join('')}
      </ul>
    `;
  }

  // Comments HTML
  let commentsHtml = '';
  if (issue.comments && issue.comments.length > 0) {
    commentsHtml = `
      <div class="section-title">Resolution Comments & Discussion</div>
      <div class="comments-section">
        ${issue.comments.map(c => `
          <div class="comment-item">
            <div class="comment-meta">By ${escapeHTML(c.user)} &bull; ${new Date(c.timestamp).toLocaleString()}</div>
            <p class="comment-text">${escapeHTML(c.text)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // GPS coordinates
  let lat = 31.1471;
  let lng = 75.3412;
  let hasCoords = false;
  if (issue.coordinates && issue.coordinates.lat && issue.coordinates.lng) {
    lat = issue.coordinates.lat;
    lng = issue.coordinates.lng;
    hasCoords = true;
  } else if (districtCoords[issue.subLocation.toUpperCase()]) {
    const coords = districtCoords[issue.subLocation.toUpperCase()];
    lat = coords.lat;
    lng = coords.lng;
  }
  const gpsStr = hasCoords ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : `Approximate Center of ${issue.subLocation}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>C.L.E.A.R. Resolution Report - ${escapeHTML(issue.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Outfit:wght@700&display=swap" rel="stylesheet">
  <style>
    @media print {
      body {
        background-color: #FFFFFF !important;
        color: #171F14 !important;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #FAFBF9;
      color: #171F14;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 3px solid #171F14;
      border-radius: 8px;
      box-shadow: 6px 6px 0px #171F14;
      padding: 32px;
    }
    .report-header {
      border-bottom: 3px solid #171F14;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo-area h1 {
      font-family: 'Outfit', sans-serif;
      margin: 0;
      font-size: 28px;
      text-transform: uppercase;
      letter-spacing: -0.5px;
      color: #4F8B3B;
    }
    .logo-area p {
      margin: 4px 0 0 0;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
      color: #5C6E58;
    }
    .badge {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 20px;
      border: 2px solid #171F14;
      background-color: #E7F3EC;
      color: #2A7043;
    }
    .report-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      background-color: #FAFBF9;
      border: 2px solid #171F14;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 28px;
    }
    .meta-item {
      font-size: 13px;
    }
    .meta-item strong {
      display: block;
      font-family: 'Outfit', sans-serif;
      text-transform: uppercase;
      font-size: 11px;
      color: #5C6E58;
      margin-bottom: 4px;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      text-transform: uppercase;
      border-bottom: 2px solid #171F14;
      padding-bottom: 6px;
      margin-top: 32px;
      margin-bottom: 16px;
      color: #171F14;
      letter-spacing: 0.5px;
    }
    .description-box {
      font-size: 14px;
      line-height: 1.6;
      color: #171F14;
      margin-bottom: 20px;
      white-space: pre-wrap;
    }
    .photo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .photo-card {
      border: 2px solid #171F14;
      border-radius: 6px;
      overflow: hidden;
      background-color: #FAFBF9;
      box-shadow: 3px 3px 0px #171F14;
    }
    .photo-card img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      display: block;
      border-bottom: 2px solid #171F14;
    }
    .photo-card-label {
      padding: 8px 12px;
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #171F14;
      background-color: #FFFFFF;
    }
    .attachments-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .attachment-item {
      font-size: 13px;
      padding: 8px 12px;
      border: 1px solid #DDE5D7;
      border-radius: 4px;
      margin-bottom: 8px;
      background-color: #FAFBF9;
    }
    .comments-section {
      margin-top: 16px;
    }
    .comment-item {
      padding: 10px 12px;
      border: 2px solid #171F14;
      background-color: #FAFBF9;
      margin-bottom: 12px;
      border-radius: 6px;
      box-shadow: 2px 2px 0px #171F14;
    }
    .comment-meta {
      font-size: 11px;
      color: #5C6E58;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .comment-text {
      font-size: 13px;
      margin: 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #171F14;
      font-size: 11px;
      color: #5C6E58;
      font-weight: 600;
    }
    .print-bar {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      border: 2px solid #171F14;
    }
    .btn-primary {
      background-color: #4F8B3B;
      color: white;
      box-shadow: 3px 3px 0px #171F14;
    }
    .btn-primary:hover {
      background-color: #335A29;
    }
    .btn-secondary {
      background-color: white;
      color: #171F14;
      box-shadow: 3px 3px 0px #171F14;
    }
    .btn-secondary:hover {
      background-color: #FAFBF9;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn btn-secondary" onclick="window.close()">Close</button>
  </div>

  <div class="report-container">
    <div class="report-header">
      <div class="logo-area">
        <h1>C.L.E.A.R.</h1>
        <p>Civic Action Resolution Report</p>
      </div>
      <div class="badge">RESOLVED</div>
    </div>

    <div class="report-meta">
      <div class="meta-item">
        <strong>Report Title</strong>
        ${escapeHTML(issue.title)}
      </div>
      <div class="meta-item">
        <strong>District & Coordinates</strong>
        ${escapeHTML(issue.subLocation)} (${gpsStr})
      </div>
      <div class="meta-item">
        <strong>Reported By</strong>
        ${escapeHTML(authorName)}
      </div>
      <div class="meta-item">
        <strong>Report Date</strong>
        ${createdDateStr}
      </div>
      <div class="meta-item">
        <strong>Status</strong>
        ${issue.status}
      </div>
      <div class="meta-item">
        <strong>Resolution Date</strong>
        ${resolvedDateStr}
      </div>
    </div>

    <div class="section-title">Original Civic Report</div>
    <div class="description-box">
      ${escapeHTML(issue.description || 'No description provided.')}
    </div>

    <div class="section-title">Resolution Summary</div>
    <div class="description-box">
      <strong>Resolution Note:</strong><br>
      ${escapeHTML(issue.resolutionNote || 'No resolution note provided.')}
    </div>
    
    ${issue.internalNotes ? `
    <div class="description-box" style="margin-top: 12px;">
      <strong>Operations Completion Note:</strong><br>
      ${escapeHTML(issue.internalNotes)}
    </div>
    ` : ''}

    <div class="section-title">Visual Comparison Evidence</div>
    <div class="photo-grid">
      <div class="photo-card">
        <img src="${beforeImgUrl}" alt="Before image" />
        <div class="photo-card-label">Before (As Reported)</div>
      </div>
      <div class="photo-card">
        <img src="${afterImgUrl}" alt="After image" />
        <div class="photo-card-label">After (Resolved)</div>
      </div>
    </div>

    ${attachmentsHtml}

    ${commentsHtml}

    <div class="footer">
      This document is a certified resolution report generated by the C.L.E.A.R. Civic Platform.
    </div>
  </div>

  <script>
    // Auto-open print dialog on load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function openOpsDetailPanel(issue) {
  state.selectedIssueForOps = issue;
  document.getElementById('opsSidePanel').classList.add('open');
  renderOpsDetailPanel(issue);
}

function renderOpsDetailPanelComments(issue) {
  const commentsList = document.getElementById('opsDetailCommentsList');
  if (!commentsList) return;
  commentsList.innerHTML = '';
  if (issue.comments && issue.comments.length > 0) {
    commentsList.innerHTML = issue.comments.map(c => `
      <div class="comment-item" style="padding: 8px 10px; background-color: var(--color-bg); border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 6px;">
        <div class="comment-meta" style="display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-muted); margin-bottom: 4px;">
          <span style="font-weight: 700;">${escapeHTML(c.user)}</span>
          <span>${escapeHTML(c.timestamp)}</span>
        </div>
        <p class="comment-text" style="font-size: 12.5px; margin: 0; line-height: 1.4;">${escapeHTML(c.text)}</p>
      </div>
    `).join('');
  } else {
    commentsList.innerHTML = '<p style="font-size:12px;color:var(--color-text-muted);padding:4px 0;">No comments yet. Start the resolution discussion!</p>';
  }
}

function renderPublicTimelineHTML(issue) {
  let reportedTime = '';
  let acknowledgedTime = '';
  let inProgressTime = '';
  let resolvedTime = '';

  if (issue.timeline) {
    issue.timeline.forEach(t => {
      const formatted = new Date(t.timestamp).toLocaleDateString() + ' ' + new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (t.status === 'Review Queue') reportedTime = formatted;
      else if (t.status === 'Acknowledged') acknowledgedTime = formatted;
      else if (t.status === 'In Progress') inProgressTime = formatted;
      else if (t.status === 'Resolved') resolvedTime = formatted;
    });
  }

  return `
    <div class="card-timeline-section" style="margin-top: 16px; border-top: 1px dashed var(--color-border); padding-top: 16px;">
      <div class="timeline-title" style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 12px;">Public Resolution Timeline</div>
      <div class="timeline-steps-flow" style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
        <div class="step-flow done" style="display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1;">
          <span class="step-name" style="font-size: 11px; font-weight: 700; color: #16a34a;">Reported</span>
          <span class="step-time" style="font-size: 9px; color: var(--color-text-muted); margin-top: 2px;">${reportedTime || 'Pending'}</span>
        </div>
        <div class="step-line active" style="flex-grow: 1; height: 2px; background-color: #16a34a; margin-top: -12px;"></div>
        <div class="step-flow done" style="display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1;">
          <span class="step-name" style="font-size: 11px; font-weight: 700; color: #16a34a;">Acknowledged</span>
          <span class="step-time" style="font-size: 9px; color: var(--color-text-muted); margin-top: 2px;">${acknowledgedTime || 'Pending'}</span>
        </div>
        <div class="step-line active" style="flex-grow: 1; height: 2px; background-color: #16a34a; margin-top: -12px;"></div>
        <div class="step-flow done" style="display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1;">
          <span class="step-name" style="font-size: 11px; font-weight: 700; color: #16a34a;">In Progress</span>
          <span class="step-time" style="font-size: 9px; color: var(--color-text-muted); margin-top: 2px;">${inProgressTime || 'Pending'}</span>
        </div>
        <div class="step-line active" style="flex-grow: 1; height: 2px; background-color: #16a34a; margin-top: -12px;"></div>
        <div class="step-flow done" style="display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1;">
          <span class="step-name" style="font-size: 11px; font-weight: 700; color: #16a34a;">Resolved</span>
          <span class="step-time" style="font-size: 9px; color: var(--color-text-muted); margin-top: 2px;">${resolvedTime || 'Pending'}</span>
        </div>
      </div>
    </div>
  `;
}

function renderOpsDetailPanel(issue) {
  const exportBtn = document.getElementById('exportReportPdfBtn');
  if (exportBtn) {
    if (issue.status === 'Resolved') {
      exportBtn.style.display = 'inline-flex';
    } else {
      exportBtn.style.display = 'none';
    }
  }

  document.getElementById('opsDetailTitle').textContent = issue.title;
  
  // Set labels dynamically for appealed reports
  const generalTitleEl = document.getElementById('opsDetailGeneralTitle');
  const evidenceTitleEl = document.getElementById('opsDetailEvidenceTitle');
  const imagesLabelEl = document.getElementById('opsDetailImagesLabel');
  const descLabelEl = document.getElementById('opsDetailDescLabel');

  const hasAppeal = !!(issue.appealMessage || (issue.additionalImages && issue.additionalImages.length > 0));

  if (generalTitleEl) {
    generalTitleEl.textContent = hasAppeal ? "Original Report" : "General";
  }
  if (evidenceTitleEl) {
    evidenceTitleEl.textContent = hasAppeal ? "Original Evidence" : "Evidence";
  }
  if (imagesLabelEl) {
    imagesLabelEl.textContent = hasAppeal ? "Original Images" : "Images";
  }
  if (descLabelEl) {
    descLabelEl.textContent = hasAppeal ? "Original Description" : "Description";
  }
  
  // Get author name
  let authorName = issue.authorName;
  if (issue.isAnonymous) {
    authorName = "Anonymous";
  } else {
    if (!authorName && issue.authorId) {
      const users = JSON.parse(localStorage.getItem('clear_users') || '[]');
      const found = users.find(u => u.id === issue.authorId || u.username.toLowerCase() === issue.authorId.toLowerCase());
      if (found) {
        authorName = found.username;
      } else {
        authorName = issue.authorId;
      }
    }
    if (!authorName) {
      authorName = "Anonymous";
    }
  }

  const authorEl = document.getElementById('opsDetailAuthor');
  if (authorEl) {
    authorEl.innerHTML = `Posted by ${escapeHTML(authorName)} &bull; ${escapeHTML(issue.subLocation)} &bull; ${timeAgo(issue.createdAt)}`;
  }

  document.getElementById('opsDetailDistrict').textContent = issue.subLocation;
  
  const statusEl = document.getElementById('opsDetailStatus');
  statusEl.textContent = issue.status;
  let statusClass = '';
  if (issue.status === 'Review Queue' || issue.status === 'Pending Review') statusClass = 'status-review-queue';
  else if (issue.status === 'Acknowledged') statusClass = 'status-acknowledged';
  else if (issue.status === 'In Progress') statusClass = 'status-in-progress';
  else if (issue.status === 'Resolved') statusClass = 'status-resolved';
  else if (issue.status === 'Rejected') statusClass = 'status-rejected';
  statusEl.className = `status-badge-inline ${statusClass}`;
  statusEl.style.textTransform = 'uppercase';
  statusEl.style.fontSize = '10px';
  statusEl.style.fontWeight = '700';
  statusEl.style.padding = '2px 8px';
  statusEl.style.borderRadius = '12px';
  statusEl.style.border = '1px solid';
  statusEl.style.display = 'inline-block';

  document.getElementById('opsDetailDesc').textContent = issue.description || 'No description supplied.';

  const linksContainer = document.getElementById('opsDetailLinksContainer');
  const linksUl = document.getElementById('opsDetailLinks');
  if (issue.links && issue.links.length > 0) {
    linksContainer.style.display = 'block';
    linksUl.innerHTML = issue.links.map(l => `<li><a href="${l}" target="_blank" rel="noopener noreferrer">${escapeHTML(l)}</a></li>`).join('');
  } else {
    linksContainer.style.display = 'none';
  }

  const gallery = document.getElementById('opsDetailPhotos');
  const detailImages = getIssueImages(issue);
  gallery.innerHTML = detailImages.map(img => `<img src="${img}" class="ops-detail-photo" alt="Details photo" onclick="window.open('${img}')">`).join('');

  // --- Supporting Attachment (Bounty 1) ---
  const attachmentDisplay = document.getElementById('opsDetailAttachmentDisplay');
  const attachmentContent = document.getElementById('opsDetailAttachmentContent');
  const attachmentInputContainer = document.getElementById('opsDetailAttachmentInputContainer');

  const attachmentFileInput = document.getElementById('attachmentFileInput');
  const attachmentFileName = document.getElementById('attachmentFileName');
  const attachmentFilePreviewContainer = document.getElementById('attachmentFilePreviewContainer');
  const attachmentFilePreview = document.getElementById('attachmentFilePreview');
  const attachmentUrlInput = document.getElementById('attachmentUrlInput');
  const removeAttachmentBtn = document.getElementById('removeAttachmentBtn');

  // Find current user's attachment for this issue (if exists)
  const myAttachment = state.currentUser ? (issue.attachments || []).find(att => att.contributorId === state.currentUser.id || att.contributorId === state.currentUser.username) : null;

  if (attachmentFileInput) attachmentFileInput.value = '';
  if (attachmentFileName) attachmentFileName.textContent = 'No image selected';
  if (attachmentFilePreviewContainer) attachmentFilePreviewContainer.style.display = 'none';
  if (attachmentFilePreview) attachmentFilePreview.src = '';
  if (attachmentUrlInput) attachmentUrlInput.value = myAttachment ? (myAttachment.attachmentLink || '') : '';
  selectedAttachmentBase64 = null;

  if (issue.attachments && issue.attachments.length > 0) {
    if (attachmentDisplay) attachmentDisplay.style.display = 'block';
    
    let html = `
      <details class="evidence-collapsible" style="border: 2px solid var(--color-border); border-radius: var(--radius-sm); background-color: var(--color-bg); margin-bottom: 12px; box-shadow: 2px 2px 0 var(--color-border);">
        <summary style="font-weight: 700; font-size: 11px; padding: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; text-transform: uppercase; color: var(--color-text-main);">
          <span>Show Attachments (${issue.attachments.length})</span>
          <span style="font-size: 10px; transition: transform 0.2s;">▼</span>
        </summary>
        <div style="padding: 10px; border-top: 2px solid var(--color-border); display: flex; flex-direction: column; gap: 12px; background-color: var(--color-bg);">
    `;
    for (const att of issue.attachments) {
      const isMyAtt = state.currentUser && (att.contributorId === state.currentUser.id || att.contributorId === state.currentUser.username);
      const displayName = isMyAtt ? 'You' : att.contributorName;
      
      html += `
        <div style="padding: 10px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background-color: var(--color-bg); position: relative;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-text-subtle); display: block; margin-bottom: 6px;">Contributed by ${escapeHTML(displayName)}</span>
      `;
      if (att.attachmentImage) {
        html += `<div style="margin-bottom: 6px;"><img src="${att.attachmentImage}" class="ops-detail-photo" alt="Attached evidence" onclick="window.open('${att.attachmentImage}')" style="max-height: 120px; cursor: pointer; object-fit: contain;"></div>`;
      }
      if (att.attachmentLink) {
        html += `<div><a href="${att.attachmentLink}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--color-primary); text-decoration: underline;">${escapeHTML(att.attachmentLink)}</a></div>`;
      }
      html += `</div>`;
    }
    html += `
        </div>
      </details>
    `;
    
    if (attachmentContent) attachmentContent.innerHTML = html;
  } else {
    if (attachmentDisplay) attachmentDisplay.style.display = 'none';
    if (attachmentContent) attachmentContent.innerHTML = '';
  }

  if (myAttachment) {
    if (removeAttachmentBtn) removeAttachmentBtn.style.display = 'inline-block';
  } else {
    if (removeAttachmentBtn) removeAttachmentBtn.style.display = 'none';
  }

  const isAuthenticated = !!state.currentUser;
  if (isAuthenticated) {
    if (attachmentInputContainer) attachmentInputContainer.style.display = 'block';
  } else {
    if (attachmentInputContainer) attachmentInputContainer.style.display = 'none';
  }

  // Render comments
  renderOpsDetailPanelComments(issue);

  // Toggle Municipality panel group contents
  const resContainer = document.getElementById('opsDetailResolutionContainer');
  const resPhotos = document.getElementById('opsDetailResolutionPhotos');
  const resNote = document.getElementById('opsDetailResolutionNote');

  if (issue.status === 'Resolved') {
    resContainer.style.display = 'block';
    
    // Extract resolved date
    const resolvedStep = issue.timeline ? issue.timeline.find(t => t.status === 'Resolved') : null;
    const resolvedDate = resolvedStep ? new Date(resolvedStep.timestamp).toLocaleDateString() : new Date(issue.createdAt).toLocaleDateString();
    
    // Before image (mandatory, fallback to placeholder)
    const beforeImg = getIssueImages(issue)[0] || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60";
    // After image (resolution, fallback to placeholder)
    let afterImg = issue.resolutionImages && issue.resolutionImages[0];
    if (!afterImg) {
      afterImg = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60";
    }

    resPhotos.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-subtle); display: block; margin-bottom: 4px;">Before (Reported)</span>
          <img src="${beforeImg}" alt="Report before photo" onclick="window.open('${beforeImg}')" style="width: 100%; height: 120px; border-radius: 4px; object-fit: cover; cursor: pointer; border: 1px solid var(--color-border);" />
        </div>
        <div>
          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-subtle); display: block; margin-bottom: 4px;">After (Resolved)</span>
          <img src="${afterImg}" alt="Report after photo" onclick="window.open('${afterImg}')" style="width: 100%; height: 120px; border-radius: 4px; object-fit: cover; cursor: pointer; border: 1px solid var(--color-border);" />
        </div>
      </div>
    `;

    resNote.innerHTML = `
      <div style="margin-bottom: 8px;">
        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-subtle); display: block;">Resolution Note</span>
        <p style="margin-top: 2px; font-size: 13px; line-height: 1.45; color: var(--color-text-main);">${escapeHTML(issue.resolutionNote || 'No resolution note provided.')}</p>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-subtle); display: block;">Municipality Completion Note</span>
        <p style="margin-top: 2px; font-size: 13px; line-height: 1.45; color: var(--color-text-main);">${escapeHTML(issue.internalNotes || 'No completion notes provided.')}</p>
      </div>
      <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--color-border);">
        Completion Date: <strong>${resolvedDate}</strong>
      </div>
    `;
  } else {
    resContainer.style.display = 'none';
  }

  // Render Timeline if resolved
  const timelineContainer = document.getElementById('opsDetailTimeline');
  if (timelineContainer) {
    if (issue.status === 'Resolved') {
      timelineContainer.style.display = 'block';
      timelineContainer.innerHTML = renderPublicTimelineHTML(issue);
    } else {
      timelineContainer.style.display = 'none';
    }
  }

  // Toggle Status Actions based on active portal
  const statusActionsField = document.getElementById('opsDetailStatusActionsField');
  if (statusActionsField) {
    if (state.activePortal === 'municipality') {
      statusActionsField.style.display = 'block';
      renderTriageActionRibbon(issue);
    } else {
      statusActionsField.style.display = 'none';
    }
  }

  // Toggle Municipality panel-group container visibility
  const municipalityGroup = document.getElementById('opsDetailMunicipalityGroup');
  if (municipalityGroup) {
    if (state.activePortal === 'municipality' || issue.status === 'Resolved') {
      municipalityGroup.style.display = 'block';
    } else {
      municipalityGroup.style.display = 'none';
    }
  }

  // Rejection details display toggle
  const rejectionGroup = document.getElementById('opsDetailRejectionGroup');
  if (rejectionGroup) {
    if (issue.status === 'Rejected') {
      rejectionGroup.style.display = 'block';
      const reasonEl = document.getElementById('opsDetailRejectionReason');
      if (reasonEl) {
        reasonEl.textContent = issue.rejectionReason || 'No reason specified.';
      }
      
      const appealActionContainer = document.getElementById('opsDetailAppealActionContainer');
      if (appealActionContainer) {
        if (state.activePortal === 'public' && issue.authorId === state.currentUser.id) {
          appealActionContainer.style.display = 'block';
        } else {
          appealActionContainer.style.display = 'none';
        }
      }
    } else {
      rejectionGroup.style.display = 'none';
    }
  }

  // Appeal details display toggle
  const appealGroup = document.getElementById('opsDetailAppealGroup');
  if (appealGroup) {
    if (issue.appealMessage || (issue.additionalImages && issue.additionalImages.length > 0)) {
      appealGroup.style.display = 'block';
      
      const explanationContainer = document.getElementById('opsDetailAppealExplanationContainer');
      const explanationEl = document.getElementById('opsDetailAppealExplanation');
      if (issue.appealMessage) {
        explanationContainer.style.display = 'block';
        explanationEl.textContent = issue.appealMessage;
      } else {
        explanationContainer.style.display = 'none';
      }

      const imagesContainer = document.getElementById('opsDetailAppealImagesContainer');
      const photosEl = document.getElementById('opsDetailAppealPhotos');
      if (issue.additionalImages && issue.additionalImages.length > 0) {
        imagesContainer.style.display = 'block';
        photosEl.innerHTML = issue.additionalImages.map(img => 
          `<img src="${img}" class="ops-detail-photo" alt="Appeal details photo" onclick="window.open('${img}')">`
        ).join('');
      } else {
        imagesContainer.style.display = 'none';
      }
    } else {
      appealGroup.style.display = 'none';
    }
  }

  cleanupOpsDetailMap();
  setTimeout(() => {
    let lat = 31.1471;
    let lng = 75.3412;
    let hasCoords = false;

    if (issue.coordinates && issue.coordinates.lat && issue.coordinates.lng) {
      lat = issue.coordinates.lat;
      lng = issue.coordinates.lng;
      hasCoords = true;
    } else if (districtCoords[issue.subLocation.toUpperCase()]) {
      const coords = districtCoords[issue.subLocation.toUpperCase()];
      lat = coords.lat;
      lng = coords.lng;
    }

    document.getElementById('opsDetailCoords').textContent = hasCoords ? `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : `Approximate Center: ${issue.subLocation}`;

    opsDetailMapInstance = L.map('opsDetailMap').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(opsDetailMapInstance);

    opsDetailMapMarker = L.marker([lat, lng]).addTo(opsDetailMapInstance);
    opsDetailMapInstance.invalidateSize();
  }, 200);
}

// Build action triage ribbon based on status flow
function renderTriageActionRibbon(issue) {
  const ribbon = document.getElementById('triageActionRibbon');
  if (!ribbon) return;
  ribbon.innerHTML = '';
  ribbon.appendChild(MunicipalityActionPanel(issue));
}

// Helper to escape HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Helper to filter districts in the sidebar dropdown list
function filterDistricts(query) {
  const q = query.toLowerCase().trim();
  const buttons = document.querySelectorAll('#sublocationList .sublocation-btn');
  buttons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    const li = btn.parentElement;
    if (li) {
      if (text.includes(q) || btn.dataset.sub === '') {
        li.style.display = 'block';
      } else {
        li.style.display = 'none';
      }
    }
  });
}
