import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '@assets/Logo.png';
import styles from './WelcomePage.module.css';

const STANDINGS = [
  { pos: 1, name: 'FC KERNEL', pts: 13, active: true },
  { pos: 2, name: 'LOS DEBUGGERS', pts: 10, active: true },
  { pos: 3, name: 'NULL PTR FC', pts: 8, active: false },
  { pos: 4, name: 'STACK OVERFLOW', pts: 7, active: false },
];

const MATCHES = [
  { date: '18 Mar', time: '3:00 PM', home: 'FC KERNEL', away: 'LOS DEBUGGERS', cancha: 'Cancha 2' },
  { date: '18 Mar', time: '5:00 PM', home: 'NULL PTR FC', away: 'STACK OVERFLOW', cancha: 'Cancha 1' },
];

const STATS = [
  { value: '8', label: 'Equipos' },
  { value: '86', label: 'Jugadores' },
  { value: '28', label: 'Partidos' },
  { value: '4', label: 'Programas académicos' },
];

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* ── Navbar público ── */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <img src={logoImage} alt="TechCup" className={styles.navLogo} />
          <span className={styles.navName}>TechCup <span className={styles.navGreen}>Fútbol</span></span>
        </div>
        <div className={styles.navActions}>
          <button className={styles.btnOutline} onClick={() => navigate('/login')}>Iniciar sesión</button>
          <button className={styles.btnGreen} onClick={() => navigate('/register')}>🚀 Registrarse</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroBadge}>🏫 Escuela Colombiana de Ingeniería Julio Garavito · 2026-1</span>
          <h1 className={styles.heroTitle}>
            El torneo semestral<br />
            <span className={styles.heroGreen}>ahora es digital</span>
          </h1>
          <p className={styles.heroSub}>
            Inscríbete, forma tu equipo, sube tu pago y sigue cada resultado en tiempo real. Adiós a WhatsApp y hojas de cálculo.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/register')}>
              🚀 Registrarme gratis
            </button>
            <button className={styles.ctaOutline} onClick={() => navigate('/tournament/1')}>
              Ver el torneo →
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.matchesCard}>
            <div className={styles.matchesHeader}>
              <span>📅</span>
              <span className={styles.matchesTitle}>Próximos Partidos</span>
            </div>
            {MATCHES.map((m, i) => (
              <div key={i} className={styles.matchCard}>
                <div className={styles.matchMeta}>
                  <span className={styles.matchDate}>📅 {m.date}</span>
                  <span className={styles.matchTime}>🕒 {m.time}</span>
                </div>
                <div className={styles.matchTeams}>
                  <span className={styles.matchTeam}>{m.home}</span>
                  <span className={styles.matchVs}>vs</span>
                  <span className={styles.matchTeam}>{m.away}</span>
                </div>
                <span className={styles.canchaTag}>🏟 {m.cancha}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className={styles.statsBar}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Tabla de posiciones ── */}
      <section className={styles.tableSection}>
        <div className={styles.tableSectionInner}>
          <h2 className={styles.tableTitle}>🏆 Tabla de Posiciones</h2>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span className={styles.colPos}>#</span>
              <span className={styles.colTeam}>Equipo</span>
              <span className={styles.colPts}>Pts</span>
            </div>
            {STANDINGS.map(row => (
              <div key={row.pos} className={styles.tableRow}>
                <span className={`${styles.posCircle} ${row.pos <= 2 ? styles.posTop : ''}`}>
                  {row.pos}
                </span>
                <div className={styles.teamNameRow}>
                  <span className={`${styles.dot} ${row.active ? styles.dotActive : styles.dotInactive}`} />
                  <span className={styles.teamName}>{row.name}</span>
                </div>
                <span className={`${styles.pts} ${row.pos <= 2 ? styles.ptsTop : ''}`}>{row.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
