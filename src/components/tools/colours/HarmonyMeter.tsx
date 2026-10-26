import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeHarmony } from '@/lib/harmonyAnalysis';
import { textColorForBg } from '@/lib/colorUtils';

interface Props {
  colors: string[];
}

const LABEL_KEYS: Record<string, string> = {
  mono: 'monochromatic',
  analogous: 'analogous',
  complementary: 'complementary',
  triadic: 'triadic',
  splitComp: 'splitComplementary',
  tetradic: 'tetradic',
  contrast: 'harmonyContrast',
  neutral: 'relationNeutral',
};

const BAR_COLORS: Record<string, string> = {
  mono: 'hsl(var(--accent))',
  analogous: '#22c55e',
  complementary: '#ef4444',
  triadic: '#8b5cf6',
  splitComp: '#f59e0b',
  contrast: '#94a3b8',
};

export default function HarmonyMeter({ colors }: Props) {
  const { t } = useTranslation();

  const analysis = useMemo(() => analyzeHarmony(colors), [colors]);

  if (analysis.isNeutralPalette) {
    return (
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t('swabColours.harmonyMeter')}</p>
        <p className="text-[11px] text-muted-foreground">{t('swabColours.harmonyNeutralPalette')}</p>
      </div>
    );
  }

  const verdictKey = `harmonyVerdict${analysis.verdict.charAt(0).toUpperCase()}${analysis.verdict.slice(1)}`;

  return (
    <div className="space-y-3">
      {/* Overall score + verdict */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-28 truncate">{t('swabColours.harmonyScore')}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 bg-accent" style={{ width: `${analysis.score}%` }} />
          </div>
          <span className="text-[10px] text-foreground font-mono w-8 text-right">{analysis.score}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-foreground">{t(`swabColours.${verdictKey}`)}</p>
          {analysis.dominant && (
            <p className="text-[10px] text-muted-foreground">
              {t('swabColours.harmonyDominant', {
                label: t(`swabColours.${LABEL_KEYS[analysis.dominant.key]}`),
                pct: analysis.dominant.pct,
              })}
            </p>
          )}
        </div>
      </div>

      {/* Relation breakdown — chromatic pairs only */}
      {analysis.bars.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          {analysis.bars.map((bar) => (
            <div key={bar.key} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-28 truncate">{t(`swabColours.${LABEL_KEYS[bar.key]}`)}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${bar.pct}%`, backgroundColor: BAR_COLORS[bar.key] }}
                />
              </div>
              <span className="text-[10px] text-foreground font-mono w-8 text-right">{bar.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Relation to the primary color */}
      {analysis.relations.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t('swabColours.relationToPrimary')}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-3 h-3 rounded-sm border border-border" style={{ backgroundColor: analysis.primaryColor }} />
              <span className="font-mono">{analysis.primaryColor.toUpperCase()}</span>
            </span>
          </div>
          {analysis.relations.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-12 text-center text-[9px] font-mono rounded-sm border border-border py-0.5"
                style={{ backgroundColor: r.color, color: textColorForBg(r.color) }}
              >
                {r.color.toUpperCase()}
              </span>
              <span className="text-[10px] text-foreground flex-1 truncate">{t(`swabColours.${LABEL_KEYS[r.key]}`)}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{r.diff !== null ? `Δ${r.diff}°` : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
