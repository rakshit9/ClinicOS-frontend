import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../ui/utils';

interface PremiumOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function PremiumOTP({ length = 6, value, onChange, error, className }: PremiumOTPProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit.slice(-1);
    onChange(newDigits.join(''));

    // Auto focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedText);
    
    // Focus the next empty field or the last field
    const nextIndex = Math.min(pastedText.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-3 justify-center">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            className={cn(
              "w-12 h-12 text-center border border-border rounded-2xl bg-white text-text font-medium text-lg",
              "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-hover",
              "focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.06),0_0_0_4px_rgba(99,91,255,0.12)]",
              "transition-all duration-200",
              focusedIndex === index && "border-primary ring-2 ring-primary-hover",
              error && "border-danger focus:border-danger focus:ring-danger",
              digit && "border-primary"
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-danger text-center leading-none">{error}</p>
      )}
    </div>
  );
}