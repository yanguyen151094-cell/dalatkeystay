import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import PropertyCard from '../../components/base/PropertyCard';
import ContactCard from './components/ContactCard';
import PropertyInfo from './components/PropertyInfo';
import ImageGallery from './components/ImageGallery';
import ReviewSection from './components/ReviewSection';
import type { UIProperty } from '../../lib/propertyUtils';
import {
  fetchPropertyById,
  fetchRentalProperties,
  fetchHomestayProperties,
  fetchSaleProperties,
  formatUIPrice,
} from '../../lib/propertyUtils';
import { useSEO } from '../../hooks/useSEO';

const typeLabels: Record<string, string> = {
  rental: 'Cho thuê nhà nguyên căn',
  homestay: 'Homestay',
  apartment: 'Mua bán căn hộ',
};

const breadcrumbPaths: Record<string, { label: string; path: string }> = {
  rental: { label: 'Tìm Kiếm', path: '/search' },
  homestay: { label: 'Homestay', path: '/homestay' },
  apartment: { label: 'Mua Bán Căn Hộ', path: '/apartment' },
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<UIProperty | null>(null);
  const [similar, setSimilar] = useState<UIProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO(
    property
      ? {
          title: `${property.title} – ${typeLabels[property.type] || ''} Đà Lạt | Key Stay`,
          description: `${property.title} tại ${property.address}. ${property.bedrooms} phòng ngủ, ${property.size}m². ${formatUIPrice(property.price, property.type)}. Liên hệ Key Stay để đặt lịch xem nhà.`,
          keywords: `${property.title}, ${typeLabels[property.type]} Đà Lạt, Key Stay ${property.area}`,
          canonical: `/property/${id}`,
          ogImage: property.image,
          ogType: 'article',
          structuredData: [
            {
              '@context': 'https://schema.org',
              '@type': property.type === 'apartment' ? 'Residence' : 'LodgingBusiness',
              name: property.title,
              description: `${property.title} - ${typeLabels[property.type]} tại ${property.address}, Đà Lạt`,
              url: `https://www.dalatkeystay.vn/property/${id}`,
              image: property.image,
              address: {
                '@type': 'PostalAddress',
                streetAddress: property.address,
                addressLocality: 'Đà Lạt',
                addressRegion: 'Lâm Đồng',
                addressCountry: 'VN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '11.9404',
                longitude: '108.4583',
              },
              numberOfRooms: property.bedrooms,
              floorSize: {
                '@type': 'QuantitativeValue',
                value: property.size,
                unitCode: 'MTK',
              },
              offers: {
                '@type': 'Offer',
                price: property.price,
                priceCurrency: 'VND',
                availability: 'https://schema.org/InStock',
                seller: {
                  '@type': 'Organization',
                  name: 'Key Stay Đà Lạt',
                  url: 'https://www.dalatkeystay.vn',
                },
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://www.dalatkeystay.vn/' },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: breadcrumbPaths[property.type]?.label || 'Bất động sản',
                  item: `https://www.dalatkeystay.vn${breadcrumbPaths[property.type]?.path || '/search'}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: property.title,
                  item: `https://www.dalatkeystay.vn/property/${id}`,
                },
              ],
            },
          ],
        }
      : {
          title: 'Chi Tiết Bất Động Sản | Key Stay Đà Lạt',
          description: 'Xem chi tiết bất động sản tại Đà Lạt – cho thuê nhà, homestay và mua bán căn hộ tại Key Stay.',
          canonical: `/property/${id}`,
        }
  );

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    window.scrollTo(0, 0);

    const load = async () => {
      setLoading(true);
      const found = await fetchPropertyById(id);
      if (!found) {
        navigate('/');
        return;
      }
      setProperty(found);

      let simFetch: Promise<UIProperty[]>;
      if (found.type === 'homestay') {
        simFetch = fetchHomestayProperties(6);
      } else if (found.type === 'apartment') {
        simFetch = fetchSaleProperties(6);
      } else {
        simFetch = fetchRentalProperties(6);
      }
      const simData = await simFetch;
      setSimilar(simData.filter((p) => p.id !== found.id).slice(0, 3));
      setLoading(false);
    };

    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-stone-500 text-sm">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const typeLabel = typeLabels[property.type] || '';
  const typeBadgeColor = {
    rental: 'bg-emerald-500',
    homestay: 'bg-amber-500',
    apartment: 'bg-rose-500',
  }[property.type] || 'bg-stone-500';

  const breadcrumb = breadcrumbPaths[property.type] || { label: 'Tìm Kiếm', path: '/search' };

  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : [property.image].filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-1.5 text-stone-500 text-xs">
              <li><Link to="/" className="hover:text-stone-800 cursor-pointer transition-colors">Trang chủ</Link></li>
              <li><i className="ri-arrow-right-s-line text-stone-400"></i></li>
              <li><Link to={breadcrumb.path} className="hover:text-stone-800 cursor-pointer transition-colors">{breadcrumb.label}</Link></li>
              <li><i className="ri-arrow-right-s-line text-stone-400"></i></li>
              <li><span className="text-stone-400 max-w-64 truncate">{property.title}</span></li>
            </ol>
          </nav>
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
        {galleryImages.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pb-8 relative">
            <ImageGallery images={galleryImages} title={property.title} />
          </div>
        )}

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <PropertyInfo property={property} />
              <ReviewSection propertyId={property.id} propertyType={property.type} />
            </div>
            <div className="lg:col-span-1">
              <ContactCard
                price={formatUIPrice(property.price, property.type)}
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
