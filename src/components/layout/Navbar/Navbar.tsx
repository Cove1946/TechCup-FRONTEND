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

const NOTIFICATIONS_BY_ROLE: Record<string, Notification[]> = {
  jugador: [
    { id: 1, icon: '⚽', title: 'Aceptaste la invitación', body: 'Ahora eres miembro de FC KERNEL', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '✅', title: 'Pago aprobado', body: 'Tu inscripción fue confirmada', time: '5h', color: 'blue' },
    { id: 3, icon: '📅', title: 'Partido hoy', body: '3:00 PM · Cancha 2 · vs Debuggers', time: 'hoy', color: 'orange' },
    { id: 4, icon: '🟥', title: 'Sanción automática', body: 'J. García suspendido 1 partido', time: 'ayer', color: 'red' },
  ],
  capitan: [
    { id: 1, icon: '👥', title: 'Nuevo jugador en equipo', body: 'Pablo K. se unió a FC KERNEL', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '⚠️', title: 'Jugador suspendido', body: 'Rogelio B. no puede jugar el próximo partido', time: '2h', color: 'red', unread: true },
    { id: 3, icon: '📅', title: 'Partido mañana', body: '3:00 PM · Cancha 2 · vs Debuggers', time: 'hoy', color: 'orange' },
    { id: 4, icon: '💳', title: 'Pago pendiente', body: '2 jugadores pendientes de pago', time: 'ayer', color: 'blue' },
  ],
  admin: [
    { id: 1, icon: '👤', title: 'Nuevo usuario registrado', body: 'Carlos Pérez solicita acceso', time: 'Ahora', color: 'blue', unread: true },
    { id: 2, icon: '⚙️', title: 'Configuración actualizada', body: 'Torneo 2026-1 modificado', time: '1h', color: 'green' },
    { id: 3, icon: '🔐', title: 'Cambio de rol', body: 'Rogelio B. ahora es Capitán', time: '3h', color: 'orange' },
  ],
  coordinador: [
    { id: 1, icon: '💳', title: 'Pago pendiente', body: 'FC KERNEL aún no confirma pago', time: 'Ahora', color: 'orange', unread: true },
    { id: 2, icon: '🛡️', title: 'Equipo registrado', body: 'DATA KNIGHTS completó inscripción', time: '2h', color: 'green', unread: true },
    { id: 3, icon: '📋', title: 'Partido por confirmar', body: 'Semifinal 1 sin árbitro asignado', time: 'hoy', color: 'red' },
  ],
  arbitro: [
    { id: 1, icon: '📅', title: 'Nuevo partido asignado', body: 'FC KERNEL vs Debuggers · 18 Mar', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '🟨', title: 'Recordatorio', body: 'Partido mañana a las 3:00 PM', time: '4h', color: 'orange' },
    { id: 3, icon: '📝', title: 'Acta pendiente', body: 'Completa el acta del partido anterior', time: 'ayer', color: 'red' },
  ],
};

const DOT_COLOR: Record<Notification['color'], string> = {
  green: '#16a34a', blue: '#3b82f6', orange: '#f59e0b', red: '#ef4444',
};

const PROFILE_BY_ROLE: Record<string, string> = {
  jugador:     '/profile',
  capitan:     '/profile',
  coordinador: '/profile/coordinador',
  arbitro:     '/profile/arbitro',
  admin:       '/profile/admin',
};

const MI_EQUIPO_ALL  = [
  { label: 'Mi perfil deportivo', to: '__profile__',    roles: ['jugador','capitan'] },
  { label: 'Mi equipo',           to: '/my-team',       roles: ['jugador','capitan'] },
  { label: 'Alineación',          to: '/alineacion',    roles: ['jugador','capitan'] },
  { label: 'Buscar jugadores',    to: '/search-players',roles: ['jugador','capitan'] },
  { label: 'Inscripción & Pago',  to: '/payment',       roles: ['capitan'] },
  { label: 'Crear equipo',        to: '/teams/create',  roles: ['capitan'] },
];

const PARTIDOS_ITEMS = [
  { label: 'Calendario',          to: '/calendar' },
  { label: 'Resultados',          to: '/results' },
  { label: 'Tabla de posiciones', to: '/tabla' },
  { label: 'Estadísticas',        to: '/estadisticas' },
  { label: 'Llaves',              to: '/llaves' },
  { label: 'VS — Ambos equipos',  to: '/vs/alineacion' },
];

const ADMIN_ALL = [
  { label: 'Gestión de roles',  to: '/admin/roles',         roles: ['admin'] },
  { label: 'Gestión de pagos',  to: '/organizer/payments',  roles: ['admin','coordinador'] },
  { label: 'Configurar torneo', to: '/organizer/config',    roles: ['admin','coordinador'] },
  { label: 'Panel árbitro',     to: '/arbitro',             roles: ['admin','coordinador'] },
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

export const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userStr  = localStorage.getItem('user');
  let userObj = null;
  try { if (userStr) userObj = JSON.parse(userStr); } catch { localStorage.removeItem('user'); }
  const userRole = (userObj?.role ?? 'jugador').toLowerCase();
  const profileTo = PROFILE_BY_ROLE[userRole] ?? '/profile';

  const showMiEquipo  = ['jugador','capitan'].includes(userRole);
  const miEquipoItems = MI_EQUIPO_ALL
    .filter(i => i.roles.includes(userRole))
    .map(i => ({ label: i.label, to: i.to === '__profile__' ? profileTo : i.to }));

  const adminItems      = ADMIN_ALL.filter(i => i.roles.includes(userRole));
  const showAdmin       = adminItems.length > 0;
  const adminMenuLabel  = userRole === 'coordinador' ? 'Coordinador' : 'Administrador';

  const notifications = NOTIFICATIONS_BY_ROLE[userRole] ?? NOTIFICATIONS_BY_ROLE['jugador'];
  const unreadCount   = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <button className={styles.logoBtn} onClick={() => navigate('/dashboard')}>
            <Logo variant="small" showText />
          </button>
        </div>

        <div className={styles.navLinks}>
          {showMiEquipo && <NavDropdown label="Mi Equipo" items={miEquipoItems} />}
          <NavDropdown label="Partidos"     items={PARTIDOS_ITEMS} />
          {showAdmin && <NavDropdown label={adminMenuLabel} items={adminItems} />}
          {!showMiEquipo && <Link to={profileTo} className={styles.navLink}>Mi perfil</Link>}
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
              <Link to={profileTo} className={styles.userName}>{userName}</Link>
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
          {notifications.map(n => (
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
          <button className={styles.seeAllBtn} onClick={() => setDrawerOpen(false)}>Cerrar</button>
        </div>
      </div>
    </>
  );
};
