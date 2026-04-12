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
  const user = userString ? JSON.parse(userString) : null;

  return (
    <div className={styles.layout}>
      {showNavbar && <Navbar userName={user?.name} userAvatar={user?.avatar} />}
      <main className={styles.main}>{children}</main>
    </div>
  );
};