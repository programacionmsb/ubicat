import { supabase } from '../lib/supabase';
import { Floor } from '../types/database';

export async function getFloorsByBuilding(buildingId: string): Promise<{ data: Floor[]; error: string | null }> {
  const { data, error } = await supabase
    .from('floors')
    .select('*')
    .eq('building_id', buildingId)
    .order('level', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}
