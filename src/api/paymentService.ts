import apiClient from './axiosConfig';

export const paymentService = {
  async getPaymentsByTournament(tournamentId: number | string) {
    const response = await apiClient.get(`/api/payments/tournament/${tournamentId}`);
    return response.data;
  },

  async getRegistrationsByTournament(tournamentId: number | string) {
    const response = await apiClient.get(`/api/payments/registrations/tournament/${tournamentId}`);
    return response.data;
  },

  async registerPayment(captainId: number | string, data: Record<string, unknown>) {
    const response = await apiClient.post(`/api/payments/register?captainId=${captainId}`, data);
    return response.data;
  },

  async submitPayment(captainId: number | string, data: { registrationId: number; fileUrl: string; paymentMethod: string }) {
    const response = await apiClient.post(`/api/payments/submit?captainId=${captainId}`, data);
    return response.data;
  },

  async approvePayment(paymentId: number | string) {
    const response = await apiClient.patch(`/api/payments/${paymentId}/approve`);
    return response.data;
  },

  async rejectPayment(paymentId: number | string) {
    const response = await apiClient.patch(`/api/payments/${paymentId}/reject`);
    return response.data;
  },
};
