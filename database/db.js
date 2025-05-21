import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@alunos';

export const saveAluno = async (aluno, callback) => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const alunos = data ? JSON.parse(data) : [];
  alunos.push({ ...aluno, id: Date.now() });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alunos));
  if (callback) callback();
};
