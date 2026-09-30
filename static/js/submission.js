/**
 * ICBDTT-2026 : Paper Submission Helper JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  initFileUploadZone();
  initAbstractWordCounter();
  initCoAuthorsManager();
});

// 1. File Upload Drag & Drop & Validation
function initFileUploadZone() {
  const dropzone = document.getElementById('paper-dropzone');
  const fileInput = document.getElementById('paper_file');
  const preview = document.getElementById('file-preview');
  const filenameDisplay = document.getElementById('filename-display');
  const filesizeDisplay = document.getElementById('filesize-display');

  if (!dropzone || !fileInput) return;

  const allowedExts = ['pdf', 'doc', 'docx'];
  const maxBytes = 16 * 1024 * 1024; // 16MB

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(ext)) {
      alert('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      fileInput.value = '';
      if (preview) preview.style.display = 'none';
      return;
    }

    if (file.size > maxBytes) {
      alert('File size exceeds the 16 MB limit. Please compress or optimize your document.');
      fileInput.value = '';
      if (preview) preview.style.display = 'none';
      return;
    }

    if (preview && filenameDisplay && filesizeDisplay) {
      filenameDisplay.textContent = file.name;
      const sizeStr = file.size < 1024 * 1024
        ? (file.size / 1024).toFixed(1) + ' KB'
        : (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      filesizeDisplay.textContent = sizeStr;
      preview.style.display = 'block';
    }
  }
}

// 2. Abstract Live Word Counter
function initAbstractWordCounter() {
  const abstractInput = document.getElementById('abstract');
  const countDisplay = document.getElementById('abstract-word-count');
  const minWarning = document.getElementById('abstract-min-warn');

  if (!abstractInput || !countDisplay) return;

  function updateWordCount() {
    const text = abstractInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    countDisplay.textContent = `${words} words`;

    if (words < 30) {
      countDisplay.style.color = '#dc2626';
      if (minWarning) minWarning.style.display = 'inline';
    } else {
      countDisplay.style.color = '#059669';
      if (minWarning) minWarning.style.display = 'none';
    }
  }

  abstractInput.addEventListener('input', updateWordCount);
  updateWordCount();
}

// 3. Dynamic Co-Authors Management
function initCoAuthorsManager() {
  const addBtn = document.getElementById('add-coauthor-btn');
  const container = document.getElementById('coauthors-container');
  const countInput = document.getElementById('author_count');

  if (!addBtn || !container) return;

  let coAuthorIndex = 1;

  addBtn.addEventListener('click', () => {
    coAuthorIndex++;
    const row = document.createElement('div');
    row.className = 'coauthor-row';
    row.style.background = '#f8fafc';
    row.style.border = '1px solid #e2e8f0';
    row.style.borderRadius = '8px';
    row.style.padding = '16px';
    row.style.marginBottom = '12px';
    row.style.position = 'relative';

    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <strong style="color:#001040; font-size:0.9rem;">Co-Author #${coAuthorIndex}</strong>
        <button type="button" class="btn-remove-coauthor" style="background:none; border:none; color:#dc2626; cursor:pointer; font-weight:600; font-size:0.85rem;">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
      <div class="form-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">
        <div class="form-group">
          <input type="text" name="coauthor_name[]" class="form-input" placeholder="Full Name" required>
        </div>
        <div class="form-group">
          <input type="email" name="coauthor_email[]" class="form-input" placeholder="Email Address" required>
        </div>
        <div class="form-group">
          <input type="text" name="coauthor_inst[]" class="form-input" placeholder="Institution / University" required>
        </div>
      </div>
    `;

    container.appendChild(row);

    if (countInput) {
      countInput.value = coAuthorIndex;
    }

    row.querySelector('.btn-remove-coauthor').addEventListener('click', () => {
      row.remove();
      coAuthorIndex = Math.max(1, coAuthorIndex - 1);
      if (countInput) countInput.value = coAuthorIndex;
    });
  });
}
