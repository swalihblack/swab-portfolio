import { describe, it, expect } from 'vitest';
import { analyzePalette, findContrastFix, findSimilarityFix } from './varmaAnalysis';
import { contrastRatio } from './colorUtils';

// The palette from the user's report: library pick → Varma flooded six
// dead-end "low contrast" warnings with no fixes.
const REPORTED = ['#FF3B3B', '#FFE600', '#00B4D8', '#FF69B4', '#FFFFFF'];

describe('analyzePalette', () => {
  it('never floods the report palette with contrast warnings', () => {
    const warnings = analyzePalette(REPORTED).filter((s) => s.type === 'warning');
    expect(warnings.length).toBeLessThanOrEqual(1);
  });

  it('gives the report-palette warning a fix that actually reaches 4.5:1', () => {
    const warning = analyzePalette(REPORTED).find((s) => s.key === 'varmaLowContrast');
    expect(warning).toBeDefined();
    expect(warning!.color).toBeDefined();
    const bg = warning!.params.b as string;
    expect(contrastRatio(warning!.color!, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('does not warn when text on background already passes', () => {
    const suggestions = analyzePalette(['#121212', '#FFFFFF', '#E63946']);
    expect(suggestions.some((s) => s.key === 'varmaLowContrast')).toBe(false);
  });

  it('flags a near-duplicate pair with a differentiating fix', () => {
    const suggestions = analyzePalette(['#CC1717', '#D02020']);
    const similar = suggestions.find((s) => s.key === 'varmaSimilar');
    expect(similar).toBeDefined();
    expect(similar!.color).toBeDefined();
    expect(similar!.color!.toLowerCase()).not.toBe('#cc1717');
  });

  it('flags a too-dark palette with a lighter tone to add', () => {
    const suggestions = analyzePalette(['#000000', '#0A0A0A']);
    const tooDark = suggestions.find((s) => s.key === 'varmaTooDark');
    expect(tooDark).toBeDefined();
    expect(tooDark!.color).toBeDefined();
  });

  it('proposes complementary and background starters for a single color', () => {
    const suggestions = analyzePalette(['#CC1717']);
    expect(suggestions.some((s) => s.key === 'varmaSingleComp')).toBe(true);
    expect(suggestions.some((s) => s.key === 'varmaSingleBg')).toBe(true);
  });

  it('returns no suggestions for an empty selection', () => {
    expect(analyzePalette([])).toHaveLength(0);
  });

  it('offers the 60-30-10 tip once a palette has body', () => {
    expect(analyzePalette(['#121212', '#FFFFFF', '#E63946']).some((s) => s.key === 'varmaTip603010')).toBe(true);
  });
});

describe('findContrastFix', () => {
  it('reaches the target while keeping the original hue', () => {
    const fix = findContrastFix('#FF3B3B', '#FFFFFF');
    expect(fix).not.toBeNull();
    expect(contrastRatio(fix!, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    // Same hue family (red), just darker.
    const [fr, fg, fb] = [parseInt(fix!.slice(1, 3), 16), parseInt(fix!.slice(3, 5), 16), parseInt(fix!.slice(5, 7), 16)];
    expect(fr).toBeGreaterThan(fg);
    expect(fr).toBeGreaterThan(fb);
  });

  it('darkens toward the hue when the background is light', () => {
    const fix = findContrastFix('#FF3B3B', '#FFFFFF');
    expect(fix).not.toBeNull();
    expect(contrastRatio(fix!, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    // Darker than the original red, not a lightened tint of it.
    expect(luminance(...hexToRgb(fix!))).toBeLessThan(luminance(...hexToRgb('#FF3B3B')));
  });
});

describe('findSimilarityFix', () => {
  it('separates a near-duplicate from its twin', () => {
    const fix = findSimilarityFix('#CC1717', '#D02020');
    expect(Math.abs(contrastRatio(fix, '#CC1717'))).toBeGreaterThan(1.3);
  });
});
