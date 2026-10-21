import { describe, expect, it } from 'vitest';
import { generateTintShade, parseHexColors } from './tintShadeUtils';

describe('tints and shades', () => {
  it('mixes shades with black while preserving the base', () => {
    const shades = generateTintShade('#42EB99', 10, 'shade');
    expect(shades[0].hex).toBe('#42EB99');
    expect(shades[5].hex).toBe('#21764D');
    expect(shades[10].hex).toBe('#000000');
  });
  it('mixes tints with white while preserving the base', () => {
    const tints = generateTintShade('#42EB99', 10, 'tint');
    expect(tints[0].hex).toBe('#42EB99');
    expect(tints[5].hex).toBe('#A1F5CC');
    expect(tints[10].hex).toBe('#FFFFFF');
  });
  it('accepts multiple hex colours and expands shorthand', () => {
    expect(parseHexColors('42eb99 #f00, #42EB99')).toEqual(['#42EB99', '#FF0000']);
    expect(() => parseHexColors('#nothex')).toThrow();
    expect(() => parseHexColors('')).toThrow();
  });
});