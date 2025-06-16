import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { ReportsService } from '../../services/reportService';
import { AuthContext } from '../../context/AuthContext';
import { ReportDTO } from '../../types/ReportDTO';
import { useFocusEffect } from '@react-navigation/native';



export default function ReportsListScreen() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    try {
      const response = await ReportsService.getAll();
      setReports(response.data || []);
      setFilteredReports(response.data || []);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar os relatórios.');
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const term = text.toLowerCase();
    const filtered = reports.filter((report) =>
      report.case.title.toLowerCase().includes(term) ||
      report.case.status.toLowerCase().includes(term) ||
      (report.case.peritoPrincipal?.name?.toLowerCase().includes(term)) ||
      (report.case.caseDate && new Date(report.case.caseDate).toLocaleDateString().includes(term)) ||
      (report.case.closedAt && new Date(report.case.closedAt).toLocaleDateString().includes(term))
    );
    setFilteredReports(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado': return '#28a745';
      case 'Arquivado': return '#ffc107';
      default: return '#17a2b8';
    }
  };

  const openReport = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o PDF.');
      });
    } else {
      Alert.alert('Erro', 'URL do dossiê não disponível.');
    }
  };

  const renderItem = ({ item }: { item: ReportDTO }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.case.title}</Text>

      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.case.status) }]}>
        <Text style={styles.statusText}>{item.case.status}</Text>
      </View>

      <Text style={styles.metaText}>📅 Data do Caso: {new Date(item.case.caseDate).toLocaleDateString()}</Text>
      <Text style={styles.metaText}>👤 Perito: {item.case.peritoPrincipal?.name || '-'}</Text>
      <Text style={styles.metaText}>👥 Participantes: {item.case.caseParticipants.map(p => p.user.name).join(', ') || '-'}</Text>
      <Text style={styles.metaText}>📎 Evidências: {item.evidencesCount}</Text>
      <Text style={styles.metaText}>📝 Resumo: {item.summary || '-'}</Text>

      <TouchableOpacity style={styles.pdfButton} onPress={() => openReport(item.contentUrl)}>
        <Text style={styles.pdfButtonText}>📄 Visualizar PDF</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Relatórios de Dossiê</Text>

      <TextInput
        placeholder="🔍 Filtrar por título, status, perito ou data"
        value={searchTerm}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {filteredReports.length === 0 ? (
        <Text style={styles.noResults}>Nenhum relatório encontrado.</Text>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fefefe' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 999,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  noResults: { textAlign: 'center', color: '#888', marginTop: 20 },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  metaText: { fontSize: 12, color: '#555', marginBottom: 4 },
  pdfButton: {
    backgroundColor: '#4BCCA6',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  pdfButtonText: { color: '#fff', fontWeight: 'bold' },
});
