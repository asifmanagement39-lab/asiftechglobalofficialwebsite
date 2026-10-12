# Local Setup & Development Guide | Asif Tech Global

This guide details how to clone, run, and verify the **Asif Tech Global** executive portfolio and web platform in a local development environment.

---

## 1. System Requirements

- **Modern Web Browser**: Google Chrome (v110+), Mozilla Firefox (v110+), Microsoft Edge (v110+), or Apple Safari (v16+).
- **Lightweight HTTP Server**: Any static HTTP server (Python 3, Node.js, PHP, or VS Code Live Server).
- **Git**: For repository version control.

> [!NOTE]
> Due to browser security restrictions regarding Web Workers and Cross-Origin Resource Sharing (CORS), the in-browser PDF rendering engine (`library.html`) must be served over an HTTP/HTTPS protocol (`http://localhost`), not via the `file:///` URI scheme.

---

## 2. Quickstart Instructions

### Option A: Python 3 (Recommended)

Python is pre-installed on most macOS and Linux distributions and is standard on Windows developer workstations:

```bash
# 1. Clone the repository
git clone https://github.com/asifmanagement39-lab/asiftechglobalofficialwebsite.git

# 2. Enter repository directory
cd asiftechglobalofficialwebsite

# 3. Launch HTTP server on port 8080
python -m http.server 8080
```

Open your browser to: **`http://localhost:8080`**

---

### Option B: Node.js / npx serve

If you have Node.js installed:

```bash
# Launch zero-configuration static server
npx serve .
```

Open the local network URL displayed in your terminal (typically `http://localhost:3000`).

---

### Option C: VS Code Live Server Extension

1. Open the repository root folder in **Visual Studio Code**.
2. Install the **Live Server** extension by Ritwick Dey (`ms-vscode.live-server` or `ritwickdey.liveserver`).
3. Right-click `index.html` in the file explorer and select **"Open with Live Server"**.
4. Your default browser will launch automatically at `http://127.0.0.1:5500`.

---

## 3. Directory & File Organization

```text
asiftechglobalofficialwebsite/
├── index.html              # Main homepage: Hero, About, Skills, Experience, Projects, Services & Contact
├── about.html              # Detailed developer portfolio info, founder biography & milestone timeline
├── projects.html           # Interactive project showcase with category filters & case studies
├── contact.html            # Dedicated project inquiry & consultation brief form
├── hr.html                 # HR & Workforce Management portal with interactive payroll engine
├── finance.html            # Corporate Treasury portal with double-entry ledgers & GST invoices
├── library.html            # Digital Knowledge Vault powered by in-browser Mozilla PDF.js
├── 404.html                # Custom HTTP 404 Route Recovery Page
├── style.css               # Root CSS aggregator
│
├── js/                     # Modular JavaScript Architecture
│   ├── config.js           # Configuration, verified channels, metadata & security keys
│   ├── utils.js            # Core DOM helpers, escapeHtml, animateCounter, showToast
│   ├── theme.js            # Zero-flicker dark/light mode toggle with localStorage sync
│   ├── ui-common.js        # Shared utilities: toast alerts, mobile drawer, modals
│   ├── data.js             # Developer profile, skills matrix, project archive & metrics
│   ├── dashboard.js        # Payroll calculation engine, shift math & finance handlers
│   ├── library.js          # Live search filters, topic pills & PDF.js modal viewer
│   └── main.js             # Global initialization, scroll tracking, animated counters
│
├── css/                    # Modular CSS Design System
│   ├── theme.css           # Design tokens: 24K Gold & Obsidian color palette, typography
│   ├── main.css            # Base styles, navbar, typography & components
│   ├── components.css      # Reusable buttons, badges, pills, form controls, toasts
│   ├── sections.css        # Hero, About, Skills, Experience, Pricing, and CTA styles
│   ├── responsive.css      # Fluid responsive breakpoints & mobile adaptations
│   └── animations.css      # Keyframes, shimmer loaders, pulse and fade-ins
│
├── assets/                 # Ambient motion backgrounds, portraits & branding media
├── documents/              # Sample PDF documents for library testing
├── pdf.min.js              # Mozilla PDF.js core rendering engine
├── pdf.worker.min.js       # Web Worker for asynchronous PDF decoding
├── sitemap.xml             # XML sitemap for search engines
├── robots.txt              # Web crawler access directives
├── LICENSE                 # MIT License
├── ARCHITECTURE.md         # Technical architecture documentation
├── FEATURES.md             # In-depth architectural feature specifications
├── SETUP.md                # Local development instructions & verification checklist
├── DEPLOYMENT.md           # GitHub Pages & custom domain deployment guide
├── CONTRIBUTING.md         # Developer guidelines & contribution standards
├── CHANGELOG.md            # Release version history & migration log
└── README.md               # Technical documentation
```

---

## 4. Code Standards & Architecture

When contributing or adding new features locally:

1. **Zero External Frameworks**: Do not introduce React, Vue, Angular, or jQuery dependencies. Keep all code in pure, high-performance vanilla JavaScript and CSS.
2. **Zero Emoji Policy**: Do not use emojis in user interfaces, buttons, badges, or documentation. Use inline SVG icons and clean typography.
3. **CSS Custom Properties**: Define all new colors, spacing, and font sizes using existing design tokens in `css/theme.css`.
4. **Security Best Practices**: Never commit plaintext API keys or administrative passwords to client-side code. Use `ATG_CONFIG.security.verifyAdminKey` patterns.
5. **DOM Sanitization**: Always use `AsifUtils.escapeHtml()` or `uiCommon.escapeHtml()` before interpolating user-supplied strings into `innerHTML`.

---

## 5. Local Verification Checklist

Verify key functionality locally before committing changes:

| Test Item | Verification Steps | Expected Result |
| :--- | :--- | :--- |
| **Homepage Navigation** | Click each navbar link (`Home`, `About`, `Projects`, `Library`, `Contact`) | Smooth scrolling to corresponding section or direct navigation |
| **Theme Toggle** | Click the theme icon button in the header | Seamless transition between Obsidian Dark and Clean Light modes |
| **In-Page Contact Form** | Submit sample inputs in `#contact` on `index.html` | Immediate toast notification confirming dispatch without page reload |
| **Dedicated Contact Form** | Fill out and submit form on `contact.html` | Success toast with inquiry tracking reference |
| **About Page** | Navigate to `about.html` | Displays founder bio, credentials, career milestone timeline, and "Download CV" action |
| **Projects Live Filtering** | On `projects.html`, click filter pills (`Enterprise`, `Knowledge`, `Cloud`, `All`) | Cards filter instantly without page reload; "View Demo" & "View Source" buttons work |
| **Knowledge Vault** | Visit `library.html`, type in search bar, click on a document | Search filters items instantly; clicking opens PDF in reader modal |
| **HR Payroll Calculator** | On `hr.html`, enter basic salary and select allowances | Take-home salary, EPF, ESI, and TDS calculate automatically |
| **Finance Treasury Ledger** | On `finance.html`, interact with ledger entries | Debit/credit figures balance dynamically |
| **Route Recovery 404** | Navigate to `http://localhost:8080/404.html` | Displays executive 404 screen with quick recovery route buttons |
| **Responsive Layout** | Open Developer Tools (F12) and toggle mobile device mode | Navigation collapses to mobile drawer; grids reflow gracefully |

---

## 6. Troubleshooting

### Problem: PDF Documents Fail to Load in Library
- **Cause**: The page was opened via `file:///` instead of an HTTP server. Browsers block Web Worker execution from local file URIs.
- **Solution**: Run a local HTTP server (`python -m http.server 8080`) and access the page via `http://localhost:8080/library.html`.

### Problem: Port 8080 Is Already in Use
- **Cause**: Another service or process is occupying port 8080.
- **Solution**: Specify an alternative port:
  ```bash
  python -m http.server 8085
  ```
  Then access `http://localhost:8085`.

### Problem: Styling Changes Do Not Appear
- **Cause**: The browser has cached stylesheet assets.
- **Solution**: Perform a hard refresh using `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (macOS).
