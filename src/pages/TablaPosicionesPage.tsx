import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './TablaPosicionesPage.module.css';

// 1-2 = semi (green), 3-4 = grupos (yellow), 5-8 = no clasifican (gray)
const TABLA = [
  { pos: 1, team: 'FC KERNEL',      pj: 12, pg: 9, pe: 2, pp: 1, gf: 35, gc: 10, pts: 29, zone: 'semi' },
  { pos: 2, team: 'LOS DEBUGGERS', pj: 12, pg: 8, pe: 3, pp: 1, gf: 30, gc: 12, pts: 27, zone: 'semi' },
  { pos: 3, team: 'NULL PTR FC',   pj: 12, pg: 7, pe: 2, pp: 3, gf: 25, gc: 15, pts: 23, zone: 'grupos' },
  { pos: 4, team: 'STACK OVERFLOW',pj: 12, pg: 6, pe: 3, pp: 3, gf: 20, gc: 18, pts: 21, zone: 'grupos' },
  { pos: 5, team: 'SEGFAULT FC',   pj: 12, pg: 5, pe: 3, pp: 4, gf: 22, gc: 19, pts: 18, zone: 'none' },
  { pos: 6, team: 'RUNTIME ERRORS',pj: 12, pg: 4, pe: 2, pp: 6, gf: 18, gc: 24, pts: 14, zone: 'none' },
  { pos: 7, team: 'BINARY BOYS',   pj: 12, pg: 2, pe: 4, pp: 6, gf: 15, gc: 25, pts: 10, zone: 'none' },
  { pos: 8, team: 'EXCEPTION FC',  pj: 12, pg: 1, pe: 3, pp: 8, gf: 10, gc: 28, pts:  6, zone: 'none' },
];

const GOLEADORES = [
  { rank: 1, name: 'Carlos Pérez',   team: 'FC KERNEL',     goles: 15 },
  { rank: 2, name: 'Juan García',    team: 'LOS DEBUGGERS', goles: 12 },
  { rank: 3, name: 'David López',    team: 'NULL PTR FC',   goles: 10 },
  { rank: 4, name: 'Andrés Torres',  team: 'STACK OVERFLOW',goles:  9 },
];

export const TablaPosicionesPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Tabla de Posiciones</h1>
            <div className={styles.subRow}>
              <span className={styles.sub}>RF11 · Actualización en tiempo real</span>
              <span className={styles.badge}>2026-1 · Activo</span>
            </div>
          </div>
        </div>

        <div className={styles.cols}>
          {/* Left: tabla */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Tabla de Posiciones</div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className={styles.teamTh}>Equipo</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLA.map(t => (
                    <tr key={t.pos} className={
                      t.zone === 'semi' ? styles.rowSemi :
                      t.zone === 'grupos' ? styles.rowGrupos : ''
                    }>
                      <td className={styles.posCell}>
                        <div className={styles.posIndicator + ' ' + (
                          t.zone === 'semi' ? styles.dotGreen :
                          t.zone === 'grupos' ? styles.dotYellow :
                          styles.dotGray
                        )} />
                        {t.pos}
                      </td>
                      <td>
                        <div className={styles.teamCell}>
                          <div className={styles.teamAvatar} />
                          {t.team}
                        </div>
                      </td>
                      <td>{t.pj}</td>
                      <td>{t.pg}</td>
                      <td>{t.pe}</td>
                      <td>{t.pp}</td>
                      <td>{t.gf}</td>
                      <td>{t.gc}</td>
                      <td className={styles.ptsCell}>{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot + ' ' + styles.dotGreen} />
                Clasifican a Semifinales
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot + ' ' + styles.dotYellow} />
                Fase de Grupos
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot + ' ' + styles.dotGray} />
                No clasifican
              </div>
            </div>
          </div>

          {/* Right: goleadores */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>⚽ Tabla de Goleadores</div>
            <div className={styles.goleadoresList}>
              {GOLEADORES.map(g => (
                <div key={g.rank} className={styles.goleadorRow}>
                  <span className={styles.goleadorRank}>{g.rank}</span>
                  <div className={styles.goleadorAvatar} />
                  <div className={styles.goleadorInfo}>
                    <div className={styles.goleadorName}>{g.name}</div>
                    <div className={styles.goleadorTeam}>{g.team}</div>
                  </div>
                  <div className={styles.goleadorGoles}>
                    <span className={styles.goleadorNum}>{g.goles}</span>
                    <span className={styles.goleadorSub}>Goles</span>
                  </div>
                </div>
              ))}
              <div className={styles.moreDots}>...</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
