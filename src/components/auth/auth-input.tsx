import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../ui/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, helperText, icon, showPasswordToggle, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">
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
              "w-full h-12 md:h-11 px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-subtext transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-danger focus:ring-danger",
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
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-subtext hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-subtext">{helperText}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';