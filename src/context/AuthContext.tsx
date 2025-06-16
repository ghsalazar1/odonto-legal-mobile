import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthHelper } from '../helpers/AuthHelper';

interface User {
  id: string;
  email: string;
  name: string;
  role: { id: string; description: string };
}

interface AuthContextData {
  user: User | null;
  accessToken: string | null;
  isInitializing: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    loadStorageData();
    AuthHelper.setSignOut(signOut);
  }, []);
  
  async function loadStorageData() {
    try {
      const token = await AsyncStorage.getItem('@token');
      const userData = await AsyncStorage.getItem('@user');

      if (token && userData) {
        setAccessToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }

  async function signIn(token: string, userData: User) {
    setAccessToken(token);
    setUser(userData);
    await AsyncStorage.setItem('@token', token);
    await AsyncStorage.setItem('@user', JSON.stringify(userData));
  }

  async function signOut() {
    setAccessToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['@token', '@user']);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isInitializing, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
