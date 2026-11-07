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

 document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
