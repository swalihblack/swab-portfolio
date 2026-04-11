import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ColorWheel from '@/components/tools/colours/ColorWheel';
import ColorInfo from '@/components/tools/colours/ColorInfo';
import ColorHarmonies from '@/components/tools/colours/ColorHarmonies';
import ColorPreview from '@/components/tools/colours/ColorPreview';
import ColorPalettes from '@/components/tools/colours/ColorPalettes';
import ColorSuggestions from '@/components/tools/colours/ColorSuggestions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SwabColoursPage() {
  const [selectedColor, setSelectedColor] = useState('#E63946');
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {t('swabColours.title')}<span className="text-accent">{t('swabColours.titleAccent')}</span>
            </h1>
            <p className="font-body text-muted-foreground mt-2 text-sm md:text-base max-w-2xl">
              {t('swabColours.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
            <div className="space-y-4">
              <ColorWheel color={selectedColor} onChange={setSelectedColor} />
              <ColorInfo color={selectedColor} onChange={setSelectedColor} />
            </div>

            <div>
              <Tabs defaultValue="harmonies" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-muted">
                  <TabsTrigger value="harmonies" className="text-xs md:text-sm">{t('swabColours.harmonies')}</TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs md:text-sm">{t('swabColours.preview')}</TabsTrigger>
                  <TabsTrigger value="palettes" className="text-xs md:text-sm">{t('swabColours.palettes')}</TabsTrigger>
                  <TabsTrigger value="suggest" className="text-xs md:text-sm">{t('swabColours.suggest')}</TabsTrigger>
                </TabsList>
                <TabsContent value="harmonies">
                  <ColorHarmonies color={selectedColor} onSelect={setSelectedColor} />
                </TabsContent>
                <TabsContent value="preview">
                  <ColorPreview color={selectedColor} />
                </TabsContent>
                <TabsContent value="palettes">
                  <ColorPalettes onSelect={setSelectedColor} selectedColor={selectedColor} />
                </TabsContent>
                <TabsContent value="suggest">
                  <ColorSuggestions color={selectedColor} onSelect={setSelectedColor} />
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
