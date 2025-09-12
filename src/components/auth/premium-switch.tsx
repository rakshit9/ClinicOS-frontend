import { forwardRef } from 'react';
import { cn } from '../ui/utils';

interface PremiumSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const PremiumSwitch = forwardRef<HTMLInputElement, PremiumSwitchProps>(
  ({ label, error, className, checked, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              className="sr-only"
              {...props}
            />
            <div
              className={cn(
                "w-11 h-6 bg-border rounded-full transition-all duration-200 cursor-pointer",
                "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
                "focus-within:ring-2 focus-within:ring-primary-hover focus-within:ring-offset-2",
                checked && "bg-primary shadow-lg shadow-primary/25",
                error && "bg-danger",
                className
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
                  "absolute top-1 left-1",
                  checked && "translate-x-5"
                )}
              />
            </div>
          </div>
          <span className="text-sm text-text">{label}</span>
        </div>
        {error && (
          <p className="text-sm text-danger leading-none">{error}</p>
        )}
      </div>
    );
  }
);

PremiumSwitch.displayName = 'PremiumSwitch';