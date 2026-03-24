import { supabase } from './supabase';
import type { Property as SupabaseProperty } from './supabase';
import { rentalListings, homestayListings, apartmentListings } from '../mocks/listings';
import type { Property as MockProperty } from '../mocks/listings';

export interface UIProperty {
  id: string | number;
  title: string;
  area: string;
  price: number;
  priceUnit: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  type: 'rental' | 'homestay' | 'apartment';
  image: string;
  images: string[];
  address: string;
  description: string;
  amenities: string[];
  featured: boolean;
}

export function mapSupabaseToUI(p: SupabaseProperty): UIProperty {
  let type: UIProperty['type'];
  if (p.listing_type === 'sale') {
    type = 'apartment';
  } else if (p.type === 'homestay') {
    type = 'homestay';
  } else {
    type = 'rental';
  }

  let price: number;
  let priceUnit: string;
  if (p.listing_type === 'sale') {
    price = p.sale_price || 0;
    priceUnit = '';
  } else if (p.type === 'homestay') {
    price = p.price_per_night || 0;
    priceUnit = '/đêm';
  } else {
    price = p.price_per_month || 0;
    priceUnit = '/tháng';
  }

  const rawImages = Array.isArray(p.images) ? p.images : [];
  const thumbnail = p.thumbnail || (rawImages.length > 0 ? rawImages[0] : '');

  return {
    id: p.id,
    title: p.title,
    area: p.district || p.city || 'Đà Lạt',
    price,
    priceUnit,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    size: p.area || 0,
    type,
    image: thumbnail,
    images: rawImages,
    address: p.address || p.city || 'Đà Lạt',
    description: p.description || '',
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    featured: p.is_featured,
  };
}

function mapMockToUI(p: MockProperty): UIProperty {
  return {
    id: p.id,
    title: p.title,
    area: p.area,
    price: p.price,
    priceUnit: p.priceUnit,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    size: p.size,
    type: p.type === 'apartment' ? 'apartment' : p.type === 'homestay' ? 'homestay' : 'rental',
    image: p.image,
    images: p.images,
    address: p.address,
    description: p.description,
    amenities: p.amenities,
    featured: p.featured,
  };
}

export function formatUIPrice(price: number, type: UIProperty['type']): string {
  if (type === 'apartment') {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1).replace('.0', '')} tỷ`;
    }
    return `${(price / 1000000).toFixed(0)} triệu`;
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`;
  }
  return `${price.toLocaleString('vi-VN')}đ`;
}

export async function fetchRentalProperties(limit = 100): Promise<UIProperty[]> {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('listing_type', 'rent')
    .neq('type', 'homestay')
    .neq('status', 'hidden')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const supabaseItems = ((data || []) as SupabaseProperty[]).map(mapSupabaseToUI);
  const mockItems = rentalListings.map(mapMockToUI);
  const supabaseIds = new Set(supabaseItems.map(i => String(i.id)));
  const filteredMock = mockItems.filter(m => !supabaseIds.has(String(m.id)));
  return [...supabaseItems, ...filteredMock].slice(0, limit);
}

export async function fetchHomestayProperties(limit = 100): Promise<UIProperty[]> {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('type', 'homestay')
    .neq('status', 'hidden')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const supabaseItems = ((data || []) as SupabaseProperty[]).map(mapSupabaseToUI);
  const mockItems = homestayListings.map(mapMockToUI);
  const supabaseIds = new Set(supabaseItems.map(i => String(i.id)));
  const filteredMock = mockItems.filter(m => !supabaseIds.has(String(m.id)));
  return [...supabaseItems, ...filteredMock].slice(0, limit);
}

export async function fetchSaleProperties(limit = 100): Promise<UIProperty[]> {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('listing_type', 'sale')
    .neq('status', 'hidden')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const supabaseItems = ((data || []) as SupabaseProperty[]).map(mapSupabaseToUI);
  const mockItems = apartmentListings.map(mapMockToUI);
  const supabaseIds = new Set(supabaseItems.map(i => String(i.id)));
  const filteredMock = mockItems.filter(m => !supabaseIds.has(String(m.id)));
  return [...supabaseItems, ...filteredMock].slice(0, limit);
}

export async function fetchAllProperties(limit = 300): Promise<UIProperty[]> {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .neq('status', 'hidden')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const supabaseItems = ((data || []) as SupabaseProperty[]).map(mapSupabaseToUI);
  const allMock = [
    ...rentalListings.map(mapMockToUI),
    ...homestayListings.map(mapMockToUI),
    ...apartmentListings.map(mapMockToUI),
  ];
  const supabaseIds = new Set(supabaseItems.map(i => String(i.id)));
  const filteredMock = allMock.filter(m => !supabaseIds.has(String(m.id)));
  return [...supabaseItems, ...filteredMock].slice(0, limit);
}

export async function fetchPropertyById(id: string): Promise<UIProperty | null> {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!data) return null;
  return mapSupabaseToUI(data as SupabaseProperty);
}
