import apiClient from './axiosConfig';

export const tournamentService = {
  async getTournaments() {
    const response = await apiClient.get('/api/tournaments');
    return response.data;
  },

  async getFinalizedTournaments() {
    const response = await apiClient.get('/api/tournaments/finalized');
    return response.data;
  },

  async getTournament(tournamentId: number | string) {
    const response = await apiClient.get(`/api/tournaments/${tournamentId}`);
    return response.data;
  },

  async createTournament(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/tournaments', data);
    return response.data;
  },

  async startTournament(tournamentId: number | string) {
    const response = await apiClient.patch(`/api/tournaments/${tournamentId}/start`);
    return response.data;
  },

  async finishTournament(tournamentId: number | string) {
    const response = await apiClient.patch(`/api/tournaments/${tournamentId}/finish`);
    return response.data;
  },

  async getTournamentConfig(tournamentId: number | string) {
    const response = await apiClient.get(`/api/tournaments/${tournamentId}/config`);
    return response.data;
  },

  async saveTournamentConfig(tournamentId: number | string, data: Record<string, unknown>) {
    const response = await apiClient.post(`/api/tournaments/${tournamentId}/config`, data);
    return response.data;
  },

  async getTournamentVenues(tournamentId: number | string) {
    const response = await apiClient.get(`/api/tournaments/${tournamentId}/venues`);
    return response.data;
  },

  async addVenue(tournamentId: number | string, data: Record<string, unknown>) {
    const response = await apiClient.post(`/api/tournaments/${tournamentId}/venues`, data);
    return response.data;
  },

  async getTournamentStatistics(tournamentId: number | string) {
    const response = await apiClient.get(`/api/tournaments/${tournamentId}/statistics`);
    return response.data;
  },

  async getTournamentHistory() {
    const response = await apiClient.get('/api/tournaments/historial');
    return response.data;
  },

  async getTournamentHistoryById(tournamentId: number | string) {
    const response = await apiClient.get(`/api/tournaments/${tournamentId}/historial`);
    return response.data;
  },
};
