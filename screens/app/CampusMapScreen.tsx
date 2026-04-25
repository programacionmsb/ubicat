import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getBuildingsByInstitution } from '../../services/buildings';
import { Building, Institution } from '../../types/database';

export default function CampusMapScreen({ route, navigation }: any) {
  const institution: Institution = route.params.institution;
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [layersExpanded, setLayersExpanded] = useState(false);
  const mapRef = useRef<MapView>(null);

  async function loadData() {
    const { data } = await getBuildingsByInstitution(institution.id);
    setBuildings(data);
    setLoading(false);
  }

  async function requestLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setLocationAllowed(true);
    }
  }

  useEffect(() => {
    loadData();
    requestLocation();
  }, []);

  function centerOnInstitution() {
    if (institution.latitude && institution.longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: institution.latitude,
        longitude: institution.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 800);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0af" />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!institution.latitude || !institution.longitude) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mapa del campus</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={48} color="#555" />
          <Text style={styles.emptyText}>Esta institución aún no tiene ubicación registrada.</Text>
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
        <Text style={styles.headerTitle} numberOfLines={1}>{institution.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          mapType={mapType}
          style={styles.map}
          initialRegion={{
            latitude: institution.latitude,
            longitude: institution.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={locationAllowed}
          showsMyLocationButton={false}
        >
          {buildings.map((b) => {
            if (!b.latitude || !b.longitude) return null;
            return (
              <Marker
                key={b.id}
                coordinate={{ latitude: b.latitude, longitude: b.longitude }}
                title={b.name}
                description={b.description || ''}
                onCalloutPress={() => navigation.navigate('BuildingDetail', { building: b })}
              />
            );
          })}
        </MapView>

        <View style={styles.layersContainer}>
          {layersExpanded && (
            <View style={styles.layersOptions}>
              <TouchableOpacity
                style={[styles.layerOption, mapType === 'standard' && styles.layerOptionActive]}
                onPress={() => { setMapType('standard'); setLayersExpanded(false); }}
              >
                <Ionicons name="map" size={18} color="#fff" />
                <Text style={styles.layerOptionText}>Mapa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.layerOption, mapType === 'satellite' && styles.layerOptionActive]}
                onPress={() => { setMapType('satellite'); setLayersExpanded(false); }}
              >
                <Ionicons name="globe" size={18} color="#fff" />
                <Text style={styles.layerOptionText}>Satélite</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.layerOption, mapType === 'hybrid' && styles.layerOptionActive]}
                onPress={() => { setMapType('hybrid'); setLayersExpanded(false); }}
              >
                <Ionicons name="earth" size={18} color="#fff" />
                <Text style={styles.layerOptionText}>Híbrido</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.layersButton} onPress={() => setLayersExpanded(!layersExpanded)}>
            <Ionicons name={layersExpanded ? 'close' : 'layers'} size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.centerButton} onPress={centerOnInstitution}>
          <Ionicons name="locate" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>
          {buildings.length} edificio{buildings.length !== 1 ? 's' : ''} en este campus
        </Text>
        <Text style={styles.legendHint}>
          Toca un marcador para ver detalles, y toca la tarjeta que aparece para entrar.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginHorizontal: 8 },
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { color: '#aaa', marginTop: 12 },
  emptyText: { color: '#aaa', marginTop: 16, textAlign: 'center' },
  centerButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#0af',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  legend: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  legendTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  legendHint: { color: '#888', fontSize: 12 },
  layersContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'flex-end',
  },
  layersButton: {
    backgroundColor: '#0af',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  layersOptions: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 6,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  layerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 2,
    minWidth: 130,
  },
  layerOptionActive: {
    backgroundColor: '#0af',
  },
  layerOptionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
  },
});
