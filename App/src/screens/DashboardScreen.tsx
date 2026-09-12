import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text style={styles.subtitle}>
        Construction Site Inspection Platform
      </Text>
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
  },
});