import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PALETTE_LIBRARY, CATEGORIES, type Palette } from '@/data/paletteLibrary';
import { textColorForBg, getColorFamily, COLOR_FAMILIES, hexToRgb, rgbToHsl, luminance } from '@/lib/colorUtils';
import { getColorName } from '@/lib/colorNames';
import ColorPreviewPanel from '@/components/tools/colours/ColorPreviewPanel';
import { ArrowLeft, FlaskConical, Eye, X, SlidersHorizontal } from 'lucide-react';

type SortKey = 'relevance' | 'name' | 'hue' | 'lightness' | 'category';

export default function SwabLibraryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [family, setFamily] = useState<string>('All');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);

  const filtered = useMemo(() => {
    let results = PALETTE_LIBRARY.slice();
    if (category !== 'All') results = results.filter(p => p.category === category);
    if (family !== 'All') {
      results = results.filter(p => p.colors.some(c => getColorFamily(c) === family));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some(c =>
          c.toLowerCase().includes(q) ||
          getColorFamily(c).toLowerCase().includes(q) ||
          getColorName(c).toLowerCase().includes(q)
        )
      );
    }
    const hueOf = (p: Palette) => rgbToHsl(...hexToRgb(p.colors[0]))[0];
    const lumOf = (p: Palette) => p.colors.reduce((s, c) => s + luminance(...hexToRgb(c)), 0) / p.colors.length;
    switch (sort) {
      case 'name': results.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'hue': results.sort((a, b) => hueOf(a) - hueOf(b)); break;
      case 'lightness': results.sort((a, b) => lumOf(b) - lumOf(a)); break;
      case 'category': results.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)); break;
    }
    return results;
  }, [search, category, family, sort]);

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
                  <div key={i} className="flex-1 flex flex-col items-center justify-center leading-tight" style={{ backgroundColor: c, color: textColorForBg(c) }}>
                    <span className="text-[10px] font-semibold">{getColorName(c)}</span>
                    <span className="text-[9px] font-mono opacity-80">{c.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <ColorPreviewPanel colors={selectedPalette.colors} />
            </div>
          )}

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-3 mb-4 space-y-3">
            <div className="flex flex-col md:flex-row gap-2">
              <input type="text" placeholder={t('swabColours.library.searchHint', 'Search by name, color, hex (e.g. ruby, #FF6347)…')} value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-muted rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent" />
              <div className="flex gap-2 flex-wrap">
                <select value={family} onChange={(e) => setFamily(e.target.value)}
                  className="bg-muted rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent">
                  <option value="All">{t('swabColours.library.allFamilies', 'All color families')}</option>
                  {COLOR_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-muted rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent">
                  <option value="relevance">{t('swabColours.library.sortRelevance', 'Sort: Default')}</option>
                  <option value="name">{t('swabColours.library.sortName', 'Sort: Name')}</option>
                  <option value="hue">{t('swabColours.library.sortHue', 'Sort: Hue')}</option>
                  <option value="lightness">{t('swabColours.library.sortLightness', 'Sort: Lightness')}</option>
                  <option value="category">{t('swabColours.library.sortCategory', 'Sort: Category')}</option>
                </select>
                <button onClick={() => setShowFilters(s => !s)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  <SlidersHorizontal size={14} />
                  {showFilters ? t('swabColours.library.hideCategories', 'Hide categories') : t('swabColours.library.showCategories', 'Categories')}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                <button onClick={() => setCategory('All')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${category === 'All' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {t('swabColours.library.allCategories')} ({PALETTE_LIBRARY.length})
                </button>
                {CATEGORIES.map(cat => {
                  const count = PALETTE_LIBRARY.filter(p => p.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${category === cat ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('swabColours.library.showing', { count: filtered.length })}</span>
              {(category !== 'All' || family !== 'All' || search || sort !== 'relevance') && (
                <button onClick={() => { setCategory('All'); setFamily('All'); setSearch(''); setSort('relevance'); }}
                  className="text-accent hover:underline">{t('swabColours.library.reset', 'Reset filters')}</button>
              )}
            </div>
          </div>

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
          <div key={i} className="flex-1 flex flex-col items-center justify-center leading-tight" style={{ backgroundColor: c }} title={`${getColorName(c)} ${c.toUpperCase()}`}>
            <span className="text-[8px] font-semibold opacity-0 group-hover:opacity-90 transition-opacity" style={{ color: textColorForBg(c) }}>{getColorName(c)}</span>
            <span className="text-[7px] font-mono opacity-0 group-hover:opacity-70 transition-opacity" style={{ color: textColorForBg(c) }}>{c.toUpperCase()}</span>
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
