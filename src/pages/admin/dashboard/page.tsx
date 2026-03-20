import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';

interface Stats {
  totalProperties: number;
  availableProperties: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalTenants: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

interface RecentBooking {
  id: string;
  tenant_name: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number | null;
  properties?: { title: string } | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  checked_in: 'bg-amber-100 text-amber-700',
  checked_out: 'bg-stone-100 text-stone-600',
  cancelled: 'bg-red-100 text-red-600',
  refunded: 'bg-orange-100 text-orange-600',
};

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  checked_in: 'Đang ở',
  checked_out: 'Đã trả phòng',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const [
        { count: totalProperties },
        { count: availableProperties },
        { count: totalBookings },
        { count: pendingBookings },
        { count: confirmedBookings },
        { count: totalTenants },
        { data: revenueThisMonthData },
        { data: revenueLastMonthData },
        { data: recent },
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabase.from('tenants').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_price').gte('created_at', firstDayThisMonth).not('status', 'in', '(cancelled,refunded)'),
        supabase.from('bookings').select('total_price').gte('created_at', firstDayLastMonth).lte('created_at', lastDayLastMonth).not('status', 'in', '(cancelled,refunded)'),
        supabase.from('bookings').select('id, tenant_name, check_in, check_out, status, total_price, properties(title)').order('created_at', { ascending: false }).limit(5),
      ]);

      const sumRevenue = (data: { total_price: number | null }[] | null) =>
        (data || []).reduce((acc, b) => acc + (b.total_price || 0), 0);

      setStats({
        totalProperties: totalProperties || 0,
        availableProperties: availableProperties || 0,
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        confirmedBookings: confirmedBookings || 0,
        totalTenants: totalTenants || 0,
        revenueThisMonth: sumRevenue(revenueThisMonthData),
        revenueLastMonth: sumRevenue(revenueLastMonthData),
      });
      setRecentBookings((recent as RecentBooking[]) || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

  const revenueDiff = stats ? stats.revenueThisMonth - stats.revenueLastMonth : 0;
  const revenuePercent = stats?.revenueLastMonth
    ? Math.round((revenueDiff / stats.revenueLastMonth) * 100)
    : 0;

  const statCards = stats
    ? [
        { label: 'Tổng căn hộ', value: stats.totalProperties, sub: `${stats.availableProperties} còn trống`, icon: 'ri-building-line', color: 'bg-amber-50 text-amber-600' },
        { label: 'Tổng booking', value: stats.totalBookings, sub: `${stats.pendingBookings} chờ xác nhận`, icon: 'ri-calendar-check-line', color: 'bg-green-50 text-green-600' },
        { label: 'Khách thuê', value: stats.totalTenants, sub: `${stats.confirmedBookings} đang ở`, icon: 'ri-group-line', color: 'bg-sky-50 text-sky-600' },
        {
          label: 'Doanh thu tháng này',
          value: fmtCurrency(stats.revenueThisMonth),
          sub: revenueDiff >= 0 ? `+${revenuePercent}% so với tháng trước` : `${revenuePercent}% so với tháng trước`,
          icon: 'ri-money-dollar-circle-line',
          color: 'bg-rose-50 text-rose-600',
        },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Tổng quan hoạt động Key Stay Đà Lạt</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-5 mb-8">
              {statCards.map(card => (
                <div key={card.label} className="bg-white rounded-xl p-5 border border-stone-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${card.color}`}>
                      <i className={`${card.icon} text-lg`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-stone-800 mb-1">{card.value}</p>
                  <p className="text-xs text-stone-500">{card.label}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl border border-stone-100">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
                <h2 className="font-semibold text-stone-800 text-sm">Booking gần đây</h2>
              </div>
              <div className="overflow-x-auto">
                {recentBookings.length === 0 ? (
                  <div className="py-16 text-center text-stone-400 text-sm">Chưa có booking nào</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Khách</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Căn hộ</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Check-in</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Check-out</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Giá</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(b => (
                        <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-stone-800">{b.tenant_name}</td>
                          <td className="px-6 py-3 text-stone-600">{b.properties?.title || '—'}</td>
                          <td className="px-6 py-3 text-stone-600">{new Date(b.check_in).toLocaleDateString('vi-VN')}</td>
                          <td className="px-6 py-3 text-stone-600">{new Date(b.check_out).toLocaleDateString('vi-VN')}</td>
                          <td className="px-6 py-3 text-stone-800 font-medium">
                            {b.total_price ? fmtCurrency(b.total_price) : '—'}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                              {statusLabels[b.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
