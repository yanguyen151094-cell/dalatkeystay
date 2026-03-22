import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useSEO } from '../../hooks/useSEO';
import { blogPosts as mockPosts, blogCategories, type BlogPost as MockBlogPost } from '../../mocks/blogPosts';
import { supabase } from '../../lib/supabase';

interface CombinedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  authorAvatar?: string;
  readTime: number;
  publishedAt: string;
  tags?: string[];
  featured?: boolean;
  fromSupabase?: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function mockToCombined(p: MockBlogPost): CombinedPost {
  return {
    id: `mock-${p.id}`,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    image: p.image,
    category: p.category,
    author: p.author,
    authorAvatar: p.authorAvatar,
    readTime: p.readTime,
    publishedAt: p.publishedAt,
    tags: p.tags,
    featured: p.featured,
    fromSupabase: false,
  };
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<CombinedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Blog Bất Động Sản Đà Lạt – Tin Tức & Kinh Nghiệm | Key Stay',
    description: 'Cập nhật tin tức thị trường bất động sản Đà Lạt, kinh nghiệm thuê nhà, homestay và mua bán căn hộ từ chuyên gia Key Stay Đà Lạt.',
    keywords: 'blog bất động sản Đà Lạt, tin tức Đà Lạt, kinh nghiệm thuê nhà Đà Lạt, homestay Đà Lạt mới nhất',
    canonical: '/blog',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog Key Stay Đà Lạt',
      url: 'https://www.dalatkeystay.vn/blog',
      description: 'Tin tức và kinh nghiệm bất động sản Đà Lạt',
      publisher: {
        '@type': 'Organization',
        name: 'Key Stay Đà Lạt',
        url: 'https://www.dalatkeystay.vn',
      },
    },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, image_url, category, author, read_time, is_featured, published_at, created_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      const supabasePosts: CombinedPost[] = (data || []).map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        image: p.image_url || '',
        category: p.category,
        author: p.author,
        readTime: p.read_time,
        publishedAt: p.published_at || p.created_at,
        featured: p.is_featured,
        fromSupabase: true,
      }));

      // Merge: Supabase posts first, then mock posts (deduplicate by slug)
      const supabaseSlugs = new Set(supabasePosts.map((p) => p.slug));
      const filteredMock = mockPosts
        .filter((p) => !supabaseSlugs.has(p.slug))
        .map(mockToCombined);

      setAllPosts([...supabasePosts, ...filteredMock]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = allPosts.filter((post) => {
    const matchCat = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = allPosts.filter((p) => p.featured).slice(0, 2);
  const showFeatured = selectedCategory === 'Tất cả' && !searchQuery && !loading;

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero */}
        <div className="bg-stone-800 py-14 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-medium mb-4">
              <i className="ri-article-line"></i>
              Kiến thức bất động sản
            </span>
            <h1
              className="text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Blog & Tin Tức Đà Lạt
            </h1>
            <p className="text-stone-400 text-base mb-6 max-w-xl mx-auto">
              Kinh nghiệm, thị trường và hướng dẫn chuyên sâu về bất động sản Đà Lạt từ đội ngũ Key Stay
            </p>
            <div className="relative max-w-md mx-auto">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"></i>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-stone-700 border border-stone-600 rounded-xl text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="sticky top-16 z-30 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto py-3">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden border border-stone-100">
                  <div className="h-48 bg-stone-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-stone-200 rounded w-1/3"></div>
                    <div className="h-4 bg-stone-200 rounded w-full"></div>
                    <div className="h-4 bg-stone-100 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {showFeatured && featured.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-5">
                    Bài viết nổi bật
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featured.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group relative overflow-hidden rounded-2xl cursor-pointer block"
                      >
                        <div className="w-full h-72">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <span className="inline-block px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full mb-3">
                            {post.category}
                          </span>
                          <h3
                            className="text-white font-bold text-xl leading-tight mb-2 group-hover:text-amber-300 transition-colors"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-3 text-white/70 text-xs">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span>·</span>
                            <span>{post.readTime} phút đọc</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All posts */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest">
                    {searchQuery
                      ? `Kết quả cho "${searchQuery}"`
                      : selectedCategory === 'Tất cả'
                      ? 'Tất cả bài viết'
                      : selectedCategory}
                  </h2>
                  <span className="text-stone-400 text-sm">{filtered.length} bài viết</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-stone-100 rounded-full">
                      <i className="ri-article-line text-stone-400 text-3xl"></i>
                    </div>
                    <p className="text-stone-600 font-medium">Không tìm thấy bài viết phù hợp</p>
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('Tất cả'); }}
                      className="mt-4 px-5 py-2 bg-amber-600 text-white text-sm rounded-xl cursor-pointer hover:bg-amber-700"
                    >
                      Xem tất cả
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-amber-200 transition-all cursor-pointer block"
                      >
                        <div className="w-full h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full mb-3">
                            {post.category}
                          </span>
                          <h3
                            className="font-bold text-stone-800 text-base leading-snug mb-2 group-hover:text-amber-700 transition-colors line-clamp-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {post.title}
                          </h3>
                          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                            {post.authorAvatar ? (
                              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                                <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-amber-700 font-bold text-xs">
                                  {post.author.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-stone-700 truncate">{post.author}</p>
                              <p className="text-xs text-stone-400">{formatDate(post.publishedAt)} · {post.readTime} phút</p>
                            </div>
                            <i className="ri-arrow-right-line text-stone-300 group-hover:text-amber-500 transition-colors"></i>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 bg-amber-600 rounded-2xl p-10 text-center">
            <h3
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nhận tin tức bất động sản Đà Lạt mỗi tuần
            </h3>
            <p className="text-amber-100 text-sm mb-6 max-w-md mx-auto">
              Cập nhật thị trường, giá thuê nhà mới nhất và những bài viết chuyên sâu từ Key Stay Đà Lạt.
            </p>
            <div className="flex gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white text-stone-800 focus:outline-none"
              />
              <button className="px-5 py-2.5 bg-stone-800 text-white text-sm font-semibold rounded-xl hover:bg-stone-900 transition-colors cursor-pointer whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
