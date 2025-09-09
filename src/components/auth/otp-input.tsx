import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../ui/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function OTPInput({ length = 6, value, onChange, error, className }: OTPInputProps) {
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
    <div className={cn("space-y-2", className)}>
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
              "w-12 h-12 md:w-11 md:h-11 text-center border border-border rounded-xl bg-surface text-text font-medium",
              "focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent",
              "transition-all duration-200",
              focusedIndex === index && "ring-2 ring-primary-hover border-transparent",
              error && "border-danger focus:ring-danger",
              digit && "border-primary"
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-danger text-center">{error}</p>
      )}
    </div>
  );
}