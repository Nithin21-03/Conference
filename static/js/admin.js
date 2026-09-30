/**
 * ICBDTT-2026 : Admin Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  initTableSearch();
  initStatusModals();
  initAdminSidebarMobile();
});

// 1. Live Table Search Filter
function initTableSearch() {
  const searchInput = document.getElementById('admin-table-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll('.admin-table tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
}

// 2. Status Modal Handler
function initStatusModals() {
  const statusButtons = document.querySelectorAll('.btn-update-status');
  const modal = document.getElementById('status-modal');
  const modalForm = document.getElementById('status-modal-form');
  const paperIdDisplay = document.getElementById('modal-paper-id');
  const statusSelect = document.getElementById('modal-status-select');
  const commentsInput = document.getElementById('modal-comments');
  const closeBtn = document.querySelector('.modal-close');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  if (!modal || !modalForm) return;

  statusButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const paperDbId = this.getAttribute('data-id');
      const paperCode = this.getAttribute('data-paper-id');
      const currentStatus = this.getAttribute('data-status');
      const comments = this.getAttribute('data-comments') || '';

      modalForm.action = `/admin/submissions/${paperDbId}/status`;
      if (paperIdDisplay) paperIdDisplay.textContent = paperCode;
      if (statusSelect) statusSelect.value = currentStatus;
      if (commentsInput) commentsInput.value = comments;

      modal.classList.add('show');
    });
  });

  function closeModal() {
    modal.classList.remove('show');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// 3. Mobile Sidebar Toggle
function initAdminSidebarMobile() {
  const toggleBtn = document.getElementById('admin-mobile-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });
}
