export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  documentId: string;
  email: string;
  password: string;
  userType?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}