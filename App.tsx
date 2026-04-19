import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  const [status, setStatus] = useState('Probando conexión...');

  useEffect(() => {
    probarConexion();
  }, []);

  async function probarConexion() {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*');

      if (error) {
        setStatus(`❌ Error: ${error.message}`);
        console.log('Error completo:', error);
      } else {
        setStatus(`✅ Conectado! Instituciones: ${data.length}`);
        console.log('Datos:', data);
      }
    } catch (err) {
      setStatus(`💥 Excepción: ${err}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UbicaT</Text>
      <Text style={styles.status}>{status}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#0af',
    textAlign: 'center',
  },
});
