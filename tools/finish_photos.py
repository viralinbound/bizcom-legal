"""
Finishing pass for the EDSR-upscaled photos (run after tools/upscale_photos.py).

EDSR gives clean, artefact-free edges but can look slightly soft. This adds the crispness back
with classic processing only (no AI): fine-detail unsharp mask, a little local contrast,
and very fine luminance grain so skin and walls read as real photographic texture.

Master = assets/img/<name>-2560.jpg  ->  rewrites 2560 / 1920 / 1280 / 800 px.
Usage:  python tools/finish_photos.py
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
PHOTOS = ["commercial-law", "property-law", "family-law", "litigation", "wills-estates"]
WIDTHS = [2560, 1920, 1280, 800]
rng = np.random.default_rng(11)


def grain(im, sigma):
    a = np.asarray(im).astype(np.float32)
    n = Image.fromarray(np.clip(rng.normal(128, sigma, a.shape[:2]), 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5))
    n = (np.asarray(n).astype(np.float32) - 128)[..., None]
    return Image.fromarray(np.clip(a + n, 0, 255).astype(np.uint8))


for name in (sys.argv[1:] or PHOTOS):
    master = Image.open(IMG / f"{name}-2560.jpg").convert("RGB")
    master = master.filter(ImageFilter.UnsharpMask(radius=1.5, percent=78, threshold=3))   # fine detail (small radius = no halos)
    master = master.filter(ImageFilter.UnsharpMask(radius=18, percent=14, threshold=0))    # clarity
    master = ImageEnhance.Contrast(master).enhance(1.03)
    for w in WIDTHS:
        im = master if w == 2560 else master.resize((w, w), Image.LANCZOS)
        if w < 2560:
            im = im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=35, threshold=1))   # restore crispness after resize
        im = grain(im, 1.6 if w >= 1920 else 1.2)
        im.save(IMG / f"{name}-{w}.jpg", "JPEG", quality=86, optimize=True, progressive=True, subsampling=0)
    print(name, "finished", flush=True)
