// ==========================================================================
// ASIF TECH GLOBAL — Application Scripts
// Clean, standards-compliant JavaScript. Zero emojis.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScroll();
  initMbaDropdown();
  initScrollTop();
  initAnimatedStats();
  initPayrollCalculator();
  initFinancePdfModule();
  initYouTubeModule();
  initBotConsoleModule();
  initLibraryModule();
});

// --------------------------------------------------------------------------
// MBA Dropdown & Navigation with Section Pulse
// --------------------------------------------------------------------------
function initMbaDropdown() {
  const dropdown = document.getElementById('mbaDropdown');
  const btn = document.getElementById('mbaDropdownBtn');
  const hrLink = document.getElementById('navItemHr');
  const financeLink = document.getElementById('navItemFinance');

  if (!dropdown || !btn) return;

  // Toggle on button click (for mobile & touch)
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('active');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });

  // Helper to scroll and highlight target card
  function handleNavigate(targetId) {
    dropdown.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');

    const el = document.getElementById(targetId);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Apply temporary glow pulse
    el.classList.add('target-highlight');
    setTimeout(() => {
      el.classList.remove('target-highlight');
    }, 2000);
  }

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
  const savedTheme = localStorage.getItem('atg_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcons(savedTheme);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('atg_theme', next);
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
// Scroll to Top Button
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
  msg.textContent = 'Subscription confirmed. Thank you.';
  emailInput.value = '';
}

// --------------------------------------------------------------------------
// Plan Selection
// --------------------------------------------------------------------------
function handleSelectPlan(planName) {
  alert(`You have selected the ${planName} Plan. Our sales team will get in touch with you shortly.`);
}

// --------------------------------------------------------------------------
// Background Animation Engine (Disabled per user request for clean background)
// --------------------------------------------------------------------------
function initHrFinanceBackground() {
  // Canvas animation removed per user request for clean background
  return;
}

// --------------------------------------------------------------------------
// Interactive Enterprise Payroll & Net Take-Home Calculator
// --------------------------------------------------------------------------
function initPayrollCalculator() {
  const numInput = document.getElementById('grossSalaryInput');
  const rangeInput = document.getElementById('grossSalaryRange');

  if (!numInput || !rangeInput) return;

  function calculate(grossVal) {
    const gross = Math.max(15000, Number(grossVal) || 0);

    // Earnings Component Breakdown
    const basic = Math.round(gross * 0.50);
    const hra = Math.round(gross * 0.30);
    const special = gross - basic - hra;

    // Statutory Deductions
    const epf = Math.round(basic * 0.12);
    const pt = 200; // Standard Flat Professional Tax

    // Progressive Estimated TDS Computation
    const annualGross = gross * 12;
    let annualTds = 0;
    if (annualGross > 1000000) {
      annualTds = 45000 + (annualGross - 1000000) * 0.20;
    } else if (annualGross > 700000) {
      annualTds = (annualGross - 700000) * 0.15;
    } else if (annualGross > 350000) {
      annualTds = (annualGross - 350000) * 0.05;
    }
    const monthlyTds = Math.round(annualTds / 12);

    const totalDeductions = epf + pt + monthlyTds;
    const netTakeHome = Math.max(0, gross - totalDeductions);

    // Update Output Fields
    const netEl = document.getElementById('netSalaryDisplay');
    const basicEl = document.getElementById('basicPayDisplay');
    const hraEl = document.getElementById('hraDisplay');
    const specialEl = document.getElementById('specialAllowanceDisplay');
    const epfEl = document.getElementById('epfDisplay');
    const ptEl = document.getElementById('ptDisplay');
    const tdsEl = document.getElementById('tdsDisplay');

    if (netEl) netEl.textContent = `Rs ${netTakeHome.toLocaleString('en-IN')}`;
    if (basicEl) basicEl.textContent = `Rs ${basic.toLocaleString('en-IN')}`;
    if (hraEl) hraEl.textContent = `Rs ${hra.toLocaleString('en-IN')}`;
    if (specialEl) specialEl.textContent = `Rs ${special.toLocaleString('en-IN')}`;
    if (epfEl) epfEl.textContent = `-Rs ${epf.toLocaleString('en-IN')}`;
    if (ptEl) ptEl.textContent = `-Rs ${pt.toLocaleString('en-IN')}`;
    if (tdsEl) tdsEl.textContent = `-Rs ${monthlyTds.toLocaleString('en-IN')}`;
  }

  numInput.addEventListener('input', (e) => {
    rangeInput.value = e.target.value;
    calculate(e.target.value);
  });

  rangeInput.addEventListener('input', (e) => {
    numInput.value = e.target.value;
    calculate(e.target.value);
  });

  calculate(numInput.value);
}

// --------------------------------------------------------------------------
// Finance PDF Vault & Real-Time Auto-Thumbnail Engine
// --------------------------------------------------------------------------
function initFinancePdfModule() {
  const dropzone = document.getElementById('pdfDropzone');
  const fileInput = document.getElementById('pdfFileInput');
  const browseBtn = document.getElementById('browsePdfBtn');
  const grid = document.getElementById('financePdfGrid');
  const statusEl = document.getElementById('pdfProcessStatus');
  const statusText = document.getElementById('pdfStatusText');
  const countBadge = document.getElementById('pdfDocCount');

  const modal = document.getElementById('pdfModal');
  const modalTitle = document.getElementById('pdfModalTitle');
  const modalFrame = document.getElementById('pdfModalFrame');
  const modalDownload = document.getElementById('pdfModalDownload');
  const modalBackdrop = document.getElementById('pdfModalBackdrop');
  const closeBtn = document.getElementById('closePdfModal');

  if (!grid) return;

  // Initialize PDF.js worker
  if (window.pdfjsLib) {
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
    } catch (e) {
      console.warn('PDF worker setup:', e);
    }
  }

  // Active documents array
  let documents = [
    {
      id: 'doc-money-dadashri',
      title: 'Money: The World of Money',
      subtitle: 'According to Gnani Purush Dadashri',
      filePath: 'documents/money-by-dadashri.pdf',
      fileName: 'money-by-dadashri.pdf',
      fileSize: '431 KB',
      totalPages: 111,
      thumbnailUrl: null
    }
  ];

  function updateDocCount() {
    if (countBadge) {
      countBadge.textContent = `${documents.length} Document${documents.length === 1 ? '' : 's'} Available`;
    }
  }

  // Render Page 1 to HTML5 Canvas -> DataURL
  async function generateThumbnailFromSource(source) {
    if (!window.pdfjsLib) {
      return null;
    }
    try {
      const loadingTask = window.pdfjsLib.getDocument(source);
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      const page = await pdf.getPage(1);

      // Render at sharp scale (width around 340px)
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = 340 / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.90);

      return {
        thumbnailUrl: dataUrl,
        totalPages: totalPages
      };
    } catch (err) {
      console.error('Thumbnail generation error:', err);
      return null;
    }
  }

  // Create or Update Document Card DOM
  function createDocumentCard(doc) {
    const card = document.createElement('div');
    card.className = 'pdf-doc-card';
    card.id = doc.id;

    // Thumbnail container
    const thumbWrapper = document.createElement('div');
    thumbWrapper.className = 'pdf-thumb-wrapper';

    if (doc.thumbnailUrl) {
      const img = document.createElement('img');
      img.className = 'pdf-thumb-img';
      img.src = doc.thumbnailUrl;
      img.alt = doc.title;
      thumbWrapper.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'pdf-thumb-placeholder';
      placeholder.innerHTML = `<span>PAGE 1</span><div class="status-spinner" style="margin-top:0.4rem;"></div>`;
      thumbWrapper.appendChild(placeholder);
    }

    // Meta container
    const meta = document.createElement('div');
    meta.className = 'pdf-doc-meta';
    meta.innerHTML = `
      <div>
        <div class="pdf-doc-title">${escapeHtml(doc.title)}</div>
        <div class="pdf-doc-sub">${escapeHtml(doc.subtitle || 'Financial Document')}</div>
        <div class="pdf-doc-stats">
          <span>${doc.totalPages || 1} Pages</span>
          <span>${doc.fileSize || 'PDF'}</span>
          <span>Verified</span>
        </div>
      </div>
      <div class="pdf-doc-actions">
        <button type="button" class="btn-pdf-view" data-view-id="${doc.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span>Read PDF</span>
        </button>
        <a href="${doc.filePath}" download="${doc.fileName}" class="btn-pdf-download">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download</span>
        </a>
      </div>
    `;

    card.appendChild(thumbWrapper);
    card.appendChild(meta);

    // Attach View click
    const viewBtn = meta.querySelector('.btn-pdf-view');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        openPdfViewer(doc);
      });
    }

    return card;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // Render all documents into grid
  function renderAllDocs() {
    grid.innerHTML = '';
    documents.forEach(doc => {
      grid.appendChild(createDocumentCard(doc));
    });
    updateDocCount();
  }

  // Open in-page PDF Viewer Modal
  function openPdfViewer(doc) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = `${doc.title} - Reading Mode`;
    if (modalFrame) modalFrame.src = doc.filePath;
    if (modalDownload) {
      modalDownload.href = doc.filePath;
      modalDownload.download = doc.fileName;
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePdfViewer() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (modalFrame) modalFrame.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closePdfViewer);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closePdfViewer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closePdfViewer();
    }
  });

  // Handle uploaded file
  async function handleFileUpload(file) {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    if (statusEl) {
      statusEl.style.display = 'flex';
      if (statusText) statusText.textContent = `Reading ${file.name} and generating cover thumbnail...`;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const blobUrl = URL.createObjectURL(file);
      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      // Extract title from filename (strip .pdf)
      const cleanTitle = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

      // Generate live thumbnail
      const result = await generateThumbnailFromSource({ data: arrayBuffer });

      const newDoc = {
        id: 'doc-' + Date.now(),
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        subtitle: 'Uploaded Financial Document',
        filePath: blobUrl,
        fileName: file.name,
        fileSize: sizeStr,
        totalPages: result ? result.totalPages : 1,
        thumbnailUrl: result ? result.thumbnailUrl : null
      };

      documents.unshift(newDoc);
      renderAllDocs();

      if (statusEl) {
        if (statusText) statusText.textContent = 'Thumbnail generated successfully!';
        setTimeout(() => {
          statusEl.style.display = 'none';
        }, 1800);
      }

      // Scroll to newly added card
      const newCard = document.getElementById(newDoc.id);
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.error('File upload processing failed:', err);
      if (statusEl) {
        if (statusText) statusText.textContent = 'Error rendering PDF thumbnail.';
        setTimeout(() => {
          statusEl.style.display = 'none';
        }, 2500);
      }
    }
  }

  // File Input and Browse Button Listeners
  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  const navUploadBtn = document.getElementById('navUploadPdfBtn');
  if (navUploadBtn && fileInput) {
    navUploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const vault = document.getElementById('financePdfVault');
      if (vault) {
        vault.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });
  }

  // Initial render with placeholder
  renderAllDocs();

  // Generate thumbnail for default Money PDF
  (async () => {
    try {
      const defaultDoc = documents[0];
      const res = await fetch(defaultDoc.filePath);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const result = await generateThumbnailFromSource({ data: buf });
        if (result && result.thumbnailUrl) {
          defaultDoc.thumbnailUrl = result.thumbnailUrl;
          if (result.totalPages) defaultDoc.totalPages = result.totalPages;
          renderAllDocs();
        }
      }
    } catch (e) {
      console.warn('Default PDF load:', e);
    }
  })();
}

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// YouTube Video Hub Module
// Clean, standards-compliant YouTube player & stream controller. Zero emojis.
// --------------------------------------------------------------------------
function initYouTubeModule() {
  const playerWrap = document.getElementById('ytDynamicPlayerWrap');
  const iframe = document.getElementById('ytMainIframe');
  const titleEl = document.getElementById('ytCurrentTitle');
  const descEl = document.getElementById('ytCurrentDesc');
  const loadForm = document.getElementById('ytLoadForm');
  const inputEl = document.getElementById('ytVideoInput');
  const feedbackMsg = document.getElementById('ytFeedbackMsg');
  const closeBtn = document.getElementById('ytClosePlayerBtn');

  // Close player action
  if (closeBtn && playerWrap && iframe) {
    closeBtn.addEventListener('click', () => {
      iframe.src = '';
      playerWrap.style.display = 'none';
    });
  }

  // Helper to extract YouTube video ID from various formats
  function extractYouTubeId(urlOrId) {
    if (!urlOrId) return null;
    const clean = urlOrId.trim();

    // Check if it's already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }

    // Pattern matching for YouTube URLs
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = clean.match(regExp);
    return match ? match[1] : null;
  }

  // Helper to load entered video
  function loadVideo(videoId, title, desc) {
    if (!videoId || !iframe || !playerWrap) return;

    // Load iframe with nocookie domain
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    if (title && titleEl) titleEl.textContent = title;
    if (desc && descEl) descEl.textContent = desc;

    // Show dynamic player container
    playerWrap.style.display = 'block';

    // Scroll to player smoothly
    playerWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Handle Form Submission
  if (loadForm && inputEl) {
    loadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputEl.value;
      const vidId = extractYouTubeId(val);

      if (!feedbackMsg) return;

      if (vidId) {
        feedbackMsg.textContent = `Streaming video ID: ${vidId}`;
        feedbackMsg.className = 'yt-feedback-msg success';
        feedbackMsg.style.display = 'block';

        loadVideo(
          vidId,
          `@AsifTechGlobalOfficial Stream: ${vidId}`,
          'Loaded from @AsifTechGlobalOfficial video stream archive.'
        );

        setTimeout(() => {
          feedbackMsg.style.display = 'none';
        }, 4000);
      } else {
        feedbackMsg.textContent = 'Please enter a valid YouTube URL or Video ID from @AsifTechGlobalOfficial.';
        feedbackMsg.className = 'yt-feedback-msg error';
        feedbackMsg.style.display = 'block';
      }
    });
  }
}

// --------------------------------------------------------------------------
// ATG YouTube Live Automation & Chat Bot Console Module
// Connects frontend to local Python Bot Server API (port 5000)
// Zero emojis.
// --------------------------------------------------------------------------
function initBotConsoleModule() {
  const consoleSection = document.getElementById('botConsoleSection');
  if (!consoleSection) return;

  const API_BASE = 'http://localhost:5000';

  const startBtn = document.getElementById('btnStartBot');
  const stopBtn = document.getElementById('btnStopBot');
  const statusDot = document.getElementById('botStatusDot');
  const statusText = document.getElementById('botStatusText');
  const serverStatusBadge = document.getElementById('botServerStatusBadge');
  const targetUrlInput = document.getElementById('botTargetUrl');
  const updateTargetBtn = document.getElementById('btnUpdateTargetUrl');
  const speedSelect = document.getElementById('botSpeedSelect');
  const headlessSelect = document.getElementById('botHeadlessSelect');
  const msgCountEl = document.getElementById('botMsgCount');
  const refreshConfigBtn = document.getElementById('btnRefreshConfig');
  const newMsgInput = document.getElementById('botNewMsgInput');
  const addMsgBtn = document.getElementById('btnAddMsg');
  const messagesList = document.getElementById('botMessagesList');
  const terminalLogs = document.getElementById('botTerminalLogs');
  const clearTerminalBtn = document.getElementById('btnClearTerminal');

  let currentMessages = [];
  let eventSource = null;

  function appendLog(text, cls = '') {
    if (!terminalLogs) return;
    const line = document.createElement('div');
    line.className = `t-line ${cls}`.trim();
    line.textContent = text;
    terminalLogs.appendChild(line);

    // Keep log size bounded in browser
    while (terminalLogs.children.length > 250) {
      terminalLogs.removeChild(terminalLogs.firstChild);
    }
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  // SSE Real-Time Logs Stream
  function connectLogStream() {
    if (eventSource) {
      try { eventSource.close(); } catch (e) {}
    }
    try {
      eventSource = new EventSource(`${API_BASE}/api/logs`);
      eventSource.onmessage = (e) => {
        if (!e.data) return;
        // Clean ANSI and terminal control escape codes
        let msg = e.data.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').replace(/\[\d+;\d+H/g, '').replace(/\[\d+K/g, '').replace(/\[[su]/g, '').trim();
        if (!msg) return;
        let cls = 'dim';
        if (msg.includes('LOGIN REQUIRED') || msg.includes('[AUTH]')) {
          cls = 'gold';
          const loginBtn = document.getElementById('btnLoginBrowser');
          if (loginBtn) loginBtn.classList.add('pulse-attention');
          if (statusText) statusText.textContent = 'STATUS: LOGIN REQUIRED // Click "Sign In (Chrome)" to authenticate';
          if (statusDot) statusDot.className = 'bot-status-indicator stopped';
        } else if (msg.includes('[LIVE]') || msg.includes('Sent') || msg.includes('SUCCESS') || msg.includes('OK')) {
          cls = 'green';
        } else if (msg.includes('WARN') || msg.includes('Starting') || msg.includes('Launched')) {
          cls = 'gold';
        } else if (msg.includes('ERR') || msg.includes('FAIL') || msg.includes('Exception') || msg.includes('Terminated')) {
          cls = 'red';
        } else if (msg.includes('INFO') || msg.includes('Selenium') || msg.includes('Chrome') || msg.includes('Target')) {
          cls = 'cyan';
        }
        appendLog(msg, cls);
      };
      eventSource.onerror = () => {
        // SSE disconnected, will retry automatically by browser
      };
    } catch (err) {
      console.warn('SSE connect error:', err);
    }
  }

  // Poll Bot Server Status
  async function pollStatus() {
    try {
      const res = await fetch(`${API_BASE}/api/status`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (serverStatusBadge) {
        serverStatusBadge.textContent = 'API SERVER ONLINE (PORT 5000)';
        serverStatusBadge.style.color = '#10b981';
        serverStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        serverStatusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
      }

      if (data.running) {
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (statusDot) statusDot.className = 'bot-status-indicator running';
        if (statusText) statusText.textContent = `STATUS: BOT RUNNING (PID ${data.pid}) // ACTIVE`;
      } else {
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (statusDot) statusDot.className = 'bot-status-indicator stopped';
        if (statusText) statusText.textContent = 'STATUS: IDLE // READY TO LAUNCH';
      }

      if (targetUrlInput && !targetUrlInput.value && data.target_url) {
        targetUrlInput.value = data.target_url;
      }
    } catch (err) {
      if (serverStatusBadge) {
        serverStatusBadge.textContent = 'API SERVER OFFLINE';
        serverStatusBadge.style.color = '#ef4444';
        serverStatusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        serverStatusBadge.style.background = 'rgba(239, 68, 68, 0.1)';
      }
      if (statusDot) statusDot.className = 'bot-status-indicator error';
      if (statusText) statusText.textContent = 'STATUS: SERVER OFFLINE // Run python yt_bot/bot_server.py';
      if (startBtn) startBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = true;
    }
  }

  // Load Bot Config (URLs & Messages)
  async function loadConfig() {
    try {
      const res = await fetch(`${API_BASE}/api/config`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();

      if (targetUrlInput && data.urls && data.urls.length > 0) {
        targetUrlInput.value = data.urls[0];
      }

      if (Array.isArray(data.messages)) {
        currentMessages = data.messages;
        renderMessages();
      }
    } catch (e) {
      console.warn('Config load error:', e);
    }
  }

  // Render Messages List
  function renderMessages() {
    if (!messagesList) return;
    messagesList.innerHTML = '';
    if (msgCountEl) msgCountEl.textContent = currentMessages.length;

    if (currentMessages.length === 0) {
      const empty = document.createElement('div');
      empty.className = 't-line dim';
      empty.style.padding = '0.5rem 0';
      empty.textContent = 'No messages queued. Add messages above.';
      messagesList.appendChild(empty);
      return;
    }

    currentMessages.forEach((msg, idx) => {
      const item = document.createElement('div');
      item.className = 'bot-msg-pill';

      const span = document.createElement('span');
      span.textContent = `${idx + 1}. ${msg}`;
      span.title = msg;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-del-msg';
      delBtn.title = 'Remove message';
      delBtn.textContent = 'x';
      delBtn.addEventListener('click', () => {
        deleteMessage(idx);
      });

      item.appendChild(span);
      item.appendChild(delBtn);
      messagesList.appendChild(item);
    });
  }

  // Save Config to Server
  async function saveConfig() {
    try {
      const url = targetUrlInput ? targetUrlInput.value.trim() : '';
      const payload = {
        urls: url ? [url] : [],
        messages: currentMessages
      };
      const res = await fetch(`${API_BASE}/api/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        appendLog(`[CONFIG] Saved: ${payload.urls.length} target URL(s), ${payload.messages.length} message(s).`, 'green');
      }
    } catch (err) {
      appendLog(`[ERROR] Failed to save config: ${err.message}`, 'red');
    }
  }

  // Add New Message
  function addMessage() {
    if (!newMsgInput) return;
    const text = newMsgInput.value.trim();
    if (!text) return;
    currentMessages.push(text);
    newMsgInput.value = '';
    renderMessages();
    saveConfig();
  }

  // Delete Message by Index
  function deleteMessage(index) {
    if (index >= 0 && index < currentMessages.length) {
      currentMessages.splice(index, 1);
      renderMessages();
      saveConfig();
    }
  }

  // Start Bot Handler
  async function handleStartBot() {
    const url = targetUrlInput ? targetUrlInput.value.trim() : '';
    if (!url) {
      alert('Please enter a target YouTube Live Stream URL.');
      if (targetUrlInput) targetUrlInput.focus();
      return;
    }

    const speed = speedSelect ? speedSelect.value : 'normal';
    const headless = headlessSelect ? parseInt(headlessSelect.value, 10) : 0;

    appendLog(`[START COMMAND] Initiating live automation bot...`, 'gold');
    appendLog(`[PARAMS] Target URL: ${url} | Mode: ${speed} | Headless: ${headless === 1 ? 'Yes' : 'No'}`, 'dim');

    if (startBtn) startBtn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url,
          target_url: url,
          speed: speed,
          speed_mode: speed,
          headless: headless,
          messages: currentMessages
        })
      });
      const data = await res.json();
      if (res.ok && (data.status === 'started' || data.ok)) {
        appendLog(`[SUCCESS] Bot launched successfully with PID ${data.pid || ''}!`, 'green');
        pollStatus();
      } else {
        appendLog(`[ERROR] Failed to launch bot: ${data.msg || data.message || data.error || 'Unknown error'}`, 'red');
        if (startBtn) startBtn.disabled = false;
      }
    } catch (err) {
      appendLog(`[ERROR] Network error contacting bot server: ${err.message}`, 'red');
      if (startBtn) startBtn.disabled = false;
    }
  }

  // Stop Bot Handler
  async function handleStopBot() {
    appendLog(`[STOP COMMAND] Sending termination signal to bot engine...`, 'gold');
    if (stopBtn) stopBtn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/api/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        appendLog(`[SUCCESS] Bot stopped cleanly. Status: ${data.status}`, 'green');
        pollStatus();
      } else {
        appendLog(`[ERROR] Failed to stop bot: ${data.message || data.error}`, 'red');
      }
    } catch (err) {
      appendLog(`[ERROR] Network error contacting bot server: ${err.message}`, 'red');
    }
  }

  // Event Listeners
  if (startBtn) startBtn.addEventListener('click', handleStartBot);
  if (stopBtn) stopBtn.addEventListener('click', handleStopBot);

  const loginBrowserBtn = document.getElementById('btnLoginBrowser');
  if (loginBrowserBtn) {
    loginBrowserBtn.addEventListener('click', async () => {
      loginBrowserBtn.classList.remove('pulse-attention');
      appendLog('[AUTH] Opening Chrome to sign in to YouTube account...', 'cyan');
      try {
        const res = await fetch(`${API_BASE}/api/login-browser`, { method: 'POST' });
        if (!res.ok) {
          const text = await res.text();
          appendLog(`[AUTH] Server responded with error (${res.status}): ${text.substring(0, 80)}`, 'red');
          return;
        }
        const data = await res.json();
        if (data.ok) {
          appendLog('[AUTH] Chrome opened! Sign in to YouTube once. Once signed in, close Chrome and click Start Live Bot.', 'green');
        } else {
          appendLog(`[AUTH] ${data.msg}`, 'red');
        }
      } catch (err) {
        appendLog(`[AUTH] Network error: ${err.message}`, 'red');
      }
    });
  }

  if (updateTargetBtn) {
    updateTargetBtn.addEventListener('click', () => {
      saveConfig();
    });
  }

  if (addMsgBtn) addMsgBtn.addEventListener('click', addMessage);
  if (newMsgInput) {
    newMsgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addMessage();
      }
    });
  }

  if (refreshConfigBtn) {
    refreshConfigBtn.addEventListener('click', () => {
      loadConfig();
      appendLog('[CONFIG] Reloaded messages and targets from server.', 'dim');
    });
  }

  if (clearTerminalBtn && terminalLogs) {
    clearTerminalBtn.addEventListener('click', () => {
      terminalLogs.innerHTML = '';
      appendLog('[SYSTEM] Terminal log cleared by operator.', 'dim');
    });
  }

  // Initialize
  pollStatus();
  loadConfig();
  connectLogStream();

  // Poll status every 3 seconds
  setInterval(pollStatus, 3000);
}

// --------------------------------------------------------------------------
// ATG Digital Knowledge Library Module
// Multi-shelf Carousels, Global Search, Password-Protected Admin Upload & PDF.js Auto Thumbnail
// --------------------------------------------------------------------------
function initLibraryModule() {
  const MASTER_ADMIN_PASSWORD = 'Asif@#69#@';

  // 1. Shelf Carousel Scrolling
  document.querySelectorAll('.btn-shelf-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const track = document.getElementById(targetId);
      if (!track) return;
      const scrollAmount = btn.classList.contains('prev') ? -320 : 320;
      track.parentElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });

  // 2. Global Unified Search
  const searchInput = document.getElementById('libSearchInput');
  const searchSubmitBtn = document.getElementById('btnLibSearchSubmit');
  const searchResultsContainer = document.getElementById('libSearchResultsContainer');
  const searchResultsGrid = document.getElementById('libSearchResultsGrid');
  const searchResultsTitle = document.getElementById('libSearchResultsTitle');
  const resetSearchBtn = document.getElementById('btnResetSearch');

  function performSearch() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (!query) {
      if (searchResultsContainer) searchResultsContainer.style.display = 'none';
      return;
    }

    const allCards = document.querySelectorAll('.lib-card-shelf');
    const matched = [];

    allCards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const author = (card.getAttribute('data-author') || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      if (title.includes(query) || author.includes(query) || category.includes(query)) {
        matched.push(card);
      }
    });

    if (searchResultsContainer && searchResultsGrid) {
      searchResultsGrid.innerHTML = '';
      if (matched.length > 0) {
        matched.forEach(card => {
          const clone = card.cloneNode(true);
          searchResultsGrid.appendChild(clone);
        });
        if (searchResultsTitle) searchResultsTitle.textContent = `Found ${matched.length} Publication${matched.length === 1 ? '' : 's'} matching "${query.toUpperCase()}"`;
      } else {
        searchResultsGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
            <p style="font-size: 1.1rem; color: var(--text-main); font-weight: 700; margin-bottom: 0.4rem;">No matching documents found</p>
            <p style="font-size: 0.85rem;">Try searching for different keywords, topics, or authors.</p>
          </div>
        `;
        if (searchResultsTitle) searchResultsTitle.textContent = `Search results for "${query.toUpperCase()}"`;
      }
      searchResultsContainer.style.display = 'block';
      searchResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      bindReaderButtons();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', performSearch);
  }

  if (resetSearchBtn && searchInput) {
    resetSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (searchResultsContainer) searchResultsContainer.style.display = 'none';
      searchInput.focus();
    });
  }

  // 3. Interactive Reading Modal
  const readerModal = document.getElementById('libReaderModal');
  const modalBackdrop = document.getElementById('libModalBackdrop');
  const modalClose = document.getElementById('libModalClose');
  const modalTitle = document.getElementById('libModalTitle');
  const modalFrame = document.getElementById('libModalFrame');
  const modalDownload = document.getElementById('libModalDownload');

  function openReader(pdfPath, title) {
    if (!readerModal || !modalFrame) return;
    if (modalTitle) modalTitle.textContent = `${title} - Reading Mode`;
    modalFrame.src = pdfPath;
    if (modalDownload) {
      modalDownload.href = pdfPath;
      modalDownload.download = `${title.replace(/\s+/g, '_')}.pdf`;
    }
    readerModal.classList.add('open');
    readerModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReader() {
    if (!readerModal || !modalFrame) return;
    readerModal.classList.remove('open');
    readerModal.setAttribute('aria-hidden', 'true');
    modalFrame.src = '';
    document.body.style.overflow = '';
  }

  function bindReaderButtons() {
    document.querySelectorAll('.btn-read-shelf').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const pdfPath = btn.getAttribute('data-pdf-path') || 'documents/money-by-dadashri.pdf';
        const title = btn.getAttribute('data-pdf-title') || 'Document';
        openReader(pdfPath, title);
      };
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeReader);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeReader);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readerModal && readerModal.classList.contains('open')) {
      closeReader();
    }
  });

  // 4. Admin Upload Modal & Automatic PDF.js Thumbnail Generator
  const btnOpenAdminModal = document.getElementById('btnOpenAdminModal');
  const libAdminModal = document.getElementById('libAdminModal');
  const adminModalClose = document.getElementById('adminModalClose');
  const adminModalBackdrop = document.getElementById('adminModalBackdrop');
  const adminPasswordGate = document.getElementById('adminPasswordGate');
  const adminUploadFormSection = document.getElementById('adminUploadFormSection');
  const formAdminAuth = document.getElementById('formAdminAuth');
  const adminAuthPassword = document.getElementById('adminAuthPassword');
  const adminAuthError = document.getElementById('adminAuthError');
  const btnToggleAdminPw = document.getElementById('btnToggleAdminPw');
  const btnAdminLogout = document.getElementById('btnAdminLogout');
  const uploadPdfFile = document.getElementById('uploadPdfFile');
  const thumbPreviewBox = document.getElementById('thumbPreviewBox');
  const imgAutoThumbnail = document.getElementById('imgAutoThumbnail');
  const pdfOffscreenCanvas = document.getElementById('pdfOffscreenCanvas');
  const formUploadBook = document.getElementById('formUploadBook');

  let generatedCoverDataUrl = '';
  let uploadedPdfBlobUrl = '';

  function openAdminModal(targetShelf) {
    if (!libAdminModal) return;
    
    // If target shelf passed, pre-select it
    if (targetShelf && typeof targetShelf === 'string') {
      const shelfSelect = document.getElementById('uploadShelfCategory');
      if (shelfSelect) shelfSelect.value = targetShelf;
    }

    const isUnlocked = sessionStorage.getItem('atg_admin_unlocked') === 'true';
    if (isUnlocked) {
      if (adminPasswordGate) adminPasswordGate.style.display = 'none';
      if (adminUploadFormSection) adminUploadFormSection.style.display = 'block';
    } else {
      if (adminPasswordGate) adminPasswordGate.style.display = 'block';
      if (adminUploadFormSection) adminUploadFormSection.style.display = 'none';
      if (adminAuthPassword) {
        adminAuthPassword.value = '';
        setTimeout(() => adminAuthPassword.focus(), 150);
      }
      if (adminAuthError) adminAuthError.style.display = 'none';
    }
    libAdminModal.classList.add('open');
    libAdminModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAdminModal() {
    if (!libAdminModal) return;
    libAdminModal.classList.remove('open');
    libAdminModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all Admin Upload buttons
  if (btnOpenAdminModal) btnOpenAdminModal.addEventListener('click', () => openAdminModal());
  
  const heroAdminUploadBtn = document.getElementById('btnHeroAdminUpload');
  if (heroAdminUploadBtn) heroAdminUploadBtn.addEventListener('click', () => openAdminModal());

  document.querySelectorAll('.btn-chip-upload, .btn-shelf-upload').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shelf = btn.getAttribute('data-shelf') || 'books';
      openAdminModal(shelf);
    });
  });

  if (adminModalClose) adminModalClose.addEventListener('click', closeAdminModal);
  if (adminModalBackdrop) adminModalBackdrop.addEventListener('click', closeAdminModal);

  // Toggle password visibility
  if (btnToggleAdminPw && adminAuthPassword) {
    btnToggleAdminPw.addEventListener('click', () => {
      const type = adminAuthPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      adminAuthPassword.setAttribute('type', type);
    });
  }

  // Admin Authentication Check
  if (formAdminAuth) {
    formAdminAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminAuthPassword ? adminAuthPassword.value.trim() : '';
      if (entered === MASTER_ADMIN_PASSWORD) {
        sessionStorage.setItem('atg_admin_unlocked', 'true');
        if (adminAuthError) adminAuthError.style.display = 'none';
        if (adminPasswordGate) adminPasswordGate.style.display = 'none';
        if (adminUploadFormSection) adminUploadFormSection.style.display = 'block';
      } else {
        if (adminAuthError) adminAuthError.style.display = 'block';
        if (adminAuthPassword) {
          adminAuthPassword.value = '';
          adminAuthPassword.focus();
        }
      }
    });
  }

  // Admin Logout / Lock
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      sessionStorage.removeItem('atg_admin_unlocked');
      if (adminPasswordGate) adminPasswordGate.style.display = 'block';
      if (adminUploadFormSection) adminUploadFormSection.style.display = 'none';
      if (adminAuthPassword) adminAuthPassword.value = '';
    });
  }

  // Smart Shelf Auto-Routing Engine
  function detectShelfCategory(text) {
    const str = (text || '').toLowerCase();

    // 1. News Keywords
    if (/news|newspaper|times|express|chronicle|standard|dainik|patrika|tribune|daily|edition|editorial|headline|samachar|gazette|journal/i.test(str)) {
      return { category: 'news', name: 'Latest News & Newspapers', ribbon: 'popular' };
    }

    // 2. Magazine Keywords
    if (/magazine|mag|vogue|lifestyle|soccer|sports|fabulous|life|forbes|fortune|cosmopolitan|glamour|cinema|entertainment|monthly|weekly|fashion|reader|digest/i.test(str)) {
      return { category: 'magazine', name: 'Latest Magazines', ribbon: 'popular' };
    }

    // 3. Study Material Keywords
    if (/study|case|syllabus|lecture|notes|analytics|research|paper|assignment|exam|question|banking|hdfc|operations|framework|formula|data science|quantitative|methodology|module|curriculum|treatise|whitepaper|analysis/i.test(str)) {
      return { category: 'study', name: 'Study Material & Case Studies', ribbon: 'featured' };
    }

    // 4. Free Content Keywords
    if (/free|budget|handbook|guide|cheat|tutorial|beginner|basics|manual|open access|handouts|cheatsheet|notes for/i.test(str)) {
      return { category: 'free', name: 'Free Content & Notes', ribbon: 'trending' };
    }

    // 5. Default Books
    return { category: 'books', name: 'Latest Books', ribbon: 'popular' };
  }

  function applyAutoRouting(text) {
    const detected = detectShelfCategory(text);
    const shelfSelect = document.getElementById('uploadShelfCategory');
    const ribbonSelect = document.getElementById('uploadBookRibbon');
    const autoDetectHint = document.getElementById('autoDetectHint');

    if (shelfSelect) {
      shelfSelect.value = detected.category;
    }
    if (ribbonSelect && ribbonSelect.value === 'popular') {
      ribbonSelect.value = detected.ribbon;
    }
    if (autoDetectHint) {
      autoDetectHint.textContent = `✓ Auto-routed to: ${detected.name}`;
      autoDetectHint.style.display = 'block';
    }
  }

  const titleInputEl = document.getElementById('uploadBookTitle');
  if (titleInputEl) {
    titleInputEl.addEventListener('input', (e) => {
      if (e.target.value.trim().length > 3) {
        applyAutoRouting(e.target.value);
      }
    });
  }

  // PDF Page 1 Automatic Thumbnail Generator
  if (uploadPdfFile) {
    uploadPdfFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      uploadedPdfBlobUrl = URL.createObjectURL(file);

      // Auto-extract title and auto-route category based on filename
      const titleInput = document.getElementById('uploadBookTitle');
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      
      if (titleInput) {
        if (!titleInput.value) {
          titleInput.value = cleanFileName;
        }
        applyAutoRouting(cleanFileName);
      }

      try {
        if (typeof window.pdfjsLib === 'undefined') {
          console.warn('PDF.js not loaded, using fallback thumbnail');
          return;
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = pdfOffscreenCanvas || document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        generatedCoverDataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (imgAutoThumbnail && thumbPreviewBox) {
          imgAutoThumbnail.src = generatedCoverDataUrl;
          thumbPreviewBox.style.display = 'block';
        }
      } catch (err) {
        console.error('Error generating PDF thumbnail:', err);
      }
    });
  }

  // Add Uploaded Book to DOM & Storage
  function createShelfCardHtml(item) {
    let ribbonHtml = '';
    if (item.ribbon && item.ribbon !== 'none') {
      const ribbonClass = item.ribbon === 'souvenir' ? 'ribbon-souvenir' : `ribbon-${item.ribbon}`;
      ribbonHtml = `<div class="card-ribbon ${ribbonClass}">${item.ribbon.toUpperCase()}</div>`;
    }

    let thumbHtml = '';
    if (item.coverDataUrl) {
      thumbHtml = `
        <div class="lib-shelf-thumb-wrap">
          <img src="${item.coverDataUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `;
    } else {
      thumbHtml = `
        <div class="lib-shelf-thumb-wrap">
          <div class="shelf-thumb-gradient gold-black-grad">
            <div class="news-masthead">${item.title}</div>
            <div class="news-lead">${item.author || 'AsifTechGlobal Edition'}</div>
            <div class="news-sub-banner">Digital Publication</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="lib-card-shelf" data-category="${item.category}" data-title="${item.title}" data-author="${item.author}">
        ${ribbonHtml}
        ${thumbHtml}
        <div class="lib-shelf-card-info">
          <h3 class="shelf-card-name">${item.title}</h3>
          <p class="shelf-card-publisher">${item.author}</p>
          <div class="shelf-card-actions">
            <button type="button" class="btn-read-shelf" data-pdf-path="${item.pdfPath}" data-pdf-title="${item.title}">Read</button>
            <a href="${item.pdfPath}" download="${item.title.replace(/\s+/g, '_')}.pdf" class="btn-dl-shelf" title="Download">PDF</a>
          </div>
        </div>
      </div>
    `;
  }

  function appendCustomBook(item) {
    let trackId = 'booksTrack';
    if (item.category === 'news') trackId = 'newsTrack';
    else if (item.category === 'magazine') trackId = 'magTrack';
    else if (item.category === 'study') trackId = 'studyTrack';
    else if (item.category === 'free') trackId = 'freeTrack';

    const track = document.getElementById(trackId);
    if (track) {
      const tempWrapper = document.createElement('div');
      tempWrapper.innerHTML = createShelfCardHtml(item);
      const cardEl = tempWrapper.firstElementChild;
      track.prepend(cardEl);
      bindReaderButtons();
    }
  }

  // Load saved custom uploads
  function loadCustomUploads() {
    try {
      const saved = JSON.parse(localStorage.getItem('atg_custom_library_items') || '[]');
      saved.forEach(item => appendCustomBook(item));
    } catch (e) {
      console.error('Failed to load custom uploads:', e);
    }
  }

  // Form Submit: Publish Book
  if (formUploadBook) {
    formUploadBook.addEventListener('submit', (e) => {
      e.preventDefault();

      const category = document.getElementById('uploadShelfCategory')?.value || 'books';
      const title = document.getElementById('uploadBookTitle')?.value.trim() || 'Untitled Publication';
      const author = document.getElementById('uploadBookAuthor')?.value.trim() || 'AsifTechGlobal Author';
      const ribbon = document.getElementById('uploadBookRibbon')?.value || 'popular';

      const item = {
        id: 'book_' + Date.now(),
        category: category,
        title: title,
        author: author,
        ribbon: ribbon,
        coverDataUrl: generatedCoverDataUrl,
        pdfPath: uploadedPdfBlobUrl || 'documents/money-by-dadashri.pdf',
        timestamp: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('atg_custom_library_items') || '[]');
        existing.unshift(item);
        localStorage.setItem('atg_custom_library_items', JSON.stringify(existing));
      } catch (err) {
        console.warn('Storage limit reached, displaying in current session:', err);
      }

      appendCustomBook(item);
      closeAdminModal();
      formUploadBook.reset();
      generatedCoverDataUrl = '';
      if (thumbPreviewBox) thumbPreviewBox.style.display = 'none';

      // Scroll to target shelf
      let targetShelf = 'shelfBooks';
      if (category === 'news') targetShelf = 'shelfNews';
      else if (category === 'magazine') targetShelf = 'shelfMagazines';
      else if (category === 'study') targetShelf = 'shelfStudy';
      else if (category === 'free') targetShelf = 'shelfFree';

      const shelfEl = document.getElementById(targetShelf);
      if (shelfEl) shelfEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Initial bindings & load custom uploads
  bindReaderButtons();
  loadCustomUploads();
}


