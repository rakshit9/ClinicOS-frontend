// Appointment Service - API calls for appointments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const DOCTOR_ID = 'test-doctor-123'; // Hardcoded for now

// Types
export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  appointment_type: 'check-up' | 'follow-up' | 'consultation' | 'lab-review' | 'specialist' | 'urgent';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithPatient extends Appointment {
  patient: {
    id: string;
    mrn: string;
    full_name: string;
    phone: string;
    email: string;
    tags: string[];
  };
}

export interface AppointmentSummary {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface AppointmentListResponse {
  appointments: AppointmentWithPatient[];
  summary: AppointmentSummary;
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface AppointmentNote {
  id: string;
  appointment_id: string;
  doctor_id: string;
  note_text: string;
  note_type: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  appointment_type: 'check-up' | 'follow-up' | 'consultation' | 'lab-review' | 'specialist' | 'urgent';
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  description?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  patient_id?: string;
  appointment_date?: string;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  appointment_type?: 'check-up' | 'follow-up' | 'consultation' | 'lab-review' | 'specialist' | 'urgent';
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  description?: string;
  notes?: string;
}

export interface CreateAppointmentNoteData {
  note_text: string;
  note_type?: string;
}

export interface UpdateAppointmentNoteData {
  note_text?: string;
  note_type?: string;
}

class AppointmentService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Appointment API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`Appointment API response for ${endpoint}:`, data);
      return data.data || data;
    } catch (error) {
      console.error(`Appointment API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Main CRUD operations
  async getAppointments(params: {
    view?: 'day' | 'week' | 'month' | 'custom';
    date?: string;
    status?: string;
    appointment_type?: string;
    patient_id?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<AppointmentListResponse> {
    const searchParams = new URLSearchParams({
      doctor_id: DOCTOR_ID,
      ...Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ),
    });

    return this.request<AppointmentListResponse>(
      `/v1/appointments?${searchParams.toString()}`
    );
  }

  async getAppointment(appointmentId: string): Promise<AppointmentWithPatient> {
    return this.request<AppointmentWithPatient>(
      `/v1/appointments/${appointmentId}?doctor_id=${DOCTOR_ID}`
    );
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    return this.request<Appointment>('/v1/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(
    appointmentId: string,
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    return this.request<Appointment>(`/v1/appointments/${appointmentId}?doctor_id=${DOCTOR_ID}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    return this.request<void>(`/v1/appointments/${appointmentId}?doctor_id=${DOCTOR_ID}`, {
      method: 'DELETE',
    });
  }

  // Special view endpoints
  async getTodayAppointments(): Promise<AppointmentWithPatient[]> {
    const response = await this.request<{ data: AppointmentWithPatient[] }>(
      `/v1/appointments/today?doctor_id=${DOCTOR_ID}`
    );
    return response.data || response;
  }

  async getAppointmentSummary(targetDate?: string): Promise<AppointmentSummary> {
    const params = new URLSearchParams({ doctor_id: DOCTOR_ID });
    if (targetDate) {
      params.append('target_date', targetDate);
    }
    
    const response = await this.request<{ data: AppointmentSummary }>(
      `/v1/appointments/summary?${params.toString()}`
    );
    return response.data || response;
  }

  // Appointment Notes
  async getAppointmentNotes(appointmentId: string): Promise<AppointmentNote[]> {
    const response = await this.request<{ data: AppointmentNote[] }>(
      `/v1/appointments/${appointmentId}/notes?doctor_id=${DOCTOR_ID}`
    );
    return response.data || response;
  }

  async createAppointmentNote(
    appointmentId: string,
    data: CreateAppointmentNoteData
  ): Promise<AppointmentNote> {
    return this.request<AppointmentNote>(`/v1/appointments/${appointmentId}/notes?doctor_id=${DOCTOR_ID}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointmentNote(
    appointmentId: string,
    noteId: string,
    data: UpdateAppointmentNoteData
  ): Promise<AppointmentNote> {
    return this.request<AppointmentNote>(
      `/v1/appointments/${appointmentId}/notes/${noteId}?doctor_id=${DOCTOR_ID}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteAppointmentNote(appointmentId: string, noteId: string): Promise<void> {
    return this.request<void>(
      `/v1/appointments/${appointmentId}/notes/${noteId}?doctor_id=${DOCTOR_ID}`,
      {
        method: 'DELETE',
      }
    );
  }
}

export const appointmentService = new AppointmentService();
