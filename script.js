/* Bizcom Legal — Quiet Luxury interactions (no WebGL, no heavy libs → lag free) */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  $$('[data-year]').forEach(e => (e.textContent = new Date().getFullYear()));

  /* smooth scroll (Lenis, if it loaded) */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: -80, duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* header: hide on scroll down, glass after leaving top */
  const hd = $('[data-hd]'); let lastY = 0;

  /* mobile sheet */
  const btn = $('[data-menu]'), sheet = $('#sheet');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); btn.setAttribute('aria-expanded', o); sheet.setAttribute('aria-hidden', !o); o ? lenis?.stop() : lenis?.start(); };
  btn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* line + block reveals */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv,.lines').forEach(el => io.observe(el));
  requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

  /* word-fill statements */
  const fills = $$('[data-fill]').map(el => {
    const words = [];
    const walk = (node, red) => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return; if (/^\s+$/.test(w)) return f.append(w);
          const s = document.createElement('span'); s.className = 'w' + (red ? ' red' : ''); s.textContent = w; words.push(s); f.append(s);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1) walk(n, red || n.hasAttribute('data-red'));
    });
    walk(el, false);
    return { el, words, lit: -1 };
  });

  /* frames: rounded inset reveal + inner parallax (only while on screen) */
  const frames = $$('[data-frame]').map(el => ({ el, img: $('img[data-par]', el), vis: false }));
  const vio = new IntersectionObserver(es => es.forEach(e => { const f = frames.find(x => x.el === e.target); if (f) f.vis = e.isIntersecting; }), { rootMargin: '10% 0px' });
  frames.forEach(f => vio.observe(f.el));

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    hd.classList.toggle('scrolled', y > 20);
    hd.classList.toggle('up', y > 300 && y > lastY && !document.body.classList.contains('menu-open'));
    document.body.classList.toggle('hd-up', hd.classList.contains('up'));
    lastY = y;
    if (reduce) return;
    fills.forEach(f => {
      const r = f.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.25), 0, 1);
      const n = Math.round(p * f.words.length);
      if (n === f.lit) return; f.lit = n;
      f.words.forEach((w, i) => w.classList.toggle('on', i < n));
    });
    frames.forEach(f => {
      if (!f.vis) return;
      const r = f.el.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh * 0.4), 0, 1); // fully open early so captions are never clipped
      f.el.style.setProperty('--ci', ((1 - p) * 4).toFixed(2) + '%');
      if (f.img) f.img.style.setProperty('--py', (((r.top + r.height / 2) - vh / 2) / vh * -7).toFixed(2) + '%');
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); update();

  /* accordion (one open at a time) */
  $$('[data-acc]').forEach(acc => $$('.acc__h', acc).forEach(h => h.addEventListener('click', () => {
    const it = h.parentElement, open = !it.classList.contains('open');
    $$('.acc__i', acc).forEach(i => { i.classList.remove('open'); $('.acc__h', i).setAttribute('aria-expanded', 'false'); });
    if (open) { it.classList.add('open'); h.setAttribute('aria-expanded', 'true'); }
    setTimeout(() => lenis?.resize(), 850);
  })));

  /* quotes */
  $$('[data-quotes]').forEach(q => {
    const items = $$('.quote', q), n = $('[data-qn]', q); let i = 0, timer;
    const pad = v => String(v).padStart(2, '0');
    const go = k => { i = (k + items.length) % items.length; items.forEach((el, j) => el.classList.toggle('on', j === i)); n.textContent = `${pad(i + 1)} / ${pad(items.length)}`; };
    const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(i + 1), 7000); };
    $('[data-qx]', q).addEventListener('click', () => { go(i + 1); auto(); });
    $('[data-qp]', q).addEventListener('click', () => { go(i - 1); auto(); });
    auto();
  });

  /* scroll-spy for services sub-nav + privacy toc */
  const spy = links => {
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); } }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); s && o.observe(s); });
  };
  const sn = $$('.subnav a'); if (sn.length) spy(sn);
  const tc = $$('[data-toc] a'); if (tc.length) spy(tc);

  /* enquiry form (front-end validation; connect to an email service to go live) */
  $$('[data-form]').forEach(f => {
    const rules = {
      name: v => v.trim().length > 1 || 'Please enter your name',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email',
      phone: v => v.replace(/\D/g, '').length >= 8 || 'Please enter a valid phone number',
      area: v => !!v || 'Please choose an area',
    };
    const check = el => {
      const r = rules[el.name]; if (!r) return true;
      const res = r(el.value), box = el.closest('.f');
      box.classList.toggle('err', res !== true); $('.f__err', box).textContent = res === true ? '' : res;
      el.setAttribute('aria-invalid', res !== true); return res === true;
    };
    $$('input,select', f).forEach(el => el.addEventListener('blur', () => check(el)));
    // Sends the enquiry to Lynn by email (FormSubmit AJAX endpoint — no server needed).
    const ENDPOINT = 'https://formsubmit.co/ajax/lynn@bizcomlegal.com.au';
    const btn = $('button[type=submit]', f), status = $('[data-status]', f), card = f.closest('.fcard') || f;
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = $$('input,select', f).filter(el => !check(el)); if (bad.length) return bad[0].focus();
      if (f._honey && f._honey.value) return card.classList.add('done'); // bot trap
      const d = Object.fromEntries(new FormData(f));
      const label = btn.innerHTML; btn.disabled = true; btn.textContent = 'Sending…'; status.textContent = '';
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `New website enquiry — ${d.area} — ${d.name}`, _template: 'table', _captcha: 'false', _replyto: d.email,
            Name: d.name, Email: d.email, Phone: d.phone, 'Area of enquiry': d.area,
            'Preferred contact time': d.time, Message: d.message || '—', Page: location.pathname,
          }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || res.status);
        card.classList.add('done'); f.reset();
      } catch (err) {
        status.innerHTML = 'Sorry — the message could not be sent. Please email <a href="mailto:lynn@bizcomlegal.com.au">lynn@bizcomlegal.com.au</a> or call +61 3 9108 4865.';
      } finally { btn.disabled = false; btn.innerHTML = label; }
    });
  });
})();
