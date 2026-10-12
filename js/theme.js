// ==========================================================================
// ASIF TECH GLOBAL — Theme Switcher Module (theme.js)
// Zero-flicker Dark / Light mode switching with localStorage persistence
// ==========================================================================

const ATGTheme = {
  STORAGE_KEY: 'atg_theme_preference',

  init: function() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || 'dark';
    this.applyTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });
  },

  getCurrentTheme: function() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },

  applyTheme: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateToggleIcons(theme);
  },

  toggleTheme: function() {
    const current = this.getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    if (window.ATGUtils) {
      ATGUtils.showToast(`Switched to ${next === 'dark' ? 'Obsidian Dark' : 'Executive Light'} theme`, 'info', 2000);
    }
  },

  updateToggleIcons: function(theme) {
    const icons = document.querySelectorAll('.theme-toggle-icon, [data-theme-icon]');
    icons.forEach(icon => {
      if (theme === 'dark') {
        // Show Sun icon to switch to light
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      } else {
        // Show Moon icon to switch to dark
        icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      }
    });
  }
};

// Immediate execution to prevent theme flash
(function() {
  const saved = localStorage.getItem('atg_theme_preference') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

if (typeof window !== 'undefined') {
  window.ATGTheme = ATGTheme;
}
