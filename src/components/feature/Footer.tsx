import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="https://static.readdy.ai/image/b107d501ab31adf698875488b112872d/5741866ece24574ea22a767bdf3f6290.png"
                  alt="Dalat Key Stay Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-white text-sm tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.12em' }}>
                  DALAT KEY STAY
                </span>
                <span className="text-amber-400" style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', letterSpacing: '0.2em' }}>
                  BẤT ĐỘNG SẢN ĐÀ LẠT
                </span>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed mb-5">
              Nền tảng bất động sản hàng đầu tại Đà Lạt – kết nối người tìm kiếm với những ngôi nhà lý tưởng giữa thành phố ngàn hoa.
            </p>
            <div className="flex items-center gap-3">
              {['facebook-circle', 'instagram', 'youtube', 'tiktok'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-700 hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  <i className={`ri-${icon}-line text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Dịch Vụ</h4>
            <ul className="space-y-2">
              {[
                { label: 'Cho Thuê Nhà Nguyên Căn', path: '/search' },
                { label: 'Cho Thuê Homestay', path: '/homestay' },
                { label: 'Mua Bán Căn Hộ', path: '/apartment' },
                { label: 'Bản Đồ Bất Động Sản', path: '/map' },
                { label: 'Câu Hỏi Thường Gặp', path: '/faq' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-stone-400 hover:text-amber-400 text-sm transition-colors cursor-pointer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Khu Vực Nổi Bật</h4>
            <ul className="space-y-2">
              {['Phường 1 - Trung tâm', 'Phường 3 - Hoa Xuân', 'Phường 8 - Dân cư', 'Xuân Thọ - Ngoại ô', 'Lạc Dương - Thiên nhiên'].map((area) => (
                <li key={area}>
                  <Link
                    to={`/search?area=${encodeURIComponent(area)}`}
                    className="text-stone-400 hover:text-amber-400 text-sm transition-colors cursor-pointer"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-stone-400 text-sm">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                  <i className="ri-map-pin-line text-amber-400"></i>
                </div>
                <span>Nhà 30 Hẻm 6 Mai Xuân Thưởng, Phường 8, Đà Lạt, Lâm Đồng</span>
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-phone-line text-amber-400"></i>
                </div>
                <a href="tel:0982947645" className="hover:text-amber-400 transition-colors">0263 382 2888</a>
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-mail-line text-amber-400"></i>
                </div>
                <a href="mailto:info@dalatkeystay.vn" className="hover:text-amber-400 transition-colors">info@dalatkeystay.vn</a>
              </li>
              <li className="flex items-center gap-2 text-stone-400 text-sm">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-time-line text-amber-400"></i>
                </div>
                <span>00:00 – 23:59, Thứ 2 – Chủ Nhật</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-stone-500 text-xs">© 2026 DALAT KEY STAY. Bản quyền thuộc về Dalat Key Stay Real Estate.</p>
          <p className="text-stone-500 text-xs">Chuyên trang bất động sản Đà Lạt cho thuê nhà nguyên căn, homestay &amp; căn hộ.</p>
        </div>
      </div>
    </footer>
  );
}