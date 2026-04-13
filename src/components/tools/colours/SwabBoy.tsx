import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex, contrastRatio, textColorForBg, luminance } from '@/lib/colorUtils';
import { Sparkles, AlertTriangle, Check, Lightbulb } from 'lucide-react';

interface Props {
  colors: string[];
  onSelect: (hex: string) => void;
}

interface Suggestion {
  type: 'warning' | 'tip' | 'suggestion';
  title: string;
  description: string;
  color?: string;
}

function analyzeColors(colors: string[]): Suggestion[] {
  const results: Suggestion[] = [];
  const hslColors = colors.map(c => ({ hex: c, hsl: rgbToHsl(...hexToRgb(c)), lum: luminance(...hexToRgb(c)) }));

  // Check contrast issues
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const ratio = contrastRatio(colors[i], colors[j]);
      if (ratio < 2) {
        results.push({
          type: 'warning',
          title: `Low contrast: ${colors[i].toUpperCase()} & ${colors[j].toUpperCase()}`,
          description: `Contrast ratio is only ${ratio.toFixed(1)}:1. These colors are too similar for text/background use. Aim for at least 4.5:1.`,
        });
      }
    }
  }

  // Check if palette is too dark or too light
  const avgLum = hslColors.reduce((s, c) => s + c.lum, 0) / hslColors.length;
  if (avgLum < 0.1) {
    const [h, s] = hslColors[0].hsl;
    const suggested = rgbToHex(...hslToRgb(h, Math.max(s - 20, 10), 85));
    results.push({ type: 'suggestion', title: 'Palette is very dark', description: 'Consider adding a lighter color for backgrounds or text.', color: suggested });
  }
  if (avgLum > 0.8) {
    const [h, s] = hslColors[0].hsl;
    const suggested = rgbToHex(...hslToRgb(h, Math.min(s + 10, 100), 20));
    results.push({ type: 'suggestion', title: 'Palette is very light', description: 'Consider adding a darker color for text and headings.', color: suggested });
  }

  // Check saturation variety
  const sats = hslColors.map(c => c.hsl[1]);
  const avgSat = sats.reduce((a, b) => a + b, 0) / sats.length;
  if (avgSat > 85) {
    results.push({ type: 'tip', title: 'High saturation palette', description: 'Very saturated colors can cause visual fatigue. Consider adding a muted or neutral tone.' });
  }

  // Suggest missing neutral
  const hasNeutral = hslColors.some(c => c.hsl[1] < 15);
  if (!hasNeutral && colors.length >= 2) {
    const [h] = hslColors[0].hsl;
    results.push({ type: 'suggestion', title: 'Missing neutral color', description: 'Adding a neutral (low saturation) color helps ground your palette.', color: rgbToHex(...hslToRgb(h, 8, 95)) });
  }

  // Suggest text color
  if (colors.length >= 1) {
    const [h] = hslColors[0].hsl;
    const hasDark = hslColors.some(c => c.lum < 0.15);
    if (!hasDark) {
      results.push({ type: 'suggestion', title: 'Add a text color', description: 'A dark shade of your primary hue works great for body text.', color: rgbToHex(...hslToRgb(h, 15, 12)) });
    }
  }

  // Complementary suggestion
  if (colors.length === 1) {
    const [h, s, l] = hslColors[0].hsl;
    results.push({ type: 'suggestion', title: 'Try a complementary accent', description: 'A complementary color adds energy and contrast to your design.', color: rgbToHex(...hslToRgb((h + 180) % 360, s, l)) });
    results.push({ type: 'suggestion', title: 'Add a soft background', description: 'A muted tint of your color works great as a background.', color: rgbToHex(...hslToRgb(h, Math.max(s - 40, 5), 94)) });
  }

  // General tips
  if (colors.length >= 3) {
    results.push({ type: 'tip', title: 'The 60-30-10 rule', description: 'Use your dominant color 60%, secondary 30%, and accent 10% for balanced designs.' });
  }

  return results;
}

export default function SwabBoy({ colors, onSelect }: Props) {
  const { t } = useTranslation();
  const suggestions = useMemo(() => analyzeColors(colors), [colors]);

  const iconMap = {
    warning: <AlertTriangle size={14} className="text-yellow-500" />,
    tip: <Lightbulb size={14} className="text-blue-400" />,
    suggestion: <Sparkles size={14} className="text-accent" />,
  };

  const bgMap = {
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    tip: 'border-blue-400/30 bg-blue-400/5',
    suggestion: 'border-accent/30 bg-accent/5',
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-accent" />
        <h3 className="font-display text-sm font-bold text-foreground">{t('swabColours.swabBoy')}</h3>
        <span className="bg-accent text-accent-foreground text-[9px] px-1.5 py-0.5 rounded font-bold">AI</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Smart suggestions based on your {colors.length} selected color{colors.length !== 1 ? 's' : ''}.
      </p>

      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className={`border rounded-lg p-3 ${bgMap[s.type]}`}>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{iconMap[s.type]}</div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-foreground">{s.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>
                {s.color && (
                  <button
                    onClick={() => onSelect(s.color!)}
                    className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-medium border border-border bg-card hover:bg-muted transition-colors"
                  >
                    <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: s.color }} />
                    Add {s.color.toUpperCase()}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {suggestions.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Check size={16} className="text-green-500" />
            Your palette looks great!
          </div>
        )}
      </div>
    </div>
  );
}
