import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './MyTeamPage.module.css';

type Estado = 'Titular' | 'Reserva' | 'Suspendido';

interface Player {
  num: number;
  initials: string;
  name: string;
  pos: string;
  sem: string;
  prog: string;
  estado: Estado;
  rol: string;
  suspended: boolean;
}

const INITIAL_ROSTER: Player[] = [
  { num: 1,  initials: 'CP', name: 'Carlos Pérez',    pos: 'Delantero',     sem: 'RF - 6', prog: 'Sistemas',       estado: 'Titular',    rol: 'Estudiante', suspended: false },
  { num: 2,  initials: 'RB', name: 'Rogelio B.',      pos: 'Central',       sem: 'RF - 5', prog: 'Sistemas',       estado: 'Suspendido', rol: 'Estudiante', suspended: true  },
  { num: 3,  initials: 'CB', name: 'Carlos Brotez',   pos: 'Defensa',       sem: 'RF - 5', prog: 'Estadística',    estado: 'Titular',    rol: 'Estudiante', suspended: false },
  { num: 4,  initials: 'CG', name: 'Carlos Granma',   pos: 'Centrocampista',sem: 'RF - 5', prog: 'Sistemas',       estado: 'Titular',    rol: 'Estudiante', suspended: false },
  { num: 5,  initials: 'CB', name: 'Carlos Brotez',   pos: 'Delantero',     sem: 'RF - 5', prog: 'Ciberseguridad', estado: 'Titular',    rol: 'Estudiante', suspended: false },
  { num: 6,  initials: 'CP', name: 'Carlos Pérez',    pos: 'Defensa',       sem: 'RF - 4', prog: 'Ciberseguridad', estado: 'Titular',    rol: 'Estudiante', suspended: false },
  { num: 7,  initials: 'CP', name: 'Carlos Pérez',    pos: 'Defensa',       sem: 'RF - 4', prog: 'Estadística',    estado: 'Reserva',    rol: 'Estudiante', suspended: false },
  { num: 8,  initials: 'KP', name: 'Kanor Phonez',    pos: 'Delantero',     sem: 'RF - 4', prog: 'IA',             estado: 'Reserva',    rol: 'Estudiante', suspended: false },
  { num: 9,  initials: 'RB', name: 'Rogelio B.',      pos: 'Lateral',       sem: 'RF - 3', prog: 'IA',             estado: 'Reserva',    rol: 'Estudiante', suspended: true  },
  { num: 10, initials: 'CP', name: 'Carlos Pérez',    pos: 'Lateral',       sem: 'RF - 5', prog: 'Sistema',        estado: 'Reserva',    rol: 'Estudiante', suspended: false },
];

const AVATAR_COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#0891b2', '#be185d'];
const ESTADOS: Estado[] = ['Titular', 'Reserva', 'Suspendido'];

export const MyTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [roster, setRoster] = useState<Player[]>(INITIAL_ROSTER);
  const [viewPlayer, setViewPlayer]   = useState<Player | null>(null);
  const [editIdx, setEditIdx]         = useState<number | null>(null);
  const [editEstado, setEditEstado]   = useState<Estado>('Titular');
  const [confirmDel, setConfirmDel]   = useState<number | null>(null);

  // ── handlers ────────────────────────────────────────────────────────────────
  const openView  = (p: Player) => { setViewPlayer(p); setEditIdx(null); setConfirmDel(null); };
  const closeView = () => setViewPlayer(null);

  const openEdit = (i: number) => {
    setEditIdx(i);
    setEditEstado(roster[i].estado);
    setViewPlayer(null);
    setConfirmDel(null);
  };

  const saveEdit = (i: number) => {
    setRoster(prev => prev.map((p, idx) =>
      idx === i ? { ...p, estado: editEstado, suspended: editEstado === 'Suspendido' } : p
    ));
    setEditIdx(null);
  };

  const askDelete  = (i: number) => { setConfirmDel(i); setEditIdx(null); setViewPlayer(null); };
  const cancelDel  = () => setConfirmDel(null);
  const doDelete   = (i: number) => { setRoster(prev => prev.filter((_, idx) => idx !== i)); setConfirmDel(null); };

  const suspendedCount = roster.filter(p => p.suspended).length;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>

        <div className={styles.topRow}>
          <div>
            <h1 className={styles.title}>Mi Equipo</h1>
            <p className={styles.sub}>RF05 · RF06 — Gestión de equipo</p>
          </div>
          <span className={styles.activeBadge}>2026-1 · Activo</span>
        </div>

        {/* Team header card */}
        <div className={styles.teamCard}>
          <div className={styles.teamLeft}>
            <div className={styles.shield}>🛡️</div>
            <div className={styles.teamInfo}>
              <div className={styles.teamName}>FC KERNEL</div>
              <div className={styles.teamMeta}>Uniforme: Verde - Blanco</div>
              <div className={styles.teamMeta}>Capitán: Carlos Pérez</div>
            </div>
          </div>
          <div className={styles.teamCenter}>
            <div className={styles.playerCount}>{roster.length} / 12 jugadores</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${(roster.length / 12) * 100}%` }} />
            </div>
          </div>
          <div className={styles.teamActions}>
            <button className={styles.btnOutline} onClick={() => navigate('/alineacion')}>
              👤 Ver alineación
            </button>
            <button className={styles.btnGreen} onClick={() => navigate('/search-players')}>
              ⊕ Invitar jugador
            </button>
            <button className={styles.btnOutline} onClick={() => navigate('/payment')}>
              🗂 Gestionar pago
            </button>
          </div>
        </div>

        {/* Warning banner */}
        {suspendedCount > 0 && (
          <div className={styles.warningBanner}>
            <span>⚠️</span>
            <span>
              <strong>{roster.filter(p => p.suspended).map(p => p.name).join(', ')}</strong>
              {suspendedCount === 1 ? ' está suspendido' : ' están suspendidos'} para el próximo partido por tarjeta roja (RF18)
            </span>
          </div>
        )}

        {/* Validation strip */}
        <div className={styles.validationStrip}>
          <span className={roster.length >= 7 ? styles.validItem : styles.invalidItem}>
            {roster.length >= 7 ? '✓' : '✗'} Mínimo 7 jugadores ({roster.length}/7)
          </span>
          <span className={roster.length <= 12 ? styles.validItem : styles.invalidItem}>
            {roster.length <= 12 ? '✓' : '✗'} Máximo 12 jugadores
          </span>
          <span className={styles.validItem}>✓ Elegibilidad de programas (88%)</span>
          <span className={styles.validItem}>✓ Sin duplicados</span>
        </div>

        {/* Player detail modal */}
        {viewPlayer && (
          <div className={styles.modalOverlay} onClick={closeView}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <span className={styles.modalTitle}>Detalles del jugador</span>
                <button className={styles.modalClose} onClick={closeView}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalAvatar}
                  style={{ background: AVATAR_COLORS[roster.findIndex(p => p.num === viewPlayer.num) % AVATAR_COLORS.length] }}>
                  {viewPlayer.initials}
                </div>
                <div className={styles.modalName}>{viewPlayer.name}</div>
                <div className={styles.modalRows}>
                  <div className={styles.modalRow}><span>Posición</span><strong>{viewPlayer.pos}</strong></div>
                  <div className={styles.modalRow}><span>Semestre</span><strong>{viewPlayer.sem}</strong></div>
                  <div className={styles.modalRow}><span>Programa</span><strong>{viewPlayer.prog}</strong></div>
                  <div className={styles.modalRow}><span>Rol</span><strong>{viewPlayer.rol}</strong></div>
                  <div className={styles.modalRow}><span>Estado</span>
                    <span className={
                      viewPlayer.estado === 'Titular' ? styles.badgeTitular :
                      viewPlayer.estado === 'Reserva' ? styles.badgeReserva : styles.badgeSuspendido
                    }>{viewPlayer.estado}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roster table */}
        <div className={styles.rosterCard}>
          <div className={styles.rosterTitle}>Equipo Roster ({roster.length} jugadores)</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  <th>Posición</th>
                  <th>Semestre</th>
                  <th>Programa</th>
                  <th>Estado</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((p, i) => (
                  <React.Fragment key={p.num}>
                    <tr className={p.suspended ? styles.suspendedRow : ''}>
                      <td className={styles.numCell}>{p.num}</td>
                      <td>
                        <div className={styles.playerCell}>
                          <div className={styles.avatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                            {p.initials}
                          </div>
                          <div>
                            <div className={styles.playerName}>{p.name}</div>
                            {p.suspended && <span className={styles.suspTag}>Suspendido</span>}
                          </div>
                        </div>
                      </td>
                      <td>{p.pos}</td>
                      <td>{p.sem}</td>
                      <td>{p.prog}</td>
                      <td>
                        {editIdx === i ? (
                          <select
                            className={styles.editSelect}
                            value={editEstado}
                            onChange={e => setEditEstado(e.target.value as Estado)}
                          >
                            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                          </select>
                        ) : (
                          <span className={
                            p.estado === 'Titular' ? styles.badgeTitular :
                            p.estado === 'Reserva' ? styles.badgeReserva : styles.badgeSuspendido
                          }>{p.estado}</span>
                        )}
                      </td>
                      <td>{p.rol}</td>
                      <td>
                        {editIdx === i ? (
                          <div className={styles.actions}>
                            <button className={styles.actSave} onClick={() => saveEdit(i)} title="Guardar">✓</button>
                            <button className={styles.actBtn} onClick={() => setEditIdx(null)} title="Cancelar">✕</button>
                          </div>
                        ) : confirmDel === i ? (
                          <div className={styles.actions}>
                            <button className={styles.actDel} onClick={() => doDelete(i)} title="Confirmar">✓ Sí</button>
                            <button className={styles.actBtn} onClick={cancelDel} title="Cancelar">No</button>
                          </div>
                        ) : (
                          <div className={styles.actions}>
                            <button className={styles.actBtn} title="Ver detalles" onClick={() => openView(p)}>👁</button>
                            <button className={styles.actBtn} title="Editar estado" onClick={() => openEdit(i)}>✏️</button>
                            <button className={`${styles.actBtn} ${styles.actDel}`} title="Eliminar jugador" onClick={() => askDelete(i)}>🗑</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr className={styles.tableFooter}>
                  <th>#</th><th>Jugador</th><th>Posición</th><th>Semestre</th>
                  <th>Programa</th><th>Estado</th><th>Rol</th><th>Acciones</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
