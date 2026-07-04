/**
 * =======================================================
 * PORTFOLIO CERTIFICATES VIEWER LOGIC - certificates.js
 * =======================================================
 * Handles interactive library bookshelf pulling mechanisms,
 * search filters, and asynchronous PDF.js canvas rendering.
 */

document.addEventListener('DOMContentLoaded', () => {

  const bookSpines = document.querySelectorAll('.book-spine-card');

  // 2. Bookshelf "Pulling" Logic and Reading Desk Previewer
  const deskTitle = document.getElementById('deskTitle');
  const deskOrg = document.getElementById('deskOrg');
  const deskDate = document.getElementById('deskDate');
  const deskDownload = document.getElementById('deskDownload');
  const deskPreview = document.getElementById('deskPreview');
  const deskSpinner = document.getElementById('deskSpinner');

  if (!deskPreview) return;

  // Initialize PDF.js worker
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  const renderFallbackIframe = (fileUrl, title) => {
    if (deskSpinner) deskSpinner.style.display = 'none';
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      deskPreview.innerHTML = `
        <div class="mobile-pdf-prompt" style="color: var(--text-main); text-align: center; padding: 20px;">
          <span class="prompt-icon" style="font-size: 2.5rem;">📄</span>
          <h4 style="margin-top: 10px; font-family: var(--font-display); font-weight: 700;">PDF Verification</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">PDF previewing is restricted on mobile. Pull the document to read.</p>
          <a href="${fileUrl}" target="_blank" class="btn-primary" style="margin-top: 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; width: auto; font-size: 0.8rem; padding: 8px 16px;">Open PDF</a>
        </div>
      `;
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
      iframe.title = title;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      deskPreview.innerHTML = '';
      deskPreview.appendChild(iframe);
    }
  };

  const pullBook = (book) => {
    // 1. Manage pulling classes
    bookSpines.forEach(b => b.classList.remove('pulled'));
    book.classList.add('pulled');

    const fileUrl = book.dataset.file;
    const title = book.dataset.title || 'Verified Certificate';
    const org = book.dataset.org || 'Credential';
    const date = book.dataset.date || '';
    const isImage = fileUrl.endsWith('.png') || fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg');

    // 2. Update Reading Desk Metadata
    if (deskTitle) deskTitle.textContent = title;
    if (deskOrg) {
      deskOrg.textContent = org;
      deskOrg.style.display = 'inline-block';
    }
    if (deskDate) deskDate.textContent = date;
    if (deskDownload) {
      deskDownload.href = fileUrl;
      deskDownload.style.display = 'inline-flex';
    }

    // 3. Clear and show spinner
    deskPreview.innerHTML = '';
    if (deskSpinner) deskSpinner.style.display = 'block';

    if (isImage) {
      const img = document.createElement('img');
      img.src = fileUrl;
      img.alt = title;
      img.style.maxWidth = '95%';
      img.style.maxHeight = '95%';
      img.style.objectFit = 'contain';
      img.onload = () => {
        if (deskSpinner) deskSpinner.style.display = 'none';
      };
      deskPreview.appendChild(img);
    } else {
      // PDF document preview loading
      if (typeof pdfjsLib !== 'undefined') {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        loadingTask.promise.then(pdf => {
          pdf.getPage(1).then(page => {
            const containerWidth = deskPreview.clientWidth || 300;
            const containerHeight = deskPreview.clientHeight || 280;

            const unscaledViewport = page.getViewport({ scale: 1.0 });
            const scaleWidth = containerWidth / unscaledViewport.width;
            const scaleHeight = containerHeight / unscaledViewport.height;
            const scale = Math.min(scaleWidth, scaleHeight) * 0.92;

            const scaledViewport = page.getViewport({ scale: scale || 1.0 });

            const canvas = document.createElement('canvas');
            canvas.style.display = 'block';
            canvas.style.margin = 'auto';
            canvas.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
            canvas.style.borderRadius = '4px';
            canvas.style.border = '1px solid var(--border)';

            const pixelRatio = window.devicePixelRatio || 1;
            canvas.width = scaledViewport.width * pixelRatio;
            canvas.height = scaledViewport.height * pixelRatio;
            canvas.style.width = `${scaledViewport.width}px`;
            canvas.style.height = `${scaledViewport.height}px`;

            const context = canvas.getContext('2d');
            context.scale(pixelRatio, pixelRatio);

            deskPreview.innerHTML = '';
            deskPreview.appendChild(canvas);

            const renderContext = {
              canvasContext: context,
              viewport: scaledViewport
            };

            page.render(renderContext).promise.then(() => {
              if (deskSpinner) deskSpinner.style.display = 'none';
            });
          });
        }).catch(err => {
          console.warn("CORS/file protocol block on PDF.js load. Using iframe fallback.", err);
          renderFallbackIframe(fileUrl, title);
        });
      } else {
        renderFallbackIframe(fileUrl, title);
      }
    }
  };

  // Attach event listeners to spines
  bookSpines.forEach(book => {
    book.addEventListener('click', () => pullBook(book));
  });

  // Pull first book by default to populate reader desk
  if (bookSpines.length > 0) {
    pullBook(bookSpines[0]);
  }
});
