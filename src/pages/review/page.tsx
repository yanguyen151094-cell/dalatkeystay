import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

interface ReviewVideo {
  id: string;
  title: string;
  description: string | null;
  platform: string | null;
  embed_id: string | null;
  thumbnail_url: string | null;
  url: string;
  type: string;
}

const getEmbedUrl = (vid: ReviewVideo) => {
  if (vid.platform === 'youtube' && vid.embed_id)
    return `https://www.youtube.com/embed/${vid.embed_id}?autoplay=1&rel=0&modestbranding=1`;
  if (vid.platform === 'vimeo' && vid.embed_id)
    return `https://player.vimeo.com/video/${vid.embed_id}?autoplay=1`;
  return vid.url;
};

const getThumbnail = (vid: ReviewVideo) => {
  if (vid.thumbnail_url) return vid.thumbnail_url;
  if (vid.platform === 'youtube' && vid.embed_id)
    return `https://img.youtube.com/vi/${vid.embed_id}/hqdefault.jpg`;
  return '';
};

const ReviewPage = () => {
  const [videos, setVideos] = useState<ReviewVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('media_videos')
      .select('id, title, description, platform, embed_id, thumbnail_url, url')
      .eq('category', 'dalat_review')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setVideos((data as ReviewVideo[]) || []);
        setLoading(false);
      });
  }, []);

  const goTo = (idx: number) => {
    setActiveIdx(idx);
    setPlaying(false);
  };

  const prev = () => { if (activeIdx > 0) goTo(activeIdx - 1); };
  const next = () => { if (activeIdx < videos.length - 1) goTo(activeIdx + 1); };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const activeVideo = videos[activeIdx];

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />

      {/* Hero */}
      <div className="pt-16">
        <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 py-16 px-6 text-center">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://readdy.ai/api/search-image?query=Dalat%20Vietnam%20misty%20mountain%20valley%20at%20dawn%20with%20pine%20forests%20and%20flower%20fields%2C%20cinematic%20aerial%20landscape%20photography%2C%20moody%20atmosphere%2C%20soft%20golden%20light%2C%20deep%20greens%20and%20purples&width=1400&height=400&seq=rev-hero-1&orientation=landscape"
              alt="Review Đà Lạt background"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-950/80" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-play-circle-fill text-amber-400 text-xl" />
              </div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em]">Video Review</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Review Đà Lạt
            </h1>
            <p className="text-stone-400 text-base max-w-xl mx-auto">
              Khám phá thành phố ngàn hoa qua góc nhìn thực tế — những video chân thực từ cư dân và du khách yêu Đà Lạt
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{videos.length}</p>
                <p className="text-stone-400 text-xs">Video</p>
              </div>
              <div className="w-px h-8 bg-stone-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">HD</p>
                <p className="text-stone-400 text-xs">Chất lượng</p>
              </div>
              <div className="w-px h-8 bg-stone-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Free</p>
                <p className="text-stone-400 text-xs">Miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 flex items-center justify-center bg-stone-800 rounded-full mx-auto mb-5">
              <i className="ri-video-line text-stone-400 text-4xl" />
            </div>
            <p className="text-stone-300 text-lg font-medium">Chưa có video nào</p>
            <p className="text-stone-500 text-sm mt-2">Hãy quay lại sau nhé!</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-home-line" /> Về trang chủ
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6" ref={containerRef}>
            {/* Main Player */}
            <div className="flex-1">
              {activeVideo && (
                <div className="bg-stone-900 rounded-2xl overflow-hidden">
                  {/* Video embed / thumbnail */}
                  <div className="relative aspect-video w-full bg-stone-950">
                    {playing ? (
                      activeVideo.type === 'upload' ? (
                        <video
                          key={`${activeVideo.id}-playing`}
                          src={activeVideo.url}
                          className="w-full h-full"
                          controls
                          autoPlay
                        />
                      ) : (
                        <iframe
                          key={`${activeVideo.id}-playing`}
                          src={getEmbedUrl(activeVideo)}
                          title={activeVideo.title}
                          className="w-full h-full"
                          allowFullScreen
                          allow="autoplay; encrypted-media"
                        />
                      )
                    ) : (
                      <>
                        {getThumbnail(activeVideo) ? (
                          <img
                            src={getThumbnail(activeVideo)}
                            alt={activeVideo.title}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-800">
                            <i className="ri-video-line text-stone-600 text-6xl" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button
                            onClick={() => setPlaying(true)}
                            className="w-20 h-20 flex items-center justify-center bg-white/95 rounded-full cursor-pointer hover:scale-110 transition-transform"
                          >
                            <i className="ri-play-fill text-stone-800 text-3xl" />
                          </button>
                        </div>
                        {/* Platform badge */}
                        <div className="absolute top-4 left-4">
                          {activeVideo.platform === 'youtube' && (
                            <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                              <i className="ri-youtube-fill" /> YouTube
                            </span>
                          )}
                          {activeVideo.platform === 'vimeo' && (
                            <span className="flex items-center gap-1.5 bg-teal-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                              <i className="ri-vimeo-fill" /> Vimeo
                            </span>
                          )}
                        </div>
                        {/* Number badge */}
                        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                          {activeIdx + 1} / {videos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Video info + navigation */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-white text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {activeVideo.title}
                        </h2>
                        {activeVideo.description && (
                          <p className="text-stone-400 text-sm mt-1.5">{activeVideo.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setPlaying(true)}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-play-fill" /> Xem ngay
                      </button>
                    </div>

                    {/* Prev / Next */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-800">
                      <button
                        onClick={prev}
                        disabled={activeIdx === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <i className="ri-arrow-left-line" /> Trước
                      </button>
                      <div className="flex-1 flex items-center justify-center gap-1.5">
                        {videos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`transition-all cursor-pointer rounded-full ${
                              i === activeIdx
                                ? 'w-6 h-2 bg-amber-500'
                                : 'w-2 h-2 bg-stone-600 hover:bg-stone-500'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={next}
                        disabled={activeIdx === videos.length - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Tiếp <i className="ri-arrow-right-line" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Muốn thuê căn hộ tại Đà Lạt?</h3>
                  <p className="text-amber-100 text-sm mt-0.5">Hàng trăm căn hộ view đẹp, giá tốt đang chờ bạn</p>
                </div>
                <Link
                  to="/search"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-700 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-search-line" /> Tìm căn hộ
                </Link>
              </div>
            </div>

            {/* Playlist sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-stone-900 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between">
                  <h3 className="text-white text-sm font-semibold">Danh sách video</h3>
                  <span className="text-stone-500 text-xs">{videos.length} video</span>
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  {videos.map((vid, idx) => (
                    <button
                      key={vid.id}
                      onClick={() => goTo(idx)}
                      className={`w-full flex items-start gap-3 px-4 py-3 transition-all cursor-pointer text-left border-b border-stone-800/50 last:border-0 ${
                        idx === activeIdx
                          ? 'bg-amber-500/15 border-l-2 border-l-amber-500'
                          : 'hover:bg-stone-800'
                      }`}
                    >
                      <div className="relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-stone-800">
                        {getThumbnail(vid) ? (
                          <img src={getThumbnail(vid)} alt={vid.title} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="ri-video-line text-stone-500 text-lg" />
                          </div>
                        )}
                        {idx === activeIdx && (
                          <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                            <i className="ri-play-fill text-white text-lg" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-stone-500 text-xs">{idx + 1}</span>
                          {idx === activeIdx && (
                            <span className="text-xs text-amber-400 font-medium">Đang xem</span>
                          )}
                        </div>
                        <p className={`text-xs font-medium truncate ${idx === activeIdx ? 'text-amber-300' : 'text-stone-300'}`}>
                          {vid.title}
                        </p>
                        {vid.description && (
                          <p className="text-xs text-stone-500 truncate mt-0.5">{vid.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-stone-950">
        <Footer />
      </div>
    </div>
  );
};

export default ReviewPage;
