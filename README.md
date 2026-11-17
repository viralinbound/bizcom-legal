# Bizcom Legal — website

Minimal, light, premium website for **Bizcom Legal**, a Victorian law firm (Wheelers Hill, VIC) led by Principal Lynn Saldanha.

Live: https://bizcom-legal.vercel.app

## Pages
Home · About · Services · Resources · Contact · Privacy Policy

## Stack
Plain static HTML/CSS/JS — no framework, no images except the logo, fast on every device.
- `build.mjs` — generates all six pages from shared templates and content
- `styles.css` — design system (Playfair Display + Inter; red / white / grey)
- `script.js` — menu, reveal on scroll, active-section highlight, enquiry form
- `assets/brand/` — vector logo set (stacked, horizontal, reverse, monogram, favicon) and `_gen-logo.mjs`
- `src/privacy-body.html` — privacy policy content

## Edit & rebuild
```bash
node build.mjs
```
Bump `V` in `build.mjs` when CSS/JS change so browsers fetch the new files.

## Design
Corporate boutique layout (guided by the client's reference site): utility bar, hero with the enquiry form beside the headline,
practice-area cards, courts strip, reviews, red CTA band. Palette from the logo: **red, white and grey**.
Per client feedback (Nov 2026): **no photographs, no team section**, initial consultation **$350.00 plus GST** shown on the first page,
and no migration or criminal practice areas. The earlier photo-based design and its photo tooling live in git history (commit 34fed3f and earlier).

## Enquiry form
Posts to FormSubmit (`formsubmit.co/ajax/<firm email>`). The firm's inbox must confirm the one-time activation email after the first submission before enquiries are delivered.

## Deploy
```bash
npx vercel deploy --prod
```
