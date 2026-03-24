import { useEffect, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

interface ProtectedAdminRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

const ProtectedAdminRoute = ({ children, requireSuperAdmin }: ProtectedAdminRouteProps) => {
  const { session, adminProfile, loading, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();

  // Keep refs in sync with latest values to avoid stale closures in setTimeout
  const sessionRef = useRef(session);
  const adminProfileRef = useRef(adminProfile);
  sessionRef.current = session;
  adminProfileRef.current = adminProfile;

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRedirectTimer = () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  };

  useEffect(() => {
    // Still loading initial auth → wait
    if (loading) {
      clearRedirectTimer();
      return;
    }

    // No session at all → redirect immediately
    if (!session) {
      clearRedirectTimer();
      navigate('/admin/login', { replace: true });
      return;
    }

    // Has session but profile not yet loaded → start a generous timeout
    // Using refs inside callback avoids stale closure bug
    if (session && !adminProfile) {
      if (!redirectTimerRef.current) {
        redirectTimerRef.current = setTimeout(() => {
          redirectTimerRef.current = null;
          // Use ref to get the LATEST value at the time timeout fires
          if (!adminProfileRef.current) {
            navigate('/admin/login', { replace: true });
          }
        }, 6000);
      }
      return;
    }

    // Both session and profile loaded → clear any pending redirect
    clearRedirectTimer();

    if (requireSuperAdmin && !isSuperAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, adminProfile, loading, navigate, requireSuperAdmin, isSuperAdmin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearRedirectTimer();
  }, []);

  // Show spinner while loading auth or waiting for profile
  if (loading || (session && !adminProfile)) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-500 text-sm">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!session || !adminProfile) return null;
  if (requireSuperAdmin && !isSuperAdmin) return null;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
