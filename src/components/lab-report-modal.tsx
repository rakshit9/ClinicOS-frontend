import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Download, Printer, X, HelpCircle, Brain } from 'lucide-react';

interface Report {
  id: string;
  type: string;
  date: string;
  source: string;
  status: 'new' | 'reviewed' | 'pending';
}

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

// Mock lab report data - in a real app this would come from your API
const getLabReportData = (reportId: string) => {
  return {
    patientName: 'Sarah Rodriguez',
    mrn: 'MRN-2024-001234',
    reportId: reportId,
    collectionDate: '2024-01-14',
    reportDate: '2024-01-15',
    orderingPhysician: 'Dr. Michael Chen',
    facility: 'Quest Diagnostics',
    location: 'Downtown Lab',
    metabolicPanel: [
      {
        test: 'Glucose (Fasting)',
        result: '95',
        unit: 'mg/dL',
        range: '70-99',
        flag: 'Normal'
      },
      {
        test: 'HbA1c',
        result: '7.1',
        unit: '%',
        range: '<7.0',
        flag: 'Elevated'
      }
    ],
    lipidPanel: [
      {
        test: 'Total Cholesterol',
        result: '185',
        unit: 'mg/dL',
        range: '<200',
        flag: 'Normal'
      },
      {
        test: 'LDL Cholesterol',
        result: '110',
        unit: 'mg/dL',
        range: '<100',
        flag: 'Elevated'
      },
      {
        test: 'HDL Cholesterol',
        result: '55',
        unit: 'mg/dL',
        range: '>50',
        flag: 'Normal'
      },
      {
        test: 'Triglycerides',
        result: '145',
        unit: 'mg/dL',
        range: '<150',
        flag: 'Normal'
      }
    ],
    aiSummary: [
      'HbA1c at 7.1% indicates suboptimal diabetes control - target <7.0%',
      'LDL cholesterol slightly elevated at 110 mg/dL - consider lifestyle modifications',
      'Fasting glucose within normal range suggests good acute glycemic control',
      'Follow-up recommended in 3 months for HbA1c reassessment'
    ]
  };
};

export function LabReportModal({ isOpen, onClose, report }: LabReportModalProps) {
  if (!report) return null;

  const reportData = getLabReportData(report.id);

  const getFlagColor = (flag: string) => {
    switch (flag.toLowerCase()) {
      case 'normal':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'elevated':
      case 'high':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'low':
        return 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20';
      case 'critical':
        return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      default:
        return 'bg-[#F8FAFC] text-[#64748B] border-[#E5E7EB]';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleMarkAsReviewed = () => {
    console.log('Marking report as reviewed:', report.id);
    onClose();
  };

  const handleDownload = () => {
    console.log('Downloading report:', report.id);
  };

  const handlePrint = () => {
    console.log('Printing report:', report.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[800px] max-w-[840px] max-h-[80vh] bg-surface border border-border rounded-2xl p-0 gap-0"
        style={{ 
          '--overlay-color': 'rgba(0, 0, 0, 0.14)' 
        } as React.CSSProperties}
      >
        <DialogTitle className="sr-only">Lab Report</DialogTitle>
        <DialogDescription className="sr-only">
          View detailed lab report results for {reportData.patientName}
        </DialogDescription>
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0 bg-surface rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-text mb-1">Lab Report</h2>
              <div className="flex items-center gap-2 text-subtext">
                <span>{formatDate(report.date)}</span>
                <span>•</span>
                <span>{report.source}</span>
                <span>•</span>
                <Badge 
                  variant="secondary"
                  className={`rounded-full px-2 py-0.5 capitalize ${
                    report.status === 'new' 
                      ? 'bg-danger/10 text-danger border-danger/20' 
                      : report.status === 'pending'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : 'bg-success/10 text-success border-success/20'
                  }`}
                >
                  {report.status === 'new' ? 'New' : report.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-8 h-8 p-0 rounded-lg hover:bg-canvas"
          >
            <X className="w-4 h-4 text-subtext" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-6 space-y-6">
              {/* Top Info Cards */}
              <div className="grid grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#0F172A] mb-4 text-base">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">Name</span>
                      <span className="text-[#0F172A] text-sm">{reportData.patientName}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">MRN</span>
                      <span className="text-[#0F172A] text-sm font-mono">{reportData.mrn}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">Collection Date</span>
                      <span className="text-[#0F172A] text-sm">{formatDate(reportData.collectionDate)}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">Report Date</span>
                      <span className="text-[#0F172A] text-sm">{formatDate(reportData.reportDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Provider Information */}
                <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E5E7EB]">
                  <h3 className="text-[#0F172A] mb-4 text-base">Provider Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">Ordering Physician</span>
                      <span className="text-[#0F172A] text-sm">{reportData.orderingPhysician}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">Laboratory</span>
                      <span className="text-[#0F172A] text-sm">{reportData.facility}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-3">
                      <span className="text-[#64748B] text-sm">Location</span>
                      <span className="text-[#0F172A] text-sm">{reportData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laboratory Results */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-[#0F172A] text-base">Laboratory Results</h3>
                  <HelpCircle className="w-4 h-4 text-[#64748B]" />
                </div>

                <div className="space-y-6">
                  {/* Metabolic Panel */}
                  <div>
                    <h4 className="text-[#64748B] text-sm mb-3">Metabolic Panel</h4>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                      <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC] text-[#64748B] text-sm">
                        <span>Test</span>
                        <span className="text-right">Result</span>
                        <span className="text-right">Unit</span>
                        <span className="text-right">Reference Range</span>
                        <span className="text-center">Flag</span>
                      </div>
                      {reportData.metabolicPanel.map((result, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8FAFC]/50">
                          <span className="text-[#0F172A] text-sm">{result.test}</span>
                          <span className="text-[#0F172A] text-sm font-mono text-right tabular-nums">{result.result}</span>
                          <span className="text-[#64748B] text-sm text-right">{result.unit}</span>
                          <span className="text-[#64748B] text-sm font-mono text-right tabular-nums">{result.range}</span>
                          <div className="flex justify-center">
                            <Badge 
                              variant="secondary"
                              className={`rounded-full px-2 py-0.5 text-xs border ${getFlagColor(result.flag)}`}
                            >
                              {result.flag}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lipid Panel */}
                  <div>
                    <h4 className="text-[#64748B] text-sm mb-3">Lipid Panel</h4>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                      <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC] text-[#64748B] text-sm">
                        <span>Test</span>
                        <span className="text-right">Result</span>
                        <span className="text-right">Unit</span>
                        <span className="text-right">Reference Range</span>
                        <span className="text-center">Flag</span>
                      </div>
                      {reportData.lipidPanel.map((result, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8FAFC]/50">
                          <span className="text-[#0F172A] text-sm">{result.test}</span>
                          <span className="text-[#0F172A] text-sm font-mono text-right tabular-nums">{result.result}</span>
                          <span className="text-[#64748B] text-sm text-right">{result.unit}</span>
                          <span className="text-[#64748B] text-sm font-mono text-right tabular-nums">{result.range}</span>
                          <div className="flex justify-center">
                            <Badge 
                              variant="secondary"
                              className={`rounded-full px-2 py-0.5 text-xs border ${getFlagColor(result.flag)}`}
                            >
                              {result.flag}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-[#B7FF3C]" />
                  <h3 className="text-[#0F172A] text-base">AI Summary</h3>
                </div>
                <ul className="space-y-3">
                  {reportData.aiSummary.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#B7FF3C] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#0F172A] text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                  <span className="text-[#64748B] text-xs">From: Lab Report • {formatDate(report.date)}</span>
                </div>
              </div>

            {/* Interpretation Notes */}
            <div className="text-[#64748B] text-xs">
              <span>Reference ranges may vary by lab and method.</span>
            </div>
          </div>
        </ScrollArea>

        {/* Sticky Footer */}
        <div className="border-t border-border p-5 flex items-center justify-between bg-surface rounded-b-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleDownload}
              className="border border-border bg-surface hover:bg-canvas rounded-2xl text-subtext hover:text-text px-4 py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              onClick={handlePrint}
              className="border border-border bg-surface hover:bg-canvas rounded-2xl text-subtext hover:text-text px-4 py-2"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="border border-border bg-surface hover:bg-canvas rounded-2xl text-subtext hover:text-text px-4 py-2"
            >
              Cancel
            </Button>
            {report.status === 'new' && (
              <Button
                onClick={handleMarkAsReviewed}
                className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl px-4 py-2"
              >
                Mark as Reviewed
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}