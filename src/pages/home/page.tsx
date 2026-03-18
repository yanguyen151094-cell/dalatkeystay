import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import SearchBar from '../../components/base/SearchBar';
import PropertyCard from '../../components/base/PropertyCard';
import { rentalListings, homestayListings, apartmentListings } from '../../mocks/listings';

const stats = [
  { value: '500+', label: 'Bất động sản niêm yết', icon: 'ri-home-4-line' },
  { value: '12', label: 'Khu vực Đà Lạt', icon: 'ri-map-pin-line' },
  { value: '1,200+', label: 'Khách hàng hài lòng', icon: 'ri-user-smile-line' },
  { value: '8+', label: 'Năm kinh nghiệm', icon: 'ri-award-line' },
];

const whyUs = [
  {
    icon: 'ri-shield-check-line',
    title: 'Uy tín & Minh bạch',
    desc: 'Thông tin bất động sản được kiểm chứng kỹ lưỡng, cam kết không phát sinh phí ẩn.',
  },
  {
    icon: 'ri-customer-service-2-line',
    title: 'Hỗ trợ tận tâm',
    desc: 'Đội ngũ tư vấn chuyên nghiệp, am hiểu thị trường Đà Lạt, hỗ trợ 7 ngày/tuần.',
  },
  {
    icon: 'ri-search-eye-line',
    title: 'Tìm kiếm dễ dàng',
    desc: 'Bộ lọc thông minh theo khu vực, giá cả, loại hình – tìm được ngôi nhà lý tưởng trong phút.',
  },
  {
    icon: 'ri-leaf-line',
    title: 'Chuyên sâu Đà Lạt',
    desc: 'Chỉ tập trung vào thị trường Đà Lạt – hiểu rõ từng con phố, từng khu vực hơn ai hết.',
  },
];

const featuredRentals = rentalListings.slice(0, 9);
const featuredHomestays = homestayListings.slice(0, 9);
const featuredApartments = apartmentListings.slice(0, 9);

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=breathtaking%20aerial%20view%20of%20Dalat%20Vietnam%20city%20lush%20green%20pine%20covered%20hills%20mist%20rolling%20through%20valleys%20colorful%20flower%20gardens%20French%20colonial%20villas%20lake%20reflecting%20mountains%20golden%20hour%20light%20dramatic%20landscape&width=1920&height=1080&seq=hero1&orientation=landscape"
            alt="Đà Lạt beautiful landscape"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center pt-20 pb-16">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm">
              <i className="ri-map-pin-line text-emerald-400"></i>
              Thành phố hoa ngàn sắc
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Tìm Ngôi Nhà<br />
            <span className="text-emerald-400">Mơ Ước</span> Tại Đà Lạt
          </h1>
          <p className="text-white/85 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            Khám phá hàng trăm bất động sản chất lượng tại Đà Lạt – từ nhà nguyên căn, homestay lãng mạn đến căn hộ cao cấp giữa thành phố ngàn hoa.
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
      <section className="bg-emerald-700 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <i className={`${stat.icon} text-emerald-300 text-2xl`}></i>
                </div>
                <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="text-emerald-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-emerald-600 text-sm font-medium mb-1">Nhà Nguyên Căn</p>
            <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cho Thuê Nổi Bật
            </h2>
          </div>
          <Link
            to="/search?type=rental"
            className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Xem tất cả <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRentals.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Homestay Banner */}
      <section className="relative overflow-hidden py-20 mx-6 rounded-3xl mb-12">
        <img
          src="https://readdy.ai/api/search-image?query=panoramic%20Dalat%20Vietnam%20flower%20valley%20homestay%20area%20golden%20sunset%20light%20misty%20mountain%20pine%20trees%20terraced%20flower%20gardens%20romantic%20ambiance%20winding%20road&width=1600&height=600&seq=banner1&orientation=landscape"
          alt="Homestay Đà Lạt"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <p className="text-amber-300 text-sm font-medium mb-3 uppercase tracking-wider">Trải nghiệm độc đáo</p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Homestay Đà Lạt<br />
            <span className="text-amber-300">Lãng Mạn & Độc Đáo</span>
          </h2>
          <p className="text-white/85 text-base max-w-lg mb-6 leading-relaxed">
            Từ căn nhà gỗ giữa rừng thông đến cottage hoa hồng lãng mạn – mỗi homestay là một trải nghiệm khó quên giữa thành phố sương mù.
          </p>
          <Link
            to="/homestay"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            Khám Phá Homestay <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </section>

      {/* Featured Homestays */}
      <section className="py-4 px-6 max-w-7xl mx-auto mb-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-amber-600 text-sm font-medium mb-1">Nghỉ dưỡng</p>
            <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Homestay Được Yêu Thích
            </h2>
          </div>
          <Link
            to="/homestay"
            className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Xem tất cả <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHomestays.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApartments.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-600 text-sm font-medium mb-2">Tại sao chọn chúng tôi?</p>
          <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Đà Lạt Home – Người Bạn Đồng Hành Tin Cậy
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-stone-100 text-center group hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <i className={`${item.icon} text-emerald-600 text-2xl`}></i>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2 text-sm">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bạn có bất động sản muốn cho thuê tại Đà Lạt?
          </h2>
          <p className="text-emerald-100 mb-8 text-base">
            Đăng tin miễn phí và tiếp cận hàng nghìn khách hàng tiềm năng mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-2 justify-center"
            >
              <i className="ri-add-circle-line"></i>
              Đăng Tin Ngay
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
