import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import type { LoginCredentials, RegisterData } from '../features/auth/types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const ROLE_ROUTES: Record<string, string> = {
    PLAYER:        '/dashboard',
    CAPTAIN:       '/dashboard',
    ORGANIZER:     '/dashboard',
    REFEREE:       '/arbitro',
    ADMINISTRATOR: '/dashboard',
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role: response.userType,
      }));
      const route = ROLE_ROUTES[response.userType] ?? '/dashboard';
      navigate(route);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role: response.userType,
      }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  return { login, register, logout, loading, error };
};
