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

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // Track whether the initial auth setup has been fully completed
  const initializedRef = useRef(false);

  const fetchAdminProfile = async (userId: string): Promise<AdminProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .maybeSingle();
      if (error) {
        console.error('fetchAdminProfile error:', error.message);
        return null;
      }
      return data as AdminProfile | null;
    } catch (e) {
      console.error('fetchAdminProfile exception:', e);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    // Absolute failsafe: force done after 8s
    const failsafe = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);

    const initAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const s = sessionData?.session ?? null;

        if (cancelled) return;
        setSession(s);

        if (s?.user) {
          const profile = await fetchAdminProfile(s.user.id);
          if (!cancelled) {
            setAdminProfile(profile);
          }
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

      // TOKEN_REFRESHED: just silently update session, do NOT touch adminProfile
      if (event === 'TOKEN_REFRESHED') {
        setSession(s);
        return;
      }

      // SIGNED_OUT: clear everything
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setAdminProfile(null);
        return;
      }

      // INITIAL_SESSION: skip if initAuth already handled it (avoid double fetch race)
      if (event === 'INITIAL_SESSION') {
        // initAuth is handling this, don't interfere
        return;
      }

      // SIGNED_IN (e.g., after signInWithPassword):
      // initAuth already set session+profile, just ensure session is in sync
      setSession(s);

      if (s?.user && initializedRef.current) {
        // Only fetch profile for real sign-in events after init is complete
        // This avoids race condition with initAuth
        if (event === 'SIGNED_IN') {
          const profile = await fetchAdminProfile(s.user.id);
          if (!cancelled) {
            setAdminProfile(profile);
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
      const result = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('CONNECTION_TIMEOUT')), 12000)
        ),
      ]);
      const { data, error } = result;
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
        // Update profile immediately so ProtectedAdminRoute doesn't wait
        setAdminProfile(profile);
        setSession(data.session);
        // Fire and forget last login update
        supabase
          .from('admin_profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)
          .then(() => {});
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
    setAdminProfile(null);
    setSession(null);
    await supabase.auth.signOut();
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
