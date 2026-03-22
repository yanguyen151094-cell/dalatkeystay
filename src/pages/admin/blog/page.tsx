import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import BlogFormModal from './components/BlogFormModal';
import { blogCategories } from '../../../mocks/blogPosts';

interface BlogPost {
  id: string;
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
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = blogCategories.filter((c) => c !== 'Tất cả');

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const AdminBlog = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    setDeleteConfirm(null);
    showToast('Đã xóa bài viết!');
    fetchPosts();
  };

  const handleTogglePublish = async (post: BlogPost) => {
    setTogglingId(post.id);
    await supabase.from('blog_posts').update({
      is_published: !post.is_published,
      published_at: !post.is_published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', post.id);
    showToast(post.is_published ? 'Đã chuyển sang bản nháp' : 'Đã xuất bản!');
    fetchPosts();
    setTogglingId(null);
  };

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || p.category === filterCategory;
    const matchStatus = !filterStatus || (filterStatus === 'published' ? p.is_published : !p.is_published);
    return matchSearch && matchCat && matchStatus;
  });

  const publishedCount = posts.filter((p) => p.is_published).length;
  const draftCount = posts.filter((p) => !p.is_published).length;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Quản lý Blog</h1>
            <p className="text-stone-500 text-sm mt-1">
              {publishedCount} đã xuất bản · {draftCount} bản nháp
            </p>
          </div>
          <button
            onClick={() => { setEditingPost(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line text-base" /></div>
            Thêm bài viết
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tổng bài viết', value: posts.length, icon: 'ri-article-line', color: 'text-stone-600', bg: 'bg-stone-100' },
            { label: 'Đã xuất bản', value: publishedCount, icon: 'ri-eye-line', color: 'text-emerald-700', bg: 'bg-emerald-100' },
            { label: 'Bản nháp', value: draftCount, icon: 'ri-draft-line', color: 'text-amber-700', bg: 'bg-amber-100' },
            { label: 'Nổi bật', value: posts.filter((p) => p.is_featured).length, icon: 'ri-star-line', color: 'text-rose-600', bg: 'bg-rose-100' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${stat.bg}`}>
                  <i className={`${stat.icon} ${stat.color} text-xl`}></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
                  <p className="text-xs text-stone-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 mb-5 bg-stone-100 p-1 rounded-xl w-fit">
          {[
            { value: '', label: 'Tất cả', count: posts.length },
            { value: 'published', label: 'Đã xuất bản', count: publishedCount },
            { value: 'draft', label: 'Bản nháp', count: draftCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === tab.value
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filterStatus === tab.value ? 'bg-stone-100 text-stone-600' : 'bg-stone-200 text-stone-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <div className="w-9 h-9 flex items-center justify-center absolute left-0 top-0">
              <i className="ri-search-line text-stone-400 text-sm" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-500 bg-white"
              placeholder="Tìm theo tiêu đề, tác giả..."
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 bg-white cursor-pointer"
          >
            <option value="">Tất cả danh mục</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || filterCategory || filterStatus) && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterStatus(''); }}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-refresh-line"></i> Xóa lọc
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full mx-auto mb-3">
                <i className="ri-article-line text-stone-400 text-xl" />
              </div>
              <p className="text-stone-500 text-sm font-medium mb-1">
                {posts.length === 0 ? 'Chưa có bài viết nào' : 'Không tìm thấy bài viết'}
              </p>
              <p className="text-stone-400 text-xs">
                {posts.length === 0 ? 'Nhấn "Thêm bài viết" để tạo bài đầu tiên' : 'Thử điều chỉnh bộ lọc'}
              </p>
              {posts.length === 0 && (
                <button
                  onClick={() => { setEditingPost(null); setShowModal(true); }}
                  className="mt-4 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg cursor-pointer hover:bg-amber-600"
                >
                  Tạo bài viết đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Bài viết</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Danh mục</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Trạng thái</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Ngày</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post) => (
                    <tr key={post.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {post.image_url ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100">
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-lg flex-shrink-0">
                              <i className="ri-image-line text-stone-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-stone-800 truncate max-w-64">{post.title}</p>
                              {post.is_featured && (
                                <span className="flex-shrink-0">
                                  <i className="ri-star-fill text-amber-400 text-xs"></i>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-400 truncate max-w-64">{post.author} · {post.read_time} phút</p>
                            <p className="text-xs text-stone-300 truncate max-w-64">/blog/{post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleTogglePublish(post)}
                          disabled={togglingId === post.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            post.is_published
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          {togglingId === post.id ? (
                            <i className="ri-loader-4-line animate-spin"></i>
                          ) : (
                            <i className={`ri-${post.is_published ? 'eye' : 'eye-off'}-line`}></i>
                          )}
                          {post.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-stone-500 text-xs">
                        {post.published_at ? (
                          <span>{formatDate(post.published_at)}</span>
                        ) : (
                          <span className="text-stone-300">Chưa xuất bản</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all cursor-pointer"
                            title="Xem bài viết"
                          >
                            <i className="ri-external-link-line text-sm" />
                          </a>
                          <button
                            onClick={() => { setEditingPost(post); setShowModal(true); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 hover:text-amber-600 transition-all cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <i className="ri-pencil-line text-sm" />
                          </button>
                          {isSuperAdmin && (
                            <button
                              onClick={() => setDeleteConfirm(post.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-all cursor-pointer"
                              title="Xóa"
                            >
                              <i className="ri-delete-bin-line text-sm" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Usage hint */}
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-lightbulb-line text-amber-500"></i>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Bài viết từ Admin sẽ hiển thị trên trang Blog</strong> và được ưu tiên hơn mock data mẫu. 
            Bài viết có trạng thái "Đã xuất bản" mới hiện với khách hàng. Hỗ trợ viết nội dung theo định dạng Markdown.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <BlogFormModal
          post={editingPost}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchPosts();
            showToast(editingPost ? 'Đã cập nhật bài viết!' : 'Đã thêm bài viết mới!');
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-xl" />
            </div>
            <h3 className="text-center font-semibold text-stone-800 mb-2">Xác nhận xóa</h3>
            <p className="text-center text-stone-500 text-sm mb-6">
              Bài viết sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-stone-200 text-stone-600 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap"
              >
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-4 py-3 rounded-lg text-sm flex items-center gap-2 z-50">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-check-line text-emerald-400" />
          </div>
          {toast}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;
