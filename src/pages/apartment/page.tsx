import { useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import PropertyCard from '../../components/base/PropertyCard';
import { apartmentListings, areas, formatPrice } from '../../mocks/listings';

const priceRanges = [
  { value: '', label: 'Tất cả mức giá' },
  { value: '0-1', label: 'Dưới 1 tỷ' },
  { value: '1-2', label: '1 – 2 tỷ' },
  { value: '2-4', label: '2 – 4 tỷ' },
  { value: '4+', label: 'Trên 4 tỷ' },
];

const investHighlights = [
  {
    icon: 'ri-line-chart-line',
    title: 'Giá trị tăng trưởng bền vững',
    desc: 'Bất động sản Đà Lạt tăng trưởng trung bình 12-15% mỗi năm trong 5 năm qua.',
    value: '+15%/năm',
  },
  {
    icon: 'ri-building-line',
    title: 'Nguồn cung hạn chế',
    desc: 'Quỹ đất tại trung tâm Đà Lạt ngày càng khan hiếm, giá trị tăng theo thời gian.',
    value: '< 200 căn',
  },
  {
    icon: 'ri-hotel-line',
    title: 'Tiềm năng cho thuê lại',
    desc: 'Đà Lạt đón 6-8 triệu lượt khách/năm, nhu cầu thuê nghỉ dưỡng luôn cao.',
    value: '8tr khách/năm',
  },
];

export default function ApartmentSales() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filtered = apartmentListings
    .filter((p) => (selectedArea ? p.area === selectedArea : true))
    .filter((p) => {
      if (!selectedBedrooms) return true;
      if (selectedBedrooms === '4+') return p.bedrooms >= 4;
      return p.bedrooms === parseInt(selectedBedrooms);
    })
    .filter((p) => {
      const billion = p.price / 1000000000;
      if (selectedPrice === '0-1') return billion < 1;
      if (selectedPrice === '1-2') return billion >= 1 && billion < 2;
      if (selectedPrice === '2-4') return billion >= 2 && billion < 4;
      if (selectedPrice === '4+') return billion >= 4;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'size-desc') return b.size - a.size;
      return 0;
    });

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero */}
        <div className="relative h-72 overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=luxury%20apartment%20buildings%20in%20Dalat%20Vietnam%20modern%20high%20rise%20residential%20towers%20pine%20tree%20mountain%20backdrop%20morning%20light%20prestigious%20real%20estate%20development%20skyline&width=1600&height=600&seq=apt-hero&orientation=landscape"
            alt="Căn hộ Đà Lạt"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-3">
              <i className="ri-building-line"></i> Đầu tư sinh lời
            </span>
            <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mua Bán Căn Hộ Đà Lạt
            </h1>
            <p className="text-white/85 text-sm max-w-xl">
              Cơ hội đầu tư và an cư tại thành phố du lịch hàng đầu Việt Nam với tiềm năng sinh lời vượt trội.
            </p>
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {investHighlights.map((item) => (
                <div key={item.title} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                  <div className="w-12 h-12 flex items-center justify-center bg-rose-100 rounded-xl flex-shrink-0">
                    <i className={`${item.icon} text-rose-600 text-2xl`}></i>
                  </div>
                  <div>
                    <div className="text-rose-600 font-bold text-lg">{item.value}</div>
                    <div className="text-stone-700 text-sm font-medium">{item.title}</div>
                    <div className="text-stone-500 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Khu vực</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  {areas.map((a) => (
                    <option key={a} value={a === 'Tất cả khu vực' ? '' : a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Mức giá</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  {priceRanges.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Số phòng ngủ</label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  <option value="">Tất cả</option>
                  <option value="1">1 phòng ngủ</option>
                  <option value="2">2 phòng ngủ</option>
                  <option value="3">3 phòng ngủ</option>
                  <option value="4+">4+ phòng ngủ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Sắp xếp</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="size-desc">Diện tích lớn nhất</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-stone-600 text-sm">
              <strong className="text-stone-800">{filtered.length}</strong> căn hộ đang bán
            </p>
            {(selectedArea || selectedPrice || selectedBedrooms) && (
              <button
                onClick={() => { setSelectedArea(''); setSelectedPrice(''); setSelectedBedrooms(''); setSortBy('default'); }}
                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <i className="ri-refresh-line"></i> Xóa bộ lọc
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-rose-50 rounded-full">
                <i className="ri-building-line text-rose-300 text-3xl"></i>
              </div>
              <p className="text-stone-600 font-medium">Không tìm thấy căn hộ phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}

          {/* Price list banner */}
          <div className="mt-12 bg-stone-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cần tư vấn đầu tư bất động sản Đà Lạt?
              </h3>
              <p className="text-stone-400 text-sm">Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a href="tel:0982.947.645" className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2">
                <i className="ri-phone-line"></i> Gọi ngay
              </a>
              <a href="/contact" className="px-5 py-2.5 border border-stone-600 text-stone-300 text-sm font-semibold rounded-xl hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2">
                <i className="ri-message-line"></i> Nhắn tin
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
