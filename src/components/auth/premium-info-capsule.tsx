import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '../ui/utils';

interface PremiumInfoCapsuleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PremiumInfoCapsule({ title, children, className }: PremiumInfoCapsuleProps) {
  return (
    <div className={cn(
      "border border-border rounded-2xl p-4 bg-white",
      "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-xl bg-primary/10 text-primary flex-shrink-0 mt-0.5">
          <Info size={16} />
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