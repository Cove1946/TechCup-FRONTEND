import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './CalendarPage.module.css';

type View = 'Mensual' | 'Semanal';

const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const WEEK_NUMS = [13, 14, 15, 16, 17, 18, 19];

const MATCHES = [
  { id: 1, hora: '2:00 PM', cancha: 'Cancha 2', local: 'FC KERNEL', visitante: 'NULL POINTER', fecha: '02 Mar', status: 'Próximo' },
  { id: 2, hora: '3:00 PM', cancha: 'Cancha 1', local: 'ERROR 404', visitante: 'TINTO FRIO FC', fecha: '02 Mar', status: 'Próximo' },
  { id: 3, hora: '4:00 PM', cancha: 'Cancha 2', local: 'FC PAISAS', visitante: 'LOS DEBUGGERS', fecha: '02 Mar', status: 'Próximo' },
  { id: 4, hora: '5:00 PM', cancha: 'Cancha 1', local: 'LOS SML FC', visitante: 'CRISTAL PAJAS', fecha: '02 Mar', status: 'Próximo' },
];

const MONTHLY_EVENTS: Record<number, string[]> = {
  2:  ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
  7:  ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
  15: ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
  18: ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
  19: ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
  24: ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
  31: ['3:00 PM - FC KERNEL vs LOS DEBUGGERS', '5:00 PM - NULL PTR FC vs STACK OVERFLOW'],
};

// Marzo 2026 starts on Sunday → col index 6 in Mon-Sun grid
const MARCH_START_COL = 6;
const MARCH_DAYS = 31;

function buildMonthGrid() {
  const cells: (number | null)[] = [];
  for (let i = 0; i < MARCH_START_COL; i++) cells.push(null);
  for (let d = 1; d <= MARCH_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export const CalendarPage: React.FC = () => {
  const [view, setView] = useState<View>('Semanal');
  const [selectedDay, setSelectedDay] = useState(0);

  const navigate = useNavigate();
  const cells = buildMonthGrid();

  return (
    <MainLayout>
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Calendario de Partidos</h1>
          <div className={styles.viewToggle}>
            <button
              className={view === 'Mensual' ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setView('Mensual')}
            >
              Mensual
            </button>
            <button
              className={view === 'Semanal' ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setView('Semanal')}
            >
              Semanal
            </button>
          </div>
        </div>

        {view === 'Semanal' ? (
          <>
            <div className={styles.weekRow}>
              {WEEK_DAYS.map((d, i) => (
                <button
                  key={i}
                  className={selectedDay === i ? styles.dayActive : styles.dayBtn}
                  onClick={() => setSelectedDay(i)}
                >
                  <span className={styles.dayLabel}>{d}</span>
                  <span className={styles.dayNum}>{WEEK_NUMS[i]}</span>
                </button>
              ))}
            </div>

            <h2 className={styles.dayHeading}>Domingo, 1 de Marzo</h2>

            <div className={styles.matchesGrid}>
              {MATCHES.map(m => (
                <div key={m.id} className={styles.matchCard}>
                  <div className={styles.matchCardTop}>
                    <span className={styles.matchHora}>{m.hora}</span>
                    <span className={styles.matchCancha}>{m.cancha}</span>
                  </div>
                  <span className={styles.proximoBadge}>Próximo</span>
                  <div className={styles.matchTeams}>
                    <div className={styles.teamSide}>
                      <div className={styles.teamCircle} />
                      <span className={styles.teamName}>{m.local}</span>
                    </div>
                    <span className={styles.vsSep}>VS</span>
                    <div className={`${styles.teamSide} ${styles.teamRight}`}>
                      <span className={styles.teamName}>{m.visitante}</span>
                      <div className={styles.teamCircleDark} />
                    </div>
                  </div>
                  <div className={styles.matchMeta}>
                    <span>📅 {m.fecha}</span>
                    <span>🕐 {m.hora}</span>
                  </div>
                  <button className={styles.alineBtn} onClick={() => navigate(`/alineacion/${m.id}`)}>👥 Ver alineaciones</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles.monthHeader}>
              <button className={styles.monthNav}>{'<'}</button>
              <span className={styles.monthTitle}>Marzo 2026</span>
              <button className={styles.monthNav}>{'>'}</button>
            </div>

            <div className={styles.monthGrid}>
              {WEEK_DAYS.map(d => (
                <div key={d} className={styles.monthDayHeader}>{d}</div>
              ))}
              {cells.map((day, i) => (
                <div key={i} className={day ? styles.monthCell : styles.monthCellEmpty}>
                  {day && (
                    <>
                      <span className={styles.monthDayNum}>{day}</span>
                      {MONTHLY_EVENTS[day]?.map((ev, j) => (
                        <div key={j} className={styles.eventChip}>{ev}</div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};
