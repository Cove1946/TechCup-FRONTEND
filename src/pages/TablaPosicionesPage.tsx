import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './TablaPosicionesPage.module.css';

interface Equipo {
  pos: number;
  nombre: string;
  initials: string;
  color: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  pts: number;
}

const EQUIPOS: Equipo[] = [
  { pos: 1, nombre: 'FC KERNEL',      initials: 'FCK', color: '#15803d', pj: 6, pg: 5, pe: 0, pp: 1, gf: 14, gc: 6,  pts: 15 },
  { pos: 2, nombre: 'LOS DEBUGGERS',  initials: 'DBG', color: '#1e3a8a', pj: 6, pg: 4, pe: 0, pp: 2, gf: 11, gc: 9,  pts: 12 },
  { pos: 3, nombre: 'STACK OVERFLOW', initials: 'SOF', color: '#dc2626', pj: 6, pg: 3, pe: 2, pp: 1, gf: 10, gc: 8,  pts: 11 },
  { pos: 4, nombre: 'BYTE FORCE',     initials: 'BTF', color: '#7c3aed', pj: 6, pg: 3, pe: 1, pp: 2, gf: 9,  gc: 9,  pts: 10 },
  { pos: 5, nombre: 'NULL POINTERS',  initials: 'NLP', color: '#d97706', pj: 6, pg: 2, pe: 2, pp: 2, gf: 7,  gc: 10, pts: 8  },
  { pos: 6, nombre: 'RUNTIME ERROR',  initials: 'RTE', color: '#0f766e', pj: 6, pg: 2, pe: 1, pp: 3, gf: 6,  gc: 11, pts: 7  },
  { pos: 7, nombre: 'GIT PUSH FORCE', initials: 'GPF', color: '#4b5563', pj: 6, pg: 1, pe: 2, pp: 3, gf: 5,  gc: 9,  pts: 5  },
  { pos: 8, nombre: '404 NOT FOUND',  initials: '404', color: '#6b7280', pj: 6, pg: 0, pe: 2, pp: 4, gf: 3,  gc: 13, pts: 2  },
];

export const TablaPosicionesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Temporada 2026-1</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Tabla de Posiciones</h1>
          <button className={styles.btnOutline} onClick={() => navigate('/estadisticas')}>📈 Estadísticas</button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Equipo</th>
                <th title="Partidos jugados">PJ</th>
                <th title="Partidos ganados">PG</th>
                <th title="Partidos empatados">PE</th>
                <th title="Partidos perdidos">PP</th>
                <th title="Goles a favor">GF</th>
                <th title="Goles en contra">GC</th>
                <th title="Diferencia de goles">DG</th>
                <th title="Puntos">PTS</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPOS.map((e, idx) => {
                const dg = e.gf - e.gc;
                const isTop4 = idx < 4;
                return (
                  <tr key={e.nombre} className={isTop4 ? styles.topRow : ''}>
                    <td className={styles.posCell}>
                      {idx < 4 ? (
                        <span className={styles.posBadge} style={{ background: e.color }}>{e.pos}</span>
                      ) : e.pos}
                    </td>
                    <td>
                      <div className={styles.teamCell}>
                        <div className={styles.teamCircle} style={{ background: e.color }}>{e.initials}</div>
                        <span className={styles.teamName}>{e.nombre}</span>
                      </div>
                    </td>
                    <td className={styles.numCell}>{e.pj}</td>
                    <td className={styles.numCell}>{e.pg}</td>
                    <td className={styles.numCell}>{e.pe}</td>
                    <td className={styles.numCell}>{e.pp}</td>
                    <td className={styles.numCell}>{e.gf}</td>
                    <td className={styles.numCell}>{e.gc}</td>
                    <td className={`${styles.numCell} ${dg > 0 ? styles.pos : dg < 0 ? styles.neg : ''}`}>
                      {dg > 0 ? `+${dg}` : dg}
                    </td>
                    <td className={styles.ptsCell}>{e.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: '#15803d' }} />Clasifican a cuartos de final</div>
        </div>
      </div>
    </MainLayout>
  );
};
