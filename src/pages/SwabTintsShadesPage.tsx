import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Download, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import ColourToolLinks from '@/components/tools/colours/ColourToolLinks';
import { generateTintShade, parseHexColors } from '@/lib/tintShadeUtils';
import { textColorForBg } from '@/lib/colorUtils';
import { getColorName } from '@/lib/colorNames';

export default function SwabTintsShadesPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const initialInput = params.get('colors')?.replace(/,/g, ' ') || '#42EB99';
  const [input, setInput] = useState(initialInput);
  const [colors, setColors] = useState(() => {
    try { return parseHexColors(initialInput); } catch { return ['#42EB99']; }
  });
  const [steps, setSteps] = useState(10);
  const [error, setError] = useState(false);

  const generate = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const next = parseHexColors(input);
      setColors(next);
      setInput(next.join(' '));
      setParams({ colors: next.map(c => c.slice(1)).join(',') }, { replace: true });
      setError(false);
    } catch { setError(true); }
  };
  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); toast.success(t('tints.copied')); }
    catch { toast.error(t('tints.copyError')); }
  };
  const download = () => {
    const rows = ['base,type,percentage,hex'];
    colors.forEach(base => (['shade', 'tint'] as const).forEach(type => {
      generateTintShade(base, steps, type).forEach(c => rows.push(`${base},${type},${c.percentage},${c.hex}`));
    }));
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'swabColours-tints-shades.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <>
    <Header />
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container max-w-6xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 break-words">{t('tints.title')}</h1>
        <ColourToolLinks current="tints" colors={colors} />
        <form onSubmit={generate} className="border-y border-border py-6 mb-6">
          <label htmlFor="hex-colors" className="block text-sm font-medium mb-2">{t('tints.input')}</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea id="hex-colors" rows={3} value={input} onChange={e => setInput(e.target.value)} placeholder="#42EB99 #FF6347" spellCheck={false} dir="ltr" aria-invalid={error} aria-describedby={error ? 'hex-error' : undefined} className="flex-1 min-w-0 rounded-md border border-input bg-muted p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <Button type="submit" className="sm:self-end whitespace-normal">{t('tints.generate')}</Button>
          </div>
          {error && <p id="hex-error" role="alert" className="text-destructive text-sm mt-2">{t('tints.invalid')}</p>}
        </form>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{t('tints.steps')}</span>
            <div className="flex gap-1" role="group" aria-label={t('tints.steps')}>
              {[5, 10, 20].map(value => <Button key={value} variant={steps === value ? 'default' : 'secondary'} size="sm" aria-pressed={steps === value} onClick={() => setSteps(value)}>{value}</Button>)}
            </div>
          </div>
          <Button size="icon" variant="outline" onClick={download} title={t('tints.download')} aria-label={t('tints.download')}><Download /></Button>
        </div>
        <div className="space-y-10">
          {colors.map(base => <section key={base} className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="font-display text-xl font-semibold">{getColorName(base)} <span className="font-mono text-sm text-muted-foreground" dir="ltr">{base}</span></h2>
              <Button asChild size="sm" variant="outline" className="text-xs whitespace-normal h-auto min-h-9"><Link to={`/tools/swab-colours?colors=${base.slice(1)}`}><FlaskConical />{t('swabColours.goToLab')}</Link></Button>
            </div>
            {(['shade', 'tint'] as const).map(type => <div key={type} className="mb-5">
              <h3 className="font-body text-sm font-medium mb-2">{t(type === 'shade' ? 'tints.shades' : 'tints.tints')}</h3>
              <div className="overflow-x-auto pb-2" dir="ltr">
                <div className="flex min-w-full w-max">
                  {generateTintShade(base, steps, type).map(({ hex, percentage }) => <div key={percentage} className="w-20 md:w-24 flex-1 shrink-0 text-center">
                    <div className="text-xs text-muted-foreground mb-2">{percentage === 0 ? t('tints.base') : `${percentage}%`}</div>
                    <Button variant="ghost" className="group h-20 w-full rounded-none p-0" style={{ backgroundColor: hex, color: textColorForBg(hex) }} onClick={() => copy(hex)} title={`${t('tints.copy')}: ${hex}`} aria-label={`${t('tints.copy')}: ${hex}`}><Copy className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" /></Button>
                    <div className="font-mono text-xs text-foreground mt-2">{hex}</div>
                  </div>)}
                </div>
              </div>
            </div>)}
          </section>)}
        </div>
      </div>
    </main>
    <Footer />
  </>;
}