import { Info } from 'lucide-react';
import { cn } from '../ui/utils';

interface InfoCapsuleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCapsule({ title, children, className }: InfoCapsuleProps) {
  return (
    <div className={cn(
      "border border-border rounded-xl p-4 bg-surface/50",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-0.5">
          <Info size={14} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text">{title}</h4>
          <div className="text-sm text-subtext">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}