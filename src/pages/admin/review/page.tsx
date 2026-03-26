import { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

interface ReviewVideo {
  id: string;
  title: string;
  description: string | null;
  platform: string | null;
  embed_id: string | null;
  thumbnail_url: string | null;
  url: string;
  type: string;
  file_name: string | null;
  created_at: string;
}

const extractYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
};

const extractVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const detectPlatform = (url: string) => {
  const ytId = extractYouTubeId(url);
  if (ytId) return { platform: 'youtube', embedId: ytId, thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` };
  const viId = extractVimeoId(url);
  if (viId) return { platform: 'vimeo', embedId: viId, thumbnail: '' };
  return null;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const AdminReview = () => {
  const { adminProfile } = useAdminAuth();
  const [videos, setVideos] = useState<ReviewVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formTab, setFormTab] = useState<'embed' | 'upload'>('embed');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [previewId, setPreviewId] = useState<string | null>(null);

  // Embed form
  const [embedForm, setEmbedForm] = useState({ title: '', description: '', url: '' });
  const [urlPreview, setUrlPreview] = useState<{ platform: string; embedId: string; thumbnail: string } | null>(null);
  const [embedError, setEmbedError] = useState('');

  // Upload form
  const [uploadForm, setUploadForm] = useState({ title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3200);
  };

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media_videos')
      .select('*')
      .eq('category', 'dalat_review')
      .order('created_at', { ascending: false });
    setVideos((data as ReviewVideo[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const handleUrlChange = (val: string) => {
    setEmbedForm(f => ({ ...f, url: val }));
    setEmbedError('');
    setUrlPreview(val.trim() ? detectPlatform(val) : null);
  };

  const resetForm = () => {
    setEmbedForm({ title: '', description: '', url: '' });
    setUrlPreview(null);
    setEmbedError('');
    setUploadForm({ title: '', description: '' });
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError('');
    setShowForm(false);
  };

  // ── Save embed ──
  const handleSaveEmbed = async () => {
    if (!embedForm.title.trim()) { setEmbedError('Vui lòng nhập tiêu đề'); return; }
    if (!urlPreview) { setEmbedError('URL không hợp lệ. Chỉ hỗ trợ YouTube và Vimeo.'); return; }
    setSaving(true);
    const { error } = await supabase.from('media_videos').insert({
      title: embedForm.title.trim(),
      description: embedForm.description.trim() || null,
      type: 'embed',
      url: embedForm.url.trim(),
      embed_id: urlPreview.embedId,
      platform: urlPreview.platform,
      thumbnail_url: urlPreview.thumbnail || null,
      category: 'dalat_review',
      uploaded_by: adminProfile?.id || null,
    });
    setSaving(false);
    if (error) { showToast('Lỗi khi lưu video. Thử lại!', 'error'); return; }
    resetForm();
    await fetchVideos();
    showToast('Đã thêm video review!');
  };

  // ── File select ──
  const handleFileSelect = (file: File) => {
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    const allowed = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/avi'];
    if (!allowed.includes(file.type)) {
      setUploadError('Chỉ hỗ trợ MP4, MOV, WebM, AVI');
      return;
    }
    if (file.size > maxSize) {
      setUploadError('File quá lớn. Tối đa 2GB');
      return;
    }
    setSelectedFile(file);
    setUploadError('');
    if (!uploadForm.title) {
      setUploadForm(f => ({ ...f, title: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // ── Save upload ──
  const handleSaveUpload = async () => {
    if (!uploadForm.title.trim()) { setUploadError('Vui lòng nhập tiêu đề'); return; }
    if (!selectedFile) { setUploadError('Vui lòng chọn file video'); return; }
    setSaving(true);
    setUploadProgress(0);

    const ext = selectedFile.name.split('.').pop();
    const fileName = `review-${Date.now()}.${ext}`;

    // Upload to storage
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('review-videos')
      .upload(fileName, selectedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadErr) {
      setSaving(false);
      setUploadError(`Lỗi upload: ${uploadErr.message}`);
      showToast('Upload thất bại!', 'error');
      return;
    }

    setUploadProgress(80);
    const { data: urlData } = supabase.storage.from('review-videos').getPublicUrl(fileName);
    const publicUrl = urlData?.publicUrl || '';

    const { error: dbErr } = await supabase.from('media_videos').insert({
      title: uploadForm.title.trim(),
      description: uploadForm.description.trim() || null,
      type: 'upload',
      url: publicUrl,
      file_name: fileName,
      file_size: selectedFile.size,
      platform: 'upload',
      category: 'dalat_review',
      uploaded_by: adminProfile?.id || null,
    });

    setSaving(false);
    setUploadProgress(100);

    if (dbErr) { showToast('Upload thành công nhưng lỗi lưu DB!', 'error'); return; }
    resetForm();
    await fetchVideos();
    showToast('Đã upload video thành công!');
  };

  const handleDelete = async (vid: ReviewVideo) => {
    if (!confirm(`Xóa video "${vid.title}"?`)) return;
    setDeleting(vid.id);

    // Delete from storage if uploaded
    if (vid.type === 'upload' && vid.file_name) {
      await supabase.storage.from('review-videos').remove([vid.file_name]);
    }

    await supabase.from('media_videos').delete().eq('id', vid.id);
    setDeleting(null);
    await fetchVideos();
    showToast('Đã xóa video.');
  };

  const getEmbedUrl = (vid: ReviewVideo) => {
    if (vid.platform === 'youtube' && vid.embed_id)
      return `https://www.youtube.com/embed/${vid.embed_id}`;
    if (vid.platform === 'vimeo' && vid.embed_id)
      return `https://player.vimeo.com/video/${vid.embed_id}`;
    return vid.url;
  };

  const getPlatformBadge = (vid: ReviewVideo) => {
    if (vid.platform === 'youtube') return { icon: 'ri-youtube-fill', color: 'bg-red-500', label: 'YT' };
    if (vid.platform === 'vimeo') return { icon: 'ri-vimeo-fill', color: 'bg-teal-500', label: 'Vimeo' };
    if (vid.type === 'upload') return { icon: 'ri-upload-cloud-line', color: 'bg-amber-500', label: 'Upload' };
    return null;
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-stone-800">Review Đà Lạt</h1>
            <p className="text-stone-500 text-xs md:text-sm mt-1">Quản lý video review kiểu Reels trên trang web</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`${showForm ? 'ri-close-line' : 'ri-add-line'} text-sm`} />
            </div>
            <span className="hidden sm:inline">{showForm ? 'Đóng' : 'Thêm video'}</span>
            <span className="sm:hidden">{showForm ? 'Đóng' : 'Thêm'}</span>
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4 mb-5 flex items-start gap-3">
          <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
            <i className="ri-information-line text-amber-600 text-sm" />
          </div>
          <div>
            <p className="text-amber-800 text-sm font-medium">
              Các video hiển thị ở trang <strong>/review-da-lat</strong>
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              Hỗ trợ nhúng YouTube / Vimeo hoặc tải video trực tiếp (tối đa 2GB)
            </p>
          </div>
        </div>

        {/* ── Add Form ── */}
        {showForm && (
          <div className="bg-white rounded-xl border border-stone-100 p-4 md:p-6 mb-6">
            {/* Form tabs */}
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1 mb-5 w-full sm:w-auto sm:inline-flex">
              <button
                onClick={() => setFormTab('embed')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  formTab === 'embed'
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-links-line text-sm" />
                </div>
                Nhúng YouTube / Vimeo
              </button>
              <button
                onClick={() => setFormTab('upload')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  formTab === 'upload'
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-upload-cloud-line text-sm" />
                </div>
                Tải video lên
              </button>
            </div>

            {/* ── Embed tab ── */}
            {formTab === 'embed' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-stone-800 text-sm">Nhúng video từ YouTube / Vimeo</h3>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Tiêu đề *</label>
                  <input
                    value={embedForm.title}
                    onChange={e => setEmbedForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="VD: Đà Lạt mùa hoa anh đào – tháng 2"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Link YouTube / Vimeo *</label>
                  <input
                    value={embedForm.url}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                  {urlPreview && (
                    <div className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                      {urlPreview.thumbnail && (
                        <img src={urlPreview.thumbnail} alt="thumb" className="w-16 h-10 object-cover rounded flex-shrink-0" />
                      )}
                      <div className="flex items-center gap-1.5">
                        <i className={`${urlPreview.platform === 'youtube' ? 'ri-youtube-fill text-red-500' : 'ri-vimeo-fill text-teal-500'} text-sm`} />
                        <span className="text-xs font-medium text-green-700 capitalize">
                          {urlPreview.platform} · URL hợp lệ!
                        </span>
                      </div>
                    </div>
                  )}
                  {embedError && <p className="text-red-500 text-xs mt-1">{embedError}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Mô tả ngắn (tuỳ chọn)</label>
                  <input
                    value={embedForm.description}
                    onChange={e => setEmbedForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="VD: Khám phá con phố cổ rực rỡ sắc màu..."
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSaveEmbed}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
                    {saving ? 'Đang lưu...' : 'Lưu video'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* ── Upload tab ── */}
            {formTab === 'upload' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-stone-800 text-sm">Tải video trực tiếp lên server</h3>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Tiêu đề *</label>
                  <input
                    value={uploadForm.title}
                    onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="VD: Đà Lạt về đêm lung linh ánh đèn"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Drop zone */}
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">
                    File video * <span className="text-stone-400 font-normal">(MP4, MOV, WebM, AVI – tối đa 2GB)</span>
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-amber-400 bg-amber-50'
                        : selectedFile
                        ? 'border-green-400 bg-green-50'
                        : 'border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                          <i className="ri-video-fill text-green-600 text-xl" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 truncate max-w-xs">{selectedFile.name}</p>
                          <p className="text-xs text-green-600">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                          className="text-xs text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Đổi file khác
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full">
                          <i className="ri-upload-cloud-2-line text-stone-400 text-2xl" />
                        </div>
                        <p className="text-sm text-stone-600 font-medium">Kéo thả video vào đây</p>
                        <p className="text-xs text-stone-400">hoặc click để chọn file</p>
                      </div>
                    )}
                  </div>
                  {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                </div>

                {/* Progress */}
                {saving && uploadProgress > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span>Đang upload...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Mô tả ngắn (tuỳ chọn)</label>
                  <input
                    value={uploadForm.description}
                    onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="VD: Cảnh đêm Đà Lạt rực rỡ ánh đèn màu..."
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSaveUpload}
                    disabled={saving || !selectedFile}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" />
                        Đang upload...
                      </>
                    ) : (
                      <>
                        <i className="ri-upload-cloud-line" />
                        Upload video
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    disabled={saving}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Video Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-100 py-16 text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-amber-50 rounded-full mx-auto mb-4">
              <i className="ri-video-line text-amber-400 text-3xl" />
            </div>
            <p className="text-stone-700 font-medium">Chưa có video review nào</p>
            <p className="text-stone-400 text-sm mt-1">Thêm YouTube/Vimeo hoặc upload video trực tiếp</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((vid, idx) => {
              const badge = getPlatformBadge(vid);
              return (
                <div key={vid.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-stone-900 overflow-hidden">
                    {vid.thumbnail_url ? (
                      <img
                        src={vid.thumbnail_url}
                        alt={vid.title}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-800">
                        <i className="ri-video-line text-stone-500 text-4xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        onClick={() => setPreviewId(previewId === vid.id ? null : vid.id)}
                        className="w-11 h-11 flex items-center justify-center bg-white/90 rounded-full cursor-pointer hover:scale-110 transition-transform"
                      >
                        <i className={`${previewId === vid.id ? 'ri-pause-fill' : 'ri-play-fill'} text-stone-800 text-lg`} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center bg-amber-500 rounded-full">
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                    {badge && (
                      <div className="absolute top-2 right-2">
                        <span className={`${badge.color} text-white text-xs px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1`}>
                          <i className={`${badge.icon} text-xs`} />
                          {badge.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Preview iframe */}
                  {previewId === vid.id && (
                    <div className="aspect-video bg-stone-900">
                      {vid.type === 'upload' ? (
                        <video
                          src={vid.url}
                          controls
                          autoPlay
                          className="w-full h-full"
                        />
                      ) : (
                        <iframe
                          src={getEmbedUrl(vid)}
                          title={vid.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    <p className="text-sm font-semibold text-stone-800 truncate">{vid.title}</p>
                    {vid.description && (
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{vid.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-stone-400">
                        {new Date(vid.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <button
                        onClick={() => handleDelete(vid)}
                        disabled={deleting === vid.id}
                        className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {deleting === vid.id
                          ? <i className="ri-loader-4-line animate-spin text-xs" />
                          : <i className="ri-delete-bin-line text-xs" />}
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && videos.length > 0 && (
          <p className="text-center text-stone-400 text-xs mt-5">{videos.length} video review</p>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-4 md:right-6 ${toastType === 'error' ? 'bg-red-600' : 'bg-stone-900'} text-white text-sm rounded-lg px-4 py-3 z-50 flex items-center gap-2 max-w-[90vw]`}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className={`${toastType === 'error' ? 'ri-error-warning-line text-red-200' : 'ri-checkbox-circle-line text-green-400'} text-sm`} />
          </div>
          {toastMsg}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReview;
