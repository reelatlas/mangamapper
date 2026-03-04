import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { List, Glasses } from 'lucide-react';

export type ViewMode = 'flat' | 'by_reader';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => (
  <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && onViewModeChange(val as ViewMode)} className="gap-1">
    <ToggleGroupItem value="flat" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground gap-1">
      <List className="w-3 h-3" />
      <span className="hidden sm:inline">all</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="by_reader" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground gap-1">
      <Glasses className="w-3 h-3" />
      <span className="hidden sm:inline">by_reader</span>
    </ToggleGroupItem>
  </ToggleGroup>
);
