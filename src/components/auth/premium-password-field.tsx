import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '../ui/utils';

interface PremiumPasswordFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  showStrengthMeter?: boolean;
}

interface StrengthMeterProps {
  password: string;
  className?: string;
}

const StrengthMeter = ({ password, className }: StrengthMeterProps) => {
  const getStrength = (password: string): { level: number; label: string } => {
    if (!password) return { level: 0, label: '' };
    if (password.length < 6) return { level: 1, label: 'Weak' };
    if (password.length < 10) return { level: 2, label: 'OK' };
    return { level: 3, label: 'Strong' };
  };

  const { level, label } = getStrength(password);

  if (!password) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors",
              {
                "bg-danger": segment <= level && level === 1,
                "bg-warning": segment <= level && level === 2,
                "bg-success": segment <= level && level === 3,
                "bg-border": segment > level,
              }
            )}
          />
        ))}
      </div>
      {label && (
        <span 
          className={cn(
            "text-xs font-medium tabular-nums",
            {
              "text-danger": level === 1,
              "text-warning": level === 2,
              "text-success": level === 3,
            }
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export const PremiumPasswordField = forwardRef<HTMLInputElement, PremiumPasswordFieldProps>(
  ({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    error, 
    disabled = false,
    className,
    showStrengthMeter = false
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("space-y-1", className)}>
        {/* Label */}
        <label className="block text-xs text-subtext font-medium uppercase tracking-wide">
          {label}
        </label>
        
        {/* Input container */}
        <div className="space-y-2">
          <div className="relative">
            {/* Left icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext">
              <Lock size={18} />
            </div>
            
            {/* Input field */}
            <input
              ref={ref}
              type={showPassword ? 'text' : 'password'}
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
                "pl-12 pr-12",
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
            
            {/* Password toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          {/* Strength meter */}
          {showStrengthMeter && (
            <StrengthMeter password={value} className="px-1" />
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <p className="text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

PremiumPasswordField.displayName = 'PremiumPasswordField';