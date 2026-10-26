// Pure analysis engine behind Varma AI — the Lab's smart suggestion panel.
// Design principle: warn only about real functional problems (text on
// background, near-duplicate colors), and always ship a concrete fix color
// with every warning instead of leaving the designer with a dead end.
import {
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  contrastRatio,
  luminance,
  assignRoles,
} from './colorUtils';
import { hueDiff, isNeutral } from './harmonyAnalysis';

export const MIN_TEXT_CONTRAST = 4.5;

export type VarmaSuggestionType = 'warning' | 'suggestion' | 'tip';

export interface VarmaSuggestion {
  type: VarmaSuggestionType;
  /** i18n key base under swabColours, e.g. 'varmaLowContrast' → Title/Desc/Fix */
  key: string;
  params: Record<string, string | number>;
  /** Proposed fix color, rendered with an "Add" button. */
  color?: string;
}

export function hexUpper(hex: string): string {
  return hex.toUpperCase();
}

/**
 * Keep the hue/sat of `fg` and slide only its lightness until `fg` on `bg`
 * reaches the WCAG target. Picks the lightness closest to the original.
 * Returns null when no lightness of that hue can reach the target.
 */
export function findContrastFix(fg: string, bg: string, target = MIN_TEXT_CONTRAST): string | null {
  const [h, s, origL] = rgbToHsl(...hexToRgb(fg));
  const viable: number[] = [];
  for (let l = 0; l <= 100; l++) {
    const candidate = rgbToHex(...hslToRgb(h, s, l));
    if (contrastRatio(candidate, bg) >= target) viable.push(l);
  }
  if (!viable.length) return null;
  const best = viable.reduce((a, b) => (Math.abs(b - origL) < Math.abs(a - origL) ? b : a));
  return rgbToHex(...hslToRgb(h, s, best));
}

/**
 * Two colors read as the same color when hue and lightness both sit close
 * together. Fix: push the second one's lightness away so they separate.
 */
export function findSimilarityFix(keep: string, adjust: string): string {
  const [h, s, l] = rgbToHsl(...hexToRgb(adjust));
  const [kH, , kL] = rgbToHsl(...hexToRgb(keep));
  const target = kL >= 50 ? Math.max(l - 28, 6) : Math.min(l + 28, 94);
  const hex = rgbToHex(...hslToRgb(h, s, target));
  // Prefer a fix that also separates hue a little when lightness alone can't.
  const lFix = Math.abs(target - kL);
  if (lFix >= 25 && contrastRatio(hex, keep) >= 1.6) return hex;
  const hueShifted = rgbToHex(...hslToRgb((kH + 30) % 360, s, target));
  return contrastRatio(hueShifted, keep) > contrastRatio(hex, keep) ? hueShifted : hex;
}

export function analyzePalette(colors: string[]): VarmaSuggestion[] {
  if (!colors.length) return [];
  const out: VarmaSuggestion[] = [];
  const roles = assignRoles(colors);
  const enriched = colors.map((hex) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    return { hex, h, s, l, lum: luminance(r, g, b) };
  });
  const primary = enriched[0];

  // 1. Functional contrast: the palette's own text role on its background.
  //    Arbitrary color-vs-color pairs are NOT checked — two mid-tone accents
  //    side by side are a design choice, not an accessibility bug.
  if (colors.length >= 2 && roles.bg !== roles.text) {
    const ratio = contrastRatio(roles.text, roles.bg);
    if (ratio < MIN_TEXT_CONTRAST) {
      out.push({
        type: 'warning',
        key: 'varmaLowContrast',
        params: {
          a: hexUpper(roles.text),
          b: hexUpper(roles.bg),
          ratio: ratio.toFixed(1),
        },
        color: findContrastFix(roles.text, roles.bg) ?? undefined,
      });
    }
  }

  // 2. Near-duplicate colors — at most one tip for the most similar pair.
  let similar: { a: string; b: string; dist: number } | null = null;
  for (let i = 0; i < enriched.length; i++) {
    for (let j = i + 1; j < enriched.length; j++) {
      const a = enriched[i];
      const b = enriched[j];
      if (isNeutral(a.hex) || isNeutral(b.hex)) continue;
      const dist = hueDiff(a.h, b.h) + Math.abs(a.l - b.l) * 1.5;
      if (hueDiff(a.h, b.h) <= 15 && Math.abs(a.l - b.l) <= 10) {
        if (!similar || dist < similar.dist) similar = { a: a.hex, b: b.hex, dist };
      }
    }
  }
  if (similar) {
    out.push({
      type: 'tip',
      key: 'varmaSimilar',
      params: { a: hexUpper(similar.a), b: hexUpper(similar.b) },
      color: findSimilarityFix(similar.a, similar.b),
    });
  }

  // 3. Overall lightness balance.
  const avgLum = enriched.reduce((sum, c) => sum + c.lum, 0) / enriched.length;
  if (avgLum < 0.12) {
    out.push({
      type: 'suggestion',
      key: 'varmaTooDark',
      params: {},
      color: rgbToHex(...hslToRgb(primary.h, Math.max(primary.s - 20, 10), 85)),
    });
  } else if (avgLum > 0.85) {
    out.push({
      type: 'suggestion',
      key: 'varmaTooLight',
      params: {},
      color: rgbToHex(...hslToRgb(primary.h, Math.min(primary.s + 10, 100), 20)),
    });
  }

  // 4. Neutrals. A missing neutral and oversaturation are the same root
  //    cause — report whichever one applies, never both.
  const hasNeutral = enriched.some((c) => c.hsl_s_safe() ?? false) as never; // placeholder removed below
  return out;
}
