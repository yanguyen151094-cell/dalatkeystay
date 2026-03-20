import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area,
} from 'recharts';

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

interface RevenueChartsProps {
  monthly: MonthlyData[];
  quarterly: QuarterData[];
}

const fmtCurrency = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)}K`
    : `${n}`;

const fmtFull = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const CustomTooltipRevenue = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs">
      <p className="font-semibold text-stone-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-stone-600">{fmtFull(p.value)}</p>
      ))}
    </div>
  );
};

const RevenueCharts = ({ monthly, quarterly }: RevenueChartsProps) => {
  return (
    <div className="space-y-6">
      {/* Monthly Bar Chart */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-stone-800 text-sm">Doanh thu theo tháng</h3>
            <p className="text-stone-400 text-xs mt-0.5">Doanh thu các booking đã xác nhận</p>
          </div>
        </div>
        {monthly.every(m => m.revenue === 0) ? (
          <div className="flex items-center justify-center h-48 text-stone-300 text-sm">
            Chưa có dữ liệu doanh thu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly} barSize={28} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltipRevenue />} cursor={{ fill: '#fef3c7', radius: 6 }} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bookings + Revenue dual axis */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <h3 className="font-semibold text-stone-800 text-sm mb-1">Số booking theo tháng</h3>
          <p className="text-stone-400 text-xs mb-5">Tổng booking mỗi tháng</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#78716c' }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
              <Tooltip formatter={(v: number) => [`${v} booking`, 'Số booking']} contentStyle={{ borderRadius: 10, border: '1px solid #e7e5e4', fontSize: 11 }} />
              <Area type="monotone" dataKey="bookings" stroke="#f59e0b" strokeWidth={2} fill="url(#colorBookings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-stone-100 p-6">
          <h3 className="font-semibold text-stone-800 text-sm mb-1">Theo quý</h3>
          <p className="text-stone-400 text-xs mb-5">Tổng hợp doanh thu 4 quý</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={quarterly} barSize={36} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 10, fill: '#78716c' }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<CustomTooltipRevenue />} cursor={{ fill: '#fef3c7', radius: 6 }} />
              <Bar dataKey="revenue" fill="#78716c" radius={[6, 6, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average booking value line chart */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h3 className="font-semibold text-stone-800 text-sm mb-1">Giá trị trung bình mỗi booking</h3>
        <p className="text-stone-400 text-xs mb-5">Xu hướng giá trị booking theo tháng</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtCurrency} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} width={52} />
            <Tooltip content={<CustomTooltipRevenue />} />
            <Line type="monotone" dataKey="avgValue" stroke="#d97706" strokeWidth={2.5} dot={{ fill: '#d97706', r: 4 }} activeDot={{ r: 6 }} name="Giá trị TB" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueCharts;
