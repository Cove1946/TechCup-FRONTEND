import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@components/common';
import styles from './Navbar.module.css';

export interface NavbarProps {
  userName?: string;
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <Logo variant="small" showText />
      </div>

      <div className={styles.navLinks}>
        <Link to="/dashboard" className={styles.navLink}>
          Inicio
        </Link>
        <Link to="/teams" className={styles.navLink}>
          Equipos
        </Link>
        <Link to="/calendar" className={styles.navLink}>
          Calendario
        </Link>
      </div>

      <div className={styles.userSection}>
        {userName && (
          <>
            <Link to="/profile" className={styles.userName}>
              {userName}
            </Link>
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
};