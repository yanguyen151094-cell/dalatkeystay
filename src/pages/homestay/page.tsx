import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import PropertyCard from '../../components/base/PropertyCard';
import { areas } from '../../mocks/listings';
import type { UIProperty } from '../../lib/propertyUtils';
import { fetchHomestayProperties } from '../../lib/propertyUtils';
import { useSEO } from '../../hooks/useSEO';

const amenityFilters = ['WiFi', 'Bếp đầy đủ', 'Lò sưởi', 'BBQ', 'View hồ', 'View núi', 'Sân vườn', 'Hồ bơi'];

export default function HomestayRentals() {
  const [allHomestays, setAllHomestays] = useState<UIProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxCapacity, setMaxCapacity] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useSEO({
    title: 'Homestay Đà Lạt Đẹp – Homestay Lãng Mạn Cho Thuê Đà Lạt | Key Stay',
    description: 'Danh sách homestay cho thuê tại Đà Lạt lãng mạn, view núi đẹp, giá tốt. Đặt homestay Đà Lạt trực tuyến, nhận phòng linh hoạt 24/7 tại Key Stay.',
    keywords: 'homestay Đà Lạt đẹp, homestay lãng mạn Đà Lạt, thuê homestay Đà Lạt, homestay view núi Đà Lạt',
    canonical: '/homestay',
    ogImage: 'https://readdy.ai/api/search-image?query=stunning%20collection%20of%20Dalat%20homestays%20romantic%20cottages%20cozy%20wooden%20houses%20surrounded%20by%20flower%20gardens%20pine%20trees%20morning%20mist%20fairy%20lights%20magical%20atmosphere%20Vietnamese%20highland&width=1200&height=630&seq=hs-hero&orientation=landscape',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Homestay Đà Lạt Đẹp | Key Stay',
      url: 'https://www.dalatkeystay.vn/homestay',
      description: 'Danh sách homestay cho thuê lãng mạn tại Đà Lạt, Lâm Đồng',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://www.dalatkeystay.vn/' },
          { '@type': 'ListItem', position: 2, name: 'Homestay Đà Lạt', item: 'https://www.dalatkeystay.vn/homestay' },
        ],
      },
    },
  });

  useEffect(() => {
    fetchHomestayProperties().then((data) => {
      setAllHomestays(data);
      setLoading(false);
    });
  }, []);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const filtered = allHomestays
    .filter((p) => (selectedArea ? p.area === selectedArea : true))
    .filter((p) =>
      selectedAmenities.length === 0 ||
      selectedAmenities.every((a) => p.amenities.some((pa) => pa.toLowerCase().includes(a.toLowerCase())))
    )
    .filter((p) => {
      if (!maxCapacity) return true;
      return p.bedrooms >= parseInt(maxCapacity);
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero Banner */}
        <div className="relative h-72 overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=stunning%20collection%20of%20Dalat%20homestays%20romantic%20cottages%20cozy%20wooden%20houses%20surrounded%20by%20flower%20gardens%20pine%20trees%20morning%20mist%20fairy%20lights%20magical%20atmosphere%20Vietnamese%20highland&width=1600&height=600&seq=hs-hero&orientation=landscape"
            alt="Homestay Đà Lạt"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/80 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-3">
              <i className="ri-home-heart-line"></i> Trải nghiệm độc đáo
            </span>
            <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Homestay Cho Thuê Tại Đà Lạt
            </h1>
            <p className="text-white/85 text-sm max-w-xl">
              Khám phá những homestay lãng mạn, độc đáo giữa thiên nhiên Đà Lạt huyền bí và thơ mộng.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Khu vực</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  {areas.map((a) => (
                    <option key={a} value={a === 'Tất cả khu vực' ? '' : a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Số phòng ngủ tối thiểu</label>
                <select
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="">Tất cả</option>
                  <option value="1">1+ phòng ngủ</option>
                  <option value="2">2+ phòng ngủ</option>
                  <option value="3">3+ phòng ngủ</option>
                  <option value="4">4+ phòng ngủ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Sắp xếp theo giá</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100">
              <p className="text-xs text-stone-500 mb-2">Tiện ích:</p>
              <div className="flex flex-wrap gap-2">
                {amenityFilters.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer whitespace-nowrap ${
                      selectedAmenities.includes(a)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                    }`}
                  >
                    {a}
                  </button>
                ))}
                {selectedAmenities.length > 0 && (
                  <button
                    onClick={() => setSelectedAmenities([])}
                    className="px-3 py-1.5 rounded-full text-xs border border-rose-200 text-rose-500 hover:bg-rose-50 cursor-pointer whitespace-nowrap"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-stone-600 text-sm">
              <strong className="text-stone-800">{filtered.length}</strong> homestay phù hợp
            </p>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-100 overflow-hidden animate-pulse">
                  <div className="h-52 bg-stone-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-amber-50 rounded-full">
                <i className="ri-home-heart-line text-amber-400 text-3xl"></i>
              </div>
              <p className="text-stone-600 font-medium">
                {allHomestays.length === 0 ? 'Chưa có homestay nào được thêm' : 'Không tìm thấy homestay phù hợp'}
              </p>
              <p className="text-stone-400 text-sm mt-1">
                {allHomestays.length === 0 ? 'Admin có thể thêm homestay trong trang quản lý' : 'Thử điều chỉnh bộ lọc để có nhiều kết quả hơn'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}

          {/* Experience Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: 'ri-leaf-line',
                title: 'Gần thiên nhiên',
                desc: 'Đắm mình trong không gian xanh mát của rừng thông và vườn hoa Đà Lạt.',
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
              },
              {
                icon: 'ri-heart-line',
                title: 'Không gian lãng mạn',
                desc: 'Lý tưởng cho cặp đôi muốn tận hưởng những khoảnh khắc riêng tư và đặc biệt.',
                color: 'text-rose-500',
                bg: 'bg-rose-50',
              },
              {
                icon: 'ri-group-line',
                title: 'Phù hợp nhóm',
                desc: 'Nhiều lựa chọn cho nhóm bạn hay gia đình với không gian rộng rãi và tiện nghi.',
                color: 'text-amber-500',
                bg: 'bg-amber-50',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-stone-100 flex items-start gap-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${item.bg} flex-shrink-0`}>
                  <i className={`${item.icon} ${item.color} text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 text-sm mb-1">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
