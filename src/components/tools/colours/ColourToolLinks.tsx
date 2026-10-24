import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FlaskConical, Library, Layers } from 'lucide-react';
import type { ColourToolId } from './ToolHeading';

const TOOLS = [
  { id: 'lab', path: '/tools/swab-colours', nameKey: 'swabColours.labName', icon: FlaskConical },
  { id: 'library', path: '/tools/swab-colours/library', nameKey: 'swabColours.libraryName', icon: Library },
  { id: 'tints', path: '/tools/swab-colours/tints-shades', nameKey: 'swabColours.tintsName', icon: Layers },
] as const;

/**
 * Shared cross-tool navigation, identical on all three swabColours pages:
 * a "swabColours" brand label followed by buttons for the other tools,
 * transferring the selected colours via the ?colors= query parameter.
 */
export default function ColourToolLinks({ current, colors = [] }: { current: ColourToolId; colors?: string[] }) {
  const { t } = useTranslation();
  const query = colors.length ? `?colors=${colors.map(c => c.replace('#', '')).join(',')}` : '';
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2" role="navigation" aria-label={t('nav.tools')}>
      <span className="font-display text-base font-bold tracking-tight" aria-hidden="true">
        <span className="text-foreground">swab</span>
        <span className="text-accent">Colours</span>
      </span>
      <div className="flex flex-wrap gap-2">
        {TOOLS.filter(tool => tool.id !== current).map(tool => (
          <Link
            key={tool.id}
            to={`${tool.path}${query}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground elevation-1 hover:elevation-2 hover:border-accent/50 hover:text-foreground transition-all"
          >
            <tool.icon size={14} />
            {t(tool.nameKey)}
          </Link>
        ))}
      </div>
    </div>
  );
}
