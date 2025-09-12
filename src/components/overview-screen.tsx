import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { StatusBadge } from './status-badge';
import { ReviewDrawer } from './review-drawer';
import { RescheduleModal } from './reschedule-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MRNChip } from './mrn-utils';
import { toast } from 'sonner';
import { appointmentService, AppointmentWithPatient } from '../services/appointmentService';

// Mock data for needs review (will be replaced with API later)
const needsReviewData = [
  {
    id: 1,
    patient: 'Michael Rodriguez',
    mrn: 'MRN-2025-1240',
    reportType: 'Lab Results',
    date: 'Sep 4, 2024',
    risk: 'high' as const,
    aiSummary: 'Elevated glucose and cholesterol levels detected. Lipid panel shows concerning trends requiring follow-up.'
  },
  {
    id: 2,
    patient: 'Sarah Johnson',
    mrn: 'MRN-2025-1241',
    reportType: 'Imaging',
    date: 'Sep 4, 2024',
    risk: 'medium' as const,
    aiSummary: 'Chest X-ray shows minor lung opacity. Recommend additional imaging to rule out infection.'
  },
  {
    id: 3,
    patient: 'David Chen',
    mrn: 'MRN-2025-1242',
    reportType: 'Discharge Summary',
    date: 'Sep 3, 2024',
    risk: 'low' as const,
    aiSummary: 'Post-operative recovery progressing well. Vital signs stable, wound healing appropriately.'
  }
];

export function OverviewScreen() {
  const [selectedReview, setSelectedReview] = useState<typeof needsReviewData[0] | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState<AppointmentWithPatient[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentSummary, setAppointmentSummary] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Load today's appointments
  const loadTodayAppointments = useCallback(async () => {
    try {
      setIsLoadingAppointments(true);
      const appointments = await appointmentService.getTodayAppointments();
      setTodayAppointments(appointments);
      
      // Load summary
      const summary = await appointmentService.getAppointmentSummary();
      setAppointmentSummary(summary);
    } catch (error) {
      console.error('Failed to load today\'s appointments:', error);
      toast.error('Failed to load today\'s appointments');
    } finally {
      setIsLoadingAppointments(false);
    }
  }, []);

  // Load appointments on component mount
  useEffect(() => {
    loadTodayAppointments();
  }, [loadTodayAppointments]);

  const handleReschedule = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: 'confirmed' });
      toast.success('Appointment confirmed');
      loadTodayAppointments(); // Refresh the list
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: 'completed' });
      toast.success('Appointment completed');
      loadTodayAppointments(); // Refresh the list
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      toast.error('Failed to complete appointment');
    }
  };

  return (
    <div className="flex-1 bg-canvas p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-text mb-2">Good morning, Dr. Chen</h1>
          <p className="text-subtext">Here's what needs your attention today</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Needs Review - Full width */}
          <div className="col-span-12">
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-text mb-6">Needs Review</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {needsReviewData.map((item) => (
                  <Popover key={item.id}>
                    <PopoverTrigger asChild>
                      <div 
                        className="bg-canvas rounded-2xl p-4 border border-border cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20"
                        onClick={() => setSelectedReview(item)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-text font-medium">{item.patient}</h3>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                              <MRNChip 
                                mrn={item.mrn} 
                                size="sm" 
                                showCopy={false}
                                onClick={() => {
                                  navigator.clipboard.writeText(item.mrn);
                                  toast.success('MRN copied');
                                }}
                              />
                            </div>
                            <p className="text-subtext text-sm">{item.reportType}</p>
                          </div>
                          <StatusBadge variant={item.risk}>
                            {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-subtext text-sm">{item.date}</span>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReview(item);
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-80 p-3"
                      side="right"
                      align="start"
                    >
                      <div>
                        <h4 className="text-text font-medium mb-2">AI Quick Summary</h4>
                        <p className="text-subtext text-sm leading-relaxed">{item.aiSummary}</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="col-span-12 md:col-span-7">
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-text">Today's Appointments</h2>
                {todayAppointments.length > 5 && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Scroll to see all
                  </span>
                )}
              </div>
              {isLoadingAppointments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-subtext">Loading appointments...</div>
                </div>
              ) : (
                <div className="relative">
                  {/* Scroll indicator for many appointments */}
                  {todayAppointments.length > 5 && (
                    <div className="absolute top-0 right-0 z-10 bg-gradient-to-b from-surface to-transparent h-6 w-full pointer-events-none" />
                  )}
                  
                  <div className="max-h-[400px] overflow-y-auto pr-2 appointments-scroll">
                    <div className="space-y-4">
                    {todayAppointments.length > 0 ? (
                      todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-canvas rounded-2xl border border-border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-subtext text-sm">
                            <Clock className="w-4 h-4" />
                            {appointment.start_time}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="text-text font-medium">{appointment.patient.full_name}</p>
                              <MRNChip 
                                mrn={appointment.patient.mrn} 
                                size="sm" 
                                showCopy={false}
                                onClick={() => {
                                  navigator.clipboard.writeText(appointment.patient.mrn);
                                  toast.success('MRN copied');
                                }}
                              />
                            </div>
                            <p className="text-subtext text-sm capitalize">{appointment.appointment_type.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge variant={appointment.status === 'cancelled' ? 'low' : appointment.status}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </StatusBadge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl">
                              {appointment.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handleConfirmAppointment(appointment.id)}>
                                  Confirm
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleReschedule(appointment)}>
                                Reschedule
                              </DropdownMenuItem>
                              {appointment.status !== 'completed' && (
                                <DropdownMenuItem onClick={() => handleCompleteAppointment(appointment.id)}>
                                  Complete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-subtext mx-auto mb-4" />
                        <h3 className="text-text mb-2">No appointments today</h3>
                        <p className="text-subtext">You have no appointments scheduled for today</p>
                      </div>
                    )}
                    </div>
                  </div>
                  
                  {/* Bottom scroll indicator for many appointments */}
                  {todayAppointments.length > 5 && (
                    <div className="absolute bottom-0 right-0 z-10 bg-gradient-to-t from-surface to-transparent h-6 w-full pointer-events-none" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Last Doctor Note */}
          <div className="col-span-12 md:col-span-5">
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-text">Last Doctor Note</h2>
                <Button size="sm" variant="outline" className="rounded-xl border-border">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="bg-canvas rounded-2xl p-4 border border-border">
                <div className="mb-3">
                  <p className="text-text font-medium">Maria Santos - Follow-up</p>
                  <p className="text-subtext text-sm">Sep 3, 2024 • 2:30 PM</p>
                </div>
                <p className="text-subtext text-sm leading-relaxed">
                  Patient reports significant improvement in chest pain symptoms since starting 
                  new medication regimen. Blood pressure readings have stabilized within normal 
                  range (120/80). Recommended continuing current treatment plan and follow-up 
                  in 4 weeks. Patient educated on lifestyle modifications and dietary changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Drawer */}
      <ReviewDrawer
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        patient={selectedReview || undefined}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment ? {
          patient: selectedAppointment.patient.full_name,
          time: selectedAppointment.start_time,
          type: selectedAppointment.appointment_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        } : undefined}
      />
    </div>
  );
}