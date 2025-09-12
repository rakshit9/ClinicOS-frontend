# Authentication Integration

This document describes the authentication integration with the ClinicOS backend API.

## Overview

The Doctor Dashboard Design now includes full authentication integration with the ClinicOS backend, providing:

- User registration and login
- Password reset functionality
- JWT token management
- Protected routes and user context
- Real-time authentication state management

## API Endpoints

The application connects to the following backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Development settings
VITE_APP_NAME=Doctor Dashboard Design
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
```

### Backend Setup

Ensure the ClinicOS backend is running on `http://localhost:8000` (or update `VITE_API_BASE_URL` accordingly).

## Authentication Flow

### 1. Registration
- Users can register with name, email, password, and optional fields (specialty, timezone, clinic name)
- Upon successful registration, users are automatically logged in
- JWT tokens are stored in localStorage

### 2. Login
- Users can log in with email and password
- Successful login stores JWT tokens and redirects to dashboard
- Error handling displays appropriate messages

### 3. Password Reset
- Users can request password reset via email
- Reset link contains a token that expires in 30 minutes
- Users can set a new password using the token

### 4. Dashboard Access
- Dashboard is protected and requires authentication
- User information is displayed in the top bar
- Logout functionality clears tokens and returns to landing page

## Components

### AuthService (`src/services/authService.ts`)
- Handles all API communication
- Manages token storage and retrieval
- Provides error handling and response parsing

### AuthContext (`src/contexts/AuthContext.tsx`)
- React context for authentication state
- Provides login, register, logout, and password reset functions
- Manages loading states and user information

### Updated Components
- `PremiumSignIn` - Real API integration for login
- `CompactSignUpCard` - Real API integration for registration
- `PremiumForgotPassword` - Real API integration for password reset
- `PremiumResetPassword` - Real API integration for password reset with token
- `DashboardApp` - User context and logout functionality
- `TopBar` - Displays user information and logout option

## Usage

### Using the Auth Context

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <Dashboard user={user} onLogout={logout} />;
}
```

### API Service Usage

```tsx
import { authService } from '../services/authService';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await authService.register({
  name: 'Dr. John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'doctor',
  speciality: 'Cardiology'
});
```

## Error Handling

All authentication operations include comprehensive error handling:

- Network errors are caught and displayed to users
- API error messages are parsed and shown
- Invalid tokens automatically log out users
- Form validation prevents invalid submissions

## Security Features

- JWT tokens are stored securely in localStorage
- Automatic token refresh on API calls
- Secure logout that revokes refresh tokens
- CORS configuration for development
- Input validation and sanitization

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3002` (or the next available port).

## Testing

To test the authentication flow:

1. Start the ClinicOS backend server
2. Start the frontend development server
3. Navigate to the sign-in page
4. Use the demo credentials or register a new account
5. Test the complete authentication flow

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration includes the frontend URL
2. **Token Errors**: Check that JWT secrets are properly configured in the backend
3. **API Connection**: Verify the `VITE_API_BASE_URL` environment variable is correct
4. **Build Errors**: Ensure all React imports are properly configured

### Debug Mode

Enable debug mode by setting `VITE_DEBUG=true` in your `.env` file for additional logging.
