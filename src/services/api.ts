import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment } from '../environments/environment';
import { AuthHelper } from '../helpers/AuthHelper';

const api = axios.create({
  baseURL: Environment.BackendURL,
});

// Adiciona token JWT em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Força logout se o token expirar (erro 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Fazendo logout automático.');
      await AuthHelper.triggerSignOut();
    }
    return Promise.reject(error);
  }
);

export default api;
