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
Full-HD photos in `assets/img/` (800 / 1280 / 1920 / 2560 px), served with `srcset` so each screen gets the right size.
- `tools/upscale_photos.py` — EDSR x4 super-resolution (OpenCV `dnn_superres`): reconstructs edges from the real pixels, no generative fill.
  Needs `pip install opencv-contrib-python-headless` and `tools/models/EDSR_x4.pb` (not committed; from github.com/Saafke/EDSR_Tensorflow).
- `tools/finish_photos.py` — crisp finishing pass (small-radius sharpening, clarity, fine grain).
- `tools/enhance_photos.py` — classic Lanczos path, used for `wills-estates` because super-resolution smears tiny document text.

## Enquiry form
Posts to FormSubmit (`formsubmit.co/ajax/<firm email>`). The firm's inbox must confirm the one-time activation email after the first submission before enquiries are delivered.

## Deploy
```bash
npx vercel deploy --prod
```
