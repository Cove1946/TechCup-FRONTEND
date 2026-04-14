import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar';
import logoImage from '@assets/Logo.png';
import styles from './MainLayout.module.css';

export interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

// Navbar simplificado para usuarios no autenticados
const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className={styles.publicHeader}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <div className={styles.publicBrand}>
        <img src={logoImage} alt="TechCup" className={styles.publicLogo} />
        <span className={styles.publicName}>TechCup</span>
      </div>
      <button className={styles.loginBtn} onClick={() => navigate('/login')}>
        Iniciar sesión
      </button>
    </header>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNavbar = true,
}) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!user;

  const isPrivileged = ['admin', 'coordinador', 'arbitro'].includes(user?.role ?? '');

  return (
    <div className={styles.layout}>
      {showNavbar && (
        isLoggedIn
          ? <Navbar
              userName={user.name}
              userAvatar={user.avatar}
              isAdmin={isPrivileged}
              userRole={user.role}
            />
          : <PublicHeader />
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
};
