# Patient API Integration

This document describes the patient management API integration with the ClinicOS backend.

## Overview

The Doctor Dashboard Design now includes full patient management integration with the ClinicOS backend, providing:

- Patient listing with pagination, filtering, and sorting
- Patient creation with automatic MRN generation
- Patient search and autocomplete
- Patient data management (tags, status, etc.)
- Real-time data synchronization

## API Endpoints

The application connects to the following backend endpoints:

- `GET /v1/patients` - List patients with filters and pagination
- `POST /v1/patients` - Create a new patient
- `GET /v1/patients/{id}` - Get patient by ID
- `PATCH /v1/patients/{id}` - Update patient
- `DELETE /v1/patients/{id}` - Delete patient (soft delete)
- `POST /v1/patients/{id}/restore` - Restore archived patient
- `GET /v1/patients/search` - Search patients
- `GET /v1/patients/autocomplete` - Get patient autocomplete suggestions
- `GET /v1/patients/lookup` - Lookup patient by MRN
- `GET /v1/patients/{id}/tags` - Get patient tags
- `POST /v1/patients/{id}/tags` - Update patient tags
- `DELETE /v1/patients/{id}/tags/{tag}` - Delete specific patient tag

## Configuration

### Environment Variables

The patient service uses the same environment configuration as the auth service:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Setup

Ensure the ClinicOS backend is running on `http://localhost:8000` and includes the patient management endpoints.

## Patient Data Structure

### Patient Interface

```typescript
interface Patient {
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
```

### Patient Creation

```typescript
interface PatientCreate {
  full_name: string;
  dob?: string;
  sex?: 'male' | 'female' | 'other' | 'unknown';
  phone?: string;
  email?: string;
  tags?: string[];
}
```

## Features Implemented

### 1. Patient Listing
- **Pagination**: Server-side pagination with configurable page size
- **Filtering**: By search query, tags, status, age range, and date range
- **Sorting**: By name, MRN, age, last visit, status, or creation date
- **Real-time Updates**: Automatic refresh when data changes

### 2. Patient Creation
- **Form Validation**: Required fields and data type validation
- **Automatic MRN Generation**: Server generates unique MRN for each patient
- **Tag Management**: Select from predefined tags or add custom ones
- **Error Handling**: Comprehensive error messages and validation

### 3. Patient Search
- **Real-time Search**: Search by name, MRN, or tags
- **Autocomplete**: Quick patient lookup with suggestions
- **MRN Lookup**: Direct patient lookup by Medical Record Number

### 4. Patient Management
- **Status Management**: Track patient status (new, ok, inactive)
- **Tag Management**: Add, remove, and update patient tags
- **Soft Delete**: Archive patients instead of permanent deletion
- **Restore**: Restore archived patients

## Components Updated

### PatientService (`src/services/patientService.ts`)
- Handles all patient-related API communication
- Manages authentication headers automatically
- Provides error handling and response parsing
- Includes helper functions for data transformation

### PatientsScreen (`src/components/patients-screen.tsx`)
- Real API integration for patient listing
- Server-side pagination and filtering
- Loading and error states
- Real-time data updates

### AddPatientModal (`src/components/add-patient-modal.tsx`)
- Real API integration for patient creation
- Form validation and error handling
- Loading states during submission
- Automatic form reset after successful creation

## Usage Examples

### Loading Patients

```tsx
import { patientService } from '../services/patientService';

// Load patients with filters
const response = await patientService.getPatients({
  doctor_id: 'user-id',
  page: 1,
  per_page: 10,
  q: 'search query',
  tags: ['Diabetes', 'Hypertension'],
  status: 'ok',
  sort: 'name',
  order: 'asc'
});
```

### Creating a Patient

```tsx
const newPatient = await patientService.createPatient('doctor-id', {
  full_name: 'John Doe',
  dob: '1990-01-01',
  sex: 'male',
  phone: '+1234567890',
  email: 'john@example.com',
  tags: ['Diabetes', 'Follow-up']
});
```

### Searching Patients

```tsx
const searchResults = await patientService.searchPatients({
  doctor_id: 'user-id',
  q: 'search query',
  page: 1,
  per_page: 10
});
```

## Error Handling

All patient operations include comprehensive error handling:

- **Network Errors**: Caught and displayed to users
- **API Error Messages**: Parsed and shown with context
- **Validation Errors**: Form validation with specific field errors
- **Authentication Errors**: Automatic logout on token expiration

## Loading States

The application provides visual feedback during API operations:

- **Loading Spinners**: During data fetching
- **Disabled States**: During form submissions
- **Progress Indicators**: For long-running operations
- **Skeleton Screens**: For initial data loading

## Data Synchronization

- **Real-time Updates**: Data refreshes automatically when changes occur
- **Optimistic Updates**: UI updates immediately for better user experience
- **Error Rollback**: Reverts changes if API calls fail
- **Cache Management**: Efficient data caching and invalidation

## Security Features

- **Authentication Required**: All API calls require valid JWT tokens
- **Doctor Scoping**: Patients are scoped to the authenticated doctor
- **Input Validation**: Server-side validation for all inputs
- **CSRF Protection**: Built-in protection against cross-site attacks

## Performance Optimizations

- **Pagination**: Only loads necessary data
- **Lazy Loading**: Components load on demand
- **Debounced Search**: Reduces API calls during typing
- **Caching**: Intelligent data caching for better performance

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3002` (or the next available port).

## Testing

To test the patient management flow:

1. Start the ClinicOS backend server
2. Start the frontend development server
3. Navigate to the patients screen
4. Test patient creation, search, and management features

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration includes the frontend URL
2. **Authentication Errors**: Check that JWT tokens are properly configured
3. **API Connection**: Verify the `VITE_API_BASE_URL` environment variable is correct
4. **Data Format**: Ensure patient data matches the expected API schema

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your `.env` file for additional logging.

## API Response Format

All API responses follow a consistent format:

```typescript
// Success Response
{
  data: {
    items: Patient[],
    meta: {
      page: number,
      per_page: number,
      total: number,
      total_pages: number,
      sort: string,
      order: string
    }
  },
  message: string
}

// Error Response
{
  detail: string,
  error?: {
    code: string,
    message: string
  }
}
```

This integration provides a complete patient management system that seamlessly connects with the ClinicOS backend, offering a robust and user-friendly interface for managing patient data.
