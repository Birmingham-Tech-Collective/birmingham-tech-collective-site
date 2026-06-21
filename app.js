/* app.js — Birmingham Tech Collective v2
   Theme toggle (in-memory), mobile nav with focus trap, scroll reveal,
   accessible form, and the Konami-code developer easter egg.
   No localStorage (sandbox blocks it). */
(function () {
  'use strict';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Theme toggle (session-only, in-memory) ---------------- */
  var html = document.documentElement;
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var currentTheme = systemDark.matches ? 'dark' : 'light';
  applyTheme(currentTheme);

  function applyTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    var toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(function (btn) {
      var toDark = theme === 'light';
      btn.setAttribute('aria-label', toDark ? 'Switch to dark mode' : 'Switch to light mode');
      btn.innerHTML = theme === 'dark' ? sunIcon() : moonIcon();
    });
  }
  function sunIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  }
  function moonIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });
  var manualSet = false;
  document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { manualSet = true; });
  });
  systemDark.addEventListener('change', function (e) {
    if (!manualSet) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    // Skip animation entirely — just make everything visible immediately
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      // Anything already visible in the viewport on load reveals immediately
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Small staggered delay for in-viewport hero elements
        var delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');
        setTimeout(function () { el.classList.add('is-visible'); }, delay * 1000);
      } else {
        observer.observe(el);
      }
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Mobile nav with focus trap ---------------- */
  var hamburger = document.querySelector('.hamburger');
  var mnav = document.getElementById('mobile-nav');
  if (hamburger && mnav) {
    var closeBtn = mnav.querySelector('[data-menu-close]');
    var backdrop = mnav.querySelector('.mobile-nav__backdrop');
    var lastFocused = null;

    function focusables() {
      return Array.prototype.slice.call(
        mnav.querySelectorAll('a[href], button:not([disabled])')
      );
    }
    function openMenu() {
      lastFocused = document.activeElement;
      mnav.setAttribute('data-open', 'true');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflowY = 'hidden';
      document.addEventListener('keydown', onKeydown);
      requestAnimationFrame(function () {
        var f = focusables();
        if (f.length) f[0].focus();
      });
    }
    function closeMenu() {
      mnav.setAttribute('data-open', 'false');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }
    function onKeydown(e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    mnav.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------------- Contact form ---------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get('topic');
    var topicSelect = document.getElementById('topic');
    if (topic && topicSelect) {
      var map = { funders: 'Funding & partnerships', students: 'For students', courses: 'Course leader', community: 'Community organisation', press: 'Press' };
      var want = map[topic.toLowerCase()];
      if (want) {
        Array.prototype.forEach.call(topicSelect.options, function (o) {
          if (o.text === want) topicSelect.value = o.value || o.text;
        });
      }
    }

    var status = document.getElementById('form-status');
    function setError(id, msg) {
      var input = document.getElementById(id);
      var err = document.getElementById(id + '-error');
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        err.innerHTML = errIcon() + '<span>Error: ' + msg + '</span>';
        err.setAttribute('data-show', 'true');
      } else {
        input.removeAttribute('aria-invalid');
        err.innerHTML = '';
        err.setAttribute('data-show', 'false');
      }
    }
    function errIcon() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>';
    }
    form.addEventListener('submit', function (e) {
      var ok = true;
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      if (!name.value.trim()) { setError('name', 'Please enter your name.'); ok = false; } else setError('name', '');
      if (!email.value.trim()) { setError('email', 'Please enter your email.'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError('email', 'Please enter a valid email address.'); ok = false; }
      else setError('email', '');
      if (message.value.trim().length < 20) { setError('message', 'Please write at least 20 characters.'); ok = false; } else setError('message', '');

      if (!ok) {
        e.preventDefault();
        var firstErr = form.querySelector('[aria-invalid="true"]');
        if (firstErr) firstErr.focus();
        if (status) { status.hidden = false; status.setAttribute('data-state', 'error'); status.textContent = 'Some fields need attention. Please check the highlighted fields.'; }
        return;
      }
      if (status) { status.hidden = false; status.setAttribute('data-state', 'ok'); status.textContent = 'Sending…'; }
    });
  }

  /* ---------------- Konami code easter egg ---------------- */
  var devMode = false;
  var KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var buffer = [];
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if ((tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') && e.key.length === 1) return;
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    buffer.push(key);
    if (buffer.length > KONAMI.length) buffer.shift();
    if (buffer.length === KONAMI.length && buffer.every(function (k, i) { return k === KONAMI[i]; })) {
      activateDevMode();
      buffer = [];
    }
  });

  var konamiKey = document.querySelector('[data-konami-activate]');
  if (konamiKey) {
    konamiKey.addEventListener('click', function (e) { e.preventDefault(); activateDevMode(); });
  }

  function activateDevMode() {
    if (devMode) return;
    devMode = true;
    document.documentElement.setAttribute('data-devmode', 'true');

    var live = document.getElementById('konami-live');
    if (live) live.textContent = 'Developer mode unlocked. Open source on GitHub.';

    var greet = document.getElementById('greet-line');
    if (greet) {
      var text = '> system::greet("hello, hacker") -> "welcome to the collective"';
      if (prefersReduced) {
        greet.textContent = text;
      } else {
        greet.textContent = '';
        var i = 0;
        var total = 1500;
        var step = Math.max(12, Math.floor(total / text.length));
        var timer = setInterval(function () {
          greet.textContent += text.charAt(i);
          i++;
          if (i >= text.length) clearInterval(timer);
        }, step);
      }
    }

    var toast = document.getElementById('konami-toast');
    if (toast) {
      toast.setAttribute('data-open', 'true');
      var close = toast.querySelector('.close');
      if (close) close.addEventListener('click', function () {
        toast.setAttribute('data-open', 'false');
        if (konamiKey) konamiKey.focus(); else document.body.focus();
      });
    }
  }
})();
