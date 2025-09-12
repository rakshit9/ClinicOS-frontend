import { Clock, User, MoreHorizontal, CheckCircle, AlertCircle, Calendar, Clock3, Video, Paperclip, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'canceled' | 'no_show';

interface AppointmentRowProps {
  id: string;
  time: string;
  patientName: string;
  patientId: string;
  mrn: string;
  visitType: 'Check-up' | 'Follow-up' | 'Lab Review' | 'Consultation' | 'Procedure';
  status: AppointmentStatus;
  duration: number;
  notes?: string;
  isTelehealth?: boolean;
  hasAttachment?: boolean;
  isPriority?: boolean;
  isLast?: boolean;
  onConfirm?: (id: string) => void;
  onComplete?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onPatientClick?: (patientId: string) => void;
  onNotesClick?: (patientId: string) => void;
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
        return 'bg-primary/10 text-primary border-primary/20';
      case 'canceled':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'no_show':
        return 'bg-subtext/10 text-subtext border-subtext/20';
      default:
        return 'bg-surface text-subtext border-border';
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-3 h-3" />;
      case 'confirmed':
        return <CheckCircle className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'canceled':
        return <AlertCircle className="w-3 h-3" />;
      case 'no_show':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getVisitTypeColor = (visitType: string) => {
    switch (visitType) {
      case 'Check-up':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Follow-up':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Lab Review':
        return 'bg-success/10 text-success border-success/20';
      case 'Consultation':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Procedure':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-surface text-subtext border-border';
    }
  };

  const getActionButton = () => {
    switch (status) {
      case 'pending':
        return (
          <Button
            size="sm"
            onClick={() => onConfirm?.(id)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl px-3 py-1 h-7 text-xs font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Confirm
          </Button>
        );
      case 'confirmed':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onComplete?.(id)}
            className="border-border bg-surface hover:bg-accent rounded-xl text-subtext hover:text-text px-3 py-1 h-7 text-xs font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  const getPatientInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  };

  return (
    <div 
      className={`bg-surface rounded-xl p-4 hover:bg-accent/30 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-center">
        {/* Left Column - Time */}
        <div className="flex items-center gap-2 min-w-[4.5rem]">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-text font-medium text-sm tabular-nums">{time}</span>
        </div>

        {/* Main Column - Patient Info */}
        <div className="space-y-2">
          {/* Row A - Avatar, Name, MRN */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xs font-medium">
                {getPatientInitials(patientName)}
              </span>
            </div>
            <button
              onClick={() => onPatientClick?.(patientId)}
              className="text-primary hover:text-primary-hover font-medium text-sm underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
            >
              {patientName}
            </button>
            <Badge 
              variant="secondary"
              className="bg-surface text-subtext border-border rounded-md px-2 py-0.5 text-xs font-normal"
            >
              {mrn}
            </Badge>
          </div>

          {/* Row B - Visit Type, Duration, Icons */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary"
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${getVisitTypeColor(visitType)}`}
            >
              {visitType}
            </Badge>
            <span className="text-subtext text-xs">•</span>
            <span className="text-subtext text-xs tabular-nums">{duration}min</span>
            
            {/* Micro indicators */}
            <div className="flex items-center gap-1 ml-1">
              {isTelehealth && <Video className="w-3 h-3 text-accent" />}
              {hasAttachment && <Paperclip className="w-3 h-3 text-accent" />}
              {isPriority && <Flag className="w-3 h-3 text-warning" />}
            </div>
          </div>

          {/* Row C - Notes */}
          {notes && (
            <p className="text-subtext text-xs leading-relaxed truncate max-w-[24rem]">
              {notes}
            </p>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Status Pill */}
          <Badge 
            variant="secondary"
            className={`rounded-full px-2 py-1 text-xs capitalize flex items-center gap-1 font-medium ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            {status.replace('_', ' ')}
          </Badge>

          {/* Action Button */}
          {getActionButton()}

          {/* Kebab Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-xl hover:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface border border-border rounded-xl w-48">
              <DropdownMenuItem 
                onClick={() => onReschedule?.(id)}
                className="hover:bg-accent rounded-lg cursor-pointer focus:bg-accent"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onPatientClick?.(patientId)}
                className="hover:bg-accent rounded-lg cursor-pointer focus:bg-accent"
              >
                <User className="w-4 h-4 mr-2" />
                Open Patient
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onNotesClick?.(patientId)}
                className="hover:bg-accent rounded-lg cursor-pointer focus:bg-accent"
              >
                <Clock3 className="w-4 h-4 mr-2" />
                Open Notes Tab
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}