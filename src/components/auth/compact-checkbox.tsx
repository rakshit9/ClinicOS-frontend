import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../ui/utils';

interface CompactCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: React.ReactNode;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const CompactCheckbox = forwardRef<HTMLInputElement, CompactCheckboxProps>(
  ({ checked, onChange, label, error, disabled = false, className }, ref) => {
    return (
      <div className={cn("space-y-1", className)}>
        <label className="flex items-start gap-3 cursor-pointer group">
          {/* Checkbox container */}
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              className="sr-only"
            />
            
            {/* Custom checkbox */}
            <div className={cn(
              "w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
              {
                // Unchecked
                "border-border bg-white": !checked && !error,
                // Checked
                "border-primary bg-primary": checked && !error,
                // Error
                "border-danger": error,
                // Disabled
                "opacity-60 cursor-not-allowed": disabled,
                // Hover (only when not disabled)
                "group-hover:border-primary-hover": !disabled && !error,
              }
            )}>
              {checked && (
                <Check size={12} className="text-white" />
              )}
            </div>
          </div>
          
          {/* Label */}
          <div className={cn(
            "text-sm leading-relaxed",
            {
              "text-text": !error,
              "text-danger": error,
              "opacity-60": disabled,
            }
          )}>
            {label}
          </div>
        </label>
        
        {/* Error message */}
        {error && (
          <p className="text-xs text-danger font-medium ml-8">{error}</p>
        )}
      </div>
    );
  }
);

CompactCheckbox.displayName = 'CompactCheckbox';