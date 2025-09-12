import { useMemo } from 'react';
import { cn } from '../ui/utils';

interface PremiumPasswordStrengthProps {
  password: string;
  className?: string;
}

export function PremiumPasswordStrength({ password, className }: PremiumPasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    
    let label = '';
    let color = '';
    if (score === 0) {
      label = '';
      color = '';
    } else if (score <= 25) {
      label = 'Weak';
      color = 'text-danger';
    } else if (score <= 50) {
      label = 'Okay';
      color = 'text-warning';
    } else if (score <= 75) {
      label = 'Good';
      color = 'text-accent';
    } else {
      label = 'Strong';
      color = 'text-primary';
    }
    
    return { score, label, color };
  }, [password]);

  if (!password) return null;

  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <div className="flex gap-1">
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          strength.score >= 25 ? "bg-primary" : "bg-border"
        )} />
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          strength.score >= 50 ? "bg-primary" : "bg-border"
        )} />
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          strength.score >= 75 ? "bg-primary" : "bg-border"
        )} />
      </div>
      <span className={cn("font-medium", strength.color)}>{strength.label}</span>
    </div>
  );
}