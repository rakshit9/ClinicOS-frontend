import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../ui/utils';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, icon, showPasswordToggle, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-subtext uppercase tracking-wider">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              // Base styles - FilledSoft premium design
              "w-full bg-white border border-border rounded-2xl transition-all duration-200",
              "h-12 md:h-12 px-4 py-3.5 text-base text-text placeholder:text-subtext placeholder:opacity-70",
              // Inset shadow for depth
              "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
              // Focus states with ring and glow
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-hover",
              "focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.06),0_0_0_4px_rgba(99,91,255,0.12)]",
              // Error states
              error && "border-danger focus:border-danger focus:ring-danger",
              // Disabled states
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
              // Icon padding
              icon && "pl-12",
              showPasswordToggle && "pr-12",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-subtext hover:text-text transition-colors touch-target-48"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger leading-none">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-subtext leading-none">{helperText}</p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';