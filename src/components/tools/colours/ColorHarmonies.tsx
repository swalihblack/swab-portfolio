import { getHarmonyColors, textColorForBg } from '@/lib/colorUtils';

interface Props {
  color: string;
  onSelect: (hex: string) => void;
}

const HARMONY_LABELS: Record<string, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  splitComplementary: 'Split-Complementary',
  tetradic: 'Tetradic (Square)',
  monochromatic: 'Monochromatic',
};

const HARMONY_DESCRIPTIONS: Record<string, string> = {
  complementary: 'Opposite on the color wheel — high contrast and vibrant.',
  analogous: 'Side-by-side hues — naturally harmonious and calm.',
  triadic: 'Three evenly spaced hues — balanced and colorful.',
  splitComplementary: 'Base + two adjacent to complement — softer contrast.',
  tetradic: 'Four hues in a rectangle — rich and varied.',
  monochromatic: 'Single hue with varied lightness — elegant and unified.',
};

export default function ColorHarmonies({ color, onSelect }: Props) {
  const harmonies = getHarmonyColors(color);

  return (
    <div className="space-y-4 mt-4">
      {Object.entries(harmonies).map(([key, colors]) => (
        <div key={key} className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-display text-sm font-semibold text-foreground mb-1">
            {HARMONY_LABELS[key]}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{HARMONY_DESCRIPTIONS[key]}</p>
          <div className="flex gap-2">
            {colors.map((c, i) => (
              <button
                key={i}
                onClick={() => onSelect(c)}
                className="flex-1 h-14 rounded-md border border-border transition-transform hover:scale-105 flex items-end justify-center pb-1"
                style={{ backgroundColor: c }}
                title={c.toUpperCase()}
              >
                <span
                  className="text-[10px] font-mono font-medium opacity-80"
                  style={{ color: textColorForBg(c) }}
                >
                  {c.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
