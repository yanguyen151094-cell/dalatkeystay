import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import PropertyCard from '../../components/base/PropertyCard';
import { rentalListings, areas, formatPrice } from '../../mocks/listings';
import type { Property } from '../../mocks/listings';

const priceRanges = [
  { value: '', label: 'Tất cả mức giá' },
  { value: '0-5', label: 'Dưới 5 triệu' },
  { value: '5-10', label: '5 – 10 triệu' },
  { value: '10-20', label: '10 – 20 triệu' },
  { value: '20+', label: 'Trên 20 triệu' },
];

const bedroomOptions = ['Tất cả', '1', '2', '3', '4+'];
const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'size-asc', label: 'Diện tích nhỏ nhất' },
  { value: 'size-desc', label: 'Diện tích lớn nhất' },
];

export default function SearchListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || '');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredListings, setFilteredListings] = useState<Property[]>(rentalListings);

  useEffect(() => {
    let result = [...rentalListings];

    if (selectedArea) {
      result = result.filter((p) => p.area === selectedArea);
    }

    if (selectedPrice === '0-5') {
      result = result.filter((p) => p.price < 5000000);
    } else if (selectedPrice === '5-10') {
      result = result.filter((p) => p.price >= 5000000 && p.price < 10000000);
    } else if (selectedPrice === '10-20') {
      result = result.filter((p) => p.price >= 10000000 && p.price < 20000000);
    } else if (selectedPrice === '20+') {
      result = result.filter((p) => p.price >= 20000000);
    }

    if (selectedBedrooms !== 'Tất cả') {
      if (selectedBedrooms === '4+') {
        result = result.filter((p) => p.bedrooms >= 4);
      } else {
        result = result.filter((p) => p.bedrooms === parseInt(selectedBedrooms));
      }
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'size-asc') result.sort((a, b) => a.size - b.size);
    if (sortBy === 'size-desc') result.sort((a, b) => b.size - a.size);

    setFilteredListings(result);
  }, [selectedArea, selectedPrice, selectedBedrooms, sortBy]);

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    const params = new URLSearchParams(searchParams);
    if (area) params.set('area', area);
    else params.delete('area');
    setSearchParams(params);
  };

  const handleReset = () => {
    setSelectedArea('');
    setSelectedPrice('');
    setSelectedBedrooms('Tất cả');
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-emerald-700 py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Cho Thuê Nhà Nguyên Căn Đà Lạt
            </h1>
            <p className="text-emerald-100 text-sm">
              Tìm kiếm nhà nguyên căn phù hợp theo khu vực, mức giá tại thành phố Đà Lạt
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Khu vực</label>
                <select
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {areas.map((a) => (
                    <option key={a} value={a === 'Tất cả khu vực' ? '' : a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Mức giá/tháng</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {priceRanges.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Số phòng ngủ</label>
                <div className="flex gap-1">
                  {bedroomOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedBedrooms(opt)}
                      className={`flex-1 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        selectedBedrooms === opt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Sắp xếp</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  {sortOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Khu vực tags */}
            <div className="pt-3 border-t border-stone-100">
              <p className="text-xs text-stone-500 mb-2">Khu vực nhanh:</p>
              <div className="flex flex-wrap gap-2">
                {areas.slice(1, 9).map((area) => (
                  <button
                    key={area}
                    onClick={() => handleAreaChange(selectedArea === area ? '' : area)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all cursor-pointer whitespace-nowrap ${
                      selectedArea === area
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-stone-200 text-stone-600 hover:border-emerald-400 hover:text-emerald-600'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-stone-600 text-sm">
              Tìm thấy <strong className="text-stone-800">{filteredListings.length}</strong> bất động sản
              {selectedArea && <span> tại <strong className="text-emerald-700">{selectedArea}</strong></span>}
            </p>
            <div className="flex items-center gap-2">
              {(selectedArea || selectedPrice || selectedBedrooms !== 'Tất cả') && (
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <i className="ri-refresh-line"></i> Xóa lọc
                </button>
              )}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-stone-400 hover:bg-stone-100'}`}
                >
                  <i className="ri-grid-fill text-sm"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-stone-400 hover:bg-stone-100'}`}
                >
                  <i className="ri-list-check text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-stone-100 rounded-full">
                <i className="ri-search-line text-stone-400 text-3xl"></i>
              </div>
              <p className="text-stone-600 font-medium mb-1">Không tìm thấy kết quả</p>
              <p className="text-stone-400 text-sm">Thử điều chỉnh bộ lọc để tìm kiếm rộng hơn</p>
              <button onClick={handleReset} className="mt-4 px-5 py-2 bg-emerald-600 text-white text-sm rounded-lg cursor-pointer hover:bg-emerald-700">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredListings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
