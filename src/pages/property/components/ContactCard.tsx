const PHONE = '0982947645';
const ZALO_URL = `https://zalo.me/${PHONE}`;
const FACEBOOK_URL = 'https://www.facebook.com/DaLatkeystay/';

interface ContactCardProps {
  price: string;
  priceUnit: string;
}

export default function ContactCard({ price, priceUnit }: ContactCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 p-6 sticky top-20">
      <div className="mb-5 pb-5 border-b border-stone-100">
        <p className="text-xs text-stone-400 mb-1">Giá niêm yết</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-amber-600">{price}</span>
          <span className="text-stone-500 text-sm">{priceUnit}</span>
        </div>
      </div>

      <p className="text-sm font-semibold text-stone-700 mb-3">Liên hệ tư vấn miễn phí</p>

      <div className="space-y-3 mb-5">
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap text-white hover:opacity-90"
          style={{ backgroundColor: '#0068FF' }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/40px-Icon_of_Zalo.svg.png"
            alt="Zalo"
            className="w-5 h-5 object-contain"
          />
          Nhắn Zalo ngay
        </a>

        <a
          href={`tel:${PHONE}`}
          className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-phone-fill text-base"></i>
          </div>
          Gọi: {PHONE}
        </a>

        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/40px-2023_Facebook_icon.svg.png"
            alt="Facebook"
            className="w-5 h-5 object-contain"
          />
          Nhắn Facebook
        </a>
      </div>

      <div className="bg-amber-50 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-shield-check-fill text-amber-500"></i>
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-700 mb-0.5">Cam kết từ Dalat Key Stay</p>
            <p className="text-xs text-stone-500 leading-relaxed">Tư vấn miễn phí · Không phí môi giới · Thông tin minh bạch</p>
          </div>
        </div>
      </div>
    </div>
  );
}
