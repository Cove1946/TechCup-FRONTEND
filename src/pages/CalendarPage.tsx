import React, { useState } from 'react';
import { MainLayout } from '@components/layout';
import { Card, Badge } from '@components/ui';
import styles from './CalendarPage.module.css';

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const matches = [
    {
      id: 1,
      date: '2026-04-15',
      time: '15:00',
      homeTeam: 'Ingeniería de Sistemas',
      awayTeam: 'Ingeniería Civil',
      location: 'Cancha Principal',
      status: 'scheduled' as const,
    },
    {
      id: 2,
      date: '2026-04-20',
      time: '18:00',
      homeTeam: 'Ingeniería Industrial',
      awayTeam: 'Ingeniería de Sistemas',
      location: 'Estadio Norte',
      status: 'scheduled' as const,
    },
    {
      id: 3,
      date: '2026-04-10',
      time: '16:00',
      homeTeam: 'Ingeniería de Sistemas',
      awayTeam: 'Ingeniería Eléctrica',
      location: 'Cancha Sur',
      status: 'completed' as const,
      score: '3-1',
    },
  ];

  const upcoming = matches.filter((m) => m.status === 'scheduled');
  const completed = matches.filter((m) => m.status === 'completed');

  return (
    <MainLayout>
      <div className={styles.calendar}>
        <h1 className={styles.title}>Calendario de Partidos</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Próximos Partidos</h2>
          <div className={styles.matchesList}>
            {upcoming.map((match) => (
              <Card key={match.id} hoverable>
                <div className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <Badge variant="info">{match.date}</Badge>
                    <span className={styles.time}>{match.time}</span>
                  </div>
                  <div className={styles.matchTeams}>
                    <span className={styles.team}>{match.homeTeam}</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.team}>{match.awayTeam}</span>
                  </div>
                  <div className={styles.matchLocation}>
                    📍 {match.location}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Partidos Pasados</h2>
          <div className={styles.matchesList}>
            {completed.map((match) => (
              <Card key={match.id}>
                <div className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <Badge variant="success">Finalizado</Badge>
                    <span className={styles.score}>{match.score}</span>
                  </div>
                  <div className={styles.matchTeams}>
                    <span className={styles.team}>{match.homeTeam}</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.team}>{match.awayTeam}</span>
                  </div>
                  <div className={styles.matchDate}>
                    {match.date} • {match.time}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};