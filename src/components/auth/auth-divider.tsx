interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or" }: AuthDividerProps) {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 border-t border-border" />
      <div className="px-4 text-sm text-subtext bg-surface">
        {text}
      </div>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}