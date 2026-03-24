import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const AdminRegister = () => {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      setError('Vui lòng điền đầy đủ họ tên và email.');
      return;
    }
    setLoading(true);
    const { error: dbError } = await supabase.from('admin_requests').insert({
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      reason: form.reason.trim() || null,
      status: 'pending',
    });
    setLoading(false);
    if (dbError) {
      if (dbError.message.includes('duplicate') || dbError.message.includes('unique')) {
        setError('Email này đã có đơn đăng ký. Vui lòng chờ Admin phê duyệt.');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-5">
            <i className="ri-checkbox-circle-line text-green-500 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Đã gửi yêu cầu thành công!</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-6">
            Đơn đăng ký của bạn đã được ghi nhận. Admin Cấp 1 sẽ xem xét và phê duyệt trong vòng
            24 giờ. Bạn sẽ nhận được thông báo qua email.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium cursor-pointer"
          >
            <i className="ri-arrow-left-line" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 flex items-center justify-center bg-amber-500 rounded-xl mx-auto mb-3">
            <i className="ri-key-2-line text-white text-xl" />
          </div>
          <h1 className="text-xl font-bold text-stone-800">Đăng ký tài khoản Admin</h1>
          <p className="text-stone-500 text-sm mt-1">
            Tài khoản cần được Admin Cấp 1 phê duyệt trước khi sử dụng
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 flex gap-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-amber-600 text-base" />
          </div>
          <div>
            <p className="text-amber-800 text-xs font-medium">Tài khoản Admin Cấp 2 (Vận hành)</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Có thể quản lý căn hộ, booking, khách thuê và chỉnh sửa nội dung website.
              Không có quyền xóa tài nguyên quan trọng.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@keystay.vn"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0901 234 567"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Lý do đăng ký
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Bạn sẽ phụ trách mảng nào trong hệ thống Key Stay?"
              className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-error-warning-line text-red-500 text-sm" />
              </div>
              <span className="text-red-600 text-xs">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu đăng ký'}
          </button>
        </form>

        <p className="text-center text-stone-400 text-xs mt-6">
          Đã có tài khoản?{' '}
          <Link to="/admin/login" className="text-amber-600 hover:text-amber-700 cursor-pointer">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
