import apiClient from './axiosConfig';

export const matchService = {
  async getMatchesByTournament(tournamentId: number | string) {
    const response = await apiClient.get(`/api/matches/tournament/${tournamentId}`);
    return response.data;
  },

  async getMatchHistory(tournamentId: number | string) {
    const response = await apiClient.get(`/api/matches/tournament/${tournamentId}/history`);
    return response.data;
  },

  async getStandings(tournamentId: number | string) {
    const response = await apiClient.get(`/api/matches/tournament/${tournamentId}/standings`);
    return response.data;
  },

  async getTopScorers(tournamentId: number | string) {
    const response = await apiClient.get(`/api/matches/tournament/${tournamentId}/top-scorers`);
    return response.data;
  },

  async getMatchSummary(matchId: number | string) {
    const response = await apiClient.get(`/api/matches/${matchId}/summary`);
    return response.data;
  },

  async getMatchLineup(matchId: number | string) {
    const response = await apiClient.get(`/api/matches/${matchId}/lineup`);
    return response.data;
  },

  async createMatch(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/matches', data);
    return response.data;
  },

  async recordResult(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/matches/result', data);
    return response.data;
  },

  async recordEvent(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/matches/event', data);
    return response.data;
  },

  async submitLineup(matchId: number | string, data: Record<string, unknown>) {
    const response = await apiClient.post(`/api/matches/${matchId}/lineup`, data);
    return response.data;
  },

  async getMatchesByReferee(refereeId: number | string) {
    const response = await apiClient.get(`/api/matches/referee/${refereeId}`);
    return response.data;
  },

  async generateBracket(tournamentId: number | string) {
    const response = await apiClient.post(`/api/matches/bracket/${tournamentId}`);
    return response.data;
  },
};
