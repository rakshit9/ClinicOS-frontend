import { useState } from 'react';
import { AlertTriangle, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

type AlertType = 'critical-lab' | 'missed-appointment' | 'follow-up-due';
type AlertStatus = 'unresolved' | 'resolved';
type FilterType = 'all' | 'unresolved' | 'resolved';

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: string;
  status: AlertStatus;
  patientId?: string;
  reportId?: string;
  appointmentId?: string;
}

interface AlertsScreenProps {
  onPatientClick?: (patientId: string) => void;
  onReportClick?: (reportId: string) => void;
  onAppointmentClick?: (appointmentId: string) => void;
}

export function AlertsScreen({ 
  onPatientClick, 
  onReportClick, 
  onAppointmentClick 
}: AlertsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'critical-lab',
      title: 'Critical Lab Value - Sarah Rodriguez',
      description: 'Hemoglobin level at 7.2 g/dL (critical low). Patient requires immediate follow-up.',
      timestamp: '2024-01-17T14:30:00Z',
      status: 'unresolved',
      patientId: 'patient-1',
      reportId: 'report-1'
    },
    {
      id: '2',
      type: 'missed-appointment',
      title: 'Missed Appointment - Michael Chen',
      description: 'Patient missed scheduled follow-up appointment today at 10:30 AM.',
      timestamp: '2024-01-17T10:30:00Z',
      status: 'unresolved',
      patientId: 'patient-2',
      appointmentId: 'appointment-1'
    },
    {
      id: '3',
      type: 'follow-up-due',
      title: 'Follow-up Due - Emily Johnson',
      description: 'Post-surgery follow-up scheduled for this week. Patient needs appointment booking.',
      timestamp: '2024-01-15T09:00:00Z',
      status: 'unresolved',
      patientId: 'patient-3'
    },
    {
      id: '4',
      type: 'critical-lab',
      title: 'Critical Lab Value - David Park',
      description: 'Glucose level at 450 mg/dL (critical high). Immediate intervention required.',
      timestamp: '2024-01-16T16:45:00Z',
      status: 'resolved',
      patientId: 'patient-4',
      reportId: 'report-2'
    },
    {
      id: '5',
      type: 'missed-appointment',
      title: 'Missed Appointment - Lisa Wong',
      description: 'Patient missed annual check-up appointment yesterday at 2:00 PM.',
      timestamp: '2024-01-16T14:00:00Z',
      status: 'resolved',
      patientId: 'patient-5',
      appointmentId: 'appointment-2'
    },
    {
      id: '6',
      type: 'follow-up-due',
      title: 'Follow-up Due - Robert Taylor',
      description: 'Lab results review needed for cholesterol management program.',
      timestamp: '2024-01-14T11:20:00Z',
      status: 'resolved',
      patientId: 'patient-6'
    }
  ];

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'critical-lab':
        return <AlertTriangle className="w-5 h-5" />;
      case 'missed-appointment':
        return <Calendar className="w-5 h-5" />;
      case 'follow-up-due':
        return <Clock className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: AlertType) => {
    switch (type) {
      case 'critical-lab':
        return 'text-danger';
      case 'missed-appointment':
        return 'text-warning';
      case 'follow-up-due':
        return 'text-success';
      default:
        return 'text-subtext';
    }
  };

  const getAlertBadgeColor = (type: AlertType) => {
    switch (type) {
      case 'critical-lab':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'missed-appointment':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'follow-up-due':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-subtext/10 text-subtext border-subtext/20';
    }
  };

  const getAlertTypeLabel = (type: AlertType) => {
    switch (type) {
      case 'critical-lab':
        return 'Critical Lab';
      case 'missed-appointment':
        return 'Missed Appt';
      case 'follow-up-due':
        return 'Follow-up';
      default:
        return 'Alert';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    if (activeFilter === 'all') return true;
    return alert.status === activeFilter;
  });

  const unresolvedCount = mockAlerts.filter(alert => alert.status === 'unresolved').length;
  const resolvedCount = mockAlerts.filter(alert => alert.status === 'resolved').length;

  const handleAlertClick = (alert: Alert) => {
    switch (alert.type) {
      case 'critical-lab':
        if (alert.reportId && onReportClick) {
          onReportClick(alert.reportId);
        }
        break;
      case 'missed-appointment':
        if (alert.appointmentId && onAppointmentClick) {
          onAppointmentClick(alert.appointmentId);
        }
        break;
      case 'follow-up-due':
        if (alert.patientId && onPatientClick) {
          onPatientClick(alert.patientId);
        }
        break;
    }
  };

  const handleResolve = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Resolving alert:', alertId);
    // In a real app, this would update the alert status
  };

  return (
    <div className="flex-1 bg-canvas">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-surface">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text text-2xl mb-2">Alerts</h1>
              <p className="text-subtext">Monitor critical values, missed appointments, and follow-up reminders</p>
            </div>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center bg-canvas border border-border rounded-2xl p-1 w-fit">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                activeFilter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-subtext hover:text-text'
              }`}
            >
              All ({mockAlerts.length})
            </button>
            <button
              onClick={() => setActiveFilter('unresolved')}
              className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                activeFilter === 'unresolved'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-subtext hover:text-text'
              }`}
            >
              Unresolved ({unresolvedCount})
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-4 py-2 rounded-xl transition-all font-medium text-sm ${
                activeFilter === 'resolved'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-subtext hover:text-text'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-[1440px] mx-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-text font-medium mb-2">No alerts to show</h3>
              <p className="text-subtext">
                {activeFilter === 'unresolved' 
                  ? 'All alerts have been resolved.' 
                  : activeFilter === 'resolved'
                  ? 'No resolved alerts yet.'
                  : 'No alerts at this time.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={`bg-surface border border-border rounded-2xl hover:shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 ${
                    alert.status === 'resolved' ? 'opacity-75' : ''
                  }`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      {/* Left: Icon + Content */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className={`flex-shrink-0 mt-1 ${getAlertColor(alert.type)}`}>
                          {getAlertIcon(alert.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-text font-medium">{alert.title}</h3>
                            <Badge 
                              variant="outline"
                              className={`rounded-lg px-2 py-0.5 text-xs ${getAlertBadgeColor(alert.type)}`}
                            >
                              {getAlertTypeLabel(alert.type)}
                            </Badge>
                            {alert.status === 'resolved' && (
                              <Badge 
                                variant="outline"
                                className="rounded-lg px-2 py-0.5 text-xs bg-success/10 text-success border-success/20"
                              >
                                Resolved
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-subtext mb-3 leading-relaxed">
                            {alert.description}
                          </p>
                          
                          <div className="text-subtext text-sm">
                            {formatTimestamp(alert.timestamp)}
                          </div>
                        </div>
                      </div>

                      {/* Right: Resolve Button */}
                      {alert.status === 'unresolved' && (
                        <div className="flex-shrink-0 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleResolve(alert.id, e)}
                            className="border border-border rounded-xl text-subtext hover:text-text hover:border-primary hover:bg-primary/5 px-4 py-2"
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}