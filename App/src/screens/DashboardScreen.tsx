import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackList } from '../navigation/types';
import {colors, spacing, typography} from '../theme'

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackList>>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text style={styles.subtitle}>
        Construction Site Inspection Platform
      </Text>
      <Button title = "List of Assets"
              onPress  = {() => navigation.navigate('AssetList')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 10
  },

  
});