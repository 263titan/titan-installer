// @titan/common colorimetry — canonical, framework-free color science helpers.
//
// This is the single source of truth for color-difference math across the
// TypeScript workspace. Consumers should import from here (via the `@titan/common`
// barrel) instead of reproducing the formulas locally.

/** CIE L*a*b* color in D50-adapted space. */
export interface Lab {
  L: number;
  a: number;
  b: number;
}

/**
 * CIEDE2000 color difference between two Lab colors (Sharma/Wu/Dalal 2005).
 *
 * Faithful implementation including the zero-chroma guards:
 * when `C1p * C2p === 0` the hue-difference and mean-hue terms are handled
 * specially so neutral/achromatic samples (a* = b* = 0, or either chroma zero)
 * do not produce `NaN` or spurious hue contributions.
 */
export function deltaE2000(lab1: Lab, lab2: Lab): number {
  const kL = 1; const kC = 1; const kH = 1;
  const L1 = lab1.L; const a1 = lab1.a; const b1 = lab1.b;
  const L2 = lab2.L; const a2 = lab2.a; const b2 = lab2.b;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cb, 7) / (Math.pow(Cb, 7) + Math.pow(25, 7))));
  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const h1p = Math.atan2(b1, a1p) * 180 / Math.PI;
  const h2p = Math.atan2(b2, a2p) * 180 / Math.PI;
  const h1pDeg = h1p < 0 ? h1p + 360 : h1p;
  const h2pDeg = h2p < 0 ? h2p + 360 : h2p;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp: number;
  if (C1p * C2p === 0) dhp = 0;
  else if (Math.abs(h2pDeg - h1pDeg) <= 180) dhp = h2pDeg - h1pDeg;
  else if (h2pDeg - h1pDeg > 180) dhp = h2pDeg - h1pDeg - 360;
  else dhp = h2pDeg - h1pDeg + 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * Math.PI / 360);
  const Lb = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp: number;
  if (C1p * C2p === 0) hbp = h1pDeg + h2pDeg;
  else if (Math.abs(h1pDeg - h2pDeg) <= 180) hbp = (h1pDeg + h2pDeg) / 2;
  else if (h1pDeg + h2pDeg < 360) hbp = (h1pDeg + h2pDeg + 360) / 2;
  else hbp = (h1pDeg + h2pDeg - 360) / 2;
  const T = 1 - 0.17 * Math.cos((hbp - 30) * Math.PI / 180) + 0.24 * Math.cos(2 * hbp * Math.PI / 180)
    + 0.32 * Math.cos((3 * hbp + 6) * Math.PI / 180) - 0.20 * Math.cos((4 * hbp - 63) * Math.PI / 180);
  const SL = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2);
  const SC = 1 + 0.045 * Cbp;
  const SH = 1 + 0.015 * Cbp * T;
  const RT = -2 * Math.sqrt(Math.pow(Cbp, 7) / (Math.pow(Cbp, 7) + Math.pow(25, 7))) * Math.sin(60 * Math.exp(-Math.pow((hbp - 275) / 25, 2)) * Math.PI / 180);
  return Math.sqrt((dLp / (kL * SL)) ** 2 + (dCp / (kC * SC)) ** 2 + (dHp / (kH * SH)) ** 2 + RT * (dCp / (kC * SC)) * (dHp / (kH * SH)));
}

// ── Spectral — 36-band (380–730 nm, 10 nm) canonical ────────────────────────
// Mirrors `engines/titancolor/src/spectral.rs` (SPECTRAL_BANDS = 36).
// These are the single source of truth for TS spectral work; consumer
// pipelines should import from here via `@titan/common` instead of
// hard-coding 31-band (400–700 nm) tables.

/** Number of spectral bands (380–730 nm at 10 nm). */
export const SPECTRAL_BANDS = 36 as const;
/** First band centre wavelength (nm). */
export const SPECTRAL_START_NM = 380 as const;
/** Last band centre wavelength (nm). */
export const SPECTRAL_END_NM = 730 as const;
/** Band step (nm). */
export const SPECTRAL_STEP_NM = 10 as const;

/** CIE 1931 2° standard observer X (380–730 nm, 36). Source: spectral.rs. */
export const OBSERVER_X_36: readonly number[] = [
  0.0014, 0.0042, 0.0143, 0.0435, 0.1344, 0.2839, 0.3483, 0.3362, 0.2908, 0.1954,
  0.0956, 0.0320, 0.0049, 0.0093, 0.0633, 0.1655, 0.2904, 0.4334, 0.5945, 0.7621,
  0.9163, 1.0263, 1.0622, 1.0026, 0.8544, 0.6424, 0.4479, 0.2835, 0.1649, 0.0874,
  0.0468, 0.0227, 0.0114, 0.0058, 0.0029, 0.0014,
] as const;

/** CIE 1931 2° standard observer Y (380–730 nm, 36). */
export const OBSERVER_Y_36: readonly number[] = [
  0.0000, 0.0001, 0.0004, 0.0012, 0.0040, 0.0116, 0.0230, 0.0380, 0.0600, 0.0910,
  0.1390, 0.2080, 0.3230, 0.5030, 0.7100, 0.8620, 0.9540, 0.9950, 0.9950, 0.9520,
  0.8700, 0.7570, 0.6310, 0.5030, 0.3810, 0.2650, 0.1750, 0.1070, 0.0610, 0.0320,
  0.0170, 0.0082, 0.0041, 0.0021, 0.0010, 0.0005,
] as const;

/** CIE 1931 2° standard observer Z (380–730 nm, 36). */
export const OBSERVER_Z_36: readonly number[] = [
  0.0065, 0.0201, 0.0679, 0.2074, 0.6456, 1.3856, 1.7471, 1.7721, 1.6692, 1.2876,
  0.8130, 0.4652, 0.2720, 0.1582, 0.0782, 0.0422, 0.0203, 0.0087, 0.0039, 0.0013,
  0.0004, 0.0001, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000,
  0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000,
] as const;

/** CIE illuminant D65 SPD (380–730 nm, 36). Normalized to 100 at 560 nm. */
export const ILLUMINANT_D65_36: readonly number[] = [
  49.98, 54.65, 82.75, 91.49, 93.43, 86.68, 104.86, 117.01, 117.81, 114.86, 115.92,
  108.81, 109.35, 107.80, 104.79, 107.69, 104.41, 104.05, 100.0, 96.33, 95.79, 88.69,
  90.01, 89.60, 87.70, 83.29, 83.70, 80.03, 80.21, 82.28, 78.28, 69.72, 71.61, 74.35,
  61.60, 69.89,
] as const;

/** CIE illuminant D50 SPD (380–730 nm, 36). Normalized to 100 at 560 nm. */
export const ILLUMINANT_D50_36: readonly number[] = [
  24.49, 29.87, 49.31, 56.51, 60.03, 57.82, 74.83, 87.25, 90.61, 91.37, 95.11, 91.96,
  95.72, 96.61, 97.13, 102.10, 100.75, 102.32, 100.0, 97.73, 98.92, 93.50, 97.69, 99.27,
  99.04, 95.72, 98.86, 95.67, 98.19, 103.00, 99.13, 87.38, 91.60, 92.89, 76.85, 86.51,
] as const;

/** Illuminant A SPD (380–730 nm, 36). */
export const ILLUMINANT_A_36: readonly number[] = [
  9.84, 12.09, 14.78, 17.99, 21.82, 26.31, 31.53, 37.55, 44.46, 52.32, 61.16, 71.03,
  82.00, 94.10, 107.40, 121.90, 137.60, 154.60, 172.80, 192.40, 213.20, 235.30, 258.70,
  283.30, 309.20, 336.20, 364.40, 393.80, 424.30, 455.80, 488.40, 522.00, 556.50,
  591.90, 628.20, 665.30,
] as const;

/** Illuminant F11 (TL84) SPD (380–730 nm, 36). */
export const ILLUMINANT_F11_36: readonly number[] = [
  18.47, 22.87, 19.62, 33.43, 40.11, 36.28, 53.71, 61.24, 60.38, 61.52, 71.62, 74.37,
  82.88, 84.42, 86.39, 88.97, 92.10, 95.47, 95.15, 93.10, 94.82, 96.14, 96.97, 96.92,
  97.38, 99.17, 100.00, 98.72, 95.96, 94.62, 93.68, 93.14, 92.10, 91.52, 90.71, 90.00,
] as const;

/** LED 3000K SPD (380–730 nm, 36). */
export const ILLUMINANT_LED_3000K_36: readonly number[] = [
  4.20, 6.80, 10.50, 14.20, 16.90, 18.40, 19.80, 21.50, 23.80, 28.30, 36.50, 50.20,
  62.80, 72.40, 78.10, 80.20, 79.50, 76.80, 73.40, 70.20, 68.10, 66.50, 64.20, 61.80,
  58.30, 54.10, 49.20, 44.00, 39.10, 34.80, 31.20, 28.40, 25.60, 22.80, 20.10, 18.50,
] as const;
