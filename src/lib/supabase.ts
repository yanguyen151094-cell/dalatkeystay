import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AdminRole = 'super_admin' | 'operator';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  type: 'homestay' | 'apartment' | 'villa' | 'room';
  listing_type: 'rent' | 'sale';
  status: 'available' | 'rented' | 'maintenance' | 'hidden';
  price_per_night: number | null;
  price_per_month: number | null;
  sale_price: number | null;
  area: number | null;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  address: string | null;
  district: string | null;
  city: string;
  amenities: string[];
  images: string[];
  thumbnail: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  id_number: string | null;
  address: string | null;
  notes: string | null;
  total_bookings: number;
  total_spent: number;
  created_at: string;
}

export interface Booking {
  id: string;
  property_id: string | null;
  tenant_id: string | null;
  tenant_name: string;
  tenant_phone: string | null;
  tenant_email: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number | null;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  payment_method: string | null;
  notes: string | null;
  source: 'direct' | 'website' | 'airbnb' | 'booking_com' | 'other';
  created_at: string;
  properties?: { title: string } | null;
}
