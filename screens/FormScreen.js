import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, ScrollView,
  StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { saveAluno } from '../database/db';

const isValidEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase());

const maskPhone = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 10) return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

const maskCPF = (value) => {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[\D]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf[10]);
};

export default function FormScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '', sobrenome: '', cpf: '', rg: '', nascimento: '',
    email: '', celular: '', genero: '',
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
    foto: null
  });

  const [showDate, setShowDate] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);

  const handleChange = (key, value) => {
    if (key === 'cep' && value.length < 8) setAutoFilled(false);
    setForm({ ...form, [key]: value });
  };

  const escolherFoto = async () => {
    Alert.alert('Foto do Aluno', 'Escolha uma opção', [
      {
        text: 'Câmera',
        onPress: async () => {
          const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
          if (cameraPerm.status !== 'granted') {
            Alert.alert('Permissão necessária', 'Permita o uso da câmera para tirar fotos.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
            allowsEditing: true,
            aspect: [1, 1]
          });
          if (!result.canceled) {
            setForm({ ...form, foto: result.assets[0].uri });
          }
        }
      },
      {
        text: 'Galeria',
        onPress: async () => {
          const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (galleryPerm.status !== 'granted') {
            Alert.alert('Permissão necessária', 'Permita o uso da galeria.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
            aspect: [1, 1]
          });
          if (!result.canceled) {
            setForm({ ...form, foto: result.assets[0].uri });
          }
        }
      },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  const buscarEndereco = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setLoadingCEP(true);
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (response.data.erro) {
          Alert.alert('CEP não encontrado', 'Verifique se o CEP digitado está correto.');
          setAutoFilled(false);
        } else {
          const { logradouro, bairro, localidade, uf } = response.data;
          setForm(prevForm => ({
            ...prevForm,
            rua: logradouro || '',
            bairro: bairro || '',
            cidade: localidade || '',
            estado: uf || '',
            cep
          }));
          setAutoFilled(true);
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao buscar o CEP. Tente novamente.');
        setAutoFilled(false);
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!form.nome || !form.celular || !form.cidade || !isValidEmail(form.email) || !isValidCPF(form.cpf)) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios com dados válidos.');
      return;
    }
    saveAluno(form, () => {
      Alert.alert('Sucesso', 'Cadastro salvo!');
      setForm({
        nome: '', sobrenome: '', cpf: '', rg: '', nascimento: '',
        email: '', celular: '', genero: '',
        cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
        foto: null
      });
      setAutoFilled(false);
    });
  };

  const onChangeDate = (_, selectedDate) => {
    setShowDate(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString();
      handleChange('nascimento', formatted);
    }
  };

  const opcoesGenero = ['Masculino', 'Feminino', 'Não desejo informar'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Aluno</Text>

      <TouchableOpacity onPress={escolherFoto} style={{ alignSelf: 'center' }}>
        {form.foto ? (
          <Image source={{ uri: form.foto }} style={styles.foto} />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Text style={{ color: '#888' }}>Selecionar Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Nome" value={form.nome} onChangeText={v => handleChange('nome', v)} />
      <TextInput style={styles.input} placeholder="Sobrenome" value={form.sobrenome} onChangeText={v => handleChange('sobrenome', v)} />
      <TextInput style={styles.input} placeholder="CPF" value={maskCPF(form.cpf)} onChangeText={v => handleChange('cpf', maskCPF(v))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="RG" value={form.rg} onChangeText={v => handleChange('rg', v)} />
      <TextInput style={styles.input} placeholder="Nascimento" value={form.nascimento} onFocus={() => setShowDate(true)} />
      {showDate && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onChangeDate} />}
      <TextInput style={styles.input} placeholder="E-mail" value={form.email} onChangeText={v => handleChange('email', v.toLowerCase())} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Celular" value={form.celular} onChangeText={v => handleChange('celular', maskPhone(v))} keyboardType="phone-pad" />

      <Text style={styles.subtitle}>Gênero</Text>
      <View style={styles.genderContainer}>
        {opcoesGenero.map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[styles.genderButton, form.genero === opcao && styles.genderSelected]}
            onPress={() => handleChange('genero', opcao)}
          >
            <Text style={styles.genderText}>{opcao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Endereço</Text>
      <TextInput style={styles.input} placeholder="CEP" value={form.cep} onChangeText={v => handleChange('cep', v)} onBlur={() => buscarEndereco(form.cep)} keyboardType="numeric" />
      {loadingCEP && <ActivityIndicator size="small" color="#0055FF" style={{ marginBottom: 10 }} />}
      <TextInput style={styles.input} placeholder="Rua" value={form.rua} onChangeText={v => handleChange('rua', v)} editable={!autoFilled} />
      <TextInput style={styles.input} placeholder="Número" value={form.numero} onChangeText={v => handleChange('numero', v)} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Complemento" value={form.complemento} onChangeText={v => handleChange('complemento', v)} />
      <TextInput style={styles.input} placeholder="Bairro" value={form.bairro} onChangeText={v => handleChange('bairro', v)} editable={!autoFilled} />
      <TextInput style={styles.input} placeholder="Cidade" value={form.cidade} onChangeText={v => handleChange('cidade', v)} editable={!autoFilled} />
      <TextInput style={styles.input} placeholder="Estado" value={form.estado} onChangeText={v => handleChange('estado', v)} editable={!autoFilled} />

      <Button title="SALVAR" onPress={handleSubmit} color="#0055FF" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, marginTop: 20, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
    padding: 10, marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007bff',
    marginRight: 10,
    marginBottom: 10,
  },
  genderSelected: {
    backgroundColor: '#007bff',
  },
  genderText: {
    color: '#000',
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  fotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
