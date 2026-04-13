import React from 'react';
import { MainLayout } from '@components/layout';
import styles from './ArbitroPage.module.css';

const matches = [
  { id: 1, local: 'FC KERNEL', visitante: 'LOS DEBUGGERS', fecha: '18 Mar', hora: '3:00 PM', cancha: 'Cancha 2' },
  { id: 2, local: 'NULL PTR FC', visitante: 'STACK OVERFLOW', fecha: '18 Mar', hora: '5:00 PM', cancha: 'Cancha 1' },
  { id: 3, local: 'SEGFAULT SC', visitante: 'FC KERNEL II', fecha: '20 Mar', hora: '4:00 PM', cancha: 'Cancha 3' },
];

export const ArbitroPage: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <span className={styles.emoji}>🟨</span>
          <div>
            <h1 className={styles.title}>Panel del Árbitro</h1>
            <p className={styles.sub}>RF10 · RF15 --- Mis partidos asignados</p>
          </div>
        </div>

        <div className={styles.infoBanner}>
          <span className={styles.infoIcon}>ⓘ</span>
          Tienes 3 partidos asignados para el 2026-1. Confirma tu asistencia.
        </div>

        <div className={styles.grid}>
          {matches.map(m => (
            <div key={m.id} className={styles.card}>
              <span className={styles.badge}>Próximo</span>
              <div className={styles.teams}>
                <span className={styles.team}>{m.local}</span>
                <span className={styles.vs}>vs</span>
                <span className={styles.team}>{m.visitante}</span>
              </div>
              <div className={styles.meta}>
                <span>📅 {m.fecha} · {m.hora}</span>
                <span>📍 {m.cancha}</span>
              </div>
              <button className={styles.detailBtn}>Ver detalles del partido</button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
