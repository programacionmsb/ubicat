import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PointOfInterest, PointCategory } from '../../types/database';
import { addFavorite, removeFavorite, isFavorite } from '../../services/favorites';

const DAYS_LABELS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

export default function PointDetailScreen({ route, navigation }: any) {
  const point: PointOfInterest = route.params.point;
  const [favorited, setFavorited] = useState(false);
  const [loadingFav, setLoadingFav] = useState(true);

  useEffect(() => {
    checkFavorite();
  }, []);

  async function checkFavorite() {
    const isFav = await isFavorite(point.id);
    setFavorited(isFav);
    setLoadingFav(false);
  }

  async function handleToggleFavorite() {
    setLoadingFav(true);
    if (favorited) {
      const { error } = await removeFavorite(point.id);
      if (error) {
        Alert.alert('Error', error);
      } else {
        setFavorited(false);
      }
    } else {
      const { error } = await addFavorite(point.id);
      if (error) {
        Alert.alert('Error', error);
      } else {
        setFavorited(true);
      }
    }
    setLoadingFav(false);
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

  function getCategoryLabel(category: PointCategory) {
    switch (category) {
      case 'classroom': return 'Salón / Aula';
      case 'office': return 'Oficina';
      case 'bathroom': return 'Baño';
      case 'cafeteria': return 'Cafetería';
      case 'library': return 'Biblioteca';
      case 'lab': return 'Laboratorio';
      case 'auditorium': return 'Auditorio';
      case 'entrance': return 'Entrada';
      default: return 'Punto de interés';
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

  const categoryColor = getCategoryColor(point.category);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del lugar</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: categoryColor + '33' }]}>
            <Ionicons name={getCategoryIcon(point.category)} size={40} color={categoryColor} />
          </View>
          <Text style={styles.name}>{point.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '22', borderColor: categoryColor }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>{getCategoryLabel(point.category)}</Text>
          </View>
        </View>

        {point.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{point.description}</Text>
          </View>
        )}

        {point.schedule && Object.keys(point.schedule).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Horarios</Text>
            {Object.entries(point.schedule).map(([day, hours]: [string, any]) => (
              <View key={day} style={styles.scheduleRow}>
                <Text style={styles.dayLabel}>{DAYS_LABELS[day] || day}</Text>
                <Text style={styles.hoursLabel}>{hours}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.favoriteButton, favorited && styles.favoriteButtonActive]}
          onPress={handleToggleFavorite}
          disabled={loadingFav}
        >
          <Ionicons
            name={favorited ? 'star' : 'star-outline'}
            size={22}
            color={favorited ? '#ffb700' : '#0af'}
          />
          <Text style={[styles.favoriteText, favorited && styles.favoriteTextActive]}>
            {loadingFav ? 'Cargando...' : favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  hero: { alignItems: 'center', padding: 24 },
  heroIcon: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 12 },
  categoryBadge: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1,
  },
  categoryText: { fontSize: 13, fontWeight: 'bold' },
  section: { backgroundColor: '#2a2a2a', padding: 16, borderRadius: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 13, color: '#aaa', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  description: { fontSize: 15, color: '#fff', lineHeight: 22 },
  scheduleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#333',
  },
  dayLabel: { color: '#aaa', fontSize: 14 },
  hoursLabel: { color: '#fff', fontSize: 14, fontWeight: '500' },
  favoriteButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2a2a2a', padding: 16, borderRadius: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#0af',
  },
  favoriteButtonActive: { backgroundColor: '#3a2a00', borderColor: '#ffb700' },
  favoriteText: { color: '#0af', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  favoriteTextActive: { color: '#ffb700' },
});
