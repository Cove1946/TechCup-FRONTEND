import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@components/common';
import { Button } from '@components/ui';
import styles from './WelcomePage.module.css';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Logo variant="default" />
        <h1 className={styles.title}>Bienvenido a TechCup</h1>
        <p className={styles.subtitle}>
          Gestiona tu equipo, revisa el calendario y sigue el torneo de fútbol universitario
        </p>
        <div className={styles.actions}>
          <Button variant="primary" size="large" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
          <Button variant="outline" size="large" onClick={() => navigate('/register')}>
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
};