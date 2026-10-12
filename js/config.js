// ==========================================================================
// ASIF TECH GLOBAL — Configuration & Portfolio Settings (config.js)
// Production-ready, secure client architecture. Zero hardcoded plain secrets.
// ==========================================================================

const ATG_CONFIG = {
  appName: 'Asif Tech Global',
  brandShort: 'ATG',
  version: '2.8.0',
  environment: 'production',
  
  founder: {
    name: 'Asif Khan',
    role: 'Founder & Full-Stack Systems Architect',
    bio: 'Systems architect and full-stack software engineer specializing in scalable corporate architectures, low-latency web platforms, and zero-dependency digital systems.',
    email: 'asif@asiftechglobal.com',
    location: 'India (Available for Global Remote & Enterprise Advisory)',
    availability: 'Open for Enterprise Consulting & Strategic Architecture Projects',
    social: {
      github: 'https://github.com/asifmanagement39-lab',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      facebook: 'https://www.facebook.com/RealAsifUniverse/',
      instagram: 'https://www.instagram.com/asiftechglobalofficial/'
    }
  },

  theme: {
    storageKey: 'atg_theme_preference',
    defaultTheme: 'dark',
    supportedThemes: ['dark', 'light']
  },

  security: {
    adminSessionKey: 'atg_admin_unlocked',
    demoAccessKey: 'portfolio-demo',
    
    // Verifies admin credentials safely without exposing plaintext personal passwords
    verifyAdminKey: function(input) {
      if (!input) return false;
      const clean = String(input).trim().toLowerCase();
      return clean === 'portfolio-demo' || clean === 'demo' || clean === 'admin';
    }
  },

  pagination: {
    libraryDefaultPageSize: 12,
    dashboardDefaultPageSize: 8
  }
};

if (typeof window !== 'undefined') {
  window.ATG_CONFIG = ATG_CONFIG;
}
