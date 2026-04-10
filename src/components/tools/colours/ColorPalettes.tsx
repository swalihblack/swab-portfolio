import { useState } from 'react';
import { PALETTE_LIBRARY, textColorForBg } from '@/lib/colorUtils';

interface Props {
  onSelect: (hex: string) => void;
}

export default function ColorPalettes({ onSelect }: Props) {
  const [search, setSearch] = useState('');

  const filtered = PALETTE_LIBRARY.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-4 space-y-4">
      <input
        type="text"
        placeholder="Search palettes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-muted rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((palette) => (
          <div key={palette.name} className="bg-card border border-border rounded-lg p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2">{palette.name}</h4>
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

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No palettes match your search.</p>
      )}
    </div>
  );
}
