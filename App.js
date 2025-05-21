import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FormScreen from './screens/FormScreen';
import ListScreen from './screens/ListScreen';
import VisualizarAlunoScreen from './screens/VisualizarAlunoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#0055FF',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Informações Pessoais" component={FormScreen} />
        <Tab.Screen name="Lista de Alunos" component={ListScreen} />
        <Tab.Screen
          name="VisualizarAluno"
          component={VisualizarAlunoScreen}
          options={{ tabBarButton: () => null, headerTitle: 'Detalhes do Aluno' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
