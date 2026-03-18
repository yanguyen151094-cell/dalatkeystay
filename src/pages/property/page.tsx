import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import PropertyCard from '../../components/base/PropertyCard';
import ContactCard from './components/ContactCard';
import PropertyInfo from './components/PropertyInfo';
import ImageGallery from './components/ImageGallery';
import { rentalListings, homestayListings, apartmentListings, formatPrice } from '../../mocks/listings';

const allListings = [...rentalListings, ...homestayListings, ...apartmentListings];

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const property = allListings.find((p) => p.id === Number(id));

  useEffect(() => {
    if (!property) {
      navigate('/');
    }
    window.scrollTo(0, 0);
  }, [id, property, navigate]);

  if (!property) return null;

  const similar = allListings
    .filter((p) => p.type === property.type && p.id !== property.id)
    .slice(0, 3);

  const typeLabel = {
    rental: 'Cho thuê nhà nguyên căn',
    homestay: 'Homestay',
    apartment: 'Mua bán căn hộ',
  }[property.type];

  const typeBadgeColor = {
    rental: 'bg-emerald-500',
    homestay: 'bg-amber-500',
    apartment: 'bg-rose-500',
  }[property.type];

  const breadcrumb = {
    rental: { label: 'Tìm Kiếm', path: '/search' },
    homestay: { label: 'Homestay', path: '/homestay' },
    apartment: { label: 'Mua Bán Căn Hộ', path: '/apartment' },
  }[property.type];

  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : [property.image];

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-1.5 text-stone-500 text-xs">
            <Link to="/" className="hover:text-stone-800 cursor-pointer transition-colors">Trang chủ</Link>
            <i className="ri-arrow-right-s-line text-stone-400"></i>
            <Link to={breadcrumb.path} className="hover:text-stone-800 cursor-pointer transition-colors">{breadcrumb.label}</Link>
            <i className="ri-arrow-right-s-line text-stone-400"></i>
            <span className="text-stone-400 max-w-64 truncate">{property.title}</span>
          </div>
        </div>

        {/* Title + Badge */}
        <div className="max-w-7xl mx-auto px-6 pb-4">
          <span className={`inline-block px-3 py-1 ${typeBadgeColor} text-white text-xs font-medium rounded-full mb-3`}>
            {typeLabel}
          </span>
          <h1
            className="text-3xl md:text-4xl font-bold text-stone-800 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <i className="ri-map-pin-line text-amber-500"></i>
            <span>{property.address}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-6 pb-8 relative">
          <ImageGallery images={galleryImages} title={property.title} />
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Details */}
            <div className="lg:col-span-2">
              <PropertyInfo property={property} />
            </div>

            {/* Right: Contact */}
            <div className="lg:col-span-1">
              <ContactCard
                price={formatPrice(property.price, property.type)}
                priceUnit={property.priceUnit}
              />
            </div>
          </div>

          {/* Similar properties */}
          {similar.length > 0 && (
            <div className="mt-16">
              <div className="flex items-end justify-between mb-6">
                <h2
                  className="text-2xl font-bold text-stone-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Bất động sản tương tự
                </h2>
                <Link
                  to={breadcrumb.path}
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  Xem tất cả <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
