import { useTranslation } from 'react-i18next';

export type ColourToolId = 'lab' | 'library' | 'tints';

const SUFFIX_KEY: Record<ColourToolId, string> = {
  lab: 'swabColours.labName',
  library: 'swabColours.libraryName',
  tints: 'swabColours.tintsName',
};

/**
 * Harmonized page heading for all swabColours tools:
 * "swab" (black) + "Colours" (red) + tool name (muted), e.g. "swabColours Lab".
 */
export default function ToolHeading({ tool, className = '' }: { tool: ColourToolId; className?: string }) {
  const { t } = useTranslation();
  return (
    <h1 className={`font-display text-3xl md:text-4xl font-bold leading-tight break-words ${className}`}>
      <span className="text-foreground">{t('swabColours.title')}</span>
      <span className="text-accent">{t('swabColours.titleAccent')}</span>{' '}
      <span className="ml-2 text-xl md:text-2xl font-medium text-muted-foreground">
        {t(SUFFIX_KEY[tool])}
      </span>
    </h1>
  );
}
