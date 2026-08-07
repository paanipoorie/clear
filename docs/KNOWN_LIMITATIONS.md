# Known Limitations

This document lists the remaining client-side temporary implementations, placeholder components, mock data patterns, and visual limitations in the C.L.E.A.R. platform.

---

## 1. Resolved Technical Debt

The following limitations from the initial MVP have been resolved during the backend migration:
*   **Dual Database Logic**: Replaced local file storage (`issues.json`, `notices.json`) and frontend `localStorage` overrides (under HTTP/HTTPS) with a unified **PostgreSQL** relational database.
*   **Unused Boilerplate Folders**: Removed empty Vite/React templates under `client/` and `server/`.
*   **Secure Session Auth**: Implemented stateless server-side verification using signed JWT cookies and hashed passwords via `bcryptjs`.
*   **Notifications bell**: Wired up dynamically to serve real-time notifications on report updates, complete with unread count updates, list rendering, read status sync, and navigation drawer triggers.

---

## 2. Temporary/Mock Implementations (Client-Side)

### 2.1 "Mark Duplicate" Triage Button
*   The "Mark Duplicate" button (`#drawerDupBtn`) in the municipal action panel is a visual placeholder.
*   Clicking it displays a success toast: `"Duplicate flag marked (Triage placeholder)"`. It does not flag the report in storage, link it to other reports, or archive it.

### 2.2 Geocoding Mocking
*   Selecting a point on the map picker confirms the coordinates (`lat, lng`), but the app does not contact a reverse geocoding API to resolve the district.
*   The citizen must manually select the correct district from the `#issueSubLocation` dropdown after confirmation. The dropdown does not validate if the chosen district aligns with the coordinates.

---

## 3. Visual & Interaction Placeholders

### 3.1 Static Timestamps
*   Relative timestamps (e.g., `"2 hours ago"`, `"1 day ago"`) are computed when issues are rendered using initial creation timestamps. They do not dynamically update in real-time unless the user refreshes the page or triggers a feed re-render.
*   Comments added dynamically are marked with a static string `"Just now"` until the page is reloaded.

### 3.2 Downvote Code Leftovers
*   The client-side API contains hooks and models supporting downvotes, but downvoting has been completely removed from the UI. The downvote count on all reports remains static at `0`.
*   The Citizen action buttons inside the details drawer (e.g. community rating grid, report abuse buttons) are completely removed from the DOM.
