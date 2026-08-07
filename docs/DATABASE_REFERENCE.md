# Database Reference

C.L.E.A.R. uses a relational production database layer backed by **PostgreSQL** and managed via **Prisma ORM**:
1.  **PostgreSQL Server Persistence**: All application state (users, reports, comments, timeline events, follows, upvotes, notices, and notifications) is persisted in the PostgreSQL database.
2.  **Prisma Client Integration**: The backend application (`server.js`) utilizes the generated Prisma Client with a driver adapter (`@prisma/adapter-pg`) to perform database queries.
3.  **Local Storage Cache**: Browser `localStorage` is kept in sync only for client-side authentication states (`clear_user_authenticated`, `clear_username`) to preserve the frontend layout checks without mocking the database endpoints.

---

## 1. User Model
Represents both citizens and municipal officers. Managed in the `User` PostgreSQL table.

### 1.1 Fields
| Field Name | Type | Purpose | Constraints / Values |
| :--- | :--- | :--- | :--- |
| `id` | `String` | Unique identifier (UUID) | Primary Key |
| `username` | `String` | Unique display name of the user | Unique |
| `email` | `String` | Verified email address | Unique, used for authentication |
| `password` | `String` | Hashed password | Hashed using `bcryptjs` with 10 salt rounds |
| `role` | `String` | Governs authorization and layout rendering | `"citizen"` or `"municipal"` (Default: `"citizen"`) |
| `district` | `String` | Geographic assignment (Municipal officers only) | e.g. `"SAS NAGAR"` (uppercase, nullable) |
| `authKey` | `String` | Security key used during municipal registration | Matches backend `MUNICIPAL_AUTH_KEY` (nullable) |
| `createdAt` | `DateTime` | Creation timestamp | Default: now() |

### 1.2 Relationships
*   **One-to-Many** with **Report**: A User can author many Reports (`reports`).
*   **One-to-Many** with **Comment**: A User can write many Comments (`comments`).
*   **One-to-Many** with **Notice**: A User (Municipal Officer) can publish many notices (`notices`).
*   **One-to-Many** with **Notification**: A User can receive many notifications (`notifications`).
*   **Many-to-Many** with **Report** (via **ReportFollow**): A User can follow many reports (`follows`).
*   **Many-to-Many** with **Report** (via **ReportUpvote**): A User can upvote many reports (`upvotes`).

---

## 2. Report Model
Represents an environmental issue report. Managed in the `Report` PostgreSQL table.

### 2.1 Fields
| Field Name | Type | Purpose | Constraints / Values |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | Unique sequential identifier | Primary Key, Auto-incrementing |
| `title` | `String` | Brief description of the issue | Required |
| `description`| `String` | Detailed remarks | Optional, nullable |
| `location` | `String` | Province/State | Default is `"Punjab"` |
| `subLocation`| `String` | Target district (governs dashboard mapping) | Uppercase, one of 23 Punjab districts |
| `latitude` | `Float` | Spatial lat coordinate | Float |
| `longitude` | `Float` | Spatial lng coordinate | Float |
| `imageType` | `String` | Visual categorizer for placeholder images | Default: `"default"` |
| `images` | `String[]` | Array of persistent URLs for citizen photos | Stored locally in `/media/uploads/` |
| `links` | `String[]` | Array of references/websites attached | Array of strings |
| `upvotes` | `Int` | Count of citizen upvotes | Default: 1 |
| `createdAt` | `DateTime` | Creation timestamp | Default: now() |
| `status` | `String` | Workflow stage | `"Review Queue"`, `"Acknowledged"`, `"In Progress"`, `"Resolved"`, `"Rejected"`, `"Pending Review"` |
| `internalNotes`| `String` | Municipal squad work details/assignments | Default: `""` |
| `resolutionNote`| `String`| Public resolution summary | Required if status is `"Resolved"` |
| `resolutionImages`| `String[]`| Persistent URLs of resolution photos | Required if status is `"Resolved"` |
| `rejectionReason`| `String`| Rejection category and justifications | Required if status is `"Rejected"` |
| `rejectedAt` | `DateTime` | Rejection timestamp | Nullable |
| `appealMessage`| `String`| Citizen's explanation for challenging rejection | Nullable |
| `additionalImages`| `String[]`| Persistent URLs of appeal photos | Required on appeal |
| `appealedAt` | `DateTime` | Appeal timestamp | Nullable |
| `isAnonymous`| `Boolean` | Toggle to hide reporter identity | Default: `false` |
| `authorId` | `String` | Author User ID | Foreign Key linking to `User.id` |

### 2.2 Relationships
*   **One-to-Many** with **Comment**: A Report can have many Comments.
*   **One-to-Many** with **TimelineEvent**: A Report maintains a chronological audit history of status changes.
*   **One-to-Many** with **ReportFollow**: List of followers.
*   **One-to-Many** with **ReportUpvote**: List of voters.
*   **One-to-Many** with **Notification**: Notifications triggered by this report.

---

## 3. Comment Model
Stored in the `Comment` PostgreSQL table.

### 3.1 Fields
| Field Name | Type | Purpose | Constraints / Values |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | Unique sequential identifier | Primary Key, Auto-incrementing |
| `reportId` | `Int` | Target report ID | Foreign Key linking to `Report.id` (Cascades on delete) |
| `authorId` | `String` | Commenter User ID | Foreign Key linking to `User.id` |
| `text` | `String` | Comment body text | Required |
| `createdAt` | `DateTime` | Comment timestamp | Default: now() |

---

## 4. TimelineEvent Model
Logs report lifecycle status transitions for audit. Stored in the `TimelineEvent` PostgreSQL table.

### 4.1 Fields
| Field Name | Type | Purpose | Constraints / Values |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | Unique sequential identifier | Primary Key, Auto-incrementing |
| `reportId` | `Int` | Target report ID | Foreign Key linking to `Report.id` (Cascades on delete) |
| `status` | `String` | Status transition stage | e.g. `"In Progress"` |
| `timestamp` | `DateTime` | Transition timestamp | Default: now() |

---

## 5. Notice Model
Represents official community bulletins. Stored in the `Notice` PostgreSQL table.

### 5.1 Fields
| Field Name | Type | Purpose | Constraints / Values |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | Unique sequential identifier | Primary Key, Auto-incrementing |
| `title` | `String` | Heading of notice | Required |
| `description`| `String` | Notice details | Required |
| `location` | `String` | Province/State | Default is `"Punjab"` |
| `subLocation`| `String` | Target district matching municipal assignment | Uppercase |
| `type` | `String` | Classification category | `"Warning"` or `"Drive / Campaign"` |
| `expiryDate` | `DateTime` | Expiration date of bulletin | Nullable |
| `createdAt` | `DateTime` | Date published | Default: now() |
| `authorId` | `String` | Publishing municipal officer's ID | Foreign Key linking to `User.id` |

---

## 6. Notification Model
Stores real-time status alerts for report followers. Stored in the `Notification` PostgreSQL table.

### 6.1 Fields
| Field Name | Type | Purpose | Constraints / Values |
| :--- | :--- | :--- | :--- |
| `id` | `Int` | Unique sequential identifier | Primary Key, Auto-incrementing |
| `userId` | `String` | Recipient user ID | Foreign Key linking to `User.id` (Cascades on delete) |
| `reportId` | `Int` | Target report ID | Foreign Key linking to `Report.id` (Cascades on delete) |
| `message` | `String` | Human-readable alert summary | Required |
| `status` | `String` | Transition status | e.g. `"Resolved"` |
| `read` | `Boolean` | Notification read status | Default: `false` |
| `createdAt` | `DateTime` | Creation timestamp | Default: now() |
