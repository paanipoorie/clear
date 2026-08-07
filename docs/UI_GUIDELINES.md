# UI Guidelines

This document outlines the design tokens, component styles, and layout guidelines that define C.L.E.A.R.'s **Subtle Neo-Brutalist Visual Redesign**. Follow these rules to maintain visual consistency across all portals and themes.

---

## 1. Color Palette

The color system uses structured, earthy tones (forest greens and sage grays) paired with a high-contrast theme structure. It supports full Light and Dark modes.

### 1.1 Core Palettes
| Token | Light Value | Dark Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--color-bg` | `#FAFBF9` | `#121410` | General viewport canvas background |
| `--color-card-bg` | `#FFFFFF` | `#1B1E19` | Cards, modals, side panel backgrounds |
| `--color-border` | `#DDE5D7` | `#2E362A` | Primary layout borders |
| `--color-primary` | `#4F8B3B` | `#6BB352` | Forest Green: core brand & primary actions |
| `--color-primary-hover`| `#335A29` | `#8AC873` | Dark Forest: hover states for primary items |
| `--color-primary-soft` | `#F3F8B8` | `#252E20` | Soft limelight highlight background tint |
| `--color-text-main` | `#171F14` | `#F2F5F1` | Charcoal Green: heading and body text |
| `--color-text-muted` | `#5C6E58` | `#A1B29D` | Olive Gray: secondary subtexts |
| `--color-text-subtle` | `#8A9D85` | `#72826F` | Sage Gray: placeholder text |
| `--color-destructive` | `#D9381E` | `#FF6B53` | Rust Red: errors, rejections, deletes |
| `--color-destructive-soft`| `#FDF2F0`| `#2E1E1C` | Pink tint: backgrounds for destructive state |

### 1.2 Status Color Mapping
Used for status badges, Kanban columns, and timeline highlights.
*   **Review Queue / Pending Review**:
    *   *Light*: Bg `#F4F6EC`, Text `#6A7B2C`, Border `#D1D9A7`
    *   *Dark*: Bg `#23261C`, Text `#C0D17F`, Border `#3A3F2F`
*   **Acknowledged / Resolved**:
    *   *Light*: Bg `#E7F3EC`, Text `#2A7043`, Border `#BCD9C8`
    *   *Dark*: Bg `#1A2820`, Text `#71C28F`, Border `#273E31`
*   **In Progress**:
    *   *Light*: Bg `#FCF8DE`, Text `#786C10`, Border `#E8DD95`
    *   *Dark*: Bg `#35321A`, Text `#EAD267`, Border `#4D4925`
*   **Rejected**:
    *   *Light*: Bg `#FDF2F0`, Text `#D9381E`, Border `#F6C1B9`
    *   *Dark*: Bg `#2E1E1C`, Text `#FF6B53`, Border `#4E322F`

---

## 2. Typography

*   **Heading Font Family (`--font-heading`)**: `'Outfit', 'Inter', system-ui, -apple-system, sans-serif`. Used for all titles, headers, and section names. Bold weight (`700`) is the default.
*   **Body Font Family (`--font-body`)**: `'Inter', system-ui, -apple-system, sans-serif`. Used for general body copies, comments, form fields, and labels. Supported weights are `400` (Regular), `500` (Medium), and `600` (Semi-bold).
*   **Brand Logo Typography**: Customized cursive logotype utilizing `'Damion', 'Style Script', 'Vibur'` script fonts.

---

## 3. Sizing and Spacing System

Layout components are structured around absolute grid tokens:
*   `--header-height`: `64px`
*   `--sidebar-width`: `250px`
*   `--content-max-width`: `720px` (Centering limit for citizen stream feeds)
*   **Borders**:
    *   `--border-width`: `1px` (default separators and cards)
    *   `--border-width-thick`: `1.5px` (buttons and highlighted focus borders)
*   **Corner Radii**:
    *   `--radius-lg` (`8px`): Main report cards, modals.
    *   `--radius-md` (`6px`): Input boxes, buttons, textareas, search container.
    *   `--radius-sm` (`4px`): Dropdown select, action buttons, tags, chips.
    *   `--radius-full` (`9999px`): Rounded sliders, pill badges, upvote pills.

---

## 4. UI Component Design Patterns

### 4.1 Button Styles

*   **Primary Action Button (`.btn-primary`)**:
    *   Filled Forest Green background with white text.
    *   *Interaction*: Darkens background on hover, transitions box-shadow.
*   **Outline Button (`.btn-outline`)**:
    *   Transparent background, Forest Green text, and thick border.
    *   *Interaction*: Fills with a light Forest Green hover tint.
*   **Back Button (`.btn-back`)**:
    *   Used in auth screens. Left arrow icon with subtle subtext. Underline on hover.
*   **Triage Buttons (`.btn-ops-triage`)**:
    *   Wide, flat action buttons inside the details drawer status ribbon.
    *   `.btn-ops-triage-primary` (Green), `.btn-ops-triage-danger` (Red), `.btn-ops-triage-warning` (Yellow), `.btn-ops-triage-secondary` (Sage Gray).

### 4.2 Card Styles

*   **Citizen Report Post Card (`.post-card`)**:
    *   White background, bordered (`--color-border`).
    *   Image fits full width inside `.post-card-image-wrapper` with a subtle zoom animation on card hover.
    *   Meta rows use small, muted sage text. Action buttons (upvote, comment, follow) are clustered as pill buttons.
*   **Kanban Board Card (`.kanban-issue-card`)**:
    *   Compact container without visible card images (dense view).
    *   Contained inside Kanban columns. Shows title, date, priority badge, and small count icons.
*   **Notice/Bulletin Card (`.notice-card`)**:
    *   Padded card with thick borders and left accents (solid green border or yellow warning indicator based on type).

---

## 5. Layout Rules

### 5.1 Citizen Portal Viewport
*   The feed stream is centered with a max-width of `720px`. The sidebar stays fixed on the left (`250px`).
*   Details drawer (`#opsSidePanel`) is fixed on the right, taking up `400px` width. Slides in over the main viewport without shifting feed columns.

### 5.2 Municipal Portal Viewport
*   Expands to full width (`100vw` minus sidebar width) to fit the multi-column Kanban board.
*   Kanban columns use a three-column horizontal grid (`1fr 1fr 1fr`). Columns are scrollable independently.

### 5.3 Sidebar Rules
*   **Location Filter Dropdown**: Anchored dropdown that expands downward. Clicking it reveals the search bar and shifts the lists smoothly.
*   **User Profile Placement**: Fixed to the absolute bottom of the left sidebar. Houses the trigger button to open the dropdown menu upward.

### 5.4 Header Rules
*   **Theme Toggle**: Stays fixed to the right of the header. Sun/moon icons swap dynamically based on data-theme attributes.
*   **Notification Bell**: Positioned directly next to the theme toggle (Citizen portal only). Shows a red badge dot if active notifications exist.
