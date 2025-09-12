import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'google';
  loading?: boolean;
  children: React.ReactNode;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ variant = 'primary', loading, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 min-h-[52px] md:min-h-[48px] touch-target-48",
          "focus:outline-none focus:ring-2 focus:ring-primary-hover focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variant === 'primary' && [
            "bg-aurora-btn text-primary-foreground",
            "hover:bg-primary-hover",
            "active:bg-primary-press",
            "shadow-lg shadow-primary/25"
          ],
          variant === 'ghost' && [
            "border border-border bg-surface text-text",
            "hover:bg-canvas hover:border-subtext",
            "active:bg-border"
          ],
          variant === 'google' && [
            "border border-border bg-surface text-text",
            "hover:bg-canvas hover:border-subtext",
            "active:bg-border"
          ],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && children}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';