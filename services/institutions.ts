import { supabase } from '../lib/supabase';
import { Institution } from '../types/database';

export async function getInstitutions(): Promise<{ data: Institution[]; error: string | null }> {
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('subscription_active', true)
    .order('name', { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }
  return { data: data || [], error: null };
}

export async function getInstitutionById(id: string): Promise<{ data: Institution | null; error: string | null }> {
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
