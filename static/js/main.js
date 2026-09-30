/**
 * ICBDTT-2026 : Professional Conference JavaScript
 * Features:
 *  - Sticky Navbar Elevation
 *  - Mobile Navigation Drawer Toggle
 *  - FAQ Accordion
 *  - Alert Dismissal
 */

document.addEventListener('DOMContentLoaded', function () {
  initStickyHeader();
  initMobileDrawer();
  initFaqAccordion();
  initAlertDismissal();
});

// 1. Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. Mobile Drawer Navigation
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
}

// 3. FAQ Accordion
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', function () {
      const item = this.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all other items in the same container
      const parentContainer = item.closest('.accordion');
      if (parentContainer) {
        parentContainer.querySelectorAll('.accordion-item').forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
      }

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// 4. Flash Alert Dismissal
function initAlertDismissal() {
  document.querySelectorAll('.alert-close').forEach((btn) => {
    btn.addEventListener('click', function () {
      const alert = this.closest('.alert');
      if (alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        alert.style.transition = 'all 0.3s ease';
        setTimeout(() => alert.remove(), 300);
      }
    });
  });

  // Auto-dismiss success alerts after 6 seconds
  setTimeout(() => {
    document.querySelectorAll('.alert-success').forEach((alert) => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.5s ease';
      setTimeout(() => alert.remove(), 500);
    });
  }, 6000);
}
