import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import styles from './ResultadosPage.module.css';

interface Scorer { name: string; goals: number; time: string; }
interface Match {
  home: string; homeScore: number; homeLogo?: string;
  away: string; awayScore: number; awayLogo?: string;
  homeScorers: Scorer[]; awayScorers: Scorer[];
}
interface Jornada { num: number; date: string; matches: Match[]; }

const JORNADAS: Jornada[] = [
  {
    num: 8, date: 'Mar 10, 2026',
    matches: [{
      home: 'LOS DEBUGGERS', homeScore: 7,
      away: 'SEGFAULT FC', awayScore: 6,
      homeScorers: [
        { name: 'Carlos Pérez', goals: 2, time: "12'" },
        { name: 'Luis Martínez', goals: 1, time: "25'" },
        { name: 'Miguel Torres', goals: 2, time: "35'" },
        { name: 'Antonio Ruiz', goals: 2, time: "42'" },
      ],
      awayScorers: [
        { name: 'Juan García', goals: 1, time: "18'" },
        { name: 'Pedro Sánchez', goals: 2, time: "30'" },
        { name: 'Diego López', goals: 1, time: "40'" },
        { name: 'Javier Fernández', goals: 1, time: "45'" },
        { name: 'Roberto Díaz', goals: 1, time: "48'" },
      ],
    }],
  },
  {
    num: 7, date: 'Mar 8, 2026',
    matches: [{
      home: 'RUNTIME ERRORS', homeScore: 6,
      away: 'NULL POINTERS', awayScore: 5,
      homeScorers: [
        { name: 'Fernando Ramos', goals: 2, time: "8'" },
        { name: 'Pablo Castro', goals: 2, time: "22'" },
        { name: 'Ricardo Herrera', goals: 1, time: "33'" },
        { name: 'Gustavo Mendoza', goals: 1, time: "40'" },
      ],
      awayScorers: [
        { name: 'Sergio Morales', goals: 1, time: "15'" },
        { name: 'Andrés Vargas', goals: 2, time: "28'" },
        { name: 'Manuel Silva', goals: 1, time: "38'" },
        { name: 'Jorge Ortiz', goals: 1, time: "44'" },
      ],
    }],
  },
  {
    num: 6, date: 'Mar 5, 2026',
    matches: [{
      home: 'STACK OVERFLOW', homeScore: 5,
      away: 'FC KERNEL', awayScore: 4,
      homeScorers: [
        { name: 'Alberto Vega', goals: 2, time: "10'" },
        { name: 'Eduardo Rojas', goals: 1, time: "20'" },
        { name: 'Iván Romero', goals: 1, time: "32'" },
        { name: 'Óscar Núñez', goals: 1, time: "43'" },
      ],
      awayScorers: [
        { name: 'Raúl Guerrero', goals: 1, time: "16'" },
        { name: 'Héctor Jiménez', goals: 2, time: "25'" },
        { name: 'Francisco Medina', goals: 1, time: "38'" },
      ],
    }],
  },
];

const PAGE_SIZE = 2;

export const ResultadosPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(JORNADAS.length / PAGE_SIZE);
  const visible = JORNADAS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Resultados</h1>
            <p className={styles.sub}>Partidos finalizados del torneo</p>
          </div>
          <span className={styles.badge}>2026-1 – Activo</span>
        </div>

        {visible.map(j => (
          <div key={j.num} className={styles.jornada}>
            <div className={styles.jornadaHeader}>
              <span>📅</span>
              <span>Jornada {j.num}</span>
              <span className={styles.dot}>•</span>
              <span>{j.date}</span>
            </div>

            {j.matches.map((m, i) => {
              const homeWon = m.homeScore > m.awayScore;
              const awayWon = m.awayScore > m.homeScore;
              return (
                <div key={i} className={styles.matchCard}>
                  <div className={styles.scoreLine}>
                    <span className={`${styles.team} ${homeWon ? styles.winner : ''}`}>{m.home}</span>
                    <div className={styles.scoreBox}>
                      <div className={styles.teamLogo}>⚽</div>
                      <span className={styles.scoreNum}>{m.homeScore}</span>
                      <span className={styles.scoreSep}>–</span>
                      <span className={styles.scoreNum}>{m.awayScore}</span>
                      <div className={styles.teamLogo}>⚽</div>
                    </div>
                    <span className={`${styles.team} ${awayWon ? styles.winner : ''}`}>{m.away}</span>
                  </div>

                  <div className={styles.scorers}>
                    <p className={styles.scorersTitle}>Goleadores</p>
                    <div className={styles.scorersCols}>
                      <div className={styles.scorerCol}>
                        {m.homeScorers.map((s, si) => (
                          <div key={si} className={styles.scorerRow}>
                            <span className={styles.ballIco}>⚽</span>
                            <span className={styles.scorerName}>
                              {s.name}{s.goals > 1 && <span className={styles.goals}> (x{s.goals})</span>}
                            </span>
                            <span className={styles.scorerTime}>{s.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.scorerCol}>
                        {m.awayScorers.map((s, si) => (
                          <div key={si} className={styles.scorerRow}>
                            <span className={styles.ballIco}>⚽</span>
                            <span className={styles.scorerName}>
                              {s.name}{s.goals > 1 && <span className={styles.goals}> (x{s.goals})</span>}
                            </span>
                            <span className={styles.scorerTime}>{s.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Paginación */}
        <div className={styles.pagination}>
          <button className={styles.pgBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              className={`${styles.pgNum} ${n === page ? styles.pgActive : ''}`}
              onClick={() => setPage(n)}
            >{n}</button>
          ))}
          <button className={styles.pgBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Siguiente →
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
