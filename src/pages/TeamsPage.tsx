import React from 'react';
import { MainLayout } from '@components/layout';
import { Card, Badge, Button } from '@components/ui';
import { useNavigate } from 'react-router-dom';
import styles from './TeamsPage.module.css';

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();

  const teams = [
    {
      id: 1,
      name: 'Ingeniería de Sistemas',
      captain: 'Carlos Rodríguez',
      players: 18,
      wins: 8,
      losses: 2,
      draws: 2,
      position: 2,
      status: 'active' as const,
    },
    {
      id: 2,
      name: 'Ingeniería Civil',
      captain: 'María González',
      players: 16,
      wins: 10,
      losses: 1,
      draws: 1,
      position: 1,
      status: 'active' as const,
    },
    {
      id: 3,
      name: 'Ingeniería Industrial',
      captain: 'Pedro Martínez',
      players: 15,
      wins: 5,
      losses: 5,
      draws: 2,
      position: 4,
      status: 'inactive' as const,
    },
  ];

  return (
    <MainLayout>
      <div className={styles.teams}>
        <div className={styles.header}>
          <h1 className={styles.title}>Equipos</h1>
          <Button variant="primary" onClick={() => navigate('/teams/create')}>
            + Crear Equipo
          </Button>
        </div>

        <div className={styles.teamsList}>
          {teams.map((team) => (
            <Card key={team.id} hoverable onClick={() => navigate(`/teams/${team.id}`)}>
              <div className={styles.teamCard}>
                <div className={styles.teamHeader}>
                  <div>
                    <h3 className={styles.teamName}>{team.name}</h3>
                    <p className={styles.teamCaptain}>Capitán: {team.captain}</p>
                  </div>
                  <Badge variant={team.status === 'active' ? 'success' : 'warning'}>
                    {team.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>

                <div className={styles.teamStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Jugadores</span>
                    <span className={styles.statValue}>{team.players}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Victorias</span>
                    <span className={styles.statValue}>{team.wins}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Derrotas</span>
                    <span className={styles.statValue}>{team.losses}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Empates</span>
                    <span className={styles.statValue}>{team.draws}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Posición</span>
                    <span className={`${styles.statValue} ${styles.position}`}>
                      {team.position}°
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};