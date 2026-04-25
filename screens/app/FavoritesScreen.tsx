import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyFavorites, removeFavorite, FavoriteWithPoint } from '../../services/favorites';

export default function FavoritesScreen({ navigation }: any) {
  const [favorites, setFavorites] = useState<FavoriteWithPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadFavorites() {
    const { data } = await getMyFavorites();
    setFavorites(data);
    setLoading(false);
    setRefreshing(false);
  }

  // Recarga cada vez que la pantalla recibe foco (usuario regresa al tab)
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, []);

  async function handleRemove(pointId: string, name: string) {
    Alert.alert(
      'Quitar de favoritos',
      `¿Quitar "${name}" de tus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Quitar',
          style: 'destructive',
          onPress: async () => {
            await removeFavorite(pointId);
            loadFavorites();
          },
        },
      ]
    );
  }

  function getCategoryIcon(category: string): any {
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

  function getCategoryColor(category: string) {
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
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>Tus lugares guardados</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0af" />
          <Text style={styles.loadingText}>Cargando favoritos...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0af" />}
        >
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={48} color="#555" />
              <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
              <Text style={styles.emptyText}>Marca como favoritos tus lugares frecuentes para acceder rápido a ellos.</Text>
            </View>
          ) : (
            favorites.map(fav => {
              const point = fav.points_of_interest;
              if (!point) return null;
              const buildingName = point.floors?.buildings?.name || '';
              const floorName = point.floors?.name || '';
              const location = buildingName && floorName ? `${buildingName} - ${floorName}` : buildingName || 'Ubicación';
              const color = getCategoryColor(point.category);

              return (
                <TouchableOpacity
                  key={fav.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onLongPress={() => handleRemove(point.id, point.name)}
                  onPress={() => navigation.navigate('PointDetail', { point })}
                >
                  <View style={[styles.cardIcon, { backgroundColor: color + '33' }]}>
                    <Ionicons name={getCategoryIcon(point.category)} size={20} color={color} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{point.name}</Text>
                    <Text style={styles.cardLocation}>{location}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemove(point.id, point.name)} style={styles.removeButton}>
                    <Ionicons name="close" size={18} color="#888" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}

          {favorites.length > 0 && (
            <Text style={styles.hint}>Mantén presionado o toca la X para quitar un favorito.</Text>
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
  content: { padding: 16, paddingTop: 0 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#aaa', marginTop: 12 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 20 },
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
  cardLocation: { fontSize: 12, color: '#888' },
  removeButton: { padding: 8 },
  hint: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 16, fontStyle: 'italic' },
});
