import { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

type State = 'idle' | 'submitting' | 'success' | 'error';

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function CommunityPostForm() {
  const [form, setForm] = useState({ author_name: '', author_contact: '', title: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const allowed = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    if (!allowed.includes(f.type)) { setErrorMsg('Chỉ hỗ trợ MP4, MOV, WebM, AVI'); return; }
    if (f.size > 500 * 1024 * 1024) { setErrorMsg('File tối đa 500MB'); return; }
    setErrorMsg('');
    setFile(f);
    if (!form.title) setForm(p => ({ ...p, title: f.name.replace(/\.[^/.]+$/, '') }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.author_name.trim()) { setErrorMsg('Vui lòng nhập tên'); return; }
    if (!form.title.trim()) { setErrorMsg('Vui lòng nhập tiêu đề'); return; }
    if (!file) { setErrorMsg('Vui lòng chọn file video'); return; }
    setErrorMsg('');
    setState('submitting');
    setProgress(10);

    const ext = file.name.split('.').pop();
    const fileName = `community-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('review-videos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (upErr) {
      setState('error');
      setErrorMsg(`Upload thất bại: ${upErr.message}`);
      setProgress(0);
      return;
    }

    setProgress(80);
    const { data: urlData } = supabase.storage.from('review-videos').getPublicUrl(fileName);
    const publicUrl = urlData?.publicUrl || '';

    const { error: dbErr } = await supabase.from('community_posts').insert({
      author_name: form.author_name.trim(),
      author_contact: form.author_contact.trim() || null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      video_url: publicUrl,
      video_platform: 'upload',
      status: 'pending',
    });

    setProgress(100);
    if (dbErr) { setState('error'); setErrorMsg('Lỗi lưu dữ liệu!'); return; }
    setState('success');
  };

  if (state === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-stone-100 p-8 flex flex-col items-center justify-center h-[420px] text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mb-4">
          <i className="ri-checkbox-circle-line text-green-500 text-3xl"></i>
        </div>
        <h3 className="text-stone-800 font-bold text-lg mb-2">Gửi thành công!</h3>
        <p className="text-stone-500 text-sm leading-relaxed max-w-xs mb-5">
          Video của bạn đã được gửi và đang chờ duyệt. Chúng tôi sẽ duyệt sớm nhất có thể!
        </p>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5">
          <i className="ri-time-line text-amber-600 text-sm"></i>
          <p className="text-amber-700 text-xs font-medium">Thường duyệt trong 24 giờ</p>
        </div>
        <button onClick={() => { setState('idle'); setFile(null); setProgress(0); setForm({ author_name: '', author_contact: '', title: '', description: '' }); }}
          className="text-sm text-amber-600 hover:text-amber-800 font-medium cursor-pointer">
          Gửi video khác
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 flex-shrink-0">
        <div className="w-8 h-8 flex items-center justify-center bg-rose-50 rounded-xl">
          <i className="ri-video-add-line text-rose-500 text-base"></i>
        </div>
        <div>
          <p className="text-stone-800 font-semibold text-sm">Đăng video review</p>
          <p className="text-stone-400 text-xs">Chia sẻ trải nghiệm Đà Lạt của bạn</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">Tên của bạn *</label>
            <input value={form.author_name} onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 block mb-1">Liên hệ (tuỳ chọn)</label>
            <input value={form.author_contact} onChange={e => setForm(p => ({ ...p, author_contact: e.target.value }))}
              placeholder="SĐT / Zalo"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">Tiêu đề video *</label>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="VD: Trải nghiệm homestay view đồi chè..."
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
        </div>

        {/* Upload zone */}
        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">
            File video * <span className="text-stone-400 font-normal">(MP4, MOV, WebM – tối đa 500MB)</span>
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDragging ? 'border-amber-400 bg-amber-50'
              : file ? 'border-green-400 bg-green-50'
              : 'border-stone-200 hover:border-amber-300 hover:bg-amber-50/40'
            }`}>
            <input ref={fileRef} type="file" accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
              className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
                  <i className="ri-video-fill text-green-600 text-lg"></i>
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-green-700 truncate max-w-[180px]">{file.name}</p>
                  <p className="text-xs text-green-600">{formatSize(file.size)}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setFile(null); }}
                  className="text-xs text-stone-400 hover:text-red-500 ml-1 cursor-pointer whitespace-nowrap">Đổi</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full">
                  <i className="ri-upload-cloud-2-line text-stone-400 text-xl"></i>
                </div>
                <p className="text-sm text-stone-600 font-medium">Kéo thả hoặc bấm chọn video</p>
                <p className="text-xs text-stone-400">MP4, MOV, WebM, AVI</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-stone-500 block mb-1">Mô tả ngắn</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Chia sẻ cảm nhận, địa điểm, tip cho khách..." rows={2} maxLength={500}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-stone-100 flex-shrink-0">
        {errorMsg && <p className="text-red-500 text-xs mb-2 flex items-center gap-1"><i className="ri-error-warning-line"></i>{errorMsg}</p>}
        {state === 'submitting' && progress > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-stone-500 mb-1"><span>Đang upload...</span><span>{progress}%</span></div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        <button onClick={handleSubmit} disabled={state === 'submitting'}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap">
          {state === 'submitting'
            ? <><i className="ri-loader-4-line animate-spin"></i>Đang upload...</>
            : <><i className="ri-upload-cloud-line"></i>Gửi video review</>}
        </button>
      </div>
    </div>
  );
}
