import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AssetsListScreen from '../screens/AssetsListScreen'
const Stack = createNativeStackNavigator();
import { useNavigation } from '@react-navigation/native';

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen name="Login">
          {() => (
            <LoginScreen
              onLogin={() => setIsAuthenticated(true)}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Dashboard" component={DashboardScreen}/>
        
      )}
      <Stack.Screen name="AssetList" component={AssetsListScreen}/>
    </Stack.Navigator>
   
  );
  
}