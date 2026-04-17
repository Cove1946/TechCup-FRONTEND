import React, { useEffect, useState } from 'react';
import { MainLayout } from '@components/layout';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../api/matchService';
import styles from './DashboardPage.module.css';

// TODO: backend endpoint needed – GET /api/tournaments/active/stats
// Should return { partidosJugados, totalPartidos, golesTotales, tarjetasAmarillas }
// for the current active tournament.

interface Match {
  id: number;
  home: string;
  away: string;
  date: string;
  timeLabel: string;
  cancha: string;
}

const ROLE_LABELS: Record<string, string> = {
  jugador:     'Jugador',
  capitan:     'Capitán',
  coordinador: 'Coordinador',
  arbitro:     'Árbitro',
  admin:       'Administrador',
};

interface Invitation {
  id: number | string;
  teamId: number | string;
  teamName: string;
  captainName?: string;
}

const BANNER_ACTIONS: Record<string, { label: string; to: string; outline?: boolean }[]> = {
  jugador:     [{ label: 'Mi Equipo', to: '/my-team' }],
  capitan:     [{ label: 'Mi Equipo', to: '/my-team' }, { label: 'Alineación', to: '/alineacion', outline: true }, { label: 'Crear Equipo +', to: '/teams/create', outline: true }],
  coordinador: [{ label: 'Ver Torneos', to: '/torneos' }, { label: 'Gestión de Pagos', to: '/organizer/payments', outline: true }, { label: 'Configurar Torneo', to: '/organizer/config', outline: true }],
  arbitro:     [{ label: 'Panel Árbitro', to: '/arbitro' }, { label: 'Ver Calendario', to: '/calendar', outline: true }],
  admin:       [{ label: 'Gestión de Pagos', to: '/organizer/payments' }, { label: 'Gestión de Roles', to: '/admin/roles', outline: true }, { label: 'Configurar Torneo', to: '/organizer/config', outline: true }],
};

// TODO: backend endpoint needed – obtain active tournamentId for the current user's context
const ACTIVE_TOURNAMENT_ID = 1;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let user = { name: 'Usuario', role: 'jugador' };
  try { if (userStr) user = JSON.parse(userStr); } catch { /* localStorage corrupto */ }
  const role    = (user.role ?? 'jugador').toLowerCase();
  const actions = BANNER_ACTIONS[role] ?? BANNER_ACTIONS['jugador'];

  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [respondingId, setRespondingId] = useState<number | string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchService.getMatchesByTournament(ACTIVE_TOURNAMENT_ID);
        // Show only the next 3 upcoming matches
        setMatches(data.slice(0, 3));
      } catch {
        // Non-critical: dashboard still renders without matches
      } finally {
        setLoadingMatches(false);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    if (role !== 'jugador' || !user.id) return;
    const fetchInvitations = async () => {
      setLoadingInvitations(true);
      try {
        const data = await teamService.getPlayerInvitations(user.id!);
        setInvitations(data);
      } catch {
        // Non-critical
      } finally {
        setLoadingInvitations(false);
      }
    };
    fetchInvitations();
  }, [role, user.id]);

  const handleRespond = async (invitationId: number | string, accepted: boolean) => {
    setRespondingId(invitationId);
    try {
      await teamService.respondInvitation(invitationId, { accepted });
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch {
      // TODO: show error toast
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <MainLayout>
      <div className={styles.dashboard}>

        {/* ── Banner ── */}
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <p className={styles.bannerGreet}>👋 Bienvenido de regreso</p>
            <h1 className={styles.bannerName}>{user.name}</h1>
            <p className={styles.bannerInfo}>{user.role ?? 'Jugador'} · 2026-1</p>
            <div className={styles.bannerActions}>
              {actions.map(a => (
                <button
                  key={a.to}
                  className={a.outline ? styles.bannerBtnOutline : styles.bannerBtn}
                  onClick={() => navigate(a.to)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.bannerBadge}>
            <div className={styles.shield}>
              <span className={styles.shieldEmoji}>🛡️</span>
            </div>
          </div>
        </div>

        {/* ── Bottom grid ── */}
        <div className={role === 'jugador' ? styles.bottomGrid : ''}>

          {/* ── Próximos Partidos ── */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}><span>📅</span><span>Próximos Partidos</span></div>
              <button className={styles.seeAll} onClick={() => navigate('/calendar')}>Ver todos →</button>
            </div>
            {loadingMatches ? (
              <div className={styles.matchList}>Cargando partidos...</div>
            ) : matches.length === 0 ? (
              <div className={styles.matchList}>No hay partidos próximos</div>
            ) : (
              <div className={styles.matchList}>
                {matches.map((m, i) => (
                  <div key={i} className={styles.matchRow}>
                    <span className={styles.matchHome}>{m.home}</span>
                    <span className={styles.matchVs}>VS</span>
                    <span className={styles.matchAway}>{m.away}</span>
                    <div className={styles.matchMeta}>
                      <span className={styles.matchDate}>📅 {m.date}</span>
                      <span className={styles.matchTime}>🕒 {m.timeLabel}</span>
                      <span className={styles.canchaTag}>🏟 {m.cancha}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Solicitudes de Equipo (jugador only) ── */}
          {role === 'jugador' && (
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}><span>📨</span><span>Solicitudes de Equipo</span></div>
              </div>
              {loadingInvitations ? (
                <p className={styles.emptyState}>Cargando solicitudes...</p>
              ) : invitations.length === 0 ? (
                <p className={styles.emptyState}>No tienes solicitudes pendientes</p>
              ) : (
                <div className={styles.invitationList}>
                  {invitations.map(inv => (
                    <div key={inv.id} className={styles.invitationCard}>
                      <div className={styles.invitationInfo}>
                        <span className={styles.invitationTeam}>{inv.teamName}</span>
                        {inv.captainName && (
                          <span className={styles.invitationCapitan}>Capitán: {inv.captainName}</span>
                        )}
                      </div>
                      <div className={styles.invitationActions}>
                        <button
                          className={styles.btnDetail}
                          onClick={() => navigate(`/teams/${inv.teamId}`)}
                        >
                          Ver detalle
                        </button>
                        <button
                          className={styles.btnAccept}
                          onClick={() => handleRespond(inv.id, true)}
                          disabled={respondingId === inv.id}
                        >
                          Aceptar
                        </button>
                        <button
                          className={styles.btnReject}
                          onClick={() => handleRespond(inv.id, false)}
                          disabled={respondingId === inv.id}
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};
