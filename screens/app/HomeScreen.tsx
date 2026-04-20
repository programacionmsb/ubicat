import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a UbicaT!</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.info}>Estás autenticado 🎉</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  email: { color: '#0af', fontSize: 16, marginBottom: 8 },
  info: { color: '#aaa', marginBottom: 32 },
  button: { backgroundColor: '#f44', padding: 14, borderRadius: 8, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
