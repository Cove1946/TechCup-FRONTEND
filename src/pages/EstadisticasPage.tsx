import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './EstadisticasPage.module.css';

interface Jugador {
  pos: number;
  name: string;
  equipo: string;
  initials: string;
  color: string;
  goles: number;
  asistencias: number;
  partidos: number;
  tarjAm: number;
  tarjRoj: number;
}

const JUGADORES: Jugador[] = [
  { pos: 1,  name: 'Carlos M.',    equipo: 'FC KERNEL',      initials: 'CM', color: '#78350f', goles: 8,  asistencias: 3, partidos: 6, tarjAm: 1, tarjRoj: 0 },
  { pos: 2,  name: 'Santiago M.',  equipo: 'LOS DEBUGGERS',  initials: 'SM', color: '#1e3a8a', goles: 7,  asistencias: 5, partidos: 6, tarjAm: 0, tarjRoj: 0 },
  { pos: 3,  name: 'Andrés T.',    equipo: 'FC KERNEL',      initials: 'AT', color: '#0f766e', goles: 5,  asistencias: 4, partidos: 6, tarjAm: 2, tarjRoj: 0 },
  { pos: 4,  name: 'Felipe P.',    equipo: 'LOS DEBUGGERS',  initials: 'FP', color: '#1e40af', goles: 5,  asistencias: 2, partidos: 5, tarjAm: 1, tarjRoj: 0 },
  { pos: 5,  name: 'Diego R.',     equipo: 'STACK OVERFLOW', initials: 'DR', color: '#dc2626', goles: 4,  asistencias: 6, partidos: 6, tarjAm: 0, tarjRoj: 0 },
  { pos: 6,  name: 'Luis D.',      equipo: 'FC KERNEL',      initials: 'LD', color: '#1e3a8a', goles: 3,  asistencias: 5, partidos: 6, tarjAm: 1, tarjRoj: 1 },
  { pos: 7,  name: 'Pablo H.',     equipo: 'FC KERNEL',      initials: 'PH', color: '#4b5563', goles: 3,  asistencias: 2, partidos: 5, tarjAm: 0, tarjRoj: 0 },
  { pos: 8,  name: 'José C.',      equipo: 'LOS DEBUGGERS',  initials: 'JC', color: '#6d28d9', goles: 2,  asistencias: 4, partidos: 6, tarjAm: 3, tarjRoj: 0 },
];

type SortKey = 'goles' | 'asistencias' | 'partidos';

export const EstadisticasPage: React.FC = () => {
  const navigate  = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>('goles');

  const sorted = [...JUGADORES].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Temporada 2026-1</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Estadísticas</h1>
          <div className={styles.sortBtns}>
            {(['goles', 'asistencias', 'partidos'] as SortKey[]).map(k => (
              <button key={k} className={sortBy === k ? styles.sortBtnActive : styles.sortBtn}
                onClick={() => setSortBy(k)}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNum}>6</span>
            <span className={styles.summaryLbl}>Jornadas jugadas</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNum}>8</span>
            <span className={styles.summaryLbl}>Equipos</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNum}>37</span>
            <span className={styles.summaryLbl}>Goles totales</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryNum}>31</span>
            <span className={styles.summaryLbl}>Asistencias totales</span>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th className={sortBy === 'goles' ? styles.thActive : ''}>⚽ Goles</th>
                <th className={sortBy === 'asistencias' ? styles.thActive : ''}>🎯 Asistencias</th>
                <th className={sortBy === 'partidos' ? styles.thActive : ''}>🕐 Partidos</th>
                <th>🟡</th>
                <th>🔴</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((j, idx) => (
                <tr key={j.name} className={idx === 0 ? styles.topRow : ''}>
                  <td className={styles.posCell}>
                    {idx === 0 ? <span className={styles.goldBadge}>1</span> : idx + 1}
                  </td>
                  <td>
                    <div className={styles.playerCell}>
                      <div className={styles.avatar} style={{ background: j.color }}>{j.initials}</div>
                      <span className={styles.playerName}>{j.name}</span>
                    </div>
                  </td>
                  <td className={styles.equipoCell}>{j.equipo}</td>
                  <td className={`${styles.statCell} ${sortBy === 'goles' ? styles.statCellActive : ''}`}>{j.goles}</td>
                  <td className={`${styles.statCell} ${sortBy === 'asistencias' ? styles.statCellActive : ''}`}>{j.asistencias}</td>
                  <td className={`${styles.statCell} ${sortBy === 'partidos' ? styles.statCellActive : ''}`}>{j.partidos}</td>
                  <td className={styles.cardCell}>{j.tarjAm > 0 && <span className={styles.yellowCard}>{j.tarjAm}</span>}</td>
                  <td className={styles.cardCell}>{j.tarjRoj > 0 && <span className={styles.redCard}>{j.tarjRoj}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};
