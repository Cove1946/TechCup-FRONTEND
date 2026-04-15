import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './AlineacionPage.module.css';

type PosType = 'GK' | 'DEF' | 'MID' | 'FWD';

interface FieldPlayer { id: number; initials: string; name: string; color: string; }
interface BenchPlayer { id: number; initials: string; name: string; detail: string; color: string; suspReason?: string; }
interface PosSlot { top: number; left: number; pos: PosType; }

const FORMATION_SLOTS: Record<string, PosSlot[]> = {
  '2-3-1': [
    { top: 82, left: 50, pos: 'GK'  }, { top: 63, left: 28, pos: 'DEF' }, { top: 63, left: 72, pos: 'DEF' },
    { top: 40, left: 18, pos: 'MID' }, { top: 40, left: 50, pos: 'MID' }, { top: 40, left: 82, pos: 'MID' },
    { top: 14, left: 50, pos: 'FWD' },
  ],
  '3-2-1': [
    { top: 82, left: 50, pos: 'GK'  }, { top: 65, left: 18, pos: 'DEF' }, { top: 65, left: 50, pos: 'DEF' },
    { top: 65, left: 82, pos: 'DEF' }, { top: 42, left: 30, pos: 'MID' }, { top: 42, left: 70, pos: 'MID' },
    { top: 14, left: 50, pos: 'FWD' },
  ],
  '2-2-2': [
    { top: 82, left: 50, pos: 'GK'  }, { top: 65, left: 28, pos: 'DEF' }, { top: 65, left: 72, pos: 'DEF' },
    { top: 45, left: 28, pos: 'MID' }, { top: 45, left: 72, pos: 'MID' }, { top: 16, left: 30, pos: 'FWD' },
    { top: 16, left: 70, pos: 'FWD' },
  ],
};

const FORMATIONS = ['2-3-1', '3-2-1', '2-2-2'];
const FORMATION_ROWS: Record<string, number[]> = { '2-3-1': [1,3,2], '3-2-1': [1,2,3], '2-2-2': [2,2,2] };

const INIT_FIELD: FieldPlayer[] = [
  { id: 7, initials: 'CM', name: 'Carlos M.',  color: '#78350f' },
  { id: 5, initials: 'LD', name: 'Luis D.',    color: '#1e3a8a' },
  { id: 6, initials: 'RS', name: 'Rodrigo S.', color: '#5b21b6' },
  { id: 2, initials: 'PH', name: 'Pablo H.',   color: '#4b5563' },
  { id: 3, initials: 'AT', name: 'Andrés T.',  color: '#0f766e' },
  { id: 4, initials: 'JV', name: 'Juan V.',    color: '#4b5563' },
  { id: 1, initials: 'PK', name: 'Pablo K.',   color: '#7f1d1d' },
];

const INIT_BENCH: BenchPlayer[] = [
  { id: 10, initials: 'PH', name: 'Pablo H.',  detail: 'MED · 1G · 2A', color: '#0891b2' },
  { id: 11, initials: 'DR', name: 'Diego R.',  detail: 'FWD · 3G',       color: '#dc2626' },
  { id: 12, initials: 'FG', name: 'Felipe G.', detail: 'MED · 1A',       color: '#7c3aed' },
  { id: 13, initials: 'MA', name: 'Malon A.',  detail: 'MED · 2G',       color: '#16a34a' },
  { id: 14, initials: 'KR', name: 'Kriay R.',  detail: 'MID · 1G',       color: '#15803d' },
  { id: 15, initials: 'EH', name: 'Erimes H.', detail: 'MED · 1G',       color: '#d97706' },
];

const SUSPENDIDOS: BenchPlayer[] = [
  { id: 20, initials: 'LM', name: 'Luis M.',  detail: 'DEF',           suspReason: 'Tarjeta Roja', color: '#6b7280' },
  { id: 21, initials: 'ML', name: 'Marry L.', detail: 'DEF · 1G · 2A', suspReason: 'Tarjeta Roja', color: '#6b7280' },
];

const FormationDots: React.FC<{ label: string; active: boolean }> = ({ label, active }) => {
  const rows = FORMATION_ROWS[label] ?? [1,3,2];
  return (
    <div className={styles.dotDiagram}>
      {rows.map((count, ri) => (
        <div key={ri} className={styles.dotRow}>
          {Array.from({ length: count }).map((_, di) => (
            <span key={di} className={active ? styles.dotActive : styles.dot} />
          ))}
        </div>
      ))}
    </div>
  );
};

export const AlineacionPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem('user');
  const role     = (userStr ? JSON.parse(userStr).role : 'jugador').toLowerCase();
  const canEdit  = role === 'capitan';

  const [formation, setFormation]         = useState('2-3-1');
  const [fieldPlayers, setFieldPlayers]   = useState<FieldPlayer[]>([...INIT_FIELD]);
  const [benchPlayers, setBenchPlayers]   = useState<BenchPlayer[]>([...INIT_BENCH]);
  const [selectedIdx, setSelectedIdx]     = useState<number | null>(null); // index in fieldPlayers
  const [saved, setSaved]                 = useState(false);
  const [swapMsg, setSwapMsg]             = useState('');

  const showMsg = (msg: string) => { setSwapMsg(msg); setTimeout(() => setSwapMsg(''), 2200); };
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const handleFieldClick = (idx: number) => {
    if (!canEdit) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      // Swap two field players
      setFieldPlayers(prev => {
        const arr = [...prev];
        [arr[selectedIdx], arr[idx]] = [arr[idx], arr[selectedIdx]];
        return arr;
      });
      showMsg(`↔ ${fieldPlayers[selectedIdx].name} ⇄ ${fieldPlayers[idx].name}`);
      setSelectedIdx(null);
    }
  };

  const handleBenchClick = (benchIdx: number) => {
    if (!canEdit || selectedIdx === null) return;
    const outPlayer   = fieldPlayers[selectedIdx];
    const inPlayer    = benchPlayers[benchIdx];
    const newField: FieldPlayer   = { id: inPlayer.id, initials: inPlayer.initials, name: inPlayer.name, color: inPlayer.color };
    const newBench: BenchPlayer   = { id: outPlayer.id, initials: outPlayer.initials, name: outPlayer.name, detail: '', color: outPlayer.color };
    setFieldPlayers(prev => { const arr = [...prev]; arr[selectedIdx] = newField; return arr; });
    setBenchPlayers(prev => { const arr = [...prev]; arr[benchIdx] = newBench; return arr; });
    showMsg(`↕ ${inPlayer.name} entra · ${outPlayer.name} sale`);
    setSelectedIdx(null);
  };

  const slots = FORMATION_SLOTS[formation] ?? FORMATION_SLOTS['2-3-1'];
  const selectedPlayer = selectedIdx !== null ? fieldPlayers[selectedIdx] : null;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Gestión de Alineación Táctica</p>

        <div className={styles.titleRow}>
          <div className={styles.titleLeft}>
            <h1 className={styles.title}>Mi Alineación — <strong>FC KERNEL</strong></h1>
            <p className={styles.matchMeta}>Temporada 2026-1 · Capitán: Carlos Pérez</p>
          </div>
          <div className={styles.titleActions}>
            <button className={styles.btnOutline} onClick={() => navigate('/my-team')}>👤 Ver equipo</button>
            <button className={styles.btnOutline} onClick={() => navigate('/vs/alineacion')}>⚔️ Ver VS</button>
            {canEdit && <button className={styles.btnPrimary} onClick={handleSave}>💾 Guardar alineación</button>}
          </div>
        </div>

        {saved && <div className={styles.savedBanner}>✓ Alineación guardada correctamente</div>}
        {swapMsg && <div className={styles.swapBanner}>{swapMsg}</div>}

        <div className={styles.statsBar}>
          <div className={styles.statBox}><span className={styles.statLabel}>Jugadores en cancha:</span><span className={styles.statValue}>7 / 7</span></div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}><span className={styles.statLabel}>Cambios disponibles:</span><span className={styles.statValue}>5 / 5</span></div>
          <div className={styles.warnBox}>
            <span className={styles.warnIcon}>⚠️</span>
            <span className={styles.warnText}>
              {canEdit && selectedPlayer
                ? `Seleccionado: ${selectedPlayer.name} — elige un jugador de reservas o en cancha para cambiar`
                : 'Jugadores suspendidos no pueden ser incluidos en la alineación'}
            </span>
          </div>
        </div>

        <div className={styles.mainLayout}>
          {/* Field */}
          <div className={styles.fieldCol}>
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <div className={styles.centerLine} /><div className={styles.centerCircle} />
                <div className={styles.penaltyTop} /><div className={styles.goalTop} />
                <div className={styles.penaltyBottom} /><div className={styles.goalBottom} />
                {fieldPlayers.map((p, i) => {
                  const slot = slots[i]; if (!slot) return null;
                  const isSel = selectedIdx === i;
                  return (
                    <button key={p.id} className={`${styles.fieldPlayer} ${isSel ? styles.fieldPlayerSel : ''}`}
                      style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
                      onClick={() => handleFieldClick(i)}>
                      <div className={styles.playerCircle} style={{ background: p.color, boxShadow: isSel ? `0 0 0 3px #fff, 0 0 0 5px ${p.color}` : undefined }}>
                        {p.initials}
                      </div>
                      <span className={styles.posLabel}>{slot.pos}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel */}
          <div className={styles.panel}>
            {!canEdit && (
              <div className={styles.readOnlyBanner}>👁 Modo solo lectura — solo el capitán puede modificar la alineación</div>
            )}

            {canEdit && (
              <div className={styles.formationRow}>
                {FORMATIONS.map(f => (
                  <button key={f} className={formation === f ? styles.formCardActive : styles.formCard}
                    onClick={() => { setFormation(f); setSelectedIdx(null); }}>
                    <FormationDots label={f} active={formation === f} />
                    <span className={formation === f ? styles.formLabelActive : styles.formLabel}>{f}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected player card */}
            {selectedPlayer && canEdit && (
              <div className={styles.selectedCard}>
                <div className={styles.selectedAvatar} style={{ background: selectedPlayer.color }}>{selectedPlayer.initials}</div>
                <div>
                  <div className={styles.selectedName}>{selectedPlayer.name}</div>
                  <div className={styles.selectedPos}>{slots[selectedIdx!]?.pos} — Selecciona con quién cambiar</div>
                </div>
                <button className={styles.deselectBtn} onClick={() => setSelectedIdx(null)}>✕</button>
              </div>
            )}

            {/* Reservas */}
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>
                Reservas
                {canEdit && selectedPlayer && <span className={styles.sectionHint}> — toca para cambiar</span>}
              </h3>
              <div className={styles.benchGrid}>
                {benchPlayers.map((p, bi) => (
                  <div key={p.id}
                    className={`${styles.benchItem} ${canEdit && selectedPlayer ? styles.benchItemClickable : ''}`}
                    onClick={() => handleBenchClick(bi)}>
                    <div className={styles.benchAvatar} style={{ background: p.color }}>{p.initials}</div>
                    <div className={styles.benchInfo}>
                      <span className={styles.benchName}>{p.name}</span>
                      {p.detail && <span className={styles.benchDetail}>{p.detail}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspendidos */}
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Suspendidos</h3>
              <div className={styles.benchGrid}>
                {SUSPENDIDOS.map(p => (
                  <div key={p.id} className={styles.benchItem}>
                    <div className={styles.benchAvatarGray}>{p.initials}</div>
                    <div className={styles.benchInfo}>
                      <span className={styles.benchNameGray}>{p.name}</span>
                      <span className={styles.benchDetail}>{p.detail} · {p.suspReason}</span>
                    </div>
                    <span className={styles.suspBadge}>Suspendido</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
