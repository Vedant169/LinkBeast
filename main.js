/* ========================================
   LINKBEAST — SHARED JAVASCRIPT
======================================== */

// ---- Navbar scroll behavior ----
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- Mobile menu ----
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  // Add close button inside menu
  if (!navLinks.querySelector('.nav-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'nav-close';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', closeMenu);
    navLinks.insertBefore(closeBtn, navLinks.firstChild);
  }

  function openMenu() {
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ---- Scroll animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
    observer.observe(el);
  });
}

// ---- Counter animation ----
function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
  const isFloat = target % 1 !== 0;
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('en-IN')) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 2000, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ---- Waitlist Form ----
function initWaitlistForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formContent = form.closest('.waitlist-card');
    const successDiv = formContent?.querySelector('.form-success');
    if (successDiv) {
      form.style.display = 'none';
      successDiv.style.display = 'block';
    }
    // Could send to backend / Google Form here
  });
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#10B981';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}

// ---- Smooth hover lift on cards ----
function initCardEffects() {
  document.querySelectorAll('.card, .feature-card, .pricing-card, .tier-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function() {
      this.style.willChange = '';
    });
  });
}

// ---- Beast Floating Chat Button ----
function initBeastWidget() {
  // Don't show on the chat page itself
  if (window.location.pathname.includes('beast-chat')) return;

  const style = document.createElement('style');
  style.textContent = `
    .beast-fab {
      position: fixed; bottom: 32px; right: 32px; z-index: 9999;
      display: flex; align-items: center; gap: 12px;
      background: #e0e5ec;
      box-shadow: 6px 6px 12px #b8bec7, -6px -6px 12px #ffffff;
      border-radius: 60px; padding: 14px 22px 14px 16px;
      cursor: pointer; text-decoration: none; border: none;
      transition: all 0.3s ease; font-family: 'Poppins', sans-serif;
    }
    .beast-fab:hover {
      box-shadow: 8px 8px 18px #b8bec7, -8px -8px 18px #ffffff;
      transform: translateY(-3px);
    }
    .beast-fab:active {
      box-shadow: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff;
      transform: translateY(0);
    }
    .beast-fab-icon {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(145deg, #764ba2, #667eea);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      box-shadow: 3px 3px 6px #b8bec7, -3px -3px 6px #ffffff;
      flex-shrink: 0;
    }
    .beast-fab-text { display: flex; flex-direction: column; }
    .beast-fab-label { font-size: 0.82rem; font-weight: 700; color: #764ba2; line-height: 1.2; }
    .beast-fab-sub { font-size: 0.7rem; color: #a0aec0; font-weight: 500; }

    @media (max-width: 480px) {
      .beast-fab { bottom: 20px; right: 20px; padding: 12px 16px 12px 12px; }
      .beast-fab-sub { display: none; }
    }
  `;
  document.head.appendChild(style);

  const fab = document.createElement('a');
  fab.href = 'beast-chat.html';
  fab.className = 'beast-fab';
  fab.setAttribute('aria-label', 'Talk to Beast — AI Marketing Advisor');
  fab.innerHTML = `
    <div class="beast-fab-icon">🦁</div>
    <div class="beast-fab-text">
      <span class="beast-fab-label">Talk to Beast</span>
      <span class="beast-fab-sub">AI Marketing Advisor</span>
    </div>
  `;
  document.body.appendChild(fab);
}

// ---- Init all ----
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initWaitlistForm('waitlist-form');
  initWaitlistForm('waitlist-form-2');
  initContactForm();
  initCardEffects();
  initBeastWidget();
});
