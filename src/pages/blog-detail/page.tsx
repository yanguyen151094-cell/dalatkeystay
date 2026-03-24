import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useSEO } from '../../hooks/useSEO';
import { blogPosts as mockPosts } from '../../mocks/blogPosts';
import { supabase } from '../../lib/supabase';

interface PostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
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

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-stone-800 mt-8 mb-4" style="font-family:\'Playfair Display\', serif">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-stone-800 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-stone-800">$1</strong>')
    .replace(/^\> (.+)$/gm, '<blockquote class="border-l-4 border-amber-400 pl-4 py-2 bg-amber-50 rounded-r-xl my-4 text-stone-700 text-sm italic">$1</blockquote>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex items-start gap-2 text-stone-600 text-sm mb-1"><i class="ri-checkbox-blank-line text-stone-300 mt-0.5 flex-shrink-0"></i><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex items-start gap-2 text-stone-600 text-sm mb-1"><i class="ri-checkbox-line text-emerald-500 mt-0.5 flex-shrink-0"></i><span>$1</span></li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-stone-600 text-sm mb-1 ml-4 list-decimal">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-stone-600 text-sm mb-1"><i class="ri-arrow-right-s-line text-amber-500 mt-0.5 flex-shrink-0"></i><span>$1</span></li>')
    .replace(/\|(.+)\|/g, (_match, cells) => {
      const cols = cells.split('|').map((c: string) => c.trim());
      if (cols.every((c: string) => c.replace(/-/g, '').trim() === '')) return '';
      const isHeader = cols.some((c: string) => !c.includes('-'));
      if (isHeader) {
        return `<tr>${cols.map((c: string) => `<th class="px-4 py-2 text-left text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-200">${c}</th>`).join('')}</tr>`;
      }
      return `<tr>${cols.map((c: string) => `<td class="px-4 py-2 text-sm text-stone-600 border border-stone-200">${c}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)+/g, (match) => `<div class="overflow-x-auto my-6"><table class="w-full border-collapse rounded-xl overflow-hidden">${match}</table></div>`)
    .replace(/\n\n/g, '</p><p class="text-stone-600 text-sm leading-relaxed mb-4">');
  return `<p class="text-stone-600 text-sm leading-relaxed mb-4">${html}</p>`;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData | null>(null);
  const [related, setRelated] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { navigate('/blog'); return; }

    const load = async () => {
      setLoading(true);

      // Try Supabase first
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (data) {
        const p: PostData = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          image: data.image_url || '',
          category: data.category,
          author: data.author,
          readTime: data.read_time,
          publishedAt: data.published_at || data.created_at,
          featured: data.is_featured,
          fromSupabase: true,
        };
        setPost(p);

        // Related from Supabase
        const { data: relData } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, image_url, category, author, read_time, published_at, created_at')
          .eq('is_published', true)
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);

        const relPosts: PostData[] = (relData || []).map((r) => ({
          id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt,
          image: r.image_url || '', category: r.category, author: r.author,
          readTime: r.read_time, publishedAt: r.published_at || r.created_at,
          fromSupabase: true, content: '',
        }));
        setRelated(relPosts.length >= 2 ? relPosts : [
          ...relPosts,
          ...mockPosts.filter((m) => m.category === data.category && m.slug !== slug)
            .slice(0, 3 - relPosts.length)
            .map((m) => ({ id: `mock-${m.id}`, slug: m.slug, title: m.title, excerpt: m.excerpt, image: m.image, category: m.category, author: m.author, readTime: m.readTime, publishedAt: m.publishedAt, content: m.content })),
        ]);
      } else {
        // Fallback to mock
        const found = mockPosts.find((p) => p.slug === slug);
        if (!found) { navigate('/blog'); return; }
        setPost({
          id: `mock-${found.id}`, slug: found.slug, title: found.title, excerpt: found.excerpt,
          content: found.content, image: found.image, category: found.category, author: found.author,
          authorAvatar: found.authorAvatar, readTime: found.readTime, publishedAt: found.publishedAt,
          tags: found.tags, featured: found.featured, fromSupabase: false,
        });
        const rel = mockPosts
          .filter((p) => p.id !== found.id && p.category === found.category).slice(0, 3);
        setRelated((rel.length >= 2 ? rel : mockPosts.filter((p) => p.id !== found.id).slice(0, 3))
          .map((p) => ({ id: `mock-${p.id}`, slug: p.slug, title: p.title, excerpt: p.excerpt, image: p.image, category: p.category, author: p.author, readTime: p.readTime, publishedAt: p.publishedAt, content: p.content })));
      }

      window.scrollTo(0, 0);
      setLoading(false);
    };

    load();
  }, [slug, navigate]);

  useSEO(
    post
      ? {
          title: `${post.title} | Blog Key Stay Đà Lạt`,
          description: post.excerpt,
          keywords: (post.tags || [post.category]).join(', '),
          canonical: `/blog/${post.slug}`,
          ogImage: post.image,
          ogType: 'article',
          structuredData: [
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              image: post.image,
              datePublished: post.publishedAt,
              dateModified: post.publishedAt,
              author: { '@type': 'Person', name: post.author },
              publisher: { '@type': 'Organization', name: 'Key Stay Đà Lạt', url: 'https://www.dalatkeystay.vn' },
              mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.dalatkeystay.vn/blog/${post.slug}` },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://www.dalatkeystay.vn/' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.dalatkeystay.vn/blog' },
                { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.dalatkeystay.vn/blog/${post.slug}` },
              ],
            },
          ],
        }
      : { title: 'Bài Viết | Key Stay Đà Lạt', canonical: '/blog' }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <div className="pt-32 flex items-center justify-center min-h-60">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-stone-500 text-sm">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero image */}
        {post.image && (
          <div className="relative h-80 overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-10">
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">
            <div className="p-8 pb-6">
              {/* Breadcrumb */}
              <nav className="mb-5">
                <ol className="flex items-center gap-1.5 text-xs text-stone-400">
                  <li><Link to="/" className="hover:text-stone-600 transition-colors">Trang chủ</Link></li>
                  <li><i className="ri-arrow-right-s-line"></i></li>
                  <li><Link to="/blog" className="hover:text-stone-600 transition-colors">Blog</Link></li>
                  <li><i className="ri-arrow-right-s-line"></i></li>
                  <li className="text-stone-500 truncate max-w-48">{post.title}</li>
                </ol>
              </nav>

              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-4">
                {post.category}
              </span>

              <h1
                className="text-3xl font-bold text-stone-800 leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {post.title}
              </h1>

              <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
                {post.authorAvatar ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-bold">{post.author.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-stone-700">{post.author}</p>
                  <p className="text-xs text-stone-400">{formatDate(post.publishedAt)} · {post.readTime} phút đọc</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.dalatkeystay.vn/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    <i className="ri-facebook-fill text-sm"></i>
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    <i className="ri-link text-sm"></i>
                  </button>
                </div>
              </div>

              <div
                className="prose max-w-none mt-6"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
              />

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-stone-100">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-amber-50 p-6 border-t border-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-xl flex-shrink-0">
                  <i className="ri-home-2-line text-amber-600 text-2xl"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-stone-800">Tìm nhà tại Đà Lạt ngay hôm nay</p>
                  <p className="text-xs text-stone-500">Key Stay có 200+ listing cho thuê và mua bán tại Đà Lạt</p>
                </div>
                <Link
                  to="/search"
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Xem ngay
                </Link>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12 mb-12">
              <h2
                className="text-xl font-bold text-stone-800 mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bài Viết Liên Quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-amber-200 transition-all cursor-pointer block"
                  >
                    {p.image && (
                      <div className="w-full h-36 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="text-xs text-amber-600 font-medium mb-1">{p.category}</p>
                      <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-stone-400 mt-2">{formatDate(p.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <i className="ri-article-line"></i>
                  Xem tất cả bài viết
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
