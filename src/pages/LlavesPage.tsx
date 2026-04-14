import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './LlavesPage.module.css';

type MatchStatus = 'finalizado' | 'proximo' | 'porDefinir';

interface BracketMatch {
  team1: string;
  score1?: number;
  team2: string;
  score2?: number;
  status: MatchStatus;
  date?: string;
}

const CUARTOS: BracketMatch[] = [
  { team1: 'FC KERNEL',      score1: 3, team2: 'LOS DEBUGGERS',  score2: 1, status: 'finalizado' },
  { team1: 'NULL PTR FC',               team2: 'STACK OVERFLOW',             status: 'proximo', date: '18 Mar · 3:00 PM' },
  { team1: 'CODERS UNITE',              team2: 'BYTE FORCE',                 status: 'proximo', date: '19 Mar · 5:00 PM' },
  { team1: 'DATA KNIGHTS',             team2: 'ALGO RITHM',                 status: 'proximo', date: '20 Mar · 2:00 PM' },
];

const SEMIS: BracketMatch[] = [
  { team1: 'FC KERNEL', team2: 'Por definir', status: 'porDefinir' },
  { team1: 'Por definir', team2: 'Por definir', status: 'porDefinir' },
];

const FINAL: BracketMatch = { team1: 'Por definir', team2: 'Por definir', status: 'porDefinir' };

// ─── Match card ───────────────────────────────────────────────────────────────
function MatchCard({ m }: { m: BracketMatch }) {
  const winner =
    m.status === 'finalizado'
      ? m.score1! > m.score2! ? 1 : 2
      : null;

  return (
    <div className={styles.card}>
      <div className={`${styles.teamRow} ${winner === 1 ? styles.winnerRow : winner === 2 ? styles.loserRow : ''}`}>
        <div className={styles.teamDot} style={{ background: winner === 1 ? '#16a34a' : '#e5e7eb' }} />
        <span className={styles.teamName}>{m.team1}</span>
        {m.score1 !== undefined && (
          <span className={`${styles.score} ${winner === 1 ? styles.scoreWin : ''}`}>{m.score1}</span>
        )}
      </div>

      <div className={styles.cardDivider} />

      <div className={`${styles.teamRow} ${winner === 2 ? styles.winnerRow : winner === 1 ? styles.loserRow : ''}`}>
        <div className={styles.teamDot} style={{ background: winner === 2 ? '#16a34a' : '#e5e7eb' }} />
        <span className={styles.teamName}>{m.team2}</span>
        {m.score2 !== undefined && (
          <span className={`${styles.score} ${winner === 2 ? styles.scoreWin : ''}`}>{m.score2}</span>
        )}
      </div>

      <div className={styles.cardFooter}>
        {m.status === 'finalizado' && <span className={styles.badgeFin}>✓ Finalizado</span>}
        {m.status === 'proximo'    && <span className={styles.badgeProx}>⏱ {m.date}</span>}
        {m.status === 'porDefinir' && <span className={styles.badgePor}>— Por definir</span>}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export const LlavesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.trophyIco}>🏆</span>
          <div>
            <h1 className={styles.title}>Llaves Eliminatorias</h1>
            <p className={styles.sub}>Camino al Título · TechCup 2026-1</p>
          </div>
        </div>

        {/* Bracket */}
        <div className={styles.bracketWrap}>
          <div className={styles.bracket}>

            {/* ── Cuartos ── */}
            <div className={styles.stage}>
              <div className={styles.stageLabel}>CUARTOS DE FINAL</div>
              <div className={styles.stageBody}>
                <div className={styles.qfPair}>
                  <MatchCard m={CUARTOS[0]} />
                  <MatchCard m={CUARTOS[1]} />
                </div>
                <div className={styles.qfGap} />
                <div className={styles.qfPair}>
                  <MatchCard m={CUARTOS[2]} />
                  <MatchCard m={CUARTOS[3]} />
                </div>
              </div>
            </div>

            {/* ── Connector QF → SF ── */}
            <div className={styles.connCol}>
              <div className={styles.connArm} />
              <div className={styles.connArmGap} />
              <div className={styles.connArm} />
            </div>

            {/* ── Semifinales ── */}
            <div className={styles.stage}>
              <div className={styles.stageLabel}>SEMIFINALES</div>
              <div className={styles.stageBodySF}>
                <MatchCard m={SEMIS[0]} />
                <MatchCard m={SEMIS[1]} />
              </div>
            </div>

            {/* ── Connector SF → Final ── */}
            <div className={styles.connCol}>
              <div className={styles.connArmSingle} />
            </div>

            {/* ── Gran Final ── */}
            <div className={styles.stage}>
              <div className={styles.stageLabel}>GRAN FINAL</div>
              <div className={styles.stageBodyFinal}>
                <MatchCard m={FINAL} />
              </div>
            </div>

            {/* ── Campeón ── */}
            <div className={styles.connSingle} />
            <div className={styles.champCol}>
              <div className={styles.champCard}>
                <span className={styles.champTrophy}>🏆</span>
                <span className={styles.champLabel}>Campeón</span>
                <span className={styles.champName}>Por definir</span>
              </div>
            </div>

          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendItem}><span className={styles.finDot} /> Finalizado</span>
          <span className={styles.legendItem}><span className={styles.proxDot} /> Próximo</span>
          <span className={styles.legendItem}><span className={styles.porDot} /> Por definir</span>
        </div>
      </div>
    </MainLayout>
  );
};
