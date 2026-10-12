// ==========================================================================
// ASIF TECH GLOBAL — Shared Utilities Module (utils.js)
// Production-grade helper functions for UI, validation, and performance
// ==========================================================================

const ATGUtils = {
  /**
   * Escape HTML to prevent Cross-Site Scripting (XSS)
   * @param {string} str
   * @returns {string}
   */
  escapeHtml: function(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Display a non-blocking toast notification
   * @param {string} message
   * @param {'info' | 'success' | 'warning' | 'error'} type
   * @param {number} durationMs
   */
  showToast: function(message, type = 'info', durationMs = 4000) {
    let container = document.getElementById('atgToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'atgToastContainer';
      container.className = 'atg-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `atg-toast toast-${type}`;
    
    // Status accent indicator
    const iconSpan = document.createElement('span');
    iconSpan.style.display = 'inline-flex';
    iconSpan.style.alignItems = 'center';
    iconSpan.style.color = type === 'success' ? '#22c55e' : (type === 'error' ? '#ef4444' : '#e6b800');
    
    // Accessible clean SVG indicator
    iconSpan.innerHTML = type === 'success'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`
      : (type === 'error'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`);

    const textSpan = document.createElement('span');
    textSpan.style.fontSize = '0.9rem';
    textSpan.style.fontWeight = '500';
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, durationMs);
  },

  /**
   * Format numbers to compact strings (e.g., 150000 -> 150K+)
   * @param {number} num
   * @returns {string}
   */
  formatNumberCompact: function(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
    return num.toString();
  },

  /**
   * Animate counting numbers smoothly
   * @param {HTMLElement} element
   * @param {number} targetValue
   * @param {string} suffix
   * @param {number} durationMs
   */
  animateCounter: function(element, targetValue, suffix = '', durationMs = 1800) {
    if (!element) return;
    const startTime = performance.now();
    const startVal = 0;

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(startVal + (targetValue - startVal) * easedProgress);

      element.textContent = currentVal.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = targetValue.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  },

  /**
   * Debounce execution of high-frequency events
   * @param {Function} func
   * @param {number} waitMs
   * @returns {Function}
   */
  debounce: function(func, waitMs = 250) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), waitMs);
    };
  },

  /**
   * Copy text to clipboard with toast notification
   * @param {string} text
   * @param {string} successMessage
   */
  copyToClipboard: function(text, successMessage = 'Copied to clipboard!') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        ATGUtils.showToast(successMessage, 'success');
      }).catch(() => {
        ATGUtils.showToast('Failed to copy to clipboard', 'error');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      ATGUtils.showToast(successMessage, 'success');
    }
  }
};

// Export to window
if (typeof window !== 'undefined') {
  window.ATGUtils = ATGUtils;
}
