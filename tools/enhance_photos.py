"""
Natural photo enhancement for the Bizcom Legal site — NO generative AI, NO AI upscaler.

The source photos are only 640x640. Stretched to full-width frames they look soft.
This script uses classic, predictable image processing so faces and textures stay real:

  1. de-block   : a 2x Lanczos step + a whisper of blur removes JPEG block artefacts
  2. upscale    : Lanczos resampling to each target width
  3. sharpen    : two-pass unsharp mask (fine detail + local contrast / "clarity")
  4. tone       : tiny contrast + colour lift, nothing stylised
  5. grain      : very fine luminance film grain so upscaled areas read as photographic
                  texture instead of smooth "plastic"

Outputs progressive JPEGs at 800 / 1600 / 2400 px into assets/img/ for srcset.

Usage:  python tools/enhance_photos.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = ROOT / "assets" / "img"
OUT.mkdir(exist_ok=True)

PHOTOS = ["commercial-law", "property-law", "family-law", "litigation", "wills-estates"]
WIDTHS = [800, 1600, 2400]
rng = np.random.default_rng(7)


def deblock(im: Image.Image) -> Image.Image:
    w, h = im.size
    big = im.resize((w * 2, h * 2), Image.LANCZOS)
    return big.filter(ImageFilter.GaussianBlur(0.7))


def grain(im: Image.Image, strength: float) -> Image.Image:
    a = np.asarray(im).astype(np.float32)
    n = rng.normal(0, strength, a.shape[:2]).astype(np.float32)[..., None]  # luminance-only grain
    # slightly soften the grain so it isn't digital-looking
    g = Image.fromarray(np.clip(n[..., 0] + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.45))
    n = (np.asarray(g).astype(np.float32) - 128)[..., None]
    return Image.fromarray(np.clip(a + n, 0, 255).astype(np.uint8))


def enhance(name: str) -> None:
    src = Image.open(SRC / f"{name}.png").convert("RGB")
    base = deblock(src)
    for w in WIDTHS:
        im = base.resize((w, w), Image.LANCZOS)
        scale = w / 800
        im = im.filter(ImageFilter.UnsharpMask(radius=0.9 * scale, percent=70, threshold=2))   # fine detail
        im = im.filter(ImageFilter.UnsharpMask(radius=6 * scale, percent=18, threshold=0))     # clarity
        im = ImageEnhance.Contrast(im).enhance(1.04)
        im = ImageEnhance.Color(im).enhance(1.03)
        im = grain(im, 2.2 + 0.8 * (scale - 1))
        out = OUT / f"{name}-{w}.jpg"
        im.save(out, "JPEG", quality=86, optimize=True, progressive=True, subsampling=0)
        print(f"{out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    for p in PHOTOS:
        enhance(p)
