import { useState, useEffect, FormEvent } from 'react';
import { supabase, Property } from '../../../../lib/supabase';
import { useAdminAuth } from '../../../../contexts/AdminAuthContext';

interface Props {
  property: Property | null;
  onClose: () => void;
  onSaved: () => void;
}

const AMENITIES_LIST = ['Wi-Fi', 'Điều hòa', 'Bếp', 'Máy giặt', 'TV', 'Bãi đỗ xe', 'Hồ bơi', 'Ban công', 'View núi', 'View thành phố', 'Thang máy', 'Bảo vệ 24/7'];

const PropertyFormModal = ({ property, onClose, onSaved }: Props) => {
  const { adminProfile } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'homestay',
    status: 'available',
    price_per_night: '',
    price_per_month: '',
    area: '',
    bedrooms: '1',
    bathrooms: '1',
    max_guests: '2',
    address: '',
    district: '',
    thumbnail: '',
    is_featured: false,
    amenities: [] as string[],
  });

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description || '',
        type: property.type,
        status: property.status,
        price_per_night: property.price_per_night?.toString() || '',
        price_per_month: property.price_per_month?.toString() || '',
        area: property.area?.toString() || '',
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        max_guests: property.max_guests.toString(),
        address: property.address || '',
        district: property.district || '',
        thumbnail: property.thumbnail || '',
        is_featured: property.is_featured,
        amenities: property.amenities || [],
      });
    }
  }, [property]);

  const toggleAmenity = (a: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      type: form.type,
      status: form.status,
      price_per_night: form.price_per_night ? Number(form.price_per_night) : null,
      price_per_month: form.price_per_month ? Number(form.price_per_month) : null,
      area: form.area ? Number(form.area) : null,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      max_guests: Number(form.max_guests),
      address: form.address || null,
      district: form.district || null,
      thumbnail: form.thumbnail || null,
      is_featured: form.is_featured,
      amenities: form.amenities,
      updated_at: new Date().toISOString(),
    };

    if (property) {
      await supabase.from('properties').update(payload).eq('id', property.id);
    } else {
      await supabase.from('properties').insert({ ...payload, created_by: adminProfile?.id });
    }
    setSubmitting(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-stone-800">{property ? 'Chỉnh sửa căn hộ' : 'Thêm căn hộ mới'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Tên căn hộ *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="VD: Homestay View Núi Langbiang" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Loại hình *</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 cursor-pointer bg-white">
                  <option value="homestay">Homestay</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="villa">Villa</option>
                  <option value="room">Phòng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Trạng thái *</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 cursor-pointer bg-white">
                  <option value="available">Còn trống</option>
                  <option value="rented">Đang thuê</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Giá / đêm (VNĐ)</label>
                <input type="number" value={form.price_per_night} onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="500000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Giá / tháng (VNĐ)</label>
                <input type="number" value={form.price_per_month} onChange={e => setForm(f => ({ ...f, price_per_month: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="8000000" />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Diện tích (m²)</label>
                <input type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phòng ngủ</label>
                <input type="number" min="0" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phòng tắm</label>
                <input type="number" min="0" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Khách tối đa</label>
                <input type="number" min="1" value={form.max_guests} onChange={e => setForm(f => ({ ...f, max_guests: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Địa chỉ</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="123 Đường ABC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Khu vực / Phường</label>
                <input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="Phường 1" />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Link ảnh đại diện</label>
              <input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="https://..." />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Mô tả</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" placeholder="Mô tả căn hộ..." maxLength={500} />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Tiện ích</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      form.amenities.includes(a)
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-amber-500" />
              <span className="text-sm text-stone-700">Đánh dấu là nổi bật (hiển thị trên trang chủ)</span>
            </label>
          </div>

          <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-all cursor-pointer whitespace-nowrap">Hủy</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60">
              {submitting ? 'Đang lưu...' : property ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
