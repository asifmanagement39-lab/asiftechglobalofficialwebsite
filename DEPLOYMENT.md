# Production Deployment Guide | Asif Tech Global

This guide explains how to deploy the **Asif Tech Global** executive portfolio and web platform to **GitHub Pages**, configure custom domains with SSL/TLS encryption, and optimize production delivery.

---

## 1. Hosting Architecture Overview

The platform is built as a zero-dependency, standards-compliant static web application. It requires no backend server runtime, no serverless functions, and no continuous database connections.

### Key Benefits:
- **Zero Hosting Costs**: Natively supported on free, global static hosting platforms (GitHub Pages, Cloudflare Pages, Netlify).
- **Global Edge Caching**: Assets are served directly from global CDN edge networks with sub-100ms response times.
- **Infinite Scalability**: Static HTML/CSS/JS files absorb traffic surges without CPU throttling or database bottlenecks.
- **Zero Attack Surface**: No server-side SQL databases or dynamic backend code vulnerabilities.

---

## 2. GitHub Pages Deployment (Step-by-Step)

### Step 1: Ensure Relative Asset Paths
All asset links, scripts, and stylesheets throughout the codebase utilize relative paths (`./css/`, `./js/`, `./assets/`) rather than root-relative paths (`/css/`). This ensures seamless execution whether deployed at the domain root (`https://domain.com/`) or within a GitHub repository subpath (`https://username.github.io/reponame/`).

### Step 2: Push Changes to GitHub
Commit and push your latest code to your GitHub repository's `main` branch:

```bash
# Check working tree status
git status

# Stage all files
git add .

# Create a clear semantic commit
git commit -m "feat: complete executive portfolio with about, projects, contact, and docs"

# Push to the primary branch
git push origin main
```

*(If utilizing a fork workflow, push to your fork branch and submit or sync a Pull Request to the upstream repository).*

---

### Step 3: Enable GitHub Pages in Repository Settings

1. Open your repository on GitHub in your web browser:  
   `https://github.com/<your-username>/<your-repository-name>`
2. Click on the **Settings** tab located in the repository menu bar.
3. In the left-hand navigation sidebar, select **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch` from the dropdown.
   - **Branch**: Select `main` (or `gh-pages` if you use a dedicated build branch).
   - **Folder**: Select `/(root)`.
5. Click **Save**.

---

### Step 4: Monitor Automatic Deployment Pipeline

GitHub will automatically generate and trigger a GitHub Actions workflow named **pages-build-deployment**:
1. Click the **Actions** tab in your repository.
2. Observe the active `pages build and deployment` run. It typically completes in **30 to 60 seconds**.
3. Once the workflow turns green, your live URL will be active:  
   **`https://<your-username>.github.io/<your-repository-name>/`**

Official Production URL:  
**[https://asifmanagement39-lab.github.io/asiftechglobalofficialwebsite/](https://asifmanagement39-lab.github.io/asiftechglobalofficialwebsite/)**

---

## 3. Custom Domain Configuration (Optional)

If you own a custom domain (e.g., `asiftechglobal.com` or `www.asiftechglobal.com`), follow these steps to bind it to GitHub Pages:

### Step 1: Add Custom Domain in GitHub
1. Return to **Settings** > **Pages** in your repository.
2. In the **Custom domain** input box, enter your domain name (e.g., `asiftechglobal.com` or `www.asiftechglobal.com`).
3. Click **Save**.
4. GitHub will automatically commit a `CNAME` file to the root of your repository containing your domain name.

---

### Step 2: Configure DNS Records at Your Domain Registrar

Log in to your DNS provider (e.g., Cloudflare, GoDaddy, Namecheap, Google Domains) and create the following DNS records:

#### A. Apex Domain Records (`asiftechglobal.com`)
Create **4 `A` records** pointing the root (`@`) to GitHub's global load-balancer IP addresses:

| Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| `A` | `@` | `185.199.108.153` | 3600 (or Auto) |
| `A` | `@` | `185.199.109.153` | 3600 (or Auto) |
| `A` | `@` | `185.199.110.153` | 3600 (or Auto) |
| `A` | `@` | `185.199.111.153` | 3600 (or Auto) |

#### B. Subdomain Record (`www.asiftechglobal.com`)
Create a **`CNAME` record** pointing `www` to your GitHub username pages host:

| Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| `CNAME` | `www` | `<your-username>.github.io` | 3600 (or Auto) |

*Example target:* `asifmanagement39-lab.github.io`

---

### Step 3: Enforce HTTPS Security
1. Wait 5 to 30 minutes for DNS records to propagate globally.
2. In GitHub **Settings** > **Pages**, wait for the **DNS check successful** notification.
3. Check the box labeled **Enforce HTTPS**.
4. GitHub will automatically provision and renew a free **Let's Encrypt SSL/TLS Certificate** for your domain.

---

## 4. Alternative Static Hosting Platforms

Because the platform is 100% static, you can also deploy to any of the following platforms with zero configuration changes:

### Cloudflare Pages (Recommended Alternative)
1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select the `asiftechglobalofficialwebsite` repository.
4. Set **Build command** to `None` and **Build output directory** to `/` (root).
5. Click **Save and Deploy**. Deployment completes in < 15 seconds.

### Netlify
1. Log in to [Netlify](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Connect your GitHub repository.
3. Leave **Build command** blank and set **Publish directory** to `.`.
4. Click **Deploy Site**.

### Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root directory and follow the non-interactive prompts.

---

## 5. Pre-Production Verification Checklist

Before announcing or sharing your live URL, verify the following:

- [ ] **Home Page Assets**: Images, typography, and gold gradient banners load with zero broken icons.
- [ ] **About Page**: Biography, milestones timeline, and portrait render properly at `about.html`.
- [ ] **Projects Page**: Filter pills (`All`, `Enterprise`, `Knowledge`, `Cloud`) filter project cards dynamically at `projects.html`; "View Demo" and "View Source" buttons operate properly.
- [ ] **Contact Section**: In-page contact on `index.html` and dedicated form on `contact.html` validate inputs and show success toasts.
- [ ] **Knowledge Vault**: Document grid renders and clicking any title opens the reader modal at `library.html`.
- [ ] **Route Recovery 404**: Error page loads properly with navigation links at `404.html`.
- [ ] **HTTPS Enforced**: Valid SSL certificate active with strict transport security.
- [ ] **Mobile Drawer**: Responsive hamburger menu opens and closes smoothly on iOS and Android viewports.

---

## 6. Deployment Troubleshooting

### Issue: 404 Error on GitHub Pages URL
- **Cause**: The GitHub Pages build has not finished yet, or the wrong branch was selected in settings.
- **Fix**: Check the **Actions** tab in your repository to confirm `pages build and deployment` has completed. Ensure the source branch is set to `main` with root `/(root)`.

### Issue: Styles or Images Appear Broken / Unstyled Page
- **Cause**: Absolute file paths (`/css/main.css`) were used instead of relative paths (`./css/main.css` or `css/main.css`).
- **Fix**: Verify all link `href` and script `src` tags use relative paths.

### Issue: "Enforce HTTPS" Checkbox is Disabled
- **Cause**: DNS records for your custom domain have not finished propagating, or CAA records are blocking Let's Encrypt.
- **Fix**: Wait up to 24 hours for DNS propagation. Check your domain's DNS status at [whatsmydns.net](https://www.whatsmydns.net/).

---

## 7. Related Documentation

- [`README.md`](file:///c:/Users/ASIF/Desktop/video%20coding/asiftechglobalofficialwebsite/README.md) - Main repository overview and portfolio summary.
- [`FEATURES.md`](file:///c:/Users/ASIF/Desktop/video%20coding/asiftechglobalofficialwebsite/FEATURES.md) - Complete technical specifications for all 10 core features.
- [`SETUP.md`](file:///c:/Users/ASIF/Desktop/video%20coding/asiftechglobalofficialwebsite/SETUP.md) - Instructions for running and testing the codebase locally.
