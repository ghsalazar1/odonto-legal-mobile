import api from './api';

export const ReportsService = {
  async getAll() {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar relatórios.');
    }
  },
};
