import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppDrawer from './src/navigation/AppDrawer';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import LoginScreen from './src/app/LoginScreen';

const Stack = createNativeStackNavigator();

function AppRoutes() {
  const { isInitializing, user } = useContext(AuthContext);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4BCCA6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppDrawer />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
