import { supabase } from '../lib/supabase';

export type FavoriteWithPoint = {
  id: string;
  user_id: string;
  point_id: string;
  custom_name: string | null;
  created_at: string;
  points_of_interest?: {
    id: string;
    name: string;
    description: string | null;
    category: string;
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
      };
    };
  };
};

export async function getMyFavorites(): Promise<{ data: FavoriteWithPoint[]; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { data: [], error: 'No autenticado' };

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      points_of_interest (
        *,
        floors (
          id,
          name,
          level,
          buildings (
            id,
            name
          )
        )
      )
    `)
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function isFavorite(pointId: string): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('point_id', pointId)
    .maybeSingle();

  return !!data;
}

export async function addFavorite(pointId: string, customName?: string): Promise<{ error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: 'No autenticado' };

  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: userData.user.id,
      point_id: pointId,
      custom_name: customName || null,
    });

  if (error) return { error: error.message };
  return { error: null };
}

export async function removeFavorite(pointId: string): Promise<{ error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: 'No autenticado' };

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userData.user.id)
    .eq('point_id', pointId);

  if (error) return { error: error.message };
  return { error: null };
}
