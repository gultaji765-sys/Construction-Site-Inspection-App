import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { createAsset, getAssets } from './src/repositories/buildingAssets';
import { useEffect, useState } from 'react';
import { Asset } from './src/models/Asset';
export default function App() {
  
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
