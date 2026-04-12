import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '@features/auth';
import { Logo } from '@components/common';
import styles from './RegisterPage.module.css';

export const RegisterPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Logo variant="default" />
        <h1 className={styles.title}>Crear Cuenta</h1>
        <p className={styles.subtitle}>Únete a TechCup</p>

        <RegisterForm />

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.link}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};