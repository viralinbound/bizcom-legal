/* Bizcom Legal — light, dependency-free interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $$('[data-year]').forEach(e => (e.textContent = new Date().getFullYear()));

  /* header shadow on scroll */
  const hd = $('[data-hd]');
  const onScroll = () => hd.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const btn = $('[data-menu]'), sheet = $('#sheet');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); btn.setAttribute('aria-expanded', o); sheet.setAttribute('aria-hidden', !o); document.body.style.overflow = o ? 'hidden' : ''; };
  btn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', sheet).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* active section: services sub-nav + privacy contents */
  const spy = links => {
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); } }), { rootMargin: '-35% 0px -60% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); s && o.observe(s); });
  };
  const sn = $$('.subnav a'); if (sn.length) spy(sn);
  const tc = $$('[data-toc] a'); if (tc.length) spy(tc);

  /* enquiry form — validates, then emails the firm via FormSubmit (no server needed) */
  const ENDPOINT = 'https://formsubmit.co/ajax/lynn@bizcomlegal.com.au';
  $$('[data-form]').forEach(f => {
    const rules = {
      name: v => v.trim().length > 1 || 'Please enter your name',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email',
      phone: v => v.replace(/\D/g, '').length >= 8 || 'Please enter a valid phone number',
      area: v => !!v || 'Please choose a service',
    };
    const check = el => {
      const r = rules[el.name]; if (!r) return true;
      const res = r(el.value), box = el.closest('.f');
      box.classList.toggle('err', res !== true); $('.f__err', box).textContent = res === true ? '' : res;
      el.setAttribute('aria-invalid', res !== true); return res === true;
    };
    $$('input,select', f).forEach(el => el.addEventListener('blur', () => check(el)));
    const btnS = $('button[type=submit]', f), status = $('[data-status]', f), card = f.closest('.fcard') || f;
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = $$('input,select', f).filter(el => !check(el)); if (bad.length) return bad[0].focus();
      if (f._honey && f._honey.value) return card.classList.add('done'); // bot trap
      const d = Object.fromEntries(new FormData(f));
      const label = btnS.innerHTML; btnS.disabled = true; btnS.textContent = 'Sending…'; status.textContent = '';
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `New website enquiry — ${d.area} — ${d.name}`, _template: 'table', _captcha: 'false', _replyto: d.email,
            Name: d.name, Email: d.email, Phone: d.phone, 'Service of interest': d.area,
            'Preferred contact time': d.time, Message: d.message || '—', Page: location.pathname,
          }),
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || res.status);
        card.classList.add('done'); f.reset();
      } catch (err) {
        status.innerHTML = 'Sorry — the message could not be sent. Please email <a href="mailto:lynn@bizcomlegal.com.au">lynn@bizcomlegal.com.au</a> or call (03) 9108 4865.';
      } finally { btnS.disabled = false; btnS.innerHTML = label; }
    });
  });
})();
