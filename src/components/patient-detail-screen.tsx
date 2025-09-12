import React, { useState, useEffect } from 'react';
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
import { patientService, Patient } from '../services/patientService';
import { toast } from 'sonner';

// Patient interface is now imported from patientService

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
  mrn?: string;
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

// Helper function to calculate age from date of birth
const calculateAge = (dob: string | null): number => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper function to format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export function PatientDetailScreen({ patientId, mrn, onBack }: PatientDetailScreenProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  // Doctor ID - in a real app, this would come from auth context
  const doctorId = 'test-doctor-123';

  // Load patient data from API
  useEffect(() => {
    const loadPatient = async () => {
      if (!patientId && !mrn) {
        setError('No patient ID or MRN provided');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        let patientData: Patient;
        if (patientId) {
          // Load by patient ID
          patientData = await patientService.getPatient(doctorId, patientId);
        } else if (mrn) {
          // For now, we'll use the existing getPatient method with MRN
          // In a real implementation, you'd have a getPatientByMRN method
          patientData = await patientService.getPatient(doctorId, mrn);
        } else {
          throw new Error('No valid patient identifier provided');
        }
        
        setPatient(patientData);
      } catch (err: any) {
        console.error('Failed to load patient:', err);
        setError(err.message || 'Failed to load patient');
        toast.error('Failed to load patient');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [patientId, mrn, doctorId]);

  // Populate edit form when patient data is loaded
  useEffect(() => {
    if (patient) {
      setEditPatientData({
        full_name: patient.full_name || '',
        dob: patient.dob || '',
        sex: (patient.sex as 'male' | 'female' | 'other' | 'unknown') || 'unknown',
        phone: patient.phone || '',
        email: patient.email || '',
        tags: patient.tags || [],
        status: (patient.status as 'new' | 'ok' | 'inactive') || 'new'
      });
    }
  }, [patient]);

  // Handle patient update
  const handleUpdatePatient = async () => {
    if (!patient) return;
    
    setIsUpdating(true);
    try {
      const updatedPatient = await patientService.updatePatient(doctorId, patient.id, editPatientData);
      setPatient(updatedPatient);
      setIsEditPatientModalOpen(false);
      toast.success('Patient updated successfully');
    } catch (err: any) {
      console.error('Failed to update patient:', err);
      toast.error('Failed to update patient');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle patient delete
  const handleDeletePatient = async () => {
    if (!patient) return;
    
    setIsDeleting(true);
    try {
      await patientService.deletePatient(doctorId, patient.id);
      toast.success('Patient deleted successfully');
      onBack(); // Navigate back to patients list
    } catch (err: any) {
      console.error('Failed to delete patient:', err);
      toast.error('Failed to delete patient');
    } finally {
      setIsDeleting(false);
    }
  };

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState({
    type: '',
    source: '',
    file: null as File | null
  });
  
  // State for dropdown actions
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editPatientData, setEditPatientData] = useState({
    full_name: '',
    dob: '',
    sex: 'unknown' as 'male' | 'female' | 'other' | 'unknown',
    phone: '',
    email: '',
    tags: [] as string[],
    status: 'new' as 'new' | 'ok' | 'inactive'
  });
  
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    type: '',
    provider: '',
    notes: ''
  });
  
  // Toggle to show/hide historical data (for demo purposes)
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  
  // Mock historical reports (only shown when showHistoricalData is true)
  const mockHistoricalReports = [
    {
      id: 'hist-1',
      type: 'Lab Report',
      date: '2024-08-15',
      source: 'Quest Diagnostics',
      status: 'reviewed' as const,
      title: 'Comprehensive Metabolic Panel'
    },
    {
      id: 'hist-2', 
      type: 'Imaging',
      date: '2024-07-22',
      source: 'Radiology Department',
      status: 'reviewed' as const,
      title: 'Chest X-Ray'
    },
    {
      id: 'hist-3',
      type: 'Blood Work',
      date: '2024-06-10',
      source: 'LabCorp',
      status: 'reviewed' as const,
      title: 'HbA1c Test'
    }
  ];

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
        setIsEditPatientModalOpen(true);
        break;
      case 'schedule':
        setIsScheduleModalOpen(true);
        break;
      case 'history':
        setIsHistoryModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 py-6 h-full flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-subtext">Loading patient details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !patient) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 py-6 h-full flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-subtext mb-4">Error loading patient details</p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button onClick={onBack} variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Patients
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-text mb-1">{patient.full_name}</h1>
                <div className="flex items-center gap-4 text-subtext text-sm mb-3">
                  <span>Age {calculateAge(patient.dob)}</span>
                  <span>•</span>
                  <span className="font-mono">{patient.mrn}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {patient.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className="bg-canvas text-subtext border-border rounded-lg"
                    >
                      {tag}
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
            
            {/* Edit Patient Modal */}
            <Dialog open={isEditPatientModalOpen} onOpenChange={setIsEditPatientModalOpen}>
              <DialogContent className="bg-surface border border-border rounded-3xl shadow-sm max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-text">Edit Patient Information</DialogTitle>
                  <DialogDescription className="text-subtext">
                    Update patient details and contact information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-text mb-2 block">Full Name</Label>
                      <Input
                        value={editPatientData.full_name}
                        onChange={(e) => setEditPatientData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter full name"
                        className="bg-canvas border-border rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-text mb-2 block">Date of Birth</Label>
                      <Input
                        type="date"
                        value={editPatientData.dob}
                        onChange={(e) => setEditPatientData(prev => ({ ...prev, dob: e.target.value }))}
                        className="bg-canvas border-border rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-text mb-2 block">Phone Number</Label>
                      <Input
                        value={editPatientData.phone}
                        onChange={(e) => setEditPatientData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="bg-canvas border-border rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-text mb-2 block">Email Address</Label>
                      <Input
                        type="email"
                        value={editPatientData.email}
                        onChange={(e) => setEditPatientData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="bg-canvas border-border rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-text mb-2 block">Sex</Label>
                      <Select
                        value={editPatientData.sex}
                        onValueChange={(value: 'male' | 'female' | 'other' | 'unknown') => 
                          setEditPatientData(prev => ({ ...prev, sex: value }))
                        }
                      >
                        <SelectTrigger className="bg-canvas border-border rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-surface border border-border rounded-2xl">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-text mb-2 block">Status</Label>
                      <Select
                        value={editPatientData.status}
                        onValueChange={(value: 'new' | 'ok' | 'inactive') => 
                          setEditPatientData(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="bg-canvas border-border rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-surface border border-border rounded-2xl">
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="ok">OK</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Tags</Label>
                    <Input
                      value={editPatientData.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        setEditPatientData(prev => ({ ...prev, tags }));
                      }}
                      placeholder="Enter tags (comma separated)"
                      className="bg-canvas border-border rounded-xl"
                    />
                    <p className="text-xs text-subtext mt-1">Separate multiple tags with commas</p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      onClick={handleUpdatePatient}
                      disabled={isUpdating}
                      className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl flex-1"
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setIsEditPatientModalOpen(false)}
                      disabled={isUpdating}
                      className="border border-border bg-surface hover:bg-accent rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Delete Patient Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
              <DialogContent className="bg-surface border border-border rounded-3xl shadow-sm max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-text">Delete Patient</DialogTitle>
                  <DialogDescription className="text-subtext">
                    Are you sure you want to delete this patient? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3 pt-4">
                  <Button 
                    onClick={handleDeletePatient}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-2xl flex-1"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Patient'}
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="border border-border bg-surface hover:bg-accent rounded-2xl"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Schedule Appointment Modal */}
            <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
              <DialogContent className="bg-surface border border-border rounded-3xl shadow-sm max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-text">Schedule Appointment</DialogTitle>
                  <DialogDescription className="text-subtext">
                    Book a new appointment for {mockPatient.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div>
                    <Label className="text-text mb-2 block">Appointment Date</Label>
                    <Input
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-canvas border-border rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Time</Label>
                    <Select value={scheduleData.time} onValueChange={(value) => setScheduleData(prev => ({ ...prev, time: value }))}>
                      <SelectTrigger className="bg-canvas border-border rounded-xl">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border border-border rounded-2xl">
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="09:30">9:30 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="10:30">10:30 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="11:30">11:30 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="14:30">2:30 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="15:30">3:30 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="16:30">4:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Appointment Type</Label>
                    <Select value={scheduleData.type} onValueChange={(value) => setScheduleData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="bg-canvas border-border rounded-xl">
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border border-border rounded-2xl">
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="checkup">Regular Checkup</SelectItem>
                        <SelectItem value="lab-review">Lab Results Review</SelectItem>
                        <SelectItem value="specialist">Specialist Referral</SelectItem>
                        <SelectItem value="urgent">Urgent Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Healthcare Provider</Label>
                    <Select value={scheduleData.provider} onValueChange={(value) => setScheduleData(prev => ({ ...prev, provider: value }))}>
                      <SelectTrigger className="bg-canvas border-border rounded-xl">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border border-border rounded-2xl">
                        <SelectItem value="dr-smith">Dr. Emily Smith</SelectItem>
                        <SelectItem value="dr-johnson">Dr. Michael Johnson</SelectItem>
                        <SelectItem value="dr-williams">Dr. Sarah Williams</SelectItem>
                        <SelectItem value="dr-brown">Dr. David Brown</SelectItem>
                        <SelectItem value="dr-davis">Dr. Lisa Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-text mb-2 block">Notes (Optional)</Label>
                    <Textarea
                      value={scheduleData.notes}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes or specific concerns..."
                      className="bg-canvas border-border rounded-xl min-h-[80px]"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        console.log('Scheduling appointment:', scheduleData);
                        setIsScheduleModalOpen(false);
                        setScheduleData({ date: '', time: '', type: '', provider: '', notes: '' });
                      }}
                      disabled={!scheduleData.date || !scheduleData.time || !scheduleData.type || !scheduleData.provider}
                      className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl flex-1"
                    >
                      Schedule Appointment
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="border border-border bg-surface hover:bg-accent rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* View History Modal */}
            <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
              <DialogContent className="bg-surface border border-border rounded-3xl shadow-sm max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-text">Patient History - {mockPatient.name}</DialogTitle>
                  <DialogDescription className="text-subtext">
                    Complete medical history and previous records
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-4 overflow-y-auto max-h-[60vh]">
                  <Tabs defaultValue="previous-reports" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-canvas rounded-2xl">
                      <TabsTrigger value="previous-reports" className="rounded-xl">Previous Reports</TabsTrigger>
                      <TabsTrigger value="appointments" className="rounded-xl">Appointment History</TabsTrigger>
                      <TabsTrigger value="medications" className="rounded-xl">Medication History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="previous-reports" className="space-y-4">
                      {!showHistoricalData ? (
                        <div className="text-center py-12 bg-canvas rounded-2xl">
                          <FileText className="w-12 h-12 text-subtext mx-auto mb-4" />
                          <h3 className="text-text mb-2">No Previous Reports Available</h3>
                          <p className="text-subtext text-sm mb-4">
                            This patient doesn't have any previous report records in the system yet.
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <Button 
                              className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl"
                              onClick={() => {
                                setIsHistoryModalOpen(false);
                                setIsAddReportModalOpen(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add First Report
                            </Button>
                            <Button 
                              variant="ghost"
                              className="border border-border bg-surface hover:bg-accent rounded-2xl"
                              onClick={() => setShowHistoricalData(true)}
                            >
                              Show Demo Data
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {mockHistoricalReports.map((report) => (
                            <Card key={report.id} className="bg-canvas border-border rounded-2xl hover:bg-accent/30 transition-colors cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <FileText className="w-4 h-4 text-subtext" />
                                      <h4 className="text-text">{report.title}</h4>
                                    </div>
                                    <p className="text-subtext text-sm mb-2">{report.type} • {report.source}</p>
                                    <div className="flex items-center gap-4 text-xs text-subtext">
                                      <span>{formatDate(report.date)}</span>
                                      <span>•</span>
                                      <span>Reviewed by provider</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={getStatusBadgeColor(report.status)}
                                    >
                                      {report.status === 'reviewed' ? 'Reviewed' : report.status}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="rounded-xl text-subtext hover:text-text"
                                      onClick={() => console.log('Opening historical report:', report.id)}
                                    >
                                      <FileText className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          <div className="flex justify-center pt-4">
                            <Button 
                              variant="ghost"
                              className="text-subtext hover:text-text rounded-xl"
                              onClick={() => setShowHistoricalData(false)}
                            >
                              Hide Demo Data
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="appointments" className="space-y-4">
                      <div className="text-center py-12 bg-canvas rounded-2xl">
                        <Calendar className="w-12 h-12 text-subtext mx-auto mb-4" />
                        <h3 className="text-text mb-2">No Previous Appointments</h3>
                        <p className="text-subtext text-sm">
                          No appointment history found for this patient.
                        </p>
                        <Button 
                          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl mt-4"
                          onClick={() => {
                            setIsHistoryModalOpen(false);
                            setIsScheduleModalOpen(true);
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule First Appointment
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="medications" className="space-y-4">
                      <div className="space-y-3">
                        <Card className="bg-canvas border-border rounded-2xl">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-text mb-1">Metformin 500mg</h4>
                                <p className="text-subtext text-sm mb-2">Twice daily with meals</p>
                                <div className="flex items-center gap-4 text-xs text-subtext">
                                  <span>Started: Jan 15, 2024</span>
                                  <span>•</span>
                                  <span>Prescribed by: Dr. Emily Smith</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 rounded-lg">
                                Active
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-canvas border-border rounded-2xl">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-text mb-1">Lisinopril 10mg</h4>
                                <p className="text-subtext text-sm mb-2">Once daily in the morning</p>
                                <div className="flex items-center gap-4 text-xs text-subtext">
                                  <span>Started: Jan 15, 2024</span>
                                  <span>•</span>
                                  <span>Prescribed by: Dr. Emily Smith</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 rounded-lg">
                                Active
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-canvas border-border rounded-2xl">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-text mb-1">Atorvastatin 20mg</h4>
                                <p className="text-subtext text-sm mb-2">Once daily at bedtime</p>
                                <div className="flex items-center gap-4 text-xs text-subtext">
                                  <span>Started: Oct 22, 2023</span>
                                  <span>•</span>
                                  <span>Discontinued: Dec 10, 2023</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-danger/10 text-danger border-danger/20 rounded-lg">
                                Discontinued
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end pt-6 border-t border-border mt-6">
                    <Button 
                      variant="ghost"
                      onClick={() => setIsHistoryModalOpen(false)}
                      className="border border-border bg-surface hover:bg-accent rounded-2xl"
                    >
                      Close
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
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 hover:text-red-600"
                  onClick={() => handleDropdownAction('delete')}
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Delete Patient
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
        <div className="bg-gradient-to-br from-surface via-canvas to-surface rounded-3xl border border-border/50 shadow-lg shadow-primary/5 flex-1 flex flex-col overflow-hidden backdrop-blur-sm relative">
          {/* Subtle decorative overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/2 to-transparent rounded-3xl pointer-events-none"></div>
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
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