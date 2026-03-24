import { useEffect, useState, FormEvent } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase, Booking } from '../../../lib/supabase';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-green-100 text-green-700' },
  checked_in: { label: 'Đang ở', className: 'bg-amber-100 text-amber-700' },
  checked_out: { label: 'Đã trả phòng', className: 'bg-stone-100 text-stone-600' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-600' },
  refunded: { label: 'Hoàn tiền', className: 'bg-orange-100 text-orange-600' },
};

const paymentConfig: Record<string, { label: string; className: string }> = {
  unpaid: { label: 'Chưa thanh toán', className: 'bg-red-100 text-red-600' },
  partial: { label: 'Đặt cọc', className: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Đã thanh toán', className: 'bg-green-100 text-green-700' },
  refunded: { label: 'Đã hoàn', className: 'bg-orange-100 text-orange-600' },
};

interface PropertyOption { id: string; title: string; }

const AdminBookings = () => {
  const { adminProfile } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tenant_name: '', tenant_phone: '', tenant_email: '',
    property_id: '', check_in: '', check_out: '',
    guests: '1', total_price: '', status: 'pending',
    payment_status: 'unpaid', payment_method: '', source: 'direct', notes: '',
  });

  const fetchData = async () => {
    const [{ data: bData }, { data: pData }] = await Promise.all([
      supabase.from('bookings').select('*, properties(title)').order('created_at', { ascending: false }),
      supabase.from('properties').select('id, title').eq('status', 'available').order('title'),
    ]);
    setBookings((bData as Booking[]) || []);
    setProperties((pData as PropertyOption[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openNew = () => {
    setEditingBooking(null);
    setForm({ tenant_name: '', tenant_phone: '', tenant_email: '', property_id: '', check_in: '', check_out: '', guests: '1', total_price: '', status: 'pending', payment_status: 'unpaid', payment_method: '', source: 'direct', notes: '' });
    setShowModal(true);
  };

  const openEdit = (b: Booking) => {
    setEditingBooking(b);
    setForm({
      tenant_name: b.tenant_name, tenant_phone: b.tenant_phone || '', tenant_email: b.tenant_email || '',
      property_id: b.property_id || '', check_in: b.check_in, check_out: b.check_out,
      guests: b.guests.toString(), total_price: b.total_price?.toString() || '',
      status: b.status, payment_status: b.payment_status, payment_method: b.payment_method || '', source: b.source, notes: b.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      tenant_name: form.tenant_name, tenant_phone: form.tenant_phone || null, tenant_email: form.tenant_email || null,
      property_id: form.property_id || null, check_in: form.check_in, check_out: form.check_out,
      guests: Number(form.guests), total_price: form.total_price ? Number(form.total_price) : null,
      status: form.status, payment_status: form.payment_status, payment_method: form.payment_method || null,
      source: form.source, notes: form.notes || null, updated_at: new Date().toISOString(),
    };
    if (editingBooking) {
      await supabase.from('bookings').update(payload).eq('id', editingBooking.id);
    } else {
      await supabase.from('bookings').insert({ ...payload, created_by: adminProfile?.id });
    }
    setSubmitting(false);
    setShowModal(false);
    fetchData();
    showToast(editingBooking ? 'Đã cập nhật booking!' : 'Đã tạo booking mới!');
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !search || b.tenant_name.toLowerCase().includes(search.toLowerCase()) || (b.tenant_phone || '').includes(search);
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const fmtCurrency = (n: number | null) => n ? new Intl.NumberFormat('vi-VN').format(n) + 'đ' : '—';

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Quản lý Booking</h1>
            <p className="text-stone-500 text-sm mt-1">{bookings.length} booking trong hệ thống</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-base" /></div>
            Thêm booking
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <div className="w-9 h-9 flex items-center justify-center absolute left-0 top-0">
              <i className="ri-search-line text-stone-400 text-sm" />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 bg-white" placeholder="Tìm tên, SĐT..." />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full mx-auto mb-3"><i className="ri-calendar-line text-stone-400 text-xl" /></div>
              <p className="text-stone-500 text-sm">Chưa có booking nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['Khách', 'Căn hộ', 'Check-in', 'Check-out', 'Giá', 'Trạng thái', 'Thanh toán', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-stone-800">{b.tenant_name}</p>
                        <p className="text-xs text-stone-400">{b.tenant_phone || '—'}</p>
                      </td>
                      <td className="px-5 py-3 text-stone-600">{b.properties?.title || '—'}</td>
                      <td className="px-5 py-3 text-stone-600">{new Date(b.check_in).toLocaleDateString('vi-VN')}</td>
                      <td className="px-5 py-3 text-stone-600">{new Date(b.check_out).toLocaleDateString('vi-VN')}</td>
                      <td className="px-5 py-3 font-medium text-stone-800">{fmtCurrency(b.total_price)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[b.status].className}`}>{statusConfig[b.status].label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentConfig[b.payment_status].className}`}>{paymentConfig[b.payment_status].label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => openEdit(b)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 hover:text-amber-600 transition-all cursor-pointer">
                          <i className="ri-pencil-line text-sm" />
                        </button>
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
          <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
              <h2 className="font-semibold text-stone-800">{editingBooking ? 'Chỉnh sửa booking' : 'Tạo booking mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer">
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Tên khách *</label>
                    <input required value={form.tenant_name} onChange={e => setForm(f => ({ ...f, tenant_name: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">SĐT</label>
                    <input value={form.tenant_phone} onChange={e => setForm(f => ({ ...f, tenant_phone: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input type="email" value={form.tenant_email} onChange={e => setForm(f => ({ ...f, tenant_email: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Căn hộ</label>
                    <select value={form.property_id} onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
                      <option value="">-- Chọn căn hộ --</option>
                      {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Check-in *</label>
                    <input required type="date" value={form.check_in} onChange={e => setForm(f => ({ ...f, check_in: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Check-out *</label>
                    <input required type="date" value={form.check_out} onChange={e => setForm(f => ({ ...f, check_out: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Số khách</label>
                    <input type="number" min="1" value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Tổng tiền (VNĐ)</label>
                    <input type="number" value={form.total_price} onChange={e => setForm(f => ({ ...f, total_price: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Trạng thái</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
                      {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Thanh toán</label>
                    <select value={form.payment_status} onChange={e => setForm(f => ({ ...f, payment_status: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
                      {Object.entries(paymentConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phương thức</label>
                    <input value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="Tiền mặt / Chuyển khoản" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nguồn</label>
                    <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer">
                      <option value="direct">Trực tiếp</option>
                      <option value="website">Website</option>
                      <option value="airbnb">Airbnb</option>
                      <option value="booking_com">Booking.com</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Ghi chú</label>
                    <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" maxLength={500} />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 flex-shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 cursor-pointer whitespace-nowrap">Hủy</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60">
                  {submitting ? 'Đang lưu...' : editingBooking ? 'Cập nhật' : 'Tạo booking'}
                </button>
              </div>
            </form>
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

export default AdminBookings;
