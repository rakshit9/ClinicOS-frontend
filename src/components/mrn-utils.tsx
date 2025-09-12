import React, { useState } from 'react';
import { Copy, QrCode, ExternalLink, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';

// MRN Generation
export const generateMRN = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  return `MRN-${year}-${randomNum}`;
};

// MRN Validation
export const isValidMRN = (mrn: string): boolean => {
  const mrnPattern = /^MRN-\d{4}-\d{4}$/;
  return mrnPattern.test(mrn);
};

// MRN Copy Component
interface MRNCopyProps {
  mrn: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function MRNCopy({ mrn, size = 'md', showIcon = true }: MRNCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      await navigator.clipboard.writeText(mrn);
      setCopied(true);
      toast.success('MRN copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy MRN');
    }
  };

  const iconSize = (() => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  })();

  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'sm' : 'sm'}
      onClick={handleCopy}
      className="h-auto p-1 text-subtext hover:text-text transition-colors"
      title="Click to copy MRN"
    >
      {showIcon && (
        copied ? (
          <Check className={`${iconSize} text-success`} />
        ) : (
          <Copy className={iconSize} />
        )
      )}
    </Button>
  );
}

// MRN Chip Component
interface MRNChipProps {
  mrn: string;
  size?: 'sm' | 'md' | 'lg';
  showCopy?: boolean;
  onClick?: () => void;
}

export function MRNChip({ mrn, size = 'md', showCopy = true, onClick }: MRNChipProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const chipSize = (() => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1';
      case 'lg': return 'text-base px-4 py-2';
      default: return 'text-sm px-3 py-1';
    }
  })();

  return (
    <div className="flex items-center gap-1">
      <Badge
        variant="secondary"
        className={`bg-muted/50 text-subtext border border-border rounded-full font-mono ${chipSize} cursor-pointer hover:bg-muted transition-colors`}
        onClick={handleClick}
      >
        {mrn}
      </Badge>
      {showCopy && <MRNCopy mrn={mrn} size={size} />}
    </div>
  );
}

// MRN Actions Component (Copy, QR, Link)
interface MRNActionsProps {
  mrn: string;
  patientId?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MRNActions({ mrn, patientId, size = 'md' }: MRNActionsProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(mrn);
      setCopied(true);
      toast.success('MRN copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy MRN');
    }
  };

  const handleQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQR(true);
  };

  const handleLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/patient/${mrn}`;
    navigator.clipboard.writeText(url);
    toast.success('Patient link copied');
  };

  const iconSize = (() => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  })();

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-auto p-1.5 text-subtext hover:text-text transition-colors"
          title="Copy MRN"
        >
          {copied ? (
            <Check className={`${iconSize} text-success`} />
          ) : (
            <Copy className={iconSize} />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleQR}
          className="h-auto p-1.5 text-subtext hover:text-text transition-colors"
          title="Show QR Code"
        >
          <QrCode className={iconSize} />
        </Button>
     
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md bg-surface border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-text">QR Code - {mrn}</DialogTitle>
            <DialogDescription className="text-subtext">
              QR code for patient MRN {mrn}, optimized for label printing and easy scanning.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            {/* QR Code Placeholder */}
            <div className="w-48 h-48 bg-muted border border-border rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-8 h-8 text-subtext mx-auto mb-2" />
                <p className="text-subtext text-sm">QR Code for {mrn}</p>
                <p className="text-subtext text-xs mt-1">Optimized for label printing</p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-mono text-lg mb-2">{mrn}</p>
              <p className="text-subtext text-sm">Scan to access patient record</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Enhanced MRN Display with Actions
interface MRNDisplayProps {
  mrn: string;
  patientId?: string;
  variant?: 'chip' | 'full' | 'badge';
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
}

export function MRNDisplay({ 
  mrn, 
  patientId, 
  variant = 'chip', 
  size = 'md',
  showActions = false 
}: MRNDisplayProps) {
  if (variant === 'full') {
    return (
      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className={`bg-muted/50 text-subtext border border-border rounded-full font-mono ${
            size === 'lg' ? 'text-base px-4 py-2' : 
            size === 'md' ? 'text-sm px-3 py-1' : 
            'text-xs px-2 py-1'
          }`}
        >
          {mrn}
        </Badge>
        {showActions && <MRNActions mrn={mrn} patientId={patientId} size={size} />}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <Badge
        variant="secondary"
        className="bg-muted/50 text-subtext border border-border rounded-full font-mono text-xs px-2 py-0.5"
      >
        {mrn}
      </Badge>
    );
  }

  return <MRNChip mrn={mrn} size={size} showCopy={showActions} />;
}