// src/components/dashboard/DashboardScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DashboardService } from '../../services/dashboardService';
import { BarChart, PieChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const navigation = useNavigation();

  const [userCount, setUserCount] = useState(0);
  const [activeCases, setActiveCases] = useState(0);
  const [archivedCases, setArchivedCases] = useState(0);
  const [reportsCreated, setReportsCreated] = useState(0);

  const screenWidth = Dimensions.get('window').width - 32;

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, []
  ));

  const loadDashboard = async () => {
    try {
      const res = await DashboardService.getDashboardSummary();

      if (!res.hasError && res.data) {
        setUserCount(res.data.userCount);
        setActiveCases(res.data.activeCases);
        setArchivedCases(res.data.archivedCases);
        setReportsCreated(res.data.reportsCreated);
      } else {
        Alert.alert('Erro', 'Falha ao carregar o dashboard.');
      }
    } catch (err) {
      console.error('Erro ao buscar dashboard:', err);
      Alert.alert('Erro', 'Erro ao buscar os dados do dashboard.');
    }
  };

const handleNavigation = (target: string, params: any = {}) => {
  (navigation.navigate as any)(target, params);
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Pericial</Text>

      {/* Cards Estatísticos */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>👥 Usuários</Text>
          <Text style={styles.cardValue}>{userCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleNavigation('Casos', { filter: 'Em andamento' })}>
          <Text style={styles.cardTitle}>📂 Casos Ativos</Text>
          <Text style={styles.cardValue}>{activeCases}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleNavigation('Casos', { filter: 'Arquivado' })}>
          <Text style={styles.cardTitle}>📦 Arquivados</Text>
          <Text style={styles.cardValue}>{archivedCases}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleNavigation('Relatórios')}>
          <Text style={styles.cardTitle}>📑 Relatórios</Text>
          <Text style={styles.cardValue}>{reportsCreated}</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico de Barras */}
      <Text style={styles.chartTitle}>Casos e Relatórios</Text>
      <BarChart
              data={{
                  labels: ['Ativos', 'Arquivados', 'Relatórios'],
                  datasets: [{ data: [activeCases, archivedCases, reportsCreated] }],
              }}
              width={screenWidth}
              height={220}
              fromZero
              chartConfig={chartConfig}
              style={styles.chart} yAxisLabel={''} yAxisSuffix={''}      />

      {/* Gráfico de Pizza */}
      <Text style={styles.chartTitle}>Distribuição Geral</Text>
      <PieChart
        data={[
          { name: 'Usuários', population: userCount, color: '#4BCCA6', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Casos', population: activeCases + archivedCases, color: '#38B29D', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Relatórios', population: reportsCreated, color: '#2F9989', legendFontColor: '#333', legendFontSize: 12 },
        ]}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(75, 204, 166, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: '#555', marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: '#4BCCA6' },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  chart: { borderRadius: 8 },
});
