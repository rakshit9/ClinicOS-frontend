import React from 'react';
import { Clock, User, MoreHorizontal, CheckCircle, Clock3, AlertCircle, Video, Paperclip, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MRNDisplay } from './mrn-utils';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
type VisitType = 'Check-up' | 'Follow-up' | 'Lab Review' | 'Consultation' | 'Procedure';

interface AppointmentRowProps {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  mrn: string;
  visitType: VisitType;
  status: AppointmentStatus;
  duration: number;
  notes?: string;
  isTelehealth?: boolean;
  hasAttachment?: boolean;
  isPriority?: boolean;
  isLast?: boolean;
  onConfirm: (id: string) => void;
  onComplete: (id: string) => void;
  onReschedule: (id: string) => void;
  onPatientClick: (patientId: string) => void;
  onNotesClick: (patientId: string) => void;
}

export function AppointmentRow({
  id,
  time,
  patientName,
  patientId,
  mrn,
  visitType,
  status,
  duration,
  notes,
  isTelehealth = false,
  hasAttachment = false,
  isPriority = false,
  isLast = false,
  onConfirm,
  onComplete,
  onReschedule,
  onPatientClick,
  onNotesClick
}: AppointmentRowProps) {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'canceled':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'no_show':
        return 'bg-gray-50 text-gray-600 border-gray-200';
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
      case 'canceled':
        return <AlertCircle className="w-3 h-3" />;
      case 'no_show':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getVisitTypeColor = (visitType: VisitType) => {
    switch (visitType) {
      case 'Check-up':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Follow-up':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Lab Review':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Consultation':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Procedure':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      default:
        return 'bg-canvas text-subtext border-border';
    }
  };

  return (
    <div className={`group relative bg-surface border-b border-border hover:bg-accent/50 transition-colors ${isLast ? 'border-b-0' : ''}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Time & Patient Info */}
          <div className="flex items-center gap-6">
            {/* Time */}
            <div className="flex items-center gap-2 min-w-20">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-text font-medium">{time}</span>
            </div>

            {/* Patient Info */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-text font-medium">{patientName}</h3>
                  {isPriority && (
                    <Star className="w-4 h-4 text-warning fill-warning" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="secondary"
                    className={`rounded-full px-2 py-1 text-xs ${getVisitTypeColor(visitType)}`}
                  >
                    {visitType}
                  </Badge>
                  <span className="text-subtext text-sm">•</span>
                  <span className="text-subtext text-sm">{duration}min</span>
                  {isTelehealth && (
                    <>
                      <span className="text-subtext text-sm">•</span>
                      <div className="flex items-center gap-1">
                        <Video className="w-3 h-3 text-primary" />
                        <span className="text-subtext text-sm">Telehealth</span>
                      </div>
                    </>
                  )}
                  {hasAttachment && (
                    <>
                      <span className="text-subtext text-sm">•</span>
                      <div className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3 text-subtext" />
                        <span className="text-subtext text-sm">Attachments</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-1">
                  <MRNDisplay mrn={mrn} variant="badge" size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Status & Actions */}
          <div className="flex items-center gap-4">
            {/* Status */}
            <Badge 
              variant="secondary"
              className={`rounded-full px-3 py-1 text-xs capitalize flex items-center gap-1 ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              {status.replace('_', ' ')}
            </Badge>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => onConfirm(id)}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-3 py-1 text-xs"
                >
                  Confirm
                </Button>
              )}
              
              {status !== 'completed' && status !== 'canceled' && status !== 'no_show' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onComplete(id)}
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
                    className="w-8 h-8 p-0 rounded-xl hover:bg-accent text-subtext hover:text-text transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-surface border border-border rounded-xl shadow-lg w-48 z-50">
                  <DropdownMenuItem 
                    onClick={() => onReschedule(id)}
                    className="hover:bg-accent rounded-lg cursor-pointer text-text"
                  >
                    <Clock3 className="w-4 h-4 mr-2 text-subtext" />
                    Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onPatientClick(patientId)}
                    className="hover:bg-accent rounded-lg cursor-pointer text-text"
                  >
                    <User className="w-4 h-4 mr-2 text-subtext" />
                    Open Patient
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onNotesClick(patientId)}
                    className="hover:bg-accent rounded-lg cursor-pointer text-text"
                  >
                    <Clock3 className="w-4 h-4 mr-2 text-subtext" />
                    Open Notes Tab
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-subtext text-sm">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
