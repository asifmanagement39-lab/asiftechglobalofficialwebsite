// Authentic Developer Data Store
const DeveloperData = {
  profile: {
    name: "Asif Ali",
    title: "Full Stack Software Developer & IT Systems Engineer",
    experienceYears: "4+",
    location: "Available for Remote & On-Site Projects",
    bio: "Software developer with 4+ years of practical experience building stable web applications, backend APIs, and database systems. Focused on clean code, dependable system architecture, and straightforward solutions to business challenges.",
    email: "asif.ali.dev@example.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com"
  },

  skills: [
    { category: "Frontend Engineering", items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Responsive UI", "DOM API"] },
    { category: "Backend & Systems", items: ["Node.js", "Express.js", "Python", "REST APIs", "Authentication (JWT / Sessions)", "Microservices"] },
    { category: "Databases & Storage", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis Caching", "Database Indexing", "SQL Optimization"] },
    { category: "DevOps & Tooling", items: ["Linux / Bash", "Docker", "Git / GitHub", "Nginx Web Server", "Postman", "CI/CD Workflows"] }
  ],

  projects: [
    {
      id: 1,
      title: "Warehouse Inventory & Order Management System",
      category: "Full Stack",
      stack: ["Node.js", "Express", "PostgreSQL", "JavaScript"],
      description: "A centralized web platform built for tracking stock movements, warehouse locations, and purchase orders with real-time low-stock alerts.",
      features: [
        "Barcode scanner input integration for incoming shipments",
        "Role-based access control for warehouse staff and managers",
        "Automated stock level alerts and supplier reorder triggers",
        "Exportable PDF and Excel reports for monthly inventory auditing"
      ],
      githubUrl: "https://github.com",
      liveUrl: "#"
    },
    {
      id: 2,
      title: "Corporate Employee Attendance & Payroll Portal",
      category: "Web Application",
      stack: ["JavaScript", "Python", "SQLite", "HTML5/CSS3"],
      description: "Internal portal used by administrative staff to monitor shift logs, leave requests, and calculate monthly salaries based on hours worked.",
      features: [
        "Clock-in and clock-out timestamp validation",
        "Leave application approval workflow with email notifications",
        "Tax deduction and net salary automated computation engine",
        "Comprehensive dashboard for HR managers and department heads"
      ],
      githubUrl: "https://github.com",
      liveUrl: "#"
    },
    {
      id: 3,
      title: "B2B Logistics Tracking & Dispatch REST API",
      category: "Backend API",
      stack: ["Python", "FastAPI", "Redis", "Docker"],
      description: "High-throughput backend service providing package status updates, route optimization data, and webhook dispatch for e-commerce partners.",
      features: [
        "Sub-30ms response times backed by Redis in-memory cache",
        "Webhook notification pipeline for delivery milestone updates",
        "Rate limiting and API key authentication for third-party clients",
        "Containerized using Docker for consistent cloud deployment"
      ],
      githubUrl: "https://github.com",
      liveUrl: "#"
    },
    {
      id: 4,
      title: "Automated Billing & Invoice Generation Engine",
      category: "Backend & Database",
      stack: ["Node.js", "MySQL", "PDFKit", "Cron"],
      description: "Automated batch processing daemon that compiles recurring subscriptions, generates PDF invoices, and tracks payment settlement statuses.",
      features: [
        "Scheduled cron jobs processing recurring billing cycles",
        "Dynamic PDF invoice generation with company branding and tax details",
        "Payment status reconciliation against bank statement exports",
        "Audit trail logging every billing transaction for accounting compliance"
      ],
      githubUrl: "https://github.com",
      liveUrl: "#"
    }
  ],

  services: [
    {
      title: "Custom Web Application Development",
      description: "Building responsive, standards-compliant web applications from requirements specification to production deployment using modern JavaScript and HTML5."
    },
    {
      title: "RESTful API Architecture & Integration",
      description: "Designing reliable, well-documented backend APIs with structured routing, input validation, authentication, and integration with third-party systems."
    },
    {
      title: "Database Design & Performance Tuning",
      description: "Schema architecture for SQL (PostgreSQL, MySQL) and NoSQL databases, query optimization, indexing strategies, and automated backup routines."
    },
    {
      title: "Server Configuration & Maintenance",
      description: "Linux server provisioning, Nginx reverse proxy configuration, SSL certificate installation, process management with systemd/PM2, and bug diagnosis."
    }
  ],

  workExperience: [
    {
      period: "2023 - Present",
      role: "Software Developer & IT Consultant",
      company: "Independent Practice",
      details: "Delivering customized web tools, database integrations, and maintenance services for small-to-medium businesses. Maintaining 99.8% system reliability across managed servers."
    },
    {
      period: "2021 - 2023",
      role: "Junior Software Engineer",
      company: "Apex IT Solutions",
      details: "Developed core backend endpoints, resolved client bug reports, optimized database queries reducing average load time by 30%, and contributed to code reviews."
    }
  ]
};
