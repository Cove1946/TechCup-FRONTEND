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

  async registerPayment(data: Record<string, unknown>) {
    const response = await apiClient.post('/api/payments/register', data);
    return response.data;
  },

  // Submits a payment proof (multipart/form-data with PDF file)
  async submitPayment(formData: FormData) {
    const response = await apiClient.post('/api/payments/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
