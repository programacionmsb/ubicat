import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getInstitutions } from '../../services/institutions';
import { Institution } from '../../types/database';

export default function HomeScreen() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadInstitutions() {
    const { data, error } = await getInstitutions();
    if (error) {
      setError(error);
    } else {
      setInstitutions(data);
      setError(null);
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadInstitutions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInstitutions();
  }, []);

  function getInstitutionIcon(type: Institution['type']) {
    switch (type) {
      case 'university': return 'school';
      case 'hospital': return 'medkit';
      case 'mall': return 'cart';
      default: return 'business';
    }
  }

  function getInstitutionLabel(type: Institution['type']) {
    switch (type) {
      case 'university': return 'Universidad';
      case 'hospital': return 'Hospital';
      case 'mall': return 'Centro comercial';
      default: return 'Institución';
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inicio</Text>
        <Text style={styles.subtitle}>Elige tu institución</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0af" />
          <Text style={styles.loadingText}>Cargando instituciones...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0af" />}
        >
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={32} color="#f44" />
              <Text style={styles.errorTitle}>Error al cargar</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadInstitutions}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : institutions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#555" />
              <Text style={styles.emptyTitle}>Aún no hay instituciones</Text>
              <Text style={styles.emptyText}>Pronto podrás explorar universidades, hospitales y centros comerciales desde aquí.</Text>
            </View>
          ) : (
            institutions.map((inst) => (
              <TouchableOpacity key={inst.id} style={styles.card} activeOpacity={0.7}>
                <View style={styles.cardIcon}>
                  <Ionicons name={getInstitutionIcon(inst.type)} size={28} color="#0af" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{inst.name}</Text>
                  <Text style={styles.cardSubtitle}>{getInstitutionLabel(inst.type)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#aaa', marginTop: 4 },
  content: { padding: 24, paddingTop: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#aaa', marginTop: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#1a3a4a',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#888' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#aaa', textAlign: 'center' },
  errorBox: { alignItems: 'center', padding: 24, backgroundColor: '#2a1a1a', borderRadius: 12 },
  errorTitle: { fontSize: 16, fontWeight: 'bold', color: '#f44', marginTop: 12 },
  errorText: { color: '#faa', textAlign: 'center', marginTop: 8, fontSize: 13 },
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#0af', borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
});
