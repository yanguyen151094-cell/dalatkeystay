import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  stay_type: string | null;
  created_at: string;
}

const mockReviews: Review[] = [
  {
    id: 'm1',
    reviewer_name: 'Minh Tú',
    rating: 5,
    comment: 'Căn hộ cực kỳ sạch sẽ, view núi đẹp xuất sắc. Chủ nhà nhiệt tình, hỗ trợ 24/7. Sẽ quay lại lần sau!',
    stay_type: 'homestay',
    created_at: '2026-03-10T00:00:00Z',
  },
  {
    id: 'm2',
    reviewer_name: 'Lan Phương',
    rating: 5,
    comment: 'Trải nghiệm tuyệt vời tại Key Stay Đà Lạt. Phòng ấm áp, tiện nghi đầy đủ, vị trí trung tâm rất tiện đi lại.',
    stay_type: 'rental',
    created_at: '2026-03-05T00:00:00Z',
  },
  {
    id: 'm3',
    reviewer_name: 'Hùng Anh',
    rating: 5,
    comment: 'Đặt thuê dài hạn cho cả gia đình. Không gian yên tĩnh, sân vườn rộng, trẻ em thích lắm. Giá hợp lý so với chất lượng.',
    stay_type: 'rental',
    created_at: '2026-02-20T00:00:00Z',
  },
  {
    id: 'm4',
    reviewer_name: 'Bích Ngọc',
    rating: 5,
    comment: 'Check-in từ lúc nửa đêm mà vẫn được hỗ trợ ngay lập tức. Key Stay thật sự hỗ trợ 24/7 không nói suông!',
    stay_type: 'homestay',
    created_at: '2026-02-14T00:00:00Z',
  },
  {
    id: 'm5',
    reviewer_name: 'Thanh Bình',
    rating: 4,
    comment: 'Căn hộ đẹp, thoáng mát. Nhân viên tư vấn tận tình, giúp mình tìm được căn ưng ý trong 1 ngày. Highly recommend!',
    stay_type: 'rental',
    created_at: '2026-01-30T00:00:00Z',
  },
  {
    id: 'm6',
    reviewer_name: 'Thu Hà',
    rating: 5,
    comment: 'Cặp đôi chúng mình rất hài lòng. Homestay view rừng thông, buổi sáng sương mù lãng mạn. Nhất định sẽ trở lại!',
    stay_type: 'homestay',
    created_at: '2026-01-15T00:00:00Z',
  },
];

const stayTypeLabel: Record<string, string> = {
  homestay: 'Homestay',
  rental: 'Thuê dài hạn',
  apartment: 'Căn hộ',
};

const avatarColors = [
  'bg-amber-400',
  'bg-emerald-400',
  'bg-rose-400',
  'bg-teal-400',
  'bg-indigo-400',
  'bg-orange-400',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-3.5 h-3.5 flex items-center justify-center">
          <i className={`ri-star-${i < rating ? 'fill' : 'line'} text-amber-400 text-sm`}></i>
        </div>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, reviewer_name, rating, comment, stay_type, created_at')
        .order('created_at', { ascending: false })
        .limit(12);
      const real = data || [];
      setReviews(real.length >= 3 ? real : mockReviews);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % Math.ceil(reviews.length / 3));
    }, 4000);
    return () => clearInterval(t);
  }, [reviews]);

  if (loading) return null;

  const totalPages = Math.ceil(reviews.length / 3);
  const visibleReviews = reviews.slice(activeIdx * 3, activeIdx * 3 + 3);
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-16 bg-amber-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-amber-600 text-sm font-medium mb-1">Khách hàng nói về chúng tôi</p>
            <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Đánh Giá Từ Khách Hàng
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                {avgRating}
              </div>
              <div className="flex justify-center mt-1">
                <StarRating rating={5} />
              </div>
              <p className="text-stone-400 text-xs mt-0.5">{reviews.length} đánh giá</p>
            </div>
            <div className="w-px h-12 bg-stone-200"></div>
            <div className="flex flex-col gap-1.5">
              {[5, 4, 3].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 w-3">{star}</span>
                    <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="text-xs text-stone-400 w-5">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {visibleReviews.map((review, i) => {
            const colorIdx = (activeIdx * 3 + i) % avatarColors.length;
            const initial = review.reviewer_name.charAt(0).toUpperCase();
            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-stone-100 flex flex-col gap-4 hover:border-amber-200 transition-all"
                style={{ animation: 'fadeIn 0.4s ease' }}
              >
                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} />
                  {review.stay_type && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                      {stayTypeLabel[review.stay_type] || review.stay_type}
                    </span>
                  )}
                </div>

                <p className="text-stone-600 text-sm leading-relaxed flex-1">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-stone-50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${avatarColors[colorIdx]} flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{initial}</span>
                  </div>
                  <div>
                    <p className="text-stone-800 font-semibold text-sm">{review.reviewer_name}</p>
                    <p className="text-stone-400 text-xs">
                      {new Date(review.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="ml-auto w-6 h-6 flex items-center justify-center">
                    <i className="ri-double-quotes-r text-amber-200 text-2xl"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === activeIdx ? 'bg-amber-500 w-6' : 'bg-stone-300 w-1.5 hover:bg-amber-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}
