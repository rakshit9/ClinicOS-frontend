import { useState, useCallback, memo } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { patientService, PatientCreate } from '../services/patientService';

interface AddPatientModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientAdded?: () => void;
}

export const AddPatientModal = memo(function AddPatientModal({ isOpen, onOpenChange, onPatientAdded }: AddPatientModalProps) {
  // Doctor ID - in a real app, this would come from auth context
  const doctorId = 'test-doctor-123';
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    sex: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Diabetes', 'Hypertension', 'Cardiology', 'Orthopedic', 
    'Annual Checkup', 'Follow-up', 'Routine', 'Pregnancy',
    'Dermatology', 'Gastroenterology', 'Endocrinology', 'Sports Medicine'
  ];

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const patientData: PatientCreate = {
        full_name: formData.fullName.trim(),
        dob: formData.dob || undefined,
        sex: formData.sex as 'male' | 'female' | 'other' | 'unknown' | undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      await patientService.createPatient(doctorId, patientData);
      
      toast.success('Patient added successfully');
      onOpenChange(false);
      
      // Reset form
      setFormData({ fullName: '', dob: '', sex: '', phone: '', email: '', notes: '' });
      setSelectedTags([]);
      
      // Notify parent component
      if (onPatientAdded) {
        onPatientAdded();
      }
    } catch (error: any) {
      console.error('Failed to create patient:', error);
      toast.error(error.message || 'Failed to create patient');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedTags, doctorId, onOpenChange, onPatientAdded]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    // Reset form
    setFormData({ fullName: '', dob: '', sex: '', phone: '', email: '', notes: '' });
    setSelectedTags([]);
  }, [onOpenChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleCancel]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[560px] max-w-[560px] bg-surface border border-border rounded-2xl shadow-lg p-0"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <div>
            <DialogTitle className="text-text">Add patient</DialogTitle>
            <DialogDescription className="text-subtext mt-1">
              Create a new patient record in the system
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0 hover:bg-accent rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Form */}
        <div className="px-6 pb-6 space-y-6">
          {/* 12-column grid with 24px gutter */}
          <div className="grid grid-cols-12 gap-6">
            {/* Full Name - Required */}
            <div className="col-span-12">
              <Label htmlFor="fullName" className="text-text mb-2 block">
                Full name <span className="text-danger">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter patient's full name"
                className="h-12 bg-input-background border-border rounded-xl"
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="col-span-6">
              <Label htmlFor="dob" className="text-text mb-2 block">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="h-12 bg-input-background border-border rounded-xl"
              />
            </div>

            {/* Sex */}
            <div className="col-span-6">
              <Label htmlFor="sex" className="text-text mb-2 block">Sex</Label>
              <select
                id="sex"
                value={formData.sex}
                onChange={(e) => handleInputChange('sex', e.target.value)}
                className="h-12 w-full bg-input-background border border-border rounded-xl px-3 text-text"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {/* Phone */}
            <div className="col-span-6">
              <Label htmlFor="phone" className="text-text mb-2 block">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="h-12 bg-input-background border-border rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="col-span-6">
              <Label htmlFor="email" className="text-text mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="h-12 bg-input-background border-border rounded-xl"
              />
            </div>

            {/* Tags */}
            <div className="col-span-12">
              <Label className="text-text mb-3 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-canvas text-subtext border border-border hover:bg-accent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="col-span-12">
              <Label htmlFor="notes" className="text-text mb-2 block">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about the patient"
                className="min-h-[80px] bg-input-background border-border rounded-xl resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-border hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Patient'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});