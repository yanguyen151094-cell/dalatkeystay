import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Hard failsafe: force loading=false after 6s no matter what
  useEffect(() => {
    const failsafe = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(failsafe);
  }, []);

  const fetchAdminProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .maybeSingle();
    if (error) console.error('fetchAdminProfile error:', error.message);
    return data as AdminProfile | null;
  };

  useEffect(() => {
    let cancelled = false;

    const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
      Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

    const initAuth = async () => {
      try {
        const sessionResult = await withTimeout(
          supabase.auth.getSession(),
          5000,
          { data: { session: null }, error: null }
        );
        const s = sessionResult.data.session;
        if (!cancelled) {
          setSession(s);
          if (s?.user) {
            const profile = await withTimeout(
              fetchAdminProfile(s.user.id),
              5000,
              null
            );
            if (!cancelled) setAdminProfile(profile);
          }
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (cancelled) return;
      setSession(s);
      if (s?.user) {
        try {
          const profile = await withTimeout(fetchAdminProfile(s.user.id), 5000, null);
          if (!cancelled) setAdminProfile(profile);
        } catch (e) {
          console.error('Auth state change error:', e);
        }
      } else {
        setAdminProfile(null);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const authResult = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('CONNECTION_TIMEOUT')), 12000)
        ),
      ]);
      const { data, error } = authResult;
      if (error) return { error: error.message };
      if (data.user && data.session) {
        const profile = await Promise.race([
          fetchAdminProfile(data.user.id),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
        ]);
        if (!profile) {
          await supabase.auth.signOut();
          return { error: 'Tài khoản không có quyền truy cập admin.' };
        }
        supabase.from('admin_profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
      }
      return { error: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'CONNECTION_TIMEOUT') {
        return { error: 'Kết nối quá chậm. Vui lòng kiểm tra kết nối mạng và thử lại.' };
      }
      return { error: 'Đã xảy ra lỗi. Vui lòng thử lại.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAdminProfile(null);
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        session,
        adminProfile,
        loading,
        signIn,
        signOut,
        isSuperAdmin: adminProfile?.role === 'super_admin',
      }}
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
