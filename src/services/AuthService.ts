import axios from 'axios';
import { Environment } from '../environments/environment';

const API_BASE_URL = Environment.BackendURL;

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: {
      id: string;
      description: string;
    };
  };
}

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try 
    {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

        return response.data;
      } 
      catch (error: any) {
        const err = error?.response?.data?.error;
        throw new Error(err);
      }
  },

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      throw error;
    }
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw new Error('Falha ao renovar o token');
    }
  },
}