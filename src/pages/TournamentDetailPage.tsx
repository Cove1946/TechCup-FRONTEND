import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { Card, Badge } from '@components/ui';
import styles from './TournamentDetailPage.module.css';

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const standings = [
    { position: 1, team: 'Ingeniería Civil', played: 12, won: 10, drawn: 1, lost: 1, points: 31 },
    { position: 2, team: 'Ingeniería de Sistemas', played: 12, won: 8, drawn: 2, lost: 2, points: 26 },
    { position: 3, team: 'Ingeniería Eléctrica', played: 12, won: 7, drawn: 3, lost: 2, points: 24 },
    { position: 4, team: 'Ingeniería Industrial', played: 12, won: 5, drawn: 2, lost: 5, points: 17 },
  ];

  return (
    <MainLayout>
      <div className={styles.tournament}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>TechCup 2026</h1>
            <p className={styles.subtitle}>Torneo Universitario de Fútbol</p>
          </div>
          <Badge variant="success" size="medium">
            En Curso
          </Badge>
        </div>

        <div className={styles.infoGrid}>
          <Card>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Equipos</span>
              <span className={styles.infoValue}>8</span>
            </div>
          </Card>
          <Card>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Partidos Jugados</span>
              <span className={styles.infoValue}>24</span>
            </div>
          </Card>
          <Card>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Goles</span>
              <span className={styles.infoValue}>68</span>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className={styles.sectionTitle}>Tabla de Posiciones</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.pos}>Pos</span>
              <span className={styles.teamName}>Equipo</span>
              <span>PJ</span>
              <span>G</span>
              <span>E</span>
              <span>P</span>
              <span>Pts</span>
            </div>
            {standings.map((team) => (
              <div
                key={team.position}
                className={`${styles.tableRow} ${
                  team.position <= 2 ? styles.qualified : ''
                }`}
              >
                <span className={styles.pos}>{team.position}</span>
                <span className={styles.teamName}>{team.team}</span>
                <span>{team.played}</span>
                <span>{team.won}</span>
                <span>{team.drawn}</span>
                <span>{team.lost}</span>
                <span className={styles.points}>{team.points}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};