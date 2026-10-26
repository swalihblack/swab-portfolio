import { describe, it, expect } from 'vitest';
import {
  analyzeHarmony,
  classifyHueDiff,
  isNeutral,
  hueDiff,
} from './harmonyAnalysis';

describe('classifyHueDiff', () => {
  it('maps known hue gaps to theory relations', () => {
    expect(classifyHueDiff(0)).toBe('mono');
    expect(classifyHueDiff(30)).toBe('analogous');
    expect(classifyHueDiff(170)).toBe('complementary');
    expect(classifyHueDiff(120)).toBe('triadic');
    expect(classifyHueDiff(150)).toBe('splitComp');
    expect(classifyHueDiff(210)).toBe('splitComp');
    expect(classifyHueDiff(90)).toBe('tetradic');
    expect(classifyHueDiff(45)).toBe('contrast');
  });
});

describe('isNeutral', () => {
  it('treats greys and white as hueless', () => {
    expect(isNeutral('#FFFFFF')).toBe(true);
    expect(isNeutral('#888888')).toBe(true);
    expect(isNeutral('#FF3B3B')).toBe(false);
  });
});

describe('analyzeHarmony', () => {
  // The exact palette from the user's report: four chromatic colors + white.
  const reported = ['#FF3B3B', '#FFE600', '#00B4D8', '#FF69B4', '#FFFFFF'];

  it('excludes neutrals from pair math so they cannot dilute the percentages', () => {
    const analysis = analyzeHarmony(reported);
    // 4 chromatic colors → 6 pairs; white adds none.
    expect(analysis.chromaticPairs).toBe(6);
    const total = analysis.bars.reduce((sum, b) => sum + b.pct, 0);
    expect(total).toBeGreaterThanOrEqual(95); // rounding tolerance
  });

  it('marks a fully neutral palette and produces no bars', () => {
    const analysis = analyzeHarmony(['#FFFFFF', '#121212', '#8A8A8A']);
    expect(analysis.isNeutralPalette).toBe(true);
    expect(analysis.bars).toHaveLength(0);
    expect(analysis.dominant).toBeNull();
  });

  it('reads a single-hue palette as strong monochromatic harmony', () => {
    const analysis = analyzeHarmony(['#8B0000', '#CC1717', '#FF4D4D']);
    expect(analysis.dominant?.key).toBe('mono');
    expect(analysis.dominant?.pct).toBe(100);
    expect(analysis.score).toBe(100);
    expect(analysis.verdict).toBe('strong');
  });

  it('labels a hueless companion color as Neutral with no hue delta', () => {
    const analysis = analyzeHarmony(['#FF3B3B', '#FFFFFF']);
    expect(analysis.relations[0].key).toBe('neutral');
    expect(analysis.relations[0].diff).toBeNull();
  });

  it('labels a hueful companion with its relation and delta', () => {
    const analysis = analyzeHarmony(['#FF3B3B', '#00B4D8']);
    expect(analysis.relations[0].key).toBe('complementary');
    expect(analysis.relations[0].diff).toBe(170);
  });

  it('keeps the report palette coherent rather than eclectic', () => {
    const analysis = analyzeHarmony(reported);
    expect(analysis.score).toBeGreaterThanOrEqual(75);
    expect(analysis.verdict).toBe('strong');
  });

  it('scores scattered random hues as eclectic', () => {
    // 45° and 210° style gaps that fit no recognized scheme.
    const analysis = analyzeHarmony(['#00FF00', '#FFBF00', '#FF00BF']);
    expect(analysis.verdict).toBe('eclectic');
  });

  it('wraps hue distance across 360°', () => {
    expect(hueDiff(350, 10)).toBe(20);
  });
});
