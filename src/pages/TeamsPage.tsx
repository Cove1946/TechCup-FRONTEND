import React, { useEffect, useState } from 'react';
import { MainLayout } from '@components/layout';
import { Card, Badge, Button } from '@components/ui';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../api/teamService';
import styles from './TeamsPage.module.css';

interface Team {
  id: number;
  name: string;
  captain: string;
  players: number;
  wins: number;
  losses: number;
  draws: number;
  position: number;
  status: 'active' | 'inactive';
}

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const userStr  = localStorage.getItem('user');
  const role     = (userStr ? JSON.parse(userStr).role : 'jugador').toLowerCase();
  const canCreate = ['capitan', 'admin', 'coordinador'].includes(role);

  // TODO: backend endpoint needed – obtain active tournamentId for the current user's context
  // Replace ACTIVE_TOURNAMENT_ID with the real tournamentId once that endpoint exists
  const ACTIVE_TOURNAMENT_ID = 1;

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamService.getTeamsByTournament(ACTIVE_TOURNAMENT_ID);
        setTeams(data);
      } catch {
        setError('No se pudieron cargar los equipos');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) return <MainLayout><div className={styles.teams}>Cargando equipos...</div></MainLayout>;
  if (error) return <MainLayout><div className={styles.teams}>{error}</div></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.teams}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
        <div className={styles.header}>
          <h1 className={styles.title}>Equipos</h1>
          {canCreate && (
            <Button variant="primary" onClick={() => navigate('/teams/create')}>
              + Crear Equipo
            </Button>
          )}
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
