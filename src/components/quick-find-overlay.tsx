import React, { useState, useEffect } from 'react';
import { Search, User, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface Patient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  avatar?: string;
  tags: string[];
  phone?: string;
}

interface QuickFindOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patientId: string) => void;
}

export function QuickFindOverlay({ open, onOpenChange, onPatientSelect }: QuickFindOverlayProps) {
  const [query, setQuery] = useState('');
  const [copiedMRN, setCopiedMRN] = useState<string | null>(null);

  // Mock patient data
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Rodriguez',
      mrn: 'MRN-2025-1234',
      age: 34,
      tags: ['Diabetes', 'Hypertension'],
      phone: '(555) 123-4567'
    },
    {
      id: '2',
      name: 'Michael Chen',
      mrn: 'MRN-2025-1235',
      age: 28,
      tags: ['Annual Checkup'],
      phone: '(555) 234-5678'
    },
    {
      id: '3',
      name: 'Emily Johnson',
      mrn: 'MRN-2025-1236',
      age: 45,
      tags: ['Post-Surgery', 'Follow-up'],
      phone: '(555) 345-6789'
    },
    {
      id: '4',
      name: 'David Park',
      mrn: 'MRN-2025-1237',
      age: 52,
      tags: ['Diabetes', 'Lab Results'],
      phone: '(555) 456-7890'
    },
    {
      id: '5',
      name: 'Lisa Wong',
      mrn: 'MRN-2025-1238',
      age: 38,
      tags: ['Preventive Care'],
      phone: '(555) 567-8901'
    },
    {
      id: '6',
      name: 'Robert Taylor',
      mrn: 'MRN-2025-1239',
      age: 61,
      tags: ['Cholesterol', 'Cardiology'],
      phone: '(555) 678-9012'
    }
  ];

  // Filter patients based on query
  const filteredPatients = mockPatients.filter(patient => {
    if (!query) return false;
    
    const searchTerm = query.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.mrn.toLowerCase().includes(searchTerm) ||
      patient.phone?.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')) ||
      patient.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      
      if (open && e.key === 'Escape') {
        onOpenChange(false);
      }
      
      if (open && e.key === 'Enter' && filteredPatients.length > 0) {
        handlePatientSelect(filteredPatients[0].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange, filteredPatients]);

  // Reset state when opening/closing
  useEffect(() => {
    if (open) {
      setQuery('');
      setCopiedMRN(null);
    }
  }, [open]);

  const handlePatientSelect = (patientId: string) => {
    onPatientSelect(patientId);
    onOpenChange(false);
  };

  const handleCopyMRN = async (mrn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(mrn);
      setCopiedMRN(mrn);
      toast.success('MRN copied');
      setTimeout(() => setCopiedMRN(null), 2000);
    } catch (error) {
      toast.error('Failed to copy MRN');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-surface border-border rounded-2xl p-0 gap-0">
        <DialogTitle className="sr-only">
          Quick Find Patient Search
        </DialogTitle>
        <DialogDescription className="sr-only">
          Search for patients by name, MRN, or phone number. Use keyboard shortcuts to navigate and select patients.
        </DialogDescription>
        {/* Search Header */}
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <Search className="w-5 h-5 text-subtext" />
          <Input
            placeholder="Search patients, MRN, or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent text-text placeholder:text-subtext focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
            autoFocus
          />
          <div className="flex items-center gap-2 text-subtext text-sm">
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-2 text-xs">
              <span>⌘K</span>
            </kbd>
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-96">
          {query && filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="w-8 h-8 text-subtext mb-3" />
              <p className="text-subtext font-medium">No patients found</p>
              <p className="text-subtext text-sm">Try searching by name, MRN, or phone number</p>
            </div>
          ) : query ? (
            <div className="p-2">
              {filteredPatients.map((patient, index) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-accent text-left transition-colors ${
                    index === 0 ? 'bg-accent/50' : ''
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-text font-medium truncate">{patient.name}</h4>
                      <Badge
                        variant="secondary"
                        className="bg-muted/50 text-subtext border border-border rounded-full font-mono text-xs px-2 py-0.5 flex-shrink-0"
                      >
                        {patient.mrn}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-subtext text-sm">
                      <span>{patient.age} years old</span>
                      {patient.phone && (
                        <>
                          <span>•</span>
                          <span>{patient.phone}</span>
                        </>
                      )}
                    </div>
                    
                    {patient.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {patient.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-accent border-border"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {patient.tags.length > 2 && (
                          <span className="text-subtext text-xs">
                            +{patient.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Copy MRN Action */}
                  <div
                    onClick={(e) => handleCopyMRN(patient.mrn, e)}
                    className="h-auto p-2 text-subtext hover:text-text transition-colors flex-shrink-0 cursor-pointer rounded-lg hover:bg-accent"
                    title="Copy MRN"
                  >
                    {copiedMRN === patient.mrn ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-8 h-8 text-subtext mb-3" />
              <p className="text-subtext font-medium">Quick Find</p>
              <p className="text-subtext text-sm">Start typing to search patients by name, MRN, or phone</p>
              <div className="flex items-center gap-2 mt-4 text-subtext text-xs">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5">
                  <span>↵</span>
                </kbd>
                <span>to select</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5">
                  <span>esc</span>
                </kbd>
                <span>to close</span>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}