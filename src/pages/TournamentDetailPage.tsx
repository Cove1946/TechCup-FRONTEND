import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './TournamentDetailPage.module.css';

// ─── Mock data ────────────────────────────────────────────────────────────────
const SEMIFINAL_MATCHES = [
  { id: 1, local: 'FC KERNEL', visitante: 'LOS DEBUGGERS', scoreL: 2, scoreV: 1, fecha: '10 Mar 2026', hora: '3:00 PM', cancha: 'Cancha 2' },
  { id: 2, local: 'NULL PTR FC', visitante: 'STACK OVERFLOW', scoreL: 0, scoreV: 1, fecha: '10 Mar 2026', hora: '5:00 PM', cancha: 'Cancha 1' },
];

const QUARTERFINAL_MATCHES = [
  { id: 3, local: 'FC KERNEL', visitante: 'ERROR 404', scoreL: 3, scoreV: 0, fecha: '03 Mar 2026', hora: '2:00 PM', cancha: 'Cancha 1' },
  { id: 4, local: 'LOS DEBUGGERS', visitante: 'FC PAISAS', scoreL: 2, scoreV: 1, fecha: '03 Mar 2026', hora: '4:00 PM', cancha: 'Cancha 2' },
  { id: 5, local: 'NULL PTR FC', visitante: 'TINTO FRIO FC', scoreL: 1, scoreV: 0, fecha: '04 Mar 2026', hora: '2:00 PM', cancha: 'Cancha 1' },
  { id: 6, local: 'STACK OVERFLOW', visitante: 'LOS SML FC', scoreL: 4, scoreV: 2, fecha: '04 Mar 2026', hora: '4:00 PM', cancha: 'Cancha 2' },
];

const OCTAVOS_MATCHES = [
  { id: 7,  local: 'FC KERNEL',       visitante: 'CRISTAL PAJAS',  scoreL: 2, scoreV: 0, fecha: '24 Feb 2026' },
  { id: 8,  local: 'ERROR 404',       visitante: 'THE FUNCTIONS',  scoreL: 1, scoreV: 0, fecha: '24 Feb 2026' },
  { id: 9,  local: 'LOS DEBUGGERS',   visitante: 'BYTES FC',       scoreL: 3, scoreV: 1, fecha: '25 Feb 2026' },
  { id: 10, local: 'FC PAISAS',       visitante: 'GIT PUSHERS',    scoreL: 2, scoreV: 1, fecha: '25 Feb 2026' },
  { id: 11, local: 'NULL PTR FC',     visitante: 'ASYNC AWAITS',   scoreL: 1, scoreV: 0, fecha: '26 Feb 2026' },
  { id: 12, local: 'TINTO FRIO FC',   visitante: 'MERGE CONFLICTS',scoreL: 3, scoreV: 2, fecha: '26 Feb 2026' },
  { id: 13, local: 'STACK OVERFLOW',  visitante: 'NULL POINTERS',  scoreL: 2, scoreV: 0, fecha: '27 Feb 2026' },
  { id: 14, local: 'LOS SML FC',      visitante: 'LOOP INFINITO',  scoreL: 1, scoreV: 0, fecha: '27 Feb 2026' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
interface MatchCardProps {
  local: string;
  visitante: string;
  scoreL: number;
  scoreV: number;
  fecha?: string;
  hora?: string;
  cancha?: string;
  compact?: boolean;
}

const ResultCard: React.FC<MatchCardProps> = ({ local, visitante, scoreL, scoreV, fecha, hora, cancha, compact }) => (
  <div className={`${styles.resultCard} ${compact ? styles.resultCardCompact : ''}`}>
    <span className={styles.finalizadoBadge}>Finalizado</span>
    <div className={styles.scoreRow}>
      <span className={styles.teamName}>{local}</span>
      <span className={styles.score}>{scoreL} – {scoreV}</span>
      <span className={styles.teamName}>{visitante}</span>
    </div>
    {(fecha || hora || cancha) && (
      <div className={styles.matchMeta}>
        {fecha && <span>📅 {fecha}</span>}
        {hora && <span>🕐 {hora}</span>}
        {cancha && <span>📍 {cancha}</span>}
      </div>
    )}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Only the current season (2026-1) is "En Curso"; everything else is finished
  const isFinished = !id?.includes('2026-1');

  const nombre = id ? 'TechCup ' + id.replace('techcup-', '') : 'TechCup 2026-1';
  const dates  = isFinished ? '10 Ago 2025 – 20 Nov 2025' : '15 Ene 2026 – 20 Mar 2026';

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate('/torneos')}>
          ← Volver a Torneos
        </button>

        {/* Title row */}
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>{nombre}</h1>
            <p className={styles.dates}>{dates}</p>
          </div>
          {isFinished && (
            <div className={styles.championBadge}>
              🏆 Campeón <strong>FC KERNEL</strong>
            </div>
          )}
        </div>

        {isFinished ? (
          <>
            {/* ── FINAL card ── */}
            <div className={styles.finalCard}>
              <div className={styles.finalIcon}>🏆</div>
              <div className={styles.finalLabel}>FINAL</div>
              <div className={styles.finalScore}>
                <span className={styles.finalTeam}>FC KERNEL</span>
                <span className={styles.finalNumbers}>3 – 1</span>
                <span className={styles.finalTeam}>LOS DEBUGGERS</span>
              </div>
              <div className={styles.finalMeta}>📅 15 Nov 2025 · 🕐 4:00 PM · 📍 Cancha Central</div>
            </div>

            {/* ── Semifinales ── */}
            <div className={styles.roundSection}>
              <h2 className={styles.roundTitle}><span className={styles.roundFrac}>1/2</span> Semifinales</h2>
              <div className={styles.roundGrid2}>
                {SEMIFINAL_MATCHES.map(m => (
                  <ResultCard key={m.id} {...m} />
                ))}
              </div>
            </div>

            {/* ── Cuartos de Final ── */}
            <div className={styles.roundSection}>
              <h2 className={styles.roundTitle}><span className={styles.roundFrac}>1/4</span> Cuartos de Final</h2>
              <div className={styles.roundGrid2}>
                {QUARTERFINAL_MATCHES.map(m => (
                  <ResultCard key={m.id} {...m} />
                ))}
              </div>
            </div>

            {/* ── Octavos de Final ── */}
            <div className={styles.roundSection}>
              <h2 className={styles.roundTitle}><span className={styles.roundFrac}>1/8</span> Octavos de Final</h2>
              <div className={styles.roundGrid4}>
                {OCTAVOS_MATCHES.map(m => (
                  <ResultCard key={m.id} {...m} compact />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.card}>
            <div className={styles.trophyIco}>🏆</div>
            <div className={styles.cardTitle}>Torneo en Curso</div>
            <div className={styles.cardSub}>
              Las llaves del torneo se mostrarán una vez que comiencen los playoffs.
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
