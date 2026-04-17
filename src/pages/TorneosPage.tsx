import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { tournamentService } from '../api/tournamentService';
import styles from './TorneosPage.module.css';

interface Torneo {
  id: number;
  name?: string;
  startDate: string;
  endDate: string;
  totalTeams: number;
  registrationCost: number;
  status: string;
  organizerName?: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  SKETCH:     { label: 'Borrador',   bg: '#fefce8', color: '#854d0e' },
  ACTIVE:     { label: 'Activo',     bg: '#f0fdf4', color: '#15803d' },
  INPROGRESS: { label: 'En curso',   bg: '#eff6ff', color: '#1e3a8a' },
  FINALIZED:  { label: 'Finalizado', bg: '#f3f4f6', color: '#6b7280' },
};

export const TorneosPage: React.FC = () => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  let userRole = 'jugador';
  let userId = 0;
  try {
    if (userStr) {
      const u = JSON.parse(userStr);
      userRole = u.role ?? 'jugador';
      userId   = u.userId ?? 0;
    }
  } catch { /* ignore */ }
  const canManage = ['admin', 'coordinador'].includes(userRole);

  const [selected, setSelected]     = useState<number | null>(null);
  const [torneos, setTorneos]       = useState<Torneo[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [deleting, setDeleting]     = useState<number | null>(null);
  const [advancing, setAdvancing]   = useState<number | null>(null);

  const loadTorneos = () => {
    tournamentService.getTournaments()
      .then(setTorneos)
      .catch(() => setError('No se pudieron cargar los torneos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTorneos(); }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este torneo en borrador? Esta acción no se puede deshacer.')) return;
    setDeleting(id);
    try {
      await tournamentService.deleteTournament(id);
      setTorneos(prev => prev.filter(t => t.id !== id));
      if (selected === id) setSelected(null);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al eliminar el torneo.');
    } finally {
      setDeleting(null);
    }
  };

  const handleAdvance = async (t: Torneo, e: React.MouseEvent) => {
    e.stopPropagation();
    const labels: Record<string, string> = {
      SKETCH: 'activar', ACTIVE: 'iniciar', INPROGRESS: 'finalizar',
    };
    if (!confirm(`¿${labels[t.status] ?? 'avanzar'} este torneo?`)) return;
    setAdvancing(t.id);
    try {
      if (t.status === 'SKETCH')     await tournamentService.startTournament(userId, t.id);
      else if (t.status === 'ACTIVE') await tournamentService.progressTournament(t.id);
      else if (t.status === 'INPROGRESS') await tournamentService.finishTournament(userId, t.id);
      loadTorneos();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al cambiar el estado del torneo.');
    } finally {
      setAdvancing(null);
    }
  };

  if (loading) return <MainLayout><div className={styles.page}>Cargando torneos...</div></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Gestión de torneos</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Torneos</h1>
          {canManage && (
            <button className={styles.btnPrimary} onClick={() => navigate('/organizer/config')}>
              + Crear Torneo
            </button>
          )}
        </div>

        {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}

        {torneos.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay torneos registrados aún.</p>
            {canManage && (
              <button className={styles.btnPrimary} onClick={() => navigate('/organizer/config')}>
                + Crear primer torneo
              </button>
            )}
          </div>
        ) : (
          <div className={styles.cardList}>
            {torneos.map(t => {
              const cfg = STATUS_CONFIG[t.status] ?? STATUS_CONFIG['PENDING'];
              const isOpen = selected === t.id;
              return (
                <div key={t.id}
                  className={`${styles.card} ${isOpen ? styles.cardSelected : ''}`}
                  onClick={() => setSelected(prev => prev === t.id ? null : t.id)}>

                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.estadoBadge} style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <h2 className={styles.cardTitle}>{t.name ?? `Torneo #${t.id}`}</h2>
                      {t.organizerName && <p className={styles.cardTemp}>Org: {t.organizerName}</p>}
                    </div>
                    <div className={styles.equiposBadge}>
                      <span className={styles.equiposNum}>{t.totalTeams}</span>
                      <span className={styles.equiposTxt}>equipos máx.</span>
                    </div>
                  </div>

                  <div className={styles.cardMeta}>
                    <span>📅 {t.startDate} → {t.endDate}</span>
                    <span>💵 ${t.registrationCost}</span>
                  </div>

                  {isOpen && (
                    <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                      {t.status !== 'SKETCH' && (
                        <>
                          <button className={styles.btnOutline} onClick={() => navigate('/llaves')}>🔑 Ver llaves</button>
                          <button className={styles.btnOutline} onClick={() => navigate('/tabla')}>📊 Posiciones</button>
                          <button className={styles.btnOutline} onClick={() => navigate('/calendar')}>📅 Calendario</button>
                          {canManage && (
                            <button className={styles.btnOutline} onClick={() => navigate('/estadisticas')}>📈 Estadísticas</button>
                          )}
                        </>
                      )}
                      {canManage && t.status === 'SKETCH' && (
                        <button className={styles.btnOutline} onClick={() => navigate(`/organizer/config/${t.id}`)}>
                          ✏️ Editar
                        </button>
                      )}
                      {canManage && t.status !== 'FINALIZED' && (
                        <button
                          className={styles.btnPrimary}
                          disabled={advancing === t.id}
                          onClick={e => handleAdvance(t, e)}
                        >
                          {advancing === t.id ? 'Procesando...' : (
                            t.status === 'SKETCH'     ? '▶ Activar torneo' :
                            t.status === 'ACTIVE'     ? '▶ Iniciar torneo' :
                                                        '🏁 Finalizar torneo'
                          )}
                        </button>
                      )}
                      {canManage && t.status === 'SKETCH' && (
                        <button
                          className={styles.btnDanger}
                          disabled={deleting === t.id}
                          onClick={e => handleDelete(t.id, e)}
                        >
                          {deleting === t.id ? 'Eliminando...' : '🗑 Eliminar'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
