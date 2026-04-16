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
  const user    = userStr ? JSON.parse(userStr) : { name: 'Usuario', role: 'jugador' };
  const role    = (user.role ?? 'jugador').toLowerCase();
  const actions = BANNER_ACTIONS[role] ?? BANNER_ACTIONS['jugador'];

  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

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

      </div>
    </MainLayout>
  );
};
