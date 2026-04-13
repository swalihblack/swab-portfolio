import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ColorWheel from '@/components/tools/colours/ColorWheel';
import ColorInfo from '@/components/tools/colours/ColorInfo';
import ColorHarmonies from '@/components/tools/colours/ColorHarmonies';
import ColorPreviewPanel from '@/components/tools/colours/ColorPreviewPanel';
import ColorPalettes from '@/components/tools/colours/ColorPalettes';
import SwabBoy from '@/components/tools/colours/SwabBoy';
import HarmonyMeter from '@/components/tools/colours/HarmonyMeter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Library, Sparkles } from 'lucide-react';
import { textColorForBg } from '@/lib/colorUtils';

export default function SwabColoursPage() {
  const [searchParams] = useSearchParams();
  const initialColors = searchParams.get('colors')?.split(',').filter(Boolean).map(c => c.startsWith('#') ? c : `#${c}`) || ['#E63946'];
  
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const { t } = useTranslation();

  const activeColor = selectedColors[activeColorIndex] || selectedColors[0] || '#E63946';

  const handleColorChange = (hex: string) => {
    setSelectedColors(prev => {
      const next = [...prev];
      next[activeColorIndex] = hex;
      return next;
    });
  };

  const addColor = (hex: string) => {
    if (selectedColors.length < 10 && !selectedColors.includes(hex)) {
      setSelectedColors(prev => [...prev, hex]);
      setActiveColorIndex(selectedColors.length);
    }
  };

  const removeColor = (index: number) => {
    if (selectedColors.length <= 1) return;
    setSelectedColors(prev => prev.filter((_, i) => i !== index));
    setActiveColorIndex(Math.min(activeColorIndex, selectedColors.length - 2));
  };

  const handleHarmonySelect = (hex: string) => {
    addColor(hex);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t('swabColours.title')}<span className="text-accent">{t('swabColours.titleAccent')}</span>
                <span className="text-lg font-normal text-muted-foreground ml-2">Lab</span>
              </h1>
              <p className="font-body text-muted-foreground mt-1 text-sm max-w-2xl">
                {t('swabColours.subtitle')}
              </p>
            </div>
            <Link
              to="/tools/swab-colours/library"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Library size={16} />
              {t('swabColours.goToLibrary')}
            </Link>
          </div>

          {/* Selected Colors Bar */}
          <div className="bg-card border border-border rounded-lg p-3 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-foreground">{t('swabColours.selectedColors')}</h3>
              {selectedColors.length > 1 && (
                <button
                  onClick={() => { setSelectedColors([selectedColors[0]]); setActiveColorIndex(0); }}
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                >
                  {t('swabColours.clearAll')}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveColorIndex(i)}
                  className={`relative group h-10 min-w-[56px] rounded-md border-2 transition-all flex items-center justify-center ${
                    i === activeColorIndex ? 'border-accent ring-2 ring-accent/30 scale-105' : 'border-border hover:border-accent/50'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  <span className="text-[9px] font-mono" style={{ color: textColorForBg(c) }}>
                    {c.toUpperCase()}
                  </span>
                  {selectedColors.length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); removeColor(i); }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </span>
                  )}
                </button>
              ))}
              {selectedColors.length < 10 && (
                <button
                  onClick={() => addColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'))}
                  className="h-10 w-10 rounded-md border-2 border-dashed border-border hover:border-accent text-muted-foreground hover:text-accent transition-colors flex items-center justify-center text-lg"
                >
                  +
                </button>
              )}
            </div>
            {selectedColors.length > 1 && (
              <div className="mt-3">
                <HarmonyMeter colors={selectedColors} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
            <div className="space-y-4">
              <ColorWheel color={activeColor} onChange={handleColorChange} />
              <ColorInfo color={activeColor} onChange={handleColorChange} />
            </div>

            <div>
              <Tabs defaultValue="harmonies" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-muted">
                  <TabsTrigger value="harmonies" className="text-xs md:text-sm">{t('swabColours.harmonies')}</TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs md:text-sm">{t('swabColours.preview')}</TabsTrigger>
                  <TabsTrigger value="palettes" className="text-xs md:text-sm">{t('swabColours.palettes')}</TabsTrigger>
                  <TabsTrigger value="swabboy" className="text-xs md:text-sm flex items-center gap-1">
                    {t('swabColours.swabBoy')}
                    <span className="bg-accent text-accent-foreground text-[9px] px-1 py-0.5 rounded font-bold">AI</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="harmonies">
                  <ColorHarmonies color={activeColor} onSelect={handleHarmonySelect} />
                </TabsContent>
                <TabsContent value="preview">
                  <ColorPreviewPanel colors={selectedColors} />
                </TabsContent>
                <TabsContent value="palettes">
                  <ColorPalettes onSelect={addColor} selectedColor={activeColor} />
                </TabsContent>
                <TabsContent value="swabboy">
                  <SwabBoy colors={selectedColors} onSelect={addColor} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
