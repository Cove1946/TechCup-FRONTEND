import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import styles from './MyTeamPage.module.css';

const ROSTER = [
  { num: 1, initials: 'CP', name: 'Carlos Pérez', pos: 'Delantero', sem: 'RF - 6', prog: 'Sistemas', estado: 'Titular', rol: 'Estudiante', suspended: false },
  { num: 2, initials: 'RB', name: 'Rogelio B.', pos: 'Central', sem: 'RF - 5', prog: 'Sistemas', estado: 'Suspendido', rol: 'Estudiante', suspended: true },
  { num: 3, initials: 'CB', name: 'Carlos Brotez', pos: 'Defensa', sem: 'RF - 5', prog: 'Estadística', estado: 'Titular', rol: 'Estudiante', suspended: false },
  { num: 4, initials: 'CG', name: 'Carlos Granma', pos: 'Centrocampista', sem: 'RF - 5', prog: 'Sistemas', estado: 'Titular', rol: 'Estudiante', suspended: false },
  { num: 5, initials: 'CB', name: 'Carlos Brotez', pos: 'Delantero', sem: 'RF - 5', prog: 'Ciberseguridad', estado: 'Titular', rol: 'Estudiante', suspended: false },
  { num: 6, initials: 'CP', name: 'Carlos Pérez', pos: 'Defensa', sem: 'RF - 4', prog: 'Ciberseguridad', estado: 'Titular', rol: 'Estudiante', suspended: false },
  { num: 7, initials: 'CP', name: 'Carlos Pérez', pos: 'defensa', sem: 'RF - 4', prog: 'Estadística', estado: 'Reserva', rol: 'Estudiante', suspended: false },
  { num: 8, initials: 'KP', name: 'Kanor Phonez', pos: 'Delantero', sem: 'RF - 4', prog: 'IA', estado: 'Reserva', rol: 'Estudiante', suspended: false },
  { num: 9, initials: 'RB', name: 'Rogelio B.', pos: 'Lateral', sem: 'RF - 3', prog: 'IA', estado: 'Reserva', rol: 'Estudiante', suspended: true },
  { num: 10, initials: 'CP', name: 'Carlos Pérez', pos: 'Lateral', sem: 'RF - 5', prog: 'Sistema', estado: 'Reserva', rol: 'Estudiante', suspended: false },
];

const AVATAR_COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c', '#0891b2', '#be185d'];

export const MyTeamPage: React.FC = () => {
  const [view, setView] = useState<'roster' | 'alineacion'>('roster');

  return (
    <MainLayout>
      <div className={styles.page}>
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
            <div className={styles.playerCount}>9 / 12 jugadores</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '75%' }} />
            </div>
          </div>
          <div className={styles.teamActions}>
            <button className={styles.btnOutline}>👤 Ver alineación</button>
            <button className={styles.btnGreen}>⊕ Invitar jugador</button>
            <button className={styles.btnOutline}>🗂 Gestionar pago</button>
          </div>
        </div>

        {/* Warning banner */}
        <div className={styles.warningBanner}>
          <span>⚠️</span>
          <span><strong>Rogelio B.</strong> está suspendido para el próximo partido por tarjeta roja (RF18)</span>
        </div>

        {/* Validation strip */}
        <div className={styles.validationStrip}>
          <span className={styles.validItem}>✓ Mínimo 7 jugadores</span>
          <span className={styles.validItem}>✓ Máximo 12 jugadores</span>
          <span className={styles.validItem}>✓ Elegibilidad de programas (88%)</span>
          <span className={styles.validItem}>✓ Sin duplicados</span>
        </div>

        {/* Roster table */}
        <div className={styles.rosterCard}>
          <div className={styles.rosterTitle}>Equipo Roster</div>
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
                {ROSTER.map((p, i) => (
                  <tr key={i} className={p.suspended ? styles.suspendedRow : ''}>
                    <td className={styles.numCell}>{p.num}</td>
                    <td>
                      <div className={styles.playerCell}>
                        <div
                          className={styles.avatar}
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
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
                      <span className={
                        p.estado === 'Titular' ? styles.badgeTitular :
                        p.estado === 'Reserva' ? styles.badgeReserva :
                        styles.badgeSuspendido
                      }>
                        {p.estado}
                      </span>
                    </td>
                    <td>{p.rol}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actBtn} title="Ver">👁</button>
                        <button className={styles.actBtn} title="Editar">✏️</button>
                        <button className={`${styles.actBtn} ${styles.actDel}`} title="Eliminar">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className={styles.tableFooter}>
                  <th>#</th>
                  <th>Jugador</th>
                  <th>Posición</th>
                  <th>Semestre</th>
                  <th>Programa</th>
                  <th>Estado</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
