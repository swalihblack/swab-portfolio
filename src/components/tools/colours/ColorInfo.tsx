import { useState, useEffect } from 'react';
import { hexToRgb, rgbToHsl, rgbToCmyk, rgbToHsv, textColorForBg } from '@/lib/colorUtils';
import { Copy, Check } from 'lucide-react';

interface Props {
  color: string;
  onChange: (hex: string) => void;
}

export default function ColorInfo({ color, onChange }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState(color);

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(...rgb);
  const cmyk = rgbToCmyk(...rgb);
  const hsv = rgbToHsv(...rgb);

  const codes = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.join(', ')})` },
    { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'HSV', value: `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.join('%, ')}%)` },
  ];

  const copyToClipboard = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleHexSubmit = () => {
    const clean = hexInput.trim();
    if (/^#?[0-9A-Fa-f]{6}$/.test(clean)) {
      onChange(clean.startsWith('#') ? clean : `#${clean}`);
    }
  };

  // Sync input when color changes externally
  if (color !== hexInput && !hexInput.includes(color.slice(1))) {
    setHexInput(color);
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h2 className="font-display text-lg font-semibold mb-3 text-foreground">Color Codes</h2>

      {/* Hex input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={handleHexSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleHexSubmit()}
          className="flex-1 bg-muted rounded px-3 py-1.5 text-sm font-mono text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="#E63946"
        />
        <div
          className="w-10 h-9 rounded border border-border"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* All codes */}
      <div className="space-y-1.5">
        {codes.map((c) => (
          <button
            key={c.label}
            onClick={() => copyToClipboard(c.value, c.label)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <span className="text-xs font-medium text-muted-foreground w-12">{c.label}</span>
            <span className="text-xs font-mono text-foreground flex-1 ml-2">{c.value}</span>
            {copied === c.label ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
