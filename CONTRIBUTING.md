# Contributing Guidelines

Thank you for your interest in contributing to **Asif Tech Global**! We welcome improvements, bug fixes, and feature additions that preserve our high architectural and design standards.

---

## Code of Conduct

All contributors are expected to uphold a respectful, inclusive, and professional environment. Focus on constructive feedback and maintain high engineering rigor.

---

## Architecture Principles

When submitting code to this repository, please adhere to these core principles:

1. **Vanilla Standards First**: Keep the codebase free from bulky frontend frameworks (React, Angular, Vue) unless specifically agreed upon. Native Web standards (HTML5 semantic tags, vanilla ES6+ JavaScript, CSS3 custom properties) ensure lightning-fast load times.
2. **Modular File Separation**:
   - Configuration & constants belong in `js/config.js`
   - UI handlers & helpers belong in `js/ui-common.js`
   - Static datasets belong in `js/data.js`
   - Domain-specific logic belongs in `js/dashboard.js` or `js/library.js`
   - Theme variables belong in `css/theme.css`
   - Core components belong in `css/main.css`
   - Mobile styling belongs in `css/responsive.css`
3. **Aesthetic Consistency**:
   - Maintain the obsidian dark palette with tailored 24K gold accents (`#e6b800`, `#ffcf33`).
   - Use clean, accessible SVG icons. Do **not** inject casual emojis into the user interface.
4. **Security & Data Sanitization**:
   - Never commit sensitive keys, passwords, or personal credentials.
   - Always sanitize untrusted text inputs with `escapeHtml()`.

---

## Development Workflow

1. **Fork the Repository**:
   Create your personal fork on GitHub.

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make and Test Your Changes**:
   Test across modern desktop and mobile browsers to ensure responsive layout stability.

4. **Commit with Conventional Messages**:
   Use conventional commits:
   - `feat:` for new features or sections
   - `fix:` for bug fixes
   - `refactor:` for architectural reorganizations
   - `docs:` for documentation updates
   - `style:` for CSS styling adjustments

5. **Submit a Pull Request**:
   Push to your fork and submit a clear pull request against the `main` branch.
