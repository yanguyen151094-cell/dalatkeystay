import { useState, useRef } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useSEO } from '../../hooks/useSEO';

const contactInfo = [
  {
    icon: 'ri-map-pin-2-line',
    title: 'Địa chỉ văn phòng',
    detail: '32 hẻm 6 Mai Xuân Thưởng, Phường 8, Đà Lạt',
    sub: 'Làm việc: Tất cả các ngày trong tuần',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: 'ri-phone-line',
    title: 'Hotline',
    detail: '0982 947 645',
    sub: 'Hỗ trợ 00:00 – 23:59 mỗi ngày',
    color: 'bg-amber-50 text-amber-600',
    href: 'tel:0982947645',
  },
  {
    icon: 'ri-mail-line',
    title: 'Email',
    detail: 'yanguyen151094@gmail.com',
    sub: 'Phản hồi trong vòng 24h',
    color: 'bg-rose-50 text-rose-600',
    href: 'mailto:yanguyen151094@gmail.com',
  },
  {
    icon: 'ri-time-line',
    title: 'Giờ làm việc',
    detail: '00:00 – 23:59',
    sub: 'Tất cả các ngày trong tuần',
    color: 'bg-stone-100 text-stone-600',
  },
];

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [charCount, setCharCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useSEO({
    title: 'Liên Hệ Key Stay Đà Lạt – Tư Vấn Cho Thuê Nhà & Homestay Đà Lạt',
    description: 'Liên hệ Key Stay Đà Lạt để được tư vấn thuê nhà, homestay và căn hộ tại Đà Lạt. Hotline: 0982947645 – hỗ trợ 00:00–23:59 mỗi ngày.',
    keywords: 'liên hệ Key Stay Đà Lạt, tư vấn thuê nhà Đà Lạt, hotline Key Stay, booking Đà Lạt',
    canonical: '/contact',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Liên Hệ Key Stay Đà Lạt',
        url: 'https://www.dalatkeystay.vn/contact',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://www.dalatkeystay.vn/' },
            { '@type': 'ListItem', position: 2, name: 'Liên hệ', item: 'https://www.dalatkeystay.vn/contact' },
          ],
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Key Stay Đà Lạt',
        url: 'https://www.dalatkeystay.vn',
        telephone: '+84982947645',
        email: 'yanguyen151094@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '32 hẻm 6 Mai Xuân Thưởng, Phường 8',
          addressLocality: 'Đà Lạt',
          addressRegion: 'Lâm Đồng',
          postalCode: '670000',
          addressCountry: 'VN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '11.9404',
          longitude: '108.4583',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ],
        hasMap: 'https://www.google.com/maps/place/Phường+1,+Đà+Lạt',
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.querySelector('textarea');
    if (textarea && textarea.value.length > 500) {
      alert('Nội dung không được vượt quá 500 ký tự');
      return;
    }

    setSubmitStatus('loading');
    const data = new URLSearchParams(new FormData(form) as unknown as URLSearchParams);

    try {
      const response = await fetch('https://readdy.ai/api/form/d6si4a34rjv84lqbqdt0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
        setCharCount(0);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-16">
        {/* Hero */}
        <div className="relative h-56 overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=Dalat%20Vietnam%20office%20building%20with%20flowers%20friendly%20real%20estate%20team%20professional%20setting%20pine%20trees%20beautiful%20building%20exterior%20morning%20light&width=1600&height=500&seq=contact-hero&orientation=landscape"
            alt="Liên hệ Đà Lạt Home"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-white/85 text-sm">Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm ngôi nhà lý tưởng tại Đà Lạt</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Contact Info + Map */}
            <div className="lg:col-span-1 space-y-5">
              {contactInfo.map((info) => (
                <div key={info.title} className="bg-white rounded-xl p-4 border border-stone-100 flex items-start gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${info.color} flex-shrink-0`}>
                    <i className={`${info.icon} text-xl`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 mb-0.5">{info.title}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-semibold text-stone-800 hover:text-emerald-700 transition-colors">
                        {info.detail}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-stone-800">{info.detail}</p>
                    )}
                    <p className="text-xs text-stone-400 mt-0.5">{info.sub}</p>
                  </div>
                </div>
              ))}

              {/* Map */}
              <div className="bg-white rounded-xl overflow-hidden border border-stone-100">
                <div className="px-4 py-3 border-b border-stone-100">
                  <h3 className="text-sm font-semibold text-stone-700">Vị trí văn phòng</h3>
                </div>
                <div style={{ height: '220px' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.1236794208517!2d108.43516427480717!3d11.940673088252945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112fca0b3101b%3A0xb7d84289e7cdf72a!2zUGjGsOG7nW5nIDEsIMSQw6AgTOG6oXQsIEzDom0gxJDhu5NuZw!5e0!3m2!1svi!2s!4v1710000000001!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Văn phòng Đà Lạt Home"
                  ></iframe>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-xl p-4 border border-stone-100">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Theo dõi chúng tôi</h3>
                <div className="flex gap-3">
                  {[
                    { icon: 'ri-facebook-circle-line', label: 'Facebook', color: 'hover:bg-blue-50 hover:text-blue-600' },
                    { icon: 'ri-instagram-line', label: 'Instagram', color: 'hover:bg-rose-50 hover:text-rose-600' },
                    { icon: 'ri-youtube-line', label: 'Youtube', color: 'hover:bg-red-50 hover:text-red-600' },
                    { icon: 'ri-tiktok-line', label: 'TikTok', color: 'hover:bg-stone-100 hover:text-stone-800' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg border border-stone-100 text-stone-500 transition-all cursor-pointer ${s.color}`}
                    >
                      <i className={`${s.icon} text-lg`}></i>
                      <span className="text-xs">{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-stone-100 p-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Gửi Tin Nhắn Cho Chúng Tôi
                </h2>
                <p className="text-stone-500 text-sm mb-6">
                  Điền form bên dưới và chúng tôi sẽ liên hệ lại trong vòng 24 giờ làm việc.
                </p>

                {submitStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-emerald-100 rounded-full mb-4">
                      <i className="ri-check-line text-emerald-600 text-3xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 mb-2">Gửi thành công!</h3>
                    <p className="text-stone-500 text-sm mb-5">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                    <button
                      onClick={() => setSubmitStatus('idle')}
                      className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <form ref={formRef} data-readdy-form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">
                          Họ và tên <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullname"
                          required
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="email@example.com"
                          className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">Số điện thoại</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="0901 234 567"
                          className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1.5">Bạn quan tâm đến?</label>
                        <select
                          name="interest"
                          className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50 cursor-pointer"
                        >
                          <option value="Cho thuê nhà nguyên căn">Cho thuê nhà nguyên căn</option>
                          <option value="Cho thuê homestay">Cho thuê homestay</option>
                          <option value="Mua căn hộ">Mua căn hộ</option>
                          <option value="Đăng tin bán/cho thuê">Đăng tin bán/cho thuê</option>
                          <option value="Tư vấn đầu tư">Tư vấn đầu tư</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1.5">Khu vực quan tâm</label>
                      <input
                        type="text"
                        name="preferred_area"
                        placeholder="Phường 1, Xuân Thọ, Lạc Dương..."
                        className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1.5">
                        Nội dung <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        maxLength={500}
                        placeholder="Mô tả yêu cầu của bạn: loại hình, diện tích, ngân sách, thời gian thuê..."
                        onChange={(e) => setCharCount(e.target.value.length)}
                        className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-stone-50 resize-none"
                      />
                      <div className="flex justify-end mt-1">
                        <span className={`text-xs ${charCount > 480 ? 'text-rose-500' : 'text-stone-400'}`}>
                          {charCount}/500 ký tự
                        </span>
                      </div>
                    </div>

                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                        <i className="ri-error-warning-line"></i>
                        Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua điện thoại.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="w-full py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-line"></i>
                          Gửi Tin Nhắn
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* FAQ */}
              <div className="mt-6 bg-white rounded-2xl border border-stone-100 p-6">
                <h3 className="text-base font-semibold text-stone-800 mb-4">Câu Hỏi Thường Gặp</h3>
                <div className="space-y-3">
                  {[
                    {
                      q: 'Mức giá cho thuê nhà nguyên căn tại Đà Lạt là bao nhiêu?',
                      a: 'Giá dao động từ 5 – 25 triệu/tháng tùy khu vực và diện tích. Khu trung tâm thường có giá cao hơn khu ngoại ô.',
                    },
                    {
                      q: 'Cần những thủ tục gì để thuê nhà nguyên căn?',
                      a: 'Cần CMND/CCCD của người thuê, đặt cọc 1-2 tháng, ký hợp đồng thuê nhà. Chúng tôi hỗ trợ toàn bộ thủ tục.',
                    },
                    {
                      q: 'Có thể đặt homestay theo ngày không?',
                      a: 'Có, hầu hết homestay cho thuê theo ngày với giá từ 700k – 2 triệu/đêm tùy địa điểm và mùa du lịch.',
                    },
                  ].map((faq, i) => (
                    <details key={i} className="group border border-stone-100 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-stone-700 hover:bg-stone-50 list-none">
                        {faq.q}
                        <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform flex-shrink-0 ml-2"></i>
                      </summary>
                      <div className="px-4 pb-3 text-stone-500 text-sm leading-relaxed border-t border-stone-100 pt-3">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
