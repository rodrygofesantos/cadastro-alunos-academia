# Cadastro de Alunos Academia - React Native com AsyncStorage

Aplicativo mobile desenvolvido em React Native com Expo para o cadastro de alunos de uma academia. Os dados são armazenados localmente no dispositivo utilizando AsyncStorage. O app possui interface simples, intuitiva e responsiva, com suporte a fotos e preenchimento automático de endereço via CEP.

---

## Funcionalidades

- Cadastro de aluno com:
  - Foto (tirada pela câmera ou escolhida da galeria)
  - Nome, sobrenome, CPF, RG, nascimento, e-mail, celular
  - Endereço completo com preenchimento automático via API do ViaCEP
- Listagem dos alunos cadastrados:
  - Exibição da foto, nome, e-mail e telefone
  - Acesso a todos os dados do aluno em uma tela dedicada
  - Exclusão com confirmação e aviso de sucesso (toast Android)
- Armazenamento local com persistência usando AsyncStorage
- Navegação por abas (React Navigation)

---

## Tecnologias utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage)
- [React Navigation](https://reactnavigation.org/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Axios](https://axios-http.com/)
- [ViaCEP API](https://viacep.com.br/)
- [@expo/vector-icons](https://docs.expo.dev/guides/icons/)

---

## Como instalar e executar o projeto

> Pré-requisitos: [Node.js](https://nodejs.org/), [Expo CLI](https://docs.expo.dev/get-started/installation/), Android Studio ou aplicativo Expo Go no celular

### Clonar o repositório

git clone https://github.com/seu-usuario/cadastro-alunos-academia.git
cd cadastro-alunos-academia

Instalar dependências

npm install

Rodar o projeto
npx expo start

Escaneie o QR Code com o app Expo Go no celular

Ou use a para abrir no Android Emulator ou w para Web

