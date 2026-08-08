# C.L.E.A.R. Bounty Requirements

This document outlines the three specific bounty requirements for the C.L.E.A.R. (Crowdsourced Local Environmental Action & Resolution) project and provides a mapping of how they correspond to the existing application architecture.

---

## Bounty 1: Attachments to Environment Reports

### Requirement
Add attachments to each environment report: Allow users to attach or link one supporting file/image to an existing environment report and show it in the detail view.

### Deliverables
- Attachment input
- Preview/link display
- Persistence with the report record
- A sample environment report with evidence attached

### Implementation Rules
- Limit to **one** supporting file/image per environment report.
- Must work within the existing environment report schema/architecture.
- Do not invent additional attachment types, limits, workflows, or permissions unless the existing project requires them.
- Leverage the existing photo/image handling (Base64 conversion on frontend, disk storage under `/media/uploads/` on backend) or URL references where consistent.

---

## Bounty 2: Role-Aware Evidence Item Filters

### Requirement
Add role-aware evidence item filters: Add filters or tabs that show evidence item records relevant to the current role such as user, admin, authority, hospital, investigator, or reviewer.

### Deliverables
- Role filter/tab
- Scoped list results
- Visible count
- Demo for at least two roles or statuses

### Implementation Rules
- Inspect existing authentication, Prisma schema, roles, and docs to check which roles actually exist (do not assume roles like admin, hospital, investigator, or reviewer exist unless verified).
- Do not silently create new roles or change the authorization model; clarify this first.
- The filter must operate on real persisted records in the database, not mock frontend data.
- Preserve existing citizen/municipal workflows.

---

## Bounty 3: Project-Specific Report Export

### Requirement
Generate a project-specific report export: Add a downloadable report for a selected evidence item that reuses the existing captured fields, statuses, recommendations, and notes.

### Deliverables
- Export button
- Generated PDF/CSV/HTML report
- Project-specific fields included
- A sample export for judging

### Implementation Rules
- Reuse existing captured fields, statuses, recommendations, and notes from the selected persisted record.
- Do not invent database fields that do not exist.
- Do not create a separate parallel evidence system.
- The export must represent the actual selected persisted evidence/report record.
- Primary judging format (PDF, CSV, or HTML) must be clarified before proceeding.

---

## Current Project Mapping

The table below maps the concepts in the bounty requirements to existing C.L.E.A.R. codebase and database components:

| Concept / Requirement Element | Corresponding Existing Component in C.L.E.A.R. | Details & Source of Truth |
| :--- | :--- | :--- |
| **Environment reports** | `Report` Model | Maps to the `Report` table in [`prisma/schema.prisma`](file:///home/nish4nt/dev/clear/prisma/schema.prisma) and individual report cards/columns in the UI. |
| **Attachments/evidence** | `images` and `links` fields | Maps to `images String[]` (citizen uploaded image paths stored on disk at `/media/uploads/` via `saveBase64Image` in [`server.js`](file:///home/nish4nt/dev/clear/server.js)) and `links String[]` (reference URLs) on the `Report` model. Resolution photos are `resolutionImages` and appeal photos are `additionalImages`. |
| **Roles** | `User.role` field | Maps to the `role` field on the `User` model. The only supported values are `"citizen"` (referenced in the UI as "civil" / "Resident Reporter") and `"municipal"` ("Operations Officer"). **Admin, authority, hospital, investigator, reviewer are not currently present.** |
| **Evidence items** | `Report` Model | In C.L.E.A.R., "evidence items" correspond directly to the environmental `Report` records. There is no separate database model or entity for "evidence items". |
| **Statuses** | `Report.status` field | Maps to the `status` field on the `Report` model. The active statuses are `"Review Queue"`, `"Acknowledged"`, `"In Progress"`, `"Resolved"`, `"Rejected"`, and `"Pending Review"`. |
| **Recommendations** | **Not currently present** | The existing data models, API endpoints, and frontend components do not contain any "recommendation" entity, field, or workflow. |
| **Notes** | `internalNotes` and `resolutionNote` fields | Maps to `internalNotes` (internal squad note field edited by municipal officers) and `resolutionNote` (public resolution summary note) on the `Report` model. Rejection reason is stored in `rejectionReason`, and appeals have an `appealMessage`. |
| **Report detail view** | `#opsSidePanel` slide-out drawer | Maps to the HTML side panel in [`public/index.html`](file:///home/nish4nt/dev/clear/public/index.html#L715-L831) and the rendering function `renderOpsDetailPanel(issue)` in [`public/app.js`](file:///home/nish4nt/dev/clear/public/app.js#L3376-L3623). |
| **Existing export capabilities** | **Not currently present** | There is no code or route for downloading/generating reports, CSVs, PDFs, or HTML exports in the existing application. |

---

## Bounty Progress & Status Tracking

This section tracks the completion status and documentation of key decision questions for each bounty requirement.

### Bounty 1: Attachments to Environment Reports
- **Status**: ✅ Completed (Enhanced with Multi-Contributor Support & Collapsible UI)
- **Implementation & Clarifications**:
  1. **Multi-Contributor Relationship**: Implemented a `ReportAttachment` model in the database allowing multiple authenticated citizens or municipal officers to contribute up to one supporting attachment per report, while maintaining compatibility with the original author's attachment.
  2. **Collapsible View**: Wrapped the list of contributed evidence/attachments inside a styled Neo-Brutalist `<details>` collapsible component to prevent layout clutter when many attachments are submitted.
  3. **Role Accessibility**: Verified that both Resident Reporters (citizens) and Operations Officers (municipalities) can view and contribute attachments correctly.

### Bounty 2: Role-Aware Evidence Item Filters
- **Status**: ✅ Completed (Interactive Sub-Role Toggles)
- **Implementation Details**:
  1. **Sub-Role Options**: Introduced a Switch Role menu in the user profile dropdown for Authority (municipal), Investigator, and Admin sub-roles.
  2. **Scoped List Results**:
     - **Authority (municipal)**: Filters reports to the officer's assigned district (e.g., SAS NAGAR).
     - **Investigator**: Scopes visibility to active reports (Review Queue, Pending Review, In Progress) within their district and hides Resolved/Notices sidebar tabs.
     - **Admin**: Views reports across all districts with a custom district dropdown selector.
  3. **Permission Scoping**: Restricts investigators to read-only access (restricted triage actions and internal notes), enforcing robust authorization boundaries.

### Bounty 3: Project-Specific Report Export
- **Status**: ✅ Completed (Interactive HTML/Print-to-PDF Export)
- **Implementation Details**:
  1. **Export PDF Button**: Added an "Export PDF" button to the header of the Report Inspection details side panel, displayed dynamically only when a report is in "Resolved" status.
  2. **Print-to-PDF Layout**: Clicking the button opens a print-friendly window styled with the application's fonts (Outfit/Inter), Neo-Brutalist borders, and flat shadow tokens.
  3. **Included Fields**: The export integrates all original civic report fields (Title, Description, District, GPS Coordinates, Author, Report Date) alongside the resolution details (Resolution Note, Operations Completion Note, Resolved Date), side-by-side Before/After comparison images, any supporting attachments, and the comment log.
  4. **Auto-Trigger Print Dialog**: Automatically triggers the browser's native print/save-to-PDF dialog on load, with a clean "no-print" bar allowing manual printing or closing.

