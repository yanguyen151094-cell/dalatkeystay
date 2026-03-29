import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../../lib/supabase';
import PropertyContactModal from '../../../components/base/PropertyContactModal';

interface Props {
  property: Property;
}

const typeLabels: Record<string, string> = {
  homestay: 'Homestay',
  apartment: 'Căn hộ',
  villa: 'Villa',
  room: 'Phòng',
};

const formatSalePrice = (price: number | null): string => {
  if (!price) return 'Liên hệ';
  if (price >= 1000000000) {
    const val = price / 1000000000;
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, '')} tỷ`;
  }
  return `${(price / 1000000).toFixed(0)} triệu`;
};

export default function SalePropertyCard({ property }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-rose-200 transition-all duration-300 group cursor-pointer flex flex-col">
        <Link to={`/property/${property.id}`} className="block">
          <div className="relative overflow-hidden h-52">
            {property.thumbnail ? (
              <img
                src={property.thumbnail}
                alt={property.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                <i className="ri-building-line text-stone-300 text-5xl" />
              </div>
            )}

            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-600">
                Đang bán
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                {typeLabels[property.type] || property.type}
              </span>
              {property.is_featured && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500 text-white">
                  Nổi bật
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-sm font-bold text-rose-600">
                {formatSalePrice(property.sale_price)}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-stone-800 text-sm mb-1.5 line-clamp-1 group-hover:text-rose-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-3">
              <div className="w-3 h-3 flex items-center justify-center">
                <i className="ri-map-pin-line text-rose-400" />
              </div>
              <span className="line-clamp-1">{property.address || property.district || 'Đà Lạt'}</span>
            </div>

            <div className="flex items-center gap-4 text-stone-600 text-xs pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-hotel-bed-line" />
                </div>
                <span>{property.bedrooms} PN</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-water-flash-line" />
                </div>
                <span>{property.bathrooms} WC</span>
              </div>
              {property.area && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-layout-2-line" />
                  </div>
                  <span>{property.area} m²</span>
                </div>
              )}
              {property.district && (
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-map-pin-2-line text-stone-400" />
                  </div>
                  <span className="text-stone-400 truncate max-w-[80px]">{property.district}</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* CTA Button */}
        <div className="px-4 pb-4 pt-0">
          <button
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-building-line" />
            Mua Căn Hộ Ở Đây
          </button>
        </div>
      </div>

      <PropertyContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="buy"
        propertyTitle={property.title}
      />
    </>
  );
}
