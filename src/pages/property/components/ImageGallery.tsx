import { useState, useEffect, useCallback } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!images || images.length === 0) return null;

  const mainImage = images[0];
  const thumbImages = images.slice(1, 5);

  return (
    <>
      {/* ── Gallery Grid ── */}
      <div className="relative rounded-2xl overflow-hidden">

        {/* Desktop: 1 large + 4 thumbs */}
        <div className="hidden md:grid md:grid-cols-[3fr_2fr] md:gap-2 h-[460px]">

          {/* Main image */}
          <div
            className="relative overflow-hidden cursor-pointer group rounded-l-2xl"
            onClick={() => openLightbox(0)}
          >
            <img
              src={mainImage}
              alt={`${title} - ảnh 1`}
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>

          {/* Right thumbs 2×2 */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {[0, 1, 2, 3].map((i) => {
              const img = thumbImages[i];
              const isLast = i === 3;
              const remaining = images.length - 5;
              if (!img) return <div key={i} className={`bg-stone-100 ${i === 1 ? 'rounded-tr-2xl' : i === 3 ? 'rounded-br-2xl' : ''}`} />;
              return (
                <div
                  key={i}
                  className={`relative overflow-hidden cursor-pointer group ${i === 1 ? 'rounded-tr-2xl' : i === 3 ? 'rounded-br-2xl' : ''}`}
                  onClick={() => openLightbox(i + 1)}
                >
                  <img
                    src={img}
                    alt={`${title} - ảnh ${i + 2}`}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  {isLast && remaining > 0 && (
                    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-white text-2xl font-bold leading-none">+{remaining + 1}</p>
                      <p className="text-white/80 text-xs mt-1">ảnh nữa</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: main image + scrollable strip */}
        <div className="md:hidden">
          <div
            className="relative w-full overflow-hidden rounded-2xl cursor-pointer"
            style={{ height: '260px' }}
            onClick={() => openLightbox(0)}
          >
            <img
              src={mainImage}
              alt={`${title} - ảnh 1`}
              className="w-full h-full object-cover object-center"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <div className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-image-line text-xs" />
                </div>
                {images.length} ảnh
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
              {images.slice(1).map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-400 transition-colors"
                  onClick={() => openLightbox(idx + 1)}
                >
                  <img
                    src={img}
                    alt={`${title} - ảnh ${idx + 2}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View all button – desktop */}
        {images.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="hidden md:flex absolute bottom-4 right-4 bg-white/95 text-stone-800 px-4 py-2 rounded-xl text-sm font-medium items-center gap-2 hover:bg-white transition-colors cursor-pointer whitespace-nowrap border border-stone-200"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-grid-fill text-stone-600" />
            </div>
            Xem tất cả {images.length} ảnh
          </button>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-close-line text-lg" />
            </div>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/50 text-white/90 text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            onClick={goPrev}
            className="absolute left-3 md:left-6 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-left-s-line text-xl" />
            </div>
          </button>

          {/* Main image */}
          <div className="w-full flex items-center justify-center px-12 md:px-20" style={{ maxHeight: '78vh' }}>
            <img
              src={images[currentIndex]}
              alt={`${title} - ảnh ${currentIndex + 1}`}
              className="max-w-full object-contain rounded-lg"
              style={{ maxHeight: '78vh', maxWidth: '100%' }}
            />
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className="absolute right-3 md:right-6 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-right-s-line text-xl" />
            </div>
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
            <div className="flex gap-2 overflow-x-auto max-w-xl py-1 px-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-white opacity-100 scale-105'
                      : 'border-transparent opacity-45 hover:opacity-75'
                  }`}
                  style={{ width: '52px', height: '38px' }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
