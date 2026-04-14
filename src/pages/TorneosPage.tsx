import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './TorneosPage.module.css';

const STATS = [
  { color: '#16a34a', num: 6, label: 'Torneos Realizados' },
  { color: '#2563eb', num: 48, label: 'Equipos Participantes' },
  { color: '#ea580c', num: 186, label: 'Partidos Jugados' },
];

const TORNEOS = [
  {
    id: 'techcup-2026-1',
    nombre: 'TechCup 2026-1',
    estado: 'En Curso',
    fechas: '15 Ene 2026 - 20 Mar 2026',
    equipos: 8,
    partidos: 24,
    campeon: null,
    subcampeon: null,
  },
  {
    id: 'techcup-2025-2',
    nombre: 'TechCup 2025-2',
    estado: 'Finalizado',
    fechas: '10 Ago 2025 - 15 Dic 2025',
    equipos: 8,
    partidos: 31,
    campeon: 'FC KERNEL',
    subcampeon: 'LOS DEBUGGERS',
  },
  {
    id: 'techcup-2025-1',
    nombre: 'TechCup 2025-1',
    estado: 'Finalizado',
    fechas: '20 Ene 2025 - 25 Mar 2025',
    equipos: 8,
    partidos: 31,
    campeon: 'NULL PTR FC',
    subcampeon: 'STACK OVERFLOW',
  },
  {
    id: 'techcup-2024-2',
    nombre: 'TechCup 2024-2',
    estado: 'Finalizado',
    fechas: '05 Ago 2024 - 10 Dic 2024',
    equipos: 8,
    partidos: 31,
    campeon: 'STACK OVERFLOW',
    subcampeon: 'SEGFAULT FC',
  },
  {
    id: 'techcup-2024-1',
    nombre: 'TechCup 2024-1',
    estado: 'Finalizado',
    fechas: '15 Ene 2024 - 20 Mar 2024',
    equipos: 8,
    partidos: 31,
    campeon: 'LOS DEBUGGERS',
    subcampeon: 'FC KERNEL',
  },
  {
    id: 'techcup-2023-2',
    nombre: 'TechCup 2023-2',
    estado: 'Finalizado',
    fechas: '10 Ago 2023 - 15 Dic 2023',
    equipos: 8,
    partidos: 31,
    campeon: 'SEGFAULT FC',
    subcampeon: 'NULL PTR FC',
  },
];

export const TorneosPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <h1 className={styles.title}>Torneos TechCup</h1>
        <p className={styles.sub}>Historial completo de torneos y competiciones</p>

        {/* Stats */}
        <div className={styles.statsRow}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statSquare} style={{ background: s.color }} />
              <div>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Torneos list */}
        <div className={styles.list}>
          {TORNEOS.map((t, i) => (
            <div key={i} className={styles.torneoRow}>
              <div className={styles.torneoLeft}>
                <div className={styles.torneoLogo}>
                  <span className={styles.torneoLogoInner} />
                </div>
                <div className={styles.torneoInfo}>
                  <div className={styles.torneoNameRow}>
                    <span className={styles.torneoName}>{t.nombre}</span>
                    <span className={t.estado === 'En Curso' ? styles.badgeCurso : styles.badgeFin}>
                      {t.estado}
                    </span>
                  </div>
                  <div className={styles.torneoDates}>
                    <span>📅 {t.fechas}</span>
                    <span>👥 {t.equipos} equipos</span>
                    <span>👤 {t.partidos} partidos</span>
                  </div>
                  {t.campeon && (
                    <div className={styles.torneoChamp}>
                      <span>🏆 <strong>Campeón:</strong> {t.campeon}</span>
                      <span><strong>Subcampeón:</strong> {t.subcampeon}</span>
                    </div>
                  )}
                </div>
              </div>
              <button className={styles.detailLink} onClick={() => navigate(`/tournament/${t.id}`)}>
                Ver detalles →
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
