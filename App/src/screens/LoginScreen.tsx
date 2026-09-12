import React from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';

type Props = {
  onLogin: () => void;
  
};

export default function LoginScreen({onLogin}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Site Inspection</Text>
        
        
    
      <Button
        title="Authenticate"
        onPress={onLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
});