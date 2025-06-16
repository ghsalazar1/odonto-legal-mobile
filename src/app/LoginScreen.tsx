// src/components/LoginScreen.tsx
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { AuthService } from '../services/AuthService';

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    try {
      setLoading(true);

      const response = await AuthService.login(email, password);
      const token = response.accessToken;
      const user = response.user;

      await signIn(token, user);

    } catch (error: any) {
      Alert.alert('Erro ao fazer login', error?.message ?? 'Falha ao conectar na API.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperação', 'Funcionalidade de recuperação de senha ainda não implementada.');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/imagens/logo-odonto-legal.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Título */}
      <Text style={styles.title}>Acesso à Plataforma</Text>

      {/* Campo Email */}
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo Senha */}
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* Botão Entrar */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      {/* Esqueceu a senha */}
      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotLink}>
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 45,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4BCCA6',
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#87dbc5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerText: {
    color: '#999',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  forgotLink: {
    marginTop: 20,
  },
  forgotText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});
