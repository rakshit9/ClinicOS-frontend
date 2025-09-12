import { useState, forwardRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '../ui/utils';

interface Option {
  value: string;
  label: string;
}

interface CompactSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}

export const CompactSelect = forwardRef<HTMLDivElement, CompactSelectProps>(
  ({ 
    label, 
    value, 
    onValueChange, 
    options, 
    placeholder, 
    error, 
    disabled = false,
    searchable = false,
    className 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredOptions = searchable 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    const selectedOption = options.find(option => option.value === value);

    const handleSelect = (optionValue: string) => {
      onValueChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    };

    return (
      <div className={cn("relative space-y-1", className)} ref={ref}>
        {/* Label */}
        <label className="block text-xs text-subtext font-medium uppercase tracking-wide">
          {label}
        </label>
        
        {/* Select button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            // Base styles
            "w-full h-12 sm:h-14 rounded-2xl bg-white border transition-all duration-200",
            "text-sm font-normal text-left flex items-center justify-between px-4",
            // Premium filled-soft styling
            "shadow-filled-soft",
            // States
            {
              // Default
              "border-border": !error && !isFocused,
              // Focus
              "border-primary shadow-filled-soft-focus": (isFocused || isOpen) && !error,
              // Error
              "border-danger": error,
              // Disabled
              "opacity-60 cursor-not-allowed": disabled,
            }
          )}
        >
          <span className={cn(
            selectedOption ? "text-text" : "text-subtext/60"
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown 
            size={16} 
            className={cn(
              "text-subtext transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        
        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Options */}
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white rounded-2xl border border-border shadow-lg max-h-60 overflow-hidden">
              {searchable && (
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 bg-canvas rounded-xl border-0 text-sm placeholder:text-subtext/60 focus:outline-none"
                    />
                  </div>
                </div>
              )}
              
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-subtext text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm hover:bg-canvas transition-colors flex items-center justify-between",
                        value === option.value && "bg-primary/5 text-primary"
                      )}
                    >
                      <span>{option.label}</span>
                      {value === option.value && (
                        <Check size={16} className="text-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Error message */}
        {error && (
          <p className="text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);

CompactSelect.displayName = 'CompactSelect';