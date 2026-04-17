import apiClient from './axiosConfig';

export const teamService = {
  async getTeam(teamId: number | string) {
    const response = await apiClient.get(`/api/teams/${teamId}`);
    return response.data;
  },

  async getTeamsByTournament(tournamentId: number | string) {
    const response = await apiClient.get(`/api/teams/tournament/${tournamentId}`);
    return response.data;
  },

  async createTeam(captainId: number | string, data: Record<string, unknown>) {
    const response = await apiClient.post('/api/teams', data, { params: { captainId } });
    return response.data;
  },

  async invitePlayer(captainId: number | string, teamId: number | string, playerId: number | string) {
    const response = await apiClient.post(`/api/teams/${teamId}/invite`, null, {
      params: { captainId, playerId },
    });
    return response.data;
  },

  async respondInvitation(invitationId: number | string, data: { accepted: boolean }) {
    const response = await apiClient.patch(`/api/teams/invitations/${invitationId}/respond`, data);
    return response.data;
  },

  async getPlayerInvitations(playerId: number | string) {
    const response = await apiClient.get(`/api/teams/invitations/player/${playerId}`);
    return response.data;
  },

  async getAvailablePlayers() {
    const response = await apiClient.get('/api/teams/players/available');
    return response.data;
  },

  async removeMember(teamId: number | string, playerId: number | string) {
    const response = await apiClient.delete(`/api/teams/${teamId}/members/${playerId}`);
    return response.data;
  },

  async validateTeam(teamId: number | string) {
    const response = await apiClient.post(`/api/teams/${teamId}/validate`);
    return response.data;
  },
};
