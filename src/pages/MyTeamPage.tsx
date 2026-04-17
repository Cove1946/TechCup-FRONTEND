import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { teamService } from '../api/teamService';
import styles from './MyTeamPage.module.css';

interface Player {
  num: number; initials: string; name: string; pos: string;
  sem: string; prog: string; estado: string; rol: string; suspended: boolean;
  goles?: number; asistencias?: number; partidos?: number; tarjAm?: number; tarjRoj?: number;
}

interface TeamData {
  id: number;
  name: string;
  captain: string;
  uniform: string;
  players: Player[];
}

const AVATAR_COLORS = ['#16a34a','#2563eb','#9333ea','#ea580c','#0891b2','#be185d'];

// TODO: backend endpoint needed – obtain current user's teamId from session/profile
const MY_TEAM_ID = 1;

export const MyTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem('user');
  const role     = (userStr ? JSON.parse(userStr).role : 'jugador').toLowerCase();
  const canEdit  = role === 'capitan' || role === 'admin';

  const [teamData, setTeamData]         = useState<TeamData | null>(null);
  const [roster, setRoster]             = useState<Player[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [confirmDel, setConfirmDel]     = useState<number | null>(null);
  const [editingNum, setEditingNum]     = useState<number | null>(null);
  const [editPos, setEditPos]           = useState('');
  const [editEstado, setEditEstado]     = useState('');
  const [toast, setToast]               = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamService.getTeam(MY_TEAM_ID);
        setTeamData(data);
        setRoster(data.players ?? []);
      } catch {
        setError('No se pudo cargar el equipo');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleDelete = async (num: number) => {
    const player = roster.find(p => p.num === num);
    if (!player) return;
    try {
      await teamService.removeMember(MY_TEAM_ID, player.num);
      setRoster(prev => prev.filter(p => p.num !== num));
      setConfirmDel(null);
      if (selectedPlayer?.num === num) setSelectedPlayer(null);
      showToast('Jugador eliminado del equipo');
    } catch {
      showToast('Error al eliminar el jugador');
    }
  };

  const handleEditSave = async (num: number) => {
    // TODO: backend endpoint needed – PUT/PATCH /api/teams/{teamId}/members/{playerId}
    // Should update the player's position and status within the team.
    setRoster(prev => prev.map(p => p.num === num ? { ...p, pos: editPos, estado: editEstado } : p));
    if (selectedPlayer?.num === num) setSelectedPlayer(prev => prev ? { ...prev, pos: editPos, estado: editEstado } : prev);
    setEditingNum(null);
    showToast('Jugador actualizado correctamente');
  };

  if (loading) return <MainLayout><div className={styles.page}>Cargando equipo...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.page}>{error}</div></MainLayout>;

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

        <div className={styles.teamCard}>
          <div className={styles.teamLeft}>
            <div className={styles.shield}>🛡️</div>
            <div className={styles.teamInfo}>
              <div className={styles.teamName}>{teamData?.name ?? ''}</div>
              <div className={styles.teamMeta}>Uniforme: {teamData?.uniform ?? ''}</div>
              <div className={styles.teamMeta}>Capitán: {teamData?.captain ?? ''}</div>
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
