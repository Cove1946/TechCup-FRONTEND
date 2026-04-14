import React from 'react';
import { MainLayout } from '@components/layout';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

// ─── Data per role ────────────────────────────────────────────────────────────
const MATCHES = [
  { home: 'FC KERNEL', away: 'LOS DEBUGGERS', date: '18 Mar', time: '3:00 PM', cancha: 'Cancha B' },
  { home: 'NULL PTR FC', away: 'STACK OVERFLOW', date: '18 Mar', time: '5:00 PM', cancha: 'Cancha A' },
  { home: 'RECURSION UTD', away: 'BINARY WAR', date: '19 Mar', time: '4:00 PM', cancha: 'Cancha A' },
];

// Stats cards for each role
const STATS_BY_ROLE: Record<string, { label: string; value: string; sub: string; icon: string }[]> = {
  jugador: [
    { label: 'Partidos jugados', value: '12', sub: 'de 28 programados', icon: '⚽' },
    { label: 'Goles totales', value: '47', sub: 'en el torneo', icon: '🥅' },
    { label: 'Tarjetas amarillas', value: '8', sub: 'acumuladas', icon: '🟨' },
  ],
  capitan: [
    { label: 'Partidos jugados', value: '12', sub: 'de 28 programados', icon: '⚽' },
    { label: 'Jugadores en plantilla', value: '16', sub: 'registrados en FC KERNEL', icon: '👥' },
    { label: 'Tarjetas del equipo', value: '8', sub: 'amarillas acumuladas', icon: '🟨' },
  ],
  admin: [
    { label: 'Usuarios registrados', value: '248', sub: 'en la plataforma', icon: '👤' },
    { label: 'Equipos activos', value: '16', sub: 'en TechCup 2026-1', icon: '🛡️' },
    { label: 'Solicitudes pendientes', value: '5', sub: 'de roles y accesos', icon: '📋' },
  ],
  coordinador: [
    { label: 'Equipos inscritos', value: '16', sub: 'de 16 cupos totales', icon: '🛡️' },
    { label: 'Pagos pendientes', value: '4', sub: 'por confirmar', icon: '💰' },
    { label: 'Partidos programados', value: '28', sub: 'en el calendario', icon: '📅' },
  ],
  arbitro: [
    { label: 'Partidos asignados', value: '6', sub: 'esta temporada', icon: '📋' },
    { label: 'Próximo partido', value: 'Hoy', sub: '3:00 PM · Cancha B', icon: '⚽' },
    { label: 'Reportes pendientes', value: '1', sub: 'por enviar', icon: '📝' },
  ],
};

// Quick-action buttons per role
type Action = { label: string; route: string; primary?: boolean };
const ACTIONS_BY_ROLE: Record<string, Action[]> = {
  jugador: [
    { label: 'Mi Equipo', route: '/my-team', primary: true },
    { label: 'Alineación', route: '/alineacion' },
    { label: 'Calendario', route: '/calendar' },
  ],
  capitan: [
    { label: 'Mi Equipo', route: '/my-team', primary: true },
    { label: 'Alineación', route: '/alineacion' },
    { label: 'Crear Equipo +', route: '/teams/create' },
  ],
  admin: [
    { label: 'Gestión de roles', route: '/admin/roles', primary: true },
    { label: 'Ver equipos', route: '/teams' },
    { label: 'Torneos', route: '/torneos' },
  ],
  coordinador: [
    { label: 'Config. torneo', route: '/organizer/config', primary: true },
    { label: 'Pagos', route: '/organizer/payments' },
    { label: 'Calendario', route: '/calendar' },
  ],
  arbitro: [
    { label: 'Panel árbitro', route: '/arbitro', primary: true },
    { label: 'Calendario', route: '/calendar' },
    { label: 'Mi perfil', route: '/profile/arbitro' },
  ],
};

// Role display names
const ROLE_LABEL: Record<string, string> = {
  jugador: 'Jugador',
  capitan: 'Capitán',
  admin: 'Administrador',
  coordinador: 'Coordinador',
  arbitro: 'Árbitro',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Usuario', role: 'jugador' };
  const role: string = user.role ?? 'jugador';

  const stats   = STATS_BY_ROLE[role]   ?? STATS_BY_ROLE.jugador;
  const actions = ACTIONS_BY_ROLE[role] ?? ACTIONS_BY_ROLE.jugador;

  // Team/context line per role
  const contextLine: Record<string, string> = {
    jugador:     `Jugador · FC KERNEL · TechCup 2026-1 · Semana 3`,
    capitan:     `Capitán · FC KERNEL · TechCup 2026-1 · Semana 3`,
    admin:       `Administrador del sistema · TechCup 2026-1`,
    coordinador: `Coordinador del torneo · TechCup 2026-1`,
    arbitro:     `Árbitro certificado · TechCup 2026-1`,
  };

  return (
    <MainLayout>
      <div className={styles.dashboard}>

        {/* ── Banner de bienvenida ── */}
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <p className={styles.bannerGreet}>👋 Bienvenido de regreso</p>
            <h1 className={styles.bannerName}>{user.name}</h1>
            <p className={styles.bannerInfo}>{contextLine[role] ?? contextLine.jugador}</p>
            <div className={styles.bannerActions}>
              {actions.map(a => (
                <button
                  key={a.route}
                  className={a.primary ? styles.bannerBtn : styles.bannerBtnOutline}
                  onClick={() => navigate(a.route)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.bannerBadge}>
            <div className={styles.shield}>
              <span className={styles.shieldEmoji}>🛡️</span>
              <span className={styles.shieldScore}>{ROLE_LABEL[role] ?? 'Usuario'}</span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className={styles.statsRow}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <div>
                  <p className={styles.statLabel}>{s.label}</p>
                  <p className={styles.statValue}>{s.value}</p>
                  <p className={styles.statSub}>{s.sub}</p>
                </div>
                <span className={styles.statIcon}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Próximos Partidos (all roles see upcoming matches) ── */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>
              <span>📅</span>
              <span>Próximos Partidos</span>
            </div>
            <button className={styles.seeAll} onClick={() => navigate('/calendar')}>
              Ver todos →
            </button>
          </div>

          <div className={styles.matchList}>
            {MATCHES.map((m, i) => (
              <div key={i} className={styles.matchRow}>
                <span className={styles.matchHome}>{m.home}</span>
                <span className={styles.matchVs}>VS</span>
                <span className={styles.matchAway}>{m.away}</span>
                <div className={styles.matchMeta}>
                  <span className={styles.matchDate}>📅 {m.date}</span>
                  <span className={styles.matchTime}>🕒 {m.time}</span>
                  <span className={styles.canchaTag}>🏟 {m.cancha}</span>
                </div>
              </div>
            ))}
          </div>

          {role === 'arbitro' ? (
            <div className={styles.arbitroBox}>
              ℹ️ Tienes <strong>1 reporte</strong> pendiente de envío para el partido del 18 Mar.
            </div>
          ) : role === 'admin' || role === 'coordinador' ? (
            <div className={styles.arbitroBox}>
              ℹ️ Árbitros asignados: <strong>José Ramírez</strong> y <strong>María López</strong> para los próximos partidos.
            </div>
          ) : (
            <div className={styles.arbitroBox}>
              ℹ️ Tu árbitro asignado: <strong>José Ramírez</strong>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};
