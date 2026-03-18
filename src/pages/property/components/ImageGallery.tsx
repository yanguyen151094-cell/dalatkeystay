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

  const mainImage = images[0];
  const thumbImages = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainImage}
            alt={`${title} - ảnh 1`}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        </div>

        {/* Thumbnail images */}
        {thumbImages.map((img, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden cursor-pointer group ${idx === 3 ? 'relative' : ''}`}
            onClick={() => openLightbox(idx + 1)}
          >
            <img
              src={img}
              alt={`${title} - ảnh ${idx + 2}`}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
            {idx === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-2xl font-bold">+{remaining + 1}</p>
                  <p className="text-xs mt-1 opacity-90">ảnh</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Show all button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 bg-white text-stone-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap z-10"
          style={{ position: 'absolute', right: '1rem', bottom: '1rem' }}
        >
          <i className="ri-grid-line"></i>
          Xem tất cả {images.length} ảnh
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          <button
            onClick={goPrev}
            className="absolute left-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <i className="ri-arrow-left-line text-xl"></i>
          </button>

          {/* Main image */}
          <div className="max-w-5xl max-h-[80vh] w-full px-20">
            <img
              src={images[currentIndex]}
              alt={`${title} - ảnh ${currentIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>

          {/* Next button */}
          <button
            onClick={goNext}
            className="absolute right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <i className="ri-arrow-right-line text-xl"></i>
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-2xl px-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === currentIndex ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
