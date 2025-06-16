import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import CasesListScreen from '../app/cases/CasesListScreen';
import RegisterCaseScreen from '../app/cases/RegisterCaseScreen';
import DashboardScreen from '../app/dashboards/DashboardScreen';
import ReportsListScreen from '../app/reports/ReportListScreen';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  const { signOut, user } = useContext(AuthContext);

  const CustomDrawerContent = (props: any) => (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{user?.name ?? 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? '-'}</Text>
        </View>
      </View>

      <DrawerItemList {...props} />

      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Sair"
          onPress={signOut}
          labelStyle={styles.logoutLabel}
          style={styles.logoutButton}
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="logout" size={size} color={color} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#4BCCA6',
        drawerLabelStyle: { fontWeight: 'bold' },
      }}
      initialRouteName="Dashboard"
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Casos"
        component={CasesListScreen}
        options={{ drawerIcon: ({ color, size }) => <FontAwesome5 name="folder-open" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Novo Caso" 
        component={RegisterCaseScreen}
        options={{ drawerIcon: ({ color, size }) => <Feather name="plus-circle" size={size} color={color} /> }}
      />
      <Drawer.Screen
        name="Relatórios"
        component={ReportsListScreen}
        options={{ drawerIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  text: { fontSize: 24, fontWeight: 'bold' },
  headerContainer: {
    padding: 16,
    backgroundColor: '#4BCCA6',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#4BCCA6',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  userEmail: { color: '#fff', fontSize: 13 },
  logoutContainer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  logoutLabel: {
    color: '#d9534f',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f8d7da',
    borderRadius: 4,
    marginHorizontal: 10,
  },
});
