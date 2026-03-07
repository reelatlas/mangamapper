import { ChevronRight, ChevronDown } from 'lucide-react';

export const TripleArrow = ({ collapsed, compact = false }: { collapsed: boolean; compact?: boolean }) => {
  const Icon = collapsed ? ChevronRight : ChevronDown;
  const spacing = compact
    ? (collapsed ? '-space-x-1.5' : '-space-y-1.5')
    : (collapsed ? '-space-x-1.5' : '-space-y-1.5');
  return (
    <div className={`flex flex-shrink-0 ${collapsed ? 'flex-row' : 'flex-col'} ${spacing}`}>
      <Icon className="w-2.5 h-2.5 text-syntax-cyan" />
      <Icon className="w-2.5 h-2.5 text-syntax-purple" />
      <Icon className="w-2.5 h-2.5 text-syntax-pink" />
    </div>
  );
};
