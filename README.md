# Bizcom Legal — website

Minimal, light, premium website for **Bizcom Legal**, a Victorian law firm (Wheelers Hill, VIC) led by Principal Lynn Saldanha.

Live: https://bizcom-legal.vercel.app

## Pages
Home · About · Services · Resources · Contact · Privacy Policy

## Stack
Plain static HTML/CSS/JS — no framework, no WebGL, fast on every device.
- `build.mjs` — generates all six pages from shared templates and content
- `styles.css` — design system (Inter Tight + Instrument Serif + IBM Plex Mono, white / ink / signal red)
- `script.js` — smooth scroll (Lenis), reveals, word-fill statements, practice accordion, enquiry form
- `assets/brand/` — vector logo set (stacked, horizontal, reverse, monogram, favicon) and `_gen-logo.mjs`
- `src/privacy-body.html` — privacy policy content

## Edit & rebuild
```bash
node build.mjs
```
Bump `V` in `build.mjs` when CSS/JS change so browsers fetch the new files.

## Photos
`tools/enhance_photos.py` turns the 640px source photos into sharp 800/1600/2400px JPEGs in `assets/img/`
using classic processing only (Lanczos upscale, de-blocking, unsharp mask, fine film grain) — no generative AI.
Pages serve them with `srcset`, so phones load the small file and Retina/4K screens the large one.
For true 4K detail, replace the sources with original high-resolution photography and re-run the script:
```bash
python tools/enhance_photos.py
```

## Enquiry form
Posts to FormSubmit (`formsubmit.co/ajax/<firm email>`). The firm's inbox must confirm the one-time activation email after the first submission before enquiries are delivered.

## Deploy
```bash
npx vercel deploy --prod
```
