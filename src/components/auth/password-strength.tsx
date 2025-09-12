import { useMemo } from 'react';
import { cn } from '../ui/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '' };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    
    let label = '';
    if (score === 0) label = '';
    else if (score <= 25) label = 'Weak';
    else if (score <= 50) label = 'Okay';
    else if (score <= 75) label = 'Good';
    else label = 'Strong';
    
    return { score, label };
  }, [password]);

  if (!password) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
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
      <span className="text-subtext">{strength.label}</span>
    </div>
  );
}