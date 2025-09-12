import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../ui/utils';

interface AuthCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
}

export const AuthCheckbox = forwardRef<HTMLInputElement, AuthCheckboxProps>(
  ({ label, error, className, checked, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              className="sr-only"
              {...props}
            />
            <div
              className={cn(
                "w-5 h-5 border-2 border-border rounded-lg transition-all duration-200 cursor-pointer touch-target-48 flex items-center justify-center",
                "hover:border-primary",
                "focus-within:ring-2 focus-within:ring-primary-hover focus-within:ring-offset-2",
                checked && "bg-primary border-primary",
                error && "border-danger",
                className
              )}
            >
              {checked && (
                <Check size={12} className="text-primary-foreground" />
              )}
            </div>
          </div>
          <div className="text-sm text-text leading-relaxed min-h-[24px] flex items-center">
            {label}
          </div>
        </div>
        {error && (
          <p className="text-sm text-danger ml-8">{error}</p>
        )}
      </div>
    );
  }
);

AuthCheckbox.displayName = 'AuthCheckbox';