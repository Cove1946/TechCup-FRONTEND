import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { matchService } from '../api/matchService';
import { tournamentService } from '../api/tournamentService';
import styles from './EstadisticasPage.module.css';

interface Jugador {
  pos: number; name: string; equipo: string; initials: string; color: string;
  goles: number; partidos: number; tarjAm: number; tarjRoj: number;
}

interface TournamentStats {
  jornadasJugadas: number;
  equipos: number;
  golesTotales: number;
  partidosJugados: number;
}

type SortKey = 'goles' | 'partidos';

export const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>('goles');
  const [selected, setSelected] = useState<Jugador | null>(null);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [stats, setStats] = useState<TournamentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: backend endpoint needed – obtain active tournamentId for the current user's context
  const ACTIVE_TOURNAMENT_ID = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scorers, tournamentStats] = await Promise.all([
          matchService.getTopScorers(ACTIVE_TOURNAMENT_ID),
          tournamentService.getTournamentStatistics(ACTIVE_TOURNAMENT_ID),
        ]);
        setJugadores(scorers);
        setStats(tournamentStats);
      } catch {
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <MainLayout><div className={styles.page}>Cargando estadísticas...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.page}>{error}</div></MainLayout>;

  // Sorting is presentation-only; backend sends data already ordered by goals by default
  const sorted = [...jugadores].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Temporada 2026-1</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Estadísticas</h1>
          <div className={styles.sortBtns}>
            {(['goles', 'partidos'] as SortKey[]).map(k => (
              <button key={k} className={sortBy === k ? styles.sortBtnActive : styles.sortBtn}
                onClick={() => setSortBy(k)}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <div className={styles.summaryRow}>
            <div className={styles.summaryCard}><span className={styles.summaryNum}>{stats.jornadasJugadas}</span><span className={styles.summaryLbl}>Jornadas jugadas</span></div>
            <div className={styles.summaryCard}><span className={styles.summaryNum}>{stats.equipos}</span><span className={styles.summaryLbl}>Equipos</span></div>
            <div className={styles.summaryCard}><span className={styles.summaryNum}>{stats.golesTotales}</span><span className={styles.summaryLbl}>Goles totales</span></div>
            <div className={styles.summaryCard}><span className={styles.summaryNum}>{stats.partidosJugados}</span><span className={styles.summaryLbl}>Partidos jugados</span></div>
          </div>
        )}

        <p className={styles.hint}>Haz click en un jugador para ver sus detalles</p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th className={sortBy === 'goles' ? styles.thActive : ''}>⚽ Goles</th>
                <th className={sortBy === 'partidos' ? styles.thActive : ''}>🕐 Partidos</th>
                <th>🟡</th>
                <th>🔴</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((j, idx) => (
                <tr key={j.name} className={`${idx === 0 ? styles.topRow : ''} ${styles.clickableRow}`}
                  onClick={() => setSelected(j)}>
                  <td className={styles.posCell}>
                    {idx === 0 ? <span className={styles.goldBadge}>1</span> : idx + 1}
                  </td>
                  <td>
                    <div className={styles.playerCell}>
                      <div className={styles.avatar} style={{ background: j.color }}>{j.initials}</div>
                      <span className={styles.playerName}>{j.name}</span>
                    </div>
                  </td>
                  <td className={styles.equipoCell}>{j.equipo}</td>
                  <td className={`${styles.statCell} ${sortBy === 'goles' ? styles.statCellActive : ''}`}>{j.goles}</td>
                  <td className={`${styles.statCell} ${sortBy === 'partidos' ? styles.statCellActive : ''}`}>{j.partidos}</td>
                  <td className={styles.cardCell}>{j.tarjAm > 0 && <span className={styles.yellowCard}>{j.tarjAm}</span>}</td>
                  <td className={styles.cardCell}>{j.tarjRoj > 0 && <span className={styles.redCard}>{j.tarjRoj}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className={styles.overlay} onClick={() => setSelected(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalAvatar} style={{ background: selected.color }}>{selected.initials}</div>
                <div className={styles.modalInfo}>
                  <div className={styles.modalName}>{selected.name}</div>
                  <div className={styles.modalEquipo}>{selected.equipo}</div>
                </div>
                <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className={styles.modalStats}>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum}>{selected.goles}</span>
                  <span className={styles.modalLbl}>Goles</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum}>{selected.partidos}</span>
                  <span className={styles.modalLbl}>Partidos</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum} style={{ color: '#d97706' }}>{selected.tarjAm}</span>
                  <span className={styles.modalLbl}>T. Amarillas</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum} style={{ color: '#dc2626' }}>{selected.tarjRoj}</span>
                  <span className={styles.modalLbl}>T. Rojas</span>
                </div>
                <div className={styles.modalStat}>
                  <span className={styles.modalNum}>{selected.goles > 0 ? (selected.goles / selected.partidos).toFixed(1) : '0.0'}</span>
                  <span className={styles.modalLbl}>Goles/partido</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
