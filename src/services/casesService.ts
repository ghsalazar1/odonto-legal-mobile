import api from './api';

interface CreateCaseFormData {
  title: string;
  description: string;
  status: string;
  openedAt: string;
  caseDate: string;
  peritoPrincipalId?: string;
  participants?: string[];
  evidences: { uri: string; name: string; type: string }[];
}


export const CasesService = {
  async getCases(page = 1, limit = 6) {
    const response = await api.get(`/cases?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  async createCase(formData: FormData) {
    try {
      const response = await api.post('/cases', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Falha ao criar novo caso.'
      );
    }
  },

  async finalizeCase(caseId: string, payload: { summary: string; notes: string }) {
    return api.put(`/cases/${caseId}/finalize`, payload);
  },

  async archiveCase(caseId: string) {
    return api.put(`/cases/${caseId}/archive`, {});
  },

  async deleteCase(caseId: string) {
    return api.delete(`/cases/${caseId}`);
  },
};
