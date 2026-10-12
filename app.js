// ==========================================================================
// ASIF TECH GLOBAL — Application Orchestrator Entrypoint
// Clean, standards-compliant JavaScript architecture. Zero emojis.
// Modules: js/config.js, js/ui-common.js, js/data.js, js/dashboard.js, js/library.js
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const safeRun = (fn, name) => {
    try {
      if (typeof fn === 'function') {
        fn();
      }
    } catch (err) {
      console.warn(`[ATG Module] Error initializing ${name}:`, err);
    }
  };

  // 1. Shared UI Handlers
  safeRun(window.initTheme, 'ThemeEngine');
  safeRun(window.initNavbarScroll, 'NavbarElevation');
  safeRun(window.initMbaDropdown, 'MbaDropdownNavigation');
  safeRun(window.initScrollTop, 'ScrollTopUtility');
  safeRun(window.initAnimatedStats, 'StatsCounter');

  // 2. Business & Enterprise Modules
  safeRun(window.initPayrollCalculator, 'PayrollCalculator');
  safeRun(window.initHrPdfModule, 'HrDocumentVault');
  safeRun(window.initFinancePdfModule, 'FinanceTreasuryVault');
  safeRun(window.initLibraryModule, 'DigitalResearchLibrary');
});
