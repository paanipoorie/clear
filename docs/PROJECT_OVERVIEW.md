# C.L.E.A.R. Project Overview

## What is C.L.E.A.R.?
**C.L.E.A.R.** (Crowdsourced Local Environmental Action & Resolution) is a modern civic engagement platform that connects local residents (citizens) directly with municipal operations officers. It enables collaborative identification, tracking, and resolution of local environmental issues such as illegal dumping, open waste burning, drainage blockages, and hazardous spills.

---

## Project Vision
To foster clean, safe, and sustainable neighborhoods by bridging the communication gap between citizens and municipal authorities. C.L.E.A.R. empowers communities to act as the eyes on the ground, while providing municipal squads with structured triage and dispatch tools to resolve issues transparently.

---

## Core Problem
Urban and rural environments suffer from localized issues that escape municipal attention. Traditional reporting channels (helplines, manual forms) are slow, non-transparent, and lack spatial precision. This leads to:
1. Delayed municipal response to environmental hazards.
2. Inefficient resource allocation for field squads.
3. Lack of public visibility into whether and how reported issues are resolved, eroding civic trust.

---

## User Roles

### 1. Resident Reporter (Civil / Citizen)
*   **Purpose**: Act as local observers to report and track environmental issues.
*   **Key Capabilities**:
    *   Register and log in using an email and password.
    *   Create environmental reports with titles, detailed descriptions, geographic coordinates (via map pin drops), photo uploads, and reference links.
    *   Choose to report issues publicly or anonymously.
    *   Filter reports by district and search query to explore what is happening locally.
    *   Toggle "Follow" on specific issues to track their progress.
    *   Upvote reports to signal urgency (restricted to 1 upvote per user).
    *   Write comments to discuss issues and coordinate community efforts.
    *   Appeal rejected reports by submitting additional evidence (explanation and photo proof).
    *   Receive real-time alerts in the notification bell feed when followed report statuses transition.

### 2. Operations Officer (Municipal)
*   **Purpose**: Triage reports, coordinate response squads, resolve issues, and issue alerts.
*   **Key Capabilities**:
    *   Log in using an email and specific municipal security Auth Key (must match `MUNICIPAL_AUTH_KEY` environment variable).
    *   Access a dedicated district-level operations dashboard.
    *   Manage a Kanban Board representing the triage queue:
        *   **Review Queue**: New and appealed reports waiting for assessment.
        *   **Acknowledged**: Accepted reports awaiting team dispatch.
        *   **In Progress**: Active cleanup or repair work in the field.
    *   Inspect report evidence (descriptions, maps, coordinates, links, original pictures, additional appeal pictures).
    *   Reject reports with clear categories (e.g., duplicate, incorrect location, private property) and custom text explanations.
    *   Add internal notes to reports (e.g., dispatch schedules, team assignments).
    *   Resolve reports by submitting mandatory resolution photos ("After" proof) and a community summary note.
    *   Publish and manage official public bulletins/notices (e.g., seasonal air quality warnings, sorting drives) for specific districts.

---

## Tech Stack
*   **Backend**: Node.js with [Express](https://expressjs.com/) (`server.js`).
*   **Frontend**: Single Page Application (SPA) built with Vanilla HTML5, Vanilla JavaScript, and Custom CSS (Neo-Brutalist inspired design system).
*   **Mapping & Location**: [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles.
*   **Database**: PostgreSQL server queried using Prisma ORM.
*   **Authentication**: JSON Web Tokens (JWT) signed via backend keys and stored in secure HTTP-only cookies.
*   **File Storage**: Local uploads of citizen/resolution photos managed as physical files under `/media/uploads/` on the server disk.

---

## Folder Structure
```
clear/
├── docs/                   # Project documentation markdown files (this folder)
├── media/                  # Holds uploaded images (issues, resolutions, and appeals)
│   ├── issues/             # Default mock image assets
│   └── uploads/            # Persistent directory for citizen/officer uploaded photos
├── node_modules/           # Node dependencies
├── package.json            # Root configuration for start/dev scripts and dependencies
├── prisma/                 # Database schema models and migrations folder
│   ├── migrations/         # PostgreSQL database schema migration history
│   ├── schema.prisma       # Active Prisma schema configuration (PostgreSQL)
│   └── seed.ts             # Database seed script for initial testing data
├── prisma.config.ts        # Prisma configuration
├── public/                 # ACTIVE frontend codebase (Vanilla HTML, CSS, JS)
│   ├── favicon/            # Icons and app manifests
│   ├── app.js              # Core application logic, routing, event listeners, component templates
│   ├── brand-logo.js       # Reusable web component for branding logo
│   ├── index.html          # Shell layout, login screens, modals, details drawer
│   └── style.css           # Subtle Neo-Brutalist responsive stylesheet
├── publicview.md           # Client architectural reference guide
├── server.js               # Express server (JWT authentication, database queries, and upload routers)
└── skills-lock.json        # Auto-generated agent configuration file
```

---

## Current Project Status
The platform is fully deployable with a robust backend, production relational database, and responsive SPA:
*   **Data Layer**: Utilizes PostgreSQL persistence. User accounts are verified server-side with passwords securely hashed.
*   **Real-time Updates**: Status transitions trigger notification events delivered to citizen feeds.
*   **Styling**: Features custom HSL-based light/dark themes with strong neo-brutalist accents, Outfit and Inter typography, smooth animations, and collapsible navigation.
