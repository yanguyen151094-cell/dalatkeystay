import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { supabase } from '../../../../lib/supabase';
import { useAdminAuth } from '../../../../contexts/AdminAuthContext';

interface UploadAreaProps {
  category: 'property' | 'banner' | 'general';
  propertyId?: string;
  onUploaded: () => void;
}

const UploadArea = ({ category, propertyId, onUploaded }: UploadAreaProps) => {
  const { adminProfile } = useAdminAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([]);
  const [storageError, setStorageError] = useState(false);

  const uploadFiles = async (files: File[]) => {
    const images = files.filter(f => f.type.startsWith('image/'));
    if (!images.length) return;
    setUploading(true);
    setStorageError(false);
    setProgress(images.map(f => ({ name: f.name, status: 'uploading' })));

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'error' } : p));
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
          setStorageError(true);
        }
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

      await supabase.from('media_images').insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        url: publicUrl,
        category,
        property_id: propertyId || null,
        uploaded_by: adminProfile?.id || null,
      });

      setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, status: 'done' } : p));
    }

    setUploading(false);
    setTimeout(() => {
      setProgress([]);
      onUploaded();
    }, 1200);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  return (
    <div className="mb-6">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragging ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
        } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-xl mx-auto mb-3">
          <i className="ri-upload-cloud-2-line text-amber-500 text-2xl" />
        </div>
        <p className="text-stone-700 font-medium text-sm mb-1">
          {dragging ? 'Thả ảnh vào đây...' : 'Kéo & thả ảnh vào đây'}
        </p>
        <p className="text-stone-400 text-xs">Hoặc nhấn để chọn file · PNG, JPG, WEBP · Tối đa 10MB/ảnh</p>
      </div>

      {storageError && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-red-700 text-xs font-medium mb-1">Chưa tạo Storage Bucket!</p>
          <p className="text-red-600 text-xs">
            Vào Supabase Dashboard → Storage → New bucket → Đặt tên là <strong>media</strong> → Public bucket → Tạo.
            Sau đó upload lại.
          </p>
        </div>
      )}

      {progress.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {progress.map((p, i) => (
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
  );
};

export default UploadArea;
