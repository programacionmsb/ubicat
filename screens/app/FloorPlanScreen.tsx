import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getFloorsByBuilding } from '../../services/floors';
import { getPointsByFloor } from '../../services/points';
import { Building, Floor, PointOfInterest, PointCategory } from '../../types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAN_WIDTH = SCREEN_WIDTH;
const PLAN_HEIGHT = SCREEN_WIDTH * 0.75; // proporción 4:3

export default function FloorPlanScreen({ route, navigation }: any) {
  const building: Building = route.params.building;
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [points, setPoints] = useState<PointOfInterest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFloors() {
    const { data } = await getFloorsByBuilding(building.id);
    setFloors(data);
    if (data.length > 0) setSelectedFloor(data[0]);
    setLoading(false);
  }

  async function loadPoints(floorId: string) {
    const { data } = await getPointsByFloor(floorId);
    setPoints(data);
  }

  useEffect(() => {
    loadFloors();
  }, []);

  useEffect(() => {
    if (selectedFloor) loadPoints(selectedFloor.id);
  }, [selectedFloor]);

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

  function getCategoryIcon(category: PointCategory): any {
    switch (category) {
      case 'classroom': return 'school';
      case 'office': return 'briefcase';
      case 'bathroom': return 'body';
      case 'cafeteria': return 'restaurant';
      case 'library': return 'book';
      case 'lab': return 'flask';
      case 'auditorium': return 'mic';
      case 'entrance': return 'log-in';
      default: return 'location';
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0af" />
          <Text style={styles.loadingText}>Cargando plano...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title} numberOfLines={1}>Plano - {building.name}</Text>
          <Text style={styles.subtitle}>{points.length} punto{points.length !== 1 ? 's' : ''} en este piso</Text>
        </View>
      </View>

      {/* Selector de pisos */}
      {floors.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.floorsScroll} contentContainerStyle={styles.floorsContent}>
          {floors.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.floorChip, selectedFloor?.id === f.id && styles.floorChipActive]}
              onPress={() => setSelectedFloor(f)}
            >
              <Text style={[styles.floorChipText, selectedFloor?.id === f.id && styles.floorChipTextActive]}>
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Plano + puntos */}
      <ScrollView
        style={styles.planScrollV}
        contentContainerStyle={styles.planScrollContent}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.planContainer}>
          {selectedFloor?.plan_image_url ? (
            <Image
              source={{ uri: selectedFloor.plan_image_url }}
              style={styles.planImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.planPlaceholder}>
              <Ionicons name="map-outline" size={64} color="#444" />
              <Text style={styles.planPlaceholderText}>Sin plano cargado</Text>
            </View>
          )}

          {/* Puntos sobre el plano */}
          {points.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.pointMarker,
                {
                  left: `${p.x_coordinate}%` as any,
                  top: `${p.y_coordinate}%` as any,
                  backgroundColor: getCategoryColor(p.category),
                },
              ]}
              onPress={() => navigation.navigate('PointDetail', { point: p })}
              activeOpacity={0.7}
            >
              <Ionicons name={getCategoryIcon(p.category)} size={14} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Toca un punto para ver detalles</Text>
        <Text style={styles.legendHint}>Pellizca con 2 dedos para hacer zoom</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { flexDirection: 'row', alignItems: 'flex-start', padding: 16 },
  backButton: { marginRight: 12, padding: 4, marginTop: 2 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 13, color: '#aaa', marginTop: 2 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#aaa', marginTop: 12 },
  floorsScroll: { maxHeight: 50, marginBottom: 8 },
  floorsContent: { paddingHorizontal: 16, alignItems: 'center' },
  floorChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#2a2a2a', borderRadius: 20, marginRight: 8,
  },
  floorChipActive: { backgroundColor: '#0af' },
  floorChipText: { color: '#aaa', fontSize: 14 },
  floorChipTextActive: { color: '#fff', fontWeight: 'bold' },
  planScrollV: { flex: 1 },
  planScrollContent: { alignItems: 'center', justifyContent: 'center' },
  planContainer: {
    width: PLAN_WIDTH,
    height: PLAN_HEIGHT,
    position: 'relative',
    backgroundColor: '#0a0a0a',
  },
  planImage: { width: '100%', height: '100%' },
  planPlaceholder: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0a0a0a',
  },
  planPlaceholderText: { color: '#666', marginTop: 12, fontSize: 14 },
  pointMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    transform: [{ translateX: -14 }, { translateY: -14 }],
  },
  legend: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  legendTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  legendHint: { color: '#888', fontSize: 11, textAlign: 'center', marginTop: 2 },
});
