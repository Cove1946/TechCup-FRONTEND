import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { LoginCredentials } from '../types';

const ROLE_REDIRECT: Record<string, string> = {
  admin:        '/admin/roles',
  coordinador:  '/organizer/config',
  arbitro:      '/arbitro',
  capitan:      '/dashboard',
  jugador:      '/dashboard',
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      const role = response.user.role ?? 'jugador';
      navigate(ROLE_REDIRECT[role] ?? '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return { login, logout, loading, error };
};
