import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { blogCategories } from '../../../../mocks/blogPosts';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  read_time: number;
  is_published: boolean;
  is_featured: boolean;
}

interface BlogFormModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = blogCategories.filter((c) => c !== 'Tất cả');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogFormModal({ post, onClose, onSaved }: BlogFormModalProps) {
  const isEdit = !!post?.id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'preview'>('info');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogPost, string>>>({});

  const [form, setForm] = useState<BlogPost>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image_url: post?.image_url || '',
    category: post?.category || CATEGORIES[0],
    author: post?.author || 'Key Stay Đà Lạt',
    read_time: post?.read_time || 5,
    is_published: post?.is_published ?? false,
    is_featured: post?.is_featured ?? false,
  });

  const [slugTouched, setSlugTouched] = useState(isEdit);

  const setField = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  useEffect(() => {
    if (!slugTouched && form.title) {
      setField('slug', slugify(form.title));
    }
  }, [form.title, slugTouched]);

  useEffect(() => {
    const rt = estimateReadTime(form.content);
    setField('read_time', rt);
  }, [form.content]);

  function validate(): boolean {
    const e: Partial<Record<keyof BlogPost, string>> = {};
    if (!form.title.trim()) e.title = 'Tiêu đề không được để trống';
    if (!form.slug.trim()) e.slug = 'Slug không được để trống';
    if (!form.excerpt.trim()) e.excerpt = 'Tóm tắt không được để trống';
    if (!form.content.trim()) e.content = 'Nội dung không được để trống';
    if (form.excerpt.length > 300) e.excerpt = 'Tóm tắt tối đa 300 ký tự';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) {
      setActiveTab('info');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', post!.id));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    }

    setSaving(false);
    if (!error) {
      onSaved();
    } else {
      if (error.message.includes('slug')) {
        setErrors((e) => ({ ...e, slug: 'Slug này đã tồn tại, hãy đổi slug khác' }));
        setActiveTab('info');
      }
    }
  }

  function insertMarkdown(prefix: string, suffix = '') {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.content.substring(start, end);
    const newContent =
      form.content.substring(0, start) +
      prefix +
      (selected || 'text') +
      suffix +
      form.content.substring(end);
    setField('content', newContent);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
    }, 0);
  }

  function renderPreview(md: string): string {
    return md
      .replace(/^## (.+)$/gm, '<h2 style="font-size:1.25rem;font-weight:700;margin:1.5rem 0 0.75rem;color:#1c1917">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1rem;font-weight:600;margin:1.25rem 0 0.5rem;color:#292524">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600;color:#1c1917">$1</strong>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #f59e0b;padding:0.5rem 1rem;background:#fffbeb;margin:0.75rem 0;border-radius:0 8px 8px 0;font-style:italic;color:#44403c">$1</blockquote>')
      .replace(/^\d+\. (.+)$/gm, '<li style="margin:0.25rem 0 0.25rem 1.5rem;list-style:decimal;color:#57534e">$1</li>')
      .replace(/^- (.+)$/gm, '<li style="margin:0.25rem 0 0.25rem 1.5rem;color:#57534e">• $1</li>')
      .replace(/\n\n/g, '</p><p style="margin:0.5rem 0;color:#57534e;font-size:0.875rem;line-height:1.7">')
      .replace(/^(?!<[hbld])(.+)$/gm, (l) => l.startsWith('<') ? l : l);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-lg">
              <i className="ri-article-line text-amber-600 text-base"></i>
            </div>
            <div>
              <h2 className="font-bold text-stone-800 text-base">
                {isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h2>
              <p className="text-xs text-stone-400">
                {isEdit ? `Đang chỉnh sửa: ${post?.title?.substring(0, 40)}...` : 'Tạo bài viết blog mới'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Published toggle */}
            <button
              onClick={() => setField('is_published', !form.is_published)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                form.is_published
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              <i className={`ri-${form.is_published ? 'eye' : 'eye-off'}-line`}></i>
              {form.is_published ? 'Đang xuất bản' : 'Bản nháp'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100 px-6">
          {[
            { id: 'info', label: 'Thông tin', icon: 'ri-information-line' },
            { id: 'content', label: 'Nội dung', icon: 'ri-edit-box-line' },
            { id: 'preview', label: 'Xem trước', icon: 'ri-eye-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
              {tab.id === 'info' && Object.values(errors).some(Boolean) && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Tiêu đề <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="Top 5 Khu Vực Cho Thuê Nhà Đẹp Nhất Đà Lạt 2026"
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.title ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-stone-50'
                  }`}
                />
                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Slug (URL) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 bg-stone-100 px-3 py-2.5 rounded-l-xl border border-r-0 border-stone-200 whitespace-nowrap">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setField('slug', slugify(e.target.value));
                    }}
                    placeholder="top-5-khu-vuc-cho-thue-nha-dep"
                    className={`flex-1 px-4 py-2.5 text-sm border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                      errors.slug ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-stone-50'
                    }`}
                  />
                </div>
                {errors.slug && <p className="text-xs text-rose-500 mt-1">{errors.slug}</p>}
                {!errors.slug && (
                  <p className="text-xs text-stone-400 mt-1">Tự động tạo từ tiêu đề. Có thể chỉnh sửa.</p>
                )}
              </div>

              {/* Category + Author */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Tác giả</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setField('author', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">URL Ảnh bìa</label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setField('image_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50"
                />
                {form.image_url && (
                  <div className="mt-2 w-full h-40 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Tóm tắt <span className="text-rose-500">*</span>
                  <span className="font-normal text-stone-400 ml-2">({form.excerpt.length}/300)</span>
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setField('excerpt', e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết, hiển thị trong danh sách blog..."
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none ${
                    errors.excerpt ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-stone-50'
                  }`}
                />
                {errors.excerpt && <p className="text-xs text-rose-500 mt-1">{errors.excerpt}</p>}
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setField('is_featured', !form.is_featured)}
                    className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${
                      form.is_featured ? 'bg-amber-500' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.is_featured ? 'left-5' : 'left-1'}`}></div>
                  </div>
                  <span className="text-sm text-stone-700">Bài viết nổi bật</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setField('is_published', !form.is_published)}
                    className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${
                      form.is_published ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.is_published ? 'left-5' : 'left-1'}`}></div>
                  </div>
                  <span className="text-sm text-stone-700">Xuất bản ngay</span>
                </label>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <div>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 mb-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
                {[
                  { label: 'H2', action: () => insertMarkdown('\n## ', '') },
                  { label: 'H3', action: () => insertMarkdown('\n### ', '') },
                  { icon: 'ri-bold', action: () => insertMarkdown('**', '**') },
                  { icon: 'ri-list-ordered', action: () => insertMarkdown('\n1. ', '') },
                  { icon: 'ri-list-unordered', action: () => insertMarkdown('\n- ', '') },
                  { icon: 'ri-double-quotes-l', action: () => insertMarkdown('\n> ', '') },
                  { icon: 'ri-link', action: () => insertMarkdown('[', '](url)') },
                  { icon: 'ri-image-line', action: () => insertMarkdown('![alt](', ')') },
                ].map((btn, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={btn.action}
                    className="px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-white hover:text-stone-800 rounded-lg transition-all cursor-pointer border border-transparent hover:border-stone-200"
                  >
                    {btn.label || <i className={btn.icon}></i>}
                  </button>
                ))}
                <div className="ml-auto text-xs text-stone-400 pr-2">
                  ~{form.read_time} phút đọc
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(e) => setField('content', e.target.value)}
                rows={22}
                placeholder={`## Tiêu đề chính\n\nNội dung đoạn văn đầu tiên...\n\n### Tiêu đề phụ\n\n- Điểm 1\n- Điểm 2\n\n> Đây là trích dẫn nổi bật\n\n**Từ khóa quan trọng** sẽ được in đậm.`}
                className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none font-mono leading-relaxed ${
                  errors.content ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-stone-50'
                }`}
                style={{ minHeight: '420px' }}
              />
              {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}

              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-700 font-medium mb-1">Hướng dẫn Markdown:</p>
                <div className="grid grid-cols-2 gap-x-4 text-xs text-amber-600">
                  <span><code className="bg-amber-100 px-1 rounded">## Tiêu đề</code> → Heading 2</span>
                  <span><code className="bg-amber-100 px-1 rounded">**in đậm**</code> → <strong>in đậm</strong></span>
                  <span><code className="bg-amber-100 px-1 rounded">- item</code> → Danh sách</span>
                  <span><code className="bg-amber-100 px-1 rounded">&gt; quote</code> → Trích dẫn</span>
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW TAB */}
          {activeTab === 'preview' && (
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              {form.image_url && (
                <div className="w-full h-52 overflow-hidden">
                  <img src={form.image_url} alt={form.title} className="w-full h-full object-cover object-top" />
                </div>
              )}
              <div className="p-6">
                {form.category && (
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-3">
                    {form.category}
                  </span>
                )}
                <h1 className="text-2xl font-bold text-stone-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {form.title || 'Tiêu đề bài viết'}
                </h1>
                <p className="text-stone-500 text-sm mb-4 italic">{form.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-stone-400 mb-5 pb-4 border-b border-stone-100">
                  <span>{form.author}</span>
                  <span>·</span>
                  <span>{form.read_time} phút đọc</span>
                  {form.is_featured && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Nổi bật</span>}
                  {form.is_published ? (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Đã xuất bản</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">Bản nháp</span>
                  )}
                </div>
                <div
                  className="text-sm text-stone-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderPreview(form.content || '_Chưa có nội dung_') }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50 rounded-b-2xl">
          <div className="text-xs text-stone-400">
            {form.content && <span>{form.content.trim().split(/\s+/).length} từ</span>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-stone-200 text-stone-600 text-sm rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={() => { setField('is_published', false); handleSave(); }}
              disabled={saving}
              className="px-5 py-2 bg-stone-600 text-white text-sm rounded-xl hover:bg-stone-700 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              Lưu nháp
            </button>
            <button
              onClick={() => { setField('is_published', true); setTimeout(handleSave, 0); }}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {saving ? (
                <><i className="ri-loader-4-line animate-spin"></i> Đang lưu...</>
              ) : (
                <><i className="ri-send-plane-line"></i> {isEdit ? 'Cập nhật' : 'Xuất bản'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
