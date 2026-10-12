# Changelog

All notable changes to the **Asif Tech Global** web platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.8.0] - 2026-10-12

### Changed
- **Bot Automation Excised**:
  - Completely deleted `youtube.html` and all automation bot files.
  - Removed all YouTube links from top navigation bars, portlet dropdowns, and master footers across all ecosystem pages (`index.html`, `about.html`, `projects.html`, `contact.html`, `hr.html`, `finance.html`, `library.html`, `404.html`).
  - Replaced all bot references with enterprise engineering, business systems, and digital knowledge assets.
- **Homepage Transformation (`index.html`)**:
  - Added OpenGraph, Twitter card tags, canonical URL, and Schema.org JSON-LD structured data (`Person`, `Organization`, `WebSite`).
  - Added **Experience Timeline** section (`#experience`) with 2021&ndash;2026+ career progression.
  - Enhanced **Achievements & Metrics** with dynamic animated number counters (`data-counter-target`).
  - Added **Services & Architecture** pricing grid covering Custom Web Development (₹15k–₹1L+), Business Systems (₹35k–₹1.5L+), Database Optimization (₹20k–₹80k), Education Platforms (₹40k–₹1.2L), and Cloud Maintenance (₹15k–₹50k/mo).
  - Added **Let's Work Together** direct collaboration call-to-action banner.
  - Verified and linked official channels (GitHub, LinkedIn, Facebook, Instagram).

### Added
- **Route Recovery Page (`404.html`)**:
  - Executive error recovery screen adhering to Obsidian Black & 24K Gold styling.
  - Quick directory navigation links to Platform Home, Technical Portfolio, and Contact Desk.
- **Modular Code Architecture**:
  - `css/animations.css`: Keyframe definitions, skeleton shimmer, and micro-interactions.
  - `css/components.css`: Reusable buttons, badges, pills, form controls, and toast notifications.
  - `css/sections.css`: Scoped styling for hero, about, skills, timeline, pricing, and CTA banners.
  - `js/utils.js`: Core DOM utilities, HTML sanitization (`escapeHtml`), animated counters, and toasts.
  - `js/theme.js`: Zero-flicker dark/light mode toggle with `localStorage` persistence.
  - `js/main.js`: Global initialization, mobile navigation, smooth scrolling, and dynamic statistics.
- **SEO & Discovery Assets**:
  - `sitemap.xml`: XML sitemap covering all canonical pages with priority ratings.
  - `robots.txt`: Search crawler access directives and sitemap declaration.
- **Documentation & Legal**:
  - `ARCHITECTURE.md`: Complete technical architecture, design tokens, data flows, and security model.
  - `LICENSE`: Standard MIT License file for Mohd Asif / Asif Tech Global Inc.

### Fixed
- **Library Page Cleanup (`library.html`)**:
  - Removed premature duplicate footer block before admin upload modal.
  - Replaced outdated social links with verified LinkedIn profile.
- **About Page Enhancements (`about.html`)**:
  - Integrated "Download CV" action button with automated print/export handler (`handleDownloadCv()`).
- **Projects Page Enhancements (`projects.html`)**:
  - Configured "View Demo" and "View Source" (GitHub repository) buttons for all showcased projects.
- **Contact Page Enhancements (`contact.html`)**:
  - Added Company, Project Type, Budget Range tier, and Timeline selection fields.

---

## [2.7.0] - 2026-10-12

### Added
- **Developer Profile Hub (`about.html`)**:
  - Detailed developer portfolio and executive biography for Systems Architect Asif Khan.
  - Interactive 2021&ndash;2026+ career milestone timeline documenting full-stack evolution.
  - Academic credentials in Business Administration (MBA) and Computer Science.
  - Engineering philosophy breakdown and direct consultation CTA.
- **In-Page Contact & Consultation Section (`index.html#contact`)**:
  - Integrated contact section directly into homepage with direct communication channels (Official Email, Executive Desk, 24/7 Global SLA).
  - Verified social link tiles for GitHub, LinkedIn, Facebook, Instagram, and YouTube.
  - Direct inquiry form connected to `handleHomeContact()` in `ui-common.js`.
- **Comprehensive Documentation Suite**:
  - `FEATURES.md`: Full architectural breakdown of all 10 platform modules, security models, and design tokens.
  - `SETUP.md`: Step-by-step local development guide covering Python, Node.js, and VS Code Live Server with troubleshooting checklist.
  - `DEPLOYMENT.md`: Production GitHub Pages deployment guide, custom domain DNS records, and Let's Encrypt SSL/TLS enforcement.
- **Unified Navigation Integration**: Added `About` and `LinkedIn` links across all ecosystem navigation bars and footers (`index.html`, `about.html`, `projects.html`, `contact.html`, `youtube.html`, `hr.html`, `finance.html`, `library.html`).

---

## [2.6.0] - 2026-10-12

### Added
- **Dedicated YouTube Media Lab & Motion Studio (`youtube.html`)**:
  - Moved all 24/7 stream broadcast pipelines, motion videos, and media lab components from the front page into a dedicated, high-impact media page.
  - Interactive Full HD Cinema Lightbox player with real-time video preview and technical stream specs.
  - Official Channel spotlight for `@AsifTechGlobalOfficial` with direct subscribe CTA.
  - Broadcast Engineering architecture breakdown (FFmpeg 60FPS encoding, RTMP ingest, failover recovery).
- **Universal Navigation Menu**: Added "YouTube" to top navbar and footer links across all ecosystem pages (`index.html`, `projects.html`, `hr.html`, `finance.html`, `library.html`, `contact.html`, `youtube.html`).

### Changed
- **Homepage Optimization (`index.html`)**: Transformed `#portfolio` section on the front page into an ultra-clean Executive Software Engineering Portfolio showcase (HR Platform, Financial Ledger, PDF Vault, Cloud Cluster) with zero video clutter, lightning-fast loading, and direct links to the dedicated YouTube Media Lab.

---

## [2.5.0] - 2026-10-12

### Added
- **Dedicated Projects Showcase (`projects.html`)**:
  - Live filterable project directory across Enterprise, Knowledge, and Motion systems.
  - Interactive category selector pills.
  - 3 comprehensive architectural case studies detailing the HR Payroll Engine, Finance Ledger, and Digital PDF Vault.
- **Dedicated Consultation & Contact Hub (`contact.html`)**:
  - Validated advisory brief submission form with client feedback alerts.
  - Direct advisory links to official channels (Facebook, Instagram, GitHub, Email).
- **Homepage Sections (`index.html`)**:
  - Added dedicated *About Asif Khan* section with founder portrait, bio, credentials, and track record metrics.
  - Added *Skills & Technologies Matrix* covering Frontend, Backend, Cloud/DevOps, and Media/Motion.
  - Added Projects Showcase Callout in the executive portfolio section.
- **Modular JavaScript Architecture (`/js/`)**:
  - `js/config.js`: Centralized application settings, author metadata, and secure admin key verification.
  - `js/ui-common.js`: Reusable UI utilities (theme switcher, toasts, mobile menus, accordion FAQs, animated stats).
  - `js/data.js`: Central developer profile data, categorized skills, and project archives.
  - `js/dashboard.js`: Modularized payroll calculator and secure HR/Finance document upload handlers.
  - `js/library.js`: Modularized digital library search, category filters, and PDF.js modal viewer.
- **Modular CSS Architecture (`/css/`)**:
  - `css/theme.css`: Design tokens, dark/light mode variables, typography, and color palettes.
  - `css/main.css`: Base layouts, navigation, cards, spotlights, and interactive components.
  - `css/responsive.css`: Mobile breakpoints and viewport optimizations.
- **Documentation**:
  - Comprehensive `README.md` with architectural guides and local development steps.
  - `CONTRIBUTING.md` developer guide.
  - `CHANGELOG.md` tracking version history.

### Changed
- Refactored `app.js` into an ultra-clean modular orchestrator.
- Refactored `style.css` to import modular sheets (`theme.css`, `main.css`, `responsive.css`).
- Unified navigation bars across all pages (`index.html`, `hr.html`, `finance.html`, `library.html`, `projects.html`, `contact.html`).

### Security
- Removed all hardcoded personal passwords from client-side source code.
- Replaced direct password comparisons with parameterized verification function `ATG_CONFIG.security.verifyAdminKey`.

### Removed
- Removed YouTube bot automation backend (`yt_bot/` directory).
- Removed legacy system batch files (`*.bat`).
- Removed bot control interface (`youtube.html`).
- Cleaned up obsolete links to removed automation scripts across all navigation menus and footers.
