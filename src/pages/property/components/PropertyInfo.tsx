import type { UIProperty } from '../../../lib/propertyUtils';

interface PropertyInfoProps {
  property: UIProperty;
}

const amenityIcons: Record<string, string> = {
  'WiFi': 'ri-wifi-line',
  'Bếp đầy đủ': 'ri-restaurant-line',
  'Lò sưởi': 'ri-fire-line',
  'BBQ': 'ri-grill-line',
  'View hồ': 'ri-water-flash-line',
  'View núi': 'ri-landscape-line',
  'Sân vườn': 'ri-plant-line',
  'Hồ bơi': 'ri-swimming-line',
  'Máy giặt': 'ri-t-shirt-line',
  'Tủ lạnh': 'ri-temp-cold-line',
  'Chỗ đậu xe': 'ri-car-line',
  'Máy sưởi': 'ri-sun-line',
  'Gym': 'ri-run-line',
  'Bảo vệ 24/7': 'ri-shield-user-line',
  'Thang máy': 'ri-arrow-up-down-line',
};

export default function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="space-y-8">
      {/* Key stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: 'ri-hotel-bed-line', value: property.bedrooms, label: 'Phòng ngủ' },
          { icon: 'ri-water-flash-line', value: property.bathrooms, label: 'Phòng tắm' },
          { icon: 'ri-layout-2-line', value: `${property.size} m²`, label: 'Diện tích' },
        ].map((stat) => (
          <div key={stat.label} className="bg-stone-50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2">
              <i className={`${stat.icon} text-amber-500 text-xl`}></i>
            </div>
            <p className="text-xl font-bold text-stone-800">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-base font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
          Mô tả chi tiết
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed">{property.description}</p>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-base font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
          Tiện ích nổi bật
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {property.amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-2.5 bg-stone-50 rounded-lg px-3 py-2.5 text-sm text-stone-700"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${amenityIcons[amenity] || 'ri-checkbox-circle-fill'} text-emerald-500`}></i>
              </div>
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h2 className="text-base font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
          Vị trí
        </h2>
        <div className="flex items-start gap-3 bg-stone-50 rounded-xl p-4">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-amber-100 rounded-lg mt-0.5">
            <i className="ri-map-pin-fill text-amber-600"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">{property.title}</p>
            <p className="text-sm text-stone-500 mt-0.5">{property.address}</p>
            <p className="text-xs text-stone-400 mt-1">{property.area} · Đà Lạt, Lâm Đồng</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-information-line text-blue-400"></i>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          Thông tin giá và lịch trống có thể thay đổi. Vui lòng liên hệ trực tiếp qua Zalo hoặc điện thoại để được xác nhận chính xác nhất.
        </p>
      </div>
    </div>
  );
}
