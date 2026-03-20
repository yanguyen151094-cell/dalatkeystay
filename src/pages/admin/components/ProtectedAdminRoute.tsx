import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

interface ProtectedAdminRouteProps {
  children: ReactNode;
  requireSuperAdmin?: boolean;
}

const ProtectedAdminRoute = ({ children, requireSuperAdmin }: ProtectedAdminRouteProps) => {
  const { session, adminProfile, loading, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate('/admin/login', { replace: true });
      } else if (session && !adminProfile) {
        navigate('/admin/login', { replace: true });
      } else if (requireSuperAdmin && !isSuperAdmin) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [session, adminProfile, loading, navigate, requireSuperAdmin, isSuperAdmin]);

  if (loading) {
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
