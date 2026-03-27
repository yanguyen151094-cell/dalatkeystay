import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface MediaVideo {
  id: string;
  title: string;
  type: string;
  url: string;
  embed_id: string | null;
  platform: string | null;
  thumbnail_url: string | null;
  file_name: string | null;
  category: string | null;
  description: string | null;
  created_at: string;
}

/* ─── Smart thumbnail ─── */
function VideoThumbnail({ video }: { video: MediaVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);

  const captureFrame = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = el.videoWidth || 300;
      canvas.height = el.videoHeight || 500;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
        setThumbSrc(canvas.toDataURL('image/jpeg', 0.85));
      } else setFallback(true);
    } catch { setFallback(true); }
  }, []);

  useEffect(() => {
    if (video.type !== 'upload' || !video.url) return;
    const el = videoRef.current;
    if (!el) return;
    const onMeta = () => { el.currentTime = 1.5; };
    const onSeeked = () => captureFrame();
    const onError = () => setFallback(true);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('seeked', onSeeked);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('seeked', onSeeked);
      el.removeEventListener('error', onError);
    };
  }, [video.url, captureFrame]);

  if (video.type === 'embed' && video.platform === 'youtube' && video.embed_id) {
    const src = video.thumbnail_url || `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`;
    return <img src={src} alt={video.title} className="w-full h-full object-cover" />;
  }
  if (video.type === 'embed' && video.thumbnail_url) {
    return <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />;
  }
  if (video.type === 'upload' && video.url) {
    if (thumbSrc) return <img src={thumbSrc} alt={video.title} className="w-full h-full object-cover" />;
    if (fallback) return (
      <div className="w-full h-full bg-stone-800 flex items-center justify-center">
        <i className="ri-video-line text-stone-400 text-2xl"></i>
      </div>
    );
    return (
      <>
        <video ref={videoRef} src={video.url} preload="metadata" muted playsInline crossOrigin="anonymous"
          className="w-full h-full object-cover opacity-0 absolute inset-0" />
        <div className="w-full h-full bg-stone-800 flex items-center justify-center">
          <i className="ri-loader-4-line text-stone-400 text-xl animate-spin"></i>
        </div>
      </>
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center">
      <i className="ri-video-line text-stone-400 text-2xl"></i>
    </div>
  );
}

/* ─── Video Player Modal with swipe navigation ─── */
interface ModalProps {
  videos: MediaVideo[];
  index: number;
  onClose: () => void;
  onNavigate: (idx: number) => void;
}

function VideoPlayerModal({ videos, index, onClose, onNavigate }: ModalProps) {
  const video = videos[index];
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
      if (e.key === 'ArrowRight' && index < videos.length - 1) onNavigate(index + 1);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate, index, videos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 60 && dy < 80) {
      if (dx < 0 && index < videos.length - 1) onNavigate(index + 1);
      if (dx > 0 && index > 0) onNavigate(index - 1);
    }
  };

  const renderPlayer = () => {
    if (video.type === 'embed' && video.embed_id && video.platform) {
      const src = video.platform === 'youtube'
        ? `https://www.youtube.com/embed/${video.embed_id}?autoplay=1&rel=0&playsinline=1`
        : `https://player.vimeo.com/video/${video.embed_id}?autoplay=1`;
      return (
        <iframe src={src} style={{ width: '100%', height: '100%', display: 'block', border: 'none' }}
          allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={video.title} />
      );
    }
    if (video.type === 'upload' && video.url) {
      return (
        <video src={video.url} style={{ width: '100%', height: '100%', display: 'block' }}
          controls autoPlay playsInline />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white/50 text-sm">Không thể phát video này.</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 bg-black/70 backdrop-blur-sm z-20"
        style={{ height: '52px' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center bg-amber-500 rounded-full flex-shrink-0">
            <i className="ri-key-2-line text-white text-xs"></i>
          </div>
          <p className="text-white/90 text-sm truncate font-medium">{video.title}</p>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center bg-white/15 hover:bg-white/30 rounded-full text-white transition-colors cursor-pointer flex-shrink-0 ml-2">
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      {/* Video area */}
      <div className="absolute left-0 right-0 bottom-0" style={{ top: '52px' }}
        onClick={e => e.stopPropagation()}>
        {renderPlayer()}
      </div>

      {/* Bottom overlay: TikTok style poster info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <p className="text-white font-bold text-lg leading-snug mb-2">{video.title}</p>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full flex-shrink-0">
                <i className="ri-key-2-line text-white text-sm"></i>
              </div>
              <span className="text-white font-semibold text-sm">Dalat Key Stay</span>
              <span className="text-white/50 text-xs">•</span>
              <span className="text-white/60 text-xs">
                {new Date(video.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
            {video.description && (
              <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{video.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Prev/Next nav arrows */}
      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(index - 1); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full cursor-pointer transition-colors">
          <i className="ri-arrow-left-s-line text-2xl"></i>
        </button>
      )}
      {index < videos.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(index + 1); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full cursor-pointer transition-colors">
          <i className="ri-arrow-right-s-line text-2xl"></i>
        </button>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-1.5"
        onClick={e => e.stopPropagation()}>
        {videos.slice(0, 10).map((_, i) => (
          <button key={i} onClick={() => onNavigate(i)}
            className={`rounded-full transition-all cursor-pointer ${i === index ? 'w-4 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
        ))}
        {videos.length > 10 && (
          <span className="text-white/50 text-xs">+{videos.length - 10}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Main Strip ─── */
export default function VideoReviewStrip() {
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('media_videos').select('*')
        .order('created_at', { ascending: false }).limit(20);
      setVideos(data || []);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  // Drag-scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) hasDragged.current = true;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.userSelect = '';
  };

  if (loading) {
    return (
      <div className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-28 animate-pulse">
              <div className="w-28 h-48 bg-stone-200 rounded-2xl mb-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <>
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-amber-600 text-sm font-medium mb-1">Khám phá qua ống kính</p>
            <h2 className="text-2xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Review Đà Lạt
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scroll('left')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 transition-colors cursor-pointer">
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <button onClick={() => scroll('right')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 transition-colors cursor-pointer">
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>
            <Link to="/review-da-lat"
              className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap">
              Xem tất cả <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>

        <div ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}>
          {videos.map((video, index) => (
            <button key={video.id}
              onClick={() => { if (!hasDragged.current) setActiveIndex(index); }}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer group">
              <div className="relative w-28 rounded-2xl overflow-hidden" style={{ height: '176px' }}>
                {/* Thumbnail */}
                <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                  <VideoThumbnail video={video} />
                </div>

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10"></div>

                {/* Ring border */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-50 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/25 backdrop-blur-sm border border-white/50 group-hover:bg-amber-500/80 transition-colors">
                    <i className="ri-play-fill text-white text-xl ml-0.5"></i>
                  </div>
                </div>

                {/* Badge */}
                {(() => {
                  const days = (Date.now() - new Date(video.created_at).getTime()) / 86400000;
                  if (days <= 3) return <div className="absolute top-2 right-2"><span className="text-xs font-bold bg-rose-500 text-white rounded-full px-2 py-0.5">MỚI</span></div>;
                  if (days <= 14) return <div className="absolute top-2 right-2"><span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">HOT</span></div>;
                  return <div className="absolute top-2 right-2"><span className="text-xs text-white/80 font-medium bg-black/40 rounded-full px-1.5 py-0.5">{String(index + 1).padStart(2, '0')}</span></div>;
                })()}

                {/* TikTok-style bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-bold leading-tight line-clamp-2 text-left mb-1">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 flex items-center justify-center bg-amber-500 rounded-full flex-shrink-0">
                      <i className="ri-key-2-line text-white" style={{ fontSize: '8px' }}></i>
                    </div>
                    <span className="text-white/80 text-xs truncate" style={{ fontSize: '9px' }}>Dalat Key Stay</span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* View all card */}
          <Link to="/review-da-lat"
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group">
            <div className="relative w-28 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center gap-2 hover:border-amber-500 transition-colors"
              style={{ height: '176px' }}>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                <i className="ri-play-list-2-line text-amber-600 text-xl"></i>
              </div>
              <p className="text-amber-700 text-xs font-semibold text-center px-2 leading-tight">Xem tất cả video</p>
            </div>
          </Link>
        </div>
      </section>

      {activeIndex !== null && (
        <VideoPlayerModal
          videos={videos}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
