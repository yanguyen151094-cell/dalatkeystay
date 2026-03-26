import { useState, useEffect, useRef, FormEvent, ChangeEvent, DragEvent } from 'react';
import { supabase, Property } from '../../../../lib/supabase';
import { useAdminAuth } from '../../../../contexts/AdminAuthContext';

interface Props {
  property: Property | null;
  onClose: () => void;
  onSaved: () => void;
}

interface ExistingVideo {
  id: string;
  title: string;
  platform: string | null;
  thumbnail_url: string | null;
  embed_id: string | null;
  type: string;
  url: string;
}

interface PendingVideo {
  tempId: string;
  title: string;
  type: 'embed' | 'upload';
  url: string;
  // embed
  platform?: string;
  embedId?: string;
  thumbnail?: string;
  // upload
  fileName?: string;
  fileSize?: number;
}

interface VideoPreview {
  platform: string;
  embedId: string;
  thumbnail: string;
}

const extractYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
};

const extractVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const detectPlatform = (url: string): VideoPreview | null => {
  const ytId = extractYouTubeId(url);
  if (ytId) return { platform: 'youtube', embedId: ytId, thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` };
  const viId = extractVimeoId(url);
  if (viId) return { platform: 'vimeo', embedId: viId, thumbnail: '' };
  return null;
};

const AMENITIES_LIST = ['Wi-Fi', 'Điều hòa', 'Bếp', 'Máy giặt', 'TV', 'Bãi đỗ xe', 'Hồ bơi', 'Ban công', 'View núi', 'View thành phố', 'Thang máy', 'Bảo vệ 24/7', 'Gym', 'Hầm xe', 'Sân vườn', 'Lò sưởi'];

const PropertyFormModal = ({ property, onClose, onSaved }: Props) => {
  const { adminProfile } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([]);
  const [storageError, setStorageError] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // Video state
  const [videoMode, setVideoMode] = useState<'embed' | 'upload'>('embed');
  const [existingVideos, setExistingVideos] = useState<ExistingVideo[]>([]);
  const [pendingVideos, setPendingVideos] = useState<PendingVideo[]>([]);
  const [removedVideoIds, setRemovedVideoIds] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [videoUrlError, setVideoUrlError] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([]);
  const [videoDragging, setVideoDragging] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'homestay',
    listing_type: 'rent',
    status: 'available',
    price_per_night: '',
    price_per_month: '',
    sale_price: '',
    area: '',
    bedrooms: '1',
    bathrooms: '1',
    max_guests: '2',
    address: '',
    district: '',
    images: [] as string[],
    is_featured: false,
    amenities: [] as string[],
  });

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description || '',
        type: property.type,
        listing_type: property.listing_type || 'rent',
        status: property.status,
        price_per_night: property.price_per_night?.toString() || '',
        price_per_month: property.price_per_month?.toString() || '',
        sale_price: property.sale_price?.toString() || '',
        area: property.area?.toString() || '',
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        max_guests: property.max_guests.toString(),
        address: property.address || '',
        district: property.district || '',
        images: property.images || (property.thumbnail ? [property.thumbnail] : []),
        is_featured: property.is_featured,
        amenities: property.amenities || [],
      });
      supabase.from('media_videos').select('id, title, platform, thumbnail_url, embed_id, type, url')
        .eq('property_id', property.id)
        .then(({ data }) => {
          if (data) setExistingVideos(data as ExistingVideo[]);
        });
    }
  }, [property]);

  const handleVideoUrlChange = (val: string) => {
    setVideoUrlInput(val);
    setVideoUrlError('');
    if (val.trim()) {
      const info = detectPlatform(val);
      setVideoPreview(info);
    } else {
      setVideoPreview(null);
    }
  };

  const handleAddVideo = () => {
    if (!videoTitleInput.trim()) { setVideoUrlError('Nhập tiêu đề video'); return; }
    if (!videoPreview) { setVideoUrlError('URL không hợp lệ. Chỉ hỗ trợ YouTube và Vimeo.'); return; }
    setPendingVideos(prev => [...prev, {
      tempId: `tmp-${Date.now()}`,
      title: videoTitleInput.trim(),
      url: videoUrlInput.trim(),
      ...videoPreview,
    }]);
    setVideoUrlInput('');
    setVideoTitleInput('');
    setVideoPreview(null);
    setVideoUrlError('');
  };

  const uploadVideoFiles = async (files: File[]) => {
    const videoFiles = files.filter(f => f.type.startsWith('video/'));
    if (!videoFiles.length) return;
    setUploadingVideo(true);
    setVideoUploadProgress(videoFiles.map(f => ({ name: f.name, status: 'uploading' })));

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      const ext = file.name.split('.').pop() || 'mp4';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `videos/property/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setVideoUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

      setPendingVideos(prev => [...prev, {
        tempId: `tmp-upload-${Date.now()}-${i}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        type: 'upload',
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
      }]);

      setVideoUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'done' } : p));
    }

    setUploadingVideo(false);
    setTimeout(() => setVideoUploadProgress([]), 1500);
  };

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadVideoFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleVideoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setVideoDragging(false);
    uploadVideoFiles(Array.from(e.dataTransfer.files));
  };

  const removeExistingVideo = (id: string) => {
    setRemovedVideoIds(prev => [...prev, id]);
    setExistingVideos(prev => prev.filter(v => v.id !== id));
  };

  const removePendingVideo = (tempId: string) => {
    setPendingVideos(prev => prev.filter(v => v.tempId !== tempId));
  };

  const toggleAmenity = (a: string) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) return;
    setUploadingImages(true);
    setStorageError(false);
    setUploadProgress(imageFiles.map(f => ({ name: f.name, status: 'uploading' })));

    const newUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `property/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        if (uploadError.message?.toLowerCase().includes('bucket')) setStorageError(true);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);
      newUrls.push(publicUrl);
      setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'done' } : p));
    }

    setForm(f => ({ ...f, images: [...f.images, ...newUrls] }));
    setUploadingImages(false);
    setTimeout(() => setUploadProgress([]), 1500);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setForm(f => ({ ...f, images: [...f.images, url] }));
    setUrlInput('');
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const setAsThumbnail = (idx: number) => {
    if (idx === 0) return;
    const reordered = [...form.images];
    const [img] = reordered.splice(idx, 1);
    reordered.unshift(img);
    setForm(f => ({ ...f, images: reordered }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const thumbnail = form.images[0] || null;
    const payload = {
      title: form.title,
      description: form.description || null,
      type: form.type,
      listing_type: form.listing_type,
      status: form.status,
      price_per_night: form.listing_type === 'rent' && form.price_per_night ? Number(form.price_per_night) : null,
      price_per_month: form.listing_type === 'rent' && form.price_per_month ? Number(form.price_per_month) : null,
      sale_price: form.listing_type === 'sale' && form.sale_price ? Number(form.sale_price) : null,
      area: form.area ? Number(form.area) : null,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      max_guests: Number(form.max_guests),
      address: form.address || null,
      district: form.district || null,
      thumbnail,
      images: form.images,
      is_featured: form.is_featured,
      amenities: form.amenities,
      updated_at: new Date().toISOString(),
    };

    let savedPropertyId = property?.id;

    if (property) {
      await supabase.from('properties').update(payload).eq('id', property.id);
    } else {
      const { data: newProp } = await supabase.from('properties')
        .insert({ ...payload, created_by: adminProfile?.id })
        .select('id')
        .maybeSingle();
      savedPropertyId = newProp?.id;
    }

    // Handle video changes
    if (removedVideoIds.length > 0) {
      await supabase.from('media_videos').delete().in('id', removedVideoIds);
    }
    if (pendingVideos.length > 0 && savedPropertyId) {
      await supabase.from('media_videos').insert(
        pendingVideos.map(v => ({
          title: v.title,
          type: 'embed',
          url: v.url,
          embed_id: v.embedId,
          platform: v.platform,
          thumbnail_url: v.thumbnail || null,
          category: 'property',
          property_id: savedPropertyId,
          uploaded_by: adminProfile?.id || null,
        }))
      );
    }

    setSubmitting(false);
    onSaved();
  };

  const isSale = form.listing_type === 'sale';
  const totalVideos = existingVideos.length + pendingVideos.length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-stone-800">{property ? 'Chỉnh sửa căn hộ' : 'Thêm căn hộ mới'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">

            {/* Listing Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Loại giao dịch *</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, listing_type: 'rent' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${!isSale ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}>
                  <i className="ri-key-line" /> Cho thuê
                </button>
                <button type="button" onClick={() => setForm(f => ({ ...f, listing_type: 'sale' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${isSale ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300'}`}>
                  <i className="ri-home-smile-line" /> Bán
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-1">Tên căn hộ *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  placeholder="VD: Homestay View Núi Langbiang" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Loại hình *</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 cursor-pointer bg-white">
                  <option value="homestay">Homestay</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="villa">Villa</option>
                  <option value="room">Phòng</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Trạng thái *</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 cursor-pointer bg-white">
                  <option value="available">Còn trống</option>
                  <option value="rented">Đang thuê</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>

            {/* Prices */}
            {!isSale ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Giá / đêm (VNĐ)</label>
                  <input type="number" value={form.price_per_night}
                    onChange={e => setForm(f => ({ ...f, price_per_night: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="500000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Giá / tháng (VNĐ)</label>
                  <input type="number" value={form.price_per_month}
                    onChange={e => setForm(f => ({ ...f, price_per_month: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="8000000" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Giá bán (VNĐ) * <span className="ml-1 text-xs text-stone-400 font-normal">VD: 2500000000 (= 2.5 tỷ)</span>
                </label>
                <input type="number" required={isSale} value={form.sale_price}
                  onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))}
                  className="w-full border border-rose-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-rose-50/30" placeholder="2500000000" />
                {form.sale_price && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    ≈ {Number(form.sale_price) >= 1000000000
                      ? `${(Number(form.sale_price) / 1000000000).toFixed(2).replace(/\.?0+$/, '')} tỷ VNĐ`
                      : `${(Number(form.sale_price) / 1000000).toFixed(0)} triệu VNĐ`}
                  </p>
                )}
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Diện tích (m²)', key: 'area', placeholder: '40' },
                { label: 'Phòng ngủ', key: 'bedrooms', placeholder: '' },
                { label: 'Phòng tắm', key: 'bathrooms', placeholder: '' },
                { label: 'Khách tối đa', key: 'max_guests', placeholder: '' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
                  <input type="number" min="0" value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder={placeholder} />
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Địa chỉ</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="123 Đường ABC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Khu vực / Phường</label>
                <input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="Phường 1" />
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Hình ảnh
                <span className="ml-2 text-xs text-stone-400 font-normal">Ảnh đầu tiên sẽ là ảnh đại diện</span>
              </label>

              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-video bg-stone-100">
                      <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                        {idx !== 0 && (
                          <button type="button" onClick={() => setAsThumbnail(idx)} title="Đặt làm ảnh đại diện"
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-lg cursor-pointer">
                            <i className="ri-star-line text-amber-500 text-xs" />
                          </button>
                        )}
                        <button type="button" onClick={() => removeImage(idx)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg cursor-pointer">
                          <i className="ri-delete-bin-line text-red-500 text-xs" />
                        </button>
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">Đại diện</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !uploadingImages && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${dragging ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'} ${uploadingImages ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mx-auto mb-2">
                  {uploadingImages
                    ? <i className="ri-loader-4-line text-amber-500 text-xl animate-spin" />
                    : <i className="ri-upload-cloud-2-line text-amber-500 text-xl" />}
                </div>
                <p className="text-stone-600 text-sm font-medium mb-0.5">
                  {dragging ? 'Thả ảnh vào đây...' : uploadingImages ? 'Đang tải ảnh lên...' : 'Kéo thả hoặc nhấn để chọn ảnh'}
                </p>
                <p className="text-stone-400 text-xs">PNG, JPG, WEBP · Nhiều ảnh cùng lúc · Tối đa 10MB/ảnh</p>
              </div>

              <div className="mt-3">
                <p className="text-xs text-stone-400 text-center mb-2">— hoặc thêm bằng link ảnh —</p>
                <div className="flex gap-2">
                  <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                    className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                    placeholder="Dán link ảnh vào đây rồi nhấn Thêm..." />
                  <button type="button" onClick={handleAddUrl} disabled={!urlInput.trim()}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40">
                    Thêm
                  </button>
                </div>
              </div>

              {storageError && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-700 text-xs font-medium mb-1">Chưa tạo Storage Bucket!</p>
                  <p className="text-red-600 text-xs">Vào Supabase Dashboard → Storage → New bucket → Đặt tên <strong>media</strong> → Public → Tạo.</p>
                </div>
              )}

              {uploadProgress.length > 0 && (
                <div className="mt-2 space-y-1">
                  {uploadProgress.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-1.5">
                      <i className={`text-xs ${p.status === 'uploading' ? 'ri-loader-4-line text-amber-500 animate-spin' : p.status === 'done' ? 'ri-checkbox-circle-line text-green-500' : 'ri-error-warning-line text-red-500'}`} />
                      <span className="text-xs text-stone-600 truncate flex-1">{p.name}</span>
                      <span className={`text-xs font-medium ${p.status === 'done' ? 'text-green-600' : p.status === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
                        {p.status === 'uploading' ? 'Đang tải...' : p.status === 'done' ? 'Xong!' : 'Lỗi'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── VIDEO SECTION ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-stone-700">Video căn hộ</label>
                {totalVideos > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {totalVideos} video
                  </span>
                )}
              </div>

              {/* Video list */}
              {(existingVideos.length > 0 || pendingVideos.length > 0) && (
                <div className="space-y-2 mb-3">
                  {existingVideos.map(vid => (
                    <div key={vid.id} className="flex items-center gap-3 bg-stone-50 rounded-lg px-3 py-2.5 border border-stone-100">
                      {vid.thumbnail_url ? (
                        <img src={vid.thumbnail_url} alt={vid.title} className="w-14 h-9 object-cover rounded flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-9 bg-stone-200 rounded flex-shrink-0 flex items-center justify-center">
                          <i className="ri-video-line text-stone-400 text-sm" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-700 truncate">{vid.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {vid.type === 'upload' ? (
                            <><i className="ri-upload-cloud-line text-xs text-stone-400" /><span className="text-xs text-stone-400">Đã upload</span></>
                          ) : (
                            <><i className={`text-xs ${vid.platform === 'youtube' ? 'ri-youtube-fill text-red-500' : 'ri-vimeo-fill text-teal-500'}`} /><span className="text-xs text-stone-400 capitalize">{vid.platform}</span></>
                          )}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeExistingVideo(vid.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0">
                        <i className="ri-close-line text-sm" />
                      </button>
                    </div>
                  ))}
                  {pendingVideos.map(vid => (
                    <div key={vid.tempId} className="flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-200">
                      {vid.type === 'embed' && vid.thumbnail ? (
                        <img src={vid.thumbnail} alt={vid.title} className="w-14 h-9 object-cover rounded flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-9 bg-amber-100 rounded flex-shrink-0 flex items-center justify-center">
                          <i className={`text-amber-500 text-sm ${vid.type === 'upload' ? 'ri-video-upload-line' : 'ri-video-line'}`} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-700 truncate">{vid.title}</p>
                        <span className="text-xs text-amber-600">
                          {vid.type === 'upload' ? 'Đã upload · sẽ lưu khi submit' : 'Chưa lưu · sẽ lưu khi submit'}
                        </span>
                      </div>
                      <button type="button" onClick={() => removePendingVideo(vid.tempId)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0">
                        <i className="ri-close-line text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab switcher */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="flex items-center border-b border-stone-100 bg-stone-50">
                  <button type="button" onClick={() => setVideoMode('embed')}
                    className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${videoMode === 'embed' ? 'bg-white text-amber-600 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-700'}`}>
                    <i className="ri-youtube-line" /> Nhúng YouTube / Vimeo
                  </button>
                  <button type="button" onClick={() => setVideoMode('upload')}
                    className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${videoMode === 'upload' ? 'bg-white text-amber-600 border-b-2 border-amber-500' : 'text-stone-500 hover:text-stone-700'}`}>
                    <i className="ri-upload-cloud-2-line" /> Tải video lên
                  </button>
                </div>

                <div className="p-4">
                  {/* Embed mode */}
                  {videoMode === 'embed' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={videoTitleInput}
                        onChange={e => setVideoTitleInput(e.target.value)}
                        placeholder="Tiêu đề video (VD: Tour 360° căn hộ view núi)"
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={videoUrlInput}
                          onChange={e => handleVideoUrlChange(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white"
                        />
                        <button type="button" onClick={handleAddVideo}
                          disabled={!videoPreview || !videoTitleInput.trim()}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 flex items-center gap-1.5">
                          <i className="ri-add-line" /> Thêm
                        </button>
                      </div>
                      {videoPreview && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
                          {videoPreview.thumbnail && (
                            <img src={videoPreview.thumbnail} alt="thumb" className="w-12 h-8 object-cover rounded" />
                          )}
                          <div className="flex items-center gap-1.5">
                            <i className={`text-xs ${videoPreview.platform === 'youtube' ? 'ri-youtube-fill text-red-500' : 'ri-vimeo-fill text-teal-500'}`} />
                            <span className="text-xs text-green-700 font-medium capitalize">{videoPreview.platform} · URL hợp lệ!</span>
                          </div>
                        </div>
                      )}
                      {videoUrlError && <p className="text-red-500 text-xs">{videoUrlError}</p>}
                    </div>
                  )}

                  {/* Upload mode */}
                  {videoMode === 'upload' && (
                    <div>
                      <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideoFileChange} />
                      <div
                        onDragOver={e => { e.preventDefault(); setVideoDragging(true); }}
                        onDragLeave={() => setVideoDragging(false)}
                        onDrop={handleVideoDrop}
                        onClick={() => !uploadingVideo && videoInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${videoDragging ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'} ${uploadingVideo ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-amber-50 rounded-xl mx-auto mb-2">
                          {uploadingVideo
                            ? <i className="ri-loader-4-line text-amber-500 text-xl animate-spin" />
                            : <i className="ri-video-upload-line text-amber-500 text-xl" />}
                        </div>
                        <p className="text-stone-600 text-sm font-medium mb-0.5">
                          {videoDragging ? 'Thả video vào đây...' : uploadingVideo ? 'Đang upload video...' : 'Kéo thả hoặc nhấn để chọn video'}
                        </p>
                        <p className="text-stone-400 text-xs">MP4, MOV, AVI · Nhiều video cùng lúc · Tối đa 2GB/video</p>
                      </div>

                      {videoUploadProgress.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {videoUploadProgress.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-1.5">
                              <i className={`text-xs ${p.status === 'uploading' ? 'ri-loader-4-line text-amber-500 animate-spin' : p.status === 'done' ? 'ri-checkbox-circle-line text-green-500' : 'ri-error-warning-line text-red-500'}`} />
                              <span className="text-xs text-stone-600 truncate flex-1">{p.name}</span>
                              <span className={`text-xs font-medium ${p.status === 'done' ? 'text-green-600' : p.status === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
                                {p.status === 'uploading' ? 'Đang upload...' : p.status === 'done' ? 'Xong!' : 'Lỗi'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Mô tả</label>
              <textarea rows={6} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-y"
                placeholder="Mô tả căn hộ..." maxLength={5000} />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Tiện ích</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      form.amenities.includes(a) ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                className="w-4 h-4 accent-amber-500" />
              <span className="text-sm text-stone-700">Đánh dấu là nổi bật (hiển thị trên trang chủ)</span>
            </label>
          </div>

          <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-all cursor-pointer whitespace-nowrap">
              Hủy
            </button>
            <button type="submit" disabled={submitting || uploadingImages || uploadingVideo}
              className={`px-5 py-2 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 ${
                isSale ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'
              }`}>
              {submitting ? 'Đang lưu...' : uploadingImages ? 'Chờ upload ảnh xong...' : uploadingVideo ? 'Chờ upload video xong...' : property ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;