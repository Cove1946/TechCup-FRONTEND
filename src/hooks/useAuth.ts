import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import type { LoginCredentials, RegisterData } from '../features/auth/types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const ROLE_MAP: Record<string, string> = {
    PLAYER:        'jugador',
    CAPTAIN:       'capitan',
    ORGANIZER:     'coordinador',
    REFEREE:       'arbitro',
    ADMINISTRATOR: 'admin',
  };

  const ROLE_ROUTES: Record<string, string> = {
    jugador:     '/dashboard',
    capitan:     '/dashboard',
    coordinador: '/dashboard',
    arbitro:     '/arbitro',
    admin:       '/dashboard',
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      const role = ROLE_MAP[response.userType] ?? 'jugador';
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role,
      }));
      navigate(ROLE_ROUTES[role] ?? '/dashboard');
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
      const role = ROLE_MAP[response.userType] ?? 'jugador';
      localStorage.setItem('user', JSON.stringify({
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role,
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
