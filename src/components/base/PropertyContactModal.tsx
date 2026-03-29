import { useState, useRef, useEffect } from 'react';

type FormType = 'buy' | 'rent' | 'homestay';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: FormType;
  propertyTitle?: string;
}

const FORM_CONFIGS = {
  buy: {
    submitAddr: 'https://readdy.ai/api/form/d74bl9kprit363gl0jfg',
    title: 'Mua Căn Hộ Ở Đây',
    subtitle: 'Điền thông tin để được tư vấn & hỗ trợ mua căn hộ tốt nhất!',
    color: 'rose',
    icon: 'ri-building-line',
    btnLabel: 'Gửi yêu cầu mua',
    bgGrad: 'from-rose-500 to-rose-600',
  },
  rent: {
    submitAddr: 'https://readdy.ai/api/form/d74bl8cprit363gl0jf0',
    title: 'Thuê Nhà Ở Đây',
    subtitle: 'Để lại thông tin để chúng tôi tư vấn ngôi nhà phù hợp nhất cho bạn!',
    color: 'emerald',
    icon: 'ri-home-2-line',
    btnLabel: 'Gửi yêu cầu thuê',
    bgGrad: 'from-emerald-500 to-emerald-600',
  },
  homestay: {
    submitAddr: 'https://readdy.ai/api/form/d74bl9kprit363gl0jg0',
    title: 'Đặt Phòng Ở Đây',
    subtitle: 'Điền thông tin để đặt phòng homestay — chúng tôi sẽ xác nhận trong vòng 30 phút!',
    color: 'amber',
    icon: 'ri-home-heart-line',
    btnLabel: 'Gửi yêu cầu đặt phòng',
    bgGrad: 'from-amber-500 to-amber-600',
  },
};

export default function PropertyContactModal({ isOpen, onClose, type, propertyTitle }: Props) {
  const cfg = FORM_CONFIGS[type];
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      setErrorMsg('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = e.currentTarget;
    const data = new URLSearchParams();
    new FormData(form).forEach((val, key) => {
      data.append(key, val as string);
    });
    try {
      const res = await fetch(cfg.submitAddr, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        throw new Error('Gửi thất bại');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  if (!isOpen) return null;

  const colorMap: Record<string, string> = {
    rose: 'ring-rose-400 focus:ring-rose-400',
    emerald: 'ring-emerald-400 focus:ring-emerald-400',
    amber: 'ring-amber-400 focus:ring-amber-400',
  };
  const inputClass = `w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 ${colorMap[cfg.color]} bg-white transition-all`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${cfg.bgGrad} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
          <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-xl mb-3">
            <i className={`${cfg.icon} text-white text-2xl`} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {cfg.title}
          </h2>
          <p className="text-white/85 text-sm">{cfg.subtitle}</p>
          {propertyTitle && (
            <div className="mt-3 px-3 py-2 bg-white/15 rounded-lg">
              <p className="text-white/90 text-xs"><i className="ri-home-line mr-1" />Bất động sản: <span className="font-semibold">{propertyTitle}</span></p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-green-100 rounded-full">
                <i className="ri-check-line text-green-500 text-3xl" />
              </div>
              <h3 className="font-bold text-stone-800 text-lg mb-2">Gửi thành công!</h3>
              <p className="text-stone-500 text-sm mb-6">
                Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ lại trong thời gian sớm nhất!
              </p>
              <button
                onClick={onClose}
                className={`px-6 py-2.5 bg-gradient-to-r ${cfg.bgGrad} text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap`}
              >
                Đóng
              </button>
            </div>
          ) : (
            <form data-readdy-form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden field: property name */}
              <input type="hidden" name="property_name" value={propertyTitle || ''} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    placeholder="Nguyễn Văn A"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0909 xxx xxx"
                    pattern="[0-9+\s\-]{9,15}"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  className={inputClass}
                />
              </div>

              {type === 'buy' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Ngân sách dự kiến</label>
                    <select name="budget" className={inputClass}>
                      <option value="">Chọn ngân sách</option>
                      <option value="Dưới 1 tỷ">Dưới 1 tỷ</option>
                      <option value="1 - 2 tỷ">1 – 2 tỷ</option>
                      <option value="2 - 4 tỷ">2 – 4 tỷ</option>
                      <option value="Trên 4 tỷ">Trên 4 tỷ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Mục đích mua</label>
                    <select name="purpose" className={inputClass}>
                      <option value="">Chọn mục đích</option>
                      <option value="Để ở">Để ở</option>
                      <option value="Đầu tư cho thuê">Đầu tư cho thuê</option>
                      <option value="Nghỉ dưỡng cuối tuần">Nghỉ dưỡng cuối tuần</option>
                      <option value="Đầu tư dài hạn">Đầu tư dài hạn</option>
                    </select>
                  </div>
                </>
              )}

              {type === 'rent' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Thuê từ ngày</label>
                      <input
                        type="date"
                        name="rent_from"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Thời hạn thuê</label>
                      <select name="rent_duration" className={inputClass}>
                        <option value="">Chọn thời hạn</option>
                        <option value="1 tháng">1 tháng</option>
                        <option value="3 tháng">3 tháng</option>
                        <option value="6 tháng">6 tháng</option>
                        <option value="1 năm">1 năm</option>
                        <option value="Trên 1 năm">Trên 1 năm</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Ngân sách thuê/tháng</label>
                    <select name="budget" className={inputClass}>
                      <option value="">Chọn ngân sách</option>
                      <option value="Dưới 3 triệu">Dưới 3 triệu/tháng</option>
                      <option value="3 - 6 triệu">3 – 6 triệu/tháng</option>
                      <option value="6 - 10 triệu">6 – 10 triệu/tháng</option>
                      <option value="Trên 10 triệu">Trên 10 triệu/tháng</option>
                    </select>
                  </div>
                </>
              )}

              {type === 'homestay' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Ngày nhận phòng <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        name="checkin_date"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Ngày trả phòng <span className="text-rose-500">*</span></label>
                      <input
                        type="date"
                        name="checkout_date"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Số người lớn</label>
                      <select name="adults" className={inputClass}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <option key={n} value={n}>{n} người lớn</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Số trẻ em</label>
                      <select name="children" className={inputClass}>
                        {[0, 1, 2, 3, 4].map(n => (
                          <option key={n} value={n}>{n} trẻ em</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Ghi chú / Yêu cầu thêm</label>
                <textarea
                  name="note"
                  placeholder="Ví dụ: cần view đẹp, gần trung tâm, ưu tiên tầng cao..."
                  rows={3}
                  maxLength={500}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {errorMsg && (
                <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs flex items-center gap-2">
                  <i className="ri-error-warning-line" /> {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full py-3 bg-gradient-to-r ${cfg.bgGrad} text-white rounded-xl text-sm font-bold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:brightness-110`}
              >
                {status === 'submitting' ? (
                  <><i className="ri-loader-4-line animate-spin" /> Đang gửi...</>
                ) : (
                  <><i className={cfg.icon} /> {cfg.btnLabel}</>
                )}
              </button>

              <p className="text-center text-stone-400 text-xs">
                <i className="ri-shield-check-line mr-1" />Thông tin của bạn được bảo mật hoàn toàn
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
