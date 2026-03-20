import { useEffect, useState, FormEvent } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase, Tenant } from '../../../lib/supabase';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const AdminTenants = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', id_number: '', address: '', notes: '' });

  const fetchTenants = async () => {
    const { data } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
    setTenants((data as Tenant[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchTenants(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openNew = () => {
    setEditingTenant(null);
    setForm({ full_name: '', phone: '', email: '', id_number: '', address: '', notes: '' });
    setShowModal(true);
  };

  const openEdit = (t: Tenant) => {
    setEditingTenant(t);
    setForm({ full_name: t.full_name, phone: t.phone || '', email: t.email || '', id_number: t.id_number || '', address: t.address || '', notes: t.notes || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      full_name: form.full_name, phone: form.phone || null, email: form.email || null,
      id_number: form.id_number || null, address: form.address || null, notes: form.notes || null,
      updated_at: new Date().toISOString(),
    };
    if (editingTenant) {
      await supabase.from('tenants').update(payload).eq('id', editingTenant.id);
    } else {
      await supabase.from('tenants').insert(payload);
    }
    setSubmitting(false);
    setShowModal(false);
    fetchTenants();
    showToast(editingTenant ? 'Đã cập nhật khách thuê!' : 'Đã thêm khách thuê mới!');
  };

  const handleDelete = async (id: string) => {
    await supabase.from('tenants').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchTenants();
    showToast('Đã xóa khách thuê!');
  };

  const filtered = tenants.filter(t =>
    !search || t.full_name.toLowerCase().includes(search.toLowerCase()) || (t.phone || '').includes(search) || (t.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const fmtCurrency = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Khách thuê</h1>
            <p className="text-stone-500 text-sm mt-1">{tenants.length} khách trong hệ thống</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-base" /></div>
            Thêm khách thuê
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <div className="w-9 h-9 flex items-center justify-center absolute left-0 top-0">
              <i className="ri-search-line text-stone-400 text-sm" />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 bg-white" placeholder="Tìm tên, SĐT, email..." />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full mx-auto mb-3"><i className="ri-user-line text-stone-400 text-xl" /></div>
              <p className="text-stone-500 text-sm">Chưa có khách thuê nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['Khách thuê', 'SĐT', 'Email', 'CCCD/CMND', 'Tổng booking', 'Doanh thu', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
                            <span className="text-amber-700 text-xs font-bold">{t.full_name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">{t.full_name}</p>
                            <p className="text-xs text-stone-400">{t.address || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-stone-600">{t.phone || '—'}</td>
                      <td className="px-5 py-3 text-stone-600">{t.email || '—'}</td>
                      <td className="px-5 py-3 text-stone-600">{t.id_number || '—'}</td>
                      <td className="px-5 py-3">
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">{t.total_bookings} lần</span>
                      </td>
                      <td className="px-5 py-3 font-medium text-stone-800">{t.total_spent > 0 ? fmtCurrency(t.total_spent) : '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(t)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 hover:text-amber-600 transition-all cursor-pointer">
                            <i className="ri-pencil-line text-sm" />
                          </button>
                          {isSuperAdmin && (
                            <button onClick={() => setDeleteConfirm(t.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-500 transition-all cursor-pointer">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
              <h2 className="font-semibold text-stone-800">{editingTenant ? 'Chỉnh sửa khách thuê' : 'Thêm khách thuê mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Họ tên *</label>
                  <input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">SĐT</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">CCCD / CMND</label>
                  <input value={form.id_number} onChange={e => setForm(f => ({ ...f, id_number: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Địa chỉ</label>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Ghi chú</label>
                  <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" maxLength={500} />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">Hủy</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60">
                  {submitting ? 'Đang lưu...' : editingTenant ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4"><i className="ri-delete-bin-line text-red-500 text-xl" /></div>
            <h3 className="text-center font-semibold text-stone-800 mb-2">Xác nhận xóa</h3>
            <p className="text-center text-stone-500 text-sm mb-6">Bạn chắc chắn muốn xóa khách thuê này?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-stone-200 text-stone-600 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap">Hủy</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap">Xóa</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-4 py-3 rounded-lg text-sm flex items-center gap-2 z-50">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-check-line text-green-400" /></div>
          {toast}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTenants;
