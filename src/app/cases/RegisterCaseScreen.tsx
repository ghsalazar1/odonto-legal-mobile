import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { CasesService } from '../../services/casesService';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { UsersService } from '../../services/userService';

export default function RegisterCaseScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [caseDate, setCaseDate] = useState('');
  const openedAt = new Date().toISOString().split('T')[0];
  const [users, setUsers] = useState<any[]>([]);
  const [principalPeritoId, setPrincipalPeritoId] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantFilter, setParticipantFilter] = useState('');
  const [evidences, setEvidences] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCaseDate('');
    setPrincipalPeritoId('');
    setParticipants([]);
    setParticipantFilter('');
    setEvidences([]);
  };

  const loadUsers = async () => {
    const response = await UsersService.getSelectableUsers() as any;
    setUsers(response?.data.filter((u: any) => u.role.description !== 'Administrador'));
  };

  const toggleParticipant = (userId: string) => {
    setParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      setEvidences((prev) => [...prev, { uri: image.uri, mimeType: image.mimeType, name: image.fileName || `image_${Date.now()}.jpg` }]);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled && result.assets) {
      setEvidences((prev) => [...prev, result.assets[0]]);
    }
  };

  const submitCase = async () => {
    if (!title.trim() || !description.trim() || !caseDate || evidences.length === 0) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios e adicione pelo menos uma evidência.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('status', 'Em andamento');
    formData.append('openedAt', openedAt);
    formData.append('caseDate', caseDate);
    if (principalPeritoId) formData.append('peritoPrincipalId', principalPeritoId);
    participants.forEach((id) => formData.append('participants', id));
    evidences.forEach((evidence, index) => {
      formData.append('evidences', {
        uri: evidence.uri,
        type: evidence.mimeType || 'application/octet-stream',
        name: evidence.name || `evidence_${index}`,
      } as any);
    });

    try {
      await CasesService.createCase(formData);
      Alert.alert('Sucesso', 'Caso criado com sucesso!');
      resetForm(); 
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o caso.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅️ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Novo Caso Pericial</Text>
      <TextInput placeholder="Título*" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Descrição*" style={[styles.input, { height: 100 }]} multiline value={description} onChangeText={setDescription} />
      <TextInput placeholder="Data do acontecimento (YYYY-MM-DD)*" style={styles.input} value={caseDate} onChangeText={setCaseDate} />

      <Text style={styles.subtitle}>Perito Principal</Text>
      <ScrollView horizontal style={styles.participantList}>
        {users.map((u) => (
          <TouchableOpacity key={u.id} style={[styles.participant, principalPeritoId === u.id && styles.selected]} onPress={() => setPrincipalPeritoId(u.id)}>
            <Text>{u.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput placeholder="🔍 Filtrar Participantes" style={styles.input} value={participantFilter} onChangeText={setParticipantFilter} />
      <ScrollView horizontal style={styles.participantList}>
        {users.filter((u) => u.name.toLowerCase().includes(participantFilter.toLowerCase()) && u.id !== principalPeritoId).map((u) => (
          <TouchableOpacity key={u.id} style={[styles.participant, participants.includes(u.id) && styles.selected]} onPress={() => toggleParticipant(u.id)}>
            <Text>{u.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.evidenceButtons}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>📸 Capturar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Text style={styles.buttonText}>📁 Adicionar Arquivos</Text>
        </TouchableOpacity>
      </View>

      {evidences.map((ev, idx) => (
        <View key={idx} style={styles.evidenceItem}>
          {ev.uri && <Image source={{ uri: ev.uri }} style={styles.evidencePreview} />}
          <Text>{ev.name || `Evidência ${idx + 1}`}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={submitCase}>
        <Text style={styles.saveButtonText}>Salvar Caso</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginVertical: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  participantList: { flexDirection: 'row', marginVertical: 10 },
  participant: { padding: 10, borderWidth: 1, borderRadius: 8, marginRight: 8 },
  selected: { backgroundColor: '#4BCCA6', borderColor: '#4BCCA6' },
  evidenceButtons: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  button: { backgroundColor: '#eee', padding: 10, borderRadius: 8 },
  buttonText: { fontWeight: 'bold' },
  evidenceItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  evidencePreview: { width: 50, height: 50, marginRight: 10 },
  saveButton: { backgroundColor: '#4BCCA6', padding: 15, borderRadius: 8, marginVertical: 20 },
  saveButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  backButton: { marginBottom: 10, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f0f0f0', borderRadius: 8, alignSelf: 'flex-start' },
  backButtonText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
});

