import apiClient from './axiosConfig';

export const playerService = {
  async getAllPlayers() {
    const response = await apiClient.get('/api/players');
    return response.data;
  },

  async getPlayer(id: number | string) {
    const response = await apiClient.get(`/api/players/${id}`);
    return response.data;
  },

  async createPlayer(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/players', data);
    return response.data;
  },

  async updatePlayer(id: number | string, data: Record<string, unknown>) {
    const response = await apiClient.put(`/api/players/${id}`, data);
    return response.data;
  },

  async deletePlayer(id: number | string) {
    const response = await apiClient.delete(`/api/players/${id}`);
    return response.data;
  },

  async createSportProfile(userId: number | string, data: Record<string, unknown>) {
    const response = await apiClient.post(`/api/players/${userId}/sport-profile`, data);
    return response.data;
  },

  async getSportProfile(userId: number | string) {
    const response = await apiClient.get(`/api/players/${userId}/sport-profile`);
    return response.data;
  },

  async updateAvailability(userId: number | string, available: boolean) {
    const response = await apiClient.patch(`/api/players/${userId}/availability`, { available });
    return response.data;
  },
};
