import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './MyTeamPage.module.css';

interface Player {
  num: number; initials: string; name: string; pos: string;
  sem: string; prog: string; estado: string; rol: string; suspended: boolean;
  goles?: number; asistencias?: number; partidos?: number; tarjAm?: number; tarjRoj?: number;
}

const ROSTER: Player[] = [
  { num: 1,  initials: 'CP', name: 'Carlos Pérez',   pos: 'Delantero',    sem: 'RF-6', prog: 'Sistemas',       estado: 'Titular',    rol: 'Capitán',    suspended: false, goles: 8, asistencias: 3, partidos: 6, tarjAm: 1, tarjRoj: 0 },
  { num: 2,  initials: 'RB', name: 'Rogelio B.',     pos: 'Central',      sem: 'RF-5', prog: 'Sistemas',       estado: 'Suspendido', rol: 'Estudiante', suspended: true,  goles: 2, asistencias: 1, partidos: 5, tarjAm: 3, tarjRoj: 1 },
  { num: 3,  initials: 'CB', name: 'Carlos Brotez',  pos: 'Defensa',      sem: 'RF-5', prog: 'Estadística',    estado: 'Titular',    rol: 'Estudiante', suspended: false, goles: 0, asistencias: 2, partidos: 6, tarjAm: 0, tarjRoj: 0 },
  { num: 4,  initials: 'CG', name: 'Carlos Granma',  pos: 'Centrocampista',sem: 'RF-5', prog: 'Sistemas',      estado: 'Titular',    rol: 'Estudiante', suspended: false, goles: 3, asistencias: 4, partidos: 6, tarjAm: 1, tarjRoj: 0 },
  { num: 5,  initials: 'CB', name: 'Carlos Brotez',  pos: 'Delantero',    sem: 'RF-5', prog: 'Ciberseguridad', estado: 'Titular',    rol: 'Estudiante', suspended: false, goles: 5, asistencias: 2, partidos: 5, tarjAm: 0, tarjRoj: 0 },
  { num: 6,  initials: 'CP', name: 'Carlos Pérez',   pos: 'Defensa',      sem: 'RF-4', prog: 'Ciberseguridad', estado: 'Titular',    rol: 'Estudiante', suspended: false, goles: 1, asistencias: 0, partidos: 4, tarjAm: 2, tarjRoj: 0 },
  { num: 7,  initials: 'CP', name: 'Carlos Pérez',   pos: 'Defensa',      sem: 'RF-4', prog: 'Estadística',    estado: 'Reserva',    rol: 'Estudiante', suspended: false, goles: 0, asistencias: 1, partidos: 3, tarjAm: 0, tarjRoj: 0 },
  { num: 8,  initials: 'KP', name: 'Kanor Phonez',   pos: 'Delantero',    sem: 'RF-4', prog: 'IA',             estado: 'Reserva',    rol: 'Estudiante', suspended: false, goles: 2, asistencias: 3, partidos: 4, tarjAm: 0, tarjRoj: 0 },
  { num: 9,  initials: 'RB', name: 'Rogelio B.',     pos: 'Lateral',      sem: 'RF-3', prog: 'IA',             estado: 'Reserva',    rol: 'Estudiante', suspended: true,  goles: 0, asistencias: 0, partidos: 2, tarjAm: 1, tarjRoj: 1 },
  { num: 10, initials: 'CP', name: 'Carlos Pérez',   pos: 'Lateral',      sem: 'RF-5', prog: 'Sistemas',       estado: 'Reserva',    rol: 'Estudiante', suspended: false, goles: 1, asistencias: 2, partidos: 5, tarjAm: 0, tarjRoj: 0 },
];

const AVATAR_COLORS = ['#16a34a','#2563eb','#9333ea','#ea580c','#0891b2','#be185d'];

export const MyTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem('user');
  const role     = (userStr ? JSON.parse(userStr).role : 'jugador').toLowerCase();
  const canEdit  = role === 'capitan' || role === 'admin';

  const [roster, setRoster]         = useState<Player[]>(ROSTER);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [editingNum, setEditingNum] = useState<number | null>(null);
  const [editPos, setEditPos]       = useState('');
  const [editEstado, setEditEstado] = useState('');
  const [toast, setToast]           = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDelete = (num: number) => {
    setRoster(prev => prev.filter(p => p.num !== num));
    setConfirmDel(null);
    if (selectedPlayer?.num === num) setSelectedPlayer(null);
    showToast('Jugador eliminado del equipo');
  };

  const handleEditSave = (num: number) => {
    setRoster(prev => prev.map(p => p.num === num ? { ...p, pos: editPos, estado: editEstado } : p));
    if (selectedPlayer?.num === num) setSelectedPlayer(prev => prev ? { ...prev, pos: editPos, estado: editEstado } : prev);
    setEditingNum(null);
    showToast('Jugador actualizado correctamente');
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        {toast && <div className={styles.toast}>{toast}</div>}

        <div className={styles.topRow}>
          <div>
            <h1 className={styles.title}>Mi Equipo</h1>
            <p className={styles.sub}>Temporada 2026-1 · Gestión de equipo</p>
          </div>
          <span className={styles.activeBadge}>2026-1 · Activo</span>
        </div>

        {/* Team header */}
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
            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${(roster.length/12)*100}%` }} /></div>
          </div>
          <div className={styles.teamActions}>
            <button className={styles.btnOutline} onClick={() => navigate('/alineacion')}>👤 Ver alineación</button>
            {canEdit && <button className={styles.btnGreen} onClick={() => navigate('/search-players')}>⊕ Invitar jugador</button>}
            {canEdit && <button className={styles.btnOutline} onClick={() => navigate('/payment')}>🗂 Gestionar pago</button>}
          </div>
        </div>

        {roster.some(p => p.suspended) && (
          <div className={styles.warningBanner}>
            <span>⚠️</span>
            <span><strong>{roster.find(p => p.suspended)?.name}</strong> está suspendido para el próximo partido por tarjeta roja</span>
          </div>
        )}

        <div className={styles.validationStrip}>
          <span className={styles.validItem}>✓ Mínimo 7 jugadores</span>
          <span className={styles.validItem}>✓ Máximo 12 jugadores</span>
          <span className={styles.validItem}>✓ Elegibilidad de programas (88%)</span>
          <span className={styles.validItem}>✓ Sin duplicados</span>
        </div>

        <div className={styles.rosterCard}>
          <div className={styles.rosterTitle}>Equipo Roster <span className={styles.rosterHint}>— Haz click en un jugador para ver su perfil</span></div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th><th>Jugador</th><th>Posición</th><th>Estado</th>
                  {canEdit && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {roster.map((p, i) => (
                  <tr key={p.num} className={p.suspended ? styles.suspendedRow : ''}>
                    <td className={styles.numCell}>{p.num}</td>
                    <td>
                      <div className={styles.playerCell} onClick={() => setSelectedPlayer(p)} style={{ cursor: 'pointer' }}>
                        <div className={styles.avatar} style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{p.initials}</div>
                        <div>
                          <div className={styles.playerName}>
                              {p.name}
                              {p.rol === 'Capitán' && <span className={styles.captainBadge} title="Capitán">©</span>}
                            </div>
                          {p.suspended && <span className={styles.suspTag}>Suspendido</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {canEdit && editingNum === p.num
                        ? <input className={styles.inlineInput} value={editPos} onChange={e => setEditPos(e.target.value)} />
                        : p.pos}
                    </td>
                    <td>
                      {canEdit && editingNum === p.num
                        ? (
                          <select className={styles.inlineInput} value={editEstado} onChange={e => setEditEstado(e.target.value)}>
                            {['Titular','Reserva','Suspendido'].map(e => <option key={e}>{e}</option>)}
                          </select>
                        )
                        : (
                          <span className={p.estado === 'Titular' ? styles.badgeTitular : p.estado === 'Reserva' ? styles.badgeReserva : styles.badgeSuspendido}>
                            {p.estado}
                          </span>
                        )}
                    </td>
                    {canEdit && (
                      <td>
                        <div className={styles.actions}>
                          {editingNum === p.num ? (
                            <>
                              <button className={styles.actSave} onClick={() => handleEditSave(p.num)}>✓</button>
                              <button className={styles.actBtn} onClick={() => setEditingNum(null)}>✕</button>
                            </>
                          ) : (
                            <>
                              <button className={styles.actBtn} title="Ver perfil" onClick={() => setSelectedPlayer(p)}>👁</button>
                              <button className={styles.actBtn} title="Editar" onClick={() => { setEditingNum(p.num); setEditPos(p.pos); setEditEstado(p.estado); }}>✏️</button>
                              {confirmDel === p.num
                                ? <>
                                    <button className={styles.actDanger} onClick={() => handleDelete(p.num)}>¿Eliminar?</button>
                                    <button className={styles.actBtn} onClick={() => setConfirmDel(null)}>No</button>
                                  </>
                                : <button className={`${styles.actBtn} ${styles.actDel}`} title="Eliminar" onClick={() => setConfirmDel(p.num)}>🗑</button>
                              }
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal jugador */}
        {selectedPlayer && (
          <div className={styles.modalOverlay} onClick={() => setSelectedPlayer(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalAvatar} style={{ background: AVATAR_COLORS[roster.findIndex(p => p.num === selectedPlayer.num) % AVATAR_COLORS.length] }}>
                  {selectedPlayer.initials}
                </div>
                <div>
                  <div className={styles.modalName}>{selectedPlayer.name}</div>
                  <div className={styles.modalSub}>#{selectedPlayer.num} · {selectedPlayer.pos} · {selectedPlayer.prog}</div>
                </div>
                <button className={styles.modalClose} onClick={() => setSelectedPlayer(null)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalRow}><span className={styles.modalKey}>Semestre</span><span className={styles.modalVal}>{selectedPlayer.sem}</span></div>
                <div className={styles.modalRow}><span className={styles.modalKey}>Estado</span>
                  <span className={selectedPlayer.estado === 'Titular' ? styles.badgeTitular : selectedPlayer.estado === 'Reserva' ? styles.badgeReserva : styles.badgeSuspendido}>
                    {selectedPlayer.estado}
                  </span>
                </div>
                <div className={styles.modalRow}><span className={styles.modalKey}>Rol</span><span className={styles.modalVal}>{selectedPlayer.rol}</span></div>
                {selectedPlayer.suspended && (
                  <div className={styles.modalAlert}>⚠️ Jugador suspendido — no puede participar en el próximo partido</div>
                )}
                <div className={styles.modalStats}>
                  <div className={styles.modalStat}><span className={styles.modalStatNum}>{selectedPlayer.goles ?? 0}</span><span className={styles.modalStatLbl}>Goles</span></div>
                  <div className={styles.modalStat}><span className={styles.modalStatNum}>{selectedPlayer.asistencias ?? 0}</span><span className={styles.modalStatLbl}>Asistencias</span></div>
                  <div className={styles.modalStat}><span className={styles.modalStatNum}>{selectedPlayer.partidos ?? 0}</span><span className={styles.modalStatLbl}>Partidos</span></div>
                  <div className={styles.modalStat}><span className={styles.modalStatNum} style={{color:'#d97706'}}>{selectedPlayer.tarjAm ?? 0}</span><span className={styles.modalStatLbl}>T. Amarillas</span></div>
                  <div className={styles.modalStat}><span className={styles.modalStatNum} style={{color:'#dc2626'}}>{selectedPlayer.tarjRoj ?? 0}</span><span className={styles.modalStatLbl}>T. Rojas</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
