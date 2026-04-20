import { supabase } from '../lib/supabase';
import { Building } from '../types/database';

export async function getBuildingsByInstitution(institutionId: string): Promise<{ data: Building[]; error: string | null }> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('institution_id', institutionId)
    .order('name', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getBuildingById(id: string): Promise<{ data: Building | null; error: string | null }> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
