// ── Conversion helpers ──

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

// ── Harmony generators ──

export function getHarmonyColors(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);

  const hslToHex = (hh: number, ss: number, ll: number) => {
    const [rr, gg, bb] = hslToRgb(((hh % 360) + 360) % 360, ss, ll);
    return rgbToHex(rr, gg, bb);
  };

  return {
    complementary: [hex, hslToHex(h + 180, s, l)],
    analogous: [hslToHex(h - 30, s, l), hex, hslToHex(h + 30, s, l)],
    triadic: [hex, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
    splitComplementary: [hex, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
    tetradic: [hex, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)],
    monochromatic: [
      hslToHex(h, s, Math.max(l - 30, 5)),
      hslToHex(h, s, Math.max(l - 15, 10)),
      hex,
      hslToHex(h, s, Math.min(l + 15, 90)),
      hslToHex(h, s, Math.min(l + 30, 95)),
    ],
  };
}

// ── Contrast / readability ──

export function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrastRatio(hex1: string, hex2: string) {
  const l1 = luminance(...hexToRgb(hex1));
  const l2 = luminance(...hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function textColorForBg(hex: string): string {
  const l = luminance(...hexToRgb(hex));
  return l > 0.179 ? '#000000' : '#FFFFFF';
}

// ── Palette library ──

export const PALETTE_LIBRARY = [
  { name: 'Sunset Warmth', colors: ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D'] },
  { name: 'Ocean Depth', colors: ['#03045E', '#023E8A', '#0077B6', '#0096C7', '#48CAE4'] },
  { name: 'Forest Mist', colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#B7E4C7'] },
  { name: 'Berry Fields', colors: ['#7B2CBF', '#9D4EDD', '#C77DFF', '#E0AAFF', '#F2E5FF'] },
  { name: 'Terracotta', colors: ['#6D4C3D', '#9C6644', '#CC8B65', '#DDA15E', '#FEFAE0'] },
  { name: 'Midnight Neon', colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD'] },
  { name: 'Coral Reef', colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77', '#4D96FF'] },
  { name: 'Pastel Dream', colors: ['#FFB5E8', '#FF9CEE', '#B28DFF', '#AFF8DB', '#FFFFD1'] },
  { name: 'Monochrome', colors: ['#1A1A1A', '#3D3D3D', '#6B6B6B', '#A3A3A3', '#D9D9D9'] },
  { name: 'Retro Pop', colors: ['#E63946', '#457B9D', '#1D3557', '#F1FAEE', '#A8DADC'] },
  { name: 'Golden Hour', colors: ['#FFBA08', '#FAA307', '#E85D04', '#DC2F02', '#9D0208'] },
  { name: 'Lavender Haze', colors: ['#E6E6FA', '#D8BFD8', '#DDA0DD', '#BA55D3', '#9932CC'] },
  { name: 'Arctic Ice', colors: ['#CAF0F8', '#ADE8F4', '#90E0EF', '#48CAE4', '#00B4D8'] },
  { name: 'Warm Neutral', colors: ['#F5F0EB', '#E8DDD3', '#C9B99A', '#A68A64', '#6B4226'] },
  { name: 'Cyberpunk', colors: ['#0F0F0F', '#1A1A2E', '#E94560', '#533483', '#16213E'] },
  { name: 'Spring Meadow', colors: ['#CAFFBF', '#9BF6FF', '#FFC6FF', '#FDFFB6', '#FFD6A5'] },
];

// ── Suggestion engine ──

export function getSuggestedColors(hex: string): { color: string; reason: string }[] {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);

  const hslToHex = (hh: number, ss: number, ll: number) => {
    const [rr, gg, bb] = hslToRgb(((hh % 360) + 360) % 360, ss, ll);
    return rgbToHex(rr, gg, bb);
  };

  return [
    { color: hslToHex(h + 180, s, l), reason: 'Complementary — maximum contrast' },
    { color: hslToHex(h + 30, Math.min(s + 10, 100), l), reason: 'Analogous neighbor — harmonious' },
    { color: hslToHex(h, Math.max(s - 30, 5), Math.min(l + 25, 92)), reason: 'Muted tint — soft background' },
    { color: hslToHex(h, Math.max(s - 20, 5), Math.max(l - 25, 10)), reason: 'Deep shade — text/headings' },
    { color: hslToHex(h + 120, s, l), reason: 'Triadic accent — vibrant pop' },
    { color: hslToHex(h, 8, 96), reason: 'Near-white — clean background' },
    { color: hslToHex(h, 10, 12), reason: 'Near-black — dark mode base' },
    { color: hslToHex(h + 150, Math.min(s + 5, 100), Math.min(l + 10, 85)), reason: 'Split-complementary — balanced contrast' },
  ];
}
