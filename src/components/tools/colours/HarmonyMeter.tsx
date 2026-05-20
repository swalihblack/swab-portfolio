import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { hexToRgb, rgbToHsl, textColorForBg } from '@/lib/colorUtils';

interface Props {
  colors: string[];
}

function hueDiff(h1: number, h2: number): number {
  const d = Math.abs(h1 - h2);
  return Math.min(d, 360 - d);
}

function classifyRelation(diff: number): { key: string; label: string } {
  if (diff <= 15) return { key: 'mono', label: 'Monochromatic' };
  if (diff <= 40) return { key: 'analogous', label: 'Analogous' };
  if (diff >= 165) return { key: 'complementary', label: 'Complementary' };
  if (diff >= 110 && diff <= 130) return { key: 'triadic', label: 'Triadic' };
  if ((diff >= 140 && diff <= 160) || (diff >= 200 && diff <= 220)) return { key: 'splitComp', label: 'Split-Complementary' };
  if (diff >= 80 && diff <= 100) return { key: 'tetradic', label: 'Tetradic' };
  return { key: 'neutral', label: 'Contrast' };
}

export default function HarmonyMeter({ colors }: Props) {
  const { t } = useTranslation();

  const analysis = useMemo(() => {
    if (colors.length < 2) return null;
    const hues = colors.map(c => rgbToHsl(...hexToRgb(c))[0]);

    let complementary = 0, analogous = 0, triadic = 0, splitComp = 0, mono = 0;
    let pairs = 0;

    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        const diff = hueDiff(hues[i], hues[j]);
        pairs++;
        if (diff <= 15) mono++;
        else if (diff <= 40) analogous++;
        else if (diff >= 165 && diff <= 195) complementary++;
        else if (diff >= 110 && diff <= 130) triadic++;
        else if ((diff >= 140 && diff <= 160) || (diff >= 200 && diff <= 220)) splitComp++;
      }
    }

    const total = pairs || 1;
    return [
      { key: 'mono', label: t('swabColours.monochromatic'), pct: Math.round((mono / total) * 100), color: 'hsl(var(--accent))' },
      { key: 'analogous', label: t('swabColours.analogous'), pct: Math.round((analogous / total) * 100), color: '#22c55e' },
      { key: 'complementary', label: t('swabColours.complementary'), pct: Math.round((complementary / total) * 100), color: '#ef4444' },
      { key: 'triadic', label: t('swabColours.triadic'), pct: Math.round((triadic / total) * 100), color: '#8b5cf6' },
      { key: 'splitComp', label: t('swabColours.splitComplementary'), pct: Math.round((splitComp / total) * 100), color: '#f59e0b' },
    ].filter(h => h.pct > 0);
  }, [colors, t]);

  const primaryRelations = useMemo(() => {
    if (colors.length < 2) return [];
    const primaryHue = rgbToHsl(...hexToRgb(colors[0]))[0];
    return colors.slice(1).map(c => {
      const h = rgbToHsl(...hexToRgb(c))[0];
      const diff = hueDiff(primaryHue, h);
      return { color: c, diff: Math.round(diff), ...classifyRelation(diff) };
    });
  }, [colors]);

  if (!analysis || analysis.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t('swabColours.harmonyMeter')}</p>
        {analysis.map(h => (
          <div key={h.key} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-28 truncate">{h.label}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${h.pct}%`, backgroundColor: h.color }} />
            </div>
            <span className="text-[10px] text-foreground font-mono w-8 text-right">{h.pct}%</span>
          </div>
        ))}
      </div>

      {primaryRelations.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t('swabColours.relationToPrimary', 'Relation to primary')}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-3 h-3 rounded-sm border border-border" style={{ backgroundColor: colors[0] }} />
              <span className="font-mono">{colors[0].toUpperCase()}</span>
            </span>
          </div>
          {primaryRelations.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-12 text-center text-[9px] font-mono rounded-sm border border-border py-0.5"
                style={{ backgroundColor: r.color, color: textColorForBg(r.color) }}
              >
                {r.color.toUpperCase()}
              </span>
              <span className="text-[10px] text-foreground flex-1 truncate">{r.label}</span>
              <span className="text-[10px] text-muted-foreground font-mono">Δ{r.diff}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
