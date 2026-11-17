// Bizcom Legal — "Quiet Luxury" static builder.  Run: node build.mjs
import fs from 'node:fs';

const V = '2.6';
const PHONE = '+61 3 9108 4865', TEL = 'tel:+61391084865', MOB = '+61 421 327 828', MOBTEL = 'tel:+61421327828';
const EMAIL = 'lynn@bizcomlegal.com.au', WA = 'https://wa.me/61414822108';
const ADDR = 'Suite 25, Third Floor, 2 Brandon Park Drive, Wheelers Hill VIC 3150';
const ar = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const arL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
const plus = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const esc = s => s.replace(/&(?![a-z#0-9]+;)/g, '&amp;');

const NAV = [['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'], ['resources.html', 'Resources'], ['contact.html', 'Contact']];

const AREAS = [
  { id: 'commercial', t: 'Commercial', full: 'Business & Commercial', img: 'commercial-law',
    lead: 'Day-to-day and transactional counsel that keeps your business moving — from formation documents through to recovery and disputes.',
    items: ['Business Conveyancing', 'Leases & Licensing', 'Contracts', 'E-commerce policies', 'Dispute Resolution', 'Debt Collection', 'Franchising', 'Employment law'] },
  { id: 'property', t: 'Property', full: 'Property', img: 'property-law',
    lead: 'Conveyancing and property advisory across the eastern states, including guidance for investors and lenders.',
    items: ['Conveyancing — VIC, NSW, QLD, WA, ACT', 'Investment property', 'Guarantor & private lending advice'] },
  { id: 'family-law', t: 'Family Law', full: 'Family Law', img: 'family-law',
    lead: 'Considered, supportive advice on financial and parenting matters — formalised properly and built to last.',
    items: ['Property settlements', 'Binding Financial Agreements / Consent Orders', 'Parenting & Child Support'] },
  { id: 'litigation', t: 'Litigation', full: 'Litigation', img: 'litigation',
    lead: 'Representation and dispute resolution across Victorian tribunals and courts, at every level.',
    items: ['VCAT', 'Magistrates, County & Supreme Court of Victoria', 'Small Claims & Consumer Law'] },
  { id: 'wills-estates', t: 'Wills & Estates', full: 'Wills & Estates', img: 'wills-estates',
    lead: 'Estate planning and administration handled with care — from your will today to probate when it matters.',
    items: ['Wills & Powers of Attorney', 'Estate Planning', 'Probate', 'Letters of Administration'] },
];
const TESTI = [
  [1, 'Lynn provided clear, practical advice on our commercial lease…', 'J. Mitchell', 'Small business owner'],
  [2, 'We needed help with a property settlement and wills…', 'S. Chen', 'Client'],
  [3, 'Professional, knowledgeable and focused on the best outcome…', 'M. Roberts', 'Property client'],
  [5, 'Bizcom Legal helped us navigate a complex commercial dispute…', 'D. Thompson', 'Business owner'],
  [6, 'Lynn made the process of updating our wills simple…', 'K. Williams', 'Estate planning client'],
  [7, 'Outstanding property law advice…', 'R. Anderson', 'Property investor'],
  [8, 'Professional, efficient, and results-driven…', 'L. Martinez', 'Corporate client'],
  [9, 'Highly recommend Bizcom Legal for commercial law…', 'T. Brown', 'Entrepreneur'],
];
const pad = n => String(n).padStart(2, '0');
const lines = (arr, tag = 'h1', cls = '') => `<${tag} class="lines ${cls}">${arr.map((l, i) => `<span class="ln"><span style="transition-delay:${i * 0.08}s">${l}</span></span>`).join('')}</${tag}>`;

const form = id => `
<div class="fcard rv">
<div class="fcard__h"><h3>Send a <i>confidential</i> enquiry</h3></div>
<p class="fcard__p">Tell us about your matter. We will respond within one business day.</p>
<form class="form" data-form novalidate aria-label="Confidential enquiry">
  <div class="fgrid">
    <div class="f"><label for="${id}-name">Full name <span class="req">*</span></label><input id="${id}-name" name="name" autocomplete="name" required placeholder="Jane Doe"><span class="f__err"></span></div>
    <div class="f"><label for="${id}-email">Email <span class="req">*</span></label><input id="${id}-email" name="email" type="email" autocomplete="email" required placeholder="jane@example.com"><span class="f__err"></span></div>
    <div class="f"><label for="${id}-phone">Phone <span class="req">*</span></label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required placeholder="04xx xxx xxx"><span class="f__err"></span></div>
    <div class="f"><label for="${id}-area">Area of enquiry <span class="req">*</span></label><select id="${id}-area" name="area" required><option value="">Select…</option>${AREAS.map(a => `<option>${esc(a.t)}</option>`).join('')}<option>Other</option></select><span class="f__err"></span></div>
    <div class="f f--full"><label for="${id}-time">Preferred contact time</label><select id="${id}-time" name="time"><option>Anytime</option><option>Morning (9am–12pm)</option><option>Afternoon (12pm–5pm)</option><option>Evening (5pm–7pm)</option></select></div>
    <div class="f f--full"><label for="${id}-msg">Brief description of your matter</label><textarea id="${id}-msg" name="message" placeholder="A few lines about what you need help with…"></textarea></div>
  </div>
  <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0">
  <p class="form__status" data-status role="alert"></p>
  <div class="form__foot">
    <p class="form__note">Confidential. By submitting you agree to our <a href="privacy.html">Privacy Policy</a> and consent to us contacting you about your enquiry.</p>
    <button class="pill pill--ink" type="submit">Send request ${ar}</button>
  </div>
</form>
<div class="fcard__trust"><span>Confidential</span><span>Reply within 1 business day</span></div>
<div class="form__ok" role="status" aria-live="polite"><span class="lbl"><i class="dot"></i>Received</span><h4>Thank you — your enquiry has been received.</h4><p>A member of the Bizcom Legal team will respond within one business day.</p></div>
</div>`;

const talk = (n, head = ['Let’s talk', '<i class=\"m\">about your matter.</i>']) => `
<section class="sec sec--alt" id="enquire">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°${n}</span><span class="lbl lbl--mute">Get in touch</span><p class="rv">New enquiries are typically acknowledged within one business day. Tell us what you need — we will point you in the right direction.</p></div>
    <div class="talk">
      ${lines(head, 'h2', 'talk__h')}
      <div class="talk__info rv">
        <a class="big ulink" href="mailto:${EMAIL}">${EMAIL}</a>
        <a class="big" href="${TEL}">${PHONE}</a>
        <ul class="rows"><li><span>Mobile</span><a href="${MOBTEL}">${MOB}</a></li><li><span>WhatsApp</span><a href="${WA}" target="_blank" rel="noopener">Message us</a></li><li><span>Office</span><span style="text-align:right;max-width:24ch">${ADDR}</span></li></ul>
      </div>
      <div class="talk__form">${form(n)}</div>
    </div>
  </div>
</section>`;

const page = ({ file, title, desc, body }) => `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="assets/brand/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=${V}">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="hd" data-hd>
  <div class="wrap hd__in">
    <a class="hd__logo" href="index.html" aria-label="Bizcom Legal — home"><img src="assets/brand/logo-horizontal.svg" alt="Bizcom Legal" width="120" height="30"></a>
    <nav class="hd__nav" aria-label="Primary">${NAV.map(([h, t]) => `<a href="${h}"${h === file ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
    <div class="hd__cta"><a class="pill pill--line" href="${TEL}">${PHONE}</a><a class="pill pill--ink" href="contact.html">Book a consultation</a><button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="sheet" data-menu><i></i></button></div>
  </div>
</header>
<div class="sheet" id="sheet" aria-hidden="true">
  ${NAV.map(([h, t], i) => `<a class="big" href="${h}">${t}<small>N°${pad(i + 1)}</small></a>`).join('')}
  <div class="sheet__foot"><a class="pill pill--ink" href="contact.html">Book a consultation</a><a class="pill" href="${TEL}">${PHONE}</a></div>
</div>
<main id="main">
${body}
</main>
<footer class="ft">
  <div class="wrap">
    <div class="ft__hero">
      <p class="ft__big rv">Practical. Trusted.<br><i class="m">Clear outcomes</i><i class="blade" aria-hidden="true"></i></p>
      <a class="pill pill--ink rv" data-d="1" href="contact.html">Book a consultation ${ar}</a>
    </div>
    <div class="ft__cols">
      <div><img class="ft__logo" src="assets/brand/logo-horizontal.svg" alt="Bizcom Legal" loading="lazy"><p>A Victorian law firm delivering practical, trusted advice across commercial, property, family law and dispute resolution.</p></div>
      <div><h4>Pages</h4>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="privacy.html">Privacy</a></div>
      <div><h4>Practice</h4>${AREAS.map(a => `<a href="services.html#${a.id}">${esc(a.t)}</a>`).join('')}</div>
      <div><h4>Office</h4><a href="${TEL}">${PHONE}</a><a href="${MOBTEL}">${MOB}</a><a href="mailto:${EMAIL}">${EMAIL}</a><address>${ADDR}</address></div>
    </div>
    <div class="ft__base"><span>© <span data-year>2026</span> Bizcom Legal — General information only, not legal advice</span><span>Admitted — Supreme Court of Victoria · LIV</span><span>By <a href="https://viralinbound.com" target="_blank" rel="noopener">Viral Inbound</a></span></div>
  </div>
</footer>
<a class="wa" href="${WA}" target="_blank" rel="noopener" aria-label="Message Bizcom Legal on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.23-3.28-.68-2.78-1.1-4.55-3.95-4.69-4.13-.14-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.27.55-.34.73-.34l.52.01c.17 0 .39-.06.61.47.24.55.8 1.92.87 2.06.07.14.12.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.06.11.06.66-.18 1.33z"/></svg></a>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="script.js?v=${V}" defer></script>
</body>
</html>
`;

const phead = (n, crumb, h, p) => `
<section class="phead">
  <div class="wrap">
    <div class="phead__meta"><span class="lbl">N°${n}</span><span class="lbl lbl--mute">Bizcom Legal / ${crumb}</span></div>
    ${lines(h)}
    <div class="phead__p"><p class="rv">${p}</p></div>
  </div>
</section>`;

/* ================= HOME ================= */
const home = `
<section class="hero">
  <div class="wrap">
    <div class="hero__meta"><span class="lbl">N°000</span><span class="lbl lbl--mute">Victorian law firm — Wheelers Hill, VIC</span><span class="lbl lbl--mute">Admitted — Supreme Court, 2009</span></div>
    <h1 class="mega" aria-label="Bizcom">${'Bizcom'.split('').map((c, i) => `<span class="ch" aria-hidden="true"><span style="transition-delay:${0.15 + i * 0.06}s">${c}</span></span>`).join('')}<i class="blade" aria-hidden="true"></i></h1>
    <div class="hero__row">
      <p class="hero__h rv">Commercial, Property &amp; Dispute Resolution. <span>Practical legal advice, tailored to you.</span></p>
      <div class="hero__side rv" data-d="1">
        <p>Trusted expertise across commercial, property and dispute resolution. Clear communication and outcomes that matter.</p>
        <div class="hero__btns"><a class="pill pill--ink" href="contact.html">Book a consultation ${ar}</a><a class="pill" href="${TEL}">${PHONE}</a></div>
      </div>
    </div>
    <figure class="frame frame--hero" data-frame><img src="assets/commercial-law.png" alt="Bizcom Legal advising clients in a boardroom" fetchpriority="high" data-par><span class="pill frame__pill">Practical · Trusted · Clear</span>
      <figcaption class="frame__cap"><span class="lbl">Lynn Saldanha — Principal Legal Practitioner</span><span class="lbl">LLB · GDLP · BA</span></figcaption></figure>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°001</span><span class="lbl lbl--mute">The firm</span></div>
    <div class="state">
      <p class="state__t" data-fill>Lynn Saldanha is the Principal of Bizcom Legal — admitted to practice as a Solicitor and Barrister in the Supreme Court in <em data-red>2009,</em> with expertise across commercial law, property law, family law and dispute resolution.</p>
      <div class="state__foot rv"><span class="pill pill--line">Quality advice across a range of industries</span><span class="pill pill--line">Focused on the best outcomes for you</span><a class="pill pill--ink" href="about.html">About the firm ${ar}</a></div>
    </div>
  </div>
</section>

<section class="sec--tight" id="practice">
  <div class="wrap">
    <div class="ptitle rv"><h2>Practice</h2></div>
    <figure class="frame frame--band" data-frame><img src="assets/property-law.png" alt="" data-par loading="lazy">
      <figcaption class="frame__cap"><p class="frame__q">Five capabilities, one accountable practice.</p><span class="lbl">From boardroom to settlement</span></figcaption></figure>
  </div>
</section>

<section class="sec" style="padding-top:clamp(28px,3.4vw,52px)">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°002</span><span class="lbl lbl--mute">Practice areas</span><p class="rv">Targeted advice across the matters Victorian businesses and families face most. Open any area to see what it covers.</p></div>
    <div class="acc" data-acc>
      ${AREAS.map((a, i) => `<div class="acc__i${i === 0 ? ' open' : ''}">
        <button class="acc__h" aria-expanded="${i === 0}"><span class="acc__n">${pad(i + 1)}</span><span class="acc__t">${esc(a.t)}</span><span class="acc__x">${plus}</span></button>
        <div class="acc__b"><div><div class="acc__body">
          <div class="acc__img"><img src="assets/${a.img}.png" alt="" loading="lazy"></div>
          <div class="acc__txt"><p>${a.lead}</p><ul class="rows">${a.items.map((x, k) => `<li><span>${esc(x)}</span><span>${pad(k + 1)}</span></li>`).join('')}</ul><a class="pill pill--ink" style="align-self:flex-start" href="services.html#${a.id}">Explore ${esc(a.t.toLowerCase())} ${ar}</a></div>
        </div></div></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°003</span><span class="lbl lbl--mute">How it works</span><p class="rv">A clear path from first call to favourable outcome.</p></div>
    <div class="proc">
      <article class="proc__c rv"><span class="proc__n">01</span><div><h3>Consultation</h3><p>Contact us via phone or email. Our staff books your consultation and a confirmation email is sent.</p></div></article>
      <article class="proc__c rv" data-d="1"><span class="proc__n">02</span><div><h3>Strategise</h3><p>You receive tailored advice — clear next steps, with a focus on the results that matter to you.</p></div></article>
      <article class="proc__c rv" data-d="2"><span class="proc__n">03</span><div><h3>Take action</h3><p>Our legal team supports you through to favourable outcomes, every step of the way.</p></div></article>
    </div>
  </div>
</section>

<section class="sec--tight">
  <div class="wrap">
    <figure class="frame frame--band" data-frame><img src="assets/litigation.png" alt="" data-par loading="lazy"><span class="pill frame__pill">The Bizcom approach</span>
      <figcaption class="frame__cap"><p class="frame__q">Quality advice across a range of industries — focused on the best outcomes for you.</p></figcaption></figure>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°004</span><span class="lbl lbl--mute">The Principal</span></div>
    <div class="lynn">
      ${lines(['Lynn', 'Saldanha'], 'h2', 'lynn__name')}
      <div class="lynn__side rv"><p>Principal Legal Practitioner — LLB, GDLP, BA. Admitted as a Solicitor and Barrister in the Supreme Court in 2009. Passionate about achieving the best outcomes for clients.</p>
        <ul class="rows"><li><span>Supreme Court admission</span><span>2009</span></li><li><span>Conveyancing</span><span>VIC NSW QLD WA ACT</span></li><li><span>Courts &amp; tribunals</span><span>VCAT · Mag · County · Supreme</span></li></ul></div>
    </div>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°005</span><span class="lbl lbl--mute">What clients say</span></div>
  </div>
  <div class="marq" aria-label="Client testimonials">
    <div class="marq__track">${[0, 1].map(dup => TESTI.map(([i, q, n, r]) => `<figure class="tq"${dup ? ' aria-hidden="true"' : ''}><blockquote>“${q}”</blockquote><figcaption><img src="assets/testimonial-${i}.png" alt="" loading="lazy" width="44" height="44"><div><b>${n}</b><span>${r}</span></div></figcaption></figure>`).join('')).join('')}</div>
  </div>
  <div class="wrap">
</section>
${talk('006')}`;

/* ================= ABOUT ================= */
const about = phead('01', 'About', ['Bizcom’s', '<i class=\"m\">legal expertise</i>'], 'A Victorian firm with a practical approach — advising on commercial law, property and conveyancing (VIC, NSW, QLD, WA &amp; ACT), family law, dispute resolution and litigation (VCAT &amp; the courts), and wills &amp; estates.') + `
<section class="sec--tight"><div class="wrap"><figure class="frame frame--band" data-frame><img src="assets/family-law.png" alt="" data-par><span class="pill frame__pill">Admitted — Supreme Court, 2009</span></figure></div></section>
<section class="sec">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°002</span><span class="lbl lbl--mute">The Principal</span></div>
    <div class="lynn">
      ${lines(['Lynn', 'Saldanha'], 'h2', 'lynn__name')}
      <div class="lynn__side rv"><p>Lynn Saldanha is the Principal of Bizcom Legal. Admitted to practice as a Solicitor and Barrister in the Supreme Court in 2009. Expertise in commercial law, property law, family law and dispute resolution. Passionate about achieving the best outcomes for clients.</p><a class="pill pill--ink" href="contact.html">Arrange a consultation ${ar}</a></div>
    </div>
  </div>
</section>
<section class="sec sec--alt">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°003</span><span class="lbl lbl--mute">Our approach</span><p class="rv">We keep advice clear and commercial — explaining your options in plain language and staying with you through to a favourable outcome.</p></div>
    <p class="state__t" data-fill style="margin-bottom:clamp(22px,3vw,44px)">Practical advice, <em data-red>accountable delivery.</em></p>
    <div class="two"><div></div><ul class="rows rv">${['Admitted Solicitor &amp; Barrister, Supreme Court of Victoria (2009)', 'Commercial, property, family law &amp; dispute resolution', 'Conveyancing across VIC, NSW, QLD, WA &amp; ACT', 'Litigation experience across VCAT and the courts', 'Quality advice across a range of industries', 'Estate planning, probate &amp; letters of administration', 'Clear communication at every stage', 'Focused on the best outcomes for you'].map((x, i) => `<li><span>${x}</span><span>${pad(i + 1)}</span></li>`).join('')}</ul></div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°004</span><span class="lbl lbl--mute">The team</span><p class="rv">People behind your matter.</p></div>
    <div class="team">
      <article class="tm rv"><span class="tm__i">LS<i class="blade"></i></span><div><h3>Lynn Saldanha</h3><small>Principal Legal Practitioner</small><p>Principal of Bizcom Legal. Admitted as a Solicitor and Barrister in the Supreme Court (2009), with expertise across commercial, property, family law and dispute resolution.</p></div></article>
      <article class="tm rv" data-d="1"><span class="tm__i">JC</span><div><h3>James Chen</h3><small>Senior Lawyer</small><p>Focuses on commercial and property matters — contracts, leasing, conveyancing and business transactions for clients across a range of industries.</p></div></article>
      <article class="tm rv" data-d="2"><span class="tm__i">SM</span><div><h3>Sarah Mitchell</h3><small>Lawyer</small><p>Works across family law and dispute resolution — property settlements, agreements and parenting matters, handled with care and clarity.</p></div></article>
    </div>
  </div>
</section>
${talk('005', ['Work with', '<i class=\"m\">Bizcom Legal.</i>'])}`;

/* ================= SERVICES ================= */
const services = phead('02', 'Services', ['Legal services,', '<i class=\"m\">by capability</i>'], 'Five practice clusters covering the matters Victorian businesses and families face most — commercial, property, family law, litigation, and wills &amp; estates. One accountable practice across all of them.') + `
<nav class="subnav" aria-label="Practice areas"><div class="wrap">${AREAS.map((a, i) => `<a href="#${a.id}">${pad(i + 1)} ${esc(a.t)}</a>`).join('')}</div></nav>
<div class="wrap" data-spy>
  ${AREAS.map((a, i) => `<section class="svc" id="${a.id}">
    <div class="svc__l rv"><span class="lbl">N°${pad(i + 1)} — ${esc(a.t)}</span><h2>${esc(a.full)}</h2><p>${a.lead}</p><a class="pill pill--ink" href="contact.html">Enquire ${ar}</a></div>
    <div class="svc__r"><figure class="frame" data-frame><img src="assets/${a.img}.png" alt="${esc(a.full)}" loading="lazy" data-par></figure><ul class="rows rv">${a.items.map((x, k) => `<li><span>${esc(x)}</span><span>${pad(k + 1)}</span></li>`).join('')}</ul></div>
  </section>`).join('\n  ')}
</div>
${talk('03', ['Not sure which', '<i class=\"m\">area fits?</i>'])}`;

/* ================= RESOURCES ================= */
const DOCS = [
  ['Wills, estates &amp; powers of attorney', [['Making a Will in Victoria', 'What a valid will needs, executors, and keeping it up to date.'], ['Enduring Powers of Attorney — Overview', 'Financial and personal POA, when they apply, and safeguards.'], ['Estate Planning — Getting Started', 'Key documents and decisions to protect your family and assets.'], ['Probate &amp; Letters of Administration — Process Guide', 'Administering an estate, with and without a will.']]],
  ['Disputes, consumer &amp; property', [['Your Consumer Rights in Victoria', 'Guarantees, refunds and where to go when something goes wrong.'], ['Resolving Disputes — Options Before Court', 'Negotiation, mediation and VCAT pathways explained.'], ['Buying Property — Conveyancing Checklist', 'From contract review to settlement, step by step.'], ['Guarantor &amp; Private Lending — What to Know', 'Risks, protections and questions to ask before you sign.'], ['Binding Financial Agreements — Explained', 'How agreements and consent orders formalise a settlement.'], ['Commercial Leasing — Tenant &amp; Landlord Basics', 'Key terms, obligations and common pitfalls in retail/commercial leases.']]],
];
const LINKS = [['Victoria Online', 'https://www.vic.gov.au'], ['OAIC', 'https://www.oaic.gov.au'], ['VCAT', 'https://www.vcat.vic.gov.au'], ['Consumer Affairs Victoria', 'https://www.consumer.vic.gov.au'], ['Law Institute of Victoria', 'https://www.liv.asn.au'], ['Supreme Court of Victoria', 'https://www.supremecourt.vic.gov.au'], ['City of Monash', 'https://www.monash.vic.gov.au'], ['Land Use Victoria', 'https://www.land.vic.gov.au'], ['Courts Victoria', 'https://www.courts.vic.gov.au']];
const resources = phead('03', 'Resources', ['Important', '<i class=\"m\">information</i>'], `The reference documents below are available free on request — by email to ${EMAIL} or in person at our office. They are general information only and not legal advice.`) + `
<section class="sec" style="padding-top:0">
  <div class="wrap docs">
    ${DOCS.map(([g, list], gi) => `<div class="shead" style="margin-top:${gi ? 'clamp(36px,4.4vw,64px)' : '0'}"><span class="lbl">N°0${gi + 1}</span><span class="lbl lbl--mute">${g}</span></div>
    <ul class="rows rv">${list.map(([t, d]) => `<li><div><b>${t}</b><small>${d}</small></div><a href="mailto:${EMAIL}?subject=${encodeURIComponent('Document request: ' + t.replace(/&amp;/g, '&'))}">Request →</a></li>`).join('')}</ul>`).join('')}
  </div>
</section>
<section class="sec sec--alt">
  <div class="wrap">
    <div class="shead"><span class="lbl">N°03</span><span class="lbl lbl--mute">Helpful links</span><p class="rv">Official Victorian &amp; Australian resources. External sites we are not responsible for, provided for your convenience.</p></div>
    <div class="lgrid rv">${LINKS.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener"><span>${new URL(u).hostname.replace('www.', '')}</span>${t}</a>`).join('')}</div>
  </div>
</section>
${talk('04', ['Have a question', '<i class=\"m\">about your situation?</i>'])}`;

/* ================= CONTACT ================= */
const contact = phead('04', 'Contact', ['Get in', '<i class=\"m\">touch.</i>'], 'New enquiries are typically acknowledged within one business day. Call us, email us, or send a confidential enquiry below.') + `
<section class="sec" style="padding-top:0">
  <div class="wrap talk">
    <div class="talk__info rv">
      <a class="big ulink" href="mailto:${EMAIL}">${EMAIL}</a>
      <a class="big" href="${TEL}">${PHONE}</a>
      <ul class="rows"><li><span>Office line</span><span>Mon–Fri</span></li><li><span>Mobile</span><a href="${MOBTEL}">${MOB}</a></li><li><span>WhatsApp</span><a href="${WA}" target="_blank" rel="noopener">Quick questions welcome</a></li><li><span>Principal</span><span>Lynn Saldanha</span></li></ul>
      <div><span class="lbl lbl--mute">Office</span><p style="margin-top:8px;font-size:20px;letter-spacing:-.02em">${ADDR}</p><a class="ulink" style="display:inline-block;margin-top:10px" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('2 Brandon Park Drive, Wheelers Hill VIC 3150')}">Open in Google Maps</a></div>
      <div class="map"><iframe title="Bizcom Legal office — 2 Brandon Park Drive, Wheelers Hill VIC 3150" src="https://www.google.com/maps?q=2%20Brandon%20Park%20Drive%2C%20Wheelers%20Hill%20VIC%203150&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
    <div class="talk__form">${form('c')}</div>
  </div>
</section>`;

/* ================= PRIVACY ================= */
const pbody = fs.readFileSync('src/privacy-body.html', 'utf8');
const toc = [...pbody.matchAll(/<section id="([^"]+)">\s*<h2>([^<]+)<\/h2>/g)].map(m => `<a href="#${m[1]}">${m[2]}</a>`).join('');
const privacy = phead('05', 'Privacy', ['Privacy', '<i class=\"m\">policy</i>'], 'How Bizcom Legal collects, uses, stores, secures and discloses personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). Last updated: 2026.') + `
<section class="sec" style="padding-top:0"><div class="wrap legal"><nav class="toc" data-toc aria-label="On this page">${toc}</nav><div class="prose">${pbody}</div></div></section>`;

const pages = [
  { file: 'index.html', title: 'Bizcom Legal | Commercial, Property &amp; Dispute Resolution', desc: 'Bizcom Legal — a Victorian law firm led by Principal Lynn Saldanha. Practical, trusted advice across commercial, property, family law and dispute resolution.', body: home },
  { file: 'about.html', title: 'About | Bizcom Legal', desc: 'About Bizcom Legal and Principal Lynn Saldanha — admitted Solicitor and Barrister, Supreme Court of Victoria (2009).', body: about },
  { file: 'services.html', title: 'Services | Bizcom Legal', desc: 'Commercial, property, family law, litigation and wills & estates — one accountable Victorian practice.', body: services },
  { file: 'resources.html', title: 'Resources | Bizcom Legal', desc: 'Free reference documents on request and helpful official Victorian and Australian links.', body: resources },
  { file: 'contact.html', title: 'Contact | Bizcom Legal', desc: `Contact Bizcom Legal — ${PHONE}, ${EMAIL}.`, body: contact },
  { file: 'privacy.html', title: 'Privacy Policy | Bizcom Legal', desc: 'How Bizcom Legal handles personal information under the Privacy Act 1988 (Cth) and the APPs.', body: privacy },
];
for (const p of pages) fs.writeFileSync(p.file, page(p));
console.log('built', pages.map(p => p.file).join(', '));
