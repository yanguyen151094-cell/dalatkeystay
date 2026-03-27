import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../../../lib/supabase';

interface CommunityPost {
  id: string;
  author_name: string;
  author_contact: string | null;
  title: string;
  description: string | null;
  video_url: string | null;
  video_platform: string | null;
  video_embed_id: string | null;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
}

interface ChatMsg {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

export default function AdminCommunity() {
  const [tab, setTab] = useState<'posts' | 'chat'>('posts');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [chats, setChats] = useState<ChatMsg[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const q = supabase.from('community_posts').select('*').order('created_at', { ascending: false });
    const { data } = filter === 'all' ? await q : await q.eq('status', filter);
    setPosts((data as CommunityPost[]) || []);
    setLoading(false);
  }, [filter]);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('community_chat').select('*').order('created_at', { ascending: false }).limit(100);
    setChats((data as ChatMsg[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'posts') fetchPosts();
    else fetchChats();
  }, [tab, fetchPosts, fetchChats]);

  const updateStatus = async (id: string, status: string) => {
    setActing(id);
    await supabase.from('community_posts').update({ status }).eq('id', id);
    setActing(null);
    showToast(status === 'approved' ? 'Đã duyệt bài!' : 'Đã từ chối!');
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Xóa bài này?')) return;
    setActing(id);
    await supabase.from('community_posts').delete().eq('id', id);
    setActing(null);
    showToast('Đã xóa bài!');
    fetchPosts();
  };

  const deleteChat = async (id: string) => {
    setActing(id);
    await supabase.from('community_chat').delete().eq('id', id);
    setActing(null);
    showToast('Đã xóa tin nhắn!');
    fetchChats();
  };

  const statusBadge = (s: string) => {
    if (s === 'approved') return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Đã duyệt</span>;
    if (s === 'rejected') return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Từ chối</span>;
    return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Chờ duyệt</span>;
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-stone-800">Cộng đồng</h1>
          <p className="text-stone-500 text-sm mt-1">Quản lý bài đăng & chat của người dùng</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6 w-full sm:w-auto sm:inline-flex">
          <button onClick={() => setTab('posts')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${tab === 'posts' ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}>
            <i className="ri-video-add-line"></i>Bài đăng
          </button>
          <button onClick={() => setTab('chat')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${tab === 'chat' ? 'bg-white text-stone-800' : 'text-stone-500 hover:text-stone-700'}`}>
            <i className="ri-chat-3-line"></i>Chat
          </button>
        </div>

        {/* Posts Tab */}
        {tab === 'posts' && (
          <>
            <div className="flex flex-wrap gap-2 mb-5">
              {(['pending','approved','rejected','all'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${filter === f ? 'bg-amber-500 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300'}`}>
                  {f === 'pending' ? 'Chờ duyệt' : f === 'approved' ? 'Đã duyệt' : f === 'rejected' ? 'Từ chối' : 'Tất cả'}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-100 py-16 text-center">
                <i className="ri-inbox-line text-stone-300 text-4xl block mb-3"></i>
                <p className="text-stone-500 text-sm">Không có bài nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-xl border border-stone-100 p-4 flex flex-col sm:flex-row gap-4">
                    {post.thumbnail_url && (
                      <img src={post.thumbnail_url} alt={post.title} className="w-full sm:w-28 h-20 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{post.title}</p>
                          <p className="text-stone-500 text-xs mt-0.5">
                            <i className="ri-user-line mr-1"></i>{post.author_name}
                            {post.author_contact && <span className="ml-2 text-stone-400">• {post.author_contact}</span>}
                          </p>
                          {post.description && <p className="text-stone-500 text-xs mt-1 line-clamp-2">{post.description}</p>}
                          {post.video_url && (
                            <a href={post.video_url} target="_blank" rel="nofollow noopener noreferrer"
                              className="text-xs text-amber-600 hover:underline mt-1 flex items-center gap-1 cursor-pointer">
                              <i className="ri-youtube-fill text-red-500"></i>Xem video
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                          {statusBadge(post.status)}
                          <span className="text-stone-400 text-xs">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {post.status !== 'approved' && (
                          <button onClick={() => updateStatus(post.id, 'approved')} disabled={acting === post.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60">
                            <i className="ri-checkbox-circle-line"></i>Duyệt
                          </button>
                        )}
                        {post.status !== 'rejected' && (
                          <button onClick={() => updateStatus(post.id, 'rejected')} disabled={acting === post.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60">
                            <i className="ri-close-circle-line"></i>Từ chối
                          </button>
                        )}
                        <button onClick={() => deletePost(post.id)} disabled={acting === post.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60">
                          {acting === post.id ? <i className="ri-loader-4-line animate-spin text-xs"></i> : <i className="ri-delete-bin-line"></i>}
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Chat Tab */}
        {tab === 'chat' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : chats.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-100 py-16 text-center">
                <i className="ri-chat-3-line text-stone-300 text-4xl block mb-3"></i>
                <p className="text-stone-500 text-sm">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map(msg => (
                  <div key={msg.id} className="bg-white rounded-xl border border-stone-100 px-4 py-3 flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
                      <span className="text-amber-700 text-xs font-bold">{msg.author_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-800 text-sm font-semibold truncate">{msg.author_name}</p>
                      <p className="text-stone-600 text-sm truncate">{msg.message}</p>
                    </div>
                    <span className="text-stone-400 text-xs whitespace-nowrap flex-shrink-0">
                      {new Date(msg.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </span>
                    <button onClick={() => deleteChat(msg.id)} disabled={acting === msg.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 disabled:opacity-60">
                      {acting === msg.id ? <i className="ri-loader-4-line animate-spin text-xs"></i> : <i className="ri-delete-bin-line text-xs"></i>}
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white text-sm rounded-lg px-4 py-3 z-50 flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-green-400"></i>{toast}
        </div>
      )}
    </AdminLayout>
  );
}
