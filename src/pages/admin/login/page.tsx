import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const AdminLogin = () => {
  const { signIn, loading, session, adminProfile } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (!loading && session && adminProfile) {
      navigate('/admin/dashboard');
    }
  }, [loading, session, adminProfile, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      } else {
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center bg-amber-500 rounded-2xl mx-auto mb-4">
            <i className="ri-key-2-line text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Key Stay Admin</h1>
          <p className="text-stone-400 text-sm mt-1">Đăng nhập để quản lý hệ thống</p>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="w-10 h-10 flex items-center justify-center absolute left-0 top-0">
                  <i className="ri-mail-line text-stone-400 text-sm" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="admin@keystay.vn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="w-10 h-10 flex items-center justify-center absolute left-0 top-0">
                  <i className="ri-lock-line text-stone-400 text-sm" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="w-10 h-10 flex items-center justify-center absolute right-0 top-0 cursor-pointer text-stone-400 hover:text-stone-600"
                >
                  <i className={showPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className="ri-error-warning-line text-red-500 text-sm" />
                </div>
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-sm transition-all disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng nhập...
                </span>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-stone-100 text-center">
            <p className="text-stone-500 text-xs">
              Chưa có tài khoản?{' '}
              <Link
                to="/admin/register"
                className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
              >
                Đăng ký tài khoản Admin Cấp 2
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-stone-500 text-xs mt-6">
          Key Stay Đà Lạt &copy; {new Date().getFullYear()} – Hệ thống quản trị nội bộ
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;