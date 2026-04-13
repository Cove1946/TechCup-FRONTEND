import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@components/common';
import styles from './Navbar.module.css';

export interface NavbarProps {
  userName?: string;
  userAvatar?: string;
  isAdmin?: boolean;
}

interface Notification {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  color: 'green' | 'blue' | 'orange' | 'red';
  unread?: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, icon: '⚽', title: 'Aceptaste la invitación', body: 'Ahora eres miembro de FC KERNEL', time: 'Ahora', color: 'green', unread: true },
  { id: 2, icon: '✅', title: 'Pago aprobado', body: 'Tu inscripción fue confirmada', time: '5h', color: 'blue' },
  { id: 3, icon: '📅', title: 'Partido hoy', body: '3:00 PM · Cancha 2 · vs Debuggers', time: 'hoy', color: 'orange' },
  { id: 4, icon: '🟥', title: 'Sanción automática', body: 'J. García suspendido 1 partido', time: 'ayer', color: 'red' },
];

const DOT_COLOR: Record<Notification['color'], string> = {
  green: '#16a34a', blue: '#3b82f6', orange: '#f59e0b', red: '#ef4444',
};

const MI_EQUIPO_ITEMS = [
  { label: 'Mi perfil deportivo', to: '/profile' },
  { label: 'Ver mi equipo', to: '/teams' },
  { label: 'Buscar jugadores', to: '/search-players' },
  { label: 'Inscripción & Pago', to: '/payment' },
  { label: 'Crear equipo', to: '/teams/create' },
];

const PARTIDOS_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Resultados', to: '/results' },
  { label: 'Calendario', to: '/calendar' },
];

const ADMIN_ITEMS = [
  { label: 'Gestionar torneos', to: '/admin/tournaments' },
  { label: 'Gestionar equipos', to: '/admin/teams' },
  { label: 'Gestionar jugadores', to: '/admin/players' },
];

function NavDropdown({ label, items }: { label: string; items: { label: string; to: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={styles.dropdownWrapper}>
      <button
        className={`${styles.navLink} ${open ? styles.navLinkActive : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {label}
        <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {items.map(item => (
            <Link key={item.to} to={item.to} className={styles.dropdownItem} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar, isAdmin }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <Logo variant="small" showText />
        </div>

        <div className={styles.navLinks}>
          <NavDropdown label="Mi Equipo" items={MI_EQUIPO_ITEMS} />
          <NavDropdown label="Partidos" items={PARTIDOS_ITEMS} />
          {isAdmin && <NavDropdown label="Administrador" items={ADMIN_ITEMS} />}
        </div>

        <div className={styles.userSection}>
          <button className={styles.bellBtn} onClick={() => setDrawerOpen(o => !o)} aria-label="Notificaciones">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className={styles.bellBadge}>{unreadCount}</span>}
          </button>

          {userName && (
            <>
              <Link to="/profile" className={styles.userName}>{userName}</Link>
              {userAvatar
                ? <img src={userAvatar} alt={userName} className={styles.avatar} />
                : <div className={styles.avatarPlaceholder}>{userName.charAt(0).toUpperCase()}</div>
              }
              <button onClick={handleLogout} className={styles.logoutBtn}>Salir</button>
            </>
          )}
        </div>
      </nav>

      {drawerOpen && <div className={styles.backdrop} onClick={() => setDrawerOpen(false)} />}

      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>Notificaciones</h3>
          <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className={styles.notifList}>
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ''}`}>
              <div className={styles.notifIcon}>{n.icon}</div>
              <div className={styles.notifBody}>
                <p className={styles.notifTitle}>{n.title}</p>
                <p className={styles.notifDesc}>{n.body}</p>
              </div>
              <div className={styles.notifMeta}>
                <span className={styles.notifTime}>{n.time}</span>
                <span className={styles.notifDot} style={{ background: DOT_COLOR[n.color] }} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.drawerFooter}>
          <button className={styles.seeAllBtn} onClick={() => setDrawerOpen(false)}>Ver todas →</button>
        </div>
      </div>
    </>
  );
};
