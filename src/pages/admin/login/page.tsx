import { useState, FormEvent, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { supabase } from '../../../lib/supabase';

const AdminLogin = () => {
  const { signIn, loading, session, adminProfile } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!loading && session && adminProfile) navigate('/admin/dashboard');
  }, [loading, session, adminProfile, navigate]);

  const stopElapsed = () => {
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    setElapsed(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setTestResult(null);
    setSubmitting(true);
    setElapsed(0);

    // Count elapsed seconds for UX feedback
    elapsedTimerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    // Safety fallback: reset after 40s max
    safetyTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        stopElapsed();
        setSubmitting(false);
        setError('Kết nối mất quá lâu. Máy chủ Supabase đang rất chậm, vui lòng thử lại sau vài phút.');
      }
    }, 40000);

    try {
      const { error: err } = await signIn(email, password);
      if (!mountedRef.current) return;
      if (safetyTimerRef.current) { clearTimeout(safetyTimerRef.current); safetyTimerRef.current = null; }
      stopElapsed();
      if (err) {
        setError(err);
      } else {
        navigate('/admin/dashboard');
      }
    } catch {
      if (!mountedRef.current) return;
      stopElapsed();
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  // Quick connection test
  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const start = Date.now();
    try {
      const { error } = await Promise.race([
        supabase.from('admin_profiles').select('id').limit(1),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 8000)),
      ]) as Awaited<ReturnType<typeof supabase.from>['select']>;
      const ms = Date.now() - start;
      if (error && error.code !== 'PGRST116') {
        setTestResult(`Kết nối được nhưng có lỗi: ${error.message}`);
      } else {
        setTestResult(`Kết nối Supabase OK (${ms}ms) — Mạng và server đều ổn!`);
      }
    } catch (e: unknown) {
      const ms = Date.now() - start;
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'TIMEOUT' || ms >= 7900) {
        setTestResult('Server Supabase phản hồi quá chậm (>8 giây) — Đây là nguyên nhân không đăng nhập được. Thử lại sau vài phút.');
      } else {
        setTestResult(`Không kết nối được: ${msg}`);
      }
    } finally {
      setTesting(false);
    }
  };

  const getElapsedHint = () => {
    if (elapsed < 5) return 'Đang xác thực...';
    if (elapsed < 16) return 'Đang tải thông tin tài khoản...';
    if (elapsed < 30) return 'Server hơi chậm, vui lòng chờ...';
    return 'Gần xong rồi...';
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
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-2">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-error-warning-line text-red-500 text-sm" />
                </div>
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            {testResult && (
              <div className={`border rounded-lg px-4 py-3 flex items-start gap-2 ${testResult.includes('OK') ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className={`text-sm ${testResult.includes('OK') ? 'ri-checkbox-circle-line text-green-600' : 'ri-alarm-warning-line text-amber-600'}`} />
                </div>
                <span className={`text-sm ${testResult.includes('OK') ? 'text-green-700' : 'text-amber-700'}`}>{testResult}</span>
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
                  {getElapsedHint()}
                  {elapsed > 0 && <span className="text-white/70">({elapsed}s)</span>}
                </span>
              ) : 'Đăng nhập'}
            </button>
          </form>

          {/* Connection test */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || submitting}
              className="w-full border border-stone-200 text-stone-500 hover:text-stone-700 hover:border-stone-300 text-xs py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <span className="w-3 h-3 border border-stone-400 border-t-transparent rounded-full animate-spin" />
                  Đang kiểm tra kết nối...
                </>
              ) : (
                <>
                  <i className="ri-wifi-line text-xs" />
                  Kiểm tra kết nối server
                </>
              )}
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-stone-100 text-center">
            <p className="text-stone-500 text-xs">
              Chưa có tài khoản?{' '}
              <Link to="/admin/register" className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer">
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
