import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput as RNTextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { CasesService } from '../../services/casesService';
import LoadingScreen from '../LoadingScreen';

interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  caseDate: string;
  openedAt: string;
  closedAt?: string;
  peritoPrincipal?: { name: string };
}

export default function CasesListScreen() {
  const { accessToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [])
  );

  const fetchCases = async () => {
    setLoading(true);
    try {
      const apiCases: Case[] = await CasesService.getCases();
      setCases(apiCases);
      setFilteredCases(apiCases);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os casos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const term = text.toLowerCase();
    const filtered = cases.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.status.toLowerCase().includes(term) ||
        (c.peritoPrincipal?.name.toLowerCase().includes(term) ?? false)
    );
    setFilteredCases(filtered);
  };

  const handleEdit = (caseId: string) => {
    // navigation.navigate('EditCase', { id: caseId });
  };

  const handleDelete = (caseItem: Case) => {
    if (caseItem.status === 'Finalizado' || caseItem.status === 'Arquivado') {
      Alert.alert('Status bloqueado', 'Este caso não pode mais ser excluído.');
      return;
    }

    Alert.alert(
      'Excluir Caso',
      'Tem certeza que deseja excluir este caso?',
      [
        { text: '❌ Cancelar', style: 'cancel' },
        {
          text: '🗑️ Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await CasesService.deleteCase(caseItem.id);
              Alert.alert('Sucesso', 'Caso excluído com sucesso.');
              fetchCases();
            } catch (error: any) {
              const errorMsg = error.response?.data?.message || 'Erro ao excluir o caso.';
              Alert.alert('Erro', errorMsg);
            }
          },
        },
      ]
    );
  };

  const handleChangeStatus = (caseItem: Case) => {
    if (caseItem.status === 'Finalizado' || caseItem.status === 'Arquivado') {
      Alert.alert('Status bloqueado', 'Este caso não pode mais ser alterado.');
      return;
    }

    Alert.alert(
      'Alterar Status',
      `Escolha uma ação para o caso "${caseItem.title}"`,
      [
        {
          text: '✅ Finalizar Caso',
          onPress: () => openFinalizeModal(caseItem),
        },
        {
          text: '📥 Arquivar Caso',
          onPress: () => confirmArchive(caseItem),
          style: 'destructive',
        },
        { text: '❌ Cancelar', style: 'cancel' },
      ]
    );
  };

  const openFinalizeModal = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setSummary('');
    setNotes('');
    setShowFinalizeModal(true);
  };

  const closeFinalizeModal = () => {
    setShowFinalizeModal(false);
    setSelectedCase(null);
    setSummary('');
    setNotes('');
  };

  const confirmFinalizeCase = async () => {
    if (!summary.trim() || !notes.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o resumo e as notas do perito.');
      return;
    }

    try {
      await CasesService.finalizeCase(selectedCase!.id, { summary, notes });
      Alert.alert('Sucesso', 'Caso finalizado com sucesso.');
      closeFinalizeModal();
      fetchCases();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.message ?? 'Falha ao finalizar o caso.');
    }
  };

  const confirmArchive = (caseItem: Case) => {
    Alert.alert(
      'Confirmar Arquivamento',
      `Arquivar o caso "${caseItem.title}"?`,
      [
        { text: '❌ Cancelar', style: 'cancel' },
        {
          text: '📥 Arquivar',
          style: 'destructive',
          onPress: async () => {
            try {
              await CasesService.archiveCase(caseItem.id);
              Alert.alert('Sucesso', 'Caso arquivado com sucesso.');
              fetchCases();
            } catch (error: any) {
              Alert.alert('Erro', error?.response?.data?.message ?? 'Falha ao arquivar o caso.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Case }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Finalizado':
          return '#28a745';
        case 'Arquivado':
          return '#ffc107';
        default:
          return '#17a2b8';
      }
    };

    return (
      <View style={[styles.caseCard, { borderLeftColor: getStatusColor(item.status) }]}>
        <Text style={styles.caseTitle}>{item.title}</Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <Text style={styles.caseDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>📅 Ocorrido: {new Date(item.caseDate).toLocaleDateString()}</Text>
          <Text style={styles.metaText}>🕒 Abertura: {new Date(item.openedAt).toLocaleDateString()}</Text>
          {item.closedAt && (
            <Text style={styles.metaText}>✅ Fechado: {new Date(item.closedAt).toLocaleDateString()}</Text>
          )}
          <Text style={styles.metaText}>👤 Perito: {item.peritoPrincipal?.name ?? '-'}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEdit(item.id)}>
            <Text style={styles.buttonText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.statusButton]} onPress={() => handleChangeStatus(item)}>
            <Text style={styles.buttonText}>⚙️ Status</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item)}>
            <Text style={styles.buttonText}>🗑️ Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Casos Periciais</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Filtrar por título, status ou perito"
        value={searchTerm}
        onChangeText={handleSearch}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Novo Caso' as never)}>
        <Text style={styles.addButtonText}>➕ Novo Caso</Text>
      </TouchableOpacity>

      {loading ? (
        <LoadingScreen />
      ) : filteredCases.length > 0 ? (
        <FlatList data={filteredCases} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
      ) : (
        <Text style={styles.noResults}>Nenhum caso encontrado</Text>
      )}


      {/* Modal Finalizar Caso */}
      <Modal visible={showFinalizeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Finalizar Caso: {selectedCase?.title}</Text>

            <RNTextInput
              placeholder="Resumo do Caso"
              value={summary}
              onChangeText={setSummary}
              multiline
              style={styles.modalInput}
            />

            <RNTextInput
              placeholder="Notas do Perito"
              value={notes}
              onChangeText={setNotes}
              multiline
              style={styles.modalInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.button, styles.statusButton]} onPress={confirmFinalizeCase}>
                <Text style={styles.buttonText}>✅ Finalizar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={closeFinalizeModal}>
                <Text style={styles.buttonText}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fefefe' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 999,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#4BCCA6',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  caseCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderLeftWidth: 6,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  caseTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 6,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  caseDescription: { fontSize: 14, color: '#555', marginBottom: 8 },
  metaContainer: { marginBottom: 10 },
  metaText: { fontSize: 12, color: '#777', marginBottom: 2 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 1,
  },
  editButton: {
    backgroundColor: '#8f897e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusButton: {
    backgroundColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  noResults: { textAlign: 'center', marginTop: 20, color: '#888', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
});
