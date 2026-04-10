import { useState } from 'react';
import { getHarmonyColors, textColorForBg, hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '@/lib/colorUtils';

interface Props {
  color: string;
}

type PreviewMode = 'website' | 'app' | 'card';

export default function ColorPreview({ color }: Props) {
  const [mode, setMode] = useState<PreviewMode>('website');
  const textColor = textColorForBg(color);
  const harmonies = getHarmonyColors(color);
  const secondary = harmonies.analogous[2];
  const [r, g, b] = hexToRgb(color);
  const [h, s, l] = rgbToHsl(r, g, b);
  const lightBg = rgbToHex(...hslToRgb(h, Math.max(s - 60, 5), 96));
  const darkShade = rgbToHex(...hslToRgb(h, Math.min(s + 5, 100), Math.max(l - 30, 8)));

  const modes: { key: PreviewMode; label: string }[] = [
    { key: 'website', label: 'Website' },
    { key: 'app', label: 'Mobile App' },
    { key: 'card', label: 'Card UI' },
  ];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              mode === m.key
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {mode === 'website' && (
          <div className="min-h-[350px]">
            {/* Nav */}
            <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: color }}>
              <span className="font-display text-lg font-bold" style={{ color: textColor }}>Brand</span>
              <div className="flex gap-4">
                {['Home', 'About', 'Work'].map((n) => (
                  <span key={n} className="text-xs font-medium opacity-80" style={{ color: textColor }}>{n}</span>
                ))}
              </div>
            </div>
            {/* Hero */}
            <div className="px-5 py-10 text-center" style={{ backgroundColor: lightBg }}>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: darkShade }}>
                Design with Confidence
              </h2>
              <p className="text-sm max-w-sm mx-auto mb-4" style={{ color: darkShade, opacity: 0.7 }}>
                See how your chosen palette works in a real interface.
              </p>
              <button
                className="px-5 py-2 rounded-md text-sm font-medium"
                style={{ backgroundColor: color, color: textColor }}
              >
                Get Started
              </button>
            </div>
            {/* Cards */}
            <div className="px-5 py-6 grid grid-cols-3 gap-3" style={{ backgroundColor: '#fff' }}>
              {[secondary, color, harmonies.triadic[2]].map((c, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
                  <div className="h-16" style={{ backgroundColor: c }} />
                  <div className="p-2">
                    <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: darkShade, opacity: 0.15 }} />
                    <div className="h-2 w-1/2 rounded" style={{ backgroundColor: darkShade, opacity: 0.1 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'app' && (
          <div className="max-w-[260px] mx-auto min-h-[350px] border-x border-border">
            {/* Status bar */}
            <div className="px-4 py-2 flex justify-between text-[10px]" style={{ backgroundColor: color, color: textColor }}>
              <span>9:41</span>
              <span>⦁⦁⦁</span>
            </div>
            {/* App header */}
            <div className="px-4 py-3" style={{ backgroundColor: color }}>
              <span className="font-display text-base font-bold" style={{ color: textColor }}>My App</span>
            </div>
            {/* Content */}
            <div className="p-4 space-y-3" style={{ backgroundColor: lightBg }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: i === 1 ? color : i === 2 ? secondary : harmonies.triadic[2] }} />
                  <div className="flex-1">
                    <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: darkShade, opacity: 0.2 }} />
                    <div className="h-2 w-1/2 rounded" style={{ backgroundColor: darkShade, opacity: 0.1 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Tab bar */}
            <div className="px-4 py-3 flex justify-around border-t" style={{ backgroundColor: '#fff' }}>
              {['●', '◆', '▲', '■'].map((icon, i) => (
                <span key={i} className="text-sm" style={{ color: i === 0 ? color : '#ccc' }}>{icon}</span>
              ))}
            </div>
          </div>
        )}

        {mode === 'card' && (
          <div className="p-6 flex flex-col items-center gap-4" style={{ backgroundColor: lightBg }}>
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-24" style={{ backgroundColor: color }} />
              <div className="p-5">
                <h3 className="font-display text-lg font-bold mb-1" style={{ color: darkShade }}>Card Title</h3>
                <p className="text-xs mb-4" style={{ color: darkShade, opacity: 0.6 }}>
                  A preview of how your color looks on a modern card component.
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded text-xs font-medium" style={{ backgroundColor: color, color: textColor }}>Primary</button>
                  <button className="px-4 py-1.5 rounded text-xs font-medium border" style={{ borderColor: color, color: color }}>Secondary</button>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: darkShade }}>User Name</div>
                  <div className="text-xs" style={{ color: darkShade, opacity: 0.5 }}>@username</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 rounded w-full" style={{ backgroundColor: darkShade, opacity: 0.1 }} />
                <div className="h-2 rounded w-4/5" style={{ backgroundColor: darkShade, opacity: 0.08 }} />
                <div className="h-2 rounded w-3/5" style={{ backgroundColor: darkShade, opacity: 0.06 }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
