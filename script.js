

/* ─── DOM REFS ─── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');
const backToTopBtn = document.getElementById('back-to-top-btn');
const toast = document.getElementById('toast-notification');
const currentYear = document.getElementById('current-year');
const allNavLinks = document.querySelectorAll('.nav-link');
const allSections = document.querySelectorAll('section[id]');
const fadeEls = document.querySelectorAll('.fade-up, .fade-right, .fade-left');
const buyButtons = document.querySelectorAll('.btn-buy');

/* ─── YEAR ─── */
if (currentYear) currentYear.textContent = new Date().getFullYear();

/* ─── NAVBAR SCROLL ─── */
let lastScroll = 0;

function handleNavbarScroll() {
  const scrollY = window.scrollY;

  // Sticky style
  if (scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to Top visibility
  if (scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }

  lastScroll = scrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load

/* ─── HAMBURGER / MOBILE MENU ─── */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    closeMobileMenu();
  }
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMobileMenu();
    hamburger.focus();
  }
});

function closeMobileMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveLink(id);
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  }
);

allSections.forEach((section) => sectionObserver.observe(section));

function updateActiveLink(sectionId) {
  allNavLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ─── SCROLL ANIMATIONS ─── */
const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = [...entry.target.parentElement.children].filter(
          (el) => el.classList.contains('fade-up') ||
            el.classList.contains('fade-right') ||
            el.classList.contains('fade-left')
        );
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('in-view');
        animationObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach((el) => animationObserver.observe(el));

/* ─── BACK TO TOP ─── */
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── TOAST NOTIFICATION ─── */
let toastTimer = null;

function showToast(message, duration = 2800) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ─── BUY BUTTONS ─── */
const bookData = {
  'buy-book-1': { title: 'The Silent Echo', emoji: '📘' },
  'buy-book-2': { title: 'Midnight Library', emoji: '🌙' },
  'buy-book-3': { title: 'Atomic Focus', emoji: '⚡' },
  'buy-book-4': { title: 'Cosmos of Code', emoji: '🌌' },
  'buy-book-5': { title: 'Whispers of Time', emoji: '⏳' },
  'buy-book-6': { title: 'The Last Algorithm', emoji: '💻' },
};

buyButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const id = btn.id;
    const data = bookData[id] || { title: 'this book', emoji: '📚' };

    // Button animation
    btn.textContent = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #6EE7B7, #34D399)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Buy Now';
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);

    showToast(`${data.emoji} "${data.title}" added to cart!`);
  });
});

/* ─── CATEGORY CARDS — ripple effect ─── */
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach((card) => {
  card.addEventListener('click', function (e) {
    // Create ripple
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    Object.assign(ripple.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      background: 'rgba(200, 162, 255, 0.35)',
      borderRadius: '50%',
      transform: 'scale(0)',
      animation: 'rippleAnim 0.5s ease-out forwards',
      pointerEvents: 'none',
    });

    // Add ripple keyframes if not present
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleAnim {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ─── STATS COUNTER ANIMATION ─── */
const statNumbers = document.querySelectorAll('.stat-number:not(.star-stat)');

function animateCounter(el) {
  const raw = el.textContent.trim();
  const suffix = raw.replace(/[\d.]/g, '');
  const target = parseFloat(raw);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = raw; // ensure exact final value
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((el) => statsObserver.observe(el));

/* ─── HERO PARALLAX (subtle) ─── */
const heroBg = document.querySelector('.hero::before');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  if (!heroSection) return;
  const scrolled = window.scrollY;
  const heroHeight = heroSection.offsetHeight;
  if (scrolled < heroHeight) {
    const rate = scrolled * 0.4;
    const bookImg = document.querySelector('.hero-book-img');
    if (bookImg) {
      bookImg.style.transform = `translateY(${-rate * 0.08}px)`;
    }
  }
}, { passive: true });

/* ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── PRELOAD ANIMATION REMOVAL ─── */
// Prevent flash of un-animated content on initial load
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');
});
