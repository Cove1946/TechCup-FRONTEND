import React from 'react';
import { Navbar } from '../Navbar';
import styles from './MainLayout.module.css';

export interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNavbar = true
}) => {
  const userString = localStorage.getItem('user');
  let user = null;
  try { if (userString) user = JSON.parse(userString); } catch { localStorage.removeItem('user'); }

  return (
    <div className={styles.layout}>
      {showNavbar && <Navbar userName={user?.name} userAvatar={user?.avatar} />}
      <main className={styles.main}>{children}</main>
    </div>
  );
};