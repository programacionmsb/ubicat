import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchPoints } from '../../services/points';
import { PointCategory } from '../../types/database';

type SearchResult = {
  id: string;
  name: string;
  description: string | null;
  category: PointCategory;
  x_coordinate: number;
  y_coordinate: number;
  photo_url: string | null;
  schedule: any;
  floor_id: string;
  created_at: string;
  floors?: {
    id: string;
    name: string;
    level: number;
    buildings?: {
      id: string;
      name: string;
      institution_id: string;
      institutions?: {
        id: string;
        name: string;
      };
    };
  };
};

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<any>(null);

  // Búsqueda con debounce de 300ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await searchPoints(query);
      setResults(data);
      setLoading(false);
      setSearched(true);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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

  function getLocationLabel(item: SearchResult): string {
    const buildingName = item.floors?.buildings?.name;
    const floorName = item.floors?.name;
    if (buildingName && floorName) return `${buildingName} - ${floorName}`;
    if (buildingName) return buildingName;
    return 'Ubicación desconocida';
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar salón, oficina, cafetería..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#0af" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!query || query.trim().length < 2 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#555" />
            <Text style={styles.emptyTitle}>Busca tu destino</Text>
            <Text style={styles.emptyText}>Escribe al menos 2 letras del nombre de un salón, oficina, baño o cualquier lugar.</Text>
          </View>
        ) : !loading && searched && results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="sad-outline" size={48} color="#555" />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyText}>No encontramos ningún punto que coincida con "{query}". Prueba con otras palabras.</Text>
          </View>
        ) : (
          results.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PointDetail', { point: item })}
            >
              <View style={[styles.cardIcon, { backgroundColor: getCategoryColor(item.category) + '33' }]}>
                <Ionicons name={getCategoryIcon(item.category)} size={20} color={getCategoryColor(item.category)} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardLocation}>{getLocationLabel(item)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { padding: 24, paddingBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 12, fontSize: 16 },
  clearButton: { padding: 4 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  loadingText: { color: '#aaa', marginLeft: 8, fontSize: 13 },
  content: { padding: 16, paddingTop: 8 },
  emptyState: { alignItems: 'center', padding: 32 },
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
});
