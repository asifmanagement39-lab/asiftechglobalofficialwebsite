# Architectural Features Guide | Asif Tech Global

This document details the functional specifications, architecture, and technology implementations across the **Asif Tech Global** executive portfolio and web platform.

---

## Architecture Summary

| Module | Primary Technology | Key Entry Point | Purpose |
| :--- | :--- | :--- | :--- |
| **Developer Profile & Bio** | HTML5 / CSS3 / ES6 | `about.html`, `index.html#about` | Executive biography, career milestones, credentials & CV export |
| **Projects & Case Studies** | Vanilla JS / Dynamic DOM | `projects.html`, `index.html#projects` | Interactive portfolio with category filtering & case studies |
| **HR & Payroll Suite** | Modular Calculation Engine | `hr.html`, `js/dashboard.js` | Payroll disbursement, EPF/ESI/TDS math & document vault |
| **Treasury & Finance Hub** | Financial Ledger Logic | `finance.html`, `js/dashboard.js` | Double-entry ledgers, GST invoices & cash flow runway |
| **Knowledge Vault E-Library** | Mozilla PDF.js / Canvas | `library.html`, `js/library.js` | In-browser PDF search, rendering & cover generation |
| **Contact & Advisory** | Client-side Validation | `contact.html`, `index.html#contact` | Consultation brief dispatch with RFQ tiers & timeline options |
| **System Route Recovery** | Semantic Error Handling | `404.html` | Custom 404 route recovery and quick directory navigation |
| **Theme & UI System** | CSS Custom Properties | `css/theme.css`, `js/theme.js` | Obsidian Black & 24K Gold system with zero-flicker toggle |

---

## 1. Hero Banner & Call-To-Action Architecture

### Purpose
The hero section on `index.html` serves as the primary visual hook. It establishes Asif Tech Global as an elite technology consultancy and Mohd Asif as an executive systems architect.

### Key Capabilities
- **Curated Typography**: Utilizes fluid typography scaling with modern sans-serif headings and gold gradient text accents.
- **Direct Engagement CTAs**:
  - `Recent Projects`: Anchors smoothly to `#projects` on the homepage or links to `projects.html`.
  - `About Architect`: Navigates to `about.html` for deep career context and milestones.
  - `Get In Touch`: Smoothly scrolls to the in-page `#contact` section for immediate project briefs.
- **Zero Heavy Background Blockers**: Does not load heavy auto-playing video tags on first paint, guaranteeing sub-second LCP (Largest Contentful Paint) and high Core Web Vitals scores.

---

## 2. Developer Profile & Milestone Timeline (`about.html` & `#about`)

### Purpose
Provides comprehensive background information on **Mohd Asif**, establishing professional trust, technical authority, and industry credibility.

### Key Capabilities
- **Curriculum Vitae Download Action**: Instant PDF printing/export handler triggered via `handleDownloadCv()` or Ctrl/Cmd+P.
- **Milestone Roadmap (2021 &ndash; 2026+)**: Visual timeline tracking evolution from foundational web development to enterprise cloud engineering and platform architecture.
- **Academic Credentials**: Dual foundation in Business Administration (MBA) and Computer Science.
- **Engineering Principles**: Strict zero unnecessary dependencies, deterministic math, and bulletproof security.

---

## 3. Executive Portfolio Showcase (`projects.html`)

### Purpose
Displays enterprise software systems, web applications, and developer tools with deep technical breakdowns and immediate verification links.

### Key Capabilities
- **Dual Verification Links**: Every project card provides:
  - `View Demo`: Direct navigation to live interactive demo.
  - `View Source`: Direct link to GitHub repository source code.
- **Interactive Category Filtering**: Multi-tag filtering across Enterprise, Knowledge, Cloud, and All.
- **Architectural Case Studies**:
  - Automated Payroll & Statutory Compliance Engine (`hr.html`)
  - Enterprise Double-Entry Ledger & Cash Flow Forecasting (`finance.html`)
  - Zero-Backend In-Browser PDF Knowledge Vault (`library.html`)

---

## 4. HR & Workforce Platform (`hr.html`)

### Purpose
Comprehensive human capital and payroll administration portal designed for modern business operations.

### Key Capabilities
- **Statutory Payroll Engine**: Real-time salary breakdown computing Gross Pay, EPF (12%), ESI (0.75%), Professional Tax, TDS brackets, and Net Take-Home disbursement.
- **Workforce Roster**: Employee record management with department tagging, designation, and compensation records.
- **Secure Document Vault**: Administrative document upload modal protected by key verification.

---

## 5. Corporate Treasury & Ledger Suite (`finance.html`)

### Purpose
Corporate treasury, cash flow monitoring, and GST invoicing system.

### Key Capabilities
- **Double-Entry Ledger**: Real-time balancing of debits and credits with category filtering.
- **Runway & Working Capital Visualization**: Immediate visibility into operating burn, liquid reserves, and treasury health.
- **GST Invoice Generator**: Compliant tax invoice creation pipeline with itemized lines and auto-calculated tax amounts.

---

## 6. Digital Knowledge Vault (`library.html`)

### Purpose
Zero-backend, in-browser digital library and technical manuscript repository powered by Mozilla PDF.js.

### Key Capabilities
- **Instant Search**: Real-time text query filtering across book titles, subjects, authors, and keywords as the user types.
- **Topic Filter Pills**:
  - Coding & Tech
  - Corporate Finance
  - Social & Environmental
  - Media & Entertainment
  - Law & Reference
  - World History
  - Science & AI
  - Executive Wit
- **In-Browser Cover Extraction**: Renders the first page of any uploaded PDF onto an offscreen HTML5 `<canvas>` element to produce crisp cover thumbnails in real-time.
- **Embedded Document Viewer**: High-fidelity full-screen PDF modal with download triggers.

---

## 7. Consultation & RFQ Desk (`contact.html` & `index.html#contact`)

### Purpose
Enables prospective enterprise clients, recruiters, and collaborators to request technical consultations or project bids.

### Key Capabilities
- **Structured Project Inquiry Form**: Includes Name, Corporate Email, Company, Project Type (Custom Web Dev, HR/Finance Systems, Cloud Architecture, etc.), Budget Range tier, Timeline, and Details.
- **Live Feedback**: Client-side field validation with instant toast notifications.
- **Direct Official Contacts**: Verified channels for GitHub, LinkedIn, Facebook, and Instagram.

---

## 8. System Route Recovery (`404.html`)

### Purpose
Provides executive error recovery when users navigate to non-existent or restructured URLs.

### Key Capabilities
- **HTTP 404 Visual Standard**: Adheres to Obsidian Black & 24K Gold styling.
- **Quick Directory Links**: Immediate return buttons to Platform Home, Technical Portfolio, and Contact Desk, plus verified route directory grid.

---

## 9. Ultra-Luxury Theme Engine & Design Tokens

### Design System
- **Dark Mode (Default)**: Deep Obsidian Black (`#050505`), Dark Surface (`#0f1424`), 24K Gold Primary (`#FFD700`), 24K Gold Dark (`#e6b800`).
- **Light Mode**: Pristine Slate (`#F8F9FA`), Clean Surface (`#FFFFFF`), Deep Navy (`#111827`), Champagne Gold (`#D4AF37`).
- **Zero-Flicker Persistence**: Stored via `localStorage` with instantaneous DOM application on document head evaluation.
- **Strict Aesthetic Standard**: Zero casual emojis. All indicators utilize clean, accessible inline SVG iconography.

---

## 10. Modular Code Architecture & Security

### Decoupled Codebase
```text
js/
├── config.js      # Global ATG_CONFIG, metadata, and parameterized security routines
├── utils.js       # Core DOM helpers, escapeHtml, animateCounter, showToast
├── theme.js       # Zero-flicker dark/light mode toggle with localStorage sync
├── ui-common.js   # Master UI logic (navbar scroll, mobile drawer, modals)
├── data.js        # Static data dictionaries (projects, profile, timeline, services)
├── dashboard.js   # HR calculation math and finance state handling
├── library.js     # Search algorithms, shelf filters, and PDF.js viewer
└── main.js        # Global initialization, scroll tracking, animated counters
```

### Security Measures
- **No Hardcoded Plaintext Secrets**: Client administrative routines utilize parameter-driven validation.
- **Input Sanitization**: `escapeHtml()` utility prevents Cross-Site Scripting (XSS) in user inputs.
- **Safe External Links**: All external hyperlinks utilize `rel="noopener noreferrer"`.
