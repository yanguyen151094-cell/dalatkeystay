import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { areas } from '../../mocks/listings';

interface SearchBarProps {
  variant?: 'hero' | 'inline';
}

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('rental');
  const [selectedArea, setSelectedArea] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const types = [
    { value: 'rental', label: 'Thuê Nhà Nguyên Căn' },
    { value: 'homestay', label: 'Homestay' },
    { value: 'apartment', label: 'Mua Căn Hộ' },
  ];

  const priceRanges = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '0-1', label: 'Dưới 1 triệu/Ngày' },
    { value: '1-2', label: 'Dưới 2 triệu/tháng' },
    { value: '2-5', label: 'Dưới 5 triệu/tháng' },
    { value: '5-10', label: '5 – 10 triệu/tháng' },
    { value: '10-20', label: '10 – 20 triệu/tháng' },
    { value: '20+', label: 'Trên 20 triệu/tháng' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedType) params.set('type', selectedType);
    if (selectedArea) params.set('area', selectedArea);
    if (priceRange) params.set('price', priceRange);
    navigate(`/search?${params.toString()}`);
  };

  if (variant === 'hero') {
    return (
      <div className="bg-white rounded-2xl p-2 shadow-2xl w-full max-w-3xl">
        <div className="flex flex-wrap gap-1 px-2 pt-2 pb-1 mb-2">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedType === type.value
                  ? 'bg-emerald-600 text-white'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-2 p-2">
          <div className="flex-1">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50 text-stone-700 cursor-pointer"
            >
              {areas.map((area) => (
                <option key={area} value={area === 'Tất cả khu vực' ? '' : area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50 text-stone-700 cursor-pointer"
            >
              {priceRanges.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <i className="ri-search-line"></i>
            Tìm Ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-40">
        <label className="block text-xs font-medium text-stone-500 mb-1">Loại hình</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        >
          {types.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-40">
        <label className="block text-xs font-medium text-stone-500 mb-1">Khu vực</label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        >
          {areas.map((area) => (
            <option key={area} value={area === 'Tất cả khu vực' ? '' : area}>{area}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-40">
        <label className="block text-xs font-medium text-stone-500 mb-1">Mức giá</label>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
        >
          {priceRanges.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
      >
        <i className="ri-search-line"></i>
        Tìm Kiếm
      </button>
    </div>
  );
}
