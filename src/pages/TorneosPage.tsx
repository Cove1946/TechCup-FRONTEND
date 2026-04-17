import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { tournamentService } from '../api/tournamentService';
import styles from './TorneosPage.module.css';

interface Torneo {
  id: number;
  nombre: string;
  temporada: string;
  equipos: number;
  maxEquipos: number;
  inicio: string;
  fin: string;
  cancha: string;
  estado: 'activo' | 'proximo' | 'finalizado';
  descripcion: string;
}

const ESTADO_CONFIG = {
  activo:     { label: 'Activo',     bg: '#f0fdf4', color: '#15803d' },
  proximo:    { label: 'Próximo',    bg: '#eff6ff', color: '#1e3a8a' },
  finalizado: { label: 'Finalizado', bg: '#f3f4f6', color: '#6b7280' },
};

export const TorneosPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Torneo | null>(null);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const data = await tournamentService.getTournaments();
        setTorneos(data);
      } catch {
        setError('No se pudieron cargar los torneos');
      } finally {
        setLoading(false);
      }
    };
    fetchTorneos();
  }, []);

  if (loading) return <MainLayout><div className={styles.page}>Cargando torneos...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.page}>{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Gestión de torneos</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Torneos</h1>
        </div>

        <div className={styles.cardList}>
          {torneos.map(t => {
            const cfg = ESTADO_CONFIG[t.estado] ?? ESTADO_CONFIG['proximo'];
            return (
              <div key={t.id} className={`${styles.card} ${selected?.id === t.id ? styles.cardSelected : ''}`}
                onClick={() => setSelected(prev => prev?.id === t.id ? null : t)}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.estadoBadge} style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    <h2 className={styles.cardTitle}>{t.nombre}</h2>
                    <p className={styles.cardTemp}>Temporada {t.temporada}</p>
                  </div>
                  <div className={styles.equiposBadge}>
                    <span className={styles.equiposNum}>{t.equipos}</span>
                    <span className={styles.equiposLbl}>/ {t.maxEquipos}</span>
                    <span className={styles.equiposTxt}>equipos</span>
                  </div>
                </div>

                <p className={styles.cardDesc}>{t.descripcion}</p>

                <div className={styles.cardMeta}>
                  <span>📅 {t.inicio} → {t.fin}</span>
                  <span>📍 {t.cancha}</span>
                </div>

                {selected?.id === t.id && (
                  <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    {t.estado === 'activo' && (
                      <>
                        <button className={styles.btnPrimary} onClick={() => navigate('/llaves')}>🔑 Ver llaves</button>
                        <button className={styles.btnOutline} onClick={() => navigate('/tabla')}>📊 Tabla de posiciones</button>
                        <button className={styles.btnOutline} onClick={() => navigate('/calendar')}>📅 Calendario</button>
                      </>
                    )}
                    {t.estado === 'proximo' && (
                      <button className={styles.btnPrimary} onClick={() => navigate('/create-team')}>✅ Inscribir equipo</button>
                    )}
                    {t.estado === 'finalizado' && (
                      <button className={styles.btnOutline} onClick={() => navigate('/estadisticas')}>📈 Ver estadísticas</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};
