import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {getDatabase, insertInto, updateData, deleteData} from './src/database/queries'
import { useEffect } from 'react';

export default function App() {
  

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
