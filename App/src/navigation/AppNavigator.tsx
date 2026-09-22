import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AssetsListScreen from '../screens/AssetsListScreen'
import { useNavigation } from '@react-navigation/native';
import AssetDetailsScreen from '../screens/AssetDetailsScreen';


const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="AssetDetails" component={AssetDetailsScreen}/>
    </Stack.Navigator>
   
  );
  
}