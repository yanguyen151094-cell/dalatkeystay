import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SearchBar from '../../components/base/SearchBar';
import PropertyCard from '../../components/base/PropertyCard';
import VideoReviewStrip from './components/VideoReviewStrip';
import TestimonialsSection from './components/TestimonialsSection';
import type { UIProperty } from '../../lib/propertyUtils';
import { fetchRentalProperties, fetchHomestayProperties, fetchSaleProperties } from '../../lib/propertyUtils';
import { useSEO } from '../../hooks/useSEO';

const stats = [
  { value: '200+', label: 'Căn hộ cho thuê', icon: 'ri-building-2-line' },
  { value: '12', label: 'Khu vực Đà Lạt', icon: 'ri-map-pin-line' },
  { value: '2,500+', label: 'Khách đã đặt phòng', icon: 'ri-user-smile-line' },
  { value: '4.8★', label: 'Đánh giá trung bình', icon: 'ri-star-line' },
];

const whyUs = [
  {
    icon: 'ri-key-2-line',
    title: 'Nhận phòng linh hoạt',
    desc: 'Hỗ trợ self check-in 24/7, nhận chìa khóa thông minh – không cần chờ đợi, không lo giờ giấc.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Uy tín & Minh bạch',
    desc: 'Thông tin căn hộ được xác minh kỹ lưỡng, giá niêm yết rõ ràng – cam kết không phát sinh phí ẩn.',
  },
  {
    icon: 'ri-customer-service-2-line',
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ Key Stay luôn sẵn sàng hỗ trợ mọi vấn đề trong suốt thời gian lưu trú của bạn.',
  },
  {
    icon: 'ri-leaf-line',
    title: 'Chuyên sâu Đà Lạt',
    desc: 'Chỉ tập trung vào thị trường Đà Lạt – am hiểu từng con phố, từng khu vực như người bản địa.',
  },
];

export default function Home() {
  const [rentals, setRentals] = useState<UIProperty[]>([]);
  const [homestays, setHomestays] = useState<UIProperty[]>([]);
  const [apartments, setApartments] = useState<UIProperty[]>([]);
  const [homeLoading, setHomeLoading] = useState(true);

  useSEO({
    title: 'Key Stay Đà Lạt – Cho Thuê Căn Hộ, Homestay & Phòng Đẹp Đà Lạt',
    description: 'Key Stay Đà Lạt – cho thuê căn hộ đẹp, homestay lãng mạn, phòng nghỉ cao cấp tại Đà Lạt, Lâm Đồng. Booking trực tuyến nhanh chóng, giá tốt, hỗ trợ 24/7.',
    keywords: 'cho thuê căn hộ Đà Lạt, homestay Đà Lạt đẹp, Key Stay Đà Lạt, phòng nghỉ Đà Lạt, booking Đà Lạt',
    canonical: '/',
    ogImage: 'https://readdy.ai/api/search-image?query=Dalat%20Vietnam%20aerial%20mountain%20pine%20forest%20city%20landscape%20beautiful&width=1200&height=630&seq=og1&orientation=landscape',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Key Stay Đà Lạt – Trang Chủ',
      url: 'https://www.dalatkeystay.vn/',
      description: 'Cho thuê căn hộ, homestay lãng mạn và phòng nghỉ đẹp tại Đà Lạt',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://www.dalatkeystay.vn/' },
        ],
      },
    },
  });

  useEffect(() => {
    const load = async () => {
      const [r, h, a] = await Promise.all([
        fetchRentalProperties(9),
        fetchHomestayProperties(9),
        fetchSaleProperties(9),
      ]);
      setRentals(r);
      setHomestays(h);
      setApartments(a);
      setHomeLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=breathtaking%20aerial%20view%20of%20Dalat%20Vietnam%20city%20lush%20green%20pine%20covered%20hills%20mist%20rolling%20through%20valleys%20colorful%20flower%20gardens%20French%20colonial%20villas%20lake%20reflecting%20mountains%20golden%20hour%20light%20dramatic%20landscape&width=1920&height=1080&seq=hero1&orientation=landscape"
            alt="Cho thuê căn hộ Đà Lạt view đẹp Key Stay"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center pt-20 pb-16">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm">
              <i className="ri-key-2-line text-amber-400"></i>
              Key Stay – Căn hộ cho thuê Đà Lạt
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Căn Hộ Cho Thuê<br />
            <span className="text-amber-400">Đẹp Nhất</span> Đà Lạt
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            Key Stay Đà Lạt – booking căn hộ cho thuê, homestay lãng mạn và phòng nghỉ cao cấp. Check-in linh hoạt, hỗ trợ 24/7 giữa thành phố ngàn hoa.
          </p>
          <SearchBar variant="hero" />

          <div className="flex items-center gap-6 mt-10">
            {['Phường 1', 'Phường 3', 'Xuân Thọ', 'Lạc Dương'].map((area) => (
              <Link
                key={area}
                to={`/search?area=${encodeURIComponent(area)}`}
                className="text-white/80 hover:text-white text-sm border-b border-white/40 hover:border-white transition-colors cursor-pointer pb-0.5"
              >
                {area}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-down-line text-white/70 text-xl"></i>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-700 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <i className={`${stat.icon} text-amber-300 text-2xl`}></i>
                </div>
                <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="text-amber-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Review Strip */}
      <VideoReviewStrip />

      {/* Featured Rentals */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-600 text-sm font-medium mb-1">Căn Hộ Cho Thuê</p>
            <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Phòng Đẹp Nổi Bật
            </h2>
          </div>
          <Link
            to="/search?type=rental"
            className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Xem tất cả <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        {homeLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <i className="ri-building-line text-4xl mb-2 block"></i>
            <p className="text-sm">Chưa có bất động sản cho thuê nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
            {rentals.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* Homestay Banner */}
      <section className="relative overflow-hidden py-20 mx-6 rounded-3xl mb-12">
        <img
          src="https://readdy.ai/api/search-image?query=panoramic%20Dalat%20Vietnam%20flower%20valley%20homestay%20area%20golden%20sunset%20light%20misty%20mountain%20pine%20trees%20terraced%20flower%20gardens%20romantic%20ambiance%20winding%20road&width=1600&height=600&seq=banner1&orientation=landscape"
          alt="Homestay cho thuê Đà Lạt view núi đẹp"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <p className="text-amber-300 text-sm font-medium mb-3 uppercase tracking-wider">Nghỉ dưỡng cuối tuần</p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Homestay Đà Lạt<br />
            <span className="text-amber-300">Lãng Mạn & Riêng Tư</span>
          </h2>
          <p className="text-white/85 text-base max-w-lg mb-6 leading-relaxed">
            Căn hộ cho thuê theo ngày – từ nhà gỗ giữa rừng thông đến villa hoa hồng lãng mạn. Mỗi phòng tại Key Stay là một trải nghiệm khó quên.
          </p>
          <Link
            to="/homestay"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            Xem Homestay Đẹp <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="py-4 px-6 max-w-7xl mx-auto mb-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-600 text-sm font-medium mb-1">Homestay & Villa</p>
            <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Được Đặt Nhiều Nhất
            </h2>
          </div>
          <Link
            to="/homestay"
            className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Xem tất cả <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        {homeLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : homestays.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <i className="ri-home-heart-line text-4xl mb-2 block"></i>
            <p className="text-sm">Chưa có homestay nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
            {homestays.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* Apartment Section */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-rose-600 text-sm font-medium mb-1">Đầu tư & An cư</p>
              <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Căn Hộ Đang Bán
              </h2>
            </div>
            <Link
              to="/apartment"
              className="text-sm text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              Xem tất cả <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          {homeLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-100 overflow-hidden animate-pulse">
                  <div className="h-52 bg-stone-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : apartments.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <i className="ri-building-2-line text-4xl mb-2 block"></i>
              <p className="text-sm">Chưa có căn hộ bán nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
              {apartments.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-medium mb-2">Tại sao chọn Key Stay?</p>
          <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Key Stay Đà Lạt – Đặt Phòng An Tâm, Ở Trọn Vẹn
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-stone-100 text-center group hover:border-amber-200 transition-all">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <i className={`${item.icon} text-amber-600 text-2xl`}></i>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2 text-sm">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="bg-amber-700 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bạn có căn hộ muốn cho thuê tại Đà Lạt?
          </h2>
          <p className="text-amber-100 mb-8 text-base">
            Hợp tác với Key Stay Đà Lạt – tiếp cận hàng nghìn khách booking mỗi tháng, quản lý booking dễ dàng, thanh toán minh bạch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-amber-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
            >
              <i className="ri-building-add-line"></i>
              Đăng Ký Hợp Tác
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
            >
              <i className="ri-phone-line"></i>
              Liên Hệ Tư Vấn
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
