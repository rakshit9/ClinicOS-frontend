import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

interface AuroraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'google';
  loading?: boolean;
  children: React.ReactNode;
}

export const AuroraButton = forwardRef<HTMLButtonElement, AuroraButtonProps>(
  ({ variant = 'primary', loading, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-200",
          "min-h-[48px] md:min-h-[48px] touch-target-48",
          "focus:outline-none focus:ring-2 focus:ring-primary-hover focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.99] hover:translate-y-[-2px] active:translate-y-[1px]",
          variant === 'primary' && [
            "text-primary-fg font-medium",
            "shadow-lg shadow-primary/25",
            // Aurora gradient background
            "bg-gradient-to-r from-[#6A66FF] to-[#2BD4B0]",
            "hover:shadow-xl hover:shadow-primary/30",
            "active:shadow-md active:shadow-primary/20"
          ],
          variant === 'ghost' && [
            "border border-border bg-white text-text",
            "hover:bg-canvas hover:border-subtext hover:translate-y-[-2px]",
            "active:bg-border active:translate-y-[1px]",
            "shadow-sm"
          ],
          variant === 'google' && [
            "border border-border bg-white text-text",
            "hover:bg-canvas hover:border-subtext hover:translate-y-[-2px]",
            "active:bg-border active:translate-y-[1px]",
            "shadow-sm"
          ],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && children}
      </button>
    );
  }
);

AuroraButton.displayName = 'AuroraButton';