import { useState, useRef, ChangeEvent } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useAdminAuth } from '../../../../contexts/AdminAuthContext';

interface VideoUploadAreaProps {
  propertyId?: string;
  category: string;
  onUploaded: () => void;
}

type VideoMode = 'embed' | 'upload';

const extractYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
};

const extractVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const detectPlatform = (url: string): { platform: string; embedId: string; thumbnail: string } | null => {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      platform: 'youtube',
      embedId: ytId,
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    };
  }
  const viId = extractVimeoId(url);
  if (viId) {
    return {
      platform: 'vimeo',
      embedId: viId,
      thumbnail: '',
    };
  }
  return null;
};

const VideoUploadArea = ({ propertyId, category, onUploaded }: VideoUploadAreaProps) => {
  const { adminProfile } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<VideoMode>('embed');
  const [embedUrl, setEmbedUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ platform: string; embedId: string; thumbnail: string } | null>(null);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleEmbedUrlChange = (val: string) => {
    setEmbedUrl(val);
    setError('');
    if (val.trim()) {
      const info = detectPlatform(val);
      setPreview(info);
    } else {
      setPreview(null);
    }
  };

  const handleSaveEmbed = async () => {
    if (!title.trim()) { setError('Vui lòng nhập tiêu đề video'); return; }
    if (!embedUrl.trim()) { setError('Vui lòng nhập URL video'); return; }
    const info = detectPlatform(embedUrl);
    if (!info) { setError('URL không hợp lệ. Chỉ hỗ trợ YouTube và Vimeo.'); return; }
    setSaving(true);
    await supabase.from('media_videos').insert({
      title: title.trim(),
      type: 'embed',
      url: embedUrl.trim(),
      embed_id: info.embedId,
      platform: info.platform,
      thumbnail_url: info.thumbnail || null,
      category,
      property_id: propertyId || null,
      description: description.trim() || null,
      uploaded_by: adminProfile?.id || null,
    });
    setSaving(false);
    setEmbedUrl('');
    setTitle('');
    setDescription('');
    setPreview(null);
    onUploaded();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('video/'));
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(files.map(f => ({ name: f.name, status: 'uploading' })));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop() || 'mp4';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `videos/${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

      await supabase.from('media_videos').insert({
        title: file.name.replace(/\.[^.]+$/, ''),
        type: 'upload',
        url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        category,
        property_id: propertyId || null,
        uploaded_by: adminProfile?.id || null,
      });

      setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'done' } : p));
    }

    setUploading(false);
    e.target.value = '';
    setTimeout(() => { setUploadProgress([]); onUploaded(); }, 1200);
  };

  return (
    <div>
      {/* Mode tabs */}
      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1 w-fit mb-5">
        {(['embed', 'upload'] as VideoMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              mode === m ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {m === 'embed' ? (
              <span className="flex items-center gap-1.5">
                <i className="ri-youtube-line" /> Nhúng YouTube/Vimeo
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <i className="ri-upload-cloud-2-line" /> Upload video
              </span>
            )}
          </button>
        ))}
      </div>

      {mode === 'embed' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1.5">Tiêu đề video *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Video căn hộ view đẹp Đà Lạt"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1.5">Link YouTube / Vimeo *</label>
            <input
              value={embedUrl}
              onChange={e => handleEmbedUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
            {preview && (
              <div className="mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                {preview.thumbnail && (
                  <img src={preview.thumbnail} alt="thumb" className="w-16 h-10 object-cover rounded" />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <i className={`${preview.platform === 'youtube' ? 'ri-youtube-fill text-red-500' : 'ri-vimeo-fill text-teal-500'} text-sm`} />
                    <span className="text-xs font-medium text-green-700 capitalize">{preview.platform} · ID: {preview.embedId}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-0.5">URL hợp lệ, sẵn sàng lưu!</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1.5">Mô tả (tuỳ chọn)</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về video..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={handleSaveEmbed}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
            {saving ? 'Đang lưu...' : 'Lưu video'}
          </button>
        </div>
      )}

      {mode === 'upload' && (
        <div>
          <div
            onClick={() => !uploading && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer border-stone-200 hover:border-amber-300 hover:bg-stone-50 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-xl mx-auto mb-3">
              <i className="ri-video-upload-line text-amber-500 text-2xl" />
            </div>
            <p className="text-stone-700 font-medium text-sm mb-1">Kéo & thả video hoặc nhấn để chọn</p>
            <p className="text-stone-400 text-xs">MP4, MOV, AVI · Tối đa 2GB/video</p>
          </div>

          {uploadProgress.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {uploadProgress.map((p, i) => (
                <div key={i} className="flex items-center gap-3 bg-stone-50 rounded-lg px-3 py-2">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {p.status === 'uploading' && <i className="ri-loader-4-line text-amber-500 text-sm animate-spin" />}
                    {p.status === 'done' && <i className="ri-checkbox-circle-line text-green-500 text-sm" />}
                    {p.status === 'error' && <i className="ri-error-warning-line text-red-500 text-sm" />}
                  </div>
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
  );
};

export default VideoUploadArea;
