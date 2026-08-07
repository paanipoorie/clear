# C.L.E.A.R. Citizen Portal Working & Logic Guide

This document describes the current frontend client architecture, visual structure, interactive logic flows, and API integrations of the C.L.E.A.R. Citizen Portal.

---

## 1. Architecture Overview

The Citizen Portal is built as a highly responsive, single-page application (SPA) using Vanilla JavaScript, HTML5 semantic elements, and a modular CSS design system. It interacts with an Express-based mock backend server (`server.js`) via asynchronous REST API calls.

State is managed client-side via a single `state` object inside [`app.js`](file:///home/nish4nt/dev/clear/public/app.js) containing configurations such as:
- `activePortal` ("public" | "municipality" | "landing")
- `currentSubLocation` (district filter value)
- `showFollowedOnly` (active tab filter state)
- `selectedIssueForOps` (details panel target issue context)

---

## 2. Visual Structure & Layout

The user interface follows modern, Reddit-inspired visual hierarchy, typography, and spacing to deliver a clean, clutter-free reading experience:

- **Sidebar Navigation**: Left-aligned sticky panel containing menu options:
  - **Explore**: Displays the general active local reports. *Note: Resolved reports are automatically filtered out from the main Explore feed view on the client-side.*
  - **Following**: Reuses the core feed card layout, displaying followed reports only.
  - **Notices**: Shows municipal notices.
  - **District Location Filter**: Dropdown to narrow the feed to specific sub-locations.
- **Feed Stream**: Centered content column with a maximum width of `720px` to optimize text readability. Large page titles above the feed are removed; context is defined dynamically by the selected sidebar tab state.
- **Details Drawer (`#opsSidePanel`)**: Sticky side panel that slides in from the right when any post is clicked, providing detail navigation without disrupting feed positioning.

---

## 3. Post Card Component (`ReportPost`)

Each report post in the feed stream is generated dynamically via the `ReportPost(issue)` component factory function. It produces a structured HTML `<article>` container containing exactly:

1. **Title**: Structured heading with bold typography.
2. **Meta Row**: Consists of the `District` name only (the status badge has been removed from the meta section for a cleaner public look).
3. **Cover Image**: Rendered inside `.post-card-image-wrapper`. To ensure visual consistency and prevent empty boxes, an image is **mandatory**; if no custom uploaded report image is present, the app automatically displays a high-quality category-specific fallback placeholder from Unsplash based on the issue type (dumping, burning, water, default).
4. **Description Preview**: Clean, truncated text preview.
5. **Action Bar**: Compact, horizontal pill bar (`.post-card-actions`) containing icons paired with descriptive text labels:
   - **Upvote Button**: Up arrow icon with upvotes count + "Upvotes" label text.
   - **Comments Button**: Speech bubble icon with comment counts + "Comments" label text. Clicking this opens the side drawer and focuses the comment input.
   - **Follow Button (📍)**: Icon + "Follow" label text. Toggles followed state; highlighted with active green accent when followed.
   - **Share Button**: Icon + "Share" label text. Copies the post link directly to the clipboard.
   - *Note: Downvoting is completely removed from the feed action bar.*

---

## 4. Interactive Logic & Flow

### 4.1 Card Click Details Navigation
Clicking anywhere on a post card (excluding elements inside the `.post-card-actions` container) calls `openOpsDetailPanel(issue)` to slide open the side drawer. Accordions and collapsed feeds are avoided to maintain standard page structure.

### 4.2 Details Panel Conditional Rendering (`renderOpsDetailPanel`)
When a report is opened, the drawer dynamically adjusts the fields shown depending on the user portal view and status:
- **Comments Group**: Displays a persistent scrolling comments stream and comment box in both portal roles.
- **Municipality Status Actions**: The status transitions (Acknowledge, Start Work, Resolve) are hidden from public portal users.
- **Municipality Group Box**: The wrapper container is completely hidden from public users unless the issue status is `'Resolved'`. When resolved, it displays the resolution summary note, completion proof photos (falling back to a nature placeholder if no completion image was uploaded), and the resolution date.
- **Public Resolution Timeline**: Appended at the bottom of the Municipality group for resolved issues, visualizing the timestamps of all transition steps (Reported, Acknowledged, In Progress, Resolved).
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

- **GET `/api/issues`**: Retrieves list of reports (and updates feed counts).
- **POST `/api/issues/:id/vote`**: Submits upvotes direction payload (`{ direction: 'up' }` only). Downvoting is removed backend-side.
- **POST `/api/issues/:id/follow`**: Toggles followed status database-side. Updates card icon styling.
- **POST `/api/issues/:id/comments`**: Submits comment payloads (`{ text }`). Appends the comment to the drawer scroll view immediately and updates feed comment counts.
