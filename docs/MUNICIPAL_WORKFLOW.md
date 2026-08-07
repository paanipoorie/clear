# Municipal Workflow

This document details the step-by-step workflows, tools, and visual layouts available in the **C.L.E.A.R. Municipal Portal**.

---

## 1. Authentication Flow

### 1.1 Secure Credentials Check
1.  **Entry Point**: From the Landing Portal (`/`), click **"Sign In"** or **"Create Account"**.
2.  **Role selection**: The officer must select the **"Municipal"** (Operations Officer) role.
3.  **Authentication Credentials**:
    *   **Login**: Email and secure **Auth Key** (functioning as password).
    *   **Registration**: Email, chosen username, secure Auth Key, and District (selection of one of the 23 Punjab districts).
4.  **Mock Credentials**: The default mock municipal accounts are pre-populated in client storage:
    *   `officer@clear.gov` (Password: `password` / District: `LUDHIANA`)
    *   `officr1@email.com` (Auth Key: `HX291Z` / District: `SAS NAGAR`)
    *   `officer2@clear.gov` (Password: `password` / District: `SAS NAGAR`)
    *   `officr2@email.com` (Auth Key: `AMR98X` / District: `AMRITSAR`)
5.  **Session & District Binding**: Upon successful login, the session is tracked (`clear_user_authenticated = true`, `clear_username = username`). The officer's home district is locked into the session (`MOCK_MUNICIPALITY_DISTRICT = user.district`). The dashboard title is dynamically updated to display `"Operations Officer (DISTRICT_NAME)"`.
6.  **Redirect**: Transition to `/municipal/dashboard`.

---

## 2. Dashboard Layout & Navigation

The Municipal dashboard is optimized for operations management and automatically expands to 100% viewport width. The municipal navigation options in the sidebar are:
1.  **Triage Board**: The primary Kanban board interface for reviewing and routing issues.
2.  **Resolved Issues**: A separate tab displaying historical resolved reports.
3.  **Manage Notices**: A panel to publish warnings and bulletins to local citizens.
4.  **Profile Card**: Located at the bottom of the sidebar. Displays the officer's name and role (e.g. "Operations Officer (SAS NAGAR)"). Clicking the profile menu provides a **"Logout"** action.

---

## 3. Triage Board (Kanban Workflow)

The Triage Board is the central workspace for officers to manage reports within their assigned district.
*   **Automatic District Filtering**: The dashboard only displays issues whose `subLocation` (district) matches the logged-in officer's district (e.g., if logged in as SAS Nagar officer, only SAS NAGAR reports are displayed).
*   **Summary Statistics**: Three cards display counts for:
    *   *Pending Review* (Issues in Review Queue / Pending Review status)
    *   *Acknowledged* (Issues in Acknowledged status)
    *   *In Progress* (Issues in In Progress status)
*   **Kanban Columns**: The board is structured into three scrollable lists:
    1.  **Review Queue**: Displays newly reported issues and citizen appeals.
    2.  **Acknowledged**: Displays accepted issues awaiting team dispatch.
    3.  **In Progress**: Displays active cleanup or maintenance crew dispatches.

---

## 4. Report Inspection & Triage Decisions

Clicking any issue card on the Kanban board slides open the Details Panel from the right side of the screen.

### 4.1 Detail Panel Inspections
The officer can review:
*   Citizen coordinates on a Leaflet map.
*   Original description and attached images.
*   Reference links.
*   Citizen comments.
*   **Citizen Appeal Data**: If the report was rejected and appealed, an **"Additional Evidence"** section renders at the bottom of the drawer, displaying the citizen's appeal photos and their text explanation.

### 4.2 Triage Status Transition Actions
The details panel contains the **"Municipality Actions"** ribbon at the bottom of the details section (which is hidden from citizen views). The available action buttons change based on the report's current status:

#### A. When Status is `"Review Queue"` or `"Pending Review"`:
*   **Acknowledge**: Accepts the report. Moves it to the **"Acknowledged"** status (and column).
*   **Reject**: Opens the `rejectModal` to reject the report.
*   **Mark Duplicate**: Renders a placeholder event showing duplicate tracking.

#### B. When Status is `"Acknowledged"`:
*   **Start Work**: Signals that a crew has been dispatched. Moves the report to the **"In Progress"** status (and column).

#### C. When Status is `"In Progress"`:
*   **Resolve Report**: Opens the `resolutionModal` to mark the report as completed.

---

## 5. Rejection & Appeal Workflows

### 5.1 Rejecting a Report
1.  Click **"Reject"** inside the triage ribbon.
2.  Opens the **Reject Report Modal**:
    *   **Reason Dropdown** (Required): Officer must choose one of the following reasons:
        *   Need more evidence
        *   Image is unclear
        *   Incorrect location
        *   Insufficient information
        *   Issue could not be verified
        *   Duplicate of another report
        *   Other
    *   **Custom Explanation** (Required only if "Other" is selected): Detailed text explaining the rejection.
3.  Clicking **"Confirm Reject"** calls PATCH `/api/issues/:id/status` with `status: 'Rejected'` and the chosen rejection reason. The report is removed from the Kanban board columns and appears under Citizen portals as `"Rejected"`.

### 5.2 Appeal Review
*   If a citizen submits an appeal on a rejected report, the report's status shifts back to `"Pending Review"` and it re-enters the officer's **"Review Queue"** column.
*   A special badge and the **"Additional Evidence"** panel will appear in the detail view, alerting the officer that it is an appealed issue. The officer can re-examine the new evidence and either click **"Acknowledge"** (accepting the appeal) or **"Reject"** (re-rejecting).

---

## 6. Resolution Workflow

Marking a report as resolved requires strict verification:
1.  Inside the In Progress card details panel, click **"Resolve Report"**.
2.  Opens the **Resolution Submission Modal**:
    *   **Resolution Photo** (Required): The officer must upload a verification photo showing the completed work (e.g. empty street, cleaned drain). It is converted to Base64.
    *   **Resolution Summary Note** (Required, 10–300 characters): Explanation of work done (e.g. "Cleaned debris and flushed sewer line").
3.  Clicking **"Mark Resolved"** calls PATCH `/api/issues/:id/status` with `status: 'Resolved'`, `resolutionNote`, and `resolutionImages`.
4.  The report moves out of the Kanban Columns and is placed in the historical **Resolved Issues** page.

---

## 7. Manage Notices Tab

The Manage Notices view consists of a split-screen screen:
1.  **Notice Creator (Left Side)**: A form allowing the officer to publish official community notices.
    *   **Title** (Required)
    *   **Description** (Required)
    *   **Notice Type** (Warning, Drive / Campaign)
    *   **District** (Locked to the officer's assigned district)
    *   **Expiry Date** (Optional)
    *   Clicking **"Publish Bulletin"** submits a POST `/api/notices` payload. A success toast is triggered, and the notice is updated.
2.  **Active Published Bulletins (Right Side)**: Displays a vertical feed of active bulletins created by the municipality, sorted newest first, showing title, text, date, and expiry.
