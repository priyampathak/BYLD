# BYLD Submission Tracker — Application Architecture & Screen Breakdown

This document provides a concise overview of every screen, section, and interactive workflow within the **BYLD Submission Tracker**.

---

## 1. Demo Login Screen (`/login`)

**Purpose:** Provide evaluators with instant access to test the application under different operational roles.

* **Interactive Demo Persona Cards:** One-click login buttons for 4 demo accounts:
  * **Priya Pathak** — Senior Account Manager (`priya@byld.demo`)
  * **Raj Mehta** — Account Manager (`raj@byld.demo`)
  * **Sarah Jenkins** — Delivery & Ops Lead (`ops@byld.demo`)
  * **Vikram Malhotra** — VP of Client Partnerships (`sales@byld.demo`)
* **Credential Credentials Box:** Displays demo emails and passwords (`demo123`).
* **Standard Credentials Form:** Fallback login form for email/password entry.

---

## 2. Overview Dashboard (`/overview`)

**Purpose:** Provide a bird's-eye view of operational submission performance without unneeded clutter.

* **Operational Metrics Grid:** 6 compact clickable cards:
  * *Total Submissions* — All candidates across all requisitions.
  * *Active Submissions* — Candidates currently in progress (`Submitted`, `Client Review`, `Interview`, `Offer`).
  * *Interviews* — Candidates in technical/client interview rounds.
  * *Offers* — Candidates with active offers released.
  * *Placed* — Successfully hired candidates.
  * *Flagged Duplicates* — Overridden duplicate resubmissions requiring audit.
  * *Clicking any metric navigates directly to the filtered Submissions view.*
* **Submission Pipeline Summary:** Breakdown of submissions by stage stage with count and percentage distribution.
* **Needs Attention (Flagged Audit Panel):** Highlights resubmissions where an Account Manager overrode duplicate warnings, showing candidate, submitter, and override reason.
* **Recent Submissions Feed:** Real-time feed of the 5 most recently created candidate submissions.

---

## 3. Submissions View — Primary Screen (`/submissions`)

**Purpose:** The main daily workspace for Account Managers, Ops, and Sales to track and filter candidate submissions.

* **Header Count Chips:** Real-time summary chips (`24 Total`, `8 Client Review`, `5 Interview`, `3 Offer`, `2 Flagged`).
* **Search & Filter Toolbar:**
  * *Search Bar:* Instant text search by candidate name, email, phone number, primary skill, or requisition title.
  * *Account Manager Filter:* Defaults to `AM = Me` for Account Managers and `AM = All` for Ops/Sales.
  * *Client & Requisition Filters:* Multi-attribute filtering.
  * *Status Filter:* Filter by single status or active pipeline stages.
  * *Flagged Duplicates Only Toggle:* One-click audit view for overridden duplicates.
  * *Active Filter Chips & Clear Action:* Clear visual feedback on active criteria.
* **Table View (Primary Representation):**
  * Displays Candidate, Requisition, Client, Account Manager (with avatar), Status badge, Submitted date, Relative last updated time, and Flagged Duplicate badge.
  * Rows are clickable to open the detail drawer.
* **Kanban View (Secondary Representation):**
  * 7 status columns (`Submitted`, `Client Review`, `Interview`, `Offer`, `Placed`, `Rejected`, `Withdrawn`).
  * Cards display candidate name, job title, client, AM avatar, date, and duplicate badge.
  * Drag-and-drop capability across columns automatically updates candidate status and logs audit history.

---

## 4. New Submission Flow & Duplicate Warning Engine (`+ New Submission` Modal)

**Purpose:** Streamline candidate entry while enforcing duplicate prevention rules before saving.

* **Candidate Information Fields:** Name, Email, Phone, Primary Skill (optional), Location (optional).
* **Requisition Selector & Auto-Fill:** Selecting a requisition automatically populates the Client name.
* **Automatic Context:** Submitter is automatically recorded as the active persona; date defaults to today.
* **Duplicate Detection Rules:**
  1. *No Match:* Saves submission directly.
  2. *Active Duplicate Warning:* Detects if candidate email/phone matches an active submission on the same requisition. Shows previous submitter, date, and status. Requires selecting a reason (*Different role*, *Circumstances changed after rejection*, *Other*) to save as a flagged duplicate.
  3. *Silent Active Duplicate Rule:* Displays warning modal to review existing active submission before overriding.
  4. *90-Day Resubmission Rule:* Candidates rejected/withdrawn >90 days ago display a low-risk resubmission notice and do not force a duplicate reason.

---

## 5. Submission Details Drawer & Status History

**Purpose:** Inspect complete candidate background and update submission status with full audit logging.

* **Header Metadata:** Candidate name, Requisition title/code, Client name, and Flagged Duplicate badge.
* **Status Selector & Confirmation:** Compact status dropdown that triggers a confirmation modal before updating status.
* **Candidate Info Card:** Contact details, email, phone, location, and key skills.
* **Submission Info Card:** Submitter name, submitter role, and submitted timestamp.
* **Flagged Duplicate Audit Box (If Applicable):** Displays the override reason, authorizing user, and original submission reference.
* **Status History Timeline:** Chronological audit trail showing every status change, timestamp, user identity, and optional status note.

---

## 6. Workspace Reference Screens

### Clients Directory (`/clients`)
* Grid of client partner organizations (e.g. Acme Corp, HDFC Tech, Zomato, Razorpay).
* Shows industry, total open requisitions, total candidate submissions, and a modal to create new client records.

### Requisitions Directory (`/requisitions`)
* Grid of open staffing requisitions displaying REQ code, job title, client, status (`Active`/`Closed`), location, total submissions count, and active submissions count.
* Includes a modal to create new job requisitions.

---

## 7. Global App Shell & Navigation Layout

* **Persistent Left Sidebar:** Navigation between Overview, Submissions (All, My, Flagged), Clients, and Requisitions.
* **Topbar Header:** Displays active page title, current user role badge (*Account Manager*, *Ops / Delivery*, *Sales / Leadership*), user avatar, and primary `+ New Submission` CTA.
* **Persona Switcher Widget:** Located at the bottom of the left sidebar, allowing evaluators to switch roles mid-session instantly.
