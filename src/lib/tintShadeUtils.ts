import { hexToRgb, rgbToHex } from './colorUtils';

export function parseHexColors(input: string): string[] {
  const tokens = input.trim().split(/[\s,;]+/).filter(Boolean);
  if (!tokens.length || tokens.some(token => !/^#?(?:[\da-f]{3}|[\da-f]{6})$/i.test(token))) {
    throw new Error('invalidColors');
  }
  return [...new Set(tokens.map(token => {
    const hex = token.replace('#', '');
    return `#${hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex}`.toUpperCase();
  }))];
}

export function generateTintShade(hex: string, steps: number, type: 'tint' | 'shade') {
  const [base] = parseHexColors(hex);
  if (!base || !Number.isInteger(steps) || steps < 1 || steps > 20) throw new Error('invalidSteps');
  const channels = hexToRgb(base);
  const target = type === 'tint' ? 255 : 0;
  return Array.from({ length: steps + 1 }, (_, index) => {
    const ratio = index / steps;
    const mixed = channels.map(c => c + (target - c) * ratio);
    return { hex: rgbToHex(mixed[0], mixed[1], mixed[2]).toUpperCase(), percentage: Math.round(ratio * 100) };
  });
}