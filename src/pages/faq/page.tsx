import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

const PHONE = '0982947645';

const faqs = [
  {
    category: 'Đặt phòng & Thuê nhà',
    icon: 'ri-home-4-line',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    items: [
      {
        q: 'Làm thế nào để đặt thuê nhà hoặc homestay tại Dalat Key Stay?',
        a: 'Rất đơn giản! Bạn chọn bất động sản ưa thích trên website, bấm nút "Nhắn Zalo ngay" hoặc gọi trực tiếp số 0982947645. Đội ngũ tư vấn sẽ xác nhận lịch trống, báo giá và hướng dẫn bước tiếp theo.',
      },
      {
        q: 'Có cần đặt cọc khi thuê không? Chính sách hoàn cọc như thế nào?',
        a: 'Thuê dài hạn (nhà nguyên căn): thường đặt cọc 1–2 tháng tiền thuê. Homestay ngắn ngày: đặt cọc 30–50% tổng tiền phòng để giữ chỗ. Chúng tôi hoàn trả 100% cọc nếu hủy trước 48 giờ so với ngày nhận phòng.',
      },
      {
        q: 'Có thể xem nhà thực tế trước khi quyết định thuê không?',
        a: 'Hoàn toàn có thể! Liên hệ qua Zalo hoặc điện thoại để đặt lịch xem nhà với nhân viên tư vấn. Chúng tôi dẫn xem miễn phí, không kèm bất kỳ điều kiện nào.',
      },
      {
        q: 'Giá trên website đã bao gồm điện nước chưa?',
        a: 'Giá hiển thị là giá thuê nhà thuần. Tiền điện nước tính theo thực tế sử dụng. Một số homestay ngắn ngày có thể bao gồm điện nước – vui lòng hỏi nhân viên tư vấn để xác nhận chi tiết.',
      },
    ],
  },
  {
    category: 'Khu vực & Địa điểm',
    icon: 'ri-map-pin-2-line',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    items: [
      {
        q: 'Khu vực nào ở Đà Lạt đẹp nhất để thuê homestay?',
        a: 'Phường 3 và Phường 12 nổi tiếng với rừng thông và view đồi lãng mạn, rất lý tưởng cho cặp đôi. Phường 1 và Phường 2 gần trung tâm, tiện đi lại mua sắm. Xuân Thọ và Lạc Dương phù hợp trải nghiệm nông trại yên bình.',
      },
      {
        q: 'Nên thuê nhà ở trung tâm hay ngoại ô Đà Lạt?',
        a: 'Trung tâm (Phường 1, 2, 3) tiện đi chợ, ăn uống, di chuyển nhưng giá cao hơn và ồn ào hơn. Ngoại ô (Xuân Thọ, Lạc Dương) không khí trong lành, yên tĩnh, diện tích rộng, giá tốt hơn – phù hợp gia đình và người thích thiên nhiên.',
      },
      {
        q: 'Dalat Key Stay có bất động sản ở ngoài trung tâm không?',
        a: 'Có! Chúng tôi có listings tại Xuân Thọ, Lạc Dương, Nam Ban và nhiều khu vực ngoại ô. Những khu này đang rất được ưa chuộng với không gian rộng, giá hợp lý và view thiên nhiên tuyệt đẹp.',
      },
    ],
  },
  {
    category: 'Mua bán căn hộ',
    icon: 'ri-building-2-line',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    items: [
      {
        q: 'Quy trình mua căn hộ qua Dalat Key Stay diễn ra như thế nào?',
        a: 'Bước 1: Liên hệ tư vấn để chọn căn hộ phù hợp nhu cầu và ngân sách. Bước 2: Đặt lịch xem thực tế. Bước 3: Đặt cọc giữ chỗ. Bước 4: Ký hợp đồng mua bán và hoàn thiện thủ tục pháp lý. Chúng tôi hỗ trợ toàn bộ quá trình.',
      },
      {
        q: 'Dalat Key Stay có hỗ trợ vay ngân hàng khi mua nhà không?',
        a: 'Có! Chúng tôi có đối tác với các ngân hàng lớn, hỗ trợ tư vấn gói vay phù hợp nhất với tình hình tài chính của bạn. Liên hệ để được tư vấn miễn phí.',
      },
      {
        q: 'Pháp lý các bất động sản có đảm bảo không?',
        a: 'Tất cả bất động sản trên Dalat Key Stay đều được kiểm tra pháp lý kỹ lưỡng. Chúng tôi chỉ đăng những tài sản có đầy đủ giấy tờ hợp pháp, sổ hồng/sổ đỏ rõ ràng, không tranh chấp.',
      },
    ],
  },
  {
    category: 'Đăng tin cho thuê',
    icon: 'ri-add-circle-line',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    items: [
      {
        q: 'Tôi có thể đăng tin cho thuê bất động sản của mình không?',
        a: 'Hoàn toàn có thể! Liên hệ qua Zalo số 0982947645 hoặc trang Liên Hệ để được hướng dẫn. Chúng tôi hỗ trợ chụp ảnh đẹp, viết mô tả chuyên nghiệp và quảng bá đến khách hàng tiềm năng.',
      },
      {
        q: 'Chi phí đăng tin là bao nhiêu?',
        a: 'Dalat Key Stay hiện đang hỗ trợ đăng tin miễn phí cho gói cơ bản. Liên hệ để biết thêm về gói nổi bật giúp bất động sản của bạn tiếp cận nhiều khách hàng hơn.',
      },
      {
        q: 'Thông tin khách hàng để lại qua website sẽ được xử lý như thế nào?',
        a: 'Mọi thông tin khách hàng để lại (tên, số điện thoại, yêu cầu) sẽ được chuyển về đội ngũ tư vấn và phản hồi trong vòng 30 phút – 2 giờ qua Zalo hoặc điện thoại. Thông tin được bảo mật tuyệt đối.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero */}
        <div className="bg-amber-600 py-14 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium mb-4">
              <i className="ri-question-answer-line"></i>
              Câu hỏi thường gặp
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Giải Đáp Thắc Mắc
            </h1>
            <p className="text-white/85 text-base max-w-xl mx-auto">
              Những câu hỏi phổ biến nhất về dịch vụ cho thuê nhà, homestay và mua bán bất động sản tại Đà Lạt
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">
          {faqs.map((section) => (
            <div key={section.category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${section.bg}`}>
                  <i className={`${section.icon} ${section.color} text-lg`}></i>
                </div>
                <h2
                  className="text-base font-bold text-stone-800"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {section.category}
                </h2>
              </div>

              <div className="space-y-2">
                {section.items.map((faq, qi) => {
                  const key = `${section.category}-${qi}`;
                  const isOpen = openKey === key;
                  return (
                    <div key={qi} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-stone-50 transition-colors"
                      >
                        <span className="font-medium text-stone-800 text-sm pr-4 leading-relaxed">{faq.q}</span>
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 bg-stone-100 rounded-full">
                          <i className={`${isOpen ? 'ri-subtract-line' : 'ri-add-line'} text-stone-500 text-sm`}></i>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-amber-50 rounded-2xl p-8 text-center border border-amber-100 mt-4">
            <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-4">
              <i className="ri-customer-service-2-line text-amber-600 text-2xl"></i>
            </div>
            <h3
              className="font-bold text-stone-800 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Vẫn còn thắc mắc?
            </h3>
            <p className="text-stone-500 text-sm mb-5 max-w-xs mx-auto">
              Đội ngũ tư vấn Dalat Key Stay sẵn sàng giải đáp mọi câu hỏi của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://zalo.me/${PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: '#0068FF' }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/40px-Icon_of_Zalo.svg.png"
                  alt="Zalo"
                  className="w-4 h-4 object-contain"
                />
                Nhắn Zalo: {PHONE}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-mail-send-line"></i>
                Gửi yêu cầu tư vấn
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
