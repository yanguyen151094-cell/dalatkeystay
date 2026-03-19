import { useState, useRef, useEffect } from 'react';
import { getSmartResponse, QUICK_REPLIES } from './chatUtils';

const FORM_URL = 'https://readdy.ai/api/form/d6tbrta4of3kuoicn2kg';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

interface LeadForm {
  name: string;
  phone: string;
  need: string;
}

const INITIAL_MSG: Message = {
  id: 'init',
  from: 'bot',
  text: 'Xin chào! 👋 Mình là trợ lý của Đà Lạt Key Stay.\n\nMình có thể giúp bạn tìm homestay, nhà nguyên căn hoặc căn hộ tại Đà Lạt. Bạn cần hỗ trợ gì hôm nay?',
};

function formatText(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', phone: '', need: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNew(false);
    }
  }, [messages, isOpen, showLeadForm]);

  const addBotMessage = (text: string, delay = 900) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, from: 'bot', text },
      ]);
      if (!isOpen) setHasNew(true);
    }, delay);
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? inputText).trim();
    if (!msg || isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, from: 'user', text: msg },
    ]);
    setInputText('');

    const response = getSmartResponse(msg);
    if (response.type === 'collect-info') {
      addBotMessage(response.text, 800);
      setTimeout(() => setShowLeadForm(true), 1900);
    } else {
      addBotMessage(response.text, 900);
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
      // silently ignore network errors
    }

    setIsSubmitting(false);
    setLeadSent(true);
    setShowLeadForm(false);
    addBotMessage(
      `Cảm ơn bạn ${leadForm.name}! ✅\n\nMình đã chuyển thông tin cho nhân viên tư vấn rồi. Bạn sẽ nhận cuộc gọi qua số ${leadForm.phone} trong thời gian sớm nhất!\n\n📞 Hotline hỗ trợ ngay: 0263 382 2888`,
      500,
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
          style={{ height: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          {/* Header */}
          <div className="bg-emerald-600 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-customer-service-2-line text-white text-base" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Đà Lạt Key Stay</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <p className="text-emerald-100 text-xs">Trực tuyến · Phản hồi nhanh</p>
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.from === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mb-0.5">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-robot-2-line text-emerald-600 text-xs" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[76%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-white text-stone-700 border border-stone-100 rounded-bl-sm'
                  }`}
                >
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

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
              placeholder="Nhập tin nhắn..."
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
