import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Doctor ID - in a real app, this would come from auth context
const DOCTOR_ID = 'test-doctor-123';

export interface Patient {
  id: string;
  doctor_id: string;
  mrn: string;
  full_name: string;
  dob: string | null;
  sex: string | null;
  phone: string | null;
  email: string | null;
  tags: string[];
  status: string;
  last_visit_at: string | null;
  created_at: string;
  updated_at: string;
  archived: boolean;
  initials: string;
}

export interface PatientListResponse {
  items: Patient[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    sort: string;
    order: string;
  };
}

export interface PatientListParams {
  doctor_id: string;
  page?: number;
  per_page?: number;
  q?: string;
  tags?: string[];
  status?: string;
  age_min?: number;
  age_max?: number;
  last_visit_from?: string;
  last_visit_to?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PatientCreate {
  full_name: string;
  dob?: string;
  sex?: 'male' | 'female' | 'other' | 'unknown';
  phone?: string;
  email?: string;
  tags?: string[];
}

export interface PatientUpdate {
  full_name?: string;
  dob?: string;
  sex?: 'male' | 'female' | 'other' | 'unknown';
  phone?: string;
  email?: string;
  tags?: string[];
  status?: 'new' | 'ok' | 'inactive';
}

export interface PatientAutocompleteItem {
  id: string;
  mrn: string;
  full_name: string;
  tags: string[];
}

class PatientService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = authService.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Patient API request failed:', error);
      throw error;
    }
  }

  async getPatients(params: PatientListParams): Promise<PatientListResponse> {
    const searchParams = new URLSearchParams();
    
    // Required params
    searchParams.append('doctor_id', params.doctor_id);
    
    // Optional params
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.q) searchParams.append('q', params.q);
    if (params.status) searchParams.append('status', params.status);
    if (params.age_min) searchParams.append('age_min', params.age_min.toString());
    if (params.age_max) searchParams.append('age_max', params.age_max.toString());
    if (params.last_visit_from) searchParams.append('last_visit_from', params.last_visit_from);
    if (params.last_visit_to) searchParams.append('last_visit_to', params.last_visit_to);
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.order) searchParams.append('order', params.order);
    
    // Handle tags array
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => searchParams.append('tags', tag));
    }

    const url = `/v1/patients?${searchParams.toString()}`;
    return this.request<PatientListResponse>(url);
  }

  async getPatient(doctorId: string, patientId: string): Promise<Patient> {
    return this.request<Patient>(`/v1/patients/${patientId}?doctor_id=${doctorId}`);
  }

  async createPatient(doctorId: string, data: PatientCreate): Promise<Patient> {
    return this.request<Patient>(`/v1/patients?doctor_id=${doctorId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePatient(doctorId: string, patientId: string, data: PatientUpdate): Promise<Patient> {
    return this.request<Patient>(`/v1/patients/${patientId}?doctor_id=${doctorId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deletePatient(doctorId: string, patientId: string): Promise<void> {
    await this.request<void>(`/v1/patients/${patientId}?doctor_id=${doctorId}`, {
      method: 'DELETE',
    });
  }

  async restorePatient(doctorId: string, patientId: string): Promise<Patient> {
    return this.request<Patient>(`/v1/patients/${patientId}/restore?doctor_id=${doctorId}`, {
      method: 'POST',
    });
  }

  async searchPatients(params: PatientListParams): Promise<PatientListResponse> {
    const searchParams = new URLSearchParams();
    
    // Required parameters
    searchParams.append('doctor_id', params.doctor_id);
    searchParams.append('q', params.q || ''); // Backend requires q parameter
    
    // Optional parameters
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.sort) searchParams.append('sort', params.sort);
    if (params.order) searchParams.append('order', params.order);
    
    // Add search fields (name, mrn, tags as per backend)
    searchParams.append('fields', 'name');
    searchParams.append('fields', 'mrn');
    searchParams.append('fields', 'tags');
    
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => searchParams.append('tags', tag));
    }

    return this.request<PatientListResponse>(`/v1/patients/search?${searchParams.toString()}`);
  }

  async autocompletePatients(doctorId: string, query: string, limit: number = 8): Promise<PatientAutocompleteItem[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('doctor_id', doctorId);
    searchParams.append('q', query);
    searchParams.append('limit', limit.toString());

    return this.request<PatientAutocompleteItem[]>(`/v1/patients/autocomplete?${searchParams.toString()}`);
  }

  async lookupPatientByMRN(doctorId: string, mrn: string): Promise<Patient> {
    return this.request<Patient>(`/v1/patients/lookup?doctor_id=${doctorId}&mrn=${mrn}`);
  }

  // Tag management APIs
  async getPatientTags(doctorId: string, patientId: string): Promise<string[]> {
    const response = await this.request<{ tags: string[] }>(`/v1/patients/${patientId}/tags?doctor_id=${doctorId}`);
    return response.tags;
  }

  async updatePatientTags(doctorId: string, patientId: string, tags: string[]): Promise<Patient> {
    return this.request<Patient>(`/v1/patients/${patientId}/tags?doctor_id=${doctorId}`, {
      method: 'POST',
      body: JSON.stringify({ tags }),
    });
  }

  async deletePatientTag(doctorId: string, patientId: string, tag: string): Promise<void> {
    await this.request<void>(`/v1/patients/${patientId}/tags/${encodeURIComponent(tag)}?doctor_id=${doctorId}`, {
      method: 'DELETE',
    });
  }
}

export const patientService = new PatientService();
