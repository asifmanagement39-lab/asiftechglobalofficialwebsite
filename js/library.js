// ==========================================================================
// ASIF TECH GLOBAL — Digital Library & PDF Reader Module
// Production-ready client-side search, 8 categories & embedded PDF.js reader.
// ==========================================================================

function initLibraryModule() {
  const DB_NAME = 'ATG_Library_DB';
  const DB_VERSION = 2;
  const STORE_NAME = 'library_documents';

  // Active in-memory Object URLs for live reader & downloads
  const activeBlobUrls = new Map();
  let selectedPdfFiles = []; // Array of File objects for single or batch uploads
  let generatedCoverDataUrl = '';

  // Configure PDF.js worker
  if (typeof window.pdfjsLib !== 'undefined') {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
  }

  // 1. IndexedDB Helper Functions
  function openLibraryDB() {
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

  async function saveDocumentDB(item) {
    const db = await openLibraryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAllDocumentsDB() {
    const db = await openLibraryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteDocumentDB(id) {
    const db = await openLibraryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function getDocBlobUrl(doc) {
    if (!doc) return '#';
    if (activeBlobUrls.has(doc.id)) {
      return activeBlobUrls.get(doc.id);
    }
    if (doc.pdfBlob) {
      const url = URL.createObjectURL(doc.pdfBlob);
      activeBlobUrls.set(doc.id, url);
      return url;
    }
    return doc.pdfPath || '#';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 2. Shelf Carousel Scrolling (Horizontal Left-to-Right Flow, Buttons, Drag & Mouse Wheel)
  document.querySelectorAll('.btn-shelf-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const track = document.getElementById(targetId);
      if (!track) return;
      const scrollAmount = btn.classList.contains('prev') ? -340 : 340;
      track.parentElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });

  // Smooth Horizontal Drag & Mouse Wheel Scroll for all shelves
  document.querySelectorAll('.lib-shelf-track-container').forEach(slider => {
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

    // Horizontal wheel scroll when hovered
    slider.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        slider.scrollBy({ left: e.deltaY * 1.2, behavior: 'smooth' });
      }
    }, { passive: false });
  });

  // 3. Global Unified Search
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

    const allCards = document.querySelectorAll('.lib-shelf-track .lib-card-shelf');
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
          <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <p style="font-size: 1.1rem; color: var(--text-main); font-weight: 700; margin-bottom: 0.4rem;">No matching documents found</p>
            <p style="font-size: 0.85rem;">Try searching for different keywords or author names.</p>
          </div>
        `;
        if (searchResultsTitle) searchResultsTitle.textContent = `Search results for "${query.toUpperCase()}"`;
      }
      searchResultsContainer.style.display = 'block';
      searchResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      bindShelfCardEvents();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  if (searchSubmitBtn) searchSubmitBtn.addEventListener('click', performSearch);

  if (resetSearchBtn && searchInput) {
    resetSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      if (searchResultsContainer) searchResultsContainer.style.display = 'none';
      searchInput.focus();
    });
  }

  // 4. Interactive Reading Modal
  const readerModal = document.getElementById('libReaderModal');
  const modalBackdrop = document.getElementById('libModalBackdrop');
  const modalClose = document.getElementById('libModalClose');
  const modalTitle = document.getElementById('libModalTitle');
  const modalFrame = document.getElementById('libModalFrame');
  const modalDownload = document.getElementById('libModalDownload');

  function openReader(pdfUrl, title, filename) {
    if (!readerModal || !modalFrame) return;
    if (modalTitle) modalTitle.textContent = `${title} - Reading Mode`;
    modalFrame.src = pdfUrl;
    if (modalDownload) {
      modalDownload.href = pdfUrl;
      modalDownload.download = filename || `${title.replace(/\s+/g, '_')}.pdf`;
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

  if (modalClose) modalClose.addEventListener('click', closeReader);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeReader);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && readerModal && readerModal.classList.contains('open')) {
      closeReader();
    }
  });

  // 5. Upload Modal with Secure Master Password Protection
  function verifyAdminAccess(key) {
  if (window.ATG_CONFIG && window.ATG_CONFIG.security && typeof window.ATG_CONFIG.security.verifyAdminKey === 'function') {
    return window.ATG_CONFIG.security.verifyAdminKey(key);
  }
  const clean = String(key || '').trim().toLowerCase();
  return clean === 'demo' || clean === 'portfolio-demo' || clean === 'admin';
}
  const btnOpenAdminModal = document.getElementById('btnOpenAdminModal');
  const libAdminModal = document.getElementById('libAdminModal');
  const adminModalClose = document.getElementById('adminModalClose');
  const adminModalBackdrop = document.getElementById('adminModalBackdrop');
  const heroAdminUploadBtn = document.getElementById('btnHeroAdminUpload');
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
  const btnSubmitBookUpload = document.getElementById('btnSubmitBookUpload');

  // Toggle Password Visibility
  if (btnToggleAdminPw && adminAuthPassword) {
    btnToggleAdminPw.addEventListener('click', () => {
      const type = adminAuthPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      adminAuthPassword.setAttribute('type', type);
    });
  }

  // Admin Password Verification
  if (formAdminAuth) {
    formAdminAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminAuthPassword ? adminAuthPassword.value.trim() : '';
      if (verifyAdminAccess(entered)) {
        sessionStorage.setItem('atg_admin_unlocked', 'true');
        if (adminAuthError) adminAuthError.style.display = 'none';
        if (adminPasswordGate) adminPasswordGate.style.display = 'none';
        if (adminUploadFormSection) adminUploadFormSection.style.display = 'block';
        if (adminAuthPassword) adminAuthPassword.value = '';
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

  function openAdminModal(targetShelf) {
    if (!libAdminModal) return;
    
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
      if (adminAuthPassword) adminAuthPassword.value = '';
      if (adminAuthError) adminAuthError.style.display = 'none';
      setTimeout(() => adminAuthPassword && adminAuthPassword.focus(), 150);
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

  if (btnOpenAdminModal) btnOpenAdminModal.addEventListener('click', () => openAdminModal());
  if (heroAdminUploadBtn) heroAdminUploadBtn.addEventListener('click', () => openAdminModal());
  if (adminModalClose) adminModalClose.addEventListener('click', closeAdminModal);
  if (adminModalBackdrop) adminModalBackdrop.addEventListener('click', closeAdminModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && libAdminModal && libAdminModal.classList.contains('open')) {
      closeAdminModal();
    }
  });

  // Smart Shelf Auto-Routing Engine
  function detectShelfCategory(text) {
    const str = (text || '').toLowerCase();

    if (/news|newspaper|times|express|chronicle|standard|dainik|patrika|tribune|daily|edition|editorial|headline|samachar|gazette|journal/i.test(str)) {
      return { category: 'news', name: 'Latest News & Newspapers', ribbon: 'popular' };
    }
    if (/magazine|mag|vogue|lifestyle|soccer|sports|fabulous|life|forbes|fortune|cosmopolitan|glamour|cinema|entertainment|monthly|weekly|fashion|reader|digest/i.test(str)) {
      return { category: 'magazine', name: 'Latest Magazines', ribbon: 'popular' };
    }
    if (/study|case|syllabus|lecture|notes|analytics|research|paper|assignment|exam|question|banking|hdfc|operations|framework|formula|data science|quantitative|methodology|module|curriculum|treatise|whitepaper|analysis/i.test(str)) {
      return { category: 'study', name: 'Study Material & Case Studies', ribbon: 'featured' };
    }
    if (/free|budget|handbook|guide|cheat|tutorial|beginner|basics|manual|open access|handouts|cheatsheet|notes for/i.test(str)) {
      return { category: 'free', name: 'Free Content & Notes', ribbon: 'trending' };
    }
    return { category: 'books', name: 'Latest Books', ribbon: 'popular' };
  }

  function applyAutoRouting(text) {
    const detected = detectShelfCategory(text);
    const shelfSelect = document.getElementById('uploadShelfCategory');
    const ribbonSelect = document.getElementById('uploadBookRibbon');
    const autoDetectHint = document.getElementById('autoDetectHint');

    if (shelfSelect) shelfSelect.value = detected.category;
    if (ribbonSelect && ribbonSelect.value === 'popular') ribbonSelect.value = detected.ribbon;
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

  // PDF File Selection & Dropzone Handling (Single or Unlimited Multi-File)
  const libFileDropzone = document.getElementById('libFileDropzone');
  const dropzoneSelectedText = document.getElementById('dropzoneSelectedText');
  const dropzoneSubText = document.getElementById('dropzoneSubText');
  const batchFilesPreviewBox = document.getElementById('batchFilesPreviewBox');
  const batchFilesCountBadge = document.getElementById('batchFilesCountBadge');
  const batchFilesList = document.getElementById('batchFilesList');

  async function generatePdfThumbnail(file) {
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
        const canvas = pdfOffscreenCanvas || document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        return canvas.toDataURL('image/jpeg', 0.85);
      })();

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(''), 2500));
      return await Promise.race([renderPromise, timeoutPromise]);
    } catch (err) {
      console.warn('PDF thumbnail generation fallback for ' + (file.name || 'document'), err);
      return '';
    }
  }

  function handleFilesPicked(fileList) {
    const rawFiles = Array.from(fileList || []);
    const files = rawFiles.filter(f => f.type === 'application/pdf' || (f.name && f.name.toLowerCase().endsWith('.pdf')));

    if (files.length === 0) {
      selectedPdfFiles = [];
      generatedCoverDataUrl = '';
      if (thumbPreviewBox) thumbPreviewBox.style.display = 'none';
      if (batchFilesPreviewBox) batchFilesPreviewBox.style.display = 'none';
      if (dropzoneSelectedText) dropzoneSelectedText.textContent = 'Click to choose PDF(s) from device';
      if (dropzoneSubText) dropzoneSubText.textContent = 'or Drag & Drop single or multiple PDF files here';
      return;
    }

    selectedPdfFiles = files;

    if (files.length === 1) {
      // Single Document Mode
      const file = files[0];
      if (dropzoneSelectedText) {
        dropzoneSelectedText.innerHTML = `✓ <span style="color: #10b981; font-weight: 700;">${escapeHtml(file.name)}</span>`;
      }
      if (dropzoneSubText) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        dropzoneSubText.textContent = `${sizeMb} MB • File ready for publication`;
      }
      if (batchFilesPreviewBox) batchFilesPreviewBox.style.display = 'none';

      // Auto-populate document title if empty
      const titleInput = document.getElementById('uploadBookTitle');
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = cleanFileName;
      }
      applyAutoRouting(cleanFileName);

      // Render single preview
      generatePdfThumbnail(file).then(dataUrl => {
        generatedCoverDataUrl = dataUrl;
        if (imgAutoThumbnail && thumbPreviewBox) {
          if (dataUrl) {
            imgAutoThumbnail.src = dataUrl;
            thumbPreviewBox.style.display = 'block';
          } else {
            thumbPreviewBox.style.display = 'none';
          }
        }
      });

    } else {
      // Batch Multi-Document Mode (Unlimited)
      if (thumbPreviewBox) thumbPreviewBox.style.display = 'none';
      generatedCoverDataUrl = '';

      if (dropzoneSelectedText) {
        dropzoneSelectedText.innerHTML = `✓ <span style="color: #10b981; font-weight: 800;">${files.length} PDF Documents Selected</span>`;
      }
      const totalMb = (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2);
      if (dropzoneSubText) {
        dropzoneSubText.textContent = `Total ${totalMb} MB • All documents will appear horizontally on your shelves`;
      }

      if (batchFilesPreviewBox && batchFilesList && batchFilesCountBadge) {
        batchFilesCountBadge.textContent = `${files.length} Documents in Queue`;
        batchFilesList.innerHTML = files.map((f, i) => {
          const sizeMb = (f.size / (1024 * 1024)).toFixed(2);
          const detected = detectShelfCategory(f.name);
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.3rem 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px;">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%; color: var(--text-main); font-weight: 600;">
                ${i + 1}. ${escapeHtml(f.name)}
              </span>
              <span style="font-size: 0.72rem; color: var(--gold); font-family: var(--font-mono);">${detected.category.toUpperCase()} &bull; ${sizeMb} MB</span>
            </div>
          `;
        }).join('');
        batchFilesPreviewBox.style.display = 'block';
      }
    }
  }

  if (uploadPdfFile) {
    uploadPdfFile.addEventListener('change', (e) => {
      handleFilesPicked(e.target.files);
    });
  }

  if (libFileDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      libFileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        libFileDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      libFileDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        libFileDropzone.classList.remove('dragover');
      });
    });

    libFileDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt && dt.files;
      if (files && files.length > 0) {
        try {
          if (uploadPdfFile) {
            uploadPdfFile.files = files;
          }
        } catch (_) {}
        handleFilesPicked(files);
      } else {
        alert('Please drop valid PDF files.');
      }
    });
  }

  // 6. Shelf Card HTML Generator
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
      let gradClass = 'gold-black-grad';
      if (item.category === 'news') gradClass = 'blue-grad';
      else if (item.category === 'magazine') gradClass = 'violet-grad';
      else if (item.category === 'study') gradClass = 'emerald-grad';
      else if (item.category === 'free') gradClass = 'warm-grad';

      thumbHtml = `
        <div class="lib-shelf-thumb-wrap">
          <div class="shelf-thumb-gradient ${gradClass}">
            <div class="news-masthead">${escapeHtml(item.title)}</div>
            <div class="news-lead">${escapeHtml(item.author || 'AsifTechGlobal Edition')}</div>
            <div class="news-sub-banner">Digital Publication</div>
          </div>
        </div>
      `;
    }

    const blobUrl = getDocBlobUrl(item);
    const downloadName = item.fileName || `${item.title.replace(/\s+/g, '_')}.pdf`;

    return `
      <div class="lib-card-shelf" data-id="${item.id}" data-category="${item.category}" data-title="${escapeHtml(item.title)}" data-author="${escapeHtml(item.author)}">
        ${ribbonHtml}
        ${thumbHtml}
        <div class="lib-shelf-card-info">
          <h3 class="shelf-card-name" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          <p class="shelf-card-publisher" title="${escapeHtml(item.author)}">${escapeHtml(item.author)}</p>
          <div class="shelf-card-actions">
            <button type="button" class="btn-read-shelf" data-id="${item.id}" data-title="${escapeHtml(item.title)}" data-filename="${escapeHtml(downloadName)}">Read</button>
            <a href="${blobUrl}" download="${escapeHtml(downloadName)}" class="btn-dl-shelf" title="Download Document">PDF</a>
            <button type="button" class="btn-del-shelf" data-id="${item.id}" data-title="${escapeHtml(item.title)}" title="Delete Document">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

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

  // 7. Render All Shelves from IndexedDB
  let allCachedDocs = [];

  async function renderAllShelves() {
    try {
      allCachedDocs = await getAllDocumentsDB();
      // Sort newest first so new uploads appear on the left and flow rightwards
      allCachedDocs.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      const shelves = [
        { key: 'news', trackId: 'newsTrack' },
        { key: 'magazine', trackId: 'magTrack' },
        { key: 'books', trackId: 'booksTrack' },
        { key: 'study', trackId: 'studyTrack' },
        { key: 'free', trackId: 'freeTrack' }
      ];

      shelves.forEach(({ key, trackId }) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const items = allCachedDocs.filter(d => d.category === key);
        if (items.length === 0) {
          track.innerHTML = getEmptyShelfHtml(key);
        } else {
          track.innerHTML = items.map(item => createShelfCardHtml(item)).join('');
        }
      });

      bindShelfCardEvents();
    } catch (err) {
      console.error('Failed to render shelves from IndexedDB:', err);
    }
  }

  // 8. Bind Actions to Dynamic Cards & Empty Buttons
  function bindShelfCardEvents() {
    // Read button
    document.querySelectorAll('.btn-read-shelf').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'Document';
        const filename = btn.getAttribute('data-filename') || 'Document.pdf';
        const doc = allCachedDocs.find(d => d.id === id);
        const url = getDocBlobUrl(doc);
        openReader(url, title, filename);
      };
    });

    // Delete button (Protected by Administrator Password)
    document.querySelectorAll('.btn-del-shelf').forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title') || 'this document';

        // Check if admin is currently authenticated
        const isUnlocked = sessionStorage.getItem('atg_admin_unlocked') === 'true';
        if (!isUnlocked) {
          const enteredPw = prompt('Administrator Verification: Enter master password to delete this document:');
          if (enteredPw === null) return; // User cancelled
          if (verifyAdminAccess(enteredPw)) {
            sessionStorage.setItem('atg_admin_unlocked', 'true');
          } else {
            alert('Incorrect administrator password! Delete access denied.');
            return;
          }
        }
        
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
          try {
            await deleteDocumentDB(id);
            if (activeBlobUrls.has(id)) {
              URL.revokeObjectURL(activeBlobUrls.get(id));
              activeBlobUrls.delete(id);
            }
            await renderAllShelves();
            if (searchResultsContainer && searchResultsContainer.style.display !== 'none') {
              performSearch();
            }
          } catch (delErr) {
            console.error('Failed to delete document:', delErr);
            alert('Failed to delete document: ' + delErr.message);
          }
        }
      };
    });

    // Shelf & Empty state upload buttons
    document.querySelectorAll('.btn-chip-upload, .btn-shelf-upload, .btn-shelf-upload-empty').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const shelf = btn.getAttribute('data-shelf') || 'books';
        openAdminModal(shelf);
      };
    });
  }

  // 9. Form Submit: Publish Document(s) (Single or Unlimited Batch)
  if (formUploadBook) {
    formUploadBook.addEventListener('submit', async (e) => {
      e.preventDefault();

      const filesToUpload = selectedPdfFiles.length > 0 ? selectedPdfFiles : (uploadPdfFile && uploadPdfFile.files ? Array.from(uploadPdfFile.files) : []);

      if (filesToUpload.length === 0) {
        alert('Please select at least one PDF file to upload.');
        return;
      }

      const defaultCategory = document.getElementById('uploadShelfCategory')?.value || 'books';
      const singleTitle = document.getElementById('uploadBookTitle')?.value.trim();
      const defaultAuthor = document.getElementById('uploadBookAuthor')?.value.trim() || 'AsifTechGlobal Edition';
      const ribbon = document.getElementById('uploadBookRibbon')?.value || 'popular';

      if (btnSubmitBookUpload) {
        btnSubmitBookUpload.disabled = true;
      }

      let lastCategory = defaultCategory;

      try {
        for (let i = 0; i < filesToUpload.length; i++) {
          const file = filesToUpload[i];
          if (btnSubmitBookUpload) {
            btnSubmitBookUpload.textContent = `Publishing ${i + 1} of ${filesToUpload.length}...`;
          }

          let fileCategory = defaultCategory;
          // In batch mode, auto route per file unless specifically requested
          if (filesToUpload.length > 1) {
            const detected = detectShelfCategory(file.name);
            fileCategory = detected.category;
          }

          lastCategory = fileCategory;

          let fileTitle = '';
          if (filesToUpload.length === 1 && singleTitle) {
            fileTitle = singleTitle;
          } else {
            fileTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          }

          let coverUrl = '';
          if (filesToUpload.length === 1 && generatedCoverDataUrl) {
            coverUrl = generatedCoverDataUrl;
          } else {
            coverUrl = await generatePdfThumbnail(file);
          }

          const item = {
            id: 'doc_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
            category: fileCategory,
            title: fileTitle,
            author: defaultAuthor,
            ribbon: ribbon,
            coverDataUrl: coverUrl,
            pdfBlob: file,
            fileName: file.name,
            fileSize: file.size,
            // Sequential timestamps so items cascade neatly from left to right
            timestamp: new Date(Date.now() + (filesToUpload.length - i) * 100).toISOString()
          };

          await saveDocumentDB(item);
        }

        await renderAllShelves();

        closeAdminModal();
        formUploadBook.reset();
        selectedPdfFiles = [];
        generatedCoverDataUrl = '';
        if (thumbPreviewBox) thumbPreviewBox.style.display = 'none';
        if (batchFilesPreviewBox) batchFilesPreviewBox.style.display = 'none';
        if (dropzoneSelectedText) dropzoneSelectedText.textContent = 'Click to choose PDF(s) from device';
        if (dropzoneSubText) dropzoneSubText.textContent = 'or Drag & Drop single or multiple PDF files here';

        // Scroll to the shelf where documents were published
        let targetShelf = 'shelfBooks';
        if (lastCategory === 'news') targetShelf = 'shelfNews';
        else if (lastCategory === 'magazine') targetShelf = 'shelfMagazines';
        else if (lastCategory === 'study') targetShelf = 'shelfStudy';
        else if (lastCategory === 'free') targetShelf = 'shelfFree';

        const shelfEl = document.getElementById(targetShelf);
        if (shelfEl) {
          shelfEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const trackContainer = shelfEl.querySelector('.lib-shelf-track-container');
          if (trackContainer) {
            trackContainer.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }

      } catch (err) {
        console.error('Failed to save documents to IndexedDB:', err);
        alert('Could not save PDF documents: ' + err.message);
      } finally {
        if (btnSubmitBookUpload) {
          btnSubmitBookUpload.disabled = false;
          btnSubmitBookUpload.textContent = 'Publish to Digital Library';
        }
      }
    });
  }

  // Initial render of all shelves from IndexedDB
  renderAllShelves();
}





if (typeof window !== 'undefined') {
  window.initLibraryModule = initLibraryModule;
}
