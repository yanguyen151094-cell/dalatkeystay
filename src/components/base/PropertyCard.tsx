import { Link } from 'react-router-dom';
import type { Property } from '../../mocks/listings';
import { formatPrice } from '../../mocks/listings';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
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

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-emerald-200 transition-all duration-300 group cursor-pointer">
      <Link to={getDetailPath()} className="block">
        <div className="relative overflow-hidden h-52">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
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
              {formatPrice(property.price, property.type)}
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
    </div>
  );
}
