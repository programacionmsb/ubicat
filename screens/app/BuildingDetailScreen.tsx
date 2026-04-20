import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getFloorsByBuilding } from '../../services/floors';
import { getPointsByBuilding } from '../../services/points';
import { Building, Floor, PointOfInterest, PointCategory } from '../../types/database';

export default function BuildingDetailScreen({ route, navigation }: any) {
  const building: Building = route.params.building;
  const [floors, setFloors] = useState<Floor[]>([]);
  const [points, setPoints] = useState<PointOfInterest[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const { data: floorsData, error: floorsError } = await getFloorsByBuilding(building.id);
    if (floorsError) {
      setError(floorsError);
      setLoading(false);
      return;
    }
    setFloors(floorsData);

    const { data: pointsData, error: pointsError } = await getPointsByBuilding(building.id);
    if (pointsError) {
      setError(pointsError);
    } else {
      setPoints(pointsData);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const displayedPoints = selectedFloor
    ? points.filter(p => p.floor_id === selectedFloor)
    : points;

  function getCategoryIcon(category: PointCategory): any {
    switch (category) {
      case 'classroom': return 'school-outline';
      case 'office': return 'briefcase-outline';
      case 'bathroom': return 'body-outline';
      case 'cafeteria': return 'restaurant-outline';
      case 'library': return 'book-outline';
      case 'lab': return 'flask-outline';
      case 'auditorium': return 'mic-outline';
      case 'entrance': return 'log-in-outline';
      default: return 'location-outline';
    }
  }

  function getCategoryColor(category: PointCategory) {
    switch (category) {
      case 'classroom': return '#0af';
      case 'office': return '#fa0';
      case 'bathroom': return '#a0f';
      case 'cafeteria': return '#f80';
      case 'library': return '#0f8';
      case 'lab': return '#f0a';
      case 'auditorium': return '#08f';
      case 'entrance': return '#aaa';
      default: return '#888';
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title} numberOfLines={1}>{building.name}</Text>
          {building.description && (
            <Text style={styles.subtitle} numberOfLines={2}>{building.description}</Text>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0af" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={32} color="#f44" />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {floors.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Pisos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.floorsScroll}>
                <TouchableOpacity
                  style={[styles.floorChip, selectedFloor === null && styles.floorChipActive]}
                  onPress={() => setSelectedFloor(null)}
                >
                  <Text style={[styles.floorChipText, selectedFloor === null && styles.floorChipTextActive]}>Todos</Text>
                </TouchableOpacity>
                {floors.map(f => (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.floorChip, selectedFloor === f.id && styles.floorChipActive]}
                    onPress={() => setSelectedFloor(f.id)}
                  >
                    <Text style={[styles.floorChipText, selectedFloor === f.id && styles.floorChipTextActive]}>
                      {f.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <Text style={styles.sectionTitle}>
            {selectedFloor ? 'Puntos en este piso' : 'Todos los puntos'} ({displayedPoints.length})
          </Text>

          {displayedPoints.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={40} color="#555" />
              <Text style={styles.emptyText}>No hay puntos en este piso aún.</Text>
            </View>
          ) : (
            displayedPoints.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PointDetail', { point: p })}
              >
                <View style={[styles.cardIcon, { backgroundColor: getCategoryColor(p.category) + '33' }]}>
                  <Ionicons name={getCategoryIcon(p.category)} size={22} color={getCategoryColor(p.category)} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{p.name}</Text>
                  {p.description && <Text style={styles.cardDescription} numberOfLines={1}>{p.description}</Text>}
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
  header: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  backButton: { marginRight: 12, padding: 4, marginTop: 2 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 13, color: '#aaa', marginTop: 4, lineHeight: 18 },
  content: { padding: 16, paddingTop: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#aaa', marginTop: 12 },
  sectionTitle: { fontSize: 14, color: '#aaa', fontWeight: 'bold', marginTop: 16, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  floorsScroll: { marginBottom: 8 },
  floorChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#2a2a2a', borderRadius: 20, marginRight: 8,
  },
  floorChipActive: { backgroundColor: '#0af' },
  floorChipText: { color: '#aaa', fontSize: 14 },
  floorChipTextActive: { color: '#fff', fontWeight: 'bold' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2a2a2a', padding: 14, borderRadius: 12, marginBottom: 10,
  },
  cardIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  cardDescription: { fontSize: 12, color: '#888' },
  emptyState: { alignItems: 'center', padding: 32 },
  emptyText: { color: '#888', marginTop: 12, fontSize: 13 },
  errorBox: { alignItems: 'center', padding: 24, margin: 16, backgroundColor: '#2a1a1a', borderRadius: 12 },
  errorTitle: { fontSize: 16, fontWeight: 'bold', color: '#f44', marginTop: 12 },
  errorText: { color: '#faa', textAlign: 'center', marginTop: 8, fontSize: 13 },
});
