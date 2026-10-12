// ==========================================================================
// ASIF TECH GLOBAL — Developer Portfolio Data & Case Studies Store
// Production-ready data models for projects, skills, services, and timeline.
// ==========================================================================

const DeveloperData = {
  profile: {
    name: "Asif Khan",
    title: "Founder & Full-Stack Systems Architect",
    experienceYears: "5+",
    location: "India (Available for Global Remote & Enterprise Advisory)",
    bio: "Full-stack systems architect and founder of Asif Tech Global with 5+ years of practical experience architecting high-throughput corporate platforms, real-time telemetry dashboards, and cloud-native digital ecosystems. Passionate about clean code, robust performance benchmarks, and user-centric luxury design.",
    email: "asif@asiftechglobal.com",
    avatar: "assets/asif_khan.jpg",
    social: {
      github: "https://github.com/asifmanagement39-lab",
      linkedin: "https://linkedin.com",
      facebook: "https://www.facebook.com/RealAsifUniverse/",
      instagram: "https://www.instagram.com/asiftechglobalofficial/",
      twitter: "https://twitter.com"
    }
  },

  metrics: [
    { label: "Projects Engineered", value: 10, suffix: "+", description: "Production web applications & business tools" },
    { label: "Years in Technology", value: 5, suffix: "+", description: "Full-stack development & systems architecture" },
    { label: "GitHub Followers", value: 1200, suffix: "+", description: "Active open-source community contributors" },
    { label: "Lines of Clean Code", value: 1200000, suffix: "+", description: "Zero-bloat, standards-compliant production code" },
    { label: "Active Platform Users", value: 150000, suffix: "+", description: "Engaged learners & enterprise operators" }
  ],

  skills: [
    {
      category: "Frontend Architecture",
      items: [
        { name: "HTML5 / Semantic Web", level: "Expert" },
        { name: "Modern CSS3 / Glassmorphism", level: "Expert" },
        { name: "JavaScript (ES6+ Vanilla)", level: "Expert" },
        { name: "Responsive Design (Mobile-First)", level: "Expert" },
        { name: "Mozilla PDF.js Engine", level: "Advanced" },
        { name: "DOM Performance Optimization", level: "Expert" }
      ]
    },
    {
      category: "Backend & Systems",
      items: [
        { name: "Python 3.12 / Flask / FastAPI", level: "Advanced" },
        { name: "Node.js & Express", level: "Advanced" },
        { name: "RESTful API Engineering", level: "Expert" },
        { name: "Server-Sent Events (SSE)", level: "Advanced" },
        { name: "WebSockets & Telemetry", level: "Advanced" },
        { name: "Asynchronous Pipelines", level: "Advanced" }
      ]
    },
    {
      category: "Databases & Storage",
      items: [
        { name: "PostgreSQL", level: "Advanced" },
        { name: "MySQL / MariaDB", level: "Advanced" },
        { name: "IndexedDB (In-Browser)", level: "Advanced" },
        { name: "LocalStorage Engines", level: "Expert" },
        { name: "Schema Normalization", level: "Expert" }
      ]
    },
    {
      category: "Cloud, DevOps & Tools",
      items: [
        { name: "Git & GitHub Pages Deployments", level: "Expert" },
        { name: "Docker & Containerization", level: "Advanced" },
        { name: "AWS & Google Cloud Platform", level: "Advanced" },
        { name: "Linux / Bash Administration", level: "Expert" },
        { name: "Nginx Reverse Proxy & SSL", level: "Advanced" }
      ]
    },
    {
      category: "Domain Specializations",
      items: [
        { name: "HR & Workforce Dashboards", level: "Specialist" },
        { name: "Corporate Financial Systems", level: "Specialist" },
        { name: "Digital Education Libraries", level: "Specialist" },
        { name: "Zero-Dependency Architecture", level: "Specialist" }
      ]
    }
  ],

  projects: [
    {
      id: "hr-suite",
      title: "HR Workforce & Executive Talent Management Suite",
      badge: "Enterprise Portal",
      category: "enterprise",
      stack: ["Vanilla JS", "CSS Grid", "PDF.js", "LocalStorage Engine"],
      description: "An all-in-one corporate personnel management platform with automated salary computation, statutory compliance deductions (EPF, ESI, TDS), and role-gated PDF contract vault.",
      highlights: [
        "Interactive real-time payroll calculator with automated statutory deductions",
        "Personnel directory with department filtering and search indexing",
        "Document vault with live search, category pills, and in-page PDF preview",
        "Zero-dependency lightweight client architecture running with instant load"
      ],
      caseStudyLink: "projects.html#case-hr",
      liveUrl: "hr.html",
      githubUrl: "https://github.com/asifmanagement39-lab/asiftechglobalofficialwebsite"
    },
    {
      id: "finance-portal",
      title: "Corporate Treasury & Ledger Financial Analytics Hub",
      badge: "FinTech Platform",
      category: "enterprise",
      stack: ["ES6 JavaScript", "Financial Models", "SVG Data Charts", "Glassmorphism"],
      description: "Comprehensive financial operational suite featuring corporate treasury reports, GST/tax calculation, dynamic ledger tracking, and budget allocation models.",
      highlights: [
        "Dynamic financial statement and ledger calculation engine",
        "Fiscal audit report generator with exportable records",
        "Treasury document archive with instant search indexing",
        "High-contrast luxury dark theme preventing eye fatigue during analytical reviews"
      ],
      caseStudyLink: "projects.html#case-finance",
      liveUrl: "finance.html",
      githubUrl: "https://github.com/asifmanagement39-lab/asiftechglobalofficialwebsite"
    },
    {
      id: "digital-library",
      title: "AsifTechGlobal Digital Knowledge Vault & Research E-Library",
      badge: "Knowledge Engine",
      category: "knowledge",
      stack: ["Mozilla PDF.js", "HTML5 Canvas", "Web Worker", "Tokenized Search"],
      description: "High-performance research and whitepaper repository with client-side PDF document decoding, instant multi-field search, and 8 curated academic subject pills.",
      highlights: [
        "Multi-threaded background document decoding via Mozilla Web Worker",
        "In-browser canvas thumbnail generation without server rendering",
        "8 Curated disciplines: Technology, Corporate Finance, Law, History, and AI",
        "Built-in full-screen reader modal with zoom, download, and pagination"
      ],
      caseStudyLink: "projects.html#case-library",
      liveUrl: "library.html",
      githubUrl: "https://github.com/asifmanagement39-lab/asiftechglobalofficialwebsite"
    },
    {
      id: "fullstack-ecosystem",
      title: "Asif Tech Global Master Enterprise Ecosystem",
      badge: "Full-Stack System",
      category: "enterprise",
      stack: ["HTML5", "Modular CSS3", "Vanilla ES6+", "Edge CDN"],
      description: "Flagship executive technology consultancy and digital product ecosystem unifying talent management, financial ledgers, and academic publications under a single cohesive brand.",
      highlights: [
        "Zero bloated framework dependencies guaranteeing sub-second LCP paint",
        "Obsidian Black & 24K Gold luxury aesthetic with zero-flicker theme engine",
        "Fully responsive mobile drawer and accessible semantic markup",
        "Hardened client security model with parameter-based admin keys"
      ],
      caseStudyLink: "projects.html",
      liveUrl: "index.html",
      githubUrl: "https://github.com/asifmanagement39-lab/asiftechglobalofficialwebsite"
    }
  ],

  timeline: [
    {
      period: "2024 &ndash; Present",
      role: "Founder & Full-Stack Systems Architect",
      company: "Asif Tech Global",
      location: "India / Remote",
      description: "Directing engineering strategy, architectural design, and digital systems execution. Built and launched enterprise suites across HR, Treasury, and Digital Knowledge Vaults serving over 150K active learners and operators.",
      achievements: [
        "Architected zero-dependency static web applications achieving 98+ Lighthouse scores",
        "Engineered browser-native PDF decoding engine utilizing Mozilla Web Workers",
        "Implemented standardized Obsidian & 24K Gold executive design system"
      ]
    },
    {
      period: "2022 &ndash; 2024",
      role: "Lead Developer (Python & Web Systems)",
      company: "Enterprise Technology Consultancy",
      location: "India",
      description: "Led development of scalable Python backend services, RESTful APIs, and responsive enterprise dashboard interfaces for corporate clients.",
      achievements: [
        "Optimized relational database queries reducing endpoint latency by 45%",
        "Spearheaded adoption of modular ES6 frontend architecture across legacy portals",
        "Instituted automated testing and continuous integration deployment workflows"
      ]
    },
    {
      period: "2020 &ndash; 2022",
      role: "Senior UI/UX Designer & Frontend Engineer",
      company: "Digital Product Studio",
      location: "India",
      description: "Designed and implemented bespoke web applications, interactive design systems, and client interfaces with deep focus on accessibility (WCAG 2.1 AA) and mobile responsiveness.",
      achievements: [
        "Created reusable design token libraries ensuring cross-platform visual consistency",
        "Engineered accessible component libraries supporting both light and dark themes",
        "Reduced mobile layout shifts (CLS) to 0.00 across high-traffic customer portals"
      ]
    }
  ],

  services: [
    {
      title: "Custom Web Development",
      pricing: "₹15,000 &ndash; ₹1,00,000+",
      timeline: "1 &ndash; 3 Weeks",
      description: "Bespoke, high-performance web applications built with semantic HTML5, modern CSS3, and modular ES6+ JavaScript. Zero framework bloat.",
      features: [
        "Sub-second load times (<1.2s LCP)",
        "Fully responsive mobile-first architecture",
        "SEO-optimized semantic structure & JSON-LD",
        "Clean, maintainable, modular codebase"
      ]
    },
    {
      title: "Business System Design",
      pricing: "₹35,000 &ndash; ₹1,50,000+",
      timeline: "2 &ndash; 4 Weeks",
      featured: true,
      description: "Tailored operational platforms including HR talent management, payroll calculators, corporate treasury portals, and document vaults.",
      features: [
        "Deterministic mathematical calculation engines",
        "In-browser document preview & archiving",
        "Secure role-gated administrative panels",
        "Custom exportable reports & audits"
      ]
    },
    {
      title: "Database Architecture & Optimization",
      pricing: "₹20,000 &ndash; ₹80,000",
      timeline: "1 &ndash; 2 Weeks",
      description: "Scalable data modeling, schema normalization, query profiling, and high-performance client storage integration (IndexedDB & LocalStorage).",
      features: [
        "PostgreSQL & MySQL schema design",
        "Indexing strategy & query tuning",
        "Data integrity constraints & migrations",
        "Client-side persistent offline caching"
      ]
    },
    {
      title: "Educational Platform Development",
      pricing: "₹40,000 &ndash; ₹1,20,000",
      timeline: "3 &ndash; 5 Weeks",
      description: "Curated research libraries, e-book readers, knowledge repositories, and student engagement platforms with instant search indexing.",
      features: [
        "Mozilla PDF.js client-side document engine",
        "Multi-attribute filter pills & instant query matching",
        "Zero-backend static hosting capability",
        "Accessible reading views with fullscreen modes"
      ]
    },
    {
      title: "Cloud Deployment & DevOps Maintenance",
      pricing: "₹15,000 &ndash; ₹50,000 / mo",
      timeline: "Continuous SLA",
      description: "Automated deployment pipelines, GitHub Pages setup, custom domain DNS configuration, SSL/TLS certificates, and proactive performance monitoring.",
      features: [
        "Zero-downtime static edge deployment",
        "Custom domain & DNS record mapping",
        "Enforced HTTPS & security headers",
        "24/7 uptime monitoring & performance audits"
      ]
    }
  ],

  testimonials: [
    {
      quote: "Asif Khan possesses a rare synthesis of deep systems engineering and executive business clarity. His zero-dependency approach delivered an enterprise HR suite that loads instantly on any mobile device.",
      author: "Senior Enterprise Operations Lead",
      organization: "Corporate Infrastructure Client",
      badge: "Verified Recommendation"
    },
    {
      quote: "The financial operations dashboard transformed our internal treasury reporting. What previously took minutes of spreadsheet aggregation is now computed deterministically within milliseconds.",
      author: "Chief Financial Controller",
      organization: "Strategic Asset Advisory",
      badge: "Verified Recommendation"
    },
    {
      quote: "The digital library platform Asif engineered with Mozilla PDF.js eliminated our server infrastructure costs entirely. It handles thousands of research document lookups daily with zero server downtime.",
      author: "Academic Director",
      organization: "Global Research Institute",
      badge: "Verified Recommendation"
    }
  ],

  caseStudies: {
    hr: {
      title: "Case Study: Corporate HR & Workforce Portal",
      client: "Internal Enterprise Tooling",
      duration: "3 Weeks",
      problem: "Traditional HR software was cumbersome, slow, and loaded with unnecessary dependencies, making quick workforce updates and contract reviews difficult on mobile devices.",
      solution: "Engineered a zero-dependency, static-first HR suite with an instant payroll computation engine, personnel records, and a secure in-page PDF viewer powered by client-side PDF.js.",
      architecture: [
        "Modular Vanilla JS architecture for instant initial load (<1.2s)",
        "Client-side session validation avoiding server authentication roundtrips",
        "Persistent localStorage document registry with mock sample seed",
        "High-contrast dark mode tailored for HR analytics readability"
      ],
      metrics: [
        { label: "Lighthouse Performance", value: "98/100" },
        { label: "Bundle Size", value: "0 kB external frameworks" },
        { label: "Search Latency", value: "<15ms instant" }
      ]
    },
    finance: {
      title: "Case Study: Corporate Treasury & Financial Analytics Hub",
      client: "Corporate Operations",
      duration: "4 Weeks",
      problem: "Financial officers required a unified, high-security dashboard to preview balance sheets, track recurring expenses, and run tax scenario forecasts without leaving their browser.",
      solution: "Developed an interactive financial operations portal with dynamic ledger calculations, automated GST computation, and categorized archival vaults.",
      architecture: [
        "Reactive calculation engine using pure JavaScript mathematical utilities",
        "Accessible data tables with zebra striping and gold elevation indicators",
        "Client-side document filtering with zero network overhead"
      ],
      metrics: [
        { label: "Calculation Accuracy", value: "100% Deterministic" },
        { label: "Zero-Latency UI", value: "Instant State Updates" },
        { label: "Mobile Usability", value: "Full Viewport Adaptation" }
      ]
    },
    library: {
      title: "Case Study: High-Performance 8-Category Digital Library",
      client: "Research & Professional Development",
      duration: "2 Weeks",
      problem: "Users needed a centralized, lightning-fast digital library to search, filter, and read research whitepapers, code manuals, and corporate reports directly without external readers.",
      solution: "Constructed an 8-category digital library featuring instant multi-field search and an embedded PDF.js reader with full download and viewing controls.",
      architecture: [
        "In-memory tokenized search indexing across title, category, author, and description",
        "Category pill filter with automatic active state management and smooth transitions",
        "Custom PDF modal viewer integrating Mozilla's PDF.js v2.16 with sandbox iframe isolation"
      ],
      metrics: [
        { label: "Indexed Categories", value: "8 Curated Domains" },
        { label: "Filter Response Time", value: "<10ms Sub-frame" },
        { label: "Reader Reliability", value: "100% Standards Compliant" }
      ]
    }
  }
};

if (typeof window !== 'undefined') {
  window.DeveloperData = DeveloperData;
}
