import { useState, useEffect, useRef } from 'react';
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

interface VideoPlayerModalProps {
  video: MediaVideo;
  onClose: () => void;
}

function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const renderPlayer = () => {
    if (video.type === 'embed' && video.embed_id && video.platform) {
      const src =
        video.platform === 'youtube'
          ? `https://www.youtube.com/embed/${video.embed_id}?autoplay=1&rel=0`
          : `https://player.vimeo.com/video/${video.embed_id}?autoplay=1`;
      return (
        <iframe
          src={src}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      );
    }
    if (video.type === 'upload' && video.url) {
      return (
        <video
          src={video.url}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
        />
      );
    }
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4"
        style={{ aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderPlayer()}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
        <div className="absolute -bottom-10 left-0 right-0 text-center">
          <p className="text-white/80 text-sm truncate px-4">{video.title}</p>
        </div>
      </div>
    </div>
  );
}

export default function VideoReviewStrip() {
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<MediaVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('media_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      setVideos(data || []);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const getThumbnail = (video: MediaVideo): string => {
    if (video.thumbnail_url) return video.thumbnail_url;
    if (video.embed_id && video.platform === 'youtube') {
      return `https://img.youtube.com/vi/${video.embed_id}/mqdefault.jpg`;
    }
    return `https://readdy.ai/api/search-image?query=Dalat%20Vietnam%20beautiful%20city%20landscape%20pine%20forest%20flower%20garden%20romantic%20travel%20review&width=300&height=500&seq=vid${video.id.slice(0, 8)}&orientation=portrait`;
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-28 animate-pulse"
            >
              <div className="w-28 h-48 bg-stone-200 rounded-2xl mb-2" />
              <div className="h-3 bg-stone-200 rounded w-3/4 mx-auto" />
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
              <button
                onClick={() => scroll('left')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>
            <Link
              to="/review-da-lat"
              className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              Xem tất cả <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
            >
              <div
                className="relative w-28 rounded-2xl overflow-hidden"
                style={{ height: '176px' }}
              >
                <img
                  src={getThumbnail(video)}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>

                {/* Ring border (Stories style) */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-50 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/25 backdrop-blur-sm border border-white/50 group-hover:bg-amber-500/80 transition-colors">
                    <i className="ri-play-fill text-white text-xl ml-0.5"></i>
                  </div>
                </div>

                {/* New/Hot badge */}
                {(() => {
                  const daysDiff = (Date.now() - new Date(video.created_at).getTime()) / (1000 * 60 * 60 * 24);
                  if (daysDiff <= 3) return (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-bold bg-rose-500 text-white rounded-full px-2 py-0.5">MỚI</span>
                    </div>
                  );
                  if (daysDiff <= 14) return (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">HOT</span>
                    </div>
                  );
                  return (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs text-white/80 font-medium bg-black/40 rounded-full px-1.5 py-0.5">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  );
                })()}

                {/* Title at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2 text-left">
                    {video.title}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* View all card */}
          <Link
            to="/review-da-lat"
            className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
          >
            <div
              className="relative w-28 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center gap-2 hover:border-amber-500 transition-colors"
              style={{ height: '176px' }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors">
                <i className="ri-play-list-2-line text-amber-600 text-xl"></i>
              </div>
              <p className="text-amber-700 text-xs font-semibold text-center px-2 leading-tight">
                Xem tất cả video
              </p>
            </div>
          </Link>
        </div>
      </section>

      {activeVideo && (
        <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
