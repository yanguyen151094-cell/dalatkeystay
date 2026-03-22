import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Tìm Kiếm', path: '/search' },
  { label: 'Homestay', path: '/homestay' },
  { label: 'Mua Bán Căn Hộ', path: '/apartment' },
  { label: 'Blog', path: '/blog' },
  { label: 'Liên Hệ', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white shadow-sm border-b border-stone-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="https://static.readdy.ai/image/b107d501ab31adf698875488b112872d/5741866ece24574ea22a767bdf3f6290.png"
              alt="Dalat Key Stay Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`font-extrabold text-sm tracking-widest uppercase transition-colors ${
                isTransparent ? 'text-white' : 'text-stone-900'
              }`}
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.12em' }}
            >
              DALAT KEY STAY
            </span>
            <span
              className={`text-xs tracking-wider transition-colors ${
                isTransparent ? 'text-white/70' : 'text-amber-600'
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', letterSpacing: '0.2em' }}
            >
              BẤT ĐỘNG SẢN ĐÀ LẠT
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                location.pathname === link.path
                  ? isTransparent
                    ? 'text-white bg-white/20'
                    : 'text-amber-700 bg-amber-50'
                  : isTransparent
                  ? 'text-white/90 hover:text-white hover:bg-white/15'
                  : 'text-stone-600 hover:text-amber-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Đăng Tin
          </Link>
        </div>

        <button
          className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isTransparent ? 'text-white hover:bg-white/15' : 'text-stone-700 hover:bg-stone-100'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className={`ri-${mobileOpen ? 'close' : 'menu-3'}-line text-xl`}></i>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                location.pathname === link.path
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
