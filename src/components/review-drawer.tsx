import React from 'react';
import { X, FileText, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { StatusBadge } from './status-badge';

interface ReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    patient: string;
    reportType: string;
    date: string;
    risk: 'low' | 'medium' | 'high';
  };
}

const mockLabResults = [
  { name: 'Glucose', value: '145', unit: 'mg/dL', refLow: '70', refHigh: '100', outOfRange: true },
  { name: 'Cholesterol', value: '220', unit: 'mg/dL', refLow: '0', refHigh: '200', outOfRange: true },
  { name: 'HDL', value: '45', unit: 'mg/dL', refLow: '40', refHigh: '60', outOfRange: false },
  { name: 'LDL', value: '150', unit: 'mg/dL', refLow: '0', refHigh: '100', outOfRange: true },
  { name: 'Triglycerides', value: '180', unit: 'mg/dL', refLow: '0', refHigh: '150', outOfRange: true },
];

export function ReviewDrawer({ isOpen, onClose, patient }: ReviewDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-scrim" onClick={onClose} />
      
      {/* Drawer */}
      <div className="ml-auto w-[460px] bg-white h-full shadow-lg border border-border rounded-l-3xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-text">{patient?.reportType || 'Report Review'}</h2>
              {patient && (
                <StatusBadge variant={patient.risk}>
                  {patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)}
                </StatusBadge>
              )}
            </div>
            {patient && (
              <div className="text-subtext text-sm">
                <p className="font-medium text-text">{patient.patient}</p>
                <p>{patient.date}</p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent transition-colors ml-4"
          >
            <X className="w-5 h-5 text-subtext" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* PDF Preview Placeholder */}
          <div className="p-6 border-b border-border">
            <div className="bg-canvas rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 bg-border rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-subtext" />
                </div>
                <div className="flex-1">
                  <p className="text-text font-medium">{patient?.reportType || 'Lab Report'}_Rodriguez.pdf</p>
                  <button className="text-primary hover:text-primary-hover text-sm flex items-center gap-1 mt-1">
                    <ExternalLink className="w-3 h-3" />
                    View full report
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Summary */}
          <div className="p-6 border-b border-border">
            <div className="bg-surface rounded-2xl p-4 border border-border">
              <h3 className="text-text mb-4">AI Summary</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-subtext text-sm">Patient shows elevated glucose levels (145 mg/dL) indicating potential pre-diabetic condition</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-subtext text-sm">Cholesterol panel reveals elevated total cholesterol (220 mg/dL) and LDL (150 mg/dL)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-subtext text-sm">Triglycerides above normal range (180 mg/dL), HDL levels within acceptable range</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="text-subtext text-sm">Recommend dietary consultation and follow-up testing in 3 months</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Extracted Values Table */}
          <div className="p-6">
            <h3 className="text-text mb-4">Extracted Values</h3>
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-3 bg-canvas text-xs text-subtext font-medium border-b border-border">
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Value</div>
                <div className="col-span-1">Unit</div>
                <div className="col-span-2">Ref Low</div>
                <div className="col-span-2">Ref High</div>
                <div className="col-span-2">Status</div>
              </div>
              {mockLabResults.map((result, index) => (
                <div key={result.name} className={`grid grid-cols-12 gap-4 p-3 text-sm ${index !== mockLabResults.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="col-span-3 text-text font-medium">{result.name}</div>
                  <div className={`col-span-2 font-medium ${result.outOfRange ? 'text-danger' : 'text-text'}`}>
                    {result.value}
                  </div>
                  <div className="col-span-1 text-subtext">{result.unit}</div>
                  <div className="col-span-2 text-subtext">{result.refLow}</div>
                  <div className="col-span-2 text-subtext">{result.refHigh}</div>
                  <div className="col-span-2">
                    {result.outOfRange ? (
                      <StatusBadge variant="high">Out of Range</StatusBadge>
                    ) : (
                      <StatusBadge variant="low">Normal</StatusBadge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <Button 
            className="flex-1 bg-primary hover:bg-primary-hover text-text rounded-2xl"
          >
            Mark as Reviewed
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-border rounded-2xl"
          >
            Open Patient
          </Button>
        </div>
      </div>
    </div>
  );
}