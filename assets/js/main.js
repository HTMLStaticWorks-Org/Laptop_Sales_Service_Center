(() => {
 const root = document.documentElement;
 const themeBtn = document.querySelector('[data-theme-toggle]');
 const dirBtn = document.querySelector('[data-dir-toggle]');
 const dirLabel = dirBtn?.querySelector('[data-dir-label]');
 const menuBtn = document.querySelector('.menu-btn');
 const nav = document.querySelector('.nav-links');

 const MOON_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
 const SUN_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>';

 function syncControls() {
  const isDark = root.dataset.theme === 'dark';
  const isRtl = root.dir === 'rtl';
  if (themeBtn) {
   themeBtn.innerHTML = isDark ? SUN_ICON : MOON_ICON;
   themeBtn.classList.toggle('is-active', isDark);
   themeBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  if (dirBtn) {
   if (dirLabel) dirLabel.textContent = isRtl ? 'LTR' : 'RTL';
   else dirBtn.textContent = isRtl ? 'LTR' : 'RTL';
   dirBtn.classList.toggle('is-active', isRtl);
   dirBtn.title = isRtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)';
  }
 }

 const savedTheme = localStorage.getItem('lapserv-theme');
 const savedDir = localStorage.getItem('lapserv-dir');
 if (savedTheme) root.dataset.theme = savedTheme;
 if (savedDir) {
  root.dir = savedDir;
  document.body.classList.toggle('rtl', savedDir === 'rtl');
 }
 syncControls();

 themeBtn?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('lapserv-theme', next);
  syncControls();
 });

 dirBtn?.addEventListener('click', () => {
  const next = root.dir === 'rtl' ? 'ltr' : 'rtl';
  root.dir = next;
  document.body.classList.toggle('rtl', next === 'rtl');
  localStorage.setItem('lapserv-dir', next);
  syncControls();
 });

 menuBtn?.addEventListener('click', () => nav?.classList.toggle('open'));

 // Ensure active nav link highlights current page
 const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
 document.querySelectorAll('.nav-links a').forEach(link => {
  const href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
  const isActive = href === currentPage;
  link.classList.toggle('active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
 });

 document.querySelectorAll('form[data-demo-form]').forEach(form =>
  form.addEventListener('submit', e => {
   e.preventDefault();
   const out = form.querySelector('.form-result');
   if (out) {
    out.textContent = 'Thank you. This frontend demonstration has validated your entries, but it is not connected to a live booking or messaging service.';
    out.classList.remove('hidden');
   }
   form.reset();
  })
 );

 document.querySelectorAll('form[data-newsletter-form]').forEach(form =>
  form.addEventListener('submit', e => {
   e.preventDefault();
   const msg = form.parentElement?.querySelector('.newsletter-msg');
   if (msg) {
    msg.textContent = 'Thank you for subscribing to Lapserv updates!';
    msg.classList.remove('hidden');
   }
   form.reset();
  })
 );

 const search = document.querySelector('#product-search'), category = document.querySelector('#category-filter');
 function filterProducts() {
  const q = (search?.value || '').toLowerCase(), c = category?.value || 'all';
  document.querySelectorAll('[data-product]').forEach(card => {
   const text = card.textContent.toLowerCase(), cat = card.dataset.category;
   card.classList.toggle('hidden', !(text.includes(q) && (c === 'all' || cat === c)));
  });
 }
 search?.addEventListener('input', filterProducts);
 category?.addEventListener('change', filterProducts);

 const track = document.querySelector('#track-form');
 track?.addEventListener('submit', e => {
  e.preventDefault();
  const id = track.querySelector('[name="jobid"]').value.trim();
  const result = document.querySelector('#tracking-result');
  result.classList.remove('hidden');
  result.innerHTML = `<strong>Demo lookup only</strong><p>Job ID <b>${id.replace(/[<>&"]/g, '')}</b> was entered. No live repair database is connected, so no customer repair status can be retrieved.</p>`;
 });

 // Interactive Diagnostic & Service Estimator (Home 1)
 const estimatorContainer = document.querySelector('#diagnostic-estimator');
 if (estimatorContainer) {
  const devicePills = estimatorContainer.querySelectorAll('[data-device-type]');
  const issuePills = estimatorContainer.querySelectorAll('[data-issue-type]');
  const priceDisplay = estimatorContainer.querySelector('#est-price');
  const turnaroundDisplay = estimatorContainer.querySelector('#est-turnaround');
  const warrantyDisplay = estimatorContainer.querySelector('#est-warranty');
  const ctaLink = estimatorContainer.querySelector('#est-cta-link');

  function updateEstimator() {
   const activeDevice = estimatorContainer.querySelector('[data-device-type].active');
   const activeIssue = estimatorContainer.querySelector('[data-issue-type].active');
   if (!activeIssue) return;

   const price = activeIssue.dataset.basePrice || '$49';
   const time = activeIssue.dataset.turnaround || '24-48 Hours';
   const warranty = activeIssue.dataset.warranty || '6 Months';
   const issueName = activeIssue.dataset.issueName || 'Service';
   const deviceName = activeDevice ? activeDevice.textContent.trim() : 'Laptop';

   if (priceDisplay) priceDisplay.textContent = price;
   if (turnaroundDisplay) turnaroundDisplay.textContent = time;
   if (warrantyDisplay) warrantyDisplay.textContent = warranty;
   if (ctaLink) {
    ctaLink.href = `contact.html?device=${encodeURIComponent(deviceName)}&issue=${encodeURIComponent(issueName)}#booking`;
   }
  }

  devicePills.forEach(pill => {
   pill.addEventListener('click', () => {
    devicePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    updateEstimator();
   });
  });

  issuePills.forEach(pill => {
   pill.addEventListener('click', () => {
    issuePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    updateEstimator();
   });
  });
 }

 // ---- Hero category chips (Laptops page): set the catalogue filter and jump to it
 const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('[data-filter-chip]').forEach(btn =>
  btn.addEventListener('click', () => {
   if (category) {
    category.value = btn.dataset.filterChip;
    filterProducts();
   }
   document.getElementById('catalog')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  })
 );

 // ---- Motion: scroll reveal, count-up numbers, pointer parallax
 root.classList.add('js');

 function animateCount(el) {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const show = v => (el.textContent = pre + v.toFixed(dec) + suf);
  if (reduceMotion || Number.isNaN(end)) return show(end || 0);
  const t0 = performance.now(), dur = 1600;
  (function step(t) {
   const p = Math.min((t - t0) / dur, 1);
   show(end * (1 - Math.pow(1 - p, 3)));
   if (p < 1) requestAnimationFrame(step);
  })(t0);
 }

 function markVisible(el) {
  el.classList.add('in');
  if (el.hasAttribute('data-count')) animateCount(el);
  if (el.classList.contains('reveal')) {
   const delay = (parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0) * 1000;
   // once the entrance has played, drop the reveal classes so hover transitions work again
   setTimeout(() => el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-zoom'), 1400 + delay);
  }
 }

 const motionTargets = document.querySelectorAll('.reveal, [data-count]');
 if (!('IntersectionObserver' in window) || reduceMotion) {
  motionTargets.forEach(el => {
   el.classList.add('in');
   if (el.hasAttribute('data-count')) animateCount(el);
  });
 } else {
  const io = new IntersectionObserver(
   entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    markVisible(e.target);
   }),
   { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
  );
  motionTargets.forEach(el => io.observe(el));
 }

 const cinema = document.querySelector('.hero-cinema');
 if (cinema && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  cinema.addEventListener('pointermove', e => {
   const r = cinema.getBoundingClientRect();
   cinema.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
   cinema.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  });
  cinema.addEventListener('pointerleave', () => {
   cinema.style.setProperty('--px', 0);
   cinema.style.setProperty('--py', 0);
  });
 }

 document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
