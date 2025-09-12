import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface FilterButtonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  timeRange: '24h' | '1d' | '7d' | '30d' | 'all';
  onTimeRangeChange: (range: '24h' | '1d' | '7d' | '30d' | 'all') => void;
  totalActiveFilters: number;
}

export const FilterButton = memo(function FilterButton({ 
  isOpen, 
  onOpenChange, 
  timeRange, 
  onTimeRangeChange, 
  totalActiveFilters 
}: FilterButtonProps) {
  const [selectedChipIndex, setSelectedChipIndex] = useState(0);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const timeRangeOptions = [
    { value: '24h', label: '24h' },
    { value: '1d', label: '1d' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
    { value: 'all', label: 'All' }
  ] as const;

  const handleChipClick = useCallback((range: '24h' | '1d' | '7d' | '30d' | 'all', index: number) => {
    onTimeRangeChange(range);
    setSelectedChipIndex(index);
  }, [onTimeRangeChange]);

  const handleClearRange = useCallback(() => {
    onTimeRangeChange('all');
    setSelectedChipIndex(4); // Index of 'All' option
  }, [onTimeRangeChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onOpenChange(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setSelectedChipIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : timeRangeOptions.length - 1;
          chipRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case 'ArrowRight':
        e.preventDefault();
        setSelectedChipIndex(prev => {
          const newIndex = prev < timeRangeOptions.length - 1 ? prev + 1 : 0;
          chipRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        const selectedOption = timeRangeOptions[selectedChipIndex];
        onTimeRangeChange(selectedOption.value);
        break;
    }
  }, [isOpen, onOpenChange, selectedChipIndex, onTimeRangeChange]);

  // Focus first chip when popover opens
  useEffect(() => {
    if (isOpen) {
      // Find current time range index for initial focus
      const currentIndex = timeRangeOptions.findIndex(option => option.value === timeRange);
      setSelectedChipIndex(currentIndex >= 0 ? currentIndex : 4); // Default to 'All'
      
      // Focus the chip after a brief delay to ensure popover is rendered
      setTimeout(() => {
        chipRefs.current[currentIndex >= 0 ? currentIndex : 4]?.focus();
      }, 100);
    }
  }, [isOpen, timeRange]);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          ref={buttonRef}
          variant="ghost" 
          className={`border border-border bg-surface hover:bg-accent rounded-2xl relative focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            totalActiveFilters > 0 ? 'border-primary bg-primary/5' : ''
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          <ChevronDown 
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
          {totalActiveFilters > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
              {totalActiveFilters}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[520px] bg-surface border border-border rounded-xl shadow-lg p-4"
        align="end"
        sideOffset={8}
        onKeyDown={handleKeyDown}
      >
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-text">Time Range</h3>
          
          {/* Time Range Chips */}
          <div className="flex items-center gap-2">
            {timeRangeOptions.map((option, index) => (
              <button
                key={option.value}
                ref={(el) => chipRefs.current[index] = el}
                onClick={() => handleChipClick(option.value, index)}
                onFocus={() => setSelectedChipIndex(index)}
                className={`px-3 py-2 rounded-full text-sm transition-all focus:ring-2 focus:ring-ring focus:ring-offset-1 ${
                  timeRange === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-canvas text-subtext border border-border hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Footer with Clear Range */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleClearRange}
              className="text-sm text-subtext hover:text-text transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded px-2 py-1"
            >
              Clear range
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});