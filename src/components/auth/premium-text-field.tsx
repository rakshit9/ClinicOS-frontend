import { useState, forwardRef } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { cn } from '../ui/utils';

interface PremiumTextFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  isValid?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PremiumTextField = forwardRef<HTMLInputElement, PremiumTextFieldProps>(
  ({ 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    error, 
    icon, 
    showPasswordToggle = false,
    isValid = false,
    disabled = false,
    className 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    return (
      <div className={cn("space-y-1", className)}>
        {/* Label - always visible */}
        <label className="block text-xs text-subtext font-medium uppercase tracking-wide">
          {label}
        </label>
        
        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext">
              {icon}
            </div>
          )}
          
          {/* Input field */}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              // Base styles
              "w-full h-12 sm:h-14 rounded-2xl bg-white border transition-all duration-200",
              "text-sm font-normal placeholder:text-subtext/60",
              // Padding
              icon ? "pl-12 pr-4" : "px-4",
              showPasswordToggle ? "pr-12" : isValid ? "pr-12" : "",
              // Premium filled-soft styling
              "shadow-filled-soft",
              // States
              {
                // Default
                "border-border": !error && !isFocused,
                // Focus
                "border-primary shadow-filled-soft-focus": isFocused && !error,
                // Error
                "border-danger": error,
                // Disabled
                "opacity-60 cursor-not-allowed": disabled,
              }
            )}
          />
          
          {/* Right icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Valid check icon */}
            {isValid && !showPasswordToggle && (
              <Check size={16} className="text-success" />
            )}
            
            {/* Password toggle */}
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-subtext hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <p className="text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

PremiumTextField.displayName = 'PremiumTextField';