import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';
import RevenueCharts from './components/RevenueCharts';

interface BookingRaw {
  total_price: number | null;
  status: string;
  check_in: string;
  created_at: string;
  property_id: string | null;
  properties?: { title: string } | null;
}

interface MonthlyData {
  month: string;
  revenue: number;
  bookings: number;
  avgValue: number;
}

interface QuarterData {
  quarter: string;
  revenue: number;
  bookings: number;
}

interface TopProperty {
  id: string;
  title: string;
  revenue: number;
  bookings: number;
}

const MONTH_LABELS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const currentYear = new Date().getFullYear();

const AdminRevenue = () => {
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [quarterly, setQuarterly] = useState<QuarterData[]>([]);
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    avgBookingValue: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    growthVsLastYear: 0,
  });

  const processData = useCallback((bookings: BookingRaw[], lastYearTotal: number) => {
    const activeStatuses = ['confirmed', 'checked_in', 'checked_out'];
    const activeBookings = bookings.filter(b => activeStatuses.includes(b.status));

    // Monthly
    const monthMap: Record<number, { revenue: number; bookings: number }> = {};
    for (let i = 1; i <= 12; i++) monthMap[i] = { revenue: 0, bookings: 0 };
    activeBookings.forEach(b => {
      const month = new Date(b.check_in).getMonth() + 1;
      monthMap[month].revenue += b.total_price || 0;
      monthMap[month].bookings += 1;
    });
    const monthlyData: MonthlyData[] = MONTH_LABELS.map((label, i) => ({
      month: label,
      revenue: monthMap[i + 1].revenue,
      bookings: monthMap[i + 1].bookings,
      avgValue: monthMap[i + 1].bookings > 0 ? Math.round(monthMap[i + 1].revenue / monthMap[i + 1].bookings) : 0,
    }));
    setMonthly(monthlyData);

    // Quarterly
    const qData: QuarterData[] = [
      { quarter: 'Q1', revenue: 0, bookings: 0 },
      { quarter: 'Q2', revenue: 0, bookings: 0 },
      { quarter: 'Q3', revenue: 0, bookings: 0 },
      { quarter: 'Q4', revenue: 0, bookings: 0 },
    ];
    activeBookings.forEach(b => {
      const month = new Date(b.check_in).getMonth() + 1;
      const qi = Math.floor((month - 1) / 3);
      qData[qi].revenue += b.total_price || 0;
      qData[qi].bookings += 1;
    });
    setQuarterly(qData);

    // Top properties
    const propMap: Record<string, { title: string; revenue: number; bookings: number }> = {};
    activeBookings.forEach(b => {
      if (!b.property_id) return;
      if (!propMap[b.property_id]) {
        propMap[b.property_id] = { title: b.properties?.title || 'Unknown', revenue: 0, bookings: 0 };
      }
      propMap[b.property_id].revenue += b.total_price || 0;
      propMap[b.property_id].bookings += 1;
    });
    const sorted = Object.entries(propMap)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
    setTopProperties(sorted);

    // Summary
    const totalRevenue = activeBookings.reduce((s, b) => s + (b.total_price || 0), 0);
    const growth = lastYearTotal > 0 ? Math.round(((totalRevenue - lastYearTotal) / lastYearTotal) * 100) : 0;
    setSummary({
      totalRevenue,
      totalBookings: bookings.length,
      avgBookingValue: activeBookings.length > 0 ? Math.round(totalRevenue / activeBookings.length) : 0,
      completedBookings: bookings.filter(b => b.status === 'checked_out').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      growthVsLastYear: growth,
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const lastYearStart = `${year - 1}-01-01`;
    const lastYearEnd = `${year - 1}-12-31`;

    const [{ data: bookings }, { data: lastYear }] = await Promise.all([
      supabase
        .from('bookings')
        .select('total_price, status, check_in, created_at, property_id, properties(title)')
        .gte('check_in', startDate)
        .lte('check_in', endDate),
      supabase
        .from('bookings')
        .select('total_price, status')
        .gte('check_in', lastYearStart)
        .lte('check_in', lastYearEnd)
        .in('status', ['confirmed', 'checked_in', 'checked_out']),
    ]);

    const lastYearTotal = (lastYear || []).reduce((s: number, b: { total_price: number | null }) => s + (b.total_price || 0), 0);
    processData((bookings as BookingRaw[]) || [], lastYearTotal);
    setLoading(false);
  }, [year, processData]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Thống kê doanh thu</h1>
            <p className="text-stone-500 text-sm mt-1">Phân tích doanh thu theo tháng, quý và căn hộ</p>
          </div>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border border-stone-200 rounded-lg px-4 py-2.5 text-sm font-medium text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer bg-white"
          >
            {yearOptions.map(y => <option key={y} value={y}>Năm {y}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-7">
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="w-9 h-9 flex items-center justify-center bg-amber-50 rounded-lg mb-3">
                  <i className="ri-money-dollar-circle-line text-amber-600 text-lg" />
                </div>
                <p className="text-xs text-stone-400 mb-0.5">Tổng doanh thu</p>
                <p className="text-lg font-bold text-stone-800 leading-tight">
                  {summary.totalRevenue >= 1_000_000
                    ? `${(summary.totalRevenue / 1_000_000).toFixed(1)}M`
                    : fmtCurrency(summary.totalRevenue)}
                </p>
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${summary.growthVsLastYear >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <i className={`text-xs ${summary.growthVsLastYear >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`} />
                  </div>
                  {Math.abs(summary.growthVsLastYear)}% vs {year - 1}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="w-9 h-9 flex items-center justify-center bg-green-50 rounded-lg mb-3">
                  <i className="ri-calendar-check-line text-green-600 text-lg" />
                </div>
                <p className="text-xs text-stone-400 mb-0.5">Tổng booking</p>
                <p className="text-lg font-bold text-stone-800">{summary.totalBookings}</p>
                <p className="text-xs text-stone-400 mt-1">{summary.completedBookings} trả phòng</p>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="w-9 h-9 flex items-center justify-center bg-sky-50 rounded-lg mb-3">
                  <i className="ri-bar-chart-box-line text-sky-600 text-lg" />
                </div>
                <p className="text-xs text-stone-400 mb-0.5">Giá trị TB</p>
                <p className="text-lg font-bold text-stone-800">
                  {summary.avgBookingValue >= 1_000_000
                    ? `${(summary.avgBookingValue / 1_000_000).toFixed(1)}M`
                    : `${(summary.avgBookingValue / 1_000).toFixed(0)}K`}
                </p>
                <p className="text-xs text-stone-400 mt-1">mỗi booking</p>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="w-9 h-9 flex items-center justify-center bg-rose-50 rounded-lg mb-3">
                  <i className="ri-close-circle-line text-rose-500 text-lg" />
                </div>
                <p className="text-xs text-stone-400 mb-0.5">Đã hủy</p>
                <p className="text-lg font-bold text-stone-800">{summary.cancelledBookings}</p>
                <p className="text-xs text-stone-400 mt-1">booking hủy</p>
              </div>
              <div className="bg-white rounded-xl border border-stone-100 p-5">
                <div className="w-9 h-9 flex items-center justify-center bg-emerald-50 rounded-lg mb-3">
                  <i className="ri-building-line text-emerald-600 text-lg" />
                </div>
                <p className="text-xs text-stone-400 mb-0.5">Căn hộ hoạt động</p>
                <p className="text-lg font-bold text-stone-800">{topProperties.length}</p>
                <p className="text-xs text-stone-400 mt-1">có booking</p>
              </div>
            </div>

            {/* Charts */}
            <RevenueCharts monthly={monthly} quarterly={quarterly} />

            {/* Quarterly Table */}
            <div className="mt-6 bg-white rounded-xl border border-stone-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100">
                <h3 className="font-semibold text-stone-800 text-sm">Tổng hợp theo quý – Năm {year}</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Quý</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Tháng</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Booking</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Doanh thu</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Tỷ trọng</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterly.map((q, i) => {
                    const months = ['T1–T3', 'T4–T6', 'T7–T9', 'T10–T12'][i];
                    const totalRev = quarterly.reduce((s, qq) => s + qq.revenue, 0);
                    const percent = totalRev > 0 ? Math.round((q.revenue / totalRev) * 100) : 0;
                    return (
                      <tr key={q.quarter} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-stone-800">{q.quarter}</span>
                        </td>
                        <td className="px-6 py-4 text-stone-500 text-xs">{months}</td>
                        <td className="px-6 py-4 text-right text-stone-700">{q.bookings}</td>
                        <td className="px-6 py-4 text-right font-semibold text-stone-800">
                          {fmtCurrency(q.revenue)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 bg-stone-100 rounded-full h-1.5">
                              <div
                                className="h-1.5 bg-amber-400 rounded-full transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-xs text-stone-500 w-8 text-right">{percent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-amber-50">
                    <td className="px-6 py-3 font-bold text-stone-800 text-sm" colSpan={2}>Tổng cộng</td>
                    <td className="px-6 py-3 text-right font-bold text-stone-800">
                      {quarterly.reduce((s, q) => s + q.bookings, 0)}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-amber-700">
                      {fmtCurrency(quarterly.reduce((s, q) => s + q.revenue, 0))}
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-stone-500">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Top Properties */}
            {topProperties.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-stone-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100">
                  <h3 className="font-semibold text-stone-800 text-sm">Căn hộ doanh thu cao nhất – Năm {year}</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">#</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Căn hộ</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Số booking</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Doanh thu</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">% tổng DT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProperties.map((prop, i) => {
                      const totalRev = topProperties.reduce((s, p) => s + p.revenue, 0);
                      const pct = totalRev > 0 ? Math.round((prop.revenue / totalRev) * 100) : 0;
                      return (
                        <tr key={prop.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                              i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-stone-100 text-stone-600' : i === 2 ? 'bg-orange-50 text-orange-600' : 'text-stone-400'
                            }`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 font-medium text-stone-800">{prop.title}</td>
                          <td className="px-6 py-3.5 text-right text-stone-600">{prop.bookings}</td>
                          <td className="px-6 py-3.5 text-right font-semibold text-stone-800">{fmtCurrency(prop.revenue)}</td>
                          <td className="px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-stone-100 rounded-full h-1.5">
                                <div
                                  className="h-1.5 bg-amber-400 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-stone-500 w-8 text-right">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {topProperties.length === 0 && summary.totalBookings === 0 && (
              <div className="mt-6 bg-white rounded-xl border border-stone-100 py-14 text-center">
                <div className="w-14 h-14 flex items-center justify-center bg-stone-50 rounded-full mx-auto mb-3">
                  <i className="ri-bar-chart-2-line text-stone-300 text-3xl" />
                </div>
                <p className="text-stone-500 text-sm font-medium">Chưa có dữ liệu doanh thu năm {year}</p>
                <p className="text-stone-400 text-xs mt-1">Dữ liệu sẽ hiện khi có booking được tạo</p>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRevenue;
