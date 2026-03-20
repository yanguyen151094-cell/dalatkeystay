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

  const fetchAdminProfile = async (userId: string) => {
    const { data } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .maybeSingle();
    return data as AdminProfile | null;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchAdminProfile(s.user.id);
        setAdminProfile(profile);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchAdminProfile(s.user.id);
        setAdminProfile(profile);
      } else {
        setAdminProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      const profile = await fetchAdminProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return { error: 'Tài khoản không có quyền truy cập admin.' };
      }
      await supabase.from('admin_profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
    }
    return { error: null };
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
