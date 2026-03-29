import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UIProperty } from '../../lib/propertyUtils';
import { formatUIPrice } from '../../lib/propertyUtils';
import PropertyContactModal from './PropertyContactModal';

interface PropertyCardProps {
  property: UIProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const getTypeLabel = () => {
    if (property.type === 'rental') return 'Cho thuê';
    if (property.type === 'homestay') return 'Homestay';
    return 'Bán';
  };

  const getTypeBadgeColor = () => {
    if (property.type === 'rental') return 'bg-emerald-100 text-emerald-700';
    if (property.type === 'homestay') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  const getDetailPath = () => `/property/${property.id}`;

  const placeholderBg = () => {
    if (property.type === 'rental') return 'from-emerald-100 to-emerald-200';
    if (property.type === 'homestay') return 'from-amber-100 to-amber-200';
    return 'from-rose-100 to-rose-200';
  };

  const placeholderIcon = () => {
    if (property.type === 'rental') return 'ri-home-2-line';
    if (property.type === 'homestay') return 'ri-home-heart-line';
    return 'ri-building-line';
  };

  const getCtaConfig = () => {
    if (property.type === 'rental') return {
      label: 'Thuê Nhà Ở Đây',
      icon: 'ri-home-2-line',
      cls: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      formType: 'rent' as const,
    };
    if (property.type === 'homestay') return {
      label: 'Đặt Phòng Ở Đây',
      icon: 'ri-home-heart-line',
      cls: 'bg-amber-500 hover:bg-amber-600 text-white',
      formType: 'homestay' as const,
    };
    return {
      label: 'Mua Căn Hộ Ở Đây',
      icon: 'ri-building-line',
      cls: 'bg-rose-500 hover:bg-rose-600 text-white',
      formType: 'buy' as const,
    };
  };

  const cta = getCtaConfig();

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-emerald-200 transition-all duration-300 group cursor-pointer flex flex-col">
        <Link to={getDetailPath()} className="block">
          <div className="relative overflow-hidden h-52">
            {property.image ? (
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const placeholder = parent.querySelector('.img-placeholder') as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              className={`img-placeholder w-full h-full bg-gradient-to-br ${placeholderBg()} flex flex-col items-center justify-center gap-2 ${property.image ? 'hidden' : 'flex'}`}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white/60 rounded-xl">
                <i className={`${placeholderIcon()} text-2xl text-stone-400`}></i>
              </div>
              <span className="text-xs text-stone-400">Chưa có ảnh</span>
            </div>
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor()}`}>
                {getTypeLabel()}
              </span>
              {property.featured && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                  Nổi bật
                </span>
              )}
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-sm font-bold text-stone-800">
                {formatUIPrice(property.price, property.type)}
                <span className="text-xs font-normal text-stone-500">{property.priceUnit}</span>
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-stone-800 text-sm mb-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-3">
              <div className="w-3 h-3 flex items-center justify-center">
                <i className="ri-map-pin-line text-emerald-500"></i>
              </div>
              <span className="line-clamp-1">{property.address}</span>
            </div>

            <div className="flex items-center gap-4 text-stone-600 text-xs pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-hotel-bed-line"></i>
                </div>
                <span>{property.bedrooms} PN</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-water-flash-line"></i>
                </div>
                <span>{property.bathrooms} WC</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-layout-2-line"></i>
                </div>
                <span>{property.size} m²</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-map-pin-2-line text-stone-400"></i>
                </div>
                <span className="text-stone-400">{property.area}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* CTA Button */}
        <div className="px-4 pb-4 pt-0">
          <button
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${cta.cls}`}
          >
            <i className={cta.icon} />
            {cta.label}
          </button>
        </div>
      </div>

      <PropertyContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={cta.formType}
        propertyTitle={property.title}
      />
    </>
  );
}
