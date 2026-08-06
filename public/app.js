// Application State
const state = {
  currentSubLocation: '',
  showMyIssues: false,
  showFollowedOnly: false,
  showNoticesOnly: false,
  searchQuery: '',
  currentUser: {
    username: 'user',
    role: 'Resident Reporter'
  }
};

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

// Init application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  fetchUser();
  fetchIssues();
  setupEventListeners();
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

async function fetchIssues() {
  if (state.showNoticesOnly) {
    // Render notices placeholder
    feedContainer.innerHTML = `
      <div class="empty-state">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent); margin-bottom: 16px; width: 48px; height: 48px;">
          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        <h3>Official Municipal Notices</h3>
        <p>This tab will display official notices and alerts posted by municipalities and local authorities.</p>
        <span class="badge" style="margin-top: 12px; font-size: 11px; background-color: var(--color-accent-soft); color: var(--color-accent); padding: 4px 10px; border-radius: 12px; font-weight: 600;">Coming Soon</span>
      </div>
    `;
    feedTitle.textContent = "Official Notices";
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

// Render issues feed
function renderIssues(issues) {
  // Update header text based on filters
  if (state.showMyIssues) {
    feedTitle.textContent = "My Registered Issues";
  } else if (state.showFollowedOnly) {
    feedTitle.textContent = "Reports You Follow";
  } else if (state.currentSubLocation) {
    feedTitle.textContent = `Reports in ${state.currentSubLocation}`;
  } else {
    feedTitle.textContent = "Active Local Reports";
  }
  
  if (issues.length === 0) {
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
  issues.forEach(issue => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.id = `issue-${issue.id}`;
    
    // Choose graphic template based on whether custom images exist
    let graphicHTML = '';
    if (issue.images && issue.images.length > 0) {
      graphicHTML = `
        <div class="custom-uploaded-images">
          ${issue.images.map(img => `<img src="${img}" class="feed-uploaded-image" alt="Uploaded report photo">`).join('')}
        </div>
      `;
    } else if (issue.imageType === 'dumping') {
      graphicHTML = `
        <div class="post-card-graphic post-graphic-dumping">
          <div class="post-graphic-svg-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
        </div>
      `;
    } else if (issue.imageType === 'burning') {
      graphicHTML = `
        <div class="post-card-graphic post-graphic-burning">
          <div class="post-graphic-svg-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
          </div>
        </div>
      `;
    } else if (issue.imageType === 'water') {
      graphicHTML = `
        <div class="post-card-graphic post-graphic-water">
          <div class="post-graphic-svg-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              <path d="M12 2L8 6m4-4l4 4"></path>
            </svg>
          </div>
        </div>
      `;
    } else {
      graphicHTML = `
        <div class="post-card-graphic post-graphic-default">
          <div class="post-graphic-svg-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
              <line x1="12" y1="22" x2="12" y2="12"></line>
              <line x1="12" y1="12" x2="22" y2="8.5"></line>
              <line x1="12" y1="12" x2="2" y2="8.5"></line>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="post-card-header">
        <div class="post-card-title-group">
          <h3 class="post-card-title">${escapeHTML(issue.title)}</h3>
          <div class="post-card-meta">
            <span class="post-card-location">${escapeHTML(issue.location)}, ${escapeHTML(issue.subLocation)}</span>
            <span>&bull;</span>
            <span>Active environmental report</span>
            ${issue.reported ? '<span class="reported-badge">Reported</span>' : ''}
          </div>
        </div>
        <div class="post-card-options">
          <button class="btn-options-trigger" aria-label="Post actions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon icon-sm">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
            </svg>
          </button>
          <div class="post-options-dropdown">
            <button class="dropdown-item follow-option-btn">
              ${issue.followed ? 'Unfollow Post' : 'Follow Post'}
            </button>
            <button class="dropdown-item danger report-option-btn" ${issue.reported ? 'disabled' : ''}>
              ${issue.reported ? 'Reported' : 'Report'}
            </button>
          </div>
        </div>
      </div>
      
      ${graphicHTML}
      
      ${issue.description ? `<p class="post-card-desc">${escapeHTML(issue.description)}</p>` : ''}
      
      ${issue.links && issue.links.length > 0 ? `
        <div class="post-card-links">
          <div class="post-card-links-title">Attached Links</div>
          <ul class="post-card-links-list">
            ${issue.links.map(link => `<li><a href="${link}" target="_blank" rel="noopener noreferrer">${escapeHTML(link)}</a></li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div class="post-card-actions">
        <!-- Vote Buttons -->
        <button class="action-pill upvote-btn" aria-label="Upvote">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon icon-sm">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
          <span class="upvote-count">${issue.upvotes}</span>
        </button>
        
        <button class="action-pill downvote-btn" aria-label="Downvote">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="icon icon-sm">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          <span class="downvote-count">${issue.downvotes}</span>
        </button>
        
        <div class="action-pill-divider"></div>
        
        <!-- Comments button -->
        <button class="action-pill comment-trigger-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon icon-sm">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Comments (${issue.comments.length})</span>
        </button>
        
        <!-- Share button -->
        <button class="action-pill share-btn" aria-label="Share post">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon icon-sm">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
        
        <!-- Track Location Button -->
        <button type="button" class="action-pill track-location-btn" style="margin-left: auto; color: var(--color-accent); font-weight: 600;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon icon-sm" style="margin-right: 2px;">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Track</span>
        </button>
      </div>

      <!-- Collapsible Comments Drawer -->
      <section class="comments-section">
        <div class="comments-list">
          ${issue.comments.length === 0 ? '<p style="font-size:12px;color:var(--color-muted-text);padding:4px 8px;">No comments yet. Start the resolution discussion!</p>' : ''}
          ${issue.comments.map(c => `
            <div class="comment-item">
              <div class="comment-meta">
                <span>${escapeHTML(c.user)}</span>
                <span>${escapeHTML(c.timestamp)}</span>
              </div>
              <p class="comment-text">${escapeHTML(c.text)}</p>
            </div>
          `).join('')}
        </div>
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Discuss action or request details..." required maxlength="200">
          <button type="submit" class="btn-comment-submit">Post</button>
        </form>
      </section>
    `;
    
    // Add event bindings to buttons inside cards
    bindCardEvents(card, issue);
    feedContainer.appendChild(card);
  });
}

// Bind interactive event handlers to individual post cards
function bindCardEvents(card, issue) {
  // Option dropdown menu toggling
  const trigger = card.querySelector('.btn-options-trigger');
  const dropdown = card.querySelector('.post-options-dropdown');
  
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other dropdowns
    document.querySelectorAll('.post-options-dropdown.open').forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
    });
    dropdown.classList.toggle('open');
  });

  // Follow Action
  const followBtn = card.querySelector('.follow-option-btn');
  followBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/issues/${issue.id}/follow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        issue.followed = data.followed;
        showToast(data.followed ? 'Following report for updates' : 'Unfollowed report');
        fetchIssues(); // Refresh feed
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Report Action
  const reportBtn = card.querySelector('.report-option-btn');
  reportBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/issues/${issue.id}/report`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        issue.reported = data.reported;
        showToast('Thank you. Issue report submitted for review');
        fetchIssues(); // Refresh feed
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Upvote Action
  const upvoteBtn = card.querySelector('.upvote-btn');
  upvoteBtn.addEventListener('click', async () => {
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
        // Deactivate downvote classes if applicable
        card.querySelector('.downvote-btn').classList.remove('vote-btn-active-down');
        showToast('Upvoted environmental report');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Downvote Action
  const downvoteBtn = card.querySelector('.downvote-btn');
  downvoteBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`/api/issues/${issue.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: 'down' })
      });
      if (res.ok) {
        const data = await res.json();
        card.querySelector('.downvote-count').textContent = data.downvotes;
        downvoteBtn.classList.add('vote-btn-active-down');
        card.querySelector('.upvote-btn').classList.remove('vote-btn-active-up');
        showToast('Downvoted environmental report');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Comments drawer toggler
  const commentTrigger = card.querySelector('.comment-trigger-btn');
  const commentsSection = card.querySelector('.comments-section');
  commentTrigger.addEventListener('click', () => {
    const isOpen = commentsSection.classList.toggle('open');
    if (isOpen) {
      commentTrigger.classList.add('comment-active');
    } else {
      commentTrigger.classList.remove('comment-active');
    }
  });

  // Comment submission form
  const commentForm = card.querySelector('.comment-form');
  const commentInput = card.querySelector('.comment-input');
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const newComment = await res.json();
        // Insert comment into local comments array
        issue.comments.push(newComment);
        commentInput.value = '';
        
        // Refresh local list without reload
        const list = card.querySelector('.comments-list');
        const emptyMsg = list.querySelector('p');
        if (emptyMsg) emptyMsg.remove();
        
        const cItem = document.createElement('div');
        cItem.className = 'comment-item';
        cItem.innerHTML = `
          <div class="comment-meta">
            <span>${escapeHTML(newComment.user)}</span>
            <span>${escapeHTML(newComment.timestamp)}</span>
          </div>
          <p class="comment-text">${escapeHTML(newComment.text)}</p>
        `;
        list.appendChild(cItem);
        
        // Scroll list to bottom
        list.scrollTop = list.scrollHeight;
        
        // Update label count
        card.querySelector('.comment-trigger-btn span').textContent = `Comments (${issue.comments.length})`;
        showToast('Comment posted');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Share post URL Action
  const shareBtn = card.querySelector('.share-btn');
  shareBtn.addEventListener('click', () => {
    const postUrl = `${window.location.origin}/issue/${issue.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      showToast('Copied report link to clipboard');
    }).catch(err => {
      // Fallback
      showToast(`Link: ${postUrl}`);
    });
  });

  // Track Location Button Click
  const trackBtn = card.querySelector('.track-location-btn');
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      showReportLocation(issue);
    });
  }
}

// Setup Event Listeners
function setupEventListeners() {
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

  function updateNavActiveState(activeId) {
    const navButtons = [exploreBtn, followingBtn, noticesBtn];
    navButtons.forEach(btn => {
      if (btn) {
        if (btn.id === activeId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }

  // Explore / Reset filters btn
  exploreBtn.addEventListener('click', () => {
    state.currentSubLocation = '';
    state.showMyIssues = false;
    state.showFollowedOnly = false;
    state.showNoticesOnly = false;
    state.searchQuery = '';
    searchInput.value = '';
    
    // Reset sidebar visual active states
    updateNavActiveState('exploreBtn');
    sublocationButtons.forEach(b => {
      if (b.dataset.sub === '') b.classList.add('active');
      else b.classList.remove('active');
    });

    // Close location dropdown
    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open'); // Close mobile menu if open
  });

  // Following filter click
  followingBtn.addEventListener('click', () => {
    state.currentSubLocation = '';
    state.showMyIssues = false;
    state.showFollowedOnly = true;
    state.showNoticesOnly = false;
    state.searchQuery = '';
    searchInput.value = '';

    updateNavActiveState('followingBtn');
    sublocationButtons.forEach(b => b.classList.remove('active'));

    // Close location dropdown
    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  // Notices click
  noticesBtn.addEventListener('click', () => {
    state.currentSubLocation = '';
    state.showMyIssues = false;
    state.showFollowedOnly = false;
    state.showNoticesOnly = true;
    state.searchQuery = '';
    searchInput.value = '';

    updateNavActiveState('noticesBtn');
    sublocationButtons.forEach(b => b.classList.remove('active'));

    // Close location dropdown
    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  // Location filter click
  sublocationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sublocationButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Explore goes active if we select a specific location
      state.showFollowedOnly = false;
      state.showNoticesOnly = false;
      state.showMyIssues = false;
      updateNavActiveState('exploreBtn');
      
      state.currentSubLocation = btn.dataset.sub;
      
      // Close dropdown to keep sidebar compact
      sublocationList.classList.remove('open');
      locationBoxBtn.classList.remove('open');
      locationBoxBtn.setAttribute('aria-expanded', 'false');

      fetchIssues();
      sidebar.classList.remove('open'); // Close mobile menu
    });
  });

  // Profile Menu Dropdown triggers
  profileMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('open');
  });

  // My Issues filter clicked
  myIssuesBtn.addEventListener('click', () => {
    state.showMyIssues = true;
    state.currentSubLocation = '';
    state.showFollowedOnly = false;
    state.showNoticesOnly = false;
    sublocationButtons.forEach(b => b.classList.remove('active'));
    updateNavActiveState('');
    profileDropdown.classList.remove('open');
    
    // Close location dropdown
    sublocationList.classList.remove('open');
    locationBoxBtn.classList.remove('open');
    locationBoxBtn.setAttribute('aria-expanded', 'false');

    fetchIssues();
    sidebar.classList.remove('open');
  });

  // Logout Click
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

    // Reset location chip text and style
    const locationBtn = document.getElementById('modalLocationBtn');
    if (locationBtn) {
      locationBtn.classList.remove('selected');
      document.getElementById('locationBtnText').textContent = 'Add Location';
    }

    // Hide location badge
    const statusText = document.getElementById('locationStatusText');
    if (statusText) {
      statusText.style.display = 'none';
      statusText.textContent = '';
    }

    // Disable district dropdown
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

    // Clear image previews
    const previewsGrid = document.getElementById('photoPreviewsGrid');
    if (previewsGrid) {
      previewsGrid.innerHTML = '';
    }

    // Clear attached links list
    const linksList = document.getElementById('attachedLinksList');
    if (linksList) {
      linksList.innerHTML = '';
    }

    // Hide inline link container
    const inlineLinkContainer = document.getElementById('inlineLinkContainer');
    if (inlineLinkContainer) {
      inlineLinkContainer.style.display = 'none';
    }
    const linkInput = document.getElementById('issueLinkInput');
    if (linkInput) {
      linkInput.value = '';
    }

    // Hide map picker
    const mapPicker = document.getElementById('mapPickerContainer');
    if (mapPicker) {
      mapPicker.style.display = 'none';
    }

    // Clean up Leaflet marker and instance
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

    // Request browser geolocation permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          initLeafletMap(lat, lng);
        },
        (error) => {
          console.warn('Geolocation error/denied. Defaulting to Punjab center.', error);
          // Default to center of Punjab (around 31.1471, 75.3412)
          initLeafletMap(31.1471, 75.3412);
        }
      );
    } else {
      // Geolocation not supported, default
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
      
      // Clicking on map drops/moves pin
      mapInstance.on('click', (e) => {
        setMapMarker(e.latlng.lat, e.latlng.lng);
      });
    } else {
      mapInstance.setView([lat, lng], 13);
    }

    // Set initial marker
    setMapMarker(lat, lng);
    
    // Force Leaflet to recalculate map layout since it was initially hidden
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

  // Location chip click triggers map picker
  const modalLocationBtn = document.getElementById('modalLocationBtn');
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

    // Hide map
    document.getElementById('mapPickerContainer').style.display = 'none';

    // Update location chip state and display
    modalLocationBtn.classList.add('selected');
    document.getElementById('locationBtnText').textContent = 'Location Confirmed';

    const statusBadge = document.getElementById('locationStatusText');
    statusBadge.style.display = 'inline-flex';
    statusBadge.innerHTML = `📍 ${selectedCoordinates.lat.toFixed(4)}, ${selectedCoordinates.lng.toFixed(4)}`;

    // Enable district selector
    const subLocSelect = document.getElementById('issueSubLocation');
    subLocSelect.disabled = false;
    subLocSelect.focus();
    
    showToast('Location coordinates confirmed');
  });

  // Cancel Map Button
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
        
        // Prevent duplicate images
        if (attachedImages.includes(dataUrl)) return;
        
        attachedImages.push(dataUrl);
        
        // Create preview item DOM element
        const previewItem = document.createElement('div');
        previewItem.className = 'photo-preview-item';
        previewItem.innerHTML = `
          <img src="${dataUrl}" alt="Attached preview">
          <button type="button" class="photo-preview-remove" aria-label="Remove photo">&times;</button>
        `;
        
        // Remove button handler
        previewItem.querySelector('.photo-preview-remove').addEventListener('click', () => {
          const idx = attachedImages.indexOf(dataUrl);
          if (idx > -1) {
            attachedImages.splice(idx, 1);
          }
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

  // Toggle link input popover
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
    
    // Check URL validity
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

    // Create link tag DOM element
    const linkItem = document.createElement('li');
    linkItem.className = 'attached-link-item';
    linkItem.innerHTML = `
      <a href="${linkVal}" target="_blank" rel="noopener noreferrer">${escapeHTML(linkVal)}</a>
      <button type="button" class="attached-link-remove" aria-label="Remove link">&times;</button>
    `;

    // Remove button handler
    linkItem.querySelector('.attached-link-remove').addEventListener('click', () => {
      const idx = attachedLinks.indexOf(linkVal);
      if (idx > -1) {
        attachedLinks.splice(idx, 1);
      }
      linkItem.remove();
    });

    linksList.appendChild(linkItem);
    inlineLinkContainer.style.display = 'none';
    linkInput.value = '';
    showToast('Link attached');
  });

  // Enter key submit on inline link input
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
          imageType: 'default', // Since categories are removed, we default to standard SVG placeholder
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
        
        // Refresh feed to show new post
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
      fetchIssues();
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
    if (!profileDropdown.contains(e.target) && e.target !== profileMenuTrigger) {
      profileDropdown.classList.remove('open');
    }
    // Close post dropdowns
    if (!e.target.closest('.post-card-options')) {
      document.querySelectorAll('.post-options-dropdown.open').forEach(d => {
        d.classList.remove('open');
      });
    }
    // Close location dropdown
    if (!sublocationList.contains(e.target) && !locationBoxBtn.contains(e.target)) {
      sublocationList.classList.remove('open');
      locationBoxBtn.classList.remove('open');
      locationBoxBtn.setAttribute('aria-expanded', 'false');
    }
    // Close track modal when clicking on overlay background
    if (trackModal && e.target === trackModal) {
      trackModal.classList.remove('open');
    }
  });
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

    // Force size recalculation
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
  
  // Fade out and remove
  setTimeout(() => {
    toast.style.animation = 'none'; // reset animation
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
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
