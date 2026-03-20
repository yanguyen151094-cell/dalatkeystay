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
  // Track how long we've been in session-but-no-profile state
  const profileWaitRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) return;

    // No session at all → redirect immediately
    if (!session) {
      navigate('/admin/login', { replace: true });
      return;
    }

    // Has session but profile not loaded yet → wait a bit before giving up
    // This handles the race condition where token refreshes before profile fetches
    if (session && !adminProfile) {
      if (profileWaitRef.current) clearTimeout(profileWaitRef.current);
      profileWaitRef.current = setTimeout(() => {
        // After 4s if still no profile, then redirect
        if (!adminProfile) {
          navigate('/admin/login', { replace: true });
        }
      }, 4000);
      return;
    }

    // Has both session and profile
    if (profileWaitRef.current) {
      clearTimeout(profileWaitRef.current);
      profileWaitRef.current = null;
    }

    if (requireSuperAdmin && !isSuperAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, adminProfile, loading, navigate, requireSuperAdmin, isSuperAdmin]);

  useEffect(() => {
    return () => {
      if (profileWaitRef.current) clearTimeout(profileWaitRef.current);
    };
  }, []);

  if (loading || (session && !adminProfile)) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !adminProfile) return null;
  if (requireSuperAdmin && !isSuperAdmin) return null;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
