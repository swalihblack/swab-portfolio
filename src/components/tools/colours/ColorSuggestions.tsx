import { getSuggestedColors, textColorForBg, contrastRatio } from '@/lib/colorUtils';

interface Props {
  color: string;
  onSelect: (hex: string) => void;
}

export default function ColorSuggestions({ color, onSelect }: Props) {
  const suggestions = getSuggestedColors(color);

  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs text-muted-foreground">
        Colors that pair well with <span className="font-mono font-semibold">{color.toUpperCase()}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((s, i) => {
          const ratio = contrastRatio(color, s.color);
          const passAA = ratio >= 4.5;
          return (
            <button
              key={i}
              onClick={() => onSelect(s.color)}
              className="bg-card border border-border rounded-lg p-3 text-left hover:border-accent transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex rounded overflow-hidden h-10 w-20 border border-border">
                  <div className="w-1/2" style={{ backgroundColor: color }} />
                  <div className="w-1/2" style={{ backgroundColor: s.color }} />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold text-foreground">{s.color.toUpperCase()}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${passAA ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {ratio.toFixed(1)}:1 {passAA ? 'AA ✓' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{s.reason}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
