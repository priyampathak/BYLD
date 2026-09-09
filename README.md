# BYLD Submission Tracker

A polished, high-density internal B2B operational tool designed for **Account Managers**, **Ops/Delivery**, and **Sales/Leadership** at BYLD to track candidate submissions, eliminate accidental duplicate submissions, manage submission pipeline statuses, and audit overridden resubmissions.

---

## 1. Executive Summary & Problem Solved

Prior to this application, candidate submissions were tracked across spreadsheets and scattered communication channels. This caused three major issues:
1. **Accidental Duplicate Submissions:** Account Managers could not see what teammates had already submitted to a client requisition.
2. **Slow Status Visibility:** Answering client questions required querying multiple team members.
3. **Leadership Blind Spots:** Sales & Ops lacked visibility into candidate pipelines and flagged duplicates.

The **BYLD Submission Tracker** serves as the central operational source of truth with real-time duplicate warning systems, persona-based views, table & Kanban visual representations, and status history tracking.

---

## 2. Tech Stack & Architecture

- **Framework:** Next.js (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS (Minimalist, modern SaaS aesthetic inspired by Linear & Ramp)
- **Icons:** Lucide React
- **Data Persistence:** In-memory repository with LocalStorage synchronization (`/lib/db/repository.ts`)
- **State Management:** React Context API for Demo Authentication and Persona Switching (`/lib/context/AuthContext.tsx`)

### Folder Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── overview/          # Bird's-Eye Dashboard
│   ├── submissions/       # Table & Kanban Views (Primary Screen)
│   ├── clients/           # Workspace Reference Directory
│   ├── requisitions/      # Workspace Reference Directory
│   └── login/             # Demo Authentication Page
├── components/
│   ├── layout/            # Sidebar, Topbar, AppShell
│   ├── dashboard/         # Overview Metrics & Pipeline Summary
│   ├── submissions/       # Table, Kanban, Filters, New Submission & Warning Modal, Detail Drawer
│   └── ui/                # Status Badges & UI Primitives
├── lib/
    ├── context/           # AuthContext & Persona Switcher
    ├── db/                # Seed Data & Mock Repository Layer
    └── types/             # Shared TypeScript Interfaces
```

---

## 3. How to Run the Application

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at http://localhost:3000
```

To test a production build:
```bash
npm run build
npm start
```

---

## 4. Demo Accounts & Persona Testing

The prototype includes pre-configured demo credentials for testing different operational roles:

| Role | Name | Email | Default View |
| :--- | :--- | :--- | :--- |
| **Account Manager (Primary)** | Priya Pathak | `priya@byld.demo` | **My Submissions** (`AM = Me`) |
| **Account Manager** | Raj Mehta | `raj@byld.demo` | **My Submissions** (`AM = Me`) |
| **Ops / Delivery** | Sarah Jenkins | `ops@byld.demo` | **All Submissions** (`AM = All`) |
| **Sales / Leadership** | Vikram Malhotra | `sales@byld.demo` | **All Submissions** & **Flagged Audit** |

> **Persona Switcher:** Evaluators can switch personas at any time using the persona menu at the bottom of the left sidebar or at `/login`.

---

## 5. Key Product Features & Workflows

### A. Candidate Submission & Duplicate Detection Logic (Sections 12–15)
- **Automatic Auto-Fill:** Selecting a Requisition automatically populates the Client name. Submitter is set to the active persona.
- **Duplicate Check Rule:** Checks if candidate (Email OR Phone) matches an existing submission on the same Requisition.
- **Silent Active Duplicate Warning:** If an active submission exists on the same requisition and no legitimate reason is given, accidental silent creation is prevented.
- **Warning & Override Flow:** Prompts the user with the submitter name, original date, and current status, and requires choosing a valid reason (*Different role*, *Circumstances changed after rejection*, *Other*).
- **Old Rejection / Withdrawal Rule (> 90 Days):** If a matching candidate was rejected/withdrawn more than 90 days ago, the system displays a low-risk notice and allows resubmission without forcing a duplicate reason.

### B. Dual Visualization: Table & Kanban Views (Sections 10 & 11)
- **Table View:** Compact, high-density row layout with status badges, submitter avatars, relative timestamps, and flagged duplicate indicators.
- **Kanban View:** Drag-and-drop workflow across 7 stages (`Submitted` → `Client Review` → `Interview` → `Offer` → `Placed` → `Rejected` → `Withdrawn`). Dragging automatically updates status history with user ID and timestamp.

### C. Submission Details Drawer & Status Timeline (Sections 16 & 17)
- Clicking any row or card slides open the details drawer.
- Status changes require confirmation and log a timestamped entry with the active user's identity.

### D. Bird's-Eye Overview Dashboard (Section 8)
- Operational metrics (Total, Active, Interviews, Offers, Placed, Flagged Duplicates). Clickable cards filter the submissions view directly.
- Summary pipeline view and "Needs Attention" audit panel.

---

## 6. Product Decisions & V1 Scope Boundaries

1. **Duplicate submissions are warned, not universally blocked:** Account Managers are given guided autonomy to override warnings with explicit recorded reasons.
2. **Old Rejected/Withdrawn submissions older than 90 days don't require a reason:** Low-risk historical resubmissions are streamlined.
3. **Conversion reporting is intentionally deferred:** PRD explicitly excludes finance/conversion data sources in v1.
4. **The Submission List is the primary operational screen:** Kanban provides secondary visualization of the same dataset.
5. **No external database or auth server:** Built with client-side/session mock persistence for prototype reliability.
