import React from 'react';
import { MainLayout } from '@components/layout';
import { Card, Badge, Button } from '@components/ui';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Partidos Jugados', value: '12', trend: '+2' },
    { label: 'Victorias', value: '8', trend: '+1' },
    { label: 'Goles Anotados', value: '24', trend: '+5' },
    { label: 'Posición', value: '2°', trend: '↑' },
  ];

  const upcomingMatches = [
    {
      id: 1,
      homeTeam: 'Mi Equipo',
      awayTeam: 'Rival FC',
      date: '2026-04-15',
      time: '15:00',
      location: 'Cancha Principal',
    },
    {
      id: 2,
      homeTeam: 'Universidad X',
      awayTeam: 'Mi Equipo',
      date: '2026-04-20',
      time: '18:00',
      location: 'Estadio Norte',
    },
  ];

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <Badge variant="success">Temporada 2026</Badge>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.statValue}>
                  <span className={styles.value}>{stat.value}</span>
                  <span className={styles.trend}>{stat.trend}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Próximos Partidos</h2>
          <div className={styles.matchesList}>
            {upcomingMatches.map((match) => (
              <Card key={match.id} hoverable onClick={() => navigate(`/match/${match.id}`)}>
                <div className={styles.match}>
                  <div className={styles.matchTeams}>
                    <span className={styles.team}>{match.homeTeam}</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.team}>{match.awayTeam}</span>
                  </div>
                  <div className={styles.matchDetails}>
                    <span>{match.date} • {match.time}</span>
                    <span>{match.location}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => navigate('/teams')}>
            Ver Mi Equipo
          </Button>
          <Button variant="outline" onClick={() => navigate('/calendar')}>
            Ver Calendario Completo
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};