import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleReset() {
    if (!email) {
      Alert.alert('Error', 'Ingresa tu email');
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Email enviado', 'Revisa tu bandeja para recuperar tu contraseña', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.description}>Te enviaremos un email con instrucciones para restablecer tu contraseña.</Text>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Enviar email'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Volver</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  description: { color: '#aaa', textAlign: 'center', marginBottom: 32, fontSize: 14 },
  input: { backgroundColor: '#2a2a2a', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#0af', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#0af', textAlign: 'center', marginTop: 16, fontSize: 14 },
});
