import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './EstadisticasPage.module.css';

const STATS_TOP = [
  { icon: '⚽', color: '#16a34a', num: 47, label: 'Total goles', sub: 'goles en 12 partidos' },
  { icon: '🟨', color: '#d97706', num: 14, label: 'Tarjetas amarillas', sub: '' },
  { icon: '🟥', color: '#dc2626', num: 2, label: 'Tarjetas rojas', sub: '' },
  { icon: '👥', color: '#16a34a', num: 8, label: 'Equipos activos', sub: '' },
  { icon: '📅', color: '#16a34a', num: 16, label: 'Partidos restantes', sub: '' },
];

const GOLEADORES = [
  { rank: 1, name: 'Carlos Pérez', team: 'FC KERNEL', goles: 7, partidos: 5 },
  { rank: 2, name: 'Carlos Pérez', team: 'FC KERNEL', goles: 7, partidos: 5 },
  { rank: 3, name: 'Carlos Pérez', team: 'FC KERNEL', goles: 7, partidos: 5 },
  { rank: 4, name: 'Carlos Pérez', team: 'FC KERNEL', goles: 7, partidos: 5 },
  { rank: 5, name: 'Carlos Pérez', team: 'FC KERNEL', goles: 7, partidos: 5 },
];

const GOLES_EQUIPO = [
  { team: 'FC KERNEL', goles: 47 },
  { team: 'FC KERNEL', goles: 12 },
  { team: 'DEBUGGERS', goles: 4 },
  { team: 'FC KERNEL', goles: 4 },
  { team: 'DEBUGGERS', goles: 3 },
  { team: 'FC KERNEL', goles: 3 },
  { team: 'DEBUGGERS', goles: 3 },
  { team: 'FC KERNEL', goles: 1 },
  { team: 'FC KERNEL', goles: 1 },
];

const MAX_GOLES = 47;

const MEJORES = [
  { match: 'LOS DEBUGGERS 7 – 6 SEGFAULT FC', date: 'Mar 8, 2026' },
  { match: 'RUNTIME ERRORS 6 – 5 NULL POINTERS', date: 'Mar 5, 2026' },
  { match: 'STACK OVERFLOW 5 – 4 FC KERNEL', date: 'Feb 28, 2026' },
  { match: 'BINARY BOYS 8 – 7 EXCEPTION FC', date: 'Feb 20, 2026' },
];

export const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Estadísticas del Torneo</h1>
            <p className={styles.sub}>RF13 · RF14 — Datos en tiempo real</p>
          </div>
          <span className={styles.badge}>2026-1 · Activo</span>
        </div>

        {/* Top stats */}
        <div className={styles.statsRow}>
          {STATS_TOP.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statNum} style={{ color: s.color }}>{s.num}</div>
              {s.sub && <div className={styles.statSub}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className={styles.cols}>
          {/* Goleadores */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Ranking de Goleadores</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Goles</th>
                  <th>Partidos</th>
                </tr>
              </thead>
              <tbody>
                {GOLEADORES.map((g, i) => (
                  <tr key={i}>
                    <td>
                      <div className={styles.goleadorCell}>
                        <span className={styles.goleadorRank}>{g.rank}</span>
                        <div className={styles.goleadorAvatar} />
                        <div>
                          <div className={styles.goleadorName}>{g.name}</div>
                          <div className={styles.goleadorTeam}>{g.team}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.goleadorNum}>{g.goles}</div>
                      <div className={styles.goleadorSub}>Goles</div>
                    </td>
                    <td>
                      <div className={styles.goleadorNum}>{g.partidos}</div>
                      <div className={styles.goleadorSub}>Partidos</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Goles por equipo */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Goles por Equipo</div>
            <div className={styles.bars}>
              {GOLES_EQUIPO.map((e, i) => (
                <div key={i} className={styles.barRow}>
                  <span className={styles.barTeam}>{e.team}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${(e.goles / MAX_GOLES) * 100}%` }}
                    />
                    <span className={styles.barNum}>{e.goles}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mejores partidos */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Mejores partidos del torneo</div>
          <div className={styles.mejoresList}>
            {MEJORES.map((m, i) => (
              <div key={i} className={styles.mejorRow}>
                <div>
                  <div className={styles.mejorMatch}>{m.match}</div>
                  <div className={styles.mejorDate}>{m.date}</div>
                </div>
                <span className={styles.mejorDot} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
