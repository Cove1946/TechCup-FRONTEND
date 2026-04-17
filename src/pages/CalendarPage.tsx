import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { matchService } from '../api/matchService';
import styles from './CalendarPage.module.css';

type View = 'semanal' | 'mensual';

interface Match {
  id: number; date: string; timeLabel: string;
  home: string; homeInitials: string; homeColor: string;
  away: string; awayInitials: string; awayColor: string;
  cancha: string;
}

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
  const today = new Date();

  const [view, setView]           = useState<View>('semanal');
  const [weekStart, setWeekStart] = useState<Date>(getMonday(today));
  const [selectedDay, setSelectedDay] = useState<string>(toYMD(today));
  const [monthDate, setMonthDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [matches, setMatches]     = useState<Match[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // TODO: backend endpoint needed – obtain active tournamentId for the current user's context
  const ACTIVE_TOURNAMENT_ID = 1;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchService.getMatchesByTournament(ACTIVE_TOURNAMENT_ID);
        setMatches(data);
      } catch {
        setError('No se pudieron cargar los partidos');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const weekDates = getWeekDates(weekStart);
  const matchesForDay = matches.filter(m => m.date === selectedDay);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  if (loading) return <MainLayout><div className={styles.page}>Cargando calendario...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.page}>{error}</div></MainLayout>;

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
                const hasMatch = matches.some(m => m.date === ymd);
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
                const dayMatches = matches.filter(m => m.date === ymd);
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
