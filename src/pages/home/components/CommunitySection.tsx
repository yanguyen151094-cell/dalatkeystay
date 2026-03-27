import CommunityChat from './CommunityChat';
import CommunityPostForm from './CommunityPostForm';

export default function CommunitySection() {
  return (
    <section className="py-14 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-amber-600 text-sm font-medium mb-1">Cộng đồng</p>
        <h2 className="text-2xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kết nối & Chia sẻ
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          Nhắn tin trực tiếp với cộng đồng hoặc gửi video review trải nghiệm của bạn tại Đà Lạt
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunityChat />
        <CommunityPostForm />
      </div>
    </section>
  );
}
