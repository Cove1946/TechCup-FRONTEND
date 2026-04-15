import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './EstadisticasPage.module.css';

interface Jugador {
  pos: number; name: string; equipo: string; initials: string; color: string;
  goles: number; partidos: number; tarjAm: number; tarjRoj: number;
}

const JUGADORES: Jugador[] = [
  { pos: 1, name: 'Carlos M.',   equipo: 'FC KERNEL',      initials: 'CM', color: '#78350f', goles: 8, partidos: 6, tarjAm: 1, tarjRoj: 0 },
  { pos: 2, name: 'Santiago M.', equipo: 'LOS DEBUGGERS',  initials: 'SM', color: '#1e3a8a', goles: 7, partidos: 6, tarjAm: 0, tarjRoj: 0 },
  { pos: 3, name: 'Andrés T.',   equipo: 'FC KERNEL',      initials: 'AT', color: '#0f766e', goles: 5, partidos: 6, tarjAm: 2, tarjRoj: 0 },
  { pos: 4, name: 'Felipe P.',   equipo: 'LOS DEBUGGERS',  initials: 'FP', color: '#1e40af', goles: 5, partidos: 5, tarjAm: 1, tarjRoj: 0 },
  { pos: 5, name: 'Diego R.',    equipo: 'STACK OVERFLOW', initials: 'DR', color: '#dc2626', goles: 4, partidos: 6, tarjAm: 0, tarjRoj: 0 },
  { pos: 6, name: 'Luis D.',     equipo: 'FC KERNEL',      initials: 'LD', color: '#1e3a8a', goles: 3, partidos: 6, tarjAm: 1, tarjRoj: 1 },
  { pos: 7, name: 'Pablo H.',    equipo: 'FC KERNEL',      initials: 'PH', color: '#4b5563', goles: 3, partidos: 5, tarjAm: 0, tarjRoj: 0 },
  { pos: 8, name: 'José C.',     equipo: 'LOS DEBUGGERS',  initials: 'JC', color: '#6d28d9', goles: 2, partidos: 6, tarjAm: 3, tarjRoj: 0 },
];

type SortKey = 'goles' | 'partidos';

export const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>('goles');
  const [selected, setSelected] = useState<Jugador | null>(null);

  const sorted = [...JUGADORES].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Temporada 2026-1</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Estadísticas</h1>
          <div className={styles.sortBtns}>
            {(['goles', 'partidos'] as SortKey[]).map(k => (
              <button key={k} className={sortBy === k ? styles.sortBtnActive : styles.sortBtn}
                onClick={() => setSortBy(k)}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}><span className={styles.summaryNum}>6</span><span className={styles.summaryLbl}>Jornadas jugadas</span></div>
          <div className={styles.summaryCard}><span className={styles.summaryNum}>8</span><span className={styles.summaryLbl}>Equipos</span></div>
          <div className={styles.summaryCard}><span className={styles.summaryNum}>37</span><span className={styles.summaryLbl}>Goles totales</span></div>
          <div className={styles.summaryCard}><span className={styles.summaryNum}>48</span><span className={styles.summaryLbl}>Partidos jugados</span></div>
        </div>

        <p className={styles.hint}>Haz click en un jugador para ver sus detalles</p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th className={sortBy === 'goles' ? styles.thActive : ''}>⚽ Goles</th>
                <th className={sortBy === 'partidos' ? styles.thActive : ''}>🕐 Partidos</th>
                <th>🟡</th>
                <th>🔴</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((j, idx) => (
                <tr key={j.name} className={`${idx === 0 ? styles.topRow : ''} ${styles.clickableRow}`}
                  onClick={() => setSelected(j)}>
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
                  <td className={`${styles.statCell} ${sortBy === 'partidos' ? styles.statCellActive : ''}`}>{j.partidos}</td>
                  <td className={styles.cardCell}>{j.tarjAm > 0 && <span className={styles.yellowCard}>{j.tarjAm}</span>}</td>
                  <td className={styles.cardCell}>{j.tarjRoj > 0 && <span className={styles.redCard}>{j.tarjRoj}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Player popup */}
        {selected && (
          <div className={styles.overlay} onClick={() => setSelected(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalAvatar} style={{ background: selected.color }}>{selected.initials}</div>
                <div className={styles.modalInfo}>
                  <div className={styles.modalName}>{selected.name}</div>
                  <div className={styles.modalEquipo}>{selected.equipo}</div>
                </div>
                <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className={styles.modalStats}>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum}>{selected.goles}</span>
                  <span className={styles.modalLbl}>Goles</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum}>{selected.partidos}</span>
                  <span className={styles.modalLbl}>Partidos</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum} style={{ color: '#d97706' }}>{selected.tarjAm}</span>
                  <span className={styles.modalLbl}>T. Amarillas</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum} style={{ color: '#dc2626' }}>{selected.tarjRoj}</span>
                  <span className={styles.modalLbl}>T. Rojas</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum}>{selected.goles > 0 ? (selected.goles / selected.partidos).toFixed(1) : '0.0'}</span>
                  <span className={styles.modalLbl}>Goles/partido</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
