// Bizcom Legal — static site builder.  Run: node build.mjs
// Design: corporate boutique (client reference), palette = logo red / white / grey, NO photographs, NO team section.
import fs from 'node:fs';

const V = '6.5';
const PHONE = '(03) 9108 4865', TEL = 'tel:+61391084865', MOB = '+61 421 327 828', MOBTEL = 'tel:+61421327828';
const EMAIL = 'lynn@bizcomlegal.com.au', WA = 'https://wa.me/61414822108';
const ADDR = 'Suite 25, Third Floor, 2 Brandon Park Drive, Wheelers Hill VIC 3150';
const FEE = '$350', FEE_NOTE = '+ GST', FEE_LONG = '$350.00 plus GST';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('2 Brandon Park Drive, Wheelers Hill VIC 3150');

const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC = {
  phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  pin: svg('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  wa: svg('<path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z"/><path d="M9 10c0 3 2 5 5 5l1.5-1.5-2-1-1 .8a3 3 0 0 1-1.6-1.6l.8-1-1-2z"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  ext: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  brief: svg('<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2.5 13h19"/>'),
  tag: svg('<path d="M20.5 12.5 12 21l-9-9V3h9z"/><circle cx="7.5" cy="7.5" r="1.3"/>'),
  store: svg('<path d="m3 9 1.2-5h15.6L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>'),
  users: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.6 3.2-5.5 6.5-5.5s6 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5c2.4.2 4.1 1.7 4.5 4.5"/>'),
  coin: svg('<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2C14.2 8.4 13.2 8 12 8c-1.7 0-2.8.9-2.8 2.1 0 3 5.6 1.4 5.6 4.3 0 1.2-1.2 2.1-2.8 2.1-1.3 0-2.4-.5-3-1.4M12 6v2M12 16v2"/>'),
  home: svg('<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  heart: svg('<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>'),
  scales: svg('<path d="M12 3v18M7 21h10M4 7h16"/><path d="m4 7-2.6 7a3.6 3.6 0 0 0 5.2 0zM20 7l-2.6 7a3.6 3.6 0 0 0 5.2 0z"/>'),
  scroll: svg('<path d="M8 3h9a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1h11"/><path d="M5 17V5a2 2 0 0 1 2-2M10 8h5M10 12h5"/>'),
};

const NAV = [['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'], ['resources.html', 'Resources'], ['contact.html', 'Contact']];
const esc = s => s.replace(/&(?![a-z#0-9]+;)/g, '&amp;');

/* ----- practice areas (only what Bizcom Legal offers; no migration / criminal) ----- */
const AREAS = [
  { id: 'commercial', t: 'Business & Commercial', icon: 'brief', lead: 'Day-to-day and transactional counsel that keeps your business moving — from formation documents through to recovery and disputes.',
    items: ['Business Conveyancing', 'Leases & Licensing', 'Contracts', 'E-commerce policies', 'Dispute Resolution', 'Debt Collection', 'Franchising', 'Employment law'] },
  { id: 'property', t: 'Property', icon: 'home', lead: 'Conveyancing and property advisory across the eastern states, including guidance for investors and lenders.',
    items: ['Conveyancing — VIC, NSW, QLD, WA, ACT', 'Investment property', 'Guarantor & private lending advice'] },
  { id: 'family-law', t: 'Family Law', icon: 'heart', lead: 'Considered, supportive advice on financial and parenting matters — formalised properly and built to last.',
    items: ['Property settlements', 'Binding Financial Agreements / Consent Orders', 'Parenting & Child Support'] },
  { id: 'litigation', t: 'Litigation', icon: 'scales', lead: 'Representation and dispute resolution across Victorian tribunals and courts, at every level.',
    items: ['VCAT', 'Magistrates, County & Supreme Court of Victoria', 'Small Claims & Consumer Law'] },
  { id: 'wills-estates', t: 'Wills & Estates', icon: 'scroll', lead: 'Estate planning and administration handled with care — from your will today to probate when it matters.',
    items: ['Wills & Powers of Attorney', 'Estate Planning', 'Probate', 'Letters of Administration'] },
];
const CARDS = [
  ['commercial', 'brief', 'Commercial & Business', 'Contracts, e-commerce policies and business transactions — counsel that keeps your business moving.'],
  ['commercial', 'tag', 'Franchising', 'Practical advice on franchising matters.'],
  ['commercial', 'store', 'Leases & Licensing', 'Commercial leases and licences — clear terms, understood before you sign.'],
  ['commercial', 'users', 'Employment Law', 'Employment law advice for businesses across a range of industries.'],
  ['commercial', 'coin', 'Debt Collection', 'Recovering what you are owed, with dispute resolution when it is needed.'],
  ['property', 'home', 'Property & Conveyancing', 'Conveyancing across VIC, NSW, QLD, WA & ACT, investment property and guarantor & private lending advice.'],
  ['family-law', 'heart', 'Family Law', 'Property settlements, Binding Financial Agreements, Consent Orders, and parenting & child support.'],
  ['litigation', 'scales', 'Litigation & Disputes', 'VCAT and the Magistrates, County & Supreme Courts of Victoria — small claims to consumer law.'],
  ['wills-estates', 'scroll', 'Wills & Estates', 'Wills & Powers of Attorney, estate planning, probate and letters of administration.'],
];
const TESTI = [
  ['Lynn provided clear, practical advice on our commercial lease…', 'J. Mitchell', 'Small business owner'],
  ['We needed help with a property settlement and wills…', 'S. Chen', 'Client'],
  ['Professional, knowledgeable and focused on the best outcome…', 'M. Roberts', 'Property client'],
  ['Bizcom Legal helped us navigate a complex commercial dispute…', 'D. Thompson', 'Business owner'],
  ['Lynn made the process of updating our wills simple…', 'K. Williams', 'Estate planning client'],
  ['Outstanding property law advice…', 'R. Anderson', 'Property investor'],
  ['Professional, efficient, and results-driven…', 'L. Martinez', 'Corporate client'],
  ['Highly recommend Bizcom Legal for commercial law…', 'T. Brown', 'Entrepreneur'],
];

/* ----- shared pieces ----- */
const form = (id, k, h, p, btn = 'Send enquiry') => `
<div class="fcard rv" id="${id === 'h' ? 'enquire' : ''}">
  <span class="fcard__k">${k}</span>
  <h3>${h}</h3>
  <p class="fcard__p">${p}</p>
  <form data-form novalidate aria-label="Enquiry form">
    <div class="fgrid">
      <div class="f f--full"><label for="${id}-name">Full name <span class="req">*</span></label><input id="${id}-name" name="name" autocomplete="name" required placeholder="Your name"><span class="f__err"></span></div>
      <div class="f"><label for="${id}-email">Email <span class="req">*</span></label><input id="${id}-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"><span class="f__err"></span></div>
      <div class="f"><label for="${id}-phone">Phone <span class="req">*</span></label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required placeholder="04xx xxx xxx"><span class="f__err"></span></div>
      <div class="f f--full"><label for="${id}-area">Service of interest <span class="req">*</span></label><select id="${id}-area" name="area" required><option value="">Select…</option>${AREAS.map(a => `<option>${esc(a.t)}</option>`).join('')}<option>Other</option></select><span class="f__err"></span></div>
      <div class="f f--full"><label for="${id}-time">Preferred contact time</label><select id="${id}-time" name="time"><option>Anytime</option><option>Morning (9am–12pm)</option><option>Afternoon (12pm–5pm)</option><option>Evening (5pm–7pm)</option></select></div>
      <div class="f f--full"><label for="${id}-msg">Message</label><textarea id="${id}-msg" name="message" placeholder="A few lines about your matter…"></textarea></div>
    </div>
    <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0">
    <p class="form__status" data-status role="alert"></p>
    <div class="fcard__foot">
      <button class="btn btn--red btn--lg" type="submit">${btn} ${IC.arrow}</button>
      <p class="fcard__note">Submitting this form does not create a solicitor–client relationship. By submitting you agree to our <a href="privacy.html">Privacy Policy</a>. Enquiries are typically acknowledged within one business day.</p>
    </div>
  </form>
  <div class="form__ok" role="status" aria-live="polite"><span class="eyebrow">Received</span><h4>Thank you — your enquiry has been received.</h4><p>A member of the Bizcom Legal team will respond within one business day.</p></div>
</div>`;

const cta = (book) => `
<section class="cta">
  <div class="wrap cta__in">
    <div><h2>Book your initial consultation — <span class="nw">${FEE} ${FEE_NOTE}</span></h2><p>Speak with Bizcom Legal about your matter. New enquiries are typically acknowledged within one business day.</p></div>
    <div class="cta__btns"><a class="btn btn--white btn--lg" href="${book}">Make an appointment ${IC.arrow}</a><a class="btn btn--ghost btn--lg" href="${TEL}">Call ${PHONE}</a></div>
  </div>
</section>`;

const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.23-3.28-.68-2.78-1.1-4.55-3.95-4.69-4.13-.14-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.27.55-.34.73-.34l.52.01c.17 0 .39-.06.61.47.24.55.8 1.92.87 2.06.07.14.12.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.06.11.06.66-.18 1.33z"/></svg>';

function page({ file, title, desc, body }) {
  const book = file === 'index.html' || file === 'contact.html' ? '#enquire' : 'contact.html#enquire';
  const nav = NAV.map(([h, t]) => `<a href="${h}"${h === file ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#2A2D31">
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=${V}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap topbar__in">
  <a class="tb" href="${TEL}"><span class="tb__i">${IC.phone}</span><span><small>Call us</small><b>${PHONE}</b></span></a>
  <a class="tb tb--fee" href="${book}"><span class="tb__i">${IC.cal}</span><span><small>Book now</small><b>Initial consultation <span>${FEE} ${FEE_NOTE}</span></b></span></a>
  <a class="tb tb--mail" href="mailto:${EMAIL}"><span class="tb__i">${IC.mail}</span><span><small>Email us</small><b>${EMAIL}</b></span></a>
  <a class="tb tb--visit" href="${MAPS}" target="_blank" rel="noopener"><span class="tb__i">${IC.pin}</span><span><small>Visit us</small><b>Wheelers Hill, VIC</b></span></a>
</div></div>
<header class="hd" data-hd>
  <div class="wrap hd__in">
    <a class="hd__logo" href="index.html" aria-label="Bizcom Legal — home"><img src="assets/brand/logo-horizontal.svg" alt="Bizcom Legal" width="160" height="40"></a>
    <nav class="hd__nav" aria-label="Primary">${nav}</nav>
    <div class="hd__cta"><a class="btn btn--red" href="${book}">Make an appointment</a><button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="sheet" data-menu><i></i></button></div>
  </div>
</header>
<div class="sheet" id="sheet" aria-hidden="true">
  ${NAV.map(([h, t], i) => `<a class="l" href="${h}">${t}<small>0${i + 1}</small></a>`).join('')}
  <div class="sheet__foot"><a class="btn btn--red btn--lg" href="${book}">Book initial consultation <span class="nw btn__p">${FEE} ${FEE_NOTE}</span></a><a class="btn btn--ghost btn--lg" href="${TEL}">Call ${PHONE}</a></div>
</div>
<main id="main">
${body}
</main>
<footer class="ft">
  <div class="wrap">
    <div class="ft__cols">
      <div><img src="assets/brand/logo-horizontal-reverse.svg" alt="Bizcom Legal" width="160" height="42"><p>A Victorian law firm delivering practical, trusted advice across commercial, property, family law and dispute resolution.</p></div>
      <div><h4>Pages</h4>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="privacy.html">Privacy Policy</a></div>
      <div><h4>Practice areas</h4>${AREAS.map(a => `<a href="services.html#${a.id}">${esc(a.t)}</a>`).join('')}</div>
      <div><h4>Contact</h4><a href="${TEL}">${PHONE}</a><a href="${MOBTEL}">Mobile ${MOB}</a><a href="mailto:${EMAIL}">${EMAIL}</a><address>${ADDR}</address></div>
    </div>
    <div class="ft__auth"><span>Victorian Legal Jurisdiction</span><span>Law Institute of Victoria</span><span>Admitted — Supreme Court of Victoria</span><span>Initial consultation ${FEE_LONG}</span></div>
    <div class="ft__base"><span>© <span data-year>2026</span> Bizcom Legal. General information only — not legal advice.</span><span>Developed &amp; managed by <a href="https://viralinbound.com" target="_blank" rel="noopener">Viral Inbound</a></span></div>
  </div>
</footer>
<a class="wa" href="${WA}" target="_blank" rel="noopener" aria-label="Message Bizcom Legal on WhatsApp">${WA_SVG}</a>
<script src="script.js?v=${V}" defer></script>
</body>
</html>
`;
}

const phead = (crumb, h, p) => `
<section class="phead">
  <div class="wrap">
    <div class="crumbs"><a href="index.html">Home</a><span>/</span><span>${crumb}</span></div>
    <h1>${h}</h1>
    <p>${p}</p>
  </div>
</section>`;

/* ================= HOME ================= */
const home = `
<section class="hero">
  <div class="wrap hero__in">
    <div>
      <span class="eyebrow eyebrow--light">Wheelers Hill · Victorian law firm</span>
      <h1>Practical legal advice, <em>tailored to you.</em></h1>
      <p class="hero__lead">Trusted expertise across commercial, property, family law and dispute resolution — with clear communication and outcomes that matter.</p>
      <div class="fee"><div><small>Initial consultation</small><b>${FEE}<span>${FEE_NOTE}</span></b></div><em>Fixed fee: ${FEE_LONG}</em></div>
      <div class="hero__btns"><a class="btn btn--red btn--lg" href="#enquire">Book initial consultation <span class="nw btn__p">${FEE} ${FEE_NOTE}</span></a><a class="btn btn--ghost btn--lg" href="#practice">How we can help</a></div>
    </div>
    ${form('h', 'Connect with our lawyers', 'Speak with <em>Bizcom Legal</em>', 'Tell us about your matter. Initial consultation: ' + FEE_LONG + '.')}
  </div>
</section>

<div class="stats"><div class="wrap stats__in">
  <div class="stat"><b>2009</b><small>Admitted — Supreme Court of Victoria</small></div>
  <div class="stat"><b>5</b><small>Practice areas</small></div>
  <div class="stat"><b>VIC<span>+ 4</span></b><small>Conveyancing — NSW, QLD, WA, ACT</small></div>
  <div class="stat"><b>${FEE}<span>${FEE_NOTE}</span></b><small>Initial consultation</small></div>
</div></div>

<section class="sec" id="about">
  <div class="wrap about">
    <div class="rv">
      <span class="eyebrow">About Bizcom Legal</span>
      <h2>Your Victorian law experts.</h2>
      <p>Bizcom Legal is a Victorian law firm led by Principal Lynn Saldanha — admitted to practice as a Solicitor and Barrister in the Supreme Court in 2009. We advise on commercial law, property and conveyancing (VIC, NSW, QLD, WA &amp; ACT), family law, dispute resolution and litigation (VCAT &amp; the courts), and wills &amp; estates.</p>
      <ul class="ticks"><li>Quality advice across a range of industries</li><li>Practical, tailored advice — in plain language</li><li>Clear communication at every stage</li><li>Focused on the best outcomes for you</li></ul>
      <a class="btn btn--red" href="about.html">More about the firm ${IC.arrow}</a>
    </div>
    <aside class="cred rv" data-d="1">
      <span class="cred__k">The Principal</span>
      <h3>Lynn Saldanha</h3>
      <div class="cred__role">Principal Legal Practitioner</div>
      <p>Passionate about achieving the best outcomes for clients, with expertise across commercial law, property law, family law and dispute resolution.</p>
      <dl><div><dt>Qualifications</dt><dd>LLB, GDLP, BA</dd></div><div><dt>Admitted</dt><dd>Supreme Court, 2009</dd></div><div><dt>Conveyancing</dt><dd>VIC, NSW, QLD, WA, ACT</dd></div><div><dt>Courts &amp; tribunals</dt><dd>VCAT, Magistrates, County, Supreme</dd></div></dl>
    </aside>
  </div>
</section>

<section class="sec sec--grey" id="practice">
  <div class="wrap">
    <div class="shead rv"><span class="eyebrow eyebrow--center">Practice areas</span><h2>Tailored solutions for every legal need.</h2><p>Targeted advice across the matters Victorian businesses and families face most — all delivered with a single standard of care.</p></div>
    <div class="cards">
      ${CARDS.map(([id, ic, t, d], i) => `<article class="card rv" data-d="${i % 3}"><span class="card__i">${IC[ic]}</span><h3>${t}</h3><p>${d}</p><div class="card__links"><a class="tlink" href="services.html#${id}">Learn more ${IC.arrow}</a><a class="tlink tlink--red" href="#enquire">Enquire ${IC.arrow}</a></div></article>`).join('\n      ')}
    </div>
    <p class="fine rv">Not sure which area fits your matter? <a href="#enquire">Make a confidential enquiry</a> and we will point you in the right direction.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap forums rv">
    <h3>Courts &amp; tribunals we act in</h3>
    <div class="forums__row"><span>VCAT</span><span>Magistrates’ Court of Victoria</span><span>County Court of Victoria</span><span>Supreme Court of Victoria</span></div>
  </div>
</section>

<section class="sec sec--grey">
  <div class="wrap">
    <div class="shead rv"><span class="eyebrow eyebrow--center">How it works</span><h2>A clear path from first call to favourable outcome.</h2></div>
    <div class="steps">
      <div class="step rv"><h3>Consultation</h3><p>Contact us via phone or email. Our staff books your consultation — <b>${FEE} ${FEE_NOTE}</b> for the initial consultation — and a confirmation email is sent.</p></div>
      <div class="step rv" data-d="1"><h3>Strategise</h3><p>You receive tailored advice — clear next steps, with a focus on the results that matter to you.</p></div>
      <div class="step rv" data-d="2"><h3>Take action</h3><p>Our legal team supports you through to favourable outcomes, every step of the way.</p></div>
    </div>
  </div>
</section>

<section class="sec" id="reviews">
  <div class="wrap"><div class="shead rv"><span class="eyebrow eyebrow--center">Reviews</span><h2>Trusted by Victorian businesses and families.</h2></div></div>
  <div class="marq" aria-label="Client reviews"><div class="marq__track">${[0, 1].map(dup => TESTI.map(([q, n, r]) => `<figure class="tq"${dup ? ' aria-hidden="true"' : ''}><div class="tq__s" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“${q}”</blockquote><figcaption><b>${n}</b>${r}</figcaption></figure>`).join('')).join('')}</div></div>
</section>
${cta('#enquire')}`;

/* ================= ABOUT ================= */
const about = phead('About', 'About <em>Bizcom Legal</em>', 'A Victorian firm with a practical approach — advising on commercial law, property and conveyancing (VIC, NSW, QLD, WA &amp; ACT), family law, dispute resolution and litigation (VCAT &amp; the courts), and wills &amp; estates.') + `
<section class="sec">
  <div class="wrap about">
    <div class="rv">
      <span class="eyebrow">Our approach</span>
      <h2>Practical advice, accountable delivery.</h2>
      <p>We keep advice clear and commercial — explaining your options in plain language and staying with you through to a favourable outcome.</p>
      <ul class="ticks">${['Admitted Solicitor &amp; Barrister, Supreme Court of Victoria (2009)', 'Commercial, property, family law &amp; dispute resolution', 'Conveyancing across VIC, NSW, QLD, WA &amp; ACT', 'Litigation experience across VCAT and the courts', 'Quality advice across a range of industries', 'Estate planning, probate &amp; letters of administration', 'Clear communication at every stage', 'Focused on the best outcomes for you'].map(x => `<li>${x}</li>`).join('')}</ul>
      <a class="btn btn--red" href="contact.html#enquire">Book initial consultation <span class="nw btn__p">${FEE} ${FEE_NOTE}</span> ${IC.arrow}</a>
    </div>
    <aside class="cred rv" data-d="1">
      <span class="cred__k">The Principal</span>
      <h3>Lynn Saldanha</h3>
      <div class="cred__role">Principal Legal Practitioner — LLB, GDLP, BA</div>
      <p>Lynn Saldanha is the Principal of Bizcom Legal. Admitted to practice as a Solicitor and Barrister in the Supreme Court in 2009. Expertise in commercial law, property law, family law and dispute resolution. Passionate about achieving the best outcomes for clients.</p>
      <dl><div><dt>Admitted</dt><dd>Supreme Court, 2009</dd></div><div><dt>Conveyancing</dt><dd>VIC, NSW, QLD, WA, ACT</dd></div><div><dt>Initial consultation</dt><dd>${FEE_LONG}</dd></div></dl>
    </aside>
  </div>
</section>
<section class="sec sec--grey">
  <div class="wrap">
    <div class="shead rv"><span class="eyebrow eyebrow--center">Areas of expertise</span><h2>Across business and personal matters.</h2></div>
    <div class="cards">${AREAS.map((a, i) => `<article class="card rv" data-d="${i % 3}"><span class="card__i">${IC[a.icon]}</span><h3>${esc(a.t)}</h3><p>${a.lead}</p><div class="card__links"><a class="tlink" href="services.html#${a.id}">Learn more ${IC.arrow}</a></div></article>`).join('')}</div>
  </div>
</section>
${cta('contact.html#enquire')}`;

/* ================= SERVICES ================= */
const services = phead('Services', 'Legal services, <em>grouped by capability</em>', 'Five practice clusters covering the matters Victorian businesses and families face most — commercial, property, family law, litigation, and wills &amp; estates. One accountable practice across all of them.') + `
<nav class="subnav" aria-label="Practice clusters"><div class="wrap">${AREAS.map(a => `<a href="#${a.id}">${esc(a.t)}</a>`).join('')}</div></nav>
<section class="sec" style="padding-top:clamp(24px,3vw,40px)">
  <div class="wrap" data-spy>
    ${AREAS.map((a, i) => `<div class="svc" id="${a.id}">
      <div class="rv"><span class="svc__i">${IC[a.icon]}</span><span class="eyebrow">0${i + 1}</span><h2>${esc(a.t)}</h2><p>${a.lead}</p><a class="btn btn--red" href="contact.html#enquire">Enquire ${IC.arrow}</a></div>
      <ul class="rv" data-d="1">${a.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>`).join('\n    ')}
    <div class="feebox rv"><div><b>Initial consultation: ${FEE} <span>${FEE_NOTE}</span></b><p>Book an initial consultation and receive tailored advice with clear next steps. Fee: ${FEE_LONG}.</p></div><a class="btn btn--red btn--lg" href="contact.html#enquire">Book now ${IC.arrow}</a></div>
  </div>
</section>
${cta('contact.html#enquire')}`;

/* ================= RESOURCES ================= */
const DOCS = [
  ['Wills, estates &amp; powers of attorney', [['Making a Will in Victoria', 'What a valid will needs, executors, and keeping it up to date.'], ['Enduring Powers of Attorney — Overview', 'Financial and personal POA, when they apply, and safeguards.'], ['Estate Planning — Getting Started', 'Key documents and decisions to protect your family and assets.'], ['Probate &amp; Letters of Administration — Process Guide', 'Administering an estate, with and without a will.']]],
  ['Disputes, consumer &amp; property', [['Your Consumer Rights in Victoria', 'Guarantees, refunds and where to go when something goes wrong.'], ['Resolving Disputes — Options Before Court', 'Negotiation, mediation and VCAT pathways explained.'], ['Buying Property — Conveyancing Checklist', 'From contract review to settlement, step by step.'], ['Guarantor &amp; Private Lending — What to Know', 'Risks, protections and questions to ask before you sign.'], ['Binding Financial Agreements — Explained', 'How agreements and consent orders formalise a settlement.'], ['Commercial Leasing — Tenant &amp; Landlord Basics', 'Key terms, obligations and common pitfalls in retail/commercial leases.']]],
];
const LINKS = [['Victoria Online', 'https://www.vic.gov.au'], ['OAIC', 'https://www.oaic.gov.au'], ['VCAT', 'https://www.vcat.vic.gov.au'], ['Consumer Affairs Victoria', 'https://www.consumer.vic.gov.au'], ['Law Institute of Victoria', 'https://www.liv.asn.au'], ['Supreme Court of Victoria', 'https://www.supremecourt.vic.gov.au'], ['City of Monash', 'https://www.monash.vic.gov.au'], ['Land Use Victoria', 'https://www.land.vic.gov.au'], ['Courts Victoria', 'https://www.courts.vic.gov.au']];
const resources = phead('Resources', 'Important <em>information</em>', `The reference documents below are available free on request — by email to ${EMAIL} or in person at our office. They are general information only and not legal advice.`) + `
<section class="sec">
  <div class="wrap">
    <div class="docs">${DOCS.map(([g, list]) => `<div class="docgrp rv"><h3>${g}</h3>${list.map(([t, d]) => `<div class="doc"><div><b>${t}</b><span>${d}</span></div><a class="tlink tlink--red" href="mailto:${EMAIL}?subject=${encodeURIComponent('Document request: ' + t.replace(/&amp;/g, '&'))}">Request ${IC.arrow}</a></div>`).join('')}</div>`).join('')}</div>
  </div>
</section>
<section class="sec sec--grey">
  <div class="wrap">
    <div class="shead rv"><span class="eyebrow eyebrow--center">Helpful links</span><h2>Official Victorian &amp; Australian resources.</h2><p>External sites we are not responsible for, provided for your convenience.</p></div>
    <div class="lgrid rv">${LINKS.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}${IC.ext}</a>`).join('')}</div>
  </div>
</section>
${cta('contact.html#enquire')}`;

/* ================= CONTACT ================= */
const contact = phead('Contact', 'Get in <em>touch</em>', 'New enquiries are typically acknowledged within one business day. Call us, email us, or send an enquiry below. Initial consultation: ' + FEE_LONG + '.') + `
<section class="sec">
  <div class="wrap cgrid">
    <div>
      <div class="ccards">
        <a class="cc rv" href="${TEL}"><span class="cc__i">${IC.phone}</span><span><small>Phone</small><b>${PHONE}</b><span>Office line — Mon–Fri</span></span></a>
        <a class="cc rv" href="${MOBTEL}"><span class="cc__i">${IC.phone}</span><span><small>Mobile</small><b>${MOB}</b><span>Direct mobile</span></span></a>
        <a class="cc rv" href="mailto:${EMAIL}"><span class="cc__i">${IC.mail}</span><span><small>Email</small><b>${EMAIL}</b><span>Lynn Saldanha — Principal Legal Practitioner</span></span></a>
        <a class="cc rv" href="${WA}" target="_blank" rel="noopener"><span class="cc__i">${IC.wa}</span><span><small>WhatsApp</small><b>Message us</b><span>Quick questions welcome</span></span></a>
        <a class="cc rv" href="${MAPS}" target="_blank" rel="noopener"><span class="cc__i">${IC.pin}</span><span><small>Office</small><b>Wheelers Hill</b><span>${ADDR}</span></span></a>
      </div>
      <div class="map rv"><iframe title="Bizcom Legal office — 2 Brandon Park Drive, Wheelers Hill VIC 3150" src="https://www.google.com/maps?q=2%20Brandon%20Park%20Drive%2C%20Wheelers%20Hill%20VIC%203150&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
    ${form('c', 'Book an appointment', 'Send an <em>enquiry</em>', 'Initial consultation: ' + FEE_LONG + '. We will respond within one business day.')}
  </div>
</section>`;

/* ================= PRIVACY ================= */
const pbody = fs.readFileSync('src/privacy-body.html', 'utf8');
const toc = [...pbody.matchAll(/<section id="([^"]+)">\s*<h2>([^<]+)<\/h2>/g)].map(m => `<a href="#${m[1]}">${m[2]}</a>`).join('');
const privacy = phead('Privacy Policy', 'Privacy <em>policy</em>', 'How Bizcom Legal collects, uses, stores, secures and discloses personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). Last updated: 2026.') + `
<section class="sec"><div class="wrap legal"><nav class="toc" data-toc aria-label="On this page">${toc}</nav><div class="prose">${pbody}</div></div></section>`;

const pages = [
  { file: 'index.html', title: 'Bizcom Legal | Commercial, Property &amp; Dispute Resolution — Wheelers Hill, VIC', desc: `Bizcom Legal — a Victorian law firm led by Principal Lynn Saldanha. Commercial, property, family law, litigation, wills and estates. Initial consultation ${FEE_LONG}.`, body: home },
  { file: 'about.html', title: 'About | Bizcom Legal', desc: 'About Bizcom Legal and Principal Lynn Saldanha — admitted Solicitor and Barrister, Supreme Court of Victoria (2009).', body: about },
  { file: 'services.html', title: 'Services | Bizcom Legal', desc: 'Commercial, property, family law, litigation and wills & estates — one accountable Victorian practice.', body: services },
  { file: 'resources.html', title: 'Resources | Bizcom Legal', desc: 'Free reference documents on request and helpful official Victorian and Australian links.', body: resources },
  { file: 'contact.html', title: 'Contact | Bizcom Legal', desc: `Contact Bizcom Legal — ${PHONE}, ${EMAIL}. Initial consultation ${FEE_LONG}.`, body: contact },
  { file: 'privacy.html', title: 'Privacy Policy | Bizcom Legal', desc: 'How Bizcom Legal handles personal information under the Privacy Act 1988 (Cth) and the APPs.', body: privacy },
];
for (const p of pages) fs.writeFileSync(p.file, page(p));
console.log('built', pages.map(p => p.file).join(', '));
