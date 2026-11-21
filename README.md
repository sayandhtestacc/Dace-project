# DUK Hub — Campus Service Platform (DACE-I Interactive Demo)

> **Institution:** Digital University Kerala (Kerala University of Digital Sciences, Innovation and Technology), Technopark Phase IV, Trivandrum.  
> **Course:** Digital Access for Community Empowerment (DACE-I)  
> **Project Focus:** Three everyday campus friction points unified into a single client-side interactive platform with zero server dependencies.

---

## 🚀 Quick Start Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production (verified clean TypeScript compilation)
npm run build
```

---

## 🗺️ Route Directory & Navigation Map

### Public Routes
- **`/`** — Flagship Landing Page (Hero atmospheric gradient, 3-card asymmetric bento, partner marquee, 40/60 feature showcase, stats)
- **`/login`** — Quick Persona / Role Switcher (select from 5 campus roles + 18 student profiles)
- **`/privacy`** — Privacy & Ethics Governance (90-day auto-expiry, gate boundaries, anonymous complaints)
- **`*`** — Custom 404 Recovery Screen

### Student Portal (`/app`)
- **`/app`** — Student Overview Dashboard (greeting, module bento cards, live occupancy, upcoming booking, FAB morph button)
- **`/app/complaints`** — Grievance Tracker (tabs, debounced live search, category pills, sort, grid/list view, upvotes)
- **`/app/complaints/new`** — 4-Step Multi-Step Wizard (conditional fields, char counters, drag-and-drop evidence dropzone, SVG path-draw success modal with copyable `CMP-XXXX` tracking reference)
- **`/app/complaints/:id`** — Complaint Detail (vertical animated status timeline, optimistic comment thread, 5-star / thumbs rating prompt with auto-reopen logic)
- **`/app/mess`** — 7-Day Interactive Menu (breakfast/lunch/dinner, veg/non-veg tags, real-time 8:00 PM cutoff countdown, instant wallet debit & refund on skip)
- **`/app/mess/wallet`** — Internal Ledger Balance & Top-up Modal (live roll-up counter, transaction ledger with +/- colors)
- **`/app/mess/history`** — Past bookings and meal collection status
- **`/app/gate`** — 30-Second Cryptographic QR Pass (deterministic offline QR generator, circular countdown ring, 3D 180° flip card showing live elapsed stay timer and exit action)
- **`/app/gate/history`** — Personal visit timeline and CSV/print export
- **`/app/profile`** — Student Digital ID Card (3D flip card with barcode, profile editor, "Reset Demo Data" button)

### Staff & Administration (`/admin`)
- **`/admin`** — Campus Operations Analytics (KPIs, Recharts category donut, 7-day mess efficiency bar chart, hourly gate traffic line chart)
- **`/admin/complaints`** — Department Inbox (triage, bulk department assigner, inline status changer)
- **`/admin/mess`** — Kitchen Manager Desk (tomorrow's expected breakfast/lunch/dinner headcounts, mark-served action, food waste KPI)
- **`/admin/gate`** — Security Guard Desk (live on-campus headcount, amber long-stay warning for >8h, simulate scan without leaving screen, visitor pass generator)

---

## 🎭 5-Minute Evaluation Demo Script

1. **Problem Framing (0:00 – 0:45) — Landing Page (`/`)**:
   - Showcase the hero and 3-card bento grid highlighting the three core problems: untracked complaints, mess food waste, and paper security registers.
   - Click **"Launch the demo"** to enter the student portal.

2. **Module A: Raise a Complaint (0:45 – 1:30) — `/app/complaints/new`**:
   - Select **Technical / IT**, note the dynamic field `"Device / System affected"`.
   - Enter title `"Wi-Fi access point down in Block B 2nd floor"` and submit.
   - Observe the animated checkmark, copy the reference ID (`CMP-XXXX`).

3. **Role Switch to Admin (1:30 – 2:15) — One-Click Switcher**:
   - Click the bottom-right floating **Demo Role Pill**, select **Dept Staff / Admin**.
   - Navigate to `/admin/complaints`. Locate the new ticket, assign to **IT Department**, and set status to **Resolved**.
   - Switch back to **Student** to verify the vertical timeline and satisfaction rating prompt.

4. **Module B: Smart Mess & Wallet (2:15 – 3:15) — `/app/mess`**:
   - View tomorrow's menu. Note the live countdown to the 8:00 PM cutoff.
   - Book Lunch (observe wallet debit from ₹1,850 to ₹1,790).
   - Skip Dinner and observe the instantaneous refund transaction.
   - Switch role to **Mess Manager** (`/admin/mess`) to see tomorrow's expected headcount increment immediately.

5. **Module C: Security Gate Pass (3:15 – 4:15) — `/app/gate`**:
   - Display the rotating QR card. Watch the circular countdown ring update every 30 seconds.
   - Select Purpose: **Library**, click **"Log Entry"**.
   - Watch the card perform a 3D flip to show the live on-campus elapsed timer.
   - Switch role to **Security Guard** (`/admin/gate`): see the **"Currently on campus"** metric increment live and student appear on the occupancy table.

6. **Summary & Closing (4:15 – 5:00) — `/admin`**:
   - Review the aggregate KPI cards, category breakdown donut, and 7-day food waste reduction metrics.
   - Point out the Ethics statement in the footer.

---

## 🛡️ Ethics & Data Notice
- **All data is strictly fictitious.** 18 realistic Kerala student personas across CSE, ECE, Data Science, Digital Humanities, and MBA are pre-seeded in `localStorage`.
- Gate logs record purpose and general destination only — never indoor GPS coordinates.
- Zero external image CDNs or remote APIs are used — completely resilient for offline / live evaluation.
