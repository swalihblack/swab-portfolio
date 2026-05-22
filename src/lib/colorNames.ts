import { hexToRgb, rgbToHsl } from './colorUtils';

// Curated named colors — common, evocative, recognizable names spanning
// the spectrum. Used to label any hex with its closest match.
export const NAMED_COLORS: { name: string; hex: string }[] = [
  // Reds
  { name: 'Tomato', hex: '#FF6347' }, { name: 'Cherry', hex: '#DE3163' },
  { name: 'Ruby', hex: '#9B111E' }, { name: 'Scarlet', hex: '#FF2400' },
  { name: 'Crimson', hex: '#DC143C' }, { name: 'Candy', hex: '#E4717A' },
  { name: 'Brick', hex: '#CB4154' }, { name: 'Maroon', hex: '#800000' },
  { name: 'Carmine', hex: '#960018' }, { name: 'Rose', hex: '#FF66CC' },
  { name: 'Blush', hex: '#DE5D83' }, { name: 'Coral', hex: '#FF7F50' },
  { name: 'Salmon', hex: '#FA8072' }, { name: 'Watermelon', hex: '#FC6C85' },
  { name: 'Raspberry', hex: '#E30B5C' }, { name: 'Wine', hex: '#722F37' },
  { name: 'Garnet', hex: '#733635' }, { name: 'Vermilion', hex: '#E34234' },
  // Pinks
  { name: 'Pink', hex: '#FFC0CB' }, { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Magenta', hex: '#FF00FF' }, { name: 'Fuchsia', hex: '#FF77FF' },
  { name: 'Bubblegum', hex: '#FFC1CC' }, { name: 'Flamingo', hex: '#FC8EAC' },
  { name: 'Mauve', hex: '#E0B0FF' }, { name: 'Orchid', hex: '#DA70D6' },
  // Oranges
  { name: 'Orange', hex: '#FFA500' }, { name: 'Tangerine', hex: '#F28500' },
  { name: 'Apricot', hex: '#FBCEB1' }, { name: 'Peach', hex: '#FFE5B4' },
  { name: 'Pumpkin', hex: '#FF7518' }, { name: 'Rust', hex: '#B7410E' },
  { name: 'Copper', hex: '#B87333' }, { name: 'Amber', hex: '#FFBF00' },
  { name: 'Marigold', hex: '#EAA221' }, { name: 'Saffron', hex: '#F4C430' },
  { name: 'Burnt Sienna', hex: '#E97451' }, { name: 'Papaya', hex: '#FFEFD5' },
  // Yellows
  { name: 'Yellow', hex: '#FFFF00' }, { name: 'Lemon', hex: '#FFF44F' },
  { name: 'Mustard', hex: '#FFDB58' }, { name: 'Gold', hex: '#FFD700' },
  { name: 'Honey', hex: '#EAB308' }, { name: 'Butter', hex: '#FFF1B5' },
  { name: 'Cream', hex: '#FFFDD0' }, { name: 'Banana', hex: '#FFE135' },
  { name: 'Canary', hex: '#FFEF00' }, { name: 'Wheat', hex: '#F5DEB3' },
  // Greens
  { name: 'Green', hex: '#008000' }, { name: 'Lime', hex: '#00FF00' },
  { name: 'Mint', hex: '#98FF98' }, { name: 'Sage', hex: '#9CAF88' },
  { name: 'Emerald', hex: '#50C878' }, { name: 'Jade', hex: '#00A86B' },
  { name: 'Olive', hex: '#808000' }, { name: 'Forest', hex: '#228B22' },
  { name: 'Pine', hex: '#01796F' }, { name: 'Moss', hex: '#8A9A5B' },
  { name: 'Pistachio', hex: '#93C572' }, { name: 'Avocado', hex: '#568203' },
  { name: 'Chartreuse', hex: '#7FFF00' }, { name: 'Kelly', hex: '#4CBB17' },
  { name: 'Hunter', hex: '#355E3B' }, { name: 'Seafoam', hex: '#9FE2BF' },
  { name: 'Fern', hex: '#4F7942' }, { name: 'Basil', hex: '#567D46' },
  // Cyans / Teals
  { name: 'Cyan', hex: '#00FFFF' }, { name: 'Teal', hex: '#008080' },
  { name: 'Turquoise', hex: '#40E0D0' }, { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Lagoon', hex: '#5DADE2' }, { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Cerulean', hex: '#007BA7' }, { name: 'Peacock', hex: '#005F69' },
  // Blues
  { name: 'Blue', hex: '#0000FF' }, { name: 'Sky', hex: '#87CEEB' },
  { name: 'Azure', hex: '#007FFF' }, { name: 'Cobalt', hex: '#0047AB' },
  { name: 'Navy', hex: '#000080' }, { name: 'Sapphire', hex: '#0F52BA' },
  { name: 'Denim', hex: '#1560BD' }, { name: 'Royal', hex: '#4169E1' },
  { name: 'Indigo', hex: '#4B0082' }, { name: 'Steel', hex: '#4682B4' },
  { name: 'Ocean', hex: '#1976D2' }, { name: 'Powder', hex: '#B0E0E6' },
  { name: 'Midnight', hex: '#191970' }, { name: 'Periwinkle', hex: '#CCCCFF' },
  { name: 'Ice', hex: '#D6ECEF' }, { name: 'Slate', hex: '#6A5ACD' },
  // Purples
  { name: 'Purple', hex: '#800080' }, { name: 'Violet', hex: '#8F00FF' },
  { name: 'Lavender', hex: '#E6E6FA' }, { name: 'Plum', hex: '#8E4585' },
  { name: 'Amethyst', hex: '#9966CC' }, { name: 'Eggplant', hex: '#614051' },
  { name: 'Lilac', hex: '#C8A2C8' }, { name: 'Grape', hex: '#6F2DA8' },
  { name: 'Mulberry', hex: '#C54B8C' }, { name: 'Iris', hex: '#5A4FCF' },
  // Browns / Earth
  { name: 'Brown', hex: '#964B00' }, { name: 'Chocolate', hex: '#7B3F00' },
  { name: 'Coffee', hex: '#6F4E37' }, { name: 'Mocha', hex: '#967259' },
  { name: 'Caramel', hex: '#AF6F09' }, { name: 'Hazelnut', hex: '#AE7B57' },
  { name: 'Tan', hex: '#D2B48C' }, { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Khaki', hex: '#C3B091' }, { name: 'Sand', hex: '#C2B280' },
  { name: 'Walnut', hex: '#5C3317' }, { name: 'Mahogany', hex: '#420D09' },
  { name: 'Sienna', hex: '#A0522D' }, { name: 'Umber', hex: '#635147' },
  { name: 'Terracotta', hex: '#E2725B' }, { name: 'Clay', hex: '#B66A50' },
  { name: 'Espresso', hex: '#3B2415' }, { name: 'Cinnamon', hex: '#D2691E' },
  // Neutrals
  { name: 'White', hex: '#FFFFFF' }, { name: 'Snow', hex: '#FFFAFA' },
  { name: 'Ivory', hex: '#FFFFF0' }, { name: 'Pearl', hex: '#F0EAD6' },
  { name: 'Bone', hex: '#E3DAC9' }, { name: 'Linen', hex: '#FAF0E6' },
  { name: 'Eggshell', hex: '#F0EAD6' }, { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Platinum', hex: '#E5E4E2' }, { name: 'Ash', hex: '#B2BEB5' },
  { name: 'Smoke', hex: '#738276' }, { name: 'Gray', hex: '#808080' },
  { name: 'Stone', hex: '#928E85' }, { name: 'Pewter', hex: '#8F8F8F' },
  { name: 'Graphite', hex: '#383838' }, { name: 'Charcoal', hex: '#36454F' },
  { name: 'Onyx', hex: '#353839' }, { name: 'Jet', hex: '#0A0A0A' },
  { name: 'Black', hex: '#000000' }, { name: 'Obsidian', hex: '#0B1215' },
  { name: 'Raven', hex: '#1B1B1B' }, { name: 'Pepper', hex: '#2A2A2A' },
];

// Distance in HSL space; weight hue highly for chromatic colors, lightness for grays.
function colorDistance(a: [number, number, number], b: [number, number, number]) {
  const [h1, s1, l1] = a;
  const [h2, s2, l2] = b;
  // Hue wraparound
  let dh = Math.abs(h1 - h2);
  if (dh > 180) dh = 360 - dh;
  const ds = Math.abs(s1 - s2);
  const dl = Math.abs(l1 - l2);
  // If either color is near-gray, lean on lightness instead of hue
  const grayish = s1 < 12 || s2 < 12;
  if (grayish) return dl * 3 + ds * 1.5 + dh * 0.2;
  return dh * 1.2 + ds * 0.8 + dl * 1.1;
}

const NAMED_HSL = NAMED_COLORS.map(n => ({
  ...n,
  hsl: rgbToHsl(...hexToRgb(n.hex)) as [number, number, number],
}));

const cache = new Map<string, string>();

export function getColorName(hex: string): string {
  const key = hex.toUpperCase();
  const hit = cache.get(key);
  if (hit) return hit;
  const target = rgbToHsl(...hexToRgb(hex)) as [number, number, number];
  let best = NAMED_HSL[0];
  let bestD = Infinity;
  for (const n of NAMED_HSL) {
    const d = colorDistance(target, n.hsl);
    if (d < bestD) { bestD = d; best = n; }
  }
  cache.set(key, best.name);
  return best.name;
}
