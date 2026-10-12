// ==========================================================================
// ASIF TECH GLOBAL — Shared UI Utilities & Interaction Handlers
// Standards-compliant, modular UI engine. Zero dependencies.
// ==========================================================================

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Displays an elegant toast notification.
 * @param {string} message 
 * @param {'success'|'error'|'info'} type 
 */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('atg-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'atg-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const borderColors = {
    success: 'var(--gold, #FFD700)',
    error: '#ff4d4f',
    info: '#4096ff'
  };

  toast.style.cssText = `
    min-width: 260px;
    max-width: 380px;
    padding: 12px 18px;
    background: var(--dark-card, #0c0c0c);
    color: var(--text-main, #f0f0f0);
    border: 1px solid ${borderColors[type] || 'var(--border-gold)'};
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    font-size: 0.88rem;
    font-family: var(--font-main, sans-serif);
    transition: opacity 0.3s ease, transform 0.3s ease;
    opacity: 0;
    transform: translateY(10px);
    pointer-events: auto;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --------------------------------------------------------------------------
// MBA Dropdown & Navigation
// --------------------------------------------------------------------------
function initMbaDropdown() {
  const dropdown = document.getElementById('mbaDropdown');
  const btn = document.getElementById('mbaDropdownBtn');
  const hrLink = document.getElementById('navItemHr');
  const financeLink = document.getElementById('navItemFinance');

  if (!dropdown || !btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  if (hrLink) {
    hrLink.addEventListener('click', () => {
      dropdown.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  if (financeLink) {
    financeLink.addEventListener('click', () => {
      dropdown.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
  }
}

// --------------------------------------------------------------------------
// Dark / Light Theme Engine
// --------------------------------------------------------------------------
function initTheme() {
  const btn = document.getElementById('mode-toggle');
  const sunIcon = document.getElementById('sun-svg');
  const moonIcon = document.getElementById('moon-svg');
  const storageKey = (window.ATG_CONFIG && window.ATG_CONFIG.theme && window.ATG_CONFIG.theme.storageKey) || 'atg_theme';
  const savedTheme = localStorage.getItem(storageKey) || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcons(savedTheme);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(storageKey, next);
      updateIcons(next);
    });
  }

  function updateIcons(theme) {
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }
}

// --------------------------------------------------------------------------
// Navbar Scroll Elevation
// --------------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// --------------------------------------------------------------------------
// Scroll to Top
// --------------------------------------------------------------------------
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
}

// --------------------------------------------------------------------------
// FAQ Accordion
// --------------------------------------------------------------------------
function toggleFaq(btn) {
  if (!btn) return;
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

  if (!wasOpen) {
    item.classList.add('open');
  }
}

// --------------------------------------------------------------------------
// Animated Stats Counter
// --------------------------------------------------------------------------
function initAnimatedStats() {
  let done = false;

  function runCounters() {
    if (done) return;
    done = true;

    document.querySelectorAll('.stat-number').forEach(el => {
      const text = el.textContent.trim();
      if (text === '24/7') return;

      const isPlus = text.endsWith('+');
      const isM = text.includes('M');
      const isK = text.includes('K');
      const raw = parseFloat(text.replace(/[^0-9.]/g, ''));
      const duration = 1600;
      let start = null;

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const currentVal = Math.floor(progress * raw);

        if (isM) {
          el.textContent = (currentVal / 10).toFixed(1) + 'M' + (isPlus ? '+' : '');
        } else if (isK) {
          el.textContent = currentVal + 'K' + (isPlus ? '+' : '');
        } else {
          el.textContent = currentVal + (isPlus ? '+' : '');
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = text;
        }
      }

      requestAnimationFrame(step);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }
}

// --------------------------------------------------------------------------
// Newsletter Subscription
// --------------------------------------------------------------------------
function handleSubscribe() {
  const emailInput = document.getElementById('nl-email');
  const msg = document.getElementById('nl-msg');
  if (!emailInput || !msg) return;

  const email = emailInput.value.trim();
  if (!email || !email.includes('@') || !email.includes('.')) {
    msg.style.color = '#ff5555';
    msg.textContent = 'Please provide a valid corporate email address.';
    return;
  }

  msg.style.color = 'var(--gold)';
  msg.textContent = 'Subscription confirmed. Technology briefings will be dispatched.';
  emailInput.value = '';
  showToast('Subscribed successfully to ATG briefings.', 'success');
}

// --------------------------------------------------------------------------
// Plan Selection
// --------------------------------------------------------------------------
function handleSelectPlan(planName) {
  showToast(`Selected ${planName} Plan. Contacting engineering advisory.`, 'info');
}

// --------------------------------------------------------------------------
// Home Contact Form Handler
// --------------------------------------------------------------------------
function handleHomeContact() {
  const nameEl = document.getElementById('homeContactName');
  const emailEl = document.getElementById('homeContactEmail');
  const msgEl = document.getElementById('homeContactMsg');
  const feedback = document.getElementById('homeContactFeedback');
  if (!nameEl || !emailEl || !msgEl || !feedback) return;

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const msg = msgEl.value.trim();

  if (!name || !email || !msg) {
    feedback.style.color = '#ef4444';
    feedback.textContent = 'Please fill out all required fields.';
    return;
  }

  feedback.style.color = 'var(--gold)';
  feedback.textContent = `Thank you, ${name}. Your consultation brief has been recorded. Our engineering desk will respond within 24 hours.`;
  showToast('Inquiry dispatched successfully.', 'success');
  document.getElementById('homeContactForm').reset();
}

// Export to window
if (typeof window !== 'undefined') {
  window.escapeHtml = escapeHtml;
  window.showToast = showToast;
  window.initMbaDropdown = initMbaDropdown;
  window.initTheme = initTheme;
  window.initNavbarScroll = initNavbarScroll;
  window.initScrollTop = initScrollTop;
  window.toggleFaq = toggleFaq;
  window.initAnimatedStats = initAnimatedStats;
  window.handleSubscribe = handleSubscribe;
  window.handleSelectPlan = handleSelectPlan;
  window.handleHomeContact = handleHomeContact;
}
