(() => {
 const root = document.documentElement;
 const themeBtns = document.querySelectorAll('[data-theme-toggle]');
 const dirBtns = document.querySelectorAll('[data-dir-toggle]');
 const menuBtn = document.querySelector('.menu-btn');
 const nav = document.querySelector('.nav-links');

 const MOON_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
 const SUN_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></svg>';

 function syncControls() {
  const isDark = root.dataset.theme === 'dark';
  const isRtl = root.dir === 'rtl';
  themeBtns.forEach(btn => {
   btn.innerHTML = isDark ? SUN_ICON : MOON_ICON;
   btn.classList.toggle('is-active', isDark);
   const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
   btn.title = label;
   btn.setAttribute('aria-label', label);
  });
  dirBtns.forEach(btn => {
   const dirLabel = btn.querySelector('[data-dir-label]');
   if (dirLabel) dirLabel.textContent = isRtl ? 'LTR' : 'RTL';
   else btn.textContent = isRtl ? 'LTR' : 'RTL';
   btn.classList.toggle('is-active', isRtl);
   const label = isRtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)';
   btn.title = label;
   btn.setAttribute('aria-label', label);
  });
 }

 const savedTheme = localStorage.getItem('lapserv-theme');
 const savedDir = localStorage.getItem('lapserv-dir');
 if (savedTheme) root.dataset.theme = savedTheme;
 if (savedDir) {
  root.dir = savedDir;
  document.body.classList.toggle('rtl', savedDir === 'rtl');
 }
 syncControls();

 themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
   const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
   root.dataset.theme = next;
   localStorage.setItem('lapserv-theme', next);
   syncControls();
  });
 });

 dirBtns.forEach(btn => {
  btn.addEventListener('click', () => {
   const next = root.dir === 'rtl' ? 'ltr' : 'rtl';
   root.dir = next;
   document.body.classList.toggle('rtl', next === 'rtl');
   localStorage.setItem('lapserv-dir', next);
   syncControls();
  });
 });

 function setNavOpen(isOpen) {
  if (!nav) return;
  nav.classList.toggle('open', isOpen);
  if (menuBtn) {
   menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
   menuBtn.textContent = isOpen ? '✕' : '☰';
  }
 }

 menuBtn?.addEventListener('click', () => {
  const isOpen = !nav?.classList.contains('open');
  setNavOpen(isOpen);
 });

 document.addEventListener('click', (e) => {
  if (nav?.classList.contains('open') && !nav.contains(e.target) && !menuBtn?.contains(e.target)) {
   setNavOpen(false);
  }
 });

 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
   setNavOpen(false);
   menuBtn?.focus();
  }
 });

 // Ensure active nav link highlights current page and close drawer on link click
 const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
 document.querySelectorAll('.nav-links > a').forEach(link => {
  const href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
  const isActive = href === currentPage;
  link.classList.toggle('active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
 });

 document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => setNavOpen(false));
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

 // ---- Services page: Detailed service modal & Know more interactions
 const SERVICES_DATA = {
  motherboard: {
   category: 'Board-level',
   title: 'Motherboard Diagnostics & Chip-Level Repair',
   tagline: 'Precision micro-soldering, short-circuit isolation, and component-level repair for power issues and boot failures.',
   image: 'assets/images/svc-motherboard.jpg',
   imageAlt: 'Close-up of a densely populated circuit board under inspection',
   time: '24–72 hours',
   warranty: '90-day parts & labor',
   diagnostics: 'Comprehensive bench testing',
   overview: 'Modern laptop logic boards integrate power management ICs (PMIC), MOSFETs, charging controllers, and high-speed data buses into a compact multi-layer PCB. When a laptop fails to turn on, cycles in boot loops, or suffers unexpected shutdowns, our board-level diagnostic isolates the exact faulty SMD component rather than writing off the entire system.',
   highlights: [
    'Microscope-guided multimeter and thermal imaging inspection of power rails',
    'Short-circuit detection across 3.3V, 5V, 19V, and CPU/GPU VCORE lines',
    'BGA rework, MOSFET replacement, and BIOS EEPROM re-flashing',
    'Ultrasonic flux cleaning and post-repair thermal stress testing under continuous load'
   ],
   tip: 'Before repair begins, we provide a transparent component-level quote. In rare cases of severe multilayer PCB burnout, we advise on board replacement vs. secure data extraction.',
   bookingUrl: 'contact.html#booking'
  },
  screen: {
   category: 'Display',
   title: 'Screen Replacement & Panel Calibration',
   tagline: 'Factory-grade display replacements for cracked, flickering, banded, or dim screens across OLED, IPS, and high-refresh panels.',
   image: 'assets/images/svc-screen.jpg',
   imageAlt: 'High-resolution display showing colour grading controls',
   time: 'Same day – 24 hrs',
   warranty: '6-month panel warranty',
   diagnostics: 'Free compatibility check',
   overview: 'Whether caused by an accidental drop, pressure cracks, vertical lines, or a worn eDP display flex cable, our technicians replace damaged laptop displays with OEM-grade panels matching your exact native resolution, refresh rate (60Hz to 240Hz), color gamut, and connector pinout (30-pin / 40-pin eDP).',
   highlights: [
    'Full inspection of eDP ribbon cables, backlight drivers, and bezel clips',
    'Zero-dead-pixel inspection and uniform color/brightness verification',
    'Available for ultra-slim bezels, anti-glare matte, and glass touchscreen assemblies',
    'Precision lid alignment to prevent uneven mechanical pressure on hinges'
   ],
   tip: 'Please bring your laptop charger along. We perform color balance and refresh rate verification with your operating system before sign-off.',
   bookingUrl: 'contact.html#booking'
  },
  keyboard: {
   category: 'Input & chassis',
   title: 'Keyboard, Trackpad & Hinge Reconstruction',
   tagline: 'Restoring smooth key travel, responsive multi-touch trackpads, and structural repair for cracked hinge anchors and top cases.',
   image: 'assets/images/svc-keyboard.jpg',
   imageAlt: 'Slim white keyboard seen from above',
   time: '24–48 hours',
   warranty: '90-day warranty',
   diagnostics: 'Mechanical inspection',
   overview: 'Stuck keys, ghost typing, liquid-sticky scissor clips, or stiff hinges cracking the display bezel are among the most frustrating laptop issues. We carry out precision plastic weld and brass threaded insert reconstruction for damaged hinge anchor points, as well as individual key mechanism or full riveted palmrest replacements.',
   highlights: [
    'Individual key mechanism repair or complete rivet-mounted keyboard replacement',
    'Structural hinge reinforcement with industrial resin and brass anchor nut rebuilds',
    'Precision torque balancing on left and right hinges to prevent future chassis cracks',
    'Backlight ribbon and multi-touch trackpad tactile switch alignment'
   ],
   tip: 'If you hear creaking or see the casing separating when opening your laptop lid, stop forcing it immediately to avoid cracking the underlying display panel.',
   bookingUrl: 'contact.html#booking'
  },
  liquid: {
   category: 'Recovery',
   title: 'Liquid Spill Decontamination & Board Recovery',
   tagline: 'Immediate power isolation, ultrasonic chemical bath, and trace oxidation cleanup to salvage water, coffee, or soda-damaged devices.',
   image: 'assets/images/svc-liquid.jpg',
   imageAlt: 'Laptop on a table beside a drink and glasses',
   time: '48–72 hours',
   warranty: 'Service guarantee',
   diagnostics: 'Emergency intake audit',
   overview: 'Liquid spills cause immediate electrical short circuits and rapid progressive oxidation under surface-mounted chips. Our decontamination process completely strips the board down, neutralizes corrosive residues in an ultrasonic bath with specialized electronics cleaning solvent, and inspects damaged PCB traces under high magnification.',
   highlights: [
    'Immediate battery disconnection and residual capacitance discharge',
    'Multi-stage ultrasonic bath cleaning to dissolve dried sugars and corrosive mineral salts',
    'Microscope trace inspection and micro-jumper wire reconstruction for corroded vias',
    'Full keyboard membrane, battery, and trackpad moisture and safety testing'
   ],
   tip: 'DO NOT place your laptop in rice or attempt to plug in the charger. Rice dust accelerates corrosion. Keep the device powered off, unplugged, and bring it in as soon as possible.',
   bookingUrl: 'contact.html#booking'
  },
  thermal: {
   category: 'Cooling',
   title: 'Thermal Overhaul & Fan Optimization',
   tagline: 'Deep dust extraction, bearing lubrication, and application of high-conductivity thermal paste or phase-change pads to restore peak performance.',
   image: 'assets/images/svc-thermal.jpg',
   imageAlt: 'Cooling loop and fans inside a computer',
   time: '2–4 hours',
   warranty: 'Thermal performance check',
   diagnostics: 'Free thermal benchmark',
   overview: 'Over months of use, factory thermal paste dries out into a crust and heatsink fins become clogged with dust and lint, causing thermal throttling, roaring fan noise, and sudden power cut-offs. Our thermal maintenance restores optimal heat transfer between CPU/GPU silicon dies and copper heatpipes.',
   highlights: [
    'Complete dust extraction from heatpipe fins, fan impellers, and intake grilles',
    'Old compound removal with 99.9% isopropyl alcohol and silicon die polish',
    'Application of premium high-performance thermal paste or phase-change pads (PTM7950)',
    'Fan bearing inspection and dynamic RPM speed calibration',
    'Before-and-after Cinebench and FurMark stress temperature verification'
   ],
   tip: 'Recommended once every 12 to 18 months for gaming laptops and high-performance workstations to prolong hardware lifespan and eliminate thermal throttling.',
   bookingUrl: 'contact.html#booking'
  },
  upgrade: {
   category: 'Upgrades',
   title: 'RAM Expansion & NVMe SSD Storage Upgrades',
   tagline: 'Speed up multitasking and multiply storage with high-speed PCIe Gen4 NVMe SSDs and dual-channel DDR4/DDR5 memory expansions.',
   image: 'assets/images/svc-upgrade.jpg',
   imageAlt: 'Motherboard CPU socket and memory slots up close',
   time: '1–3 hours',
   warranty: '3–5 yr hardware warranty',
   diagnostics: 'Compatibility audit',
   overview: 'Running out of disk space or experiencing stuttering while switching between heavy apps? We check your laptop chipset specifications, identify free M.2 NVMe slots and SODIMM slots, and upgrade your hardware with maximum speed and zero data loss.',
   highlights: [
    'Compatibility verification for single/dual-channel DDR4 and DDR5 speeds (up to 5600MHz)',
    'PCIe 3.0 / PCIe 4.0 high-speed NVMe solid state drives up to 4TB',
    'Bit-for-bit OS cloning from old drive to new SSD — retain all files, apps, and licenses',
    'Installation of custom copper graphene heatsinks for sustained NVMe speeds'
   ],
   tip: 'We perform full drive health audits (S.M.A.R.T. status) prior to migration to ensure your data transfer is 100% clean and error-free.',
   bookingUrl: 'contact.html#booking'
  }
 };

 const serviceModal = document.getElementById('service-modal');
 if (serviceModal) {
  const modalImg = document.getElementById('modal-service-img');
  const modalEyebrow = document.getElementById('modal-service-eyebrow');
  const modalTitle = document.getElementById('modal-service-title');
  const modalTagline = document.getElementById('modal-service-tagline');
  const modalTime = document.getElementById('modal-service-time');
  const modalWarranty = document.getElementById('modal-service-warranty');
  const modalDiag = document.getElementById('modal-service-diag');
  const modalDesc = document.getElementById('modal-service-desc');
  const modalHighlights = document.getElementById('modal-service-highlights');
  const modalTip = document.getElementById('modal-service-tip');
  const modalBook = document.getElementById('modal-service-book');
  const scrollArea = serviceModal.querySelector('.modal-scroll-area');
  let lastActiveElement = null;

  function openServiceModal(serviceKey, triggerBtn) {
   const data = SERVICES_DATA[serviceKey];
   if (!data) return;

   lastActiveElement = triggerBtn || document.activeElement;

   if (modalImg) {
    modalImg.src = data.image;
    modalImg.alt = data.imageAlt || data.title;
   }
   if (modalEyebrow) modalEyebrow.textContent = data.category;
   if (modalTitle) modalTitle.textContent = data.title;
   if (modalTagline) modalTagline.textContent = data.tagline;
   if (modalTime) modalTime.textContent = data.time;
   if (modalWarranty) modalWarranty.textContent = data.warranty;
   if (modalDiag) modalDiag.textContent = data.diagnostics;
   if (modalDesc) modalDesc.textContent = data.overview;
   if (modalTip) modalTip.textContent = data.tip;
   if (modalBook) modalBook.href = data.bookingUrl;

   if (modalHighlights) {
    modalHighlights.innerHTML = '';
    (data.highlights || []).forEach(item => {
     const li = document.createElement('li');
     li.textContent = item;
     modalHighlights.appendChild(li);
    });
   }

   if (scrollArea) scrollArea.scrollTop = 0;

   serviceModal.removeAttribute('hidden');
   void serviceModal.offsetWidth;
   serviceModal.classList.add('is-active');
   document.body.classList.add('modal-open');

   const closeBtn = serviceModal.querySelector('.modal-close-btn');
   closeBtn?.focus();
  }

  function closeServiceModal() {
   if (!serviceModal.classList.contains('is-active')) return;
   serviceModal.classList.remove('is-active');
   document.body.classList.remove('modal-open');

   setTimeout(() => {
    if (!serviceModal.classList.contains('is-active')) {
     serviceModal.setAttribute('hidden', '');
     if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
     }
    }
   }, 260);
  }

  document.querySelectorAll('.btn-know-more').forEach(btn => {
   btn.addEventListener('click', e => {
    e.preventDefault();
    const key = btn.dataset.service;
    openServiceModal(key, btn);
   });
  });

  serviceModal.querySelectorAll('[data-modal-close]').forEach(el => {
   el.addEventListener('click', e => {
    e.preventDefault();
    closeServiceModal();
   });
  });

  document.addEventListener('keydown', e => {
   if (e.key === 'Escape' && serviceModal.classList.contains('is-active')) {
    closeServiceModal();
   }
  });
 }

 document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
})();
