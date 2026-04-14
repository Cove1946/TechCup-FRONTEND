import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@components/common';
import styles from './Navbar.module.css';

export interface NavbarProps {
  userName?: string;
  userAvatar?: string;
  isAdmin?: boolean;
  userRole?: string;
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
    { id: 1, icon: '⚽', title: 'Invitación al equipo', body: 'FC KERNEL te invitó a unirte', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '✅', title: 'Pago aprobado', body: 'Tu inscripción fue confirmada', time: '5h', color: 'blue' },
    { id: 3, icon: '📅', title: 'Partido hoy', body: '3:00 PM · Cancha 2 · vs Debuggers', time: 'hoy', color: 'orange' },
    { id: 4, icon: '🟨', title: 'Tarjeta amarilla acumulada', body: 'Siguiente tarjeta = suspensión', time: 'ayer', color: 'red' },
  ],
  capitan: [
    { id: 1, icon: '👥', title: 'Jugador solicita unirse', body: 'Carlos M. quiere unirse a FC KERNEL', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '💰', title: 'Pago del equipo confirmado', body: 'Inscripción TechCup 2026-1 aprobada', time: '3h', color: 'blue' },
    { id: 3, icon: '📅', title: 'Partido mañana', body: '3:00 PM · Cancha B · vs LOS DEBUGGERS', time: 'hoy', color: 'orange' },
    { id: 4, icon: '🟥', title: 'Jugador suspendido', body: 'L. García suspendido 1 partido', time: 'ayer', color: 'red' },
  ],
  admin: [
    { id: 1, icon: '👤', title: 'Nuevo usuario registrado', body: 'Se registró: carlos@escuelaing.edu.co', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '🔑', title: 'Solicitud de rol', body: 'Pedro R. solicita rol de Capitán', time: '1h', color: 'blue', unread: true },
    { id: 3, icon: '⚠️', title: 'Pago rechazado', body: 'Equipo "BYTES FC" tiene pago pendiente', time: '3h', color: 'orange' },
    { id: 4, icon: '📋', title: 'Reporte de árbitro', body: 'Nuevo reporte enviado por J. Ramírez', time: 'ayer', color: 'red' },
  ],
  coordinador: [
    { id: 1, icon: '💰', title: 'Pago pendiente', body: 'BYTES FC aún no ha confirmado pago', time: 'Ahora', color: 'orange', unread: true },
    { id: 2, icon: '🛡️', title: 'Equipo inscrito', body: 'NULL PTR FC se inscribió al torneo', time: '2h', color: 'green' },
    { id: 3, icon: '📅', title: 'Conflicto de horario', body: 'Cancha A tiene doble asignación el 20 Mar', time: '5h', color: 'red' },
    { id: 4, icon: '📋', title: 'Torneo actualizado', body: 'Llaves de cuartos de final generadas', time: 'ayer', color: 'blue' },
  ],
  arbitro: [
    { id: 1, icon: '📋', title: 'Nuevo partido asignado', body: 'FC KERNEL vs LOS DEBUGGERS · 18 Mar 3PM', time: 'Ahora', color: 'green', unread: true },
    { id: 2, icon: '📝', title: 'Reporte pendiente', body: 'Envía el acta del partido del 15 Mar', time: '2h', color: 'orange', unread: true },
    { id: 3, icon: '🔄', title: 'Cambio de horario', body: 'Partido 17 Mar movido a las 4:00 PM', time: 'ayer', color: 'blue' },
    { id: 4, icon: '✅', title: 'Acta aprobada', body: 'Acta del partido del 12 Mar fue aceptada', time: 'hace 2d', color: 'green' },
  ],
};

const DOT_COLOR: Record<Notification['color'], string> = {
  green: '#16a34a', blue: '#3b82f6', orange: '#f59e0b', red: '#ef4444',
};

const MI_EQUIPO_ITEMS = [
  { label: 'Mi perfil deportivo', to: '/profile' },
  { label: 'Mi equipo', to: '/my-team' },
  { label: 'Alineación', to: '/alineacion' },
  { label: 'Buscar jugadores', to: '/search-players' },
  { label: 'Inscripción & Pago', to: '/payment' },
  { label: 'Crear equipo', to: '/teams/create' },
];

const PARTIDOS_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Calendario', to: '/calendar' },
  { label: 'Resultados', to: '/results' },
  { label: 'Tabla de posiciones', to: '/tabla' },
  { label: 'Estadísticas', to: '/estadisticas' },
  { label: 'Llaves eliminatorias', to: '/llaves' },
  { label: 'Torneos', to: '/torneos' },
];

const ADMIN_ITEMS: Record<string, { label: string; to: string }[]> = {
  admin: [
    { label: 'Gestión de roles', to: '/admin/roles' },
    { label: 'Mi perfil', to: '/profile/admin' },
  ],
  coordinador: [
    { label: 'Configurar torneo', to: '/organizer/config' },
    { label: 'Gestión de pagos', to: '/organizer/payments' },
    { label: 'Mi perfil', to: '/profile/coordinador' },
  ],
  arbitro: [
    { label: 'Panel árbitro', to: '/arbitro' },
    { label: 'Mi perfil', to: '/profile/arbitro' },
  ],
};

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

export const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar, isAdmin, userRole }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const role = userRole ?? 'jugador';
  const NOTIFICATIONS = NOTIFICATIONS_BY_ROLE[role] ?? NOTIFICATIONS_BY_ROLE.jugador;
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
          <button className={styles.logoBtn} onClick={() => navigate('/dashboard')} aria-label="Ir al Dashboard">
            <Logo variant="small" showText />
          </button>
        </div>

        <div className={styles.navLinks}>
          <NavDropdown label="Mi Equipo" items={MI_EQUIPO_ITEMS} />
          <NavDropdown label="Partidos" items={PARTIDOS_ITEMS} />
          {isAdmin && userRole && ADMIN_ITEMS[userRole] && (
            <NavDropdown
              label={userRole === 'admin' ? 'Administrador' : userRole === 'coordinador' ? 'Organizador' : 'Árbitro'}
              items={ADMIN_ITEMS[userRole]}
            />
          )}
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
