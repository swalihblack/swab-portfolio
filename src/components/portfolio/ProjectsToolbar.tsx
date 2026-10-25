import { useTranslation } from 'react-i18next';
import { Columns2, Rows3, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ProjectSortKey } from '@/lib/projectSort';

export type ProjectViewMode = 'single' | 'double' | 'list';

interface ProjectsToolbarProps {
  view: ProjectViewMode;
  onViewChange: (v: ProjectViewMode) => void;
  sort: ProjectSortKey;
  onSortChange: (s: ProjectSortKey) => void;
  tools: string[];
  activeTool: string | null;
  onToolChange: (t: string | null) => void;
}

export function ProjectsToolbar({ view, onViewChange, sort, onSortChange, tools, activeTool, onToolChange }: ProjectsToolbarProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(next) => {
            if (next === 'single' || next === 'double' || next === 'list') onViewChange(next);
          }}
          className="rounded-md bg-card p-1 elevation-1"
          aria-label="Project layout"
        >
          <ToggleGroupItem value="single" aria-label="One project per row" className="gap-2 px-3">
            <Rows3 size={16} />
            <span className="font-body text-xs">1-up</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="double" aria-label="Two projects per row" className="gap-2 px-3">
            <Columns2 size={16} />
            <span className="font-body text-xs">2-up</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label={t('portfolio.viewList')} className="gap-2 px-3">
            <List size={16} />
            <span className="font-body text-xs">{t('portfolio.viewList')}</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <label className="flex items-center gap-2">
          <span className="font-body text-xs text-muted-foreground">{t('portfolio.sortLabel')}</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ProjectSortKey)}
            className="rounded-md bg-muted px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="newest">{t('portfolio.sortNewest')}</option>
            <option value="oldest">{t('portfolio.sortOldest')}</option>
            <option value="name">{t('portfolio.sortName')}</option>
            <option value="year">{t('portfolio.sortYear')}</option>
          </select>
        </label>
      </div>
      {tools.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onToolChange(null)}
            aria-pressed={activeTool === null}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              activeTool === null ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t('portfolio.filterAll')}
          </button>
          {tools.map(tool => (
            <button
              key={tool}
              onClick={() => onToolChange(activeTool === tool ? null : tool)}
              aria-pressed={activeTool === tool}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                activeTool === tool ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
