import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';

interface PremiumSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export const PremiumSelect = forwardRef<HTMLDivElement, PremiumSelectProps>(
  ({ label, value, onValueChange, options, placeholder, error, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="space-y-2">
        <label className="block text-xs font-medium text-subtext uppercase tracking-wider">
          {label}
        </label>
        <div className="relative" ref={selectRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full bg-white border border-border rounded-2xl transition-all duration-200",
              "h-12 md:h-12 px-4 py-3.5 text-base text-left",
              "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-hover",
              "focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.06),0_0_0_4px_rgba(99,91,255,0.12)]",
              "flex items-center justify-between",
              error && "border-danger focus:border-danger focus:ring-danger",
              !selectedOption && "text-subtext opacity-70",
              className
            )}
          >
            <span>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown 
              size={20} 
              className={cn(
                "text-subtext transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 max-h-60 overflow-auto"
                 style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left text-base transition-colors",
                    "hover:bg-canvas first:rounded-t-2xl last:rounded-b-2xl",
                    value === option.value && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger leading-none">{error}</p>
        )}
      </div>
    );
  }
);

PremiumSelect.displayName = 'PremiumSelect';