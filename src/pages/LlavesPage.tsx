import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './LlavesPage.module.css';

interface Match {
  id: number;
  team1: string; color1: string; initials1: string;
  team2: string; color2: string; initials2: string;
  score1?: number; score2?: number;
  status: 'pendiente' | 'en_juego' | 'finalizado';
  fecha?: string;
}

const QF: Match[] = [
  { id: 1, team1: 'FC KERNEL',      color1: '#15803d', initials1: 'FCK', team2: 'GIT PUSH FORCE', color2: '#4b5563', initials2: 'GPF', score1: 3, score2: 1, status: 'finalizado', fecha: '15 Mar' },
  { id: 2, team1: 'NULL POINTERS',  color1: '#d97706', initials1: 'NLP', team2: 'BYTE FORCE',      color2: '#7c3aed', initials2: 'BTF', score1: 2, score2: 0, status: 'finalizado', fecha: '15 Mar' },
  { id: 3, team1: 'LOS DEBUGGERS',  color1: '#1e3a8a', initials1: 'DBG', team2: '404 NOT FOUND',   color2: '#6b7280', initials2: '404', score1: 4, score2: 1, status: 'finalizado', fecha: '16 Mar' },
  { id: 4, team1: 'STACK OVERFLOW', color1: '#dc2626', initials1: 'SOF', team2: 'RUNTIME ERROR',   color2: '#0f766e', initials2: 'RTE', score1: 2, score2: 2, status: 'finalizado', fecha: '16 Mar' },
];

const SF: Match[] = [
  { id: 5, team1: 'FC KERNEL',     color1: '#15803d', initials1: 'FCK', team2: 'NULL POINTERS',  color2: '#d97706', initials2: 'NLP', score1: 2, score2: 1, status: 'finalizado', fecha: '22 Mar' },
  { id: 6, team1: 'LOS DEBUGGERS', color1: '#1e3a8a', initials1: 'DBG', team2: 'STACK OVERFLOW', color2: '#dc2626', initials2: 'SOF', status: 'pendiente', fecha: '23 Mar' },
];

const FINAL: Match = {
  id: 7, team1: 'FC KERNEL', color1: '#15803d', initials1: 'FCK', team2: 'Por definir', color2: '#9ca3af', initials2: '?',
  status: 'pendiente', fecha: '30 Mar',
};

const CHAMPION = { name: 'FC KERNEL', color: '#15803d', initials: 'FCK' };

const MatchCard: React.FC<{ match: Match }> = ({ match: m }) => {
  const winner = m.status === 'finalizado' ? (m.score1! >= m.score2! ? 1 : 2) : null;
  return (
    <div className={styles.matchCard}>
      {m.status === 'en_juego' && <div className={styles.liveBar}>EN VIVO</div>}
      <div className={`${styles.teamRow} ${winner === 1 ? styles.winnerRow : winner === 2 ? styles.loserRow : ''}`}>
        <div className={styles.teamDot} style={{ background: m.color1 }}>{m.initials1}</div>
        <span className={styles.teamLabel}>{m.team1}</span>
        {m.status !== 'pendiente' && <span className={styles.score}>{m.score1}</span>}
      </div>
      <div className={`${styles.teamRow} ${winner === 2 ? styles.winnerRow : winner === 1 ? styles.loserRow : ''}`}>
        <div className={styles.teamDot} style={{ background: m.color2 }}>{m.initials2}</div>
        <span className={styles.teamLabel}>{m.team2}</span>
        {m.status !== 'pendiente' && <span className={styles.score}>{m.score2}</span>}
      </div>
      {m.fecha && <div className={styles.matchDate}>📅 {m.fecha}</div>}
    </div>
  );
};

export const LlavesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>TechCup Primavera 2026</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Llaves del Torneo</h1>
          <button className={styles.btnOutline} onClick={() => navigate('/tabla')}>📊 Tabla de posiciones</button>
        </div>

        {CHAMPION && (
          <div className={styles.champCard}>
            <span className={styles.champIcon}>🏆</span>
            <div className={styles.champAvatar} style={{ background: CHAMPION.color }}>{CHAMPION.initials}</div>
            <div>
              <div className={styles.champLabel}>Campeón</div>
              <div className={styles.champName}>{CHAMPION.name}</div>
            </div>
          </div>
        )}

        <div className={styles.bracket}>
          {/* Cuartos de final */}
          <div className={styles.stage}>
            <div className={styles.stageLabel}>Cuartos de Final</div>
            <div className={styles.stageMatches}>
              <div className={styles.qfPair}>
                <MatchCard match={QF[0]} />
                <MatchCard match={QF[1]} />
              </div>
              <div className={styles.qfPair}>
                <MatchCard match={QF[2]} />
                <MatchCard match={QF[3]} />
              </div>
            </div>
          </div>

          {/* Conectores QF → SF */}
          <div className={styles.connCol}>
            <div className={styles.connGroup}>
              <div className={styles.connArm} />
              <div className={styles.connLine} />
            </div>
            <div className={styles.connGroupGap} />
            <div className={styles.connGroup}>
              <div className={styles.connArm} />
              <div className={styles.connLine} />
            </div>
          </div>

          {/* Semifinales */}
          <div className={styles.stage}>
            <div className={styles.stageLabel}>Semifinales</div>
            <div className={styles.stageMatches}>
              <div className={styles.sfWrap}>
                <MatchCard match={SF[0]} />
              </div>
              <div className={styles.sfWrap}>
                <MatchCard match={SF[1]} />
              </div>
            </div>
          </div>

          {/* Conector SF → Final */}
          <div className={styles.connCol}>
            <div className={styles.connGroup}>
              <div className={styles.connArm} />
              <div className={styles.connLine} />
            </div>
          </div>

          {/* Final */}
          <div className={styles.stage}>
            <div className={styles.stageLabel}>Final</div>
            <div className={styles.stageMatches}>
              <div className={styles.finalWrap}>
                <MatchCard match={FINAL} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
