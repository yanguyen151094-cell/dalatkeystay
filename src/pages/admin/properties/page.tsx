import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase, Property } from '../../../lib/supabase';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import PropertyFormModal from './components/PropertyFormModal';

const typeLabels: Record<string, string> = {
  homestay: 'Homestay',
  apartment: 'Căn hộ',
  villa: 'Villa',
  room: 'Phòng',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Còn trống', className: 'bg-green-100 text-green-700' },
  rented: { label: 'Đang thuê', className: 'bg-amber-100 text-amber-700' },
  maintenance: { label: 'Bảo trì', className: 'bg-orange-100 text-orange-600' },
  hidden: { label: 'Ẩn', className: 'bg-stone-100 text-stone-500' },
};

const AdminProperties = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const fetchProperties = async () => {
    let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
    const { data } = await query;
    setProperties((data as Property[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('properties').delete().eq('id', id);
    setDeleteConfirm(null);
    showToast('Đã xóa căn hộ thành công!');
    fetchProperties();
  };

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.address || '').toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || p.type === filterType;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const fmtPrice = (n: number | null) =>
    n ? new Intl.NumberFormat('vi-VN').format(n) + 'đ' : '—';

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Căn hộ / Phòng</h1>
            <p className="text-stone-500 text-sm mt-1">{properties.length} căn hộ trong hệ thống</p>
          </div>
          <button
            onClick={() => { setEditingProperty(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-base" /></div>
            Thêm căn hộ
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <div className="w-9 h-9 flex items-center justify-center absolute left-0 top-0">
              <i className="ri-search-line text-stone-400 text-sm" />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 bg-white"
              placeholder="Tìm tên, địa chỉ..."
            />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
            <option value="">Tất cả loại</option>
            <option value="homestay">Homestay</option>
            <option value="apartment">Căn hộ</option>
            <option value="villa">Villa</option>
            <option value="room">Phòng</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
            <option value="">Tất cả trạng thái</option>
            <option value="available">Còn trống</option>
            <option value="rented">Đang thuê</option>
            <option value="maintenance">Bảo trì</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full mx-auto mb-3">
                <i className="ri-building-line text-stone-400 text-xl" />
              </div>
              <p className="text-stone-500 text-sm">Chưa có căn hộ nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Căn hộ</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Loại</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Giá / đêm</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Giá / tháng</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Trạng thái</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Nổi bật</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt={p.title} className="w-10 h-10 rounded-lg object-cover object-top flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-lg flex-shrink-0">
                              <i className="ri-building-line text-stone-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-stone-800">{p.title}</p>
                            <p className="text-xs text-stone-400">{p.address || p.district || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-stone-600">{typeLabels[p.type]}</td>
                      <td className="px-5 py-3 text-stone-700">{fmtPrice(p.price_per_night)}</td>
                      <td className="px-5 py-3 text-stone-700">{fmtPrice(p.price_per_month)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[p.status].className}`}>
                          {statusConfig[p.status].label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {p.is_featured ? (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-star-fill text-amber-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-star-line text-stone-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingProperty(p); setShowModal(true); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 hover:text-amber-600 transition-all cursor-pointer"
                          >
                            <i className="ri-pencil-line text-sm" />
                          </button>
                          {isSuperAdmin && (
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-500 transition-all cursor-pointer"
                            >
                              <i className="ri-delete-bin-line text-sm" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <PropertyFormModal
          property={editingProperty}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchProperties(); showToast(editingProperty ? 'Đã cập nhật căn hộ!' : 'Đã thêm căn hộ mới!'); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-xl" />
            </div>
            <h3 className="text-center font-semibold text-stone-800 mb-2">Xác nhận xóa</h3>
            <p className="text-center text-stone-500 text-sm mb-6">Bạn chắc chắn muốn xóa căn hộ này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-stone-200 text-stone-600 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition-all cursor-pointer whitespace-nowrap">Hủy</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap">Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-4 py-3 rounded-lg text-sm flex items-center gap-2 z-50">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line text-green-400" /></div>
          {toast}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProperties;
