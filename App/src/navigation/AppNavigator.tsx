import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const notAuthenticatedText = "Not Authenticated";
  const authenticatedText = "Authenticated";
  
  
  return (
    
    <View style = {{flex:1}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 100}}>
        {isAuthenticated ? authenticatedText : notAuthenticatedText}
      </Text>
  
    <Stack.Navigator>
        <Stack.Screen name="Login">
          {() => (
            <LoginScreen
              onLogin={() => setIsAuthenticated(true)}
            />
          )}
        </Stack.Screen>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
    </View>
  );
}