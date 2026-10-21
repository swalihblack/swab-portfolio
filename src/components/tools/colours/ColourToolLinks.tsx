import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Library, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ColourToolLinks({ current, colors = [] }: { current: 'lab' | 'library' | 'tints'; colors?: string[] }) {
  const { t } = useTranslation();
  const query = colors.length ? `?colors=${colors.map(c => c.replace('#', '')).join(',')}` : '';
  const tools = [
    { id: 'lab', path: '/tools/swab-colours', key: 'nav.swabLab', icon: FlaskConical },
    { id: 'library', path: '/tools/swab-colours/library', key: 'nav.swabLibrary', icon: Library },
    { id: 'tints', path: '/tools/swab-colours/tints-shades', key: 'tints.title', icon: Layers },
  ];
  return <nav className="flex flex-wrap gap-2 mb-6" aria-label={t('nav.tools')}>
    {tools.filter(tool => tool.id !== current).map(tool => <Button key={tool.id} asChild variant="outline" size="sm" className="h-auto min-h-9 whitespace-normal text-xs">
      <Link to={`${tool.path}${query}`}><tool.icon size={14} />{t(tool.key)}</Link>
    </Button>)}
  </nav>;
}