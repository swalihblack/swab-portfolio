import { Columns2, Rows3 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PortfolioViewToggleProps {
  value: 'single' | 'double';
  onValueChange: (value: 'single' | 'double') => void;
}

export function PortfolioViewToggle({ value, onValueChange }: PortfolioViewToggleProps) {
  return (
    <div className="mb-8 flex justify-center">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue === 'single' || nextValue === 'double') {
            onValueChange(nextValue);
          }
        }}
        className="rounded-md bg-card p-1 elevation-1"
        aria-label="Project grid layout"
      >
        <ToggleGroupItem value="single" aria-label="One project per row" className="gap-2 px-3">
          <Rows3 size={16} />
          <span className="font-body text-xs">1-up</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="double" aria-label="Two projects per row" className="gap-2 px-3">
          <Columns2 size={16} />
          <span className="font-body text-xs">2-up</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}