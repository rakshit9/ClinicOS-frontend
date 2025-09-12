interface StatusBadgeProps {
  variant: 'low' | 'medium' | 'high' | 'pending' | 'confirmed' | 'completed';
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const variants = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-danger/10 text-danger border-danger/20',
    pending: 'bg-subtext/10 text-subtext border-subtext/20',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-success/10 text-success border-success/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}