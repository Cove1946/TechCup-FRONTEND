import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import styles from './CalendarPage.module.css';

type View = 'semanal' | 'mensual';

interface Match {
  id: number; date: string; timeLabel: string;
  home: string; homeInitials: string; homeColor: string;
  away: string; awayInitials: string; awayColor: string;
  cancha: string;
}

const MATCHES: Match[] = [
  { id: 1, date: '2026-04-13', timeLabel: '2:00 PM',  home: 'FC KERNEL',      homeInitials: 'FCK', homeColor: '#15803d', away: 'LOS DEBUGGERS',  awayInitials: 'DBG', awayColor: '#1e3a8a', cancha: 'Cancha 1' },
  { id: 2, date: '2026-04-13', timeLabel: '4:00 PM',  home: 'STACK OVERFLOW', homeInitials: 'SOF', homeColor: '#dc2626', away: 'BYTE FORCE',      awayInitials: 'BTF', awayColor: '#7c3aed', cancha: 'Cancha 2' },
  { id: 3, date: '2026-04-15', timeLabel: '3:00 PM',  home: 'NULL POINTERS',  homeInitials: 'NLP', homeColor: '#d97706', away: 'RUNTIME ERROR',   awayInitials: 'RTE', awayColor: '#0f766e', cancha: 'Cancha 1' },
  { id: 4, date: '2026-04-17', timeLabel: '10:00 AM', home: 'GIT PUSH FORCE', homeInitials: 'GPF', homeColor: '#4b5563', away: '404 NOT FOUND',   awayInitials: '404', awayColor: '#6b7280', cancha: 'Cancha 3' },
  { id: 5, date: '2026-04-19', timeLabel: '11:00 AM', home: 'FC KERNEL',      homeInitials: 'FCK', homeColor: '#15803d', away: 'BYTE FORCE',      awayInitials: 'BTF', awayColor: '#7c3aed', cancha: 'Cancha 2' },
  { id: 6, date: '2026-04-22', timeLabel: '3:00 PM',  home: 'LOS DEBUGGERS',  homeInitials: 'DBG', homeColor: '#1e3a8a', away: 'STACK OVERFLOW',  awayInitials: 'SOF', awayColor: '#dc2626', cancha: 'Cancha 1' },
  { id: 7, date: '2026-04-25', timeLabel: '5:00 PM',  home: 'STACK OVERFLOW', homeInitials: 'SOF', homeColor: '#dc2626', away: 'FC KERNEL',       awayInitials: 'FCK', awayColor: '#15803d', cancha: 'Cancha 2' },
];

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const WEEK_LABELS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getMonday(d: Date): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d); mon.setDate(diff); mon.setHours(0,0,0,0);
  return mon;
}

function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(d.getDate() + i); return d;
  });
}

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date(2026, 3, 14);

  const [view, setView]           = useState<View>('semanal');
  const [weekStart, setWeekStart] = useState<Date>(getMonday(today));
  const [selectedDay, setSelectedDay] = useState<string>(toYMD(today));
  const [monthDate, setMonthDate] = useState<Date>(new Date(2026, 3, 1));

  const weekDates = getWeekDates(weekStart);
  const matchesForDay = MATCHES.filter(m => m.date === selectedDay);

  // Monthly grid
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Calendario</h1>
            <p className={styles.sub}>TechCup 2026-1 · Partidos programados</p>
          </div>
          <div className={styles.viewToggle}>
            <button className={view === 'semanal' ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('semanal')}>Semanal</button>
            <button className={view === 'mensual' ? styles.toggleActive : styles.toggleBtn} onClick={() => setView('mensual')}>Mensual</button>
          </div>
        </div>

        {/* ── SEMANAL ── */}
        {view === 'semanal' && (
          <>
            <div className={styles.weekNav}>
              <button className={styles.navArrow} onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate()-7); setWeekStart(d); }}>‹</button>
              <span className={styles.weekRange}>
                {weekDates[0].getDate()} {MONTHS[weekDates[0].getMonth()]} – {weekDates[6].getDate()} {MONTHS[weekDates[6].getMonth()]} {weekDates[6].getFullYear()}
              </span>
              <button className={styles.navArrow} onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate()+7); setWeekStart(d); }}>›</button>
            </div>

            <div className={styles.dayStrip}>
              {weekDates.map((d, i) => {
                const ymd = toYMD(d);
                const hasMatch = MATCHES.some(m => m.date === ymd);
                const isActive = ymd === selectedDay;
                return (
                  <button key={i} className={isActive ? styles.dayBtnActive : styles.dayBtn} onClick={() => setSelectedDay(ymd)}>
                    <span className={styles.dayName}>{WEEK_LABELS[i]}</span>
                    <span className={styles.dayNum}>{d.getDate()}</span>
                    {hasMatch && <span className={styles.dayDot} />}
                  </button>
                );
              })}
            </div>

            {matchesForDay.length === 0 ? (
              <div className={styles.emptyState}>No hay partidos programados para este día</div>
            ) : (
              <div className={styles.matchGrid}>
                {matchesForDay.map(m => (
                  <div key={m.id} className={styles.matchCard}>
                    <div className={styles.cardTop}>
                      <span className={styles.proxBadge}>Próximo</span>
                      <span className={styles.canchaLabel}>📍 {m.cancha}</span>
                    </div>
                    <div className={styles.cardTime}>{m.timeLabel}</div>
                    <div className={styles.cardTeams}>
                      <div className={styles.cardTeam}>
                        <div className={styles.teamCircle} style={{ background: m.homeColor }}>{m.homeInitials}</div>
                        <span className={styles.teamNameCard}>{m.home}</span>
                      </div>
                      <span className={styles.vsLabel}>VS</span>
                      <div className={styles.cardTeam}>
                        <div className={styles.teamCircle} style={{ background: m.awayColor }}>{m.awayInitials}</div>
                        <span className={styles.teamNameCard}>{m.away}</span>
                      </div>
                    </div>
                    <button className={styles.alineBtn} onClick={() => navigate('/alineacion')}>
                      Ver alineaciones
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── MENSUAL ── */}
        {view === 'mensual' && (
          <>
            <div className={styles.monthNav}>
              <button className={styles.navArrow} onClick={() => setMonthDate(new Date(year, month-1, 1))}>‹</button>
              <span className={styles.monthTitle}>{MONTHS[month]} {year}</span>
              <button className={styles.navArrow} onClick={() => setMonthDate(new Date(year, month+1, 1))}>›</button>
            </div>

            <div className={styles.calGrid}>
              {WEEK_LABELS.map(d => (
                <div key={d} className={styles.calDayHeader}>{d}</div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={i} className={styles.calCell} />;
                const ymd = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const dayMatches = MATCHES.filter(m => m.date === ymd);
                const isToday = ymd === toYMD(today);
                return (
                  <div key={i} className={`${styles.calCell} ${isToday ? styles.calCellToday : ''}`}>
                    <span className={`${styles.calDayNum} ${isToday ? styles.calDayNumToday : ''}`}>{day}</span>
                    {dayMatches.map(m => (
                      <div key={m.id} className={styles.calMatchPill}
                        onClick={() => { setView('semanal'); setWeekStart(getMonday(new Date(m.date))); setSelectedDay(m.date); }}>
                        {m.timeLabel} · {m.home} vs {m.away}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};
