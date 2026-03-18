import { useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { rentalListings, homestayListings, apartmentListings } from '../../mocks/listings';
import type { Property } from '../../mocks/listings';

type MapFilter = 'all' | 'rental' | 'homestay' | 'apartment';

const allProperties = [...rentalListings, ...homestayListings, ...apartmentListings];

const areaCoords: Record<string, { lat: number; lng: number }> = {
  'Phường 1 - Trung tâm': { lat: 11.9416, lng: 108.4384 },
  'Phường 2': { lat: 11.9379, lng: 108.4453 },
  'Phường 3': { lat: 11.9328, lng: 108.4521 },
  'Phường 4': { lat: 11.9267, lng: 108.4340 },
  'Phường 5': { lat: 11.9490, lng: 108.4240 },
  'Phường 6': { lat: 11.9567, lng: 108.4512 },
  'Phường 7': { lat: 11.9200, lng: 108.4578 },
  'Phường 8': { lat: 11.9445, lng: 108.4120 },
  'Phường 9': { lat: 11.9345, lng: 108.4180 },
  'Phường 10': { lat: 11.9289, lng: 108.4633 },
  'Phường 11': { lat: 11.9123, lng: 108.4312 },
  'Phường 12': { lat: 11.9678, lng: 108.4267 },
  'Xuân Thọ': { lat: 11.9756, lng: 108.4623 },
  'Lạc Dương': { lat: 12.0456, lng: 108.4789 },
};

const typeColors: Record<string, string> = {
  rental: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  homestay: 'bg-amber-100 text-amber-700 border-amber-200',
  apartment: 'bg-rose-100 text-rose-700 border-rose-200',
};

const typeLabels: Record<string, string> = {
  rental: 'Cho thuê',
  homestay: 'Homestay',
  apartment: 'Bán căn hộ',
};

const filterButtons = [
  { value: 'all', label: 'Tất cả', color: 'bg-stone-800 text-white' },
  { value: 'rental', label: 'Cho thuê', color: 'bg-emerald-600 text-white' },
  { value: 'homestay', label: 'Homestay', color: 'bg-amber-500 text-white' },
  { value: 'apartment', label: 'Căn hộ bán', color: 'bg-rose-600 text-white' },
];

const areaStats = [
  { area: 'Phường 1 – 3 (Trung tâm)', count: 8, avg: '12 – 25 tr/tháng' },
  { area: 'Phường 5 – 8 (Dân cư)', count: 6, avg: '7 – 15 tr/tháng' },
  { area: 'Phường 9 – 12 (Rừng thông)', count: 5, avg: '6 – 12 tr/tháng' },
  { area: 'Xuân Thọ – Lạc Dương', count: 4, avg: '5 – 8 tr/tháng' },
];

export default function MapPage() {
  const [mapFilter, setMapFilter] = useState<MapFilter>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = mapFilter === 'all'
    ? allProperties
    : allProperties.filter((p) => p.type === mapFilter);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        <div className="bg-emerald-700 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bản Đồ Bất Động Sản Đà Lạt
            </h1>
            <p className="text-emerald-100 text-sm">Khám phá các bất động sản theo vị trí địa lý tại thành phố Đà Lạt</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setMapFilter(btn.value as MapFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  mapFilter === btn.value
                    ? btn.color
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {btn.label}
                <span className="ml-1.5 text-xs opacity-80">
                  ({btn.value === 'all' ? allProperties.length : allProperties.filter(p => p.type === btn.value).length})
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Embed */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden border border-stone-100" style={{ height: '540px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62753.67490698218!2d108.40627455820312!3d11.940041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112fca0b3101b%3A0xb7d84289e7cdf72a!2zxJDDoCBM4bqhdCwgTMOibSDEkOG7k25nIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ Đà Lạt"
                ></iframe>
              </div>
              <p className="text-stone-400 text-xs mt-2 flex items-center gap-1">
                <i className="ri-information-line"></i>
                Bản đồ hiển thị toàn bộ thành phố Đà Lạt, Lâm Đồng – tất cả khu vực đang có bất động sản niêm yết.
              </p>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Properties List */}
              <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-700">
                    Bất động sản ({filteredProperties.length})
                  </h3>
                  <span className="text-xs text-stone-400">Nhấn để xem chi tiết</span>
                </div>
                <div className="divide-y divide-stone-50 max-h-80 overflow-y-auto">
                  {filteredProperties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProperty(selectedProperty?.id === p.id ? null : p)}
                      className={`flex gap-3 p-3 hover:bg-stone-50 cursor-pointer transition-colors ${selectedProperty?.id === p.id ? 'bg-emerald-50' : ''}`}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-800 line-clamp-1">{p.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <i className="ri-map-pin-line text-stone-400 text-xs"></i>
                          <span className="text-xs text-stone-400 truncate">{p.area}</span>
                        </div>
                        <div className={`inline-flex mt-1 px-1.5 py-0.5 rounded text-xs border ${typeColors[p.type]}`}>
                          {typeLabels[p.type]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Property Detail */}
              {selectedProperty && (
                <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden">
                  <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-32 object-cover object-top" />
                  <div className="p-4">
                    <h4 className="font-semibold text-stone-800 text-sm mb-1">{selectedProperty.title}</h4>
                    <p className="text-stone-500 text-xs mb-2">{selectedProperty.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-bold text-sm">
                        {selectedProperty.type === 'apartment'
                          ? `${(selectedProperty.price / 1000000000).toFixed(1)} tỷ`
                          : `${(selectedProperty.price / 1000000).toFixed(0)} triệu${selectedProperty.priceUnit}`}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs border ${typeColors[selectedProperty.type]}`}>
                        {typeLabels[selectedProperty.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-stone-500 text-xs">
                      <span>{selectedProperty.bedrooms} PN</span>
                      <span>{selectedProperty.bathrooms} WC</span>
                      <span>{selectedProperty.size} m²</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Area Statistics */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-stone-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Thống Kê Theo Khu Vực
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {areaStats.map((stat) => (
                <div key={stat.area} className="bg-white rounded-xl p-4 border border-stone-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg">
                      <i className="ri-map-2-line text-emerald-600"></i>
                    </div>
                    <h3 className="text-xs font-semibold text-stone-700">{stat.area}</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-stone-800">{stat.count}</p>
                      <p className="text-xs text-stone-400">bất động sản</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-emerald-600">{stat.avg}</p>
                      <p className="text-xs text-stone-400">giá trung bình</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
