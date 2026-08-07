# Citizen Portal Workflow

This document details the step-by-step user workflows, interactions, and state transitions available in the **C.L.E.A.R. Citizen Portal**.

---

## 1. Authentication Flow

### 1.1 Account Creation (Registration)
1.  **Entry Point**: From the Landing Screen (`/`), clicking **"Create Account"** slides in the Register Screen.
2.  **Toggle Role**: The user selects **"Civil"** (Resident Reporter) role (active by default).
3.  **Form Fields**:
    *   **Email**: Validated email string.
    *   **Name**: Full name of the resident.
    *   **Password**: Password string.
    *   **Confirm Password**: Must match the Password input.
4.  **Submission**: Submitting the form triggers a client-side verification. If the email or username does not exist in `clear_users` in local storage, a new user object is added:
    ```json
    {
      "id": "user-full-name",
      "username": "Full Name",
      "email": "user@example.com",
      "password": "password",
      "role": "citizen"
    }
    ```
5.  **Auto-login**: Upon successful creation, the session data is saved (`clear_user_authenticated = true`, `clear_username = username`), a welcome toast appears, and the client redirects to `/citizen/dashboard`.

### 1.2 Access (Login)
1.  **Entry Point**: From the Landing Screen, clicking **"Sign In"** slides in the Login Screen.
2.  **Role**: User chooses **"Civil"** (Resident Reporter) role.
3.  **Form Fields**: Email Address and Password.
4.  **Verification**: Validates credentials against `clear_users`. If successful, sets session flags and updates the current user state:
    ```javascript
    state.currentUser = {
      id: user.id || user.username,
      username: user.username,
      avatar: '/images/avatar.png',
      role: 'citizen',
      district: 'LUDHIANA' // Default fallback
    }
    ```
5.  **Redirect**: Transition to `/citizen/dashboard`.

---

## 2. Dashboard Layout & Sidebar Navigation

Once authenticated as a citizen, the header and sidebar are displayed. The citizen sidebar contains:
1.  **Explore**: Active reports feed.
2.  **Following**: Filtered feed showing only posts followed by the user.
3.  **Notices**: Bulletins posted by municipal offices.
4.  **Create Report**: Opens the creation modal.
5.  **Location Filter**: Filter feed by specific districts in Punjab. Includes a nested district search box.
6.  **Profile Card**: Found at the bottom of the sidebar. Displays the user avatar, username, and role ("Resident Reporter"). Clicking the three-dots menu reveals:
    *   **My Issues**: Filters the feed to reports created by the user.
    *   **Logout**: Destroys the authenticated session and redirects back to the Landing Portal (`/`).

---

## 3. Feed Views & Exploration

### 3.1 Explore Tab (Main Feed)
*   **Behavior**: Displays a vertical feed of all environmental issues.
*   **Filtering**:
    *   *Client-side filter*: Automatically filters out issues with `status === "Resolved"` from the main feed view.
    *   *Search filter*: Entering keywords in the top header search bar (`#searchInput`) matches against issue titles, descriptions, and sub-locations.
*   **Card Structure**: Each post card contains:
    *   Category icon (garbage, fire, water, warning) based on the image type.
    *   Meta information: Author Name (or "Anonymous"), District, and Time elapsed.
    *   Title & Description snippet.
    *   Cover Image: Mandatory cover image. If the report was created without an image, a category-based Unsplash placeholder is generated.
    *   Footer Action Bar: Shows Upvote count, Comment count, Follow toggle state, and a Share action.
    *   Priority Badge: Displays "Low", "Medium", or "High" priority, dynamically calculated.

### 3.2 Following Tab
*   **Behavior**: Displays report cards where `followed` is set to `true`. Useful for tracking specific ongoing hazards.

### 3.3 Notices Tab
*   **Behavior**: Displays official community alerts (e.g., smog warnings, civic campaigns) sorted with the newest notices at the top. Each card shows the notice type (Warning, Drive / Campaign), title, description, district, and creation date.

### 3.4 District Location Filter
*   **Interaction**: Clicking the "Location Filter" dropdown displays a list of 23 Punjab districts.
*   **District Search**: Typings in `#districtSearchInput` filters the list of districts in real time.
*   **Effect**: Selecting a district (e.g. "AMRITSAR") filters the active Explore feed to show only reports within that district.

---

## 4. Report Creation Workflow

1.  **Click "Create Report"**: Opens the `createModal` popup.
2.  **Coordinates Pin (Map Picker)**:
    *   Citizen clicks the **"Add Location"** chip. This reveals the inline Leaflet map.
    *   The map centers on user geolocation (if allowed) or default Punjab center coordinates.
    *   The citizen clicks on the map to drop a marker, or drags an existing marker to the hazard site.
    *   Clicking **"Confirm Location"** locks the coordinate numbers, displays them as a badge, and enables the District Selection dropdown.
3.  **District Selection**: The citizen selects the specific district from the enabled dropdown (matching their map selection).
4.  **Metadata Inputs**:
    *   Title (Required, max 100 characters).
    *   Description (Optional, max 500 characters).
5.  **Anonymity Toggle**: Citizens can toggle **"Post anonymously"**. If active, `isAnonymous` is set to `true` and the poster's username is hidden, showing as **"Anonymous"** to other users.
6.  **Attachments**:
    *   **Photos**: Citizens click the photo icon to select images. The files are converted to Base64 data URLs on-the-fly and displayed in a preview grid. Clicking the "x" on a thumbnail removes the image before submission. Multiple images are supported.
    *   **Links**: Clicking the link icon opens an input field to add reference URLs (e.g., local news stories, Google Drive folders).
7.  **Submit**: Clicks **"Post"**. The client sends a POST request to `/api/issues`. The report is saved with a default status of `"Review Queue"`. A success toast is displayed, and the Explore feed is updated.

---

## 5. Report Interactions

### 5.1 Upvoting
*   Clicking the **Upvote** button increments the count on the card and database. Downvoting is disabled.
*   Updates the dynamic priority score, which can shift the priority badge from Low to Medium or High.

### 5.2 Following
*   Clicking **"Follow"** toggles the followed state. Followed reports appear in the citizen's "Following" tab.
*   *Backend Event*: Following an issue signs the user up for status update notifications.

### 5.3 Commenting
*   Citizen opens the details drawer by clicking on the post card.
*   Enters text in the input box at the bottom of the drawer and clicks **"Post"**.
*   The comment is appended to the comments list with the user's name and the timestamp "Just now".

---

## 6. Detail View Drawer (`#opsSidePanel`)
Clicking any report card slides open a detail drawer from the right side of the screen.
*   **Content**: Displays full title, district, author, full description, all uploaded photos, attached links, a Leaflet map showing the pin drop, and a chronological list of comments.
*   **Special Resolved View**: If the report status is `"Resolved"`, the citizen sees a dedicated resolution panel in the drawer:
    *   **Before / After Photo Grid**: The original report image next to the municipal resolution image.
    *   **Resolution Notes**: The official summary of the completed work.
    *   **Action Timeline**: Audit trail showing transition timestamps (Reported -> Acknowledged -> In Progress -> Resolved).

---

## 7. Rejection & Appeal Flow

If a municipal officer rejects a report, the citizen can appeal it:
1.  **Notice of Rejection**: The report card displays a status badge of `"Rejected"` along with the officer's rejection reason.
2.  **Access Appeal**: The citizen opens the report detail drawer and clicks the **"Submit Additional Evidence"** button.
3.  **Submit Appeal Modal**: Opens the `appealModal`:
    *   The citizen **must** upload one or more new photos (evidence that the hazard is real, exists on municipal land, or is not a duplicate).
    *   The citizen can write an additional explanation.
4.  **Confirm Appeal**: Clicking **"Submit Appeal"** triggers a POST to `/api/issues/:id/appeal`. The status changes back to `"Pending Review"`, and the report is recycled back into the municipal officer's triage queue.
