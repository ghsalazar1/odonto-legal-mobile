// src/services/dashboardService.ts
import api from './api';

export const DashboardService = {
  async getDashboardSummary() {
    try {
      const response = await api.get('/dashboards/summary');
      return {
        hasError: false,
        data: response.data.data,  // Supondo que sua API responde dentro de um campo `data`
      };
    } catch (error: any) {
      console.error('Erro no DashboardService:', error);
      return {
        hasError: true,
        message: error.response?.data?.message || 'Erro ao buscar o resumo do dashboard.',
      };
    }
  },
};
