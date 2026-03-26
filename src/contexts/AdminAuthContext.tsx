import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { supabase, AdminProfile } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AdminAuthContextType {
  session: Session | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isSuperAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Helper: race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMsg)), ms)
    ),
  ]);
}

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const adminProfileRef = useRef<AdminProfile | null>(null);
  adminProfileRef.current = adminProfile;

  const fetchAdminProfile = async (userId: string): Promise<AdminProfile | null> => {
    try {
      const query = supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .maybeSingle();

      const { data, error } = await withTimeout(query, 20000, 'PROFILE_TIMEOUT');

      if (error) {
        console.error('fetchAdminProfile error:', error.message);
        return null;
      }
      return data as AdminProfile | null;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('fetchAdminProfile caught:', msg);
      // Re-throw PROFILE_TIMEOUT so signIn() can handle it separately
      if (msg === 'PROFILE_TIMEOUT') throw e;
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    const failsafe = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);

    const initAuth = async () => {
      try {
        const { data: sessionData } = await withTimeout(
          supabase.auth.getSession(),
          6000,
          'SESSION_TIMEOUT'
        );
        const s = sessionData?.session ?? null;
        if (cancelled) return;
        setSession(s);
        if (s?.user) {
          const profile = await fetchAdminProfile(s.user.id);
          if (!cancelled) setAdminProfile(profile);
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        if (!cancelled) {
          initializedRef.current = true;
          setLoading(false);
          clearTimeout(failsafe);
        }
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (cancelled) return;
      if (event === 'TOKEN_REFRESHED') { setSession(s); return; }
      if (event === 'SIGNED_OUT') { setSession(null); setAdminProfile(null); return; }
      if (event === 'INITIAL_SESSION') return;
      if (event === 'SIGNED_IN') {
        setSession(s);
        if (s?.user && !adminProfileRef.current) {
          try {
            const profile = await fetchAdminProfile(s.user.id);
            if (!cancelled) setAdminProfile(profile);
          } catch (e) {
            console.warn('onAuthStateChange fetchAdminProfile error:', e);
          }
        }
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Step 1: Auth with 15s timeout
      let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['data'];
      let authError: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>['error'];

      try {
        const result = await withTimeout(
          supabase.auth.signInWithPassword({ email, password }),
          15000,
          'AUTH_TIMEOUT'
        );
        data = result.data;
        authError = result.error;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '';
        if (msg === 'AUTH_TIMEOUT') {
          return { error: 'Máy chủ xác thực phản hồi quá chậm. Vui lòng thử lại sau ít phút.' };
        }
        throw e;
      }

      if (authError) {
        const status = authError.status;
        const msg = authError.message?.toLowerCase() ?? '';
        if (status === 429 || msg.includes('rate limit') || msg.includes('too many')) {
          return { error: 'Đã thử đăng nhập quá nhiều lần. Vui lòng đợi 10-15 phút rồi thử lại.' };
        }
        if (status === 400 || msg.includes('invalid') || msg.includes('email') || msg.includes('password') || msg.includes('credentials')) {
          return { error: 'Email hoặc mật khẩu không đúng.' };
        }
        return { error: `Lỗi đăng nhập: ${authError.message}` };
      }

      if (!data?.user || !data?.session) {
        return { error: 'Đăng nhập không thành công. Vui lòng thử lại.' };
      }

      // Step 2: Fetch admin profile — distinguish timeout vs no record
      let profile: AdminProfile | null = null;
      try {
        profile = await fetchAdminProfile(data.user.id);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '';
        if (msg === 'PROFILE_TIMEOUT') {
          supabase.auth.signOut().catch(() => {});
          return { error: 'Máy chủ đang phản hồi chậm (>20 giây). Vui lòng thử lại sau 1-2 phút.' };
        }
        throw e;
      }

      if (!profile) {
        supabase.auth.signOut().catch(() => {});
        return { error: 'Tài khoản này không có quyền truy cập admin hoặc đã bị vô hiệu hóa.' };
      }

      setAdminProfile(profile);
      setSession(data.session);

      supabase
        .from('admin_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id)
        .then(() => {});

      return { error: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('signIn error:', msg);
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network') || msg.toLowerCase().includes('failed')) {
        return { error: 'Không thể kết nối mạng. Vui lòng kiểm tra internet và thử lại.' };
      }
      return { error: 'Có lỗi không xác định. Vui lòng thử lại.' };
    }
  };

  const signOut = async () => {
    setAdminProfile(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  return (
    <AdminAuthContext.Provider
      value={{ session, adminProfile, loading, signIn, signOut, isSuperAdmin: adminProfile?.role === 'super_admin' }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
