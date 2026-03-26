import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';
import UploadArea from './components/UploadArea';
import VideoUploadArea from './components/VideoUploadArea';

interface MediaImage {
  id: string;
  file_name: string;
  url: string;
  file_size: number | null;
  category: string;
  is_banner: boolean;
  banner_order: number | null;
  alt_text: string | null;
  created_at: string;
  property_id: string | null;
}

interface MediaVideo {
  id: string;
  title: string;
  type: 'embed' | 'upload';
  url: string;
  embed_id: string | null;
  platform: string | null;
  thumbnail_url: string | null;
  file_name: string | null;
  file_size: number | null;
  category: string;
  description: string | null;
  property_id: string | null;
  created_at: string;
}

interface PropertyOption {
  id: string;
  title: string;
}

type MediaTab = 'images' | 'videos';
type ImageTab = 'all' | 'property' | 'banner';

const fmtSize = (bytes: number | null) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const AdminMedia = () => {
  const [mediaTab, setMediaTab] = useState<MediaTab>('images');
  const [imageTab, setImageTab] = useState<ImageTab>('all');
  const [images, setImages] = useState<MediaImage[]>([]);
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('');
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<MediaVideo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [editingAlt, setEditingAlt] = useState<{ id: string; value: string } | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'property' | 'banner' | 'general'>('general');
  const [uploadPropertyId, setUploadPropertyId] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('media_images').select('*').order('created_at', { ascending: false });
    if (imageTab !== 'all') query = query.eq('category', imageTab);
    if (selectedPropertyFilter) query = query.eq('property_id', selectedPropertyFilter);
    const { data } = await query;
    setImages((data as MediaImage[]) || []);
    setLoading(false);
  }, [imageTab, selectedPropertyFilter]);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('media_videos').select('*').order('created_at', { ascending: false });
    if (selectedPropertyFilter) query = query.eq('property_id', selectedPropertyFilter);
    const { data } = await query;
    setVideos((data as MediaVideo[]) || []);
    setLoading(false);
  }, [selectedPropertyFilter]);

  const fetchProperties = useCallback(async () => {
    const { data } = await supabase.from('properties').select('id, title').order('title');
    setProperties((data as PropertyOption[]) || []);
  }, []);

  useEffect(() => {
    if (mediaTab === 'images') fetchImages();
    else fetchVideos();
  }, [mediaTab, fetchImages, fetchVideos]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDeleteImage = async (img: MediaImage) => {
    if (!window.confirm(`Xóa ảnh "${img.file_name}"?`)) return;
    setDeleting(img.id);
    await supabase.storage.from('media').remove([img.file_name || img.url]);
    await supabase.from('media_images').delete().eq('id', img.id);
    setDeleting(null);
    if (selectedImage?.id === img.id) setSelectedImage(null);
    await fetchImages();
    showToast('Đã xóa ảnh.');
  };

  const handleDeleteVideo = async (vid: MediaVideo) => {
    if (!window.confirm(`Xóa video "${vid.title}"?`)) return;
    setDeleting(vid.id);
    if (vid.type === 'upload' && vid.file_name) {
      await supabase.storage.from('media').remove([`videos/${vid.category}/${vid.file_name}`]);
    }
    await supabase.from('media_videos').delete().eq('id', vid.id);
    setDeleting(null);
    if (selectedVideo?.id === vid.id) setSelectedVideo(null);
    await fetchVideos();
    showToast('Đã xóa video.');
  };

  const handleToggleBanner = async (img: MediaImage) => {
    const newVal = !img.is_banner;
    await supabase.from('media_images').update({ is_banner: newVal, category: newVal ? 'banner' : 'general' }).eq('id', img.id);
    await fetchImages();
    showToast(newVal ? 'Đã đặt làm banner!' : 'Đã bỏ khỏi banner.');
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveAlt = async () => {
    if (!editingAlt) return;
    await supabase.from('media_images').update({ alt_text: editingAlt.value }).eq('id', editingAlt.id);
    setEditingAlt(null);
    await fetchImages();
    showToast('Đã lưu mô tả ảnh!');
  };

  const filteredImages = images.filter(img =>
    !search || img.file_name.toLowerCase().includes(search.toLowerCase()) || img.alt_text?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVideos = videos.filter(v =>
    !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.description?.toLowerCase().includes(search.toLowerCase())
  );

  const bannerImages = images.filter(img => img.is_banner);

  const getEmbedUrl = (vid: MediaVideo) => {
    if (vid.platform === 'youtube' && vid.embed_id) return `https://www.youtube.com/embed/${vid.embed_id}`;
    if (vid.platform === 'vimeo' && vid.embed_id) return `https://player.vimeo.com/video/${vid.embed_id}`;
    return vid.url;
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Media</h1>
            <p className="text-stone-500 text-sm mt-1">Quản lý hình ảnh và video của căn hộ</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${mediaTab === 'videos' ? 'ri-video-upload-line' : 'ri-upload-2-line'} text-sm`} />
            </div>
            {mediaTab === 'videos' ? 'Thêm video' : 'Upload ảnh'}
          </button>
        </div>

        {/* Main Tabs: Images / Videos */}
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1 w-fit mb-6">
          {([['images', 'ri-image-line', 'Hình ảnh'], ['videos', 'ri-video-line', 'Video']] as [MediaTab, string, string][]).map(([val, icon, label]) => (
            <button
              key={val}
              onClick={() => { setMediaTab(val); setSearch(''); setShowUpload(false); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                mediaTab === val ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={`${icon} text-sm`} />
              </div>
              {label}
            </button>
          ))}
        </div>

        {/* Upload Panel */}
        {showUpload && (
          <div className="bg-white rounded-xl border border-stone-100 p-6 mb-6">
            {mediaTab === 'images' ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-stone-600 block mb-1.5">Loại ảnh</label>
                    <select
                      value={uploadCategory}
                      onChange={e => setUploadCategory(e.target.value as 'property' | 'banner' | 'general')}
                      className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="general">Ảnh chung</option>
                      <option value="property">Ảnh căn hộ</option>
                      <option value="banner">Banner trang chủ</option>
                    </select>
                  </div>
                  {uploadCategory === 'property' && (
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Gán cho căn hộ</label>
                      <select
                        value={uploadPropertyId}
                        onChange={e => setUploadPropertyId(e.target.value)}
                        className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="">-- Chọn căn hộ --</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <UploadArea
                  category={uploadCategory}
                  propertyId={uploadPropertyId || undefined}
                  onUploaded={() => { fetchImages(); setShowUpload(false); showToast('Upload thành công!'); }}
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-stone-600 block mb-1.5">Gán cho căn hộ (tuỳ chọn)</label>
                    <select
                      value={uploadPropertyId}
                      onChange={e => setUploadPropertyId(e.target.value)}
                      className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="">-- Không gán --</option>
                      {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                </div>
                <VideoUploadArea
                  category="general"
                  propertyId={uploadPropertyId || undefined}
                  onUploaded={() => { fetchVideos(); setShowUpload(false); showToast('Đã thêm video!'); }}
                />
              </>
            )}
          </div>
        )}

        {/* ── IMAGES SECTION ── */}
        {mediaTab === 'images' && (
          <>
            {bannerImages.length > 0 && imageTab === 'all' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-image-line text-amber-600 text-sm" />
                  </div>
                  <span className="text-amber-800 text-sm font-medium">Banner trang chủ hiện tại ({bannerImages.length} ảnh)</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {bannerImages.map(img => (
                    <div key={img.id} className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
                      <img src={img.url} alt={img.alt_text || img.file_name} className="w-full h-full object-cover object-top" />
                      <button
                        onClick={() => handleToggleBanner(img)}
                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 rounded-full cursor-pointer"
                      >
                        <i className="ri-close-line text-white text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                {([['all', 'Tất cả'], ['property', 'Ảnh căn hộ'], ['banner', 'Banner']] as [ImageTab, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setImageTab(val)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      imageTab === val ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {imageTab === 'property' && (
                  <select
                    value={selectedPropertyFilter}
                    onChange={e => setSelectedPropertyFilter(e.target.value)}
                    className="border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="">Tất cả căn hộ</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                )}
                <div className="relative">
                  <div className="w-9 h-9 flex items-center justify-center absolute left-0 top-0">
                    <i className="ri-search-line text-stone-400 text-sm" />
                  </div>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm ảnh..."
                    className="pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-400 w-48"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-100 py-16 text-center">
                <div className="w-14 h-14 flex items-center justify-center bg-stone-50 rounded-full mx-auto mb-3">
                  <i className="ri-image-line text-stone-300 text-3xl" />
                </div>
                <p className="text-stone-500 text-sm font-medium">Chưa có ảnh nào</p>
                <p className="text-stone-400 text-xs mt-1">Nhấn &ldquo;Upload ảnh&rdquo; để thêm hình ảnh đầu tiên</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map(img => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="group bg-white rounded-xl border border-stone-100 overflow-hidden cursor-pointer hover:border-amber-300 transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden bg-stone-100">
                      <img
                        src={img.url}
                        alt={img.alt_text || img.file_name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {img.is_banner && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
                          Banner
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={e => { e.stopPropagation(); handleCopyUrl(img.url, img.id); }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg cursor-pointer"
                        >
                          <i className={`text-sm ${copied === img.id ? 'ri-checkbox-circle-line text-green-500' : 'ri-links-line text-stone-700'}`} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteImage(img); }}
                          disabled={deleting === img.id}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg cursor-pointer"
                        >
                          <i className={`text-sm ${deleting === img.id ? 'ri-loader-4-line animate-spin text-stone-400' : 'ri-delete-bin-line text-red-500'}`} />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-stone-700 truncate">{img.file_name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-stone-400">{fmtSize(img.file_size)}</span>
                        <span className="text-xs text-stone-400">{new Date(img.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && (
              <div className="mt-5 text-center text-stone-400 text-xs">
                Hiển thị {filteredImages.length} / {images.length} ảnh
              </div>
            )}
          </>
        )}

        {/* ── VIDEOS SECTION ── */}
        {mediaTab === 'videos' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <select
                  value={selectedPropertyFilter}
                  onChange={e => setSelectedPropertyFilter(e.target.value)}
                  className="border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="">Tất cả căn hộ</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="relative">
                <div className="w-9 h-9 flex items-center justify-center absolute left-0 top-0">
                  <i className="ri-search-line text-stone-400 text-sm" />
                </div>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm video..."
                  className="pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-amber-400 w-48"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-100 py-16 text-center">
                <div className="w-14 h-14 flex items-center justify-center bg-stone-50 rounded-full mx-auto mb-3">
                  <i className="ri-video-line text-stone-300 text-3xl" />
                </div>
                <p className="text-stone-500 text-sm font-medium">Chưa có video nào</p>
                <p className="text-stone-400 text-xs mt-1">Nhấn &ldquo;Thêm video&rdquo; để thêm video đầu tiên</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVideos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="group bg-white rounded-xl border border-stone-100 overflow-hidden cursor-pointer hover:border-amber-300 transition-all"
                  >
                    <div className="relative aspect-video bg-stone-900 overflow-hidden">
                      {vid.thumbnail_url ? (
                        <img src={vid.thumbnail_url} alt={vid.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="ri-video-line text-stone-500 text-4xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-white/90 rounded-full">
                          <i className="ri-play-fill text-stone-800 text-lg" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        {vid.platform === 'youtube' && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                            <i className="ri-youtube-fill text-xs" /> YouTube
                          </span>
                        )}
                        {vid.platform === 'vimeo' && (
                          <span className="bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                            <i className="ri-vimeo-fill text-xs" /> Vimeo
                          </span>
                        )}
                        {vid.type === 'upload' && (
                          <span className="bg-stone-700 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">Upload</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={e => { e.stopPropagation(); handleCopyUrl(getEmbedUrl(vid), vid.id); }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg cursor-pointer"
                        >
                          <i className={`text-sm ${copied === vid.id ? 'ri-checkbox-circle-line text-green-500' : 'ri-links-line text-stone-700'}`} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteVideo(vid); }}
                          disabled={deleting === vid.id}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg cursor-pointer"
                        >
                          <i className={`text-sm ${deleting === vid.id ? 'ri-loader-4-line animate-spin text-stone-400' : 'ri-delete-bin-line text-red-500'}`} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-stone-700 truncate">{vid.title}</p>
                      {vid.description && <p className="text-xs text-stone-400 truncate mt-0.5">{vid.description}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-stone-400">{vid.type === 'upload' ? fmtSize(vid.file_size) : 'Nhúng'}</span>
                        <span className="text-xs text-stone-400">{new Date(vid.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && (
              <div className="mt-5 text-center text-stone-400 text-xs">
                Hiển thị {filteredVideos.length} / {videos.length} video
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedImage.url} alt={selectedImage.alt_text || selectedImage.file_name} className="w-full max-h-72 object-cover object-top rounded-t-2xl" />
              <button onClick={() => setSelectedImage(null)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full cursor-pointer">
                <i className="ri-close-line text-stone-700 text-sm" />
              </button>
              {selectedImage.is_banner && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-lg font-medium">Banner trang chủ</div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-stone-800 text-sm mb-4">{selectedImage.file_name}</h3>
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-stone-400 block mb-0.5">Kích thước</span>
                  <span className="text-stone-700 font-medium">{fmtSize(selectedImage.file_size)}</span>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-stone-400 block mb-0.5">Loại</span>
                  <span className="text-stone-700 font-medium capitalize">{selectedImage.category}</span>
                </div>
                <div className="bg-stone-50 rounded-lg p-3 col-span-2">
                  <span className="text-stone-400 block mb-0.5">Ngày upload</span>
                  <span className="text-stone-700 font-medium">{new Date(selectedImage.created_at).toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-stone-600 block mb-1.5">Mô tả ảnh (ALT text - quan trọng cho SEO)</label>
                {editingAlt?.id === selectedImage.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editingAlt.value}
                      onChange={e => setEditingAlt({ ...editingAlt, value: e.target.value })}
                      className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                      placeholder="Ví dụ: Căn hộ view hồ Xuân Hương Đà Lạt"
                    />
                    <button onClick={handleSaveAlt} className="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap">Lưu</button>
                    <button onClick={() => setEditingAlt(null)} className="px-3 py-2 bg-stone-100 text-stone-600 rounded-lg text-xs cursor-pointer">Hủy</button>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingAlt({ id: selectedImage.id, value: selectedImage.alt_text || '' })}
                    className="border border-dashed border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-500 cursor-pointer hover:border-amber-300 hover:bg-amber-50 transition-all"
                  >
                    {selectedImage.alt_text || <span className="text-stone-300 italic">Nhấn để thêm mô tả...</span>}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-stone-600 block mb-1.5">URL ảnh</label>
                <div className="flex gap-2">
                  <input readOnly value={selectedImage.url} className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-500 bg-stone-50" />
                  <button onClick={() => handleCopyUrl(selectedImage.url, selectedImage.id)} className="px-3 py-2 bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className={`text-xs ${copied === selectedImage.id ? 'ri-checkbox-circle-line text-green-500' : 'ri-file-copy-line'}`} />
                    </div>
                    {copied === selectedImage.id ? 'Đã copy!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleToggleBanner(selectedImage)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${selectedImage.is_banner ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-700'}`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`text-sm ${selectedImage.is_banner ? 'ri-image-edit-line' : 'ri-image-add-line'}`} />
                  </div>
                  {selectedImage.is_banner ? 'Bỏ khỏi banner' : 'Đặt làm banner'}
                </button>
                <button
                  onClick={() => handleDeleteImage(selectedImage)}
                  disabled={deleting === selectedImage.id}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-delete-bin-line text-sm" />
                  </div>
                  Xóa ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative bg-stone-900 rounded-t-2xl overflow-hidden">
              {(selectedVideo.platform === 'youtube' || selectedVideo.platform === 'vimeo') ? (
                <iframe
                  src={getEmbedUrl(selectedVideo)}
                  title={selectedVideo.title}
                  className="w-full aspect-video"
                  allowFullScreen
                />
              ) : (
                <video src={selectedVideo.url} controls className="w-full aspect-video" />
              )}
              <button onClick={() => setSelectedVideo(null)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full cursor-pointer">
                <i className="ri-close-line text-stone-700 text-sm" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-stone-800 mb-1">{selectedVideo.title}</h3>
              {selectedVideo.description && <p className="text-stone-500 text-sm mb-4">{selectedVideo.description}</p>}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-stone-400 block mb-0.5">Nguồn</span>
                  <span className="text-stone-700 font-medium capitalize">{selectedVideo.platform || 'Upload'}</span>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-stone-400 block mb-0.5">Ngày thêm</span>
                  <span className="text-stone-700 font-medium">{new Date(selectedVideo.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-medium text-stone-600 block mb-1.5">Embed URL</label>
                <div className="flex gap-2">
                  <input readOnly value={getEmbedUrl(selectedVideo)} className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-500 bg-stone-50" />
                  <button onClick={() => handleCopyUrl(getEmbedUrl(selectedVideo), selectedVideo.id)} className="px-3 py-2 bg-stone-100 hover:bg-amber-50 text-stone-600 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className={`text-xs ${copied === selectedVideo.id ? 'ri-checkbox-circle-line text-green-500' : 'ri-file-copy-line'}`} />
                    </div>
                    {copied === selectedVideo.id ? 'Đã copy!' : 'Copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleDeleteVideo(selectedVideo)}
                disabled={deleting === selectedVideo.id}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-delete-bin-line text-sm" />
                </div>
                Xóa video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white text-sm rounded-lg px-4 py-3 z-50 flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-green-400 text-sm" />
          </div>
          {toastMsg}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;
