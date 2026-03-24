import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSmartResponse,
  formatPropertyPrice,
  formatPropertyType,
  QUICK_REPLIES,
  type PropertyResult,
} from './chatUtils';

const FORM_URL = 'https://readdy.ai/api/form/d6tbrta4of3kuoicn2kg';
const BOOKING_FORM_URL = 'https://readdy.ai/api/form/d7156rjk1jkj467r590g';
const FB_PAGE_NAME = 'DaLatkeystay';
const AI_ENDPOINT = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/chat-ai`;

// OpenAI-compatible message format for history
interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TextMessage {
  id: string;
  from: 'bot' | 'user';
  type: 'text';
  text: string;
}

interface PropertiesMessage {
  id: string;
  from: 'bot';
  type: 'properties';
  text: string;
  properties: PropertyResult[];
}

type Message = TextMessage | PropertiesMessage;

interface LeadForm {
  name: string;
  phone: string;
  need: string;
}

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  property: string;
  moveInDate: string;
  note: string;
}

const INITIAL_MSG: TextMessage = {
  id: 'init',
  from: 'bot',
  type: 'text',
  text: 'Xin chào! 👋 Mình là trợ lý của Đà Lạt Key Stay.\n\nMình có thể giúp bạn tìm phòng theo khu vực, giá, loại hình... Bạn cần hỗ trợ gì hôm nay?',
};

function formatText(text: string) {
  const parts = text.split('**');
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i}>{part}</strong>
      : part.split('\n').map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        )),
  );
}

function PropertyCard({ prop, onView }: { prop: PropertyResult; onView: (id: string) => void }) {
  const statusColor = prop.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
  const statusLabel = prop.status === 'available' ? 'Còn trống' : prop.status === 'rented' ? 'Đã thuê' : 'Bảo trì';

  return (
    <div className="bg-white border border-stone-100 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-300 transition-colors"
      onClick={() => onView(prop.id)}
    >
      {prop.thumbnail ? (
        <img
          src={prop.thumbnail}
          alt={prop.title}
          className="w-full h-20 object-cover object-top"
        />
      ) : (
        <div className="w-full h-20 bg-stone-100 flex items-center justify-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-home-4-line text-stone-400 text-xl" />
          </div>
        </div>
      )}
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-1 mb-1">
          <p className="text-xs font-semibold text-stone-800 leading-tight line-clamp-2 flex-1">{prop.title}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0 ${statusColor}`}>{statusLabel}</span>
        </div>
        {(prop.address || prop.district) && (
          <div className="flex items-center gap-1 mb-1.5">
            <div className="w-3 h-3 flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-2-line text-stone-400 text-xs" />
            </div>
            <p className="text-[10px] text-stone-500 truncate">{prop.district || prop.address}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md">{formatPropertyType(prop.type)}</span>
            {prop.bedrooms > 0 && (
              <span className="text-[10px] text-stone-500">{prop.bedrooms} PN</span>
            )}
          </div>
          <p className="text-xs font-bold text-emerald-600">{formatPropertyPrice(prop)}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingFormSent, setBookingFormSent] = useState(false);
  const [messengerUrl, setMessengerUrl] = useState<string | null>(null);
  const [hasNew, setHasNew] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', phone: '', need: '' });
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '', phone: '', email: '', property: '', moveInDate: '', note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  // Keep conversation history for AI context
  const historyRef = useRef<HistoryMessage[]>([]);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNew(false);
    }
  }, [messages, isOpen, showLeadForm]);

  const addBotTextMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `bot-${Date.now()}`, from: 'bot', type: 'text', text } as TextMessage,
    ]);
    if (!isOpen) setHasNew(true);
  };

  const addBotPropertiesMessage = (text: string, properties: PropertyResult[]) => {
    setMessages((prev) => [
      ...prev,
      { id: `bot-${Date.now()}`, from: 'bot', type: 'properties', text, properties } as PropertiesMessage,
    ]);
    if (!isOpen) setHasNew(true);
  };

  // Call the AI edge function with conversation history
  const callAI = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyRef.current.slice(-8),
        }),
      });
      const data = await res.json();
      return data.reply ?? 'Xin lỗi, mình không thể trả lời lúc này. Vui lòng thử lại!';
    } catch {
      return 'Mình đang gặp sự cố kỹ thuật. Bạn thử lại hoặc gọi hotline 0263 382 2888 nhé!';
    }
  };

  const handleSend = async (text?: string) => {
    const msg = (text ?? inputText).trim();
    if (!msg || isTyping) return;

    // Add to display
    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, from: 'user', type: 'text', text: msg } as TextMessage,
    ]);
    setInputText('');
    setIsTyping(true);

    // Add to history
    historyRef.current = [...historyRef.current, { role: 'user', content: msg }];

    try {
      const response = await getSmartResponse(msg);

      if (response.type === 'booking') {
        setIsTyping(false);
        addBotTextMessage(response.text);
        historyRef.current = [...historyRef.current, { role: 'assistant', content: response.text }];
        setTimeout(() => setShowBookingForm(true), 500);

      } else if (response.type === 'collect-info') {
        setIsTyping(false);
        addBotTextMessage(response.text);
        // Add to history
        historyRef.current = [...historyRef.current, { role: 'assistant', content: response.text }];
        setTimeout(() => setShowLeadForm(true), 500);

      } else if (response.useAI) {
        // Let AI answer naturally
        const aiReply = await callAI(msg);
        setIsTyping(false);
        addBotTextMessage(aiReply);
        historyRef.current = [...historyRef.current, { role: 'assistant', content: aiReply }];

      } else if (response.type === 'properties' && response.properties && response.properties.length > 0) {
        setIsTyping(false);
        addBotPropertiesMessage(response.text, response.properties);
        // Add summary to history so AI knows what was shown
        const summary = `(Đã hiển thị ${response.properties.length} phòng: ${response.properties.map(p => p.title).join(', ')})`;
        historyRef.current = [...historyRef.current, { role: 'assistant', content: `${response.text} ${summary}` }];

      } else {
        setIsTyping(false);
        addBotTextMessage(response.text);
        historyRef.current = [...historyRef.current, { role: 'assistant', content: response.text }];
      }
    } catch {
      setIsTyping(false);
      addBotTextMessage('Xin lỗi, mình gặp sự cố. Bạn thử lại hoặc gọi hotline 0263 382 2888 nhé!');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new URLSearchParams({
      name: leadForm.name,
      phone: leadForm.phone,
      need: leadForm.need || 'Không ghi rõ',
    });

    try {
      await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
    } catch {
      // silently ignore
    }

    setIsSubmitting(false);
    setLeadSent(true);
    setShowLeadForm(false);
    addBotTextMessage(
      `Cảm ơn bạn ${leadForm.name}! ✅\n\nMình đã chuyển thông tin cho nhân viên tư vấn rồi. Bạn sẽ nhận cuộc gọi qua số ${leadForm.phone} trong thời gian sớm nhất!\n\n📞 Hotline hỗ trợ ngay: 0263 382 2888`,
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingSubmitting(true);

    const data = new URLSearchParams({
      name: bookingForm.name,
      phone: bookingForm.phone,
      email: bookingForm.email || 'Không cung cấp',
      property: bookingForm.property || 'Không ghi rõ',
      moveInDate: bookingForm.moveInDate || 'Chưa xác định',
      note: bookingForm.note || '',
    });

    try {
      await fetch(BOOKING_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
    } catch {
      // silently ignore
    }

    // Build Messenger deep link with pre-filled booking info
    const msgLines = [
      '🏠 ĐĂNG KÝ THUÊ CĂN HỘ - Đà Lạt Key Stay',
      `👤 Họ tên: ${bookingForm.name}`,
      `📞 SĐT: ${bookingForm.phone}`,
      bookingForm.email ? `📧 Email: ${bookingForm.email}` : '',
      bookingForm.property ? `🏡 Căn hộ quan tâm: ${bookingForm.property}` : '',
      bookingForm.moveInDate ? `📅 Ngày vào ở: ${bookingForm.moveInDate}` : '',
      bookingForm.note ? `📝 Ghi chú: ${bookingForm.note}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://m.me/${FB_PAGE_NAME}?text=${encodeURIComponent(msgLines)}`;
    setMessengerUrl(url);

    setIsBookingSubmitting(false);
    setBookingFormSent(true);
    setShowBookingForm(false);

    // Auto-open Messenger on mobile after short delay
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 600);

    addBotTextMessage(
      `Đã lưu đăng ký của bạn ${bookingForm.name}! ✅\n\nBước tiếp: bấm nút bên dưới để gửi thông tin vào Messenger Fanpage — nhân viên sẽ phản hồi ngay!`,
    );
  };

  const showQuickReplies = messages.length <= 1 && !isTyping;

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-5 z-50">
        <button
          onClick={() => { setIsOpen((v) => !v); setHasNew(false); }}
          className="relative w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Mở chat hỗ trợ"
        >
          <div className="w-7 h-7 flex items-center justify-center">
            {isOpen
              ? <i className="ri-close-line text-white text-2xl" />
              : <i className="ri-customer-service-2-line text-white text-2xl" />}
          </div>
          {hasNew && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            </span>
          )}
        </button>

        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-stone-800 text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap pointer-events-none opacity-90">
            Chat với chúng tôi
          </div>
        )}
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 z-50 w-80 rounded-2xl overflow-hidden border border-stone-200 flex flex-col bg-stone-50"
          style={{ height: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          {/* Header */}
          <div className="bg-emerald-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-robot-2-line text-white text-base" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Trợ lý AI · Đà Lạt Key Stay</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <p className="text-emerald-100 text-xs">Tìm phòng thông minh theo khu vực</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <i className="ri-close-line text-white text-base" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg) => {
              if (msg.type === 'properties' && msg.from === 'bot') {
                const pm = msg as PropertiesMessage;
                return (
                  <div key={msg.id} className="flex items-start gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-robot-2-line text-emerald-600 text-xs" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="bg-white text-stone-700 border border-stone-100 px-3 py-2 rounded-2xl rounded-bl-sm text-xs leading-relaxed">
                        {formatText(pm.text)}
                      </div>
                      <div className="space-y-2">
                        {pm.properties.map((prop) => (
                          <PropertyCard
                            key={prop.id}
                            prop={prop}
                            onView={(id) => {
                              setIsOpen(false);
                              navigate(`/property/${id}`);
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-stone-400 ml-1">Nhấn vào để xem chi tiết</p>
                    </div>
                  </div>
                );
              }

              const tm = msg as TextMessage;
              return (
                <div
                  key={tm.id}
                  className={`flex items-end gap-2 ${tm.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {tm.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mb-0.5">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-robot-2-line text-emerald-600 text-xs" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[76%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      tm.from === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-sm'
                        : 'bg-white text-stone-700 border border-stone-100 rounded-bl-sm'
                    }`}
                  >
                    {formatText(tm.text)}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-robot-2-line text-emerald-600 text-xs" />
                  </div>
                </div>
                <div className="bg-white border border-stone-100 px-3 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Lead form */}
            {showLeadForm && !leadSent && (
              <div className="bg-white border border-emerald-100 rounded-2xl p-3 ml-8">
                <p className="text-xs font-semibold text-stone-700 mb-2.5">
                  <i className="ri-user-3-line mr-1 text-emerald-600" />
                  Thông tin của bạn:
                </p>
                <form data-readdy-form onSubmit={handleLeadSubmit} className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Họ và tên *"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Số điện thoại *"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <input
                    type="text"
                    name="need"
                    placeholder="Nhu cầu cụ thể (tuỳ chọn)"
                    value={leadForm.need}
                    onChange={(e) => setLeadForm((p) => ({ ...p, need: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-fill" />
                        Gửi – Nhân viên liên hệ ngay
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Booking form */}
            {showBookingForm && !bookingFormSent && (
              <div className="bg-white border border-emerald-200 rounded-2xl p-3 ml-8">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-5 h-5 flex items-center justify-center bg-emerald-100 rounded-full flex-shrink-0">
                    <i className="ri-home-heart-line text-emerald-600 text-xs" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">Đăng ký thuê căn hộ</p>
                </div>
                <form data-readdy-form onSubmit={handleBookingSubmit} className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Họ và tên *"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Số điện thoại *"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (tuỳ chọn)"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <input
                    type="text"
                    name="property"
                    placeholder="Căn hộ quan tâm (tên hoặc khu vực)"
                    value={bookingForm.property}
                    onChange={(e) => setBookingForm((p) => ({ ...p, property: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                  />
                  <div className="relative">
                    <input
                      type="date"
                      name="moveInDate"
                      value={bookingForm.moveInDate}
                      onChange={(e) => setBookingForm((p) => ({ ...p, moveInDate: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50"
                    />
                    {!bookingForm.moveInDate && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">
                        Ngày muốn vào ở
                      </span>
                    )}
                  </div>
                  <textarea
                    name="note"
                    placeholder="Yêu cầu thêm (tuỳ chọn)..."
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm((p) => ({ ...p, note: e.target.value }))}
                    maxLength={500}
                    rows={2}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-stone-50 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isBookingSubmitting}
                    className="w-full py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    {isBookingSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="ri-calendar-check-line" />
                        Gửi đăng ký thuê
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 text-center">
                    Nhân viên liên hệ trong 30 phút
                  </p>
                </form>
              </div>
            )}

            {/* Messenger CTA after booking sent */}
            {bookingFormSent && messengerUrl && (
              <div className="ml-8 bg-white border border-blue-100 rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0084ff 0%, #a033ff 50%, #ff5c7c 100%)' }}
                  >
                    <i className="ri-messenger-line text-white text-sm" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">Gửi qua Facebook Messenger</p>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Thông tin đã được điền sẵn — bạn chỉ cần bấm <strong>Gửi</strong> trong Messenger là xong!
                </p>
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #0084ff 0%, #a033ff 100%)' }}
                >
                  <i className="ri-messenger-fill text-sm" />
                  Mở Messenger &amp; gửi ngay
                </a>
                <p className="text-[10px] text-stone-400 text-center">
                  Mở app Messenger trên điện thoại của bạn
                </p>
              </div>
            )}

            {/* Quick replies */}
            {showQuickReplies && (
              <div className="flex flex-wrap gap-1.5 pt-1 ml-8">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleSend(qr)}
                    className="px-2.5 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs rounded-full hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-stone-100 px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="VD: phòng khu vực phường 8..."
              className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
              className="w-8 h-8 flex items-center justify-center bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
              aria-label="Gửi"
            >
              <i className="ri-send-plane-fill text-sm" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
