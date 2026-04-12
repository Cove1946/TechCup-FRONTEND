import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@features/auth';
import { Logo } from '@components/common';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Logo variant="default" />
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <p className={styles.subtitle}>Ingresa a tu cuenta de TechCup</p>

        <LoginForm />

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.link}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};