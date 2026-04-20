export type Institution = {
  id: string;
  name: string;
  type: 'university' | 'hospital' | 'mall' | 'other';
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  subscription_active: boolean;
  created_at: string;
};

export type Building = {
  id: string;
  institution_id: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type Floor = {
  id: string;
  building_id: string;
  level: number;
  name: string;
  plan_image_url: string | null;
  created_at: string;
};

export type PointCategory = 'classroom' | 'office' | 'bathroom' | 'cafeteria' | 'library' | 'lab' | 'auditorium' | 'entrance' | 'other';

export type PointOfInterest = {
  id: string;
  floor_id: string;
  name: string;
  description: string | null;
  category: PointCategory;
  x_coordinate: number;
  y_coordinate: number;
  photo_url: string | null;
  schedule: Record<string, string> | null;
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  point_id: string;
  custom_name: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'admin' | 'superadmin';
  institution_id: string | null;
  created_at: string;
};
