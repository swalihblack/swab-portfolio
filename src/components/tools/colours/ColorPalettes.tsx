import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PALETTE_LIBRARY } from '@/data/paletteLibrary';
import { textColorForBg, hexToRgb, rgbToHsl } from '@/lib/colorUtils';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSelect: (hex: string) => void;
  selectedColor: string;
}

function colorDistance(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const [h1, s1, l1] = rgbToHsl(r1, g1, b1);
  const [h2, s2, l2] = rgbToHsl(r2, g2, b2);
  const hDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) / 180;
  const sDiff = Math.abs(s1 - s2) / 100;
  const lDiff = Math.abs(l1 - l2) / 100;
  return hDiff * 0.6 + sDiff * 0.2 + lDiff * 0.2;
}

function paletteMatchScore(palette: { colors: string[] }, targetHex: string): number {
  return Math.min(...palette.colors.map(c => colorDistance(c, targetHex)));
}

export default function ColorPalettes({ onSelect, selectedColor }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const matchingPalettes = useMemo(() => {
    let results = PALETTE_LIBRARY
      .map(p => ({ ...p, score: paletteMatchScore(p, selectedColor) }))
      .sort((a, b) => a.score - b.score);

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    return results.slice(0, 20);
  }, [selectedColor, search]);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{t('swabColours.matchingPalettes')}</p>
        <Link
          to="/tools/swab-colours/library"
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
        >
          {t('swabColours.viewLibrary')}
          <ArrowRight size={12} />
        </Link>
      </div>

      <input
        type="text"
        placeholder={t('swabColours.searchPalettes')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-muted rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {matchingPalettes.map((palette, idx) => (
          <div key={`${palette.name}-${idx}`} className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-foreground truncate">{palette.name}</h4>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{palette.category}</span>
            </div>
            <div className="flex rounded-md overflow-hidden h-12">
              {palette.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(c)}
                  className="flex-1 flex items-center justify-center transition-transform hover:scale-y-110 hover:z-10"
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  <span className="text-[9px] font-mono opacity-0 hover:opacity-80 transition-opacity" style={{ color: textColorForBg(c) }}>
                    {c}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {matchingPalettes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">{t('swabColours.noPalettes')}</p>
      )}
    </div>
  );
}
