import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import styles from './ResultadosPage.module.css';

type EventType = 'goal' | 'yellow' | 'red';

interface TimelineEvent {
  minute: number;
  type: EventType;
  player: string;
  team: 'home' | 'away';
}

interface Match {
  home: string; homeScore: number; homeColor: string; homeInitials: string;
  away: string; awayScore: number; awayColor: string; awayInitials: string;
  events: TimelineEvent[];
}

interface Jornada { num: number; date: string; matches: Match[]; }

const JORNADAS: Jornada[] = [
  {
    num: 8, date: 'Mar 10, 2026',
    matches: [{
      home: 'LOS DEBUGGERS', homeScore: 7, homeColor: '#1e3a8a', homeInitials: 'DBG',
      away: 'SEGFAULT FC',   awayScore: 6, awayColor: '#7c3aed', awayInitials: 'SGF',
      events: [
        { minute: 12, type: 'goal',   player: 'Carlos P.',   team: 'home' },
        { minute: 18, type: 'goal',   player: 'Juan G.',     team: 'away' },
        { minute: 22, type: 'yellow', player: 'Diego L.',    team: 'away' },
        { minute: 25, type: 'goal',   player: 'Luis M.',     team: 'home' },
        { minute: 30, type: 'goal',   player: 'Pedro S.',    team: 'away' },
        { minute: 35, type: 'goal',   player: 'M. Torres',   team: 'home' },
        { minute: 38, type: 'yellow', player: 'Rogelio B.',  team: 'home' },
        { minute: 40, type: 'goal',   player: 'D. López',    team: 'away' },
        { minute: 42, type: 'goal',   player: 'Antonio R.',  team: 'home' },
        { minute: 43, type: 'goal',   player: 'Pedro S.',    team: 'away' },
        { minute: 44, type: 'red',    player: 'Javier F.',   team: 'away' },
        { minute: 45, type: 'goal',   player: 'C. Pérez',    team: 'home' },
        { minute: 48, type: 'goal',   player: 'Roberto D.',  team: 'away' },
        { minute: 48, type: 'goal',   player: 'Antonio R.',  team: 'home' },
      ],
    }],
  },
  {
    num: 7, date: 'Mar 8, 2026',
    matches: [{
      home: 'RUNTIME ERRORS', homeScore: 6, homeColor: '#0f766e', homeInitials: 'RTE',
      away: 'NULL POINTERS',  awayScore: 5, awayColor: '#d97706', awayInitials: 'NLP',
      events: [
        { minute: 8,  type: 'goal',   player: 'Fernando R.',  team: 'home' },
        { minute: 15, type: 'goal',   player: 'Sergio M.',    team: 'away' },
        { minute: 20, type: 'yellow', player: 'Andrés V.',    team: 'away' },
        { minute: 22, type: 'goal',   player: 'Pablo C.',     team: 'home' },
        { minute: 28, type: 'goal',   player: 'Andrés V.',    team: 'away' },
        { minute: 33, type: 'goal',   player: 'Ricardo H.',   team: 'home' },
        { minute: 38, type: 'goal',   player: 'Manuel S.',    team: 'away' },
        { minute: 40, type: 'goal',   player: 'Gustavo M.',   team: 'home' },
        { minute: 42, type: 'yellow', player: 'Fernando R.',  team: 'home' },
        { minute: 44, type: 'goal',   player: 'Jorge O.',     team: 'away' },
        { minute: 46, type: 'goal',   player: 'Pablo C.',     team: 'home' },
        { minute: 48, type: 'goal',   player: 'Andrés V.',    team: 'away' },
      ],
    }],
  },
  {
    num: 6, date: 'Mar 5, 2026',
    matches: [{
      home: 'STACK OVERFLOW', homeScore: 5, homeColor: '#dc2626', homeInitials: 'SOF',
      away: 'FC KERNEL',      awayScore: 4, awayColor: '#15803d', awayInitials: 'FCK',
      events: [
        { minute: 10, type: 'goal',   player: 'Alberto V.',  team: 'home' },
        { minute: 16, type: 'goal',   player: 'Raúl G.',     team: 'away' },
        { minute: 20, type: 'goal',   player: 'Eduardo R.',  team: 'home' },
        { minute: 24, type: 'yellow', player: 'Iván R.',     team: 'home' },
        { minute: 25, type: 'goal',   player: 'Héctor J.',   team: 'away' },
        { minute: 30, type: 'yellow', player: 'Francisco M.', team: 'away' },
        { minute: 32, type: 'goal',   player: 'Iván R.',     team: 'home' },
        { minute: 38, type: 'goal',   player: 'Francisco M.', team: 'away' },
        { minute: 40, type: 'goal',   player: 'Alberto V.',  team: 'home' },
        { minute: 43, type: 'goal',   player: 'Óscar N.',    team: 'home' },
        { minute: 45, type: 'goal',   player: 'Héctor J.',   team: 'away' },
      ],
    }],
  },
];

const EVENT_ICON: Record<EventType, string> = { goal: '⚽', yellow: '🟨', red: '🟥' };
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

        <div className={styles.jornadasGrid}>
        {visible.map(j => (
          <div key={j.num} className={styles.jornada}>
            <div className={styles.jornadaHeader}>
              <span>📅</span>
              <span>Jornada {j.num}</span>
              <span className={styles.dot}>·</span>
              <span>{j.date}</span>
            </div>

            {j.matches.map((m, i) => {
              const homeWon = m.homeScore > m.awayScore;
              const awayWon = m.awayScore > m.homeScore;
              const sorted = [...m.events].sort((a, b) => a.minute - b.minute);

              return (
                <div key={i} className={styles.matchCard}>
                  {/* Score header */}
                  <div className={styles.scoreRow}>
                    <div className={styles.teamSide}>
                      <div className={styles.teamDot} style={{ background: m.homeColor }}>{m.homeInitials}</div>
                      <span className={`${styles.teamName} ${homeWon ? styles.winner : ''}`}>{m.home}</span>
                    </div>
                    <div className={styles.scoreBox}>
                      <span className={styles.scoreNum}>{m.homeScore}</span>
                      <span className={styles.scoreSep}>–</span>
                      <span className={styles.scoreNum}>{m.awayScore}</span>
                    </div>
                    <div className={styles.teamSideRight}>
                      <span className={`${styles.teamName} ${awayWon ? styles.winner : ''}`}>{m.away}</span>
                      <div className={styles.teamDot} style={{ background: m.awayColor }}>{m.awayInitials}</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className={styles.timeline}>
                    {sorted.map((ev, ei) => (
                      <div key={ei} className={styles.timelineRow}>
                        {/* Left: home events */}
                        <div className={styles.eventLeft}>
                          {ev.team === 'home' && (
                            <>
                              <span className={styles.eventPlayer}>{ev.player}</span>
                              <span className={styles.eventIcon}>{EVENT_ICON[ev.type]}</span>
                            </>
                          )}
                        </div>

                        {/* Center: minute */}
                        <div className={styles.minuteCol}>
                          <span className={styles.minuteDot} />
                          <span className={styles.minuteLabel}>{ev.minute}'</span>
                          <span className={styles.minuteDot} />
                        </div>

                        {/* Right: away events */}
                        <div className={styles.eventRight}>
                          {ev.team === 'away' && (
                            <>
                              <span className={styles.eventIcon}>{EVENT_ICON[ev.type]}</span>
                              <span className={styles.eventPlayer}>{ev.player}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Finalizados */}
                  <div className={styles.finalTag}>Finalizado</div>
                </div>
              );
            })}
          </div>
        ))}
        </div>

        <div className={styles.pagination}>
          <button className={styles.pgBtn} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Anterior</button>
          {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
            <button key={n} className={`${styles.pgNum} ${n === page ? styles.pgActive : ''}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button className={styles.pgBtn} onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Siguiente →</button>
        </div>
      </div>
    </MainLayout>
  );
};
