import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { textColorForBg, hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '@/lib/colorUtils';

interface Props {
  colors: string[];
}

type PreviewType = 'website' | 'app' | 'card' | 'print' | 'poster';

function deriveColors(colors: string[]) {
  const primary = colors[0] || '#E63946';
  const secondary = colors[1] || shiftHue(primary, 30);
  const accent = colors[2] || shiftHue(primary, 120);
  const bg = colors[3] || makeTint(primary, 96);
  const dark = colors[4] || makeShade(primary, 12);
  return { primary, secondary, accent, bg, dark, textOnPrimary: textColorForBg(primary), textOnSecondary: textColorForBg(secondary), textOnAccent: textColorForBg(accent), all: colors };
}

function shiftHue(hex: string, deg: number) {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex));
  return rgbToHex(...hslToRgb((h + deg) % 360, s, l));
}
function makeTint(hex: string, lightness: number) {
  const [h, s] = rgbToHsl(...hexToRgb(hex));
  return rgbToHex(...hslToRgb(h, Math.max(s - 60, 5), lightness));
}
function makeShade(hex: string, lightness: number) {
  const [h, s] = rgbToHsl(...hexToRgb(hex));
  return rgbToHex(...hslToRgb(h, Math.min(s + 5, 100), lightness));
}

export default function ColorPreviewPanel({ colors }: Props) {
  const { t } = useTranslation();
  const [type, setType] = useState<PreviewType>('website');
  const [variant, setVariant] = useState(0);
  const c = deriveColors(colors);

  const types: { key: PreviewType; label: string }[] = [
    { key: 'website', label: t('swabColours.website') },
    { key: 'app', label: t('swabColours.mobileApp') },
    { key: 'card', label: t('swabColours.cardUI') },
    { key: 'print', label: t('swabColours.print') },
    { key: 'poster', label: t('swabColours.poster') },
  ];

  const variants: Record<PreviewType, string[]> = {
    website: [t('swabColours.previewHome'), t('swabColours.previewHero'), t('swabColours.previewHeader'), t('swabColours.previewFooter'), t('swabColours.preview404')],
    app: [t('swabColours.previewLogin'), t('swabColours.previewDashboard'), t('swabColours.previewProfile')],
    card: [t('swabColours.previewPricing'), t('swabColours.previewStats'), t('swabColours.previewProfile')],
    print: [t('swabColours.previewBusinessCard'), t('swabColours.previewLetterhead'), t('swabColours.previewInvoice')],
    poster: [t('swabColours.previewFlyer'), t('swabColours.previewEvent'), t('swabColours.previewMinimal')],
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {types.map(tp => (
          <button key={tp.key} onClick={() => { setType(tp.key); setVariant(0); }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${type === tp.key ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {tp.label}
          </button>
        ))}
      </div>
      {/* Variant selector */}
      <div className="flex gap-1.5 flex-wrap">
        {variants[type].map((v, i) => (
          <button key={v} onClick={() => setVariant(i)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${variant === i ? 'bg-foreground text-background' : 'bg-muted/60 text-muted-foreground hover:bg-muted'}`}>
            {v}
          </button>
        ))}
      </div>
      {/* Preview */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {type === 'website' && <WebsitePreview variant={variant} c={c} />}
        {type === 'app' && <AppPreview variant={variant} c={c} />}
        {type === 'card' && <CardPreview variant={variant} c={c} />}
        {type === 'print' && <PrintPreview variant={variant} c={c} />}
        {type === 'poster' && <PosterPreview variant={variant} c={c} />}
      </div>
    </div>
  );
}

type C = ReturnType<typeof deriveColors>;

function WebsitePreview({ variant, c }: { variant: number; c: C }) {
  if (variant === 0) {
    // Home
    return (
      <div className="min-h-[350px]">
        <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: c.primary }}>
          <span className="font-display text-lg font-bold" style={{ color: c.textOnPrimary }}>Brand</span>
          <div className="flex gap-4">{['Home', 'About', 'Work'].map(n => <span key={n} className="text-xs font-medium opacity-80" style={{ color: c.textOnPrimary }}>{n}</span>)}</div>
        </div>
        <div className="px-5 py-10 text-center" style={{ backgroundColor: c.bg }}>
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: c.dark }}>Design with Confidence</h2>
          <p className="text-sm max-w-sm mx-auto mb-4" style={{ color: c.dark, opacity: 0.7 }}>See how your chosen palette works in a real interface.</p>
          <button className="px-5 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Get Started</button>
        </div>
        <div className="px-5 py-6 grid grid-cols-3 gap-3" style={{ backgroundColor: '#fff' }}>
          {[c.secondary, c.primary, c.accent].map((col, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
              <div className="h-16" style={{ backgroundColor: col }} />
              <div className="p-2"><div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: c.dark, opacity: 0.15 }} /><div className="h-2 w-1/2 rounded" style={{ backgroundColor: c.dark, opacity: 0.1 }} /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === 1) {
    // Hero
    return (
      <div className="min-h-[350px] relative" style={{ backgroundColor: c.primary }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[350px] text-center px-6">
          <h1 className="font-display text-3xl font-bold mb-3" style={{ color: c.textOnPrimary }}>Make It Bold</h1>
          <p className="text-sm mb-6 max-w-md opacity-90" style={{ color: c.textOnPrimary }}>Your next project deserves colors that stand out and speak volumes.</p>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-md text-sm font-semibold" style={{ backgroundColor: '#fff', color: c.primary }}>Start Free</button>
            <button className="px-6 py-2.5 rounded-md text-sm font-semibold border-2" style={{ borderColor: c.textOnPrimary, color: c.textOnPrimary }}>Learn More</button>
          </div>
        </div>
      </div>
    );
  }
  if (variant === 2) {
    // Header
    return (
      <div className="min-h-[120px]">
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: c.primary }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: c.accent }} />
            <span className="font-display text-base font-bold" style={{ color: c.textOnPrimary }}>Company</span>
          </div>
          <div className="flex items-center gap-6">
            {['Products', 'Solutions', 'Pricing', 'Blog'].map(n => <span key={n} className="text-xs font-medium" style={{ color: c.textOnPrimary, opacity: 0.85 }}>{n}</span>)}
            <button className="px-4 py-1.5 rounded text-xs font-medium" style={{ backgroundColor: c.textOnPrimary, color: c.primary }}>Sign Up</button>
          </div>
        </div>
        <div className="px-6 py-3 border-b" style={{ backgroundColor: c.bg }}>
          <div className="flex gap-4">{['All', 'Design', 'Development', 'Marketing'].map(n => <span key={n} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">{n}</span>)}</div>
        </div>
      </div>
    );
  }
  if (variant === 3) {
    // Footer
    return (
      <div style={{ backgroundColor: c.dark }} className="px-6 py-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {['Product', 'Company', 'Resources', 'Legal'].map(section => (
            <div key={section}>
              <h4 className="text-xs font-semibold mb-3" style={{ color: c.textOnPrimary || '#fff' }}>{section}</h4>
              {['Link 1', 'Link 2', 'Link 3'].map(l => <p key={l} className="text-[11px] mb-1.5 opacity-60" style={{ color: '#fff' }}>{l}</p>)}
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between items-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="text-[11px] opacity-50" style={{ color: '#fff' }}>© 2026 Company. All rights reserved.</span>
          <div className="flex gap-3">{['●', '■', '▲'].map((ic, i) => <span key={i} className="text-sm" style={{ color: c.primary }}>{ic}</span>)}</div>
        </div>
      </div>
    );
  }
  // 404
  return (
    <div className="min-h-[350px] flex flex-col items-center justify-center text-center" style={{ backgroundColor: c.bg }}>
      <span className="font-display text-7xl font-black mb-2" style={{ color: c.primary }}>404</span>
      <p className="text-sm mb-4" style={{ color: c.dark, opacity: 0.7 }}>Page not found. It might have been moved or deleted.</p>
      <button className="px-5 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Go Home</button>
    </div>
  );
}

function AppPreview({ variant, c }: { variant: number; c: C }) {
  const shell = (children: React.ReactNode) => (
    <div className="max-w-[260px] mx-auto min-h-[380px] border-x border-border">
      <div className="px-4 py-2 flex justify-between text-[10px]" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}><span>9:41</span><span>⦁⦁⦁</span></div>
      {children}
    </div>
  );

  if (variant === 0) {
    // Login
    return shell(
      <div className="p-5 flex flex-col items-center" style={{ backgroundColor: c.bg }}>
        <div className="w-14 h-14 rounded-2xl mb-4 mt-6" style={{ backgroundColor: c.primary }} />
        <h2 className="font-display text-base font-bold mb-1" style={{ color: c.dark }}>Welcome Back</h2>
        <p className="text-[11px] mb-5 opacity-60" style={{ color: c.dark }}>Sign in to continue</p>
        <div className="w-full space-y-2.5 mb-4">
          <div className="w-full h-9 rounded-lg border" style={{ borderColor: c.primary + '40', backgroundColor: '#fff' }} />
          <div className="w-full h-9 rounded-lg border" style={{ borderColor: c.primary + '40', backgroundColor: '#fff' }} />
        </div>
        <button className="w-full py-2.5 rounded-lg text-xs font-semibold" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Sign In</button>
        <p className="text-[10px] mt-3 opacity-50" style={{ color: c.dark }}>Forgot password?</p>
      </div>
    );
  }
  if (variant === 1) {
    // Dashboard
    return shell(
      <>
        <div className="px-4 py-3" style={{ backgroundColor: c.primary }}><span className="font-display text-sm font-bold" style={{ color: c.textOnPrimary }}>Dashboard</span></div>
        <div className="p-3 space-y-2" style={{ backgroundColor: c.bg }}>
          <div className="grid grid-cols-2 gap-2">
            {[c.primary, c.secondary, c.accent, c.dark].map((col, i) => (
              <div key={i} className="rounded-lg p-3 text-center" style={{ backgroundColor: '#fff' }}>
                <span className="text-lg font-bold" style={{ color: col }}>{(i + 1) * 24}</span>
                <p className="text-[9px] opacity-50" style={{ color: c.dark }}>Metric {i + 1}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: '#fff' }}>
            <div className="flex items-end gap-1 h-16 justify-around">
              {[40, 65, 45, 80, 55, 70, 50].map((h, i) => <div key={i} className="w-4 rounded-t" style={{ height: `${h}%`, backgroundColor: i === 3 ? c.primary : c.primary + '40' }} />)}
            </div>
          </div>
        </div>
      </>
    );
  }
  // Profile
  return shell(
    <>
      <div className="h-20" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />
      <div className="px-4 -mt-8 pb-4" style={{ backgroundColor: c.bg }}>
        <div className="w-16 h-16 rounded-full border-4 mb-2" style={{ backgroundColor: c.accent, borderColor: c.bg }} />
        <h3 className="font-display text-sm font-bold" style={{ color: c.dark }}>Jane Designer</h3>
        <p className="text-[10px] opacity-60 mb-3" style={{ color: c.dark }}>@janedesigns</p>
        <div className="flex gap-4 mb-3">
          {[['120', 'Posts'], ['8.4K', 'Followers'], ['340', 'Following']].map(([n, l]) => (
            <div key={l} className="text-center"><span className="text-xs font-bold" style={{ color: c.primary }}>{n}</span><p className="text-[9px] opacity-50" style={{ color: c.dark }}>{l}</p></div>
          ))}
        </div>
        <button className="w-full py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Follow</button>
      </div>
    </>
  );
}

function CardPreview({ variant, c }: { variant: number; c: C }) {
  if (variant === 0) {
    // Pricing
    return (
      <div className="p-6 flex justify-center" style={{ backgroundColor: c.bg }}>
        <div className="w-full max-w-xs rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: '#fff' }}>
          <div className="p-5 text-center" style={{ backgroundColor: c.primary }}>
            <h3 className="font-display text-base font-bold" style={{ color: c.textOnPrimary }}>Pro Plan</h3>
            <p className="text-2xl font-black mt-1" style={{ color: c.textOnPrimary }}>$29<span className="text-sm font-normal opacity-70">/mo</span></p>
          </div>
          <div className="p-5 space-y-2.5">
            {['Unlimited projects', '50GB storage', 'Priority support', 'Custom domain'].map(f => (
              <div key={f} className="flex items-center gap-2"><div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: c.primary + '20', color: c.primary }}>✓</div><span className="text-xs" style={{ color: c.dark }}>{f}</span></div>
            ))}
            <button className="w-full py-2.5 rounded-lg text-xs font-semibold mt-3" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Get Started</button>
          </div>
        </div>
      </div>
    );
  }
  if (variant === 1) {
    // Stats
    return (
      <div className="p-6 grid grid-cols-2 gap-3" style={{ backgroundColor: c.bg }}>
        {[{ n: '12.4K', l: 'Total Users', pct: 72 }, { n: '$48.2K', l: 'Revenue', pct: 85 }, { n: '3.2K', l: 'Orders', pct: 60 }, { n: '98.1%', l: 'Uptime', pct: 98 }].map((s, i) => (
          <div key={i} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#fff' }}>
            <p className="text-[10px] opacity-50 mb-1" style={{ color: c.dark }}>{s.l}</p>
            <p className="text-lg font-bold mb-2" style={{ color: c.dark }}>{s.n}</p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: c.primary + '20' }}>
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: [c.primary, c.secondary, c.accent, c.primary][i] }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  // Profile Card
  return (
    <div className="p-6 flex flex-col items-center gap-4" style={{ backgroundColor: c.bg }}>
      <div className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: '#fff' }}>
        <div className="h-20" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.accent})` }} />
        <div className="p-5 -mt-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full border-4 mb-2" style={{ backgroundColor: c.secondary, borderColor: '#fff' }} />
          <h3 className="font-display text-sm font-bold" style={{ color: c.dark }}>Alex Creative</h3>
          <p className="text-[10px] opacity-60 mb-3" style={{ color: c.dark }}>Product Designer</p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded text-xs font-medium" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>Connect</button>
            <button className="px-4 py-1.5 rounded text-xs font-medium border" style={{ borderColor: c.primary, color: c.primary }}>Message</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintPreview({ variant, c }: { variant: number; c: C }) {
  if (variant === 0) {
    // Business Card
    return (
      <div className="p-8 flex flex-col items-center gap-4" style={{ backgroundColor: '#e5e5e5' }}>
        <div className="w-full max-w-sm aspect-[3.5/2] rounded-lg shadow-lg flex overflow-hidden">
          <div className="w-2/5 flex flex-col items-center justify-center" style={{ backgroundColor: c.primary }}>
            <div className="w-10 h-10 rounded-full mb-2" style={{ backgroundColor: c.accent }} />
            <span className="text-[10px] font-bold" style={{ color: c.textOnPrimary }}>STUDIO</span>
          </div>
          <div className="w-3/5 flex flex-col justify-center px-5" style={{ backgroundColor: '#fff' }}>
            <h3 className="text-sm font-bold mb-0.5" style={{ color: c.dark }}>Jane Smith</h3>
            <p className="text-[9px] mb-2" style={{ color: c.primary }}>Creative Director</p>
            <div className="space-y-1">
              {['jane@studio.com', '+1 234 567 890', 'studio.design'].map(l => <p key={l} className="text-[8px] opacity-50" style={{ color: c.dark }}>{l}</p>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (variant === 1) {
    // Letterhead
    return (
      <div className="p-6 flex justify-center" style={{ backgroundColor: '#e5e5e5' }}>
        <div className="w-full max-w-sm bg-white rounded shadow-lg p-5 min-h-[300px]">
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `2px solid ${c.primary}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: c.primary }} />
              <span className="text-xs font-bold" style={{ color: c.dark }}>Company Inc.</span>
            </div>
            <div className="text-right"><p className="text-[8px] opacity-50" style={{ color: c.dark }}>123 Design St, City</p><p className="text-[8px] opacity-50" style={{ color: c.dark }}>info@company.com</p></div>
          </div>
          <div className="space-y-2">
            {[100, 90, 95, 60, 85, 70].map((w, i) => <div key={i} className="h-2 rounded" style={{ width: `${w}%`, backgroundColor: c.dark, opacity: 0.08 }} />)}
          </div>
        </div>
      </div>
    );
  }
  // Invoice
  return (
    <div className="p-6 flex justify-center" style={{ backgroundColor: '#e5e5e5' }}>
      <div className="w-full max-w-sm bg-white rounded shadow-lg p-5 min-h-[300px]">
        <div className="flex justify-between items-start mb-4">
          <div><div className="w-8 h-8 rounded mb-1" style={{ backgroundColor: c.primary }} /><span className="text-[9px] font-bold" style={{ color: c.dark }}>Company</span></div>
          <div className="text-right"><span className="text-lg font-black" style={{ color: c.primary }}>INVOICE</span><p className="text-[9px] opacity-50" style={{ color: c.dark }}>#INV-2026-001</p></div>
        </div>
        <table className="w-full text-[9px] mb-3">
          <thead><tr style={{ borderBottom: `1px solid ${c.primary}40` }}><th className="text-left py-1.5 font-semibold" style={{ color: c.dark }}>Item</th><th className="text-right py-1.5 font-semibold" style={{ color: c.dark }}>Amount</th></tr></thead>
          <tbody>{[['Design System', '$2,400'], ['Brand Guidelines', '$1,800'], ['UI Kit', '$3,200']].map(([item, amt]) => <tr key={item} style={{ borderBottom: '1px solid #f0f0f0' }}><td className="py-1.5 opacity-60" style={{ color: c.dark }}>{item}</td><td className="py-1.5 text-right opacity-60" style={{ color: c.dark }}>{amt}</td></tr>)}</tbody>
        </table>
        <div className="flex justify-end"><div className="px-3 py-1.5 rounded text-xs font-bold" style={{ backgroundColor: c.primary + '15', color: c.primary }}>Total: $7,400</div></div>
      </div>
    </div>
  );
}

function PosterPreview({ variant, c }: { variant: number; c: C }) {
  if (variant === 0) {
    // Flyer
    return (
      <div className="p-6 flex justify-center" style={{ backgroundColor: '#e5e5e5' }}>
        <div className="w-full max-w-xs min-h-[380px] rounded-lg shadow-lg overflow-hidden relative" style={{ backgroundColor: c.primary }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${c.primary} 0%, ${c.secondary} 100%)` }} />
          <div className="relative z-10 p-6 flex flex-col h-full min-h-[380px] justify-between">
            <div><span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: c.textOnPrimary + 'aa' }}>Special Event</span></div>
            <div>
              <h2 className="font-display text-3xl font-black leading-tight mb-2" style={{ color: c.textOnPrimary }}>Design<br />Conference<br />2026</h2>
              <p className="text-xs opacity-80 mb-4" style={{ color: c.textOnPrimary }}>March 15–17 · Convention Center</p>
              <button className="px-5 py-2 rounded text-xs font-bold" style={{ backgroundColor: c.accent, color: textColorForBg(c.accent) }}>Register Now</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (variant === 1) {
    // Event
    return (
      <div className="p-6 flex justify-center" style={{ backgroundColor: '#e5e5e5' }}>
        <div className="w-full max-w-xs min-h-[380px] rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: c.dark }}>
          <div className="h-32" style={{ background: `linear-gradient(45deg, ${c.primary}80, ${c.accent}80)` }} />
          <div className="p-5">
            <div className="inline-block px-2 py-0.5 rounded text-[9px] font-bold mb-3" style={{ backgroundColor: c.primary, color: c.textOnPrimary }}>WORKSHOP</div>
            <h2 className="font-display text-xl font-black mb-2" style={{ color: '#fff' }}>Color Theory<br />Masterclass</h2>
            <p className="text-[11px] opacity-60 mb-4" style={{ color: '#fff' }}>Learn the fundamentals of color in design. From harmony to contrast.</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[c.primary, c.secondary, c.accent].map((col, i) => <div key={i} className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: col, borderColor: c.dark }} />)}
              </div>
              <span className="text-[10px] opacity-40" style={{ color: '#fff' }}>24 attending</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Minimal
  return (
    <div className="p-6 flex justify-center" style={{ backgroundColor: '#e5e5e5' }}>
      <div className="w-full max-w-xs min-h-[380px] rounded-lg shadow-lg flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: '#fff' }}>
        <div className="w-16 h-1 rounded mb-8" style={{ backgroundColor: c.primary }} />
        <h2 className="font-display text-2xl font-black mb-3" style={{ color: c.dark }}>Less is<br />More.</h2>
        <p className="text-xs opacity-50 mb-6 max-w-[180px]" style={{ color: c.dark }}>A minimalist approach to modern graphic design.</p>
        <div className="flex gap-2">
          {[c.primary, c.secondary, c.accent].map((col, i) => <div key={i} className="w-8 h-8 rounded-full" style={{ backgroundColor: col }} />)}
        </div>
        <div className="w-16 h-1 rounded mt-8" style={{ backgroundColor: c.accent }} />
      </div>
    </div>
  );
}
