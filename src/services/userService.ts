import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: {
    description: string;
  };
}

export const UsersService = {
  async getSelectableUsers(): Promise<User[]> {
    try {
      const response = await api.get('/users/selectable');
      return response.data;
      
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Falha ao carregar usuários selecionáveis.'
      );
    }
  },
};
