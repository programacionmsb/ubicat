import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getBuildingsByInstitution } from '../../services/buildings';
import { Building, Institution } from '../../types/database';

export default function InstitutionDetailScreen({ route, navigation }: any) {
  const institution: Institution = route.params.institution;
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadBuildings() {
    const { data, error } = await getBuildingsByInstitution(institution.id);
    if (error) setError(error);
    else setBuildings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBuildings();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title} numberOfLines={1}>{institution.name}</Text>
          <Text style={styles.subtitle}>Edificios disponibles</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0af" />
          <Text style={styles.loadingText}>Cargando edificios...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={32} color="#f44" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : buildings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="business-outline" size={48} color="#555" />
          <Text style={styles.emptyTitle}>Sin edificios</Text>
          <Text style={styles.emptyText}>Esta institución aún no ha cargado sus edificios.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {buildings.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BuildingDetail', { building: b })}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="business" size={26} color="#0af" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{b.name}</Text>
                {b.description && <Text style={styles.cardDescription} numberOfLines={2}>{b.description}</Text>}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12 },
  backButton: { marginRight: 12, padding: 4 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 13, color: '#aaa', marginTop: 2 },
  content: { padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#aaa', marginTop: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2a2a2a', padding: 16, borderRadius: 12, marginBottom: 12,
  },
  cardIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1a3a4a',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardDescription: { fontSize: 13, color: '#888' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#aaa', textAlign: 'center' },
  errorBox: { alignItems: 'center', padding: 24, margin: 16, backgroundColor: '#2a1a1a', borderRadius: 12 },
  errorTitle: { fontSize: 16, fontWeight: 'bold', color: '#f44', marginTop: 12 },
  errorText: { color: '#faa', textAlign: 'center', marginTop: 8, fontSize: 13 },
});
