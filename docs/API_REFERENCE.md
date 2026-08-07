# API Reference

This document details the REST API endpoints implemented in the C.L.E.A.R. platform. All routes require request validation, correct JSON payload parsing, and relational database integrity enforcement.

---

## 1. Authentication

### 1.1 User Registration
*   **Method**: `POST`
*   **Route**: `/api/auth/register`
*   **Auth Requirement**: None
*   **Request Body**:
    ```json
    {
      "username": "Nishant Kumar",
      "email": "user1@email.com",
      "password": "password",
      "role": "citizen", // or "municipal"
      "district": "SAS NAGAR", // required if role is municipal
      "authKey": "HX291Z" // required if role is municipal (must match MUNICIPAL_AUTH_KEY)
    }
    ```
*   **Response**:
    *   `Status: 201 Created`
    *   ```json
        {
          "success": true,
          "user": {
            "id": "user-uuid",
            "username": "Nishant Kumar",
            "role": "citizen",
            "district": null
          }
        }
        ```
    *   **Side Effects**: Sets an HTTP-only JWT session cookie (`token`) valid for 7 days.

### 1.2 User Login
*   **Method**: `POST`
*   **Route**: `/api/auth/login`
*   **Auth Requirement**: None
*   **Request Body**:
    ```json
    {
      "emailOrUsername": "user1@email.com",
      "password": "password"
    }
    ```
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "success": true,
          "user": {
            "id": "user-uuid",
            "username": "Nishant Kumar",
            "role": "citizen",
            "district": null
          }
        }
        ```
    *   **Side Effects**: Sets an HTTP-only JWT session cookie (`token`) valid for 7 days.

### 1.3 Get Current User Profile
*   **Method**: `GET`
*   **Route**: `/api/auth/me` (and compatibility path `/api/user`)
*   **Auth Requirement**: Session Authenticated
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "id": "user-uuid",
          "username": "Nishant Kumar",
          "role": "citizen",
          "district": null,
          "avatar": "/images/avatar.png"
        }
        ```

### 1.4 Logout Session
*   **Method**: `POST`
*   **Route**: `/api/auth/logout` (and compatibility path `/api/user/logout`)
*   **Auth Requirement**: None
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "success": true,
          "message": "Logged out successfully"
        }
        ```
    *   **Side Effects**: Clears the session cookie.

---

## 2. Reports

### 2.1 Get Reports (Issues List)
*   **Method**: `GET`
*   **Route**: `/api/issues`
*   **Auth Requirement**: Session Authenticated
*   **Query Parameters**:
    *   `subLocation` (string, optional): Filters issues by district (case-insensitive, e.g., `SAS NAGAR`).
    *   `myIssues` (string, optional): If `"true"`, filters reports created or followed by the logged-in user.
    *   `followedOnly` (string, optional): If `"true"`, filters issues followed by the logged-in user.
    *   `search` (string, optional): Keyword query string. Matches against issue titles, descriptions, and sublocations.
    *   `userId` (string, optional): Filters issues by `authorId`.
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        [
          {
            "id": 1,
            "title": "Illegal dumping behind residential area",
            "location": "Punjab",
            "subLocation": "SAS NAGAR",
            "description": "Piles of trash bags and plastic debris...",
            "images": ["/media/uploads/17234857-img.jpg"],
            "imageType": "dumping",
            "upvotes": 42,
            "downvotes": 0,
            "followed": false,
            "reported": false,
            "comments": [],
            "createdAt": "2026-08-07T12:00:00.000Z",
            "status": "Acknowledged",
            "internalNotes": "Assigned to squad.",
            "resolutionImages": [],
            "resolutionNote": "",
            "timeline": [
              { "status": "Review Queue", "timestamp": "2026-08-07T12:00:00.000Z" }
            ],
            "authorId": "author-uuid",
            "authorName": "Abhyudaya Sengar",
            "isAnonymous": false,
            "links": [],
            "coordinates": { "lat": 30.7333, "lng": 76.7794 }
          }
        ]
        ```
    *   **Privacy Note**: If `isAnonymous` is `true`, and the logged-in user is **neither** the author **nor** a municipal officer, the returned `authorName` is masked as `"Anonymous"`.

### 2.2 Create Report
*   **Method**: `POST`
*   **Route**: `/api/issues`
*   **Auth Requirement**: Session Authenticated (Citizen role)
*   **Request Body**:
    ```json
    {
      "title": "Unclogged drain overflowing",
      "description": "Monsoon clogging leading to wastewater spill...",
      "location": "Punjab",
      "subLocation": "PATIALA",
      "imageType": "water",
      "images": ["data:image/jpeg;base64,..."], // base64 strings decoded and written as files to disk
      "links": ["https://waterauthority.gov"],
      "coordinates": { "lat": 30.7333, "lng": 76.7794 },
      "isAnonymous": false
    }
    ```
*   **Response**:
    *   `Status: 201 Created`
    *   Returns the created Report object (with generated `id`, `upvotes: 1`, `status: "Review Queue"`, `images` saved as relative file URLs on the server, e.g. `"/media/uploads/..."`).

### 2.3 Retrieve Specific Report Details
*   **Method**: `GET`
*   **Route**: `/api/issues/:id`
*   **Auth Requirement**: Session Authenticated
*   **Response**:
    *   `Status: 200 OK`
    *   Returns the detailed Report object with comments, timeline, and user context.

---

## 3. Comments

### 3.1 Post Comment
*   **Method**: `POST`
*   **Route**: `/api/issues/:id/comments`
*   **Auth Requirement**: Session Authenticated
*   **Request Body**:
    ```json
    {
      "text": "This is causing a severe issue for commuters."
    }
    ```
*   **Response**:
    *   `Status: 201 Created`
    *   ```json
        {
          "id": 3,
          "user": "Nishant Kumar",
          "text": "This is causing a severe issue for commuters.",
          "timestamp": "Just now"
        }
        ```

---

## 4. Upvotes & Following

### 4.1 Toggle Follow State
*   **Method**: `POST`
*   **Route**: `/api/issues/:id/follow`
*   **Auth Requirement**: Session Authenticated (Citizen role)
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "followed": true
        }
        ```

### 4.2 Submit Upvote
*   **Method**: `POST`
*   **Route**: `/api/issues/:id/vote`
*   **Auth Requirement**: Session Authenticated (Citizen role)
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "upvotes": 43
        }
        ```
    *   **Enforcement**: Restricts citizens to 1 upvote per issue. Returns `400 Bad Request` if already upvoted.

---

## 5. Notifications

### 5.1 Fetch Notifications Feed
*   **Method**: `GET`
*   **Route**: `/api/notifications`
*   **Auth Requirement**: Session Authenticated
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        [
          {
            "id": 12,
            "userId": "user-uuid",
            "reportId": 10,
            "message": "Report \"Pothole leakage...\" status updated to Acknowledged.",
            "status": "Acknowledged",
            "read": false,
            "createdAt": "2026-08-08T02:00:00.000Z"
          }
        ]
        ```

### 5.2 Mark Notification as Read
*   **Method**: `PATCH`
*   **Route**: `/api/notifications/:id/read`
*   **Auth Requirement**: Session Authenticated
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "success": true
        }
        ```

### 5.3 Dismiss All Notifications
*   **Method**: `POST`
*   **Route**: `/api/notifications/clear`
*   **Auth Requirement**: Session Authenticated
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "success": true
        }
        ```

---

## 6. Municipality Operations

### 6.1 Update Report Status (Triage)
*   **Method**: `PATCH`
*   **Route**: `/api/issues/:id/status`
*   **Auth Requirement**: Municipal Officer Session (Municipal role)
*   **Request Body (Acknowledge / Start Work)**:
    ```json
    {
      "status": "Acknowledged" // or "In Progress"
    }
    ```
*   **Request Body (Resolve Report)**:
    ```json
    {
      "status": "Resolved",
      "resolutionImages": ["data:image/jpeg;base64,..."], // written as file
      "resolutionNote": "The debris has been cleared."
    }
    ```
*   **Request Body (Reject Report)**:
    ```json
    {
      "status": "Rejected",
      "rejectionReason": "Issue is located inside private property."
    }
    ```
*   **Response**:
    *   `Status: 200 OK`
    *   Returns the fully updated Report object including updated status, timeline, and resolution/rejection data.
    *   **Side Effect**: Generates a database notification record for all users following this report.

### 6.2 Update Internal Notes
*   **Method**: `PATCH`
*   **Route**: `/api/issues/:id/notes`
*   **Auth Requirement**: Municipal Officer Session (Municipal role)
*   **Request Body**:
    ```json
    {
      "internalNotes": "Squad 4 dispatched."
    }
    ```
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        {
          "success": true,
          "internalNotes": "Squad 4 dispatched."
        }
        ```

---

## 7. Notices

### 7.1 Get Notices
*   **Method**: `GET`
*   **Route**: `/api/notices`
*   **Auth Requirement**: Session Authenticated
*   **Response**:
    *   `Status: 200 OK`
    *   ```json
        [
          {
            "id": 1,
            "title": "Air Quality Advisory",
            "description": "Stubble burning PM2.5 alert.",
            "location": "Punjab",
            "subLocation": "LUDHIANA",
            "type": "Warning",
            "createdAt": "2026-08-07T12:00:00.000Z",
            "expiryDate": "2026-08-14"
          }
        ]
        ```

### 7.2 Create Notice
*   **Method**: `POST`
*   **Route**: `/api/notices`
*   **Auth Requirement**: Municipal Officer Session (Municipal role)
*   **Request Body**:
    ```json
    {
      "title": "Cleanliness Drive",
      "description": "Join the corporate cleanliness drive...",
      "subLocation": "SAS NAGAR",
      "type": "Drive / Campaign",
      "expiryDate": "2026-08-10"
    }
    ```
*   **Response**:
    *   `Status: 201 Created`
    *   Returns the created Notice object.

---

## 8. Appeals

### 8.1 Submit Citizen Appeal
*   **Method**: `POST`
*   **Route**: `/api/issues/:id/appeal`
*   **Auth Requirement**: Session Authenticated (Citizen role)
*   **Request Body**:
    ```json
    {
      "appealMessage": "This blocks the market safety exit.",
      "additionalImages": ["data:image/jpeg;base64,..."] // written as file
    }
    ```
*   **Response**:
    *   `Status: 200 OK`
    *   Returns the updated Report object (status updated to `"Pending Review"`, appeal details and images appended, timeline updated).
    *   **Side Effect**: Generates a database notification record for all users following this report.
