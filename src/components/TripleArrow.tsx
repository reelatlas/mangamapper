import { ChevronRight, ChevronDown } from 'lucide-react';

export const TripleArrow = ({ collapsed, compact = false, className = '' }: { collapsed: boolean; compact?: boolean; className?: string }) => {
  const Icon = collapsed ? ChevronRight : ChevronDown;
  return (
    <div className="relative w-4 h-4 flex-shrink-0">
      <Icon className="absolute w-2.5 h-2.5 text-syntax-cyan" style={collapsed ? { left: 0, top: '50%', transform: 'translateY(-50%)' } : { top: 0, left: '50%', transform: 'translateX(-50%)' }} />
      <Icon className="absolute w-2.5 h-2.5 text-syntax-purple" style={collapsed ? { left: 4, top: '50%', transform: 'translateY(-50%)' } : { top: 4, left: '50%', transform: 'translateX(-50%)' }} />
      <Icon className="absolute w-2.5 h-2.5 text-syntax-pink" style={collapsed ? { left: 8, top: '50%', transform: 'translateY(-50%)' } : { top: 8, left: '50%', transform: 'translateX(-50%)' }} />
    </div>
  );
};
