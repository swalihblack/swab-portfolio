import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PALETTE_LIBRARY, CATEGORIES, type Palette } from '@/data/paletteLibrary';
import { textColorForBg } from '@/lib/colorUtils';
import ColorPreviewPanel from '@/components/tools/colours/ColorPreviewPanel';
import { ArrowLeft, FlaskConical, Eye, X } from 'lucide-react';

export default function SwabLibraryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);

  const filtered = useMemo(() => {
    let results = PALETTE_LIBRARY;
    if (category !== 'All') results = results.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return results;
  }, [search, category]);

  const openInLab = (palette: Palette) => {
    const colorsParam = palette.colors.map(c => c.replace('#', '')).join(',');
    navigate(`/tools/swab-colours?colors=${colorsParam}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Link to="/tools/swab-colours" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-4">
                <ArrowLeft size={14} />
                {t('swabColours.labTitle')}
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{t('swabColours.library.title')}</h1>
              <p className="font-body text-muted-foreground mt-2 text-sm md:text-base max-w-2xl">{t('swabColours.library.subtitle', { count: CATEGORIES.length })}</p>
            </div>
            <Link to="/tools/swab-colours" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <FlaskConical size={16} />
              {t('swabColours.goToLab')}
            </Link>
          </div>

          {/* Selected palette preview */}
          {selectedPalette && (
            <div className="mb-6 bg-card border border-accent/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{t('swabColours.library.selectedPalette')}: {selectedPalette.name}</h3>
                  <span className="text-[10px] text-muted-foreground">{selectedPalette.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openInLab(selectedPalette)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                    <FlaskConical size={12} />
                    {t('swabColours.goToLab')}
                  </button>
                  <button onClick={() => setSelectedPalette(null)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"><X size={14} /></button>
                </div>
              </div>
              <div className="flex rounded-md overflow-hidden h-10 mb-4">
                {selectedPalette.colors.map((c, i) => (
                  <div key={i} className="flex-1 flex items-center justify-center" style={{ backgroundColor: c }}>
                    <span className="text-[9px] font-mono" style={{ color: textColorForBg(c) }}>{c}</span>
                  </div>
                ))}
              </div>
              <ColorPreviewPanel colors={selectedPalette.colors} />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input type="text" placeholder={t('swabColours.library.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-muted rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === 'All' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {t('swabColours.library.allCategories')} ({PALETTE_LIBRARY.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = PALETTE_LIBRARY.filter(p => p.category === cat).length;
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${category === cat ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mb-4">{t('swabColours.library.showing', { count: filtered.length })}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((palette, idx) => (
              <PaletteCard key={`${palette.name}-${idx}`} palette={palette} onSelect={() => setSelectedPalette(palette)} onOpenLab={() => openInLab(palette)} selected={selectedPalette?.name === palette.name} />
            ))}
          </div>

          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">{t('swabColours.library.noPalettes')}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}

function PaletteCard({ palette, onSelect, onOpenLab, selected }: { palette: Palette; onSelect: () => void; onOpenLab: () => void; selected: boolean }) {
  return (
    <div className={`bg-card border rounded-lg p-3 transition-colors group ${selected ? 'border-accent' : 'border-border hover:border-accent/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-foreground truncate">{palette.name}</h4>
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{palette.category}</span>
      </div>
      <div className="flex rounded-md overflow-hidden h-10 mb-2">
        {palette.colors.map((c, i) => (
          <div key={i} className="flex-1 flex items-center justify-center" style={{ backgroundColor: c }} title={c}>
            <span className="text-[8px] font-mono opacity-0 group-hover:opacity-80 transition-opacity" style={{ color: textColorForBg(c) }}>{c}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onSelect} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <Eye size={10} /> Preview
        </button>
        <button onClick={onOpenLab} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <FlaskConical size={10} /> Lab
        </button>
      </div>
    </div>
  );
}
