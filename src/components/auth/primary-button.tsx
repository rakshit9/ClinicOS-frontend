import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ loading = false, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(
          // Base styles
          "h-[52px] px-8 rounded-2xl font-medium text-sm transition-all duration-200",
          "min-w-[200px] relative overflow-hidden",
          // Colors and gradients - using CSS variables for theming
          "bg-gradient-to-r from-primary to-primary",
          "text-primary-fg",
          // Hover and active states
          "hover:from-primary-hover hover:to-primary-hover hover:-translate-y-0.5",
          "active:translate-y-0.5",
          // Focus
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          // Disabled
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
          // Additional effects
          "shadow-lg hover:shadow-xl",
          className
        )}
        {...props}
      >
        {/* Content */}
        <span className={cn(
          "flex items-center justify-center gap-2 transition-opacity",
          loading && "opacity-0"
        )}>
          {children}
        </span>
        
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={18} className="animate-spin text-primary-fg" />
          </div>
        )}
      </button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';