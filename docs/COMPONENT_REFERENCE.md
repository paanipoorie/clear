# Component Reference

This document maps out the core modular components of the C.L.E.A.R. frontend. The application utilizes a combination of **JavaScript Component Templates** (functions returning DOM structures dynamically) and **HTML Semantic Layouts** (declared in `public/index.html` and toggled via CSS).

---

## 1. Custom Web Components

### 1.1 `<brand-logo>`
*   **Source File**: [`brand-logo.js`](file:///home/nish4nt/dev/clear/public/brand-logo.js)
*   **Responsibility**: Renders the C.L.E.A.R. unified branding. It places a circular logo icon next to the brand name using custom cursive typography (Outfit/Damion fonts).
*   **Properties/Attributes**:
    *   `favicon-src`: Path to logo icon (defaults to `favicon/favicon.svg`).
    *   `text`: Wordmark text (defaults to `"clear"`).
*   **Used In**:
    *   Auth Landing Screen (`index.html`)
    *   App Header (`index.html`)

---

## 2. JavaScript Dynamic Component Templates
These are functional components declared in [`app.js`](file:///home/nish4nt/dev/clear/public/app.js) that dynamically construct HTML DOM nodes using vanilla JS.

### 2.1 `ReportPost(issue)`
*   **Responsibility**: Generates the card element representing an issue in the Citizen Explore feed and Following streams.
*   **Parameters**: `issue` (Report object from database).
*   **Key Features**:
    *   Calculates a dynamic priority score and displays a matching badge (Low, Medium, High).
    *   Attaches default Unsplash fallback placeholders if the issue contains no custom citizen upload.
    *   Formats timestamps using relative times (e.g. `"2 hours ago"`).
    *   Constructs the footer action pill buttons (Upvotes, Comment counts, Follow state toggles).
    *   Binds card click events to trigger the details drawer.
*   **Used In**: Render feeds under Citizen `Explore`, `Following`, and `My Issues` viewport.

### 2.2 `KanbanIssueCard(issue)`
*   **Responsibility**: Renders a compact, dense card representing a report on the Municipal Kanban columns.
*   **Parameters**: `issue` (Report object).
*   **Key Features**:
    *   Displays report thumbnail, title, creation date, upvotes, and comments.
    *   Highlights dynamic priority badges (Low, Medium, High).
    *   Binds click events to open the inspector details drawer.
*   **Used In**: Renders inside Kanban Columns on the Triage Board.

### 2.3 `KanbanColumn(title, countId, cardsContainerId)`
*   **Responsibility**: Returns the column layout framework for the Triage Board columns.
*   **Parameters**:
    *   `title` (string): Column header label.
    *   `countId` (string): ID of count badge span.
    *   `cardsContainerId` (string): ID of column cards container.
*   **Used In**: Appended dynamically to `#municipalTriageViewport`'s Kanban board wrapper.

### 2.4 `MunicipalityActionPanel(issue)`
*   **Responsibility**: Renders status workflow buttons dynamically based on the current state of a report.
*   **Parameters**: `issue` (Report object).
*   **Action Flow Mapping**:
    *   `"Review Queue"` / `"Pending Review"`: Shows **Acknowledge** (advances status), **Reject** (opens reject modal), and **Mark Duplicate** buttons.
    *   `"Acknowledged"`: Shows **Start Work** (advances status) button.
    *   `"In Progress"`: Shows **Resolve Report** (opens resolution modal) button.
    *   `"Resolved"`: Shows a static success banner.
    *   `"Rejected"`: Shows a static rejection banner.
*   **Used In**: Renders inside the Details Drawer for municipal officers.

### 2.5 `NoticeCard(notice)`
*   **Responsibility**: Renders an alert bulletin card.
*   **Parameters**: `notice` (Notice object).
*   **Key Features**: Shows the notice type (Warning or Drive / Campaign), title, description, district, date, and expiry.
*   **Used In**: Citizen Notices Feed and Municipal Manage Notices Feed.

### 2.6 `NoticeForm()`
*   **Responsibility**: Renders the "Publish Official Notice" form panel for municipal officers.
*   **Key Features**: Contains Title, Description, Type select, District select (locked to officer's district), and Expiry Date. Binds submit event to create notices.
*   **Used In**: Left panel of the municipal notices viewport.

---

## 3. HTML Structural Layout Components
These components are declared in [`index.html`](file:///home/nish4nt/dev/clear/public/index.html) and styled via [`style.css`](file:///home/nish4nt/dev/clear/public/style.css).

### 3.1 App Header (`header.app-header`)
*   **Responsibility**: Sticky header bar for navigation and search.
*   **Key Selectors**:
    *   `#mobileMenuBtn`: Hamburger menu toggler for mobile viewports.
    *   `#searchInput`: Search query text input.
    *   `#themeToggleBtn`: Theme switch (sun/moon icons) for dark/light themes.
    *   `#notificationBtn`: Citizen notification bell (visual placeholder).

### 3.2 Navigation Sidebar (`aside.sidebar`)
*   **Responsibility**: Fixed left sidebar for navigation and filters.
*   **Key Selectors**:
    *   `.citizen-only-nav` & `.municipal-only-nav` links: Toggled visible depending on user portal.
    *   `#createIssueBtn`: Triggers the report creation modal (Citizen only).
    *   `#locationBoxBtn`: Location Filter drop-down trigger.
    *   `#districtSearchInput`: Nested input to filter district list.
    *   `.sidebar-profile`: Bottom card displaying user avatar, name, and profile dropdown menu.

### 3.3 Details Drawer (`#opsSidePanel`)
*   **Responsibility**: Sliding right-hand sidebar panel to inspect a clicked report.
*   **Key Selectors**:
    *   `#opsDetailTitle` / `#opsDetailDesc` / `#opsDetailPhotos`: Meta information rendering.
    *   `#opsDetailMap`: Renders the Leaflet map pin.
    *   `#triageActionRibbon`: Placer for `MunicipalityActionPanel`.
    *   `#opsDetailCommentsList`: Comments history feed.
    *   `#opsDetailResolutionContainer`: Visible only on resolved reports (shows resolution notes and before/after images).
    *   `#opsDetailAppealGroup`: Visible only on appealed reports (shows additional citizen evidence).

### 3.4 Modal Overlays

#### A. Create Report Modal (`#createModal`)
*   Contains the inline Leaflet map picker (`#mapPickerContainer`), file drop upload zones, reference link inputs, and anonymity settings.

#### B. Resolution Modal (`#resolutionModal`)
*   Prompt for municipal officers to upload "After" images and type completion details before marking a report resolved.

#### C. Rejection Modal (`#rejectModal`)
*   Prompt for municipal officers to categorize rejection reasons and provide custom justifications.

#### D. Appeal Modal (`#appealModal`)
*   Prompt for citizens to upload new proof and explanations to appeal rejected reports.
