import apiClient from './axiosConfig';

export const adminService = {
  async getAdministrators() {
    const response = await apiClient.get('/api/administrators');
    return response.data;
  },

  async getAdministrator(id: number | string) {
    const response = await apiClient.get(`/api/administrators/${id}`);
    return response.data;
  },

  async createAdministrator(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/administrators', data);
    return response.data;
  },

  async updateAdministrator(id: number | string, data: Record<string, unknown>) {
    const response = await apiClient.put(`/api/administrators/${id}`, data);
    return response.data;
  },

  async deleteAdministrator(id: number | string) {
    const response = await apiClient.delete(`/api/administrators/${id}`);
    return response.data;
  },

  async assignRole(adminId: number | string, data: { role: string }) {
    const response = await apiClient.patch(`/api/administrators/${adminId}/assign-role`, data);
    return response.data;
  },

  async getStats(): Promise<{ torneos: number; equipos: number; partidos: number }> {
    const response = await apiClient.get('/api/administrators/stats');
    return response.data;
  },
};
