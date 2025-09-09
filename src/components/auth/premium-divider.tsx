import React from 'react';

interface PremiumDividerProps {
  text?: string;
}

export function PremiumDivider({ text = "or" }: PremiumDividerProps) {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 border-t border-border" />
      <div className="px-4 text-sm text-subtext bg-white">
        {text}
      </div>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}