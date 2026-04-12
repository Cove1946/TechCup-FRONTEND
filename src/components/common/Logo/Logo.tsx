import React from 'react';
import logoImage from '@assets/images/logoText.png';
import styles from './Logo.module.css';

export interface LogoProps {
  variant?: 'default' | 'small';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  showText = false
}) => {
  return (
    <div className={`${styles.logo} ${styles[variant]}`}>
      <img src={logoImage} alt="TechCup Logo" className={styles.image} />
      {showText && <span className={styles.text}>TechCup</span>}
    </div>
  );
};