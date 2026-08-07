// Application State
const state = {
  activePortal: 'landing', // 'landing', 'public', 'municipality'
  currentSubLocation: '',
  showMyIssues: false,
  showFollowedOnly: false,
  showNoticesOnly: false,
  searchQuery: '',
  currentUser: {
    username: 'user',
    role: 'Resident Reporter'
  },
  activeOpsTab: 'triage', // 'triage', 'notices'
  selectedIssueForOps: null
};

const MOCK_MUNICIPALITY_DISTRICT = 'LUDHIANA';
const MOCK_MUNICIPALITY_STATE = 'Punjab';

// Map and attachments editor state
let mapInstance = null;
let mapMarker = null;
let selectedCoordinates = null;
let attachedImages = [];
let attachedLinks = [];

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

function initApp() {
  fetchUser();
  setupEventListeners();
  switchPortal('landing');
}

// Switch between Role selector landing vs app portals
function switchPortal(portalName) {
  state.activePortal = portalName;
  
  // Close details overlay if open
  document.getElementById('opsSidePanel').classList.remove('open');
  cleanupOpsDetailMap();
  
  if (portalName === 'landing') {
    landingPortal.style.display = 'flex';
    mainAppLayout.style.display = 'none';
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
      
      document.getElementById('roleHeaderBadge').textContent = 'CIVIC PORTAL';
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
      
      document.getElementById('roleHeaderBadge').textContent = `MUNICIPAL OPS • ${MOCK_MUNICIPALITY_DISTRICT}`;
      document.getElementById('userRoleLabel').textContent = `Operations Officer (${MOCK_MUNICIPALITY_DISTRICT})`;
      
      // Select Triage tab by default
      switchOpsTab('triage');
    }
  }
}

// Switch Municipal Sub-tabs
function switchOpsTab(tabName) {
  state.activeOpsTab = tabName;
  
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

async function fetchUser() {
  try {
    const res = await fetch('/api/user');
    if (res.ok) {
      const user = await res.json();
      state.currentUser = user;
      document.getElementById('usernameLabel').textContent = user.username;
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
  if (state.showMyIssues) params.append('myIssues', 'true');
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
    // Filter out rejected issues
    if (issue.status === 'Rejected') return false;
    // Explorer (active feed) should NEVER display resolved reports
    if (!state.showFollowedOnly && issue.status === 'Resolved') return false;
    return true;
  });

  if (filteredIssues.length === 0) {
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

  // Order:
  // Title
  // District (No Status badge)
  // Image (mandatory)
  // Description preview
  // Action bar
  card.innerHTML = `
    <h3 class="post-card-title">${escapeHTML(issue.title)}</h3>
    <div class="post-card-meta">
      <span class="post-card-district">${escapeHTML(issue.subLocation)}</span>
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

// Setup Event Listeners
function setupEventListeners() {
  // Portal selector triggers
  document.getElementById('enterPublicBtn').addEventListener('click', () => switchPortal('public'));
  document.getElementById('enterMunicipalBtn').addEventListener('click', () => switchPortal('municipality'));
  document.getElementById('headerRoleSwitcherBtn').addEventListener('click', () => switchPortal('landing'));
  document.getElementById('menuSwitchRoleBtn').addEventListener('click', () => {
    profileDropdown.classList.remove('open');
    switchPortal('landing');
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
  });

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
    try {
      const res = await fetch('/api/user/logout', { method: 'POST' });
      if (res.ok) {
        showToast('Logged out successfully (Simulated)');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Editor helper functions for location, photos, and links
  function resetEditorState() {
    selectedCoordinates = null;
    attachedImages = [];
    attachedLinks = [];

    // Reset form fields
    createIssueForm.reset();

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
          links: attachedLinks
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
    if (sublocationList && !sublocationList.contains(e.target) && !locationBoxBtn.contains(e.target)) {
      sublocationList.classList.remove('open');
      locationBoxBtn.classList.remove('open');
      locationBoxBtn.setAttribute('aria-expanded', 'false');
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



  // Ops Notices form submit handler
  document.getElementById('noticePublishForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value.trim();
    const description = document.getElementById('noticeDescription').value.trim();
    const subLocation = document.getElementById('noticeDistrict').value;
    const type = document.getElementById('noticeType').value;
    const expiryDate = document.getElementById('noticeExpiry').value;

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
        document.getElementById('noticePublishForm').reset();
        fetchOpsData(); // Reload ops bulletins
      } else {
        showToast('Failed to publish bulletin');
      }
    } catch (err) {
      console.error(err);
    }
  });

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


}

// Track Modal State
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
  const pending = issues.filter(i => i.status === 'Review Queue').length;
  const acknowledged = issues.filter(i => i.status === 'Acknowledged').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;

  document.getElementById('countPending').textContent = pending;
  document.getElementById('countAcknowledged').textContent = acknowledged;
  document.getElementById('countInProgress').textContent = inProgress;
}

// Render notices in Ops Notices Management Tab
function renderOpsNoticesFeed(notices) {
  const feed = document.getElementById('opsNoticesFeed');
  
  // Filter notices list by the municipality's assigned district
  notices = notices.filter(n => n.subLocation.toUpperCase() === MOCK_MUNICIPALITY_DISTRICT);

  if (notices.length === 0) {
    feed.innerHTML = '<p class="empty-notices-msg">No notices published yet.</p>';
    return;
  }

  feed.innerHTML = '';
  notices.forEach(n => {
    const item = document.createElement('div');
    item.className = 'ops-notice-card-item';
    
    let typeClass = 'type-advisory';
    if (n.type === 'Warning') typeClass = 'type-warning';
    else if (n.type === 'Public Notice') typeClass = 'type-public-notice';
    else if (n.type === 'Drive / Campaign') typeClass = 'type-drive-campaign';

    item.innerHTML = `
      <div class="ops-notice-card-header">
        <h4 class="ops-notice-card-title">${escapeHTML(n.title)}</h4>
        <span class="ops-notice-badge ${typeClass}">${escapeHTML(n.type)}</span>
      </div>
      <p class="ops-notice-desc" style="margin-top:0;">${escapeHTML(n.description)}</p>
      <div class="ops-notice-meta">
        <span>District: <strong>${escapeHTML(n.subLocation)}</strong></span>
        <span>Published: ${new Date(n.createdAt).toLocaleDateString()}</span>
      </div>
    `;
    feed.appendChild(item);
  });
}

// Render Resolved reports in Resolved Issues tab
function renderResolvedIssuesFeed(issues) {
  const feed = document.getElementById('opsResolvedFeed');
  
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
    const card = document.createElement('div');
    card.className = 'ops-resolved-card-item';
    
    // Check if custom resolution images exist, fallback to placeholder
    const resImgs = (issue.resolutionImages && issue.resolutionImages.length > 0)
      ? issue.resolutionImages
      : ["https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60"];

    const resolutionPhotosHTML = `
      <div class="ops-resolved-card-photos">
        ${resImgs.map(img => `<img src="${img}" alt="Resolution proof" onclick="window.open('${img}')">`).join('')}
      </div>
    `;
    
    // Get citizen images, fallback to placeholder
    const citizenImages = getIssueImages(issue);
    const citizenPhotosHTML = `
      <div class="ops-resolved-card-photos" style="margin-bottom: 8px;">
        <span style="font-size: 11px; color: var(--color-muted-text); display: block; width: 100%;">Citizen Proof:</span>
        ${citizenImages.map(img => `<img src="${img}" alt="Citizen report photo" onclick="window.open('${img}')" style="height: 60px;">`).join('')}
      </div>
    `;

    const resolvedDate = issue.timeline 
      ? new Date(issue.timeline.filter(t => t.status === 'Resolved')[0]?.timestamp || issue.createdAt).toLocaleDateString()
      : new Date(issue.createdAt).toLocaleDateString();

    card.innerHTML = `
      <div class="ops-resolved-card-header">
        <h4 class="ops-resolved-card-title">${escapeHTML(issue.title)}</h4>
        <div class="ops-resolved-card-meta">
          <span>District: <strong>${escapeHTML(issue.subLocation)}</strong></span>
          <span>&bull;</span>
          <span>Resolved Date: <strong>${resolvedDate}</strong></span>
        </div>
      </div>
      <p class="ops-resolved-card-desc">${escapeHTML(issue.description || 'No description supplied.')}</p>
      ${citizenPhotosHTML}
      <div class="ops-resolved-card-resolution">
        <strong>Resolution Action:</strong>
        <p>${escapeHTML(issue.resolutionNote || 'No resolution note provided.')}</p>
        ${resolutionPhotosHTML}
      </div>
    `;
    
    feed.appendChild(card);
  });
}

// Render Kanban Column Boards (excluding Resolved column)
function renderKanbanBoard(issues) {
  const cols = {
    'Review Queue': document.getElementById('cardsReviewQueue'),
    'Acknowledged': document.getElementById('cardsAcknowledged'),
    'In Progress': document.getElementById('cardsInProgress')
  };

  // Reset columns
  Object.values(cols).forEach(col => {
    if (col) col.innerHTML = '';
  });

  // Counts
  const counts = {
    'Review Queue': 0,
    'Acknowledged': 0,
    'In Progress': 0
  };

  // Sort Review Queue issues by score descending
  const reviewQueueIssues = issues
    .filter(i => i.status === 'Review Queue')
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

    counts[issue.status] += 1;
    const colContainer = cols[issue.status];
    if (!colContainer) return;

    const card = document.createElement('div');
    card.className = 'ops-issue-card';
    card.id = `ops-card-${issue.id}`;

    // Build Review Queue button triage ribbon
    let actionsHTML = '';
    if (issue.status === 'Review Queue') {
      actionsHTML = `
        <div class="ops-card-actions">
          <button class="btn-ops-action btn-ops-ack" data-action="ack" title="Move report to Acknowledged">Acknowledge</button>
          <button class="btn-ops-action btn-ops-rej" data-action="rej" title="Reject this report">Reject</button>
          <button class="btn-ops-action btn-ops-dup" data-action="dup" title="Flag report as a duplicate citation">Mark Duplicate</button>
        </div>
      `;
    }

    card.innerHTML = `
      <h4 class="ops-card-title">${escapeHTML(issue.title)}</h4>
      <div class="ops-card-meta">
        <span class="ops-card-district">${escapeHTML(issue.subLocation)}</span>
      </div>
      ${actionsHTML}
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.ops-card-actions')) return;
      openOpsDetailPanel(issue);
    });

    if (issue.status === 'Review Queue') {
      card.querySelector('.btn-ops-ack').addEventListener('click', async (e) => {
        e.stopPropagation();
        await updateIssueStatus(issue.id, 'Acknowledged');
      });

      card.querySelector('.btn-ops-rej').addEventListener('click', async (e) => {
        e.stopPropagation();
        const reason = prompt('Please specify a rejection reason:');
        if (reason === null) return;
        await updateIssueStatus(issue.id, 'Rejected', null, null, reason || 'Rejected by staff review');
      });

      card.querySelector('.btn-ops-dup').addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Duplicate flag marked (Triage placeholder)');
      });
    }

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
    if (rejectReason) body.rejectReason = rejectReason;

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
  document.getElementById('opsDetailTitle').textContent = issue.title;
  document.getElementById('opsDetailDistrict').textContent = issue.subLocation;
  
  const statusEl = document.getElementById('opsDetailStatus');
  statusEl.textContent = issue.status;
  statusEl.className = 'val-text';

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

  // Render comments
  renderOpsDetailPanelComments(issue);

  // Toggle Municipality panel group contents
  const resContainer = document.getElementById('opsDetailResolutionContainer');
  const resPhotos = document.getElementById('opsDetailResolutionPhotos');
  const resNote = document.getElementById('opsDetailResolutionNote');

  if (issue.status === 'Resolved' && issue.resolutionNote) {
    resContainer.style.display = 'block';
    
    // Extract resolved date
    const resolvedStep = issue.timeline ? issue.timeline.find(t => t.status === 'Resolved') : null;
    const resolvedDate = resolvedStep ? new Date(resolvedStep.timestamp).toLocaleDateString() : new Date(issue.createdAt).toLocaleDateString();
    
    resNote.innerHTML = `
      <div><strong>Resolution Summary Note:</strong></div>
      <p style="margin-top: 4px; line-height: 1.45;">${escapeHTML(issue.resolutionNote)}</p>
      <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 8px;">Resolved on: <strong>${resolvedDate}</strong></div>
    `;
    
    let resImgs = issue.resolutionImages;
    if (!resImgs || resImgs.length === 0) {
      resImgs = ["https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60"];
    }
    resPhotos.innerHTML = resImgs.map(img => `<img src="${img}" alt="Resolved proof" onclick="window.open('${img}')" style="max-height:120px; border-radius:4px; object-fit:cover; cursor:pointer;">`).join('');
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
  ribbon.innerHTML = '';

  const label = document.createElement('span');
  label.style.fontWeight = '500';
  label.style.fontSize = '12px';
  label.style.color = 'var(--color-secondary-text)';
  label.style.marginRight = 'auto';
  label.style.alignSelf = 'center';
  
  if (issue.status === 'Review Queue') {
    label.textContent = 'Awaiting triage decision:';
    ribbon.appendChild(label);

    const ackBtn = document.createElement('button');
    ackBtn.className = 'btn btn-ops-triage btn-ops-triage-primary';
    ackBtn.textContent = 'Acknowledge';
    ackBtn.addEventListener('click', () => updateIssueStatus(issue.id, 'Acknowledged'));
    ribbon.appendChild(ackBtn);

    const rejBtn = document.createElement('button');
    rejBtn.className = 'btn btn-ops-triage btn-ops-triage-danger';
    rejBtn.textContent = 'Reject';
    rejBtn.addEventListener('click', () => {
      const reason = prompt('Specify rejection reason:');
      if (reason === null) return;
      updateIssueStatus(issue.id, 'Rejected', null, null, reason || 'Rejected by staff review');
    });
    ribbon.appendChild(rejBtn);
  } else if (issue.status === 'Acknowledged') {
    label.textContent = 'Ready to launch field crews:';
    ribbon.appendChild(label);

    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-ops-triage btn-ops-triage-warning';
    startBtn.textContent = 'Start Work';
    startBtn.addEventListener('click', () => updateIssueStatus(issue.id, 'In Progress'));
    ribbon.appendChild(startBtn);
  } else if (issue.status === 'In Progress') {
    label.textContent = 'Action ongoing. Ready to resolve?';
    ribbon.appendChild(label);

    const resolveBtn = document.createElement('button');
    resolveBtn.className = 'btn btn-ops-triage btn-ops-triage-success';
    resolveBtn.textContent = 'Resolve Report';
    resolveBtn.addEventListener('click', () => {
      document.getElementById('resolutionModal').classList.add('open');
    });
    ribbon.appendChild(resolveBtn);
  } else if (issue.status === 'Resolved') {
    label.textContent = 'Issue successfully resolved.';
    ribbon.appendChild(label);
  } else if (issue.status === 'Rejected') {
    label.textContent = 'Rejection decision completed.';
    ribbon.appendChild(label);
  }
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
