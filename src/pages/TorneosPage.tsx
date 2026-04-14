import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
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

const TORNEOS: Torneo[] = [
  {
    id: 1,
    nombre: 'TechCup Primavera 2026',
    temporada: '2026-1',
    equipos: 12,
    maxEquipos: 16,
    inicio: '1 Mar 2026',
    fin: '30 Jun 2026',
    cancha: 'Cancha Principal TecNM',
    estado: 'activo',
    descripcion: 'Torneo universitario de fútbol rápido 7v7 para equipos de la carrera de Sistemas.',
  },
  {
    id: 2,
    nombre: 'TechCup Otoño 2025',
    temporada: '2025-2',
    equipos: 10,
    maxEquipos: 10,
    inicio: '1 Sep 2025',
    fin: '15 Dic 2025',
    cancha: 'Cancha B',
    estado: 'finalizado',
    descripcion: 'Segunda edición del torneo universitario. 10 equipos participaron en formato de eliminación directa.',
  },
  {
    id: 3,
    nombre: 'TechCup Verano 2026',
    temporada: '2026-2',
    equipos: 0,
    maxEquipos: 16,
    inicio: '15 Jul 2026',
    fin: '30 Oct 2026',
    cancha: 'Por definir',
    estado: 'proximo',
    descripcion: 'Convocatoria abierta. Inscripciones disponibles a partir del 1 de julio.',
  },
];

const ESTADO_CONFIG = {
  activo:     { label: 'Activo',     bg: '#f0fdf4', color: '#15803d' },
  proximo:    { label: 'Próximo',    bg: '#eff6ff', color: '#1e3a8a' },
  finalizado: { label: 'Finalizado', bg: '#f3f4f6', color: '#6b7280' },
};

export const TorneosPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Torneo | null>(null);

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <p className={styles.subtitle}>Gestión de torneos</p>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Torneos</h1>
        </div>

        <div className={styles.cardList}>
          {TORNEOS.map(t => {
            const cfg = ESTADO_CONFIG[t.estado];
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
