import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: {
    patient: string;
    time: string;
    type: string;
  };
}

export function RescheduleModal({ isOpen, onClose, appointment }: RescheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-scrim" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-lg border border-border w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-text">Reschedule Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5 text-subtext" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {appointment && (
            <div className="bg-canvas rounded-2xl p-4">
              <p className="text-text font-medium">{appointment.patient}</p>
              <p className="text-subtext text-sm">{appointment.type} • Currently: {appointment.time}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" className="text-text">New Date</Label>
              <Input
                id="date"
                type="date"
                className="mt-2 bg-canvas border-border rounded-2xl"
              />
            </div>
            
            <div>
              <Label htmlFor="time" className="text-text">New Time</Label>
              <Input
                id="time"
                type="time"
                className="mt-2 bg-canvas border-border rounded-2xl"
              />
            </div>
            
            <div>
              <Label htmlFor="reason" className="text-text">Reason (Optional)</Label>
              <Input
                id="reason"
                placeholder="Patient request, doctor availability..."
                className="mt-2 bg-canvas border-border rounded-2xl"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-border rounded-2xl"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary-hover text-text rounded-2xl"
            onClick={onClose}
          >
            Reschedule
          </Button>
        </div>
      </div>
    </div>
  );
}