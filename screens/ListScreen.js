import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  Image, TouchableOpacity, Alert, ToastAndroid, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ListScreen({ navigation }) {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAlunos();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAlunos = async () => {
    const data = await AsyncStorage.getItem('@alunos');
    if (data) {
      setAlunos(JSON.parse(data));
    }
  };

  const confirmarExclusao = (index) => {
    Alert.alert(
      'Excluir Aluno',
      'Tem certeza que deseja excluir este aluno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirAluno(index),
        },
      ]
    );
  };

  const excluirAluno = async (index) => {
    const novaLista = [...alunos];
    const alunoExcluido = novaLista[index];
    novaLista.splice(index, 1);
    setAlunos(novaLista);
    await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));
    
    if (Platform.OS === 'android') {
      ToastAndroid.show(`Aluno ${alunoExcluido.nome} removido com sucesso.`, ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={item.foto ? { uri: item.foto } : require('../assets/avatar-placeholder.png')}
          style={styles.foto}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.nome} {item.sobrenome}</Text>
          <Text style={styles.info}>{item.email}</Text>
          <Text style={styles.info}>{item.celular}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmarExclusao(index)}>
          <MaterialIcons name="delete" size={24} color="#d11a2a" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VisualizarAluno', { aluno: item })}
      >
        <Text style={styles.buttonText}>Visualizar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos Cadastrados</Text>
      <FlatList
        data={alunos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum aluno cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#ddd',
  },
  infoContainer: {
    flex: 1,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  info: { fontSize: 14, color: '#555' },
  button: {
    marginTop: 10,
    backgroundColor: '#0055FF',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 30, color: '#999' },
});
