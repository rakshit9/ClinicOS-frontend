import React, { useState } from 'react';
import { Calendar, Clock, User, MoreHorizontal, CheckCircle, Clock3, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { RescheduleModal } from './reschedule-modal';

type ViewMode = 'day' | 'week' | 'month';
type AppointmentStatus = 'pending' | 'confirmed' | 'completed';

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  visitType: 'Check-up' | 'Follow-up' | 'Lab Review';
  status: AppointmentStatus;
  duration: number; // in minutes
  notes?: string;
}

interface AppointmentsScreenProps {
  onPatientClick?: (patientId: string) => void;
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    time: '09:00',
    patientName: 'Sarah Rodriguez',
    patientId: 'patient-1',
    visitType: 'Check-up',
    status: 'confirmed',
    duration: 30,
    notes: 'Regular check-up'
  },
  {
    id: '2',
    time: '09:30',
    patientName: 'Michael Chen',
    patientId: 'patient-2',
    visitType: 'Follow-up',
    status: 'pending',
    duration: 45,
    notes: 'Post-surgery follow-up'
  },
  {
    id: '3',
    time: '10:30',
    patientName: 'Emily Johnson',
    patientId: 'patient-3',
    visitType: 'Lab Review',
    status: 'confirmed',
    duration: 30,
    notes: 'Blood work results discussion'
  },
  {
    id: '4',
    time: '11:00',
    patientName: 'David Wilson',
    patientId: 'patient-4',
    visitType: 'Check-up',
    status: 'completed',
    duration: 30,
    notes: 'Annual physical exam'
  },
  {
    id: '5',
    time: '14:00',
    patientName: 'Lisa Brown',
    patientId: 'patient-5',
    visitType: 'Follow-up',
    status: 'pending',
    duration: 30,
    notes: 'Medication adjustment'
  },
  {
    id: '6',
    time: '14:30',
    patientName: 'Robert Davis',
    patientId: 'patient-6',
    visitType: 'Lab Review',
    status: 'confirmed',
    duration: 45,
    notes: 'Lab results and treatment plan'
  },
  {
    id: '7',
    time: '15:30',
    patientName: 'Amanda Thompson',
    patientId: 'patient-7',
    visitType: 'Check-up',
    status: 'pending',
    duration: 30,
    notes: 'Routine wellness visit'
  }
];

export function AppointmentsScreen({ onPatientClick }: AppointmentsScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    appointment?: Appointment;
  }>({ isOpen: false });

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-canvas text-subtext border-border';
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-3 h-3" />;
      case 'confirmed':
        return <CheckCircle className="w-3 h-3" />;
      case 'completed':
        return <Clock3 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType) {
      case 'Check-up':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Follow-up':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Lab Review':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-canvas text-subtext border-border';
    }
  };

  const handleConfirm = (appointmentId: string) => {
    console.log('Confirming appointment:', appointmentId);
    // In a real app, this would update the appointment status via API
  };

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleModal({ isOpen: true, appointment });
  };

  const handleComplete = (appointmentId: string) => {
    console.log('Completing appointment:', appointmentId);
    // In a real app, this would update the appointment status via API
  };

  const handleOpenPatient = (patientId: string, openNotes = false) => {
    console.log('Opening patient:', patientId, openNotes ? 'with notes tab' : '');
    if (onPatientClick) {
      onPatientClick(patientId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="flex-1 p-8 bg-canvas">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-text text-2xl mb-2">Appointments</h1>
          <p className="text-subtext">Manage your scheduled patient visits</p>
        </div>

        {/* Top Controls */}
        <div className="flex items-center justify-between mb-8">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-2xl p-1">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-subtext hover:text-text hover:bg-accent'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Date Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={goToToday}
              className="border-border bg-surface hover:bg-accent rounded-2xl text-subtext hover:text-text"
            >
              Today
            </Button>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-surface border-border rounded-2xl w-auto"
            />
          </div>
        </div>

        {/* Date Display */}
        <div className="mb-6">
          <h2 className="text-text text-xl">{formatDate(selectedDate)}</h2>
          <p className="text-subtext">{mockAppointments.length} appointments scheduled</p>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
            <Card key={appointment.id} className="bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left Section - Time & Patient Info */}
                  <div className="flex items-center gap-6">
                    {/* Time */}
                    <div className="flex items-center gap-2 min-w-20">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-text font-medium">{appointment.time}</span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-text font-medium">{appointment.patientName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="secondary"
                            className={`rounded-full px-2 py-1 text-xs ${getVisitTypeColor(appointment.visitType)}`}
                          >
                            {appointment.visitType}
                          </Badge>
                          <span className="text-subtext text-sm">•</span>
                          <span className="text-subtext text-sm">{appointment.duration}min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex items-center gap-4">
                    {/* Status */}
                    <Badge 
                      variant="secondary"
                      className={`rounded-full px-3 py-1 text-xs capitalize flex items-center gap-1 ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </Badge>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirm(appointment.id)}
                          className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-3 py-1 text-xs"
                        >
                          Confirm
                        </Button>
                      )}
                      
                      {appointment.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleComplete(appointment.id)}
                          className="border-border bg-surface hover:bg-accent rounded-xl text-subtext hover:text-text px-3 py-1 text-xs"
                        >
                          Complete
                        </Button>
                      )}

                      {/* More Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0 rounded-xl hover:bg-accent"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-surface border border-border rounded-xl shadow-lg w-48">
                          <DropdownMenuItem 
                            onClick={() => handleReschedule(appointment)}
                            className="hover:bg-accent rounded-lg cursor-pointer"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleOpenPatient(appointment.patientId)}
                            className="hover:bg-accent rounded-lg cursor-pointer"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Open Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleOpenPatient(appointment.patientId, true)}
                            className="hover:bg-accent rounded-lg cursor-pointer"
                          >
                            <Clock3 className="w-4 h-4 mr-2" />
                            Open Notes Tab
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-subtext text-sm">{appointment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-subtext mx-auto mb-4" />
            <h3 className="text-text mb-2">No appointments scheduled</h3>
            <p className="text-subtext">No appointments found for {formatDate(selectedDate)}</p>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ isOpen: false })}
        appointment={rescheduleModal.appointment ? {
          patient: rescheduleModal.appointment.patientName,
          time: rescheduleModal.appointment.time,
          type: rescheduleModal.appointment.visitType
        } : undefined}
      />
    </div>
  );
}