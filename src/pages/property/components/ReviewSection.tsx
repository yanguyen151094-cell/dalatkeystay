import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Review {
  id: string;
  property_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  stay_type: string;
  helpful_count: number;
  created_at: string;
}

interface ReviewSectionProps {
  propertyId: string;
  propertyType: string;
}

const STAY_TYPE_LABELS: Record<string, string> = {
  rental: 'Thuê dài hạn',
  homestay: 'Homestay',
  apartment: 'Mua căn hộ',
};

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          disabled={readonly}
          className={`w-6 h-6 flex items-center justify-center transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <i
            className={`ri-star-${(hovered || value) >= star ? 'fill' : 'line'} text-lg ${
              (hovered || value) >= star ? 'text-amber-400' : 'text-stone-300'
            }`}
          ></i>
        </button>
      ))}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export default function ReviewSection({ propertyId, propertyType }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    reviewer_name: '',
    rating: 5,
    comment: '',
    stay_type: propertyType || 'rental',
  });
  const [formErrors, setFormErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  async function loadReviews() {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (!error && data) setReviews(data);
    setLoading(false);
  }

  function validate() {
    const errors: Partial<typeof form> = {};
    if (form.reviewer_name.trim().length < 2) errors.reviewer_name = 'Tên tối thiểu 2 ký tự';
    if (form.comment.trim().length < 10) errors.comment = 'Nhận xét tối thiểu 10 ký tự';
    if (form.comment.trim().length > 500) errors.comment = 'Nhận xét tối đa 500 ký tự';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const { error } = await supabase.from('reviews').insert({
      property_id: propertyId,
      reviewer_name: form.reviewer_name.trim(),
      rating: form.rating,
      comment: form.comment.trim(),
      stay_type: form.stay_type,
    });

    if (error) {
      setSubmitStatus('error');
    } else {
      setSubmitStatus('success');
      setForm({ reviewer_name: '', rating: 5, comment: '', stay_type: propertyType || 'rental' });
      setShowForm(false);
      await loadReviews();
    }
    setSubmitting(false);
  }

  async function handleHelpful(reviewId: string, currentCount: number) {
    if (helpfulClicked.has(reviewId)) return;
    setHelpfulClicked((prev) => new Set([...prev, reviewId]));
    await supabase.from('reviews').update({ helpful_count: currentCount + 1 }).eq('id', reviewId);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r))
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="mt-10">
      <h2 className="text-base font-semibold text-stone-800 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
        Đánh giá từ khách hàng
        {reviews.length > 0 && (
          <span className="text-stone-400 font-normal text-sm">({reviews.length} đánh giá)</span>
        )}
      </h2>

      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="bg-stone-50 rounded-2xl p-5 mb-6 flex gap-6 items-center">
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {avgRating.toFixed(1)}
            </div>
            <StarRating value={Math.round(avgRating)} readonly />
            <p className="text-xs text-stone-500 mt-1">{reviews.length} đánh giá</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingDist.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-stone-500 w-3">{star}</span>
                <i className="ri-star-fill text-amber-400 text-xs"></i>
                <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review button */}
      {!showForm && submitStatus !== 'success' && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 text-sm hover:border-amber-400 hover:text-amber-600 transition-all cursor-pointer mb-6"
        >
          <i className="ri-edit-line"></i>
          Viết đánh giá của bạn
        </button>
      )}

      {/* Success message */}
      {submitStatus === 'success' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
          <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full flex-shrink-0">
            <i className="ri-check-line text-emerald-600"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Cảm ơn bạn đã đánh giá!</p>
            <p className="text-xs text-emerald-600">Đánh giá của bạn đã được ghi nhận.</p>
          </div>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="ml-auto text-xs text-emerald-600 hover:underline cursor-pointer"
          >
            Viết thêm
          </button>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-stone-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-stone-800 text-sm">Đánh giá bất động sản này</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 mb-2">
              Đánh giá của bạn <span className="text-rose-500">*</span>
            </label>
            <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
            <p className="text-xs text-stone-400 mt-1">
              {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'][form.rating]}
            </p>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Tên của bạn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.reviewer_name}
              onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                formErrors.reviewer_name ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-stone-50'
              }`}
            />
            {formErrors.reviewer_name && (
              <p className="text-xs text-rose-500 mt-1">{formErrors.reviewer_name}</p>
            )}
          </div>

          {/* Stay type */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Hình thức sử dụng</label>
            <div className="flex gap-2">
              {Object.entries(STAY_TYPE_LABELS).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, stay_type: val }))}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    form.stay_type === val
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-stone-200 text-stone-600 hover:border-amber-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Nhận xét <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              rows={4}
              maxLength={500}
              placeholder="Chia sẻ trải nghiệm của bạn về căn hộ này..."
              className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none ${
                formErrors.comment ? 'border-rose-300 bg-rose-50' : 'border-stone-200 bg-stone-50'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {formErrors.comment ? (
                <p className="text-xs text-rose-500">{formErrors.comment}</p>
              ) : (
                <span />
              )}
              <span className={`text-xs ${form.comment.length > 480 ? 'text-rose-500' : 'text-stone-400'}`}>
                {form.comment.length}/500
              </span>
            </div>
          </div>

          {submitStatus === 'error' && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              Có lỗi xảy ra. Vui lòng thử lại.
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 border border-stone-200 text-stone-600 text-sm rounded-xl hover:bg-stone-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><i className="ri-loader-4-line animate-spin"></i> Đang gửi...</>
              ) : (
                <><i className="ri-send-plane-line"></i> Gửi đánh giá</>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-5 border border-stone-100">
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 bg-stone-200 rounded-full"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-stone-200 rounded w-1/4"></div>
                  <div className="h-2 bg-stone-100 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-3 bg-stone-100 rounded w-full"></div>
                <div className="h-3 bg-stone-100 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 bg-stone-100 rounded-full">
            <i className="ri-chat-1-line text-stone-400 text-2xl"></i>
          </div>
          <p className="text-stone-500 text-sm font-medium">Chưa có đánh giá nào</p>
          <p className="text-stone-400 text-xs mt-1">Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-stone-100 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
                  <span className="text-amber-700 font-bold text-sm">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-stone-800">{review.reviewer_name}</span>
                    {review.stay_type && (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-full">
                        {STAY_TYPE_LABELS[review.stay_type] || review.stay_type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating value={review.rating} readonly />
                    <span className="text-xs text-stone-400">{formatTimeAgo(review.created_at)}</span>
                  </div>
                </div>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-stone-50">
                <button
                  onClick={() => handleHelpful(review.id, review.helpful_count)}
                  disabled={helpfulClicked.has(review.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    helpfulClicked.has(review.id)
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'border-stone-200 text-stone-500 hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                >
                  <i className="ri-thumb-up-line"></i>
                  Hữu ích {review.helpful_count > 0 && `(${review.helpful_count})`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
