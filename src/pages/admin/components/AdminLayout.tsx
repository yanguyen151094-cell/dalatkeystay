import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  superAdminOnly?: boolean;
}

const navItems: NavItem[] = [
  { path: '/admin/dashboard', icon: 'ri-dashboard-3-line', label: 'Dashboard' },
  { path: '/admin/properties', icon: 'ri-building-line', label: 'Căn hộ / Phòng' },
  { path: '/admin/bookings', icon: 'ri-calendar-check-line', label: 'Booking' },
  { path: '/admin/tenants', icon: 'ri-group-line', label: 'Khách thuê' },
  { path: '/admin/blog', icon: 'ri-article-line', label: 'Quản lý Blog' },
  { path: '/admin/media', icon: 'ri-image-2-line', label: 'Hình ảnh & Video' },
  { path: '/admin/review', icon: 'ri-play-circle-line', label: 'Review Đà Lạt' },
  { path: '/admin/community', icon: 'ri-community-line', label: 'Cộng đồng' },
  { path: '/admin/revenue', icon: 'ri-line-chart-line', label: 'Doanh thu' },
  { path: '/admin/content', icon: 'ri-edit-2-line', label: 'Nội dung website' },
  { path: '/admin/accounts', icon: 'ri-shield-user-line', label: 'Tài khoản Admin', superAdminOnly: true },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { adminProfile, signOut, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-lg flex-shrink-0">
            <i className="ri-key-2-line text-white text-sm" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">Key Stay</span>
            <span className="text-stone-400 text-xs block">Admin Panel</span>
          </div>
        </div>
        {/* Close btn for mobile */}
        <button
          onClick={closeSidebar}
          className="md:hidden w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-lg" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems
          .filter(item => !item.superAdminOnly || isSuperAdmin)
          .map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`
              }
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-base`} />
              </div>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-stone-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 flex items-center justify-center bg-stone-700 rounded-full flex-shrink-0">
            <i className="ri-user-line text-stone-300 text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-medium truncate">
              {adminProfile?.full_name || adminProfile?.email}
            </p>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                isSuperAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-700 text-stone-400'
              }`}
            >
              {isSuperAdmin ? 'Super Admin' : 'Vận hành'}
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:bg-stone-800 hover:text-white text-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-logout-box-line text-base" />
          </div>
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 bg-stone-900 flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* ── Mobile sidebar (slide-in) ── */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-stone-900 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-white cursor-pointer"
          >
            <i className="ri-menu-line text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-amber-500 rounded-md">
              <i className="ri-key-2-line text-white text-xs" />
            </div>
            <span className="text-white font-bold text-sm">Key Stay Admin</span>
          </div>
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
