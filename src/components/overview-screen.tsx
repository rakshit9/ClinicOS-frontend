import React, { useState } from 'react';
import { Calendar, Clock, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { StatusBadge } from './status-badge';
import { ReviewDrawer } from './review-drawer';
import { RescheduleModal } from './reschedule-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MRNChip } from './mrn-utils';
import { toast } from 'sonner@2.0.3';

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

const todayAppointments = [
  {
    id: 1,
    time: '9:00 AM',
    patient: 'Emily Watson',
    mrn: 'MRN-2025-1243',
    type: 'Follow-up',
    status: 'pending' as const
  },
  {
    id: 2,
    time: '10:30 AM',
    patient: 'James Miller',
    mrn: 'MRN-2025-1244',
    type: 'Consultation',
    status: 'confirmed' as const
  },
  {
    id: 3,
    time: '2:00 PM',
    patient: 'Lisa Anderson',
    mrn: 'MRN-2025-1245',
    type: 'Check-up',
    status: 'completed' as const
  },
  {
    id: 4,
    time: '3:30 PM',
    patient: 'Robert Taylor',
    mrn: 'MRN-2025-1246',
    type: 'Follow-up',
    status: 'pending' as const
  }
];

export function OverviewScreen() {
  const [selectedReview, setSelectedReview] = useState<typeof needsReviewData[0] | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof todayAppointments[0] | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const handleReschedule = (appointment: typeof todayAppointments[0]) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
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
              <h2 className="text-text mb-6">Today's Appointments</h2>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-canvas rounded-2xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-subtext text-sm">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-text font-medium">{appointment.patient}</p>
                          <MRNChip 
                            mrn={appointment.mrn} 
                            size="sm" 
                            showCopy={false}
                            onClick={() => {
                              navigator.clipboard.writeText(appointment.mrn);
                              toast.success('MRN copied');
                            }}
                          />
                        </div>
                        <p className="text-subtext text-sm">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge variant={appointment.status}>
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
                            <DropdownMenuItem>Confirm</DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleReschedule(appointment)}>
                            Reschedule
                          </DropdownMenuItem>
                          {appointment.status !== 'completed' && (
                            <DropdownMenuItem>Complete</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
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
        appointment={selectedAppointment || undefined}
      />
    </div>
  );
}