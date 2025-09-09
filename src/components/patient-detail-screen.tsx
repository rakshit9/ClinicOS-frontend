import React, { useState } from 'react';
import { ArrowLeft, Plus, MoreHorizontal, Calendar, FileText, Clock, CheckCircle, Edit3, Upload, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LabReportModal } from './lab-report-modal';

interface Patient {
  id: string;
  name: string;
  age: number;
  mrn: string;
  conditions: string[];
  avatar?: string;
}

interface Report {
  id: string;
  type: string;
  date: string;
  source: string;
  status: 'new' | 'reviewed' | 'pending';
}

interface Appointment {
  id: string;
  time: string;
  date: string;
  visitType: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface PatientDetailScreenProps {
  patientId?: string;
  onBack: () => void;
}

const mockPatient: Patient = {
  id: '1',
  name: 'Sarah Rodriguez',
  age: 34,
  mrn: 'MRN-2024-001234',
  conditions: ['Diabetes Type 2', 'Hypertension', 'Pre-diabetes']
};

const mockReports: Report[] = [
  { id: '1', type: 'Lab Report', date: '2024-01-15', source: 'Quest Diagnostics', status: 'new' },
  { id: '2', type: 'Imaging', date: '2024-01-10', source: 'Radiology Dept', status: 'reviewed' },
  { id: '3', type: 'Blood Work', date: '2024-01-05', source: 'Lab Corp', status: 'reviewed' },
  { id: '4', type: 'ECG', date: '2023-12-28', source: 'Cardiology', status: 'pending' }
];

const mockAppointments: Appointment[] = [
  { id: '1', time: '10:00 AM', date: '2024-01-20', visitType: 'Follow-up', status: 'scheduled' },
  { id: '2', time: '2:30 PM', date: '2024-01-18', visitType: 'Lab Review', status: 'confirmed' },
  { id: '3', time: '9:15 AM', date: '2024-01-15', visitType: 'Routine Check', status: 'completed' },
  { id: '4', time: '3:45 PM', date: '2024-01-10', visitType: 'Consultation', status: 'completed' }
];

const aiSummaryData = {
  hasData: true,
  bullets: [
    'Recent lab work shows improved HbA1c levels from 8.2% to 7.1% over the past 3 months',
    'Blood pressure readings consistently within target range (avg 128/82 mmHg)',
    'Patient reports better medication adherence since last visit',
    'Mild peripheral neuropathy symptoms noted, recommend referral to podiatrist',
    'Weight loss of 12 lbs achieved through dietary modifications'
  ],
  source: 'Lab Report',
  date: '26 Aug 2024',
  reportId: '1'
};

export function PatientDetailScreen({ patientId, onBack }: PatientDetailScreenProps) {
  const [activeTab, setActiveTab] = useState('reports');
  const [doctorNote, setDoctorNote] = useState(`Patient continues to show excellent progress with diabetes management. Current medication regimen appears effective with metformin 500mg twice daily and lisinopril 10mg daily.

Recent improvements:
- HbA1c decreased from 8.2% to 7.1%
- Blood pressure well controlled
- Patient reports increased energy levels

Recommendations:
- Continue current medication regimen
- Schedule podiatry consultation for neuropathy evaluation
- Follow-up labs in 3 months`);
  
  const [originalNote, setOriginalNote] = useState(doctorNote);
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isLabReportModalOpen, setIsLabReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState({
    type: '',
    source: '',
    file: null as File | null
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'reviewed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'scheduled':
        return 'bg-canvas text-subtext border-border';
      case 'confirmed':
        return 'bg-primary/10 text-text border-primary/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-canvas text-subtext border-border';
    }
  };

  const handleSaveNote = () => {
    setOriginalNote(doctorNote);
    // Here you would save to backend
    console.log('Saving note:', doctorNote);
  };

  const handleRevertNote = () => {
    setDoctorNote(originalNote);
  };

  const handleOpenReport = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsLabReportModalOpen(true);
    }
  };

  const handleAppointmentAction = (action: string, appointmentId: string) => {
    console.log(`${action} appointment:`, appointmentId);
  };

  const handleAddReport = () => {
    setIsAddReportModalOpen(true);
  };

  const handleSubmitReport = () => {
    console.log('Submitting new report:', newReport);
    setIsAddReportModalOpen(false);
    setNewReport({ type: '', source: '', file: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewReport(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleDropdownAction = (action: string) => {
    switch (action) {
      case 'edit':
        console.log('Edit patient clicked');
        break;
      case 'schedule':
        console.log('Schedule appointment clicked');
        break;
      case 'history':
        console.log('View history clicked');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="rounded-xl text-subtext hover:text-text p-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-text text-lg">
                  {getInitials(mockPatient.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-text mb-1">{mockPatient.name}</h1>
                <div className="flex items-center gap-4 text-subtext text-sm mb-3">
                  <span>Age {mockPatient.age}</span>
                  <span>•</span>
                  <span>{mockPatient.mrn}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {mockPatient.conditions.map((condition) => (
                    <Badge 
                      key={condition}
                      variant="secondary"
                      className="bg-canvas text-subtext border-border rounded-lg"
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog open={isAddReportModalOpen} onOpenChange={setIsAddReportModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleAddReport}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Report
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-surface border border-border rounded-3xl shadow-sm max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-text">Add New Report</DialogTitle>
                  <DialogDescription className="text-subtext">
                    Upload a new medical report for this patient
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div>
                    <Label className="text-text mb-2 block">Report Type</Label>
                    <Select value={newReport.type} onValueChange={(value) => setNewReport(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="bg-canvas border-border rounded-xl">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border border-border rounded-2xl">
                        <SelectItem value="lab">Lab Report</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="blood">Blood Work</SelectItem>
                        <SelectItem value="ecg">ECG</SelectItem>
                        <SelectItem value="pathology">Pathology</SelectItem>
                        <SelectItem value="consultation">Consultation Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Source</Label>
                    <Input
                      value={newReport.source}
                      onChange={(e) => setNewReport(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g., Quest Diagnostics, Radiology Dept"
                      className="bg-canvas border-border rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Upload File</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-canvas">
                      <Upload className="w-8 h-8 text-subtext mx-auto mb-2" />
                      <p className="text-subtext text-sm mb-2">Drop files here or click to browse</p>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover hover:bg-primary/5 rounded-xl" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                      {newReport.file && (
                        <p className="text-text text-sm mt-2">{newReport.file.name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      onClick={handleSubmitReport}
                      disabled={!newReport.type || !newReport.source}
                      className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl flex-1"
                    >
                      Add Report
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setIsAddReportModalOpen(false)}
                      className="border border-border bg-surface hover:bg-accent rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="border border-border bg-surface hover:bg-accent rounded-2xl p-2"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface border border-border rounded-2xl shadow-sm">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleDropdownAction('edit')}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Patient
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleDropdownAction('schedule')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => handleDropdownAction('history')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* AI Summary Card - Pinned above tabs */}
        <Card className="mb-6 bg-surface border-border rounded-3xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-text">Latest AI Summary</CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-lg text-xs">
                  Auto-generated
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {aiSummaryData.hasData ? (
              <div>
                <ul className="space-y-2 mb-4">
                  {aiSummaryData.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3 text-text">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-subtext text-sm">
                    <span>From: {aiSummaryData.source}</span>
                    <span>•</span>
                    <span>{aiSummaryData.date}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOpenReport(aiSummaryData.reportId)}
                    className="text-primary hover:text-primary-hover hover:bg-primary/5 rounded-xl"
                  >
                    View report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <p className="text-subtext mb-4">No AI summary available yet</p>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl">
                  Run AI Summary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="bg-surface rounded-3xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-surface border-b border-border rounded-none p-0 h-auto">
              <TabsTrigger 
                value="reports" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-text text-subtext hover:text-text hover:bg-canvas/50 py-4 px-6 transition-all duration-200 font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger 
                value="notes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-text text-subtext hover:text-text hover:bg-canvas/50 py-4 px-6 transition-all duration-200 font-medium"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger 
                value="appointments"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-text text-subtext hover:text-text hover:bg-canvas/50 py-4 px-6 transition-all duration-200 font-medium"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
              </TabsTrigger>
            </TabsList>

            {/* Reports Tab */}
            <TabsContent value="reports" className="flex-1 overflow-hidden mt-0">
              <div className="h-full flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-canvas text-subtext text-sm">
                  <div className="col-span-3">Type</div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-3">Source</div>
                  <div className="col-span-3">Status</div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto">
                  {mockReports.map((report, index) => (
                    <div
                      key={report.id}
                      onClick={() => handleOpenReport(report.id)}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer hover:bg-canvas hover:shadow-sm transition-all duration-200 ${
                        index !== mockReports.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <div className="col-span-3 flex items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-text">{report.type}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex items-center">
                        <span className="text-text">{formatDate(report.date)}</span>
                      </div>
                      
                      <div className="col-span-3 flex items-center">
                        <span className="text-text">{report.source}</span>
                      </div>
                      
                      <div className="col-span-3 flex items-center">
                        <Badge 
                          variant="secondary"
                          className={`rounded-lg text-xs px-3 py-1 capitalize ${getStatusBadgeColor(report.status)}`}
                        >
                          {report.status === 'new' ? 'New' : report.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 overflow-hidden mt-0">
              <div className="h-full flex flex-col p-6">
                <div className="mb-4">
                  <Label className="text-text mb-2 block">Last Doctor Note</Label>
                  <p className="text-subtext text-sm mb-4">Saving overwrites the previous note.</p>
                </div>
                
                <Textarea
                  value={doctorNote}
                  onChange={(e) => setDoctorNote(e.target.value)}
                  className="flex-1 bg-canvas border-border rounded-2xl resize-none min-h-[400px] p-4"
                  placeholder="Enter your notes here..."
                />
                
                <div className="flex items-center gap-3 mt-6">
                  <Button 
                    onClick={handleSaveNote}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl"
                    disabled={doctorNote === originalNote}
                  >
                    Save Note
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleRevertNote}
                    className="border border-border bg-surface hover:bg-accent rounded-2xl"
                    disabled={doctorNote === originalNote}
                  >
                    Revert
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="flex-1 overflow-hidden mt-0">
              <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-4">
                  {mockAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-canvas rounded-2xl border border-border hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-text font-medium">{appointment.visitType}</span>
                            <Badge 
                              variant="secondary"
                              className={`rounded-lg text-xs px-2 py-1 capitalize ${getStatusBadgeColor(appointment.status)}`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-subtext text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAppointmentAction('confirm', appointment.id)}
                              className="text-success hover:text-success hover:bg-success/5 rounded-xl"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAppointmentAction('reschedule', appointment.id)}
                              className="text-primary hover:text-primary-hover hover:bg-primary/5 rounded-xl"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Reschedule
                            </Button>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAppointmentAction('complete', appointment.id)}
                            className="text-primary hover:text-primary-hover hover:bg-primary/5 rounded-xl"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Lab Report Modal */}
        <LabReportModal
          isOpen={isLabReportModalOpen}
          onClose={() => setIsLabReportModalOpen(false)}
          report={selectedReport}
        />
      </div>
    </div>
  );
}