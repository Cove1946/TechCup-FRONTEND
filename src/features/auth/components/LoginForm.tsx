import React, { useState } from 'react';
import { Button, Input } from '@components/ui';
import { useAuth } from '../hooks';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="tu@email.com"
        fullWidth
        required
      />

      <Input
        label="Contraseña"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        fullWidth
        required
      />

      <Button type="submit" fullWidth size="large" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};