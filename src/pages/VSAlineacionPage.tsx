import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './VSAlineacionPage.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────
type PosType = 'GK' | 'DEF' | 'MID' | 'FWD';

interface PlayerBase {
  id: number;
  initials: string;
  name: string;
  color: string;
}

interface PosSlot {
  top: number;
  left: number;
  pos: PosType;
}

// ─── Formation slots ──────────────────────────────────────────────────────────
const FORMATION_SLOTS: Record<string, PosSlot[]> = {
  '2-3-1': [
    { top: 82, left: 50, pos: 'GK'  },
    { top: 63, left: 28, pos: 'DEF' },
    { top: 63, left: 72, pos: 'DEF' },
    { top: 40, left: 18, pos: 'MID' },
    { top: 40, left: 50, pos: 'MID' },
    { top: 40, left: 82, pos: 'MID' },
    { top: 14, left: 50, pos: 'FWD' },
  ],
  '3-2-1': [
    { top: 82, left: 50, pos: 'GK'  },
    { top: 65, left: 18, pos: 'DEF' },
    { top: 65, left: 50, pos: 'DEF' },
    { top: 65, left: 82, pos: 'DEF' },
    { top: 42, left: 30, pos: 'MID' },
    { top: 42, left: 70, pos: 'MID' },
    { top: 14, left: 50, pos: 'FWD' },
  ],
  '2-2-2': [
    { top: 82, left: 50, pos: 'GK'  },
    { top: 65, left: 28, pos: 'DEF' },
    { top: 65, left: 72, pos: 'DEF' },
    { top: 45, left: 28, pos: 'MID' },
    { top: 45, left: 72, pos: 'MID' },
    { top: 16, left: 30, pos: 'FWD' },
    { top: 16, left: 70, pos: 'FWD' },
  ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const LOCAL_PLAYERS: PlayerBase[] = [
  { id: 7, initials: 'CM', name: 'Carlos M.',  color: '#78350f' },
  { id: 5, initials: 'LD', name: 'Luis D.',    color: '#1e3a8a' },
  { id: 6, initials: 'RS', name: 'Rodrigo S.', color: '#5b21b6' },
  { id: 2, initials: 'PH', name: 'Pablo H.',   color: '#4b5563' },
  { id: 3, initials: 'AT', name: 'Andrés T.',  color: '#0f766e' },
  { id: 4, initials: 'JV', name: 'Juan V.',    color: '#4b5563' },
  { id: 1, initials: 'PK', name: 'Pablo K.',   color: '#7f1d1d' },
];

const VISITOR_PLAYERS: PlayerBase[] = [
  { id: 17, initials: 'SM', name: 'Santiago M.', color: '#78350f' },
  { id: 15, initials: 'FP', name: 'Felipe P.',   color: '#1e40af' },
  { id: 16, initials: 'JC', name: 'José C.',     color: '#6d28d9' },
  { id: 12, initials: 'MR', name: 'Miguel R.',   color: '#374151' },
  { id: 13, initials: 'LS', name: 'Luis S.',     color: '#065f46' },
  { id: 14, initials: 'DM', name: 'Diego M.',    color: '#374151' },
  { id: 11, initials: 'CR', name: 'Carlos R.',   color: '#991b1b' },
];

const LOCAL_STATS  = { pts: 15, pg: 5, pe: 0, pp: 1, gf: 14, gc: 6,  capitan: 'Carlos Pérez',  uniforme: 'Verde - Blanco' };
const VISITOR_STATS = { pts: 12, pg: 4, pe: 0, pp: 2, gf: 11, gc: 9, capitan: 'Santiago Mora', uniforme: 'Azul - Negro' };

const MATCH = {
  local:     'FC KERNEL',
  visitante: 'LOS DEBUGGERS',
  fecha:     '18 Mar',
  hora:      '3:00 PM',
  cancha:    'Cancha B',
};

// ─── Soccer field ─────────────────────────────────────────────────────────────
const SoccerField: React.FC<{ players: PlayerBase[]; formation: string }> = ({ players, formation }) => {
  const slots = FORMATION_SLOTS[formation] ?? FORMATION_SLOTS['2-3-1'];
  return (
    <div className={styles.field}>
      <div className={styles.fieldInner}>
        <div className={styles.centerLine} />
        <div className={styles.centerCircle} />
        <div className={styles.penaltyTop} />
        <div className={styles.goalTop} />
        <div className={styles.penaltyBottom} />
        <div className={styles.goalBottom} />
        {players.map((p, i) => {
          const slot = slots[i];
          if (!slot) return null;
          return (
            <div
              key={p.id}
              className={styles.fieldPlayer}
              style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
            >
              <div className={styles.playerCircle} style={{ background: p.color }}>{p.initials}</div>
              <span className={styles.posLabel}>{slot.pos}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Team info panel ──────────────────────────────────────────────────────────
const TeamInfo: React.FC<{
  teamName: string;
  accentColor: string;
  players: PlayerBase[];
  formation: string;
  stats: typeof LOCAL_STATS;
}> = ({ teamName, accentColor, players, formation, stats }) => {
  const slots = FORMATION_SLOTS[formation] ?? FORMATION_SLOTS['2-3-1'];
  return (
    <div className={styles.teamInfo}>
      <div className={styles.teamInfoHeader} style={{ borderLeftColor: accentColor }}>
        <span className={styles.teamInfoName}>{teamName}</span>
        <span className={styles.teamInfoFormation} style={{ color: accentColor }}>Formación {formation}</span>
      </div>

      <div className={styles.statsRow}>
        {[
          { lbl: 'PTS', val: stats.pts },
          { lbl: 'PG',  val: stats.pg  },
          { lbl: 'PE',  val: stats.pe  },
          { lbl: 'PP',  val: stats.pp  },
          { lbl: 'GF',  val: stats.gf  },
          { lbl: 'GC',  val: stats.gc  },
        ].map(s => (
          <div key={s.lbl} className={styles.statItem}>
            <span className={styles.statNum}>{s.val}</span>
            <span className={styles.statLbl}>{s.lbl}</span>
          </div>
        ))}
      </div>

      <div className={styles.teamMeta}>
        <span>👤 Capitán: <strong>{stats.capitan}</strong></span>
        <span>👕 Uniforme: <strong>{stats.uniforme}</strong></span>
      </div>

      <div className={styles.playerListTitle}>Alineación titular</div>
      <div className={styles.playerList}>
        {players.map((p, i) => (
          <div key={p.id} className={styles.playerRow}>
            <div className={styles.playerAvatar} style={{ background: p.color }}>{p.initials}</div>
            <span className={styles.playerName}>{p.name}</span>
            <span className={styles.playerPos} style={{ color: accentColor }}>{slots[i]?.pos ?? ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cada equipo tiene su propia formación fija (solo lectura)
const LOCAL_FORMATION    = '2-3-1';
const VISITOR_FORMATION  = '3-2-1';

// ─── Page ─────────────────────────────────────────────────────────────────────
export const VSAlineacionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Comparación de alineaciones</p>

        {/* Header */}
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>
              <span style={{ color: '#15803d' }}>{MATCH.local}</span>
              <span className={styles.titleVs}> vs </span>
              <span style={{ color: '#1e3a8a' }}>{MATCH.visitante}</span>
            </h1>
            <p className={styles.matchMeta}>📅 {MATCH.fecha} · ⏰ {MATCH.hora} · 📍 {MATCH.cancha}</p>
          </div>
          <button className={styles.btnOutline} onClick={() => navigate('/alineacion')}>
            ⚽ Mi Alineación
          </button>
        </div>

        {/* Two fields — read only */}
        <div className={styles.fieldsRow}>
          <div className={styles.teamCol}>
            <div className={styles.colLabel} style={{ background: '#15803d' }}>{MATCH.local}</div>
            <SoccerField players={LOCAL_PLAYERS} formation={LOCAL_FORMATION} />
          </div>
          <div className={styles.vsSep}>VS</div>
          <div className={styles.teamCol}>
            <div className={styles.colLabel} style={{ background: '#1e3a8a' }}>{MATCH.visitante}</div>
            <SoccerField players={VISITOR_PLAYERS} formation={VISITOR_FORMATION} />
          </div>
        </div>

        {/* Team info below fields */}
        <div className={styles.infoRow}>
          <TeamInfo
            teamName={MATCH.local}
            accentColor="#15803d"
            players={LOCAL_PLAYERS}
            formation={LOCAL_FORMATION}
            stats={LOCAL_STATS}
          />
          <div className={styles.infoSep} />
          <TeamInfo
            teamName={MATCH.visitante}
            accentColor="#1e3a8a"
            players={VISITOR_PLAYERS}
            formation={VISITOR_FORMATION}
            stats={VISITOR_STATS}
          />
        </div>
      </div>
    </MainLayout>
  );
};
