import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '@assets/Logo.png';
import { LoginForm } from '@features/auth';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Volver al inicio
      </Link>

      <div className={styles.split}>
        <div className={styles.leftPanel}>
          <img src={logoImage} alt="TechCup Fútbol" className={styles.logo} />
          <h2 className={styles.welcome}>Bienvenido de regreso</h2>
          <p className={styles.tagline}>
            Gestiona tu equipo, revisa el calendario y sigue el torneo desde un solo lugar.
          </p>
        </div>

        <div className={styles.rightPanel}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
