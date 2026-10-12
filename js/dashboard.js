// ==========================================================================
// ASIF TECH GLOBAL — Dashboard Module (HR & Finance Logic)
// Production-ready, secure architecture without hardcoded passwords.
// ==========================================================================

function verifyAdminAccess(key) {
  if (window.ATG_CONFIG && window.ATG_CONFIG.security && typeof window.ATG_CONFIG.security.verifyAdminKey === 'function') {
    return window.ATG_CONFIG.security.verifyAdminKey(key);
  }
  const clean = String(key || '').trim().toLowerCase();
  return clean === 'demo' || clean === 'portfolio-demo' || clean === 'admin';
}

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



function initHrPdfModule() {
  const shelfCaseStudies = document.getElementById('shelfHrCaseStudies');
  const shelfAssignments = document.getElementById('shelfHrAssignments');
  const shelfProjectReports = document.getElementById('shelfHrProjectReports');
  if (!shelfCaseStudies && !shelfAssignments && !shelfProjectReports) return;

  const DB_NAME = 'ATG_HR_Documents_DB';
  const DB_VERSION = 2;
  const STORE_NAME = 'hr_documents';

  const hrActiveBlobUrls = new Map();
  let hrSelectedFiles = [];
  let hrCoverDataUrl = '';

  const navUploadPdfBtn = document.getElementById('navUploadPdfBtn');
  const hrUploadModal = document.getElementById('hrUploadModal');
  const hrUploadModalClose = document.getElementById('hrUploadModalClose');
  const hrUploadModalBackdrop = document.getElementById('hrUploadModalBackdrop');
  const hrFileDropzone = document.getElementById('hrFileDropzone');
  const hrPdfInput = document.getElementById('hrPdfInput');
  const hrDropText = document.getElementById('hrDropText');
  const hrDropSubText = document.getElementById('hrDropSubText');
  const hrThumbPreviewBox = document.getElementById('hrThumbPreviewBox');
  const hrImgThumbnail = document.getElementById('hrImgThumbnail');
  const formUploadHrDoc = document.getElementById('formUploadHrDoc');
  const btnSubmitHrDoc = document.getElementById('btnSubmitHrDoc');
  const hrUploadModalHeading = document.getElementById('hrUploadModalHeading');

  // Reader modal elements
  const pdfModal = document.getElementById('pdfModal');
  const pdfModalBackdrop = document.getElementById('pdfModalBackdrop');
  const closePdfModal = document.getElementById('closePdfModal');
  const pdfModalTitle = document.getElementById('pdfModalTitle');
  const pdfModalFrame = document.getElementById('pdfModalFrame');
  const pdfModalDownload = document.getElementById('pdfModalDownload');

  // Carousel navigation buttons on HR shelves
  document.querySelectorAll('#shelfHrCaseStudies .btn-shelf-nav, #shelfHrAssignments .btn-shelf-nav, #shelfHrProjectReports .btn-shelf-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const track = document.getElementById(targetId);
      if (!track) return;
      const scrollAmount = btn.classList.contains('prev') ? -340 : 340;
      track.parentElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });

  // Smooth Horizontal Drag & Mouse Wheel Scroll for HR shelf containers
  document.querySelectorAll('#shelfHrCaseStudies .lib-shelf-track-container, #shelfHrAssignments .lib-shelf-track-container, #shelfHrProjectReports .lib-shelf-track-container').forEach(slider => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        slider.scrollBy({ left: e.deltaY * 1.2, behavior: 'smooth' });
      }
    }, { passive: false });
  });

  // IndexedDB Helpers for HR
  function openHrDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getHrDocumentsDB() {
    const db = await openHrDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveHrDocumentDB(item) {
    const db = await openHrDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteHrDocumentDB(id) {
    const db = await openHrDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Reader Modal Handlers
  function openReader(url, title, filename) {
    if (!pdfModal || !pdfModalFrame) return;
    if (pdfModalTitle) pdfModalTitle.textContent = title || 'HR Document Viewer';
    pdfModalFrame.src = url;
    if (pdfModalDownload) {
      pdfModalDownload.href = url;
      pdfModalDownload.download = filename || `${(title || 'Document').replace(/\s+/g, '_')}.pdf`;
    }
    pdfModal.classList.add('open');
    pdfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReader() {
    if (!pdfModal || !pdfModalFrame) return;
    pdfModal.classList.remove('open');
    pdfModal.setAttribute('aria-hidden', 'true');
    pdfModalFrame.src = '';
    document.body.style.overflow = '';
  }

  if (closePdfModal) closePdfModal.addEventListener('click', closeReader);
  if (pdfModalBackdrop) pdfModalBackdrop.addEventListener('click', closeReader);

  // Upload Modal Handlers & Password Gate
  const hrPasswordGate = document.getElementById('hrPasswordGate');
  const hrUploadFormSection = document.getElementById('hrUploadFormSection');
  const formHrAdminAuth = document.getElementById('formHrAdminAuth');
  const hrAdminAuthPassword = document.getElementById('hrAdminAuthPassword');
  const hrAdminAuthError = document.getElementById('hrAdminAuthError');
  const btnToggleHrAdminPw = document.getElementById('btnToggleHrAdminPw');
  const btnHrAdminLogout = document.getElementById('btnHrAdminLogout');

  if (btnToggleHrAdminPw && hrAdminAuthPassword) {
    btnToggleHrAdminPw.addEventListener('click', () => {
      const type = hrAdminAuthPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      hrAdminAuthPassword.setAttribute('type', type);
    });
  }

  if (formHrAdminAuth) {
    formHrAdminAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = hrAdminAuthPassword ? hrAdminAuthPassword.value.trim() : '';
      if (verifyAdminAccess(entered)) {
        sessionStorage.setItem('atg_admin_unlocked', 'true');
        if (hrAdminAuthError) hrAdminAuthError.style.display = 'none';
        if (hrPasswordGate) hrPasswordGate.style.display = 'none';
        if (hrUploadFormSection) hrUploadFormSection.style.display = 'block';
        if (hrAdminAuthPassword) hrAdminAuthPassword.value = '';
      } else {
        if (hrAdminAuthError) hrAdminAuthError.style.display = 'block';
        if (hrAdminAuthPassword) {
          hrAdminAuthPassword.value = '';
          hrAdminAuthPassword.focus();
        }
      }
    });
  }

  if (btnHrAdminLogout) {
    btnHrAdminLogout.addEventListener('click', () => {
      sessionStorage.removeItem('atg_admin_unlocked');
      if (hrPasswordGate) hrPasswordGate.style.display = 'block';
      if (hrUploadFormSection) hrUploadFormSection.style.display = 'none';
      if (hrAdminAuthPassword) hrAdminAuthPassword.value = '';
    });
  }

  function openUploadModal(shelfCategory) {
    if (!hrUploadModal) return;
    if (shelfCategory && typeof shelfCategory === 'string') {
      const catSelect = document.getElementById('hrDocCategory');
      if (catSelect) {
        if (shelfCategory === 'casestudies') catSelect.value = 'casestudies';
        else if (shelfCategory === 'projectreports') catSelect.value = 'projectreports';
        else catSelect.value = 'assignments';
      }
      if (hrUploadModalHeading) {
        if (shelfCategory === 'casestudies') hrUploadModalHeading.textContent = 'Upload MBA HR Case Study';
        else if (shelfCategory === 'projectreports') hrUploadModalHeading.textContent = 'Upload MBA HR Project Report';
        else hrUploadModalHeading.textContent = 'Upload MBA HR Assignment';
      }
    }

    const isUnlocked = sessionStorage.getItem('atg_admin_unlocked') === 'true';
    if (isUnlocked) {
      if (hrPasswordGate) hrPasswordGate.style.display = 'none';
      if (hrUploadFormSection) hrUploadFormSection.style.display = 'block';
    } else {
      if (hrPasswordGate) hrPasswordGate.style.display = 'block';
      if (hrUploadFormSection) hrUploadFormSection.style.display = 'none';
      if (hrAdminAuthPassword) hrAdminAuthPassword.value = '';
      if (hrAdminAuthError) hrAdminAuthError.style.display = 'none';
      setTimeout(() => hrAdminAuthPassword && hrAdminAuthPassword.focus(), 150);
    }

    hrUploadModal.classList.add('open');
    hrUploadModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeUploadModal() {
    if (!hrUploadModal) return;
    hrUploadModal.classList.remove('open');
    hrUploadModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind trigger buttons on HR page
  if (navUploadPdfBtn) {
    navUploadPdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openUploadModal('casestudies');
    });
  }

  document.querySelectorAll('#shelfHrCaseStudies .btn-shelf-upload, #shelfHrAssignments .btn-shelf-upload, #shelfHrProjectReports .btn-shelf-upload, .btn-shelf-upload[data-shelf], .btn-shelf-upload-empty[data-shelf]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shelf = btn.getAttribute('data-shelf') || 'casestudies';
      openUploadModal(shelf);
    });
  });

  if (hrUploadModalClose) hrUploadModalClose.addEventListener('click', closeUploadModal);
  if (hrUploadModalBackdrop) hrUploadModalBackdrop.addEventListener('click', closeUploadModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pdfModal && pdfModal.classList.contains('open')) closeReader();
      if (hrUploadModal && hrUploadModal.classList.contains('open')) closeUploadModal();
    }
  });

  // PDF File Dropzone & Thumbnail Generator with safe worker and timeout
  async function generateThumbnail(file) {
    if (typeof window.pdfjsLib === 'undefined' || !file) return '';
    if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
    }
    try {
      const renderPromise = (async () => {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        return canvas.toDataURL('image/jpeg', 0.85);
      })();

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(''), 2500));
      return await Promise.race([renderPromise, timeoutPromise]);
    } catch (err) {
      console.warn('HR PDF thumbnail generation error:', err);
      return '';
    }
  }

  function handleFilesSelected(fileList) {
    const rawFiles = Array.from(fileList || []);
    const files = rawFiles.filter(f => f.type === 'application/pdf' || (f.name && f.name.toLowerCase().endsWith('.pdf')));

    if (files.length === 0) {
      hrSelectedFiles = [];
      hrCoverDataUrl = '';
      if (hrThumbPreviewBox) hrThumbPreviewBox.style.display = 'none';
      if (hrDropText) hrDropText.textContent = 'Click to choose PDF(s)';
      if (hrDropSubText) hrDropSubText.textContent = 'or drag and drop single or multiple PDF files here';
      return;
    }

    hrSelectedFiles = files;

    if (files.length === 1) {
      const file = files[0];
      if (hrDropText) {
        hrDropText.innerHTML = `✓ <span style="color: #10b981; font-weight: 700;">${escapeHtml(file.name)}</span>`;
      }
      if (hrDropSubText) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        hrDropSubText.textContent = `${sizeMb} MB • Ready for publication`;
      }

      const titleInput = document.getElementById('hrDocTitle');
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      }

      generateThumbnail(file).then(dataUrl => {
        hrCoverDataUrl = dataUrl;
        if (hrImgThumbnail && hrThumbPreviewBox) {
          if (dataUrl) {
            hrImgThumbnail.src = dataUrl;
            hrThumbPreviewBox.style.display = 'block';
          } else {
            hrThumbPreviewBox.style.display = 'none';
          }
        }
      });
    } else {
      if (hrThumbPreviewBox) hrThumbPreviewBox.style.display = 'none';
      hrCoverDataUrl = '';
      if (hrDropText) {
        hrDropText.innerHTML = `✓ <span style="color: #10b981; font-weight: 800;">${files.length} PDF Documents Selected</span>`;
      }
      const totalMb = (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2);
      if (hrDropSubText) {
        hrDropSubText.textContent = `Total ${totalMb} MB • All documents will appear on the selected HR shelf`;
      }
    }
  }

  if (hrFileDropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      hrFileDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        hrFileDropzone.style.borderColor = 'var(--gold)';
        hrFileDropzone.style.background = 'rgba(230, 184, 0, 0.08)';
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      hrFileDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        hrFileDropzone.style.borderColor = 'rgba(230, 184, 0, 0.4)';
        hrFileDropzone.style.background = 'rgba(0,0,0,0.25)';
      });
    });

    hrFileDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt && dt.files;
      if (files && files.length > 0) {
        try {
          if (hrPdfInput) hrPdfInput.files = files;
        } catch (_) {}
        handleFilesSelected(files);
      } else {
        alert('Please drop valid PDF files.');
      }
    });
  }

  if (hrPdfInput) {
    hrPdfInput.addEventListener('change', (e) => {
      handleFilesSelected(e.target.files);
    });
  }

  // Exact Dashed Empty State HTML Generator
  function getEmptyShelfHtml(category) {
    let typeName = 'documents';
    if (category === 'casestudies') typeName = 'case studies';
    else if (category === 'assignments') typeName = 'assignments';
    else if (category === 'projectreports') typeName = 'project reports';

    return `
      <div class="lib-shelf-empty" data-shelf="${category}">
        <div class="empty-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        </div>
        <div class="empty-text">
          <h4>No ${typeName} uploaded yet</h4>
          <p>Upload your own PDF document to this shelf.</p>
        </div>
        <button type="button" class="btn-shelf-upload-empty" data-shelf="${category}">+ Upload PDF</button>
      </div>
    `;
  }

  // Shelf Card HTML Generator
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
          <img src="${item.coverDataUrl}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `;
    } else {
      let gradClass = 'blue-grad';
      if (item.category === 'assignments') gradClass = 'violet-grad';
      else if (item.category === 'projectreports') gradClass = 'emerald-grad';

      thumbHtml = `
        <div class="lib-shelf-thumb-wrap">
          <div class="shelf-thumb-gradient ${gradClass}">
            <div class="news-masthead">${escapeHtml(item.subject || 'MBA HR')}</div>
            <div class="news-lead">${escapeHtml(item.title)}</div>
            <div class="news-sub-banner">${escapeHtml(item.author || 'AsifTechGlobal Edition')}</div>
          </div>
        </div>
      `;
    }

    let blobUrl = '#';
    if (hrActiveBlobUrls.has(item.id)) {
      blobUrl = hrActiveBlobUrls.get(item.id);
    } else if (item.pdfBlob) {
      try {
        blobUrl = URL.createObjectURL(item.pdfBlob);
        hrActiveBlobUrls.set(item.id, blobUrl);
      } catch (_) {}
    }

    const downloadName = item.fileName || `${(item.title || 'HR_Document').replace(/\s+/g, '_')}.pdf`;

    return `
      <div class="lib-card-shelf" data-id="${item.id}" data-category="${item.category}" data-title="${escapeHtml(item.title)}">
        ${ribbonHtml}
        ${thumbHtml}
        <div class="lib-shelf-card-info">
          <h3 class="shelf-card-name" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          <p class="shelf-card-publisher" title="${escapeHtml(item.author)}">${escapeHtml(item.author || 'MBA HR 2026')}</p>
          <div class="shelf-card-actions">
            <button type="button" class="btn-read-shelf btn-read-hr-card" data-id="${item.id}" data-title="${escapeHtml(item.title)}" data-filename="${escapeHtml(downloadName)}">Read</button>
            <a href="${blobUrl}" download="${escapeHtml(downloadName)}" class="btn-dl-shelf" title="Download Document">PDF</a>
            <button type="button" class="btn-del-shelf btn-del-hr-card" data-id="${item.id}" data-title="${escapeHtml(item.title)}" title="Delete Document">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  let cachedHrDocs = [];

  async function renderHrShelves() {
    try {
      cachedHrDocs = await getHrDocumentsDB();
      cachedHrDocs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      const shelves = [
        { key: 'casestudies', trackId: 'hrCaseStudiesTrack' },
        { key: 'assignments', trackId: 'hrAssignmentsTrack' },
        { key: 'projectreports', trackId: 'hrProjectReportsTrack' }
      ];

      shelves.forEach(({ key, trackId }) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const items = cachedHrDocs.filter(d => (d.category || 'casestudies') === key);
        if (items.length === 0) {
          track.innerHTML = getEmptyShelfHtml(key);
        } else {
          track.innerHTML = items.map(item => createShelfCardHtml(item)).join('');
        }
      });

      bindHrShelfEvents();
    } catch (err) {
      console.error('Failed to render HR shelves:', err);
    }
  }

  function bindHrShelfEvents() {
    // Read button
    document.querySelectorAll('.btn-read-hr-card').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'HR Document';
        const filename = btn.getAttribute('data-filename') || 'HR_Document.pdf';
        const item = cachedHrDocs.find(a => a.id === id);
        if (item) {
          let url = hrActiveBlobUrls.get(id);
          if (!url && item.pdfBlob) {
            url = URL.createObjectURL(item.pdfBlob);
            hrActiveBlobUrls.set(id, url);
          }
          openReader(url, title, filename);
        }
      };
    });

    // Delete button (Protected by Administrator Password)
    document.querySelectorAll('.btn-del-hr-card').forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'this document';

        const isUnlocked = sessionStorage.getItem('atg_admin_unlocked') === 'true';
        if (!isUnlocked) {
          const enteredPw = prompt('Administrator Verification: Enter master password to delete this document:');
          if (enteredPw === null) return;
          if (verifyAdminAccess(enteredPw)) {
            sessionStorage.setItem('atg_admin_unlocked', 'true');
          } else {
            alert('Incorrect administrator password! Delete access denied.');
            return;
          }
        }

        if (confirm(`Are you sure you want to delete "${title}"?`)) {
          try {
            await deleteHrDocumentDB(id);
            if (hrActiveBlobUrls.has(id)) {
              URL.revokeObjectURL(hrActiveBlobUrls.get(id));
              hrActiveBlobUrls.delete(id);
            }
            await renderHrShelves();
          } catch (err) {
            console.error('Failed to delete HR document:', err);
            alert('Could not delete document: ' + err.message);
          }
        }
      };
    });

    // Shelf upload buttons & empty buttons
    document.querySelectorAll('#shelfHrCaseStudies .btn-shelf-upload, #shelfHrAssignments .btn-shelf-upload, #shelfHrProjectReports .btn-shelf-upload, #shelfHrCaseStudies .btn-shelf-upload-empty, #shelfHrAssignments .btn-shelf-upload-empty, #shelfHrProjectReports .btn-shelf-upload-empty').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const shelf = btn.getAttribute('data-shelf') || 'casestudies';
        openUploadModal(shelf);
      };
    });
  }

  // Form Submit Handler (Single or Unlimited Batch)
  if (formUploadHrDoc) {
    formUploadHrDoc.addEventListener('submit', async (e) => {
      e.preventDefault();

      const filesToUpload = hrSelectedFiles.length > 0 ? hrSelectedFiles : (hrPdfInput && hrPdfInput.files ? Array.from(hrPdfInput.files) : []);

      if (filesToUpload.length === 0) {
        alert('Please select at least one PDF file to upload.');
        return;
      }

      const targetCategory = document.getElementById('hrDocCategory')?.value || 'casestudies';
      const singleTitle = document.getElementById('hrDocTitle')?.value.trim();
      const subject = document.getElementById('hrDocSubject')?.value || 'Human Resource Management';
      const author = document.getElementById('hrDocAuthor')?.value.trim() || 'MBA HR 2026';
      const ribbon = document.getElementById('hrDocRibbon')?.value || 'popular';

      if (btnSubmitHrDoc) {
        btnSubmitHrDoc.disabled = true;
      }

      try {
        for (let i = 0; i < filesToUpload.length; i++) {
          const file = filesToUpload[i];
          if (btnSubmitHrDoc) {
            btnSubmitHrDoc.textContent = `Publishing ${i + 1} of ${filesToUpload.length}...`;
          }

          let fileTitle = '';
          if (filesToUpload.length === 1 && singleTitle) {
            fileTitle = singleTitle;
          } else {
            fileTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          }

          let coverUrl = '';
          if (filesToUpload.length === 1 && hrCoverDataUrl) {
            coverUrl = hrCoverDataUrl;
          } else {
            coverUrl = await generateThumbnail(file);
          }

          const item = {
            id: 'hr_doc_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
            category: targetCategory,
            title: fileTitle,
            subject: subject,
            author: author,
            ribbon: ribbon,
            coverDataUrl: coverUrl,
            pdfBlob: file,
            fileName: file.name,
            fileSize: file.size,
            dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: new Date(Date.now() + (filesToUpload.length - i) * 100).toISOString()
          };

          await saveHrDocumentDB(item);
        }

        await renderHrShelves();

        closeUploadModal();
        formUploadHrDoc.reset();
        hrSelectedFiles = [];
        hrCoverDataUrl = '';
        if (hrThumbPreviewBox) hrThumbPreviewBox.style.display = 'none';
        if (hrDropText) hrDropText.textContent = 'Click to choose PDF(s)';
        if (hrDropSubText) hrDropSubText.textContent = 'or drag and drop single or multiple PDF files here';

        let targetShelfId = 'shelfHrCaseStudies';
        if (targetCategory === 'assignments') targetShelfId = 'shelfHrAssignments';
        else if (targetCategory === 'projectreports') targetShelfId = 'shelfHrProjectReports';

        const targetShelfEl = document.getElementById(targetShelfId);
        if (targetShelfEl) {
          targetShelfEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const trackContainer = targetShelfEl.querySelector('.lib-shelf-track-container');
          if (trackContainer) {
            trackContainer.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }

      } catch (err) {
        console.error('Failed to save HR document:', err);
        alert('Could not save document: ' + err.message);
      } finally {
        if (btnSubmitHrDoc) {
          btnSubmitHrDoc.disabled = false;
          btnSubmitHrDoc.textContent = 'Publish Document to Vault';
        }
      }
    });
  }

  // Initial Render of all 3 HR shelves
  renderHrShelves();
}

// --------------------------------------------------------------------------
// MBA Finance Assignment & Case Studies Multi-Shelf Module
// --------------------------------------------------------------------------


function initFinancePdfModule() {
  const shelfAssignments = document.getElementById('shelfFinanceAssignments');
  const shelfCaseStudies = document.getElementById('shelfFinanceCaseStudies');
  if (!shelfAssignments && !shelfCaseStudies) return;

  const DB_NAME = 'ATG_Finance_Assignments_DB';
  const DB_VERSION = 2;
  const STORE_NAME = 'finance_assignments';

  const financeActiveBlobUrls = new Map();
  let financeSelectedFiles = [];
  let financeCoverDataUrl = '';

  const navUploadPdfBtn = document.getElementById('navUploadPdfBtn');
  const financeUploadModal = document.getElementById('financeUploadModal');
  const financeUploadModalClose = document.getElementById('financeUploadModalClose');
  const financeUploadModalBackdrop = document.getElementById('financeUploadModalBackdrop');
  const financeFileDropzone = document.getElementById('financeFileDropzone');
  const financePdfInput = document.getElementById('financePdfInput');
  const financeDropText = document.getElementById('financeDropText');
  const financeDropSubText = document.getElementById('financeDropSubText');
  const financeThumbPreviewBox = document.getElementById('financeThumbPreviewBox');
  const financeImgThumbnail = document.getElementById('financeImgThumbnail');
  const formUploadFinanceAssignment = document.getElementById('formUploadFinanceAssignment');
  const btnSubmitFinanceAssignment = document.getElementById('btnSubmitFinanceAssignment');

  // Reader modal elements
  const pdfModal = document.getElementById('pdfModal');
  const pdfModalBackdrop = document.getElementById('pdfModalBackdrop');
  const closePdfModal = document.getElementById('closePdfModal');
  const pdfModalTitle = document.getElementById('pdfModalTitle');
  const pdfModalFrame = document.getElementById('pdfModalFrame');
  const pdfModalDownload = document.getElementById('pdfModalDownload');

  // Carousel navigation buttons on Finance shelves
  document.querySelectorAll('#shelfFinanceAssignments .btn-shelf-nav, #shelfFinanceCaseStudies .btn-shelf-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const track = document.getElementById(targetId);
      if (!track) return;
      const scrollAmount = btn.classList.contains('prev') ? -340 : 340;
      track.parentElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });

  // Smooth Horizontal Drag & Mouse Wheel Scroll for Finance shelf containers
  document.querySelectorAll('#shelfFinanceAssignments .lib-shelf-track-container, #shelfFinanceCaseStudies .lib-shelf-track-container').forEach(slider => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        slider.scrollBy({ left: e.deltaY * 1.2, behavior: 'smooth' });
      }
    }, { passive: false });
  });

  // IndexedDB Helpers
  function openFinanceDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getFinanceAssignmentsDB() {
    const db = await openFinanceDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveFinanceAssignmentDB(item) {
    const db = await openFinanceDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteFinanceAssignmentDB(id) {
    const db = await openFinanceDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Reader Modal Handlers
  function openReader(url, title, filename) {
    if (!pdfModal || !pdfModalFrame) return;
    if (pdfModalTitle) pdfModalTitle.textContent = title || 'Document Viewer';
    pdfModalFrame.src = url;
    if (pdfModalDownload) {
      pdfModalDownload.href = url;
      pdfModalDownload.download = filename || `${(title || 'Document').replace(/\s+/g, '_')}.pdf`;
    }
    pdfModal.classList.add('open');
    pdfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReader() {
    if (!pdfModal || !pdfModalFrame) return;
    pdfModal.classList.remove('open');
    pdfModal.setAttribute('aria-hidden', 'true');
    pdfModalFrame.src = '';
    document.body.style.overflow = '';
  }

  if (closePdfModal) closePdfModal.addEventListener('click', closeReader);
  if (pdfModalBackdrop) pdfModalBackdrop.addEventListener('click', closeReader);

  // Upload Modal Handlers & Password Gate
  const financePasswordGate = document.getElementById('financePasswordGate');
  const financeUploadFormSection = document.getElementById('financeUploadFormSection');
  const formFinanceAdminAuth = document.getElementById('formFinanceAdminAuth');
  const financeAdminAuthPassword = document.getElementById('financeAdminAuthPassword');
  const financeAdminAuthError = document.getElementById('financeAdminAuthError');
  const btnToggleFinanceAdminPw = document.getElementById('btnToggleFinanceAdminPw');
  const btnFinanceAdminLogout = document.getElementById('btnFinanceAdminLogout');

  if (btnToggleFinanceAdminPw && financeAdminAuthPassword) {
    btnToggleFinanceAdminPw.addEventListener('click', () => {
      const type = financeAdminAuthPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      financeAdminAuthPassword.setAttribute('type', type);
    });
  }

  if (formFinanceAdminAuth) {
    formFinanceAdminAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = financeAdminAuthPassword ? financeAdminAuthPassword.value.trim() : '';
      if (verifyAdminAccess(entered)) {
        sessionStorage.setItem('atg_admin_unlocked', 'true');
        if (financeAdminAuthError) financeAdminAuthError.style.display = 'none';
        if (financePasswordGate) financePasswordGate.style.display = 'none';
        if (financeUploadFormSection) financeUploadFormSection.style.display = 'block';
        if (financeAdminAuthPassword) financeAdminAuthPassword.value = '';
      } else {
        if (financeAdminAuthError) financeAdminAuthError.style.display = 'block';
        if (financeAdminAuthPassword) {
          financeAdminAuthPassword.value = '';
          financeAdminAuthPassword.focus();
        }
      }
    });
  }

  if (btnFinanceAdminLogout) {
    btnFinanceAdminLogout.addEventListener('click', () => {
      sessionStorage.removeItem('atg_admin_unlocked');
      if (financePasswordGate) financePasswordGate.style.display = 'block';
      if (financeUploadFormSection) financeUploadFormSection.style.display = 'none';
      if (financeAdminAuthPassword) financeAdminAuthPassword.value = '';
    });
  }

  function openUploadModal(shelfCategory) {
    if (!financeUploadModal) return;
    if (shelfCategory && typeof shelfCategory === 'string') {
      const catSelect = document.getElementById('financeDocCategory');
      if (catSelect) catSelect.value = shelfCategory === 'casestudies' ? 'casestudies' : 'assignments';
    }

    const isUnlocked = sessionStorage.getItem('atg_admin_unlocked') === 'true';
    if (isUnlocked) {
      if (financePasswordGate) financePasswordGate.style.display = 'none';
      if (financeUploadFormSection) financeUploadFormSection.style.display = 'block';
    } else {
      if (financePasswordGate) financePasswordGate.style.display = 'block';
      if (financeUploadFormSection) financeUploadFormSection.style.display = 'none';
      if (financeAdminAuthPassword) financeAdminAuthPassword.value = '';
      if (financeAdminAuthError) financeAdminAuthError.style.display = 'none';
      setTimeout(() => financeAdminAuthPassword && financeAdminAuthPassword.focus(), 150);
    }

    financeUploadModal.classList.add('open');
    financeUploadModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeUploadModal() {
    if (!financeUploadModal) return;
    financeUploadModal.classList.remove('open');
    financeUploadModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all trigger buttons on Finance page
  if (navUploadPdfBtn) {
    navUploadPdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openUploadModal('assignments');
    });
  }

  document.querySelectorAll('#shelfFinanceAssignments .btn-shelf-upload, #shelfFinanceCaseStudies .btn-shelf-upload, .btn-shelf-upload[data-shelf], .btn-shelf-upload-empty[data-shelf]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const shelf = btn.getAttribute('data-shelf') || 'assignments';
      openUploadModal(shelf);
    });
  });

  if (financeUploadModalClose) financeUploadModalClose.addEventListener('click', closeUploadModal);
  if (financeUploadModalBackdrop) financeUploadModalBackdrop.addEventListener('click', closeUploadModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pdfModal && pdfModal.classList.contains('open')) closeReader();
      if (financeUploadModal && financeUploadModal.classList.contains('open')) closeUploadModal();
    }
  });

  // PDF File Dropzone & Thumbnail Generator
  async function generateThumbnail(file) {
    if (typeof window.pdfjsLib === 'undefined' || !file) return '';
    if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
    }
    try {
      const renderPromise = (async () => {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        return canvas.toDataURL('image/jpeg', 0.85);
      })();

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(''), 2500));
      return await Promise.race([renderPromise, timeoutPromise]);
    } catch (err) {
      console.warn('Finance PDF thumbnail generation error:', err);
      return '';
    }
  }

  function handleFilesSelected(fileList) {
    const rawFiles = Array.from(fileList || []);
    const files = rawFiles.filter(f => f.type === 'application/pdf' || (f.name && f.name.toLowerCase().endsWith('.pdf')));

    if (files.length === 0) {
      financeSelectedFiles = [];
      financeCoverDataUrl = '';
      if (financeThumbPreviewBox) financeThumbPreviewBox.style.display = 'none';
      if (financeDropText) financeDropText.textContent = 'Click to choose PDF(s)';
      if (financeDropSubText) financeDropSubText.textContent = 'or drag and drop your PDF document(s) here';
      return;
    }

    financeSelectedFiles = files;

    if (files.length === 1) {
      const file = files[0];
      if (financeDropText) {
        financeDropText.innerHTML = `✓ <span style="color: #10b981; font-weight: 700;">${escapeHtml(file.name)}</span>`;
      }
      if (financeDropSubText) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        financeDropSubText.textContent = `${sizeMb} MB • Ready for publication`;
      }

      const titleInput = document.getElementById('financeDocTitle');
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      }

      generateThumbnail(file).then(dataUrl => {
        financeCoverDataUrl = dataUrl;
        if (financeImgThumbnail && financeThumbPreviewBox) {
          if (dataUrl) {
            financeImgThumbnail.src = dataUrl;
            financeThumbPreviewBox.style.display = 'block';
          } else {
            financeThumbPreviewBox.style.display = 'none';
          }
        }
      });
    } else {
      if (financeThumbPreviewBox) financeThumbPreviewBox.style.display = 'none';
      financeCoverDataUrl = '';
      if (financeDropText) {
        financeDropText.innerHTML = `✓ <span style="color: #10b981; font-weight: 800;">${files.length} PDF Documents Selected</span>`;
      }
      const totalMb = (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2);
      if (financeDropSubText) {
        financeDropSubText.textContent = `Total ${totalMb} MB • All documents will appear on the selected shelf`;
      }
    }
  }

  if (financeFileDropzone) {
    ['dragenter', 'dragover'].forEach(name => {
      financeFileDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        financeFileDropzone.style.borderColor = 'var(--gold)';
        financeFileDropzone.style.background = 'rgba(230, 184, 0, 0.08)';
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      financeFileDropzone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        financeFileDropzone.style.borderColor = 'rgba(230, 184, 0, 0.4)';
        financeFileDropzone.style.background = 'rgba(0,0,0,0.25)';
      });
    });

    financeFileDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt && dt.files;
      if (files && files.length > 0) {
        try {
          if (financePdfInput) financePdfInput.files = files;
        } catch (_) {}
        handleFilesSelected(files);
      } else {
        alert('Please drop valid PDF files.');
      }
    });
  }

  if (financePdfInput) {
    financePdfInput.addEventListener('change', (e) => {
      handleFilesSelected(e.target.files);
    });
  }

  // Exact Dashed Empty State HTML Generator (Matching User's Screenshot)
  function getEmptyShelfHtml(category) {
    return `
      <div class="lib-shelf-empty" data-shelf="${category}">
        <div class="empty-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        </div>
        <div class="empty-text">
          <h4>No documents uploaded yet</h4>
          <p>Upload your own PDF document to this shelf.</p>
        </div>
        <button type="button" class="btn-shelf-upload-empty" data-shelf="${category}">+ Upload PDF</button>
      </div>
    `;
  }

  // Shelf Card HTML Generator
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
          <img src="${item.coverDataUrl}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `;
    } else {
      let gradClass = item.category === 'casestudies' ? 'emerald-grad' : 'money-dada-grad';
      thumbHtml = `
        <div class="lib-shelf-thumb-wrap">
          <div class="shelf-thumb-gradient ${gradClass}">
            <div class="news-masthead">${escapeHtml(item.subject || 'MBA FINANCE')}</div>
            <div class="news-lead">${escapeHtml(item.title)}</div>
            <div class="news-sub-banner">${escapeHtml(item.author || 'AsifTechGlobal Edition')}</div>
          </div>
        </div>
      `;
    }

    let blobUrl = '#';
    if (financeActiveBlobUrls.has(item.id)) {
      blobUrl = financeActiveBlobUrls.get(item.id);
    } else if (item.pdfBlob) {
      blobUrl = URL.createObjectURL(item.pdfBlob);
      financeActiveBlobUrls.set(item.id, blobUrl);
    }

    const downloadName = item.fileName || `${(item.title || 'Document').replace(/\s+/g, '_')}.pdf`;

    return `
      <div class="lib-card-shelf" data-id="${item.id}" data-category="${item.category}" data-title="${escapeHtml(item.title)}">
        ${ribbonHtml}
        ${thumbHtml}
        <div class="lib-shelf-card-info">
          <h3 class="shelf-card-name" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          <p class="shelf-card-publisher" title="${escapeHtml(item.author)}">${escapeHtml(item.author || 'MBA Finance 2026')}</p>
          <div class="shelf-card-actions">
            <button type="button" class="btn-read-shelf btn-read-fin-card" data-id="${item.id}" data-title="${escapeHtml(item.title)}" data-filename="${escapeHtml(downloadName)}">Read</button>
            <a href="${blobUrl}" download="${escapeHtml(downloadName)}" class="btn-dl-shelf" title="Download Document">PDF</a>
            <button type="button" class="btn-del-shelf btn-del-fin-card" data-id="${item.id}" data-title="${escapeHtml(item.title)}" title="Delete Document">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  let cachedFinanceDocs = [];

  async function renderFinanceShelves() {
    try {
      cachedFinanceDocs = await getFinanceAssignmentsDB();
      cachedFinanceDocs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      const shelves = [
        { key: 'assignments', trackId: 'financeAssignmentsTrack' },
        { key: 'casestudies', trackId: 'financeCaseStudiesTrack' }
      ];

      shelves.forEach(({ key, trackId }) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const items = cachedFinanceDocs.filter(d => (d.category || 'assignments') === key);
        if (items.length === 0) {
          track.innerHTML = getEmptyShelfHtml(key);
        } else {
          track.innerHTML = items.map(item => createShelfCardHtml(item)).join('');
        }
      });

      bindFinanceShelfEvents();
    } catch (err) {
      console.error('Failed to render finance shelves:', err);
    }
  }

  function bindFinanceShelfEvents() {
    // Read button
    document.querySelectorAll('.btn-read-fin-card').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'Document';
        const filename = btn.getAttribute('data-filename') || 'Document.pdf';
        const item = cachedFinanceDocs.find(a => a.id === id);
        if (item) {
          let url = financeActiveBlobUrls.get(id);
          if (!url && item.pdfBlob) {
            url = URL.createObjectURL(item.pdfBlob);
            financeActiveBlobUrls.set(id, url);
          }
          openReader(url, title, filename);
        }
      };
    });

    // Delete button (Protected by Administrator Password)
    document.querySelectorAll('.btn-del-fin-card').forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'this document';

        const isUnlocked = sessionStorage.getItem('atg_admin_unlocked') === 'true';
        if (!isUnlocked) {
          const enteredPw = prompt('Administrator Verification: Enter master password to delete this document:');
          if (enteredPw === null) return;
          if (verifyAdminAccess(enteredPw)) {
            sessionStorage.setItem('atg_admin_unlocked', 'true');
          } else {
            alert('Incorrect administrator password! Delete access denied.');
            return;
          }
        }

        if (confirm(`Are you sure you want to delete "${title}"?`)) {
          try {
            await deleteFinanceAssignmentDB(id);
            if (financeActiveBlobUrls.has(id)) {
              URL.revokeObjectURL(financeActiveBlobUrls.get(id));
              financeActiveBlobUrls.delete(id);
            }
            await renderFinanceShelves();
          } catch (err) {
            console.error('Failed to delete finance document:', err);
            alert('Could not delete document: ' + err.message);
          }
        }
      };
    });

    // Shelf upload buttons & empty buttons
    document.querySelectorAll('#shelfFinanceAssignments .btn-shelf-upload, #shelfFinanceCaseStudies .btn-shelf-upload, #shelfFinanceAssignments .btn-shelf-upload-empty, #shelfFinanceCaseStudies .btn-shelf-upload-empty').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const shelf = btn.getAttribute('data-shelf') || 'assignments';
        openUploadModal(shelf);
      };
    });
  }

  // Form Submit Handler (Single or Unlimited Batch)
  if (formUploadFinanceAssignment) {
    formUploadFinanceAssignment.addEventListener('submit', async (e) => {
      e.preventDefault();

      const filesToUpload = financeSelectedFiles.length > 0 ? financeSelectedFiles : (financePdfInput && financePdfInput.files ? Array.from(financePdfInput.files) : []);

      if (filesToUpload.length === 0) {
        alert('Please select at least one PDF file to upload.');
        return;
      }

      const targetCategory = document.getElementById('financeDocCategory')?.value || 'assignments';
      const singleTitle = document.getElementById('financeDocTitle')?.value.trim();
      const subject = document.getElementById('financeDocSubject')?.value || 'Corporate Finance';
      const author = document.getElementById('financeDocAuthor')?.value.trim() || 'MBA Finance 2026';
      const ribbon = document.getElementById('financeDocRibbon')?.value || 'popular';

      if (btnSubmitFinanceAssignment) {
        btnSubmitFinanceAssignment.disabled = true;
      }

      try {
        for (let i = 0; i < filesToUpload.length; i++) {
          const file = filesToUpload[i];
          if (btnSubmitFinanceAssignment) {
            btnSubmitFinanceAssignment.textContent = `Publishing ${i + 1} of ${filesToUpload.length}...`;
          }

          let fileTitle = '';
          if (filesToUpload.length === 1 && singleTitle) {
            fileTitle = singleTitle;
          } else {
            fileTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          }

          let coverUrl = '';
          if (filesToUpload.length === 1 && financeCoverDataUrl) {
            coverUrl = financeCoverDataUrl;
          } else {
            coverUrl = await generateThumbnail(file);
          }

          const item = {
            id: 'fin_doc_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
            category: targetCategory,
            title: fileTitle,
            subject: subject,
            author: author,
            ribbon: ribbon,
            coverDataUrl: coverUrl,
            pdfBlob: file,
            fileName: file.name,
            fileSize: file.size,
            dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            // Sequential timestamps so items cascade neatly from left to right
            timestamp: new Date(Date.now() + (filesToUpload.length - i) * 100).toISOString()
          };

          await saveFinanceAssignmentDB(item);
        }

        await renderFinanceShelves();

        closeUploadModal();
        formUploadFinanceAssignment.reset();
        financeSelectedFiles = [];
        financeCoverDataUrl = '';
        if (financeThumbPreviewBox) financeThumbPreviewBox.style.display = 'none';
        if (financeDropText) financeDropText.textContent = 'Click to choose PDF(s)';
        if (financeDropSubText) financeDropSubText.textContent = 'or drag and drop your PDF document(s) here';

        const targetShelfEl = document.getElementById(targetCategory === 'casestudies' ? 'shelfFinanceCaseStudies' : 'shelfFinanceAssignments');
        if (targetShelfEl) {
          targetShelfEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const trackContainer = targetShelfEl.querySelector('.lib-shelf-track-container');
          if (trackContainer) {
            trackContainer.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }

      } catch (err) {
        console.error('Failed to save finance document:', err);
        alert('Could not save document: ' + err.message);
      } finally {
        if (btnSubmitFinanceAssignment) {
          btnSubmitFinanceAssignment.disabled = false;
          btnSubmitFinanceAssignment.textContent = 'Publish Document to Vault';
        }
      }
    });
  }

  // Initial Render of both shelves
  renderFinanceShelves();
}

// --------------------------------------------------------------------------
// ATG Digital Knowledge Library Module
// High-Capacity IndexedDB Persistence, Real PDF Uploads, PDF.js Auto Thumbnails,
// Instant Reader Modal, Direct File Downloads, and User File Management.
// --------------------------------------------------------------------------


if (typeof window !== 'undefined') {
  window.initPayrollCalculator = initPayrollCalculator;
  window.initHrPdfModule = initHrPdfModule;
  window.initFinancePdfModule = initFinancePdfModule;
}
