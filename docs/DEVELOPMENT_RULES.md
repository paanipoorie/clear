# Development Rules

This document serves as the permanent rulebook and guide for all future development on the C.L.E.A.R. platform. All developers (humans and AI agents) must adhere to these guidelines.

---

## 1. Architectural Integrity & Database Data Layer

### 1.1 Production Database Integration
All server data storage must utilize **PostgreSQL** and **Prisma ORM**. Do not write to temporary JSON files, in-memory arrays, or local files on the server for resource records.

### 1.2 Database Schema & Migrations
*   Any modifications to database tables or relationships must be declared in [`prisma/schema.prisma`](file:///home/nish4nt/dev/clear/prisma/schema.prisma).
*   Always apply schema changes using Prisma migrations: `npx prisma migrate dev --name <migration_name>` to maintain structural audit logs.
*   Instantiate `PrismaClient` in code using the `@prisma/adapter-pg` driver adapter with a `pg.Pool` connection string extracted dynamically to support proxy protocols.

### 1.3 Client-Server HTTP Separation
*   The client SPA communicates with the backend via standard HTTP fetch requests.
*   Do not rely on browser `localStorage` for database persistence. `localStorage` is used solely to maintain user interface session flags (`clear_user_authenticated`, `clear_username`).
*   The client-side `window.fetch` override inside [`app.js`](file:///home/nish4nt/dev/clear/public/app.js) is maintained only for static local `file:` protocol fallback.

---

## 2. Design System and Visual Standards

### 2.1 Stick to the Visual Palette
*   Do not introduce ad-hoc colors or style classes. Use the CSS variables defined in [`style.css`](file:///home/nish4nt/dev/clear/public/style.css).
*   Any style modifications must comply with the **Subtle Neo-Brutalist** branding (clean borders, earthy forest colors, flat shadow depths).
*   Always ensure any newly added component behaves correctly in both **Light and Dark themes** using the `[data-theme="dark"]` selector tokens.

### 2.2 Reusable Typography and Spacing
*   Headings must use the `Outfit` font family with a weight of `700`.
*   Body texts and labels must use `Inter`.
*   Maintain the absolute positioning layout tokens (`--header-height = 64px`, `--sidebar-width = 250px`, `--content-max-width = 720px`).

---

## 3. Workflow and Component Constraints

### 3.1 Do Not Redesign Existing Workflows
Unless explicitly requested, do not alter the current core user workflows:
*   **Citizen Report Creation**: Confirm coordinates on Leaflet map before allowing district select.
*   **Kanban Triage Flow**: Move reports through *Review Queue -> Acknowledged -> In Progress -> Resolved*.
*   **Validation Rules**: Always require an "After" resolution photo and note before marking an issue resolved. Always require rejection categories and justifications on rejects.
*   **Appeal Recycling**: Rejections can be appealed by citizens with new photos, recycling the report to the "Review Queue".

### 3.2 Component Reuse
Always reuse existing visual component templates (`ReportPost`, `NoticeCard`, etc.) instead of creating duplicate structures. If a component needs a modification, refactor the existing builder function inside [`app.js`](file:///home/nish4nt/dev/clear/public/app.js).

---

## 4. Quality Control & Documentation Rules

### 4.1 UI Verification with Playwright
After making significant changes to visual layouts, interactive pages, or modal screens, run the `chrome-devtools` or `playwright` MCP tools to verify correctness:
*   Ensure tabs and viewport views toggle cleanly.
*   Check that modal overlays display above the details drawer correctly.
*   Verify that elements are fully accessible and responsive.

### 4.2 Document As-Built, Not Planned
*   Do not document features as implemented if they are only planned or exist as placeholders.
*   Update this rulebook and corresponding workflows whenever a feature is modified or a placeholder is fully implemented.
*   Keep documentation clean, concise, and structured. Always use absolute file links with the `file://` scheme to point to files or line ranges.
