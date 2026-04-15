import { LoginCredentials, RegisterData, AuthResponse } from '../types';

// Mock users for testing (no backend required)
const MOCK_USERS = [
  {
    email: 'jugador@escuelaing.edu.co',
    password: '123456',
    user: { id: '5', name: 'Pablo Kernel', email: 'jugador@escuelaing.edu.co', role: 'jugador' },
    token: 'mock-token-jugador',
  },
  {
    email: 'capitan@escuelaing.edu.co',
    password: '123456',
    user: { id: '4', name: 'Carlos Pérez', email: 'capitan@escuelaing.edu.co', role: 'capitan' },
    token: 'mock-token-capitan',
  },
  {
    email: 'coordinador@escuelaing.edu.co',
    password: '123456',
    user: { id: '3', name: 'Laura Mendoza', email: 'coordinador@escuelaing.edu.co', role: 'coordinador' },
    token: 'mock-token-coordinador',
  },
  {
    email: 'arbitro@escuelaing.edu.co',
    password: '123456',
    user: { id: '2', name: 'Luis Durán', email: 'arbitro@escuelaing.edu.co', role: 'arbitro' },
    token: 'mock-token-arbitro',
  },
  {
    email: 'admin@escuelaing.edu.co',
    password: '123456',
    user: { id: '1', name: 'Ana Torres', email: 'admin@escuelaing.edu.co', role: 'admin' },
    token: 'mock-token-admin',
  },
];

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 400));

    // Check specific mock users first
    const found = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    if (found) {
      return { user: found.user, token: found.token };
    }

    // Accept any valid-looking email + non-empty password
    if (credentials.email && credentials.password) {
      const namePart = credentials.email.split('@')[0].replace(/[._]/g, ' ');
      return {
        user: {
          id: 'guest-' + Date.now(),
          name: namePart,
          email: credentials.email,
          role: 'jugador',
        },
        token: 'mock-token-' + Date.now(),
      };
    }

    throw new Error('Credenciales inválidas');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 400));
    return {
      user: {
        id: 'new-' + Date.now(),
        name: `${(data as any).nombre ?? ''} ${(data as any).apellido ?? ''}`.trim() || data.email,
        email: data.email,
        role: 'jugador',
      },
      token: 'mock-token-new-' + Date.now(),
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
