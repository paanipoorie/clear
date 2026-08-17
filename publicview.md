# C.L.E.A.R. Citizen Portal Working & Logic Guide

This document describes the current frontend client architecture, visual structure, interactive logic flows, and API integrations of the C.L.E.A.R. Citizen Portal.

---

## 1. Architecture Overview & Authentication Flow

The C.L.E.A.R. platform is built as a single-page application (SPA) using Vanilla JavaScript, HTML5 semantic elements, and custom CSS classes. It interacts with an Express-based mock backend server (`server.js`) via asynchronous REST API calls.

### 1.1 Authentication & Workspace Selector (Peerly-inspired Flow)
The app features an authentication layer that governs access to the user portals.
- **Local User DB**: User accounts are initialized and stored client-side in the browser's `localStorage` under `clear_users`.
- **Predefined Credentials**:
  - **Resident Reporters (Civil / Citizen)**:
    - `user1@clear.com` (Password: `password` / Name: `Nishant`)
    - `user2@clear.com` (Password: `password` / Name: `Abhyudaya`)
    - `user3@clear.com` (Password: `password` / Name: `Naman`)
    - `user4@clear.com` (Password: `password` / Name: `Aashmi`)
  - **Operations Officers (Municipal)**:
    - `municipal1@clear.gov` (Password / Auth Key: `HX291Z` / District: `SAS NAGAR` / Name: `municipal1`)
    - `municipal2@clear.gov` (Password / Auth Key: `HX291Z` / District: `LUDHIANA` / Name: `municipal2`)
- **Login Session Persistence**: Logged-in state is tracked in `localStorage` (`clear_user_authenticated` and `clear_username`).
- **Routing**: Popstate history listeners map client requests dynamically to `/citizen/dashboard` or `/municipal/dashboard` based on authentication status and user roles.

---

## 2. Visual Structure & Layout

The user interface implements polished aesthetics, script typography, and flexible workspaces:

- **Sidebar Navigation**: Left-aligned sticky panel containing menu options:
  - **Explore**: Displays active local reports. *Note: Resolved reports are automatically filtered out from the main Explore feed view on the client-side.*
  - **Following**: Displays followed reports only.
  - **Notices**: Shows municipal notices.
  - **District Location Filter**: Dropdown to narrow the feed to specific sub-locations.
- **Feed Stream**: Centered content column with a maximum width of `720px` to optimize text readability.
- **Brand Logo Wordmark**: Embedded via a custom `<brand-logo>` component displaying a stylized Vibur/Damion cursive text logotype.
- **Details Drawer (`#opsSidePanel`)**: Sticky side panel that slides in from the right when any post is clicked, providing detail navigation without disrupting feed positioning.
- **Expanded Operations Board Layout**: In the municipal portal view, the viewport container expands to 100% width, accommodating statistics summary cards, a 3-column Kanban board flow, and a split-screen (350px / fluid) notices manager.

---

## 3. Modular Frontend Components

The frontend client utilizes clean, reusable component templates constructed in JavaScript:

- **`ReportPost(issue)`**: Generates post cards for the main feed stream containing:
  - **Title** and **Meta Row** (Posted by author name • District • Time elapsed).
  - **Cover Image**: Rendered inside `.post-card-image-wrapper`. To ensure visual consistency, an image is **mandatory**; if no custom uploaded report image is present, the app automatically displays a high-quality category-specific fallback placeholder from Unsplash based on the issue type (dumping, burning, water, default).
  - **Description Preview**: Clean, truncated text preview.
  - **Action Bar**: Compact, horizontal pill bar containing paired icons and text labels (Upvotes, Comments, Follow, Share). Downvoting is completely removed.
- **`KanbanColumn(title, countId, cardsContainerId)`**: Generates structured column wrappers for Review Queue, Acknowledged, and In Progress columns.
- **`KanbanIssueCard(issue)`**: Renders compact cards inside columns displaying verification and upvote counts.
- **`MunicipalityActionPanel(issue)`**: Renders status workflow triggers (Acknowledge, Reject, Start Work, Resolve) dynamically based on the issue status.
- **`NoticeCard(notice)`**: Renders bulletin card elements.
- **`NoticeForm()`**: Renders the notices creation panel and hooks submit event handlers.

---

## 4. Interactive Logic & Flow

### 4.1 Card Click Details Navigation
Clicking anywhere on a post card calls `openOpsDetailPanel(issue)` to slide open the side drawer.

### 4.2 Details Panel Conditional Rendering (`renderOpsDetailPanel`)
When a report is opened, the drawer dynamically adjusts the fields shown depending on the user portal view and status:
- **Comments Group**: Displays a persistent scrolling comments stream and comment box in both portal roles.
- **Municipality Status Actions**: The status transition ribbon is hidden from public portal users.
- **Municipality Group Box**: Hidden from public users unless the issue status is `'Resolved'`.
  - **Before / After Grid**: When resolved, displays a two-column grid showing the reported "Before" photo side-by-side with the resolved "After" photo (with mandatory image placeholders).
  - **Resolution Summaries**: Displays the "Resolution Note" alongside the "Municipality Completion Note" (internal notes) and completion date.
  - **Public Resolution Timeline**: Visualizes the timestamps of all transition steps (Reported, Acknowledged, In Progress, Resolved).
- *Note: The general Community panel group (showing total upvote metric) and the Citizen Actions panel group (abuse report buttons) have been completely removed from the details drawer layout.*

### 4.3 Priority Scoring (No Verification Dependency)
Urgency ranking is calculated dynamically based on upvotes and hours waiting (since creation) to ensure high-priority issues bubble up naturally:
$$\text{Score} = (\text{Upvotes} \times 1.5) + (\text{Hours Waiting} \times 0.15)$$

Issues are labeled as:
- **Low**: Score < 8
- **Medium**: 8 $\le$ Score < 20
- **High**: Score $\ge$ 20

---

## 5. API Client Integration

All interactions communicate directly with the backend API:

- **GET `/api/issues`**: Retrieves list of reports. Mapped to support filtering by `userId` to load user's own registered issues.
- **POST `/api/issues`**: Submits a new issue report, auto-attaching `authorId` and `authorName` from the current active session.
- **POST `/api/issues/:id/vote`**: Submits upvotes direction payload (`{ direction: 'up' }` only). Downvoting is removed backend-side.
- **POST `/api/issues/:id/follow`**: Toggles followed status database-side.
- **POST `/api/issues/:id/comments`**: Submits comment payloads (`{ text }`). Appends the comment to the drawer scroll view immediately and updates feed comment counts.
