import { supabase } from '../lib/supabase';
import { PointOfInterest } from '../types/database';

export async function getPointsByFloor(floorId: string): Promise<{ data: PointOfInterest[]; error: string | null }> {
  const { data, error } = await supabase
    .from('points_of_interest')
    .select('*')
    .eq('floor_id', floorId)
    .order('name', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getPointsByBuilding(buildingId: string): Promise<{ data: PointOfInterest[]; error: string | null }> {
  // Obtener pisos del edificio
  const { data: floors, error: floorsError } = await supabase
    .from('floors')
    .select('id')
    .eq('building_id', buildingId);

  if (floorsError) return { data: [], error: floorsError.message };
  if (!floors || floors.length === 0) return { data: [], error: null };

  const floorIds = floors.map(f => f.id);

  const { data, error } = await supabase
    .from('points_of_interest')
    .select('*')
    .in('floor_id', floorIds)
    .order('name', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getPointById(id: string): Promise<{ data: PointOfInterest | null; error: string | null }> {
  const { data, error } = await supabase
    .from('points_of_interest')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
