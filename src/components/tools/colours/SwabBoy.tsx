import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzePalette } from '@/lib/varmaAnalysis';
import { Sparkles, AlertTriangle, Check, Lightbulb } from 'lucide-react';

interface Props {
  colors: string[];
  onSelect: (hex: string) => void;
}

export default function SwabBoy({ colors, onSelect }: Props) {
  const { t } = useTranslation();
  const suggestions = useMemo(() => analyzePalette(colors), [colors]);

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
      <p className="text-[11px] italic text-muted-foreground">
        {t('swabColours.swabBoyTagline', 'Inspired by Raja Ravi Varma — the master of Indian color.')}
      </p>
      <p className="text-xs text-muted-foreground">
        {t('swabColours.varmaIntro', { count: colors.length })}
      </p>

      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const fixLabel = s.color ? t(`swabColours.${s.key}Fix`, { ...s.params, defaultValue: '' }) : '';
          return (
            <div key={i} className={`border rounded-lg p-3 ${bgMap[s.type]}`}>
              <div className="flex items-start gap-2">
                <div className="mt-0.5">{iconMap[s.type]}</div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-foreground">{t(`swabColours.${s.key}Title`, s.params)}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t(`swabColours.${s.key}Desc`, s.params)}</p>
                  {s.color && (
                    <>
                      {fixLabel && <p className="text-[11px] text-foreground mt-1.5">{fixLabel}</p>}
                      <button
                        onClick={() => onSelect(s.color!)}
                        className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-medium border border-border bg-card hover:bg-muted transition-colors"
                      >
                        <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: s.color }} />
                        <span>
                          {t('swabColours.varmaAdd')} <span dir="ltr" className="font-mono">{s.color.toUpperCase()}</span>
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {suggestions.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Check size={16} className="text-green-500" />
            {t('swabColours.varmaGreat')}
          </div>
        )}
      </div>
    </div>
  );
}
