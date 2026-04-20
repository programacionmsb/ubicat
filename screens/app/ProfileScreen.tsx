import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="person-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Editar perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Ionicons name="lock-closed-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Cambiar contraseña</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Notificaciones</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Ayuda</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#f44" />
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { alignItems: 'center', padding: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#0af',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  email: { color: '#fff', fontSize: 16, fontWeight: '500' },
  section: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rowText: { flex: 1, color: '#fff', fontSize: 16, marginLeft: 12 },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#2a1a1a',
    borderRadius: 12,
  },
  signOutText: { color: '#f44', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
