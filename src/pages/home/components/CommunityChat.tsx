import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

interface ChatMessage {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

const COLORS = [
  'bg-amber-500', 'bg-rose-500', 'bg-teal-500', 'bg-violet-500',
  'bg-orange-500', 'bg-emerald-500', 'bg-sky-500', 'bg-pink-500',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState(() => localStorage.getItem('chat_name') || '');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('community_chat')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(60);
      setMessages((data as ChatMessage[]) || []);
    };
    fetch();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('community_chat_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'community_chat',
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'community_chat',
      }, (payload) => {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const isNearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 120;
    if (isNearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimName = name.trim();
    const trimText = text.trim();
    if (!trimName) { setError('Vui lòng nhập tên của bạn'); return; }
    if (!trimText) { setError('Vui lòng nhập nội dung'); return; }
    if (trimText.length > 300) { setError('Tin nhắn tối đa 300 ký tự'); return; }
    setError('');
    setSending(true);
    localStorage.setItem('chat_name', trimName);
    const { error: err } = await supabase.from('community_chat').insert({
      author_name: trimName,
      message: trimText,
    });
    setSending(false);
    if (err) { setError('Gửi thất bại, thử lại!'); return; }
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-100 flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
        <div className="w-8 h-8 flex items-center justify-center bg-amber-50 rounded-xl">
          <i className="ri-chat-3-line text-amber-600 text-base"></i>
        </div>
        <div>
          <p className="text-stone-800 font-semibold text-sm">Chat cộng đồng</p>
          <p className="text-stone-400 text-xs">{messages.length} tin nhắn • Tất cả có thể xem</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
          <span className="text-green-600 text-xs font-medium">Trực tiếp</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-amber-50 rounded-full mb-3">
              <i className="ri-chat-smile-2-line text-amber-400 text-2xl"></i>
            </div>
            <p className="text-stone-500 text-sm font-medium">Chưa có tin nhắn nào</p>
            <p className="text-stone-400 text-xs mt-1">Hãy là người đầu tiên nhắn tin!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2">
              <div className={`w-7 h-7 flex items-center justify-center ${getColor(msg.author_name)} rounded-full text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                {msg.author_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-stone-800 text-xs font-semibold">{msg.author_name}</span>
                  <span className="text-stone-400 text-xs">{timeAgo(msg.created_at)}</span>
                </div>
                <p className="text-stone-700 text-sm mt-0.5 break-words leading-relaxed">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-stone-100">
        {error && (
          <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
            <i className="ri-error-warning-line"></i>{error}
          </p>
        )}
        <div className="flex gap-2 mb-2">
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Tên của bạn..."
            className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400 bg-stone-50" />
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhắn gì đó... (Enter để gửi)"
            maxLength={300}
            className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
          <button onClick={handleSend} disabled={sending}
            className="w-10 h-10 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-60 flex-shrink-0">
            {sending
              ? <i className="ri-loader-4-line animate-spin text-sm"></i>
              : <i className="ri-send-plane-2-line text-sm"></i>}
          </button>
        </div>
        <p className="text-stone-400 text-xs mt-1 text-right">{text.length}/300</p>
      </div>
    </div>
  );
}
