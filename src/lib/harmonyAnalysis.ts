// Pure harmony analysis — shared by the Lab harmony meter.
// Kept free of React so every surface computes the same values.
import { hexToRgb, rgbToHsl } from './colorUtils';

export const NEUTRAL_SAT_THRESHOLD = 12;

export type PairKey =
  | 'mono'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'splitComp'
  | 'tetradic'
  | 'contrast';

export interface HarmonyBar {
  key: PairKey;
  pct: number;
}

export interface PrimaryRelation {
  color: string;
  key: PairKey | 'neutral';
  diff: number | null;
}

export interface HarmonyAnalysis {
  isNeutralPalette: boolean;
  chromaticColors: number;
  chromaticPairs: number;
  bars: HarmonyBar[];
  dominant: HarmonyBar | null;
  score: number;
  verdict: 'strong' | 'mixed' | 'eclectic';
  relations: PrimaryRelation[];
  primaryColor: string;
}

// How well each relation fits recognized color theory. "Contrast" pairs
// (random hue gaps) score low and pull the overall score down.
const PAIR_WEIGHTS: Record<PairKey, number> = {
  mono: 1,
  analogous: 1,
  complementary: 0.95,
  triadic: 0.9,
  splitComp: 0.85,
  tetradic: 0.85,
  contrast: 0.3,
};

export function hueDiff(a: number, b: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, 360 - d);
}

export function classifyHueDiff(diff: number): PairKey {
  if (diff <= 15) return 'mono';
  if (diff <= 40) return 'analogous';
  if (diff >= 165 && diff <= 195) return 'complementary';
  if (diff >= 110 && diff <= 130) return 'triadic';
  if ((diff >= 140 && diff <= 160) || (diff >= 200 && diff <= 220)) return 'splitComp';
  if (diff >= 80 && diff <= 100) return 'tetradic';
  return 'contrast';
}

export function isNeutral(hex: string): boolean {
  return rgbToHsl(...hexToRgb(hex))[1] < NEUTRAL_SAT_THRESHOLD;
}

export function analyzeHarmony(colors: string[]): HarmonyAnalysis {
  const list = colors.length ? colors : ['#E63946'];
  const chromatic = list.filter((c) => !isNeutral(c));
  const primaryColor = list[0];
  const primaryHue = rgbToHsl(...hexToRgb(primaryColor))[0];

  const relations: PrimaryRelation[] = list.slice(1).map((c) => {
    if (isNeutral(c)) return { color: c, key: 'neutral' as const, diff: null };
    const diff = hueDiff(primaryHue, rgbToHsl(...hexToRgb(c))[0]);
    return { color: c, key: classifyHueDiff(diff), diff: Math.round(diff) };
  });

  // Neutrals carry no hue, so they never enter the pair math — otherwise a
  // white or grey background dilutes every percentage into meaningless noise.
  const counts = new Map<PairKey, number>();
  let chromaticPairs = 0;
  let weighted = 0;
  for (let i = 0; i < chromatic.length; i++) {
    for (let j = i + 1; j < chromatic.length; j++) {
      const h1 = rgbToHsl(...hexToRgb(chromatic[i]))[0];
      const h2 = rgbToHsl(...hexToRgb(chromatic[j]))[0];
      const key = classifyHueDiff(hueDiff(h1, h2));
      counts.set(key, (counts.get(key) ?? 0) + 1);
      chromaticPairs++;
      weighted += PAIR_WEIGHTS[key];
    }
  }

  const bars: HarmonyBar[] = chromaticPairs
    ? [...counts.entries()]
        .map(([key, n]) => ({ key, pct: Math.round((n / chromaticPairs) * 100) }))
        .sort((a, b) => b.pct - a.pct)
    : [];

  const score = chromaticPairs ? Math.round((weighted / chromaticPairs) * 100) : 0;
  const verdict = score >= 70 ? 'strong' : score >= 55 ? 'mixed' : 'eclectic';

  return {
    isNeutralPalette: chromatic.length < 2,
    chromaticColors: chromatic.length,
    chromaticPairs,
    bars,
    dominant: bars[0] ?? null,
    score,
    verdict,
    relations,
    primaryColor,
  };
}
