import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function VisualizarAlunoScreen({ route }) {
  const { aluno } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dados do Aluno</Text>

      {aluno.foto && (
        <Image source={{ uri: aluno.foto }} style={styles.foto} />
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{aluno.nome} {aluno.sobrenome}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{aluno.cpf}</Text>

        <Text style={styles.label}>RG:</Text>
        <Text style={styles.value}>{aluno.rg}</Text>

        <Text style={styles.label}>Nascimento:</Text>
        <Text style={styles.value}>{aluno.nascimento}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{aluno.email}</Text>

        <Text style={styles.label}>Celular:</Text>
        <Text style={styles.value}>{aluno.celular}</Text>

        <Text style={styles.label}>Gênero:</Text>
        <Text style={styles.value}>{aluno.genero}</Text>

        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>
          {aluno.rua}, {aluno.numero}
          {aluno.complemento ? ` - ${aluno.complemento}` : ''}
        </Text>
        <Text style={styles.value}>
          {aluno.bairro}, {aluno.cidade} - {aluno.estado}
        </Text>

        <Text style={styles.label}>CEP:</Text>
        <Text style={styles.value}>{aluno.cep}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
});
