import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AppointmentRow } from './appointment-row';
import { RescheduleModal } from './reschedule-modal';
import { appointmentService, AppointmentWithPatient, AppointmentSummary } from '../services/appointmentService';
import { toast } from 'sonner';

type ViewMode = 'day' | 'week' | 'month';

interface AppointmentsScreenProps {
  onPatientClick?: (patientId: string) => void;
}

export function AppointmentsScreen({ onPatientClick }: AppointmentsScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [appointmentSummary, setAppointmentSummary] = useState<AppointmentSummary>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    appointment?: AppointmentWithPatient;
  }>({ isOpen: false });

  // Refs for intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load appointments from API (initial load or refresh)
  const loadAppointments = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setIsLoading(true);
        setCurrentPage(1);
        setAppointments([]);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      
      const response = await appointmentService.getAppointments({
        view: viewMode,
        date: selectedDate,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sort: 'start_time',
        order: 'asc',
        page: reset ? 1 : currentPage + 1,
        per_page: 10
      });
      
      if (reset) {
        setAppointments(response.appointments);
      } else {
        setAppointments(prev => [...prev, ...response.appointments]);
      }
      
      setAppointmentSummary(response.summary);
      setCurrentPage(response.meta.page);
      setTotalPages(response.meta.total_pages);
      setHasMorePages(response.meta.page < response.meta.total_pages);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setError('Failed to load appointments. Please try again.');
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [viewMode, selectedDate, statusFilter, currentPage]);

  // Load more appointments (pagination)
  const loadMoreAppointments = useCallback(async () => {
    if (!isLoadingMore && hasMorePages) {
      await loadAppointments(false);
    }
  }, [loadAppointments, isLoadingMore, hasMorePages]);

  // Load appointments when component mounts or filters change
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMorePages && !isLoadingMore) {
          loadMoreAppointments();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreAppointments, hasMorePages, isLoadingMore]);

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

  const handleConfirm = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: 'confirmed' });
      toast.success('Appointment confirmed');
      loadAppointments(true); // Refresh the entire list
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const handleComplete = async (appointmentId: string) => {
    try {
      await appointmentService.updateAppointment(appointmentId, { status: 'completed' });
      toast.success('Appointment completed');
      loadAppointments(true); // Refresh the entire list
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      toast.error('Failed to complete appointment');
    }
  };

  const handleReschedule = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setRescheduleModal({ isOpen: true, appointment });
    }
  };

  const handlePatientClick = (patientId: string) => {
    console.log('Opening patient:', patientId);
    if (onPatientClick) {
      onPatientClick(patientId);
    }
  };

  const handleNotesClick = (patientId: string) => {
    console.log('Opening patient notes:', patientId);
    if (onPatientClick) {
      onPatientClick(patientId);
    }
  };

  // Helper function to map API data to component props
  const mapAppointmentToRow = (appointment: AppointmentWithPatient) => ({
    id: appointment.id,
    time: appointment.start_time,
    patientName: appointment.patient.full_name,
    patientId: appointment.patient_id,
    mrn: appointment.patient.mrn,
    visitType: appointment.appointment_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) as 'Check-up' | 'Follow-up' | 'Lab Review' | 'Consultation' | 'Procedure',
    status: appointment.status as 'pending' | 'confirmed' | 'completed' | 'canceled' | 'no_show',
    duration: appointment.duration_minutes,
    notes: appointment.notes,
    isTelehealth: false, // This would need to be added to the API schema
    hasAttachment: false, // This would need to be added to the API schema
    isPriority: false // This would need to be added to the API schema
  });

  return (
    <div className="flex-1 bg-canvas flex flex-col h-screen">
      {/* Container with max-width and gutters */}
      <div className="max-w-[1200px] mx-auto w-full px-8 flex flex-col h-full">
        
        {/* Sticky Header Block */}
        <div className="sticky top-0 bg-canvas z-30 border-b border-border">
          <div className="py-8">
            {/* Main Header */}
            <div className="mb-6">
              <h1 className="text-text mb-2 text-2xl font-semibold">Appointments</h1>
              <p className="text-subtext">Manage your scheduled patient visits</p>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left - View Mode Toggle */}
              <div className="flex items-center gap-1 bg-surface border border-border rounded-2xl p-1">
                {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      viewMode === mode
                        ? 'bg-primary text-primary-foreground'
                        : 'text-subtext hover:text-text hover:bg-accent'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Right - Date Controls & Filters */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={goToToday}
                  className="border-border bg-surface hover:bg-accent rounded-2xl text-subtext hover:text-text focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Today
                </Button>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-surface border-border rounded-2xl w-auto focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 bg-surface border-border rounded-2xl focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <SelectValue placeholder="All" />
                    <ChevronDown className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border rounded-xl">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* DayHeader - Solid Background */}
        <div className="sticky top-[180px] bg-canvas z-20 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-text text-xl font-semibold">{formatDate(selectedDate)}</h2>
              <p className="text-subtext text-sm mt-1">
                {appointmentSummary.total} appointments scheduled
                {appointments.length > 0 && (
                  <span className="ml-2 text-xs">
                    (Showing {appointments.length} of {appointmentSummary.total})
                  </span>
                )}
              </p>
            </div>
            {appointments.length > 0 && (
              <div className="text-right">
                <p className="text-subtext text-xs">
                  Page {currentPage} of {totalPages}
                </p>
                {isLoadingMore && (
                  <div className="flex items-center mt-1">
                    <Loader2 className="w-3 h-3 animate-spin text-primary mr-1" />
                    <span className="text-subtext text-xs">Loading...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ListScroller - Main Scroll Area */}
        <div className="flex-1 min-h-0 relative">
          {/* Top Scroll Shadow */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-canvas to-transparent pointer-events-none z-20" />
          
          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto screens-scroll px-6 pt-0">
            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-subtext">Loading appointments...</div>
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-text font-medium mb-2">Error loading appointments</h3>
                <p className="text-subtext mb-4">{error}</p>
                <Button 
                  onClick={loadAppointments}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Try Again
                </Button>
              </div>
            ) : appointments.length > 0 ? (
              /* Appointments List */
              <div className="space-y-0">
                {appointments.map((appointment, index) => {
                  const appointmentData = mapAppointmentToRow(appointment);
                  return (
                    <AppointmentRow
                      key={appointment.id}
                      id={appointmentData.id}
                      time={appointmentData.time}
                      patientName={appointmentData.patientName}
                      patientId={appointmentData.patientId}
                      mrn={appointmentData.mrn}
                      visitType={appointmentData.visitType}
                      status={appointmentData.status}
                      duration={appointmentData.duration}
                      notes={appointmentData.notes}
                      isTelehealth={appointmentData.isTelehealth}
                      hasAttachment={appointmentData.hasAttachment}
                      isPriority={appointmentData.isPriority}
                      isLast={index === appointments.length - 1}
                      onConfirm={handleConfirm}
                      onComplete={handleComplete}
                      onReschedule={handleReschedule}
                      onPatientClick={handlePatientClick}
                      onNotesClick={handleNotesClick}
                    />
                  );
                })}
                
                {/* Lazy Loading Trigger */}
                {hasMorePages && (
                  <div ref={loadMoreRef} className="py-4">
                    {isLoadingMore ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                        <span className="text-subtext">Loading more appointments...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <Button
                          variant="outline"
                          onClick={loadMoreAppointments}
                          className="border-border bg-surface hover:bg-accent rounded-2xl text-subtext hover:text-text"
                        >
                          Load More Appointments
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* End of Results */}
                {!hasMorePages && appointments.length > 0 && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-subtext text-sm">All appointments loaded</p>
                      <p className="text-subtext text-xs mt-1">
                        Showing {appointments.length} of {appointmentSummary.total} appointments
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-text font-medium mb-2">No appointments scheduled</h3>
                <p className="text-subtext mb-4">No appointments found for {formatDate(selectedDate)}</p>
                <Button 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-2xl focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Create appointment
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Scroll Shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-canvas to-transparent pointer-events-none z-20" />
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ isOpen: false })}
        appointment={rescheduleModal.appointment ? {
          patient: rescheduleModal.appointment.patient.full_name,
          time: rescheduleModal.appointment.start_time,
          type: rescheduleModal.appointment.appointment_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        } : undefined}
      />
    </div>
  );
}