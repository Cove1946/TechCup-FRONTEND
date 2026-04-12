import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import type { LoginCredentials, RegisterData } from '../types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      // Simulación temporal - reemplazar con llamada real a API
      const mockResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'Usuario Demo',
          role: 'player',
        },
        token: 'mock-token-123',
      };

      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      // Simulación temporal
      const mockResponse = {
        user: {
          id: '1',
          email: data.email,
          name: data.name,
          role: 'player',
        },
        token: 'mock-token-123',
      };

      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return { login, register, logout, loading, error };
};