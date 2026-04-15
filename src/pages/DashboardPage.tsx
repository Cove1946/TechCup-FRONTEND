import React from 'react';
import { MainLayout } from '@components/layout';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

const STATS = [
  { label: 'Partidos jugados', value: '12', sub: 'de 28 programados', icon: '⚽' },
  { label: 'Goles totales',    value: '47', sub: 'en el torneo',       icon: '🥅' },
  { label: 'Tarjetas amarillas', value: '8', sub: 'acumuladas',        icon: '🟨' },
];

const MATCHES = [
  { home: 'FC KERNEL',     away: 'LOS DEBUGGERS',  date: '18 Mar', time: '3:00 PM', cancha: 'Cancha B' },
  { home: 'NULL PTR FC',   away: 'STACK OVERFLOW', date: '18 Mar', time: '5:00 PM', cancha: 'Cancha A' },
  { home: 'RECURSION UTD', away: 'BINARY WAR',     date: '19 Mar', time: '4:00 PM', cancha: 'Cancha A' },
];

const BANNER_ACTIONS: Record<string, { label: string; to: string; outline?: boolean }[]> = {
  jugador:     [{ label: 'Mi Equipo', to: '/my-team' }],
  capitan:     [{ label: 'Mi Equipo', to: '/my-team' }, { label: 'Alineación', to: '/alineacion', outline: true }, { label: 'Crear Equipo +', to: '/teams/create', outline: true }],
  coordinador: [{ label: 'Ver Torneos', to: '/torneos' }, { label: 'Gestión de Pagos', to: '/organizer/payments', outline: true }, { label: 'Configurar Torneo', to: '/organizer/config', outline: true }],
  arbitro:     [{ label: 'Panel Árbitro', to: '/arbitro' }, { label: 'Ver Calendario', to: '/calendar', outline: true }],
  admin:       [{ label: 'Gestión de Pagos', to: '/organizer/payments' }, { label: 'Gestión de Roles', to: '/admin/roles', outline: true }, { label: 'Configurar Torneo', to: '/organizer/config', outline: true }],
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user    = userStr ? JSON.parse(userStr) : { name: 'Usuario', role: 'jugador' };
  const role    = (user.role ?? 'jugador').toLowerCase();
  const actions = BANNER_ACTIONS[role] ?? BANNER_ACTIONS['jugador'];

  return (
    <MainLayout>
      <div className={styles.dashboard}>

        {/* ── Banner ── */}
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <p className={styles.bannerGreet}>👋 Bienvenido de regreso</p>
            <h1 className={styles.bannerName}>{user.name}</h1>
            <p className={styles.bannerInfo}>{user.role ?? 'Jugador'} · FC KERNEL · 2026-1 · Semana 3</p>
            <div className={styles.bannerActions}>
              {actions.map(a => (
                <button
                  key={a.to}
                  className={a.outline ? styles.bannerBtnOutline : styles.bannerBtn}
                  onClick={() => navigate(a.to)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.bannerBadge}>
            <div className={styles.shield}>
              <span className={styles.shieldEmoji}>🛡️</span>
              <span className={styles.shieldScore}>9/12</span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className={styles.statsRow}>
          {STATS.map(s => (
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

        {/* ── Próximos Partidos ── */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}><span>📅</span><span>Próximos Partidos</span></div>
            <button className={styles.seeAll} onClick={() => navigate('/calendar')}>Ver todos →</button>
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
          <div className={styles.arbitroBox}>
            ℹ️ Tu árbitro asignado: <strong>José Ramírez</strong>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};
