/* ═══════════════════════════════════════════════════════════════
   THOMPSON INTERNATIONAL SCHOOL — STUDENT UNION
   script.js | Interactions, Animations, Scroll Effects
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. DOM READY
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounterAnimation();
  initActiveNav();
  initGalleryLightbox();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initParallax();
});

/* ─────────────────────────────────────────────────────────────
   2. NAVBAR — scroll shadow + shrink
───────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ─────────────────────────────────────────────────────────────
   3. MOBILE MENU — hamburger toggle
───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on any nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   4. SCROLL REVEAL — intersection observer
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (!revealTargets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealTargets.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   5. COUNTER ANIMATION — hero stats
───────────────────────────────────────────────────────────── */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    let startTime  = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay for stagger effect
          const delay = parseInt(entry.target.closest('.stat-item')
            ?.style?.transitionDelay || '0') || 0;
          setTimeout(() => animateCounter(entry.target), delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   6. ACTIVE NAV — highlight current section
───────────────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.nav === id);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

/* ─────────────────────────────────────────────────────────────
   7. GALLERY LIGHTBOX
───────────────────────────────────────────────────────────── */
function initGalleryLightbox() {
  const galleryItems   = document.querySelectorAll('.gallery-item');
  const lightbox       = document.getElementById('lightbox');
  const lightboxClose  = document.getElementById('lightboxClose');
  const lightboxContent = document.getElementById('lightboxContent');

  if (!galleryItems.length || !lightbox) return;

  const openLightbox = (item) => {
    const caption = item.querySelector('.gallery-overlay p')?.textContent || '';
    const emoji   = item.querySelector('.gallery-placeholder span')?.textContent || '🖼️';

    lightboxContent.innerHTML = `
      <div style="font-size: 5rem; margin-bottom: 24px;">${emoji}</div>
      <p style="font-family: var(--font-display); font-size: 1.4rem; color: var(--white);">${caption}</p>
      <p style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--white-dim); margin-top: 8px;">
        Thompson International School — Uchtepa Branch
      </p>
    `;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ─────────────────────────────────────────────────────────────
   8. CONTACT FORM — validation + submit
───────────────────────────────────────────────────────────── */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  // Validation rules
  const rules = {
    name:    { min: 2, message: 'Please enter your full name (min 2 characters).' },
    email:   { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
    message: { min: 10, message: 'Please write a message (min 10 characters).' },
  };

  const validateField = (field) => {
    const name   = field.name;
    const value  = field.value.trim();
    const rule   = rules[name];
    const errEl  = document.getElementById(`${name}Error`);

    if (!rule) return true;

    let isValid = true;
    let message = '';

    if (!value) {
      isValid = false;
      message = 'This field is required.';
    } else if (rule.min && value.length < rule.min) {
      isValid = false;
      message = rule.message;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      isValid = false;
      message = rule.message;
    }

    field.classList.toggle('error', !isValid);
    if (errEl) errEl.textContent = isValid ? '' : message;

    return isValid;
  };

  // Live validation on blur
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const fields     = form.querySelectorAll('input[required], textarea[required]');
    let allValid     = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) return;

    // Simulate async submit (replace with real fetch/API call)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = 'Sending…';
    submitBtn.disabled  = true;

    setTimeout(() => {
      // Success state
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled  = false;
      successMsg.classList.add('visible');
      form.querySelectorAll('input, textarea').forEach(f => f.classList.remove('error'));

      // Hide success message after 5 seconds
      setTimeout(() => successMsg.classList.remove('visible'), 5000);
    }, 1200);
  });
}

/* ─────────────────────────────────────────────────────────────
   9. BACK TO TOP button
───────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────────────────────────────
   10. SMOOTH SCROLL — for anchor links
───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   11. HERO PARALLAX — subtle orb mouse-tracking
───────────────────────────────────────────────────────────── */
function initParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (!orb1 || !orb2) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const moveX1 = (x - 0.5) * 40;
      const moveY1 = (y - 0.5) * 40;
      const moveX2 = (x - 0.5) * -25;
      const moveY2 = (y - 0.5) * -25;

      orb1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
      orb2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;

      ticking = false;
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   12. UTILITY — throttle helper
───────────────────────────────────────────────────────────── */
function throttle(fn, limit) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   13. CARD TILT EFFECT — subtle 3D on member cards
───────────────────────────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.member-card');
  if (!cards.length) return;

  // Disable on touch devices
  if ('ontouchstart' in window) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -5;
      const tiltY  = dx *  5;

      card.style.transform = `
        translateY(-8px)
        perspective(600px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   14. TIMELINE DOT PULSE — trigger when in view
───────────────────────────────────────────────────────────── */
(function initTimelinePulse() {
  const dots = document.querySelectorAll('.timeline-dot');
  if (!dots.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = 'pulse-dot 2s ease-in-out infinite';
          }, i * 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 }
  );

  dots.forEach(dot => observer.observe(dot));
})();

/* ─────────────────────────────────────────────────────────────
   15. CURSOR GLOW TRAIL (desktop only)
───────────────────────────────────────────────────────────── */
(function initCursorTrail() {
  if ('ontouchstart' in window) return;

  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(196,18,48,0.06), transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.4s ease, top 0.4s ease;
    will-change: left, top;
  `;

  document.body.appendChild(trail);

  document.addEventListener('mousemove', throttle((e) => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  }, 30));
})();
