export interface ChatResponse {
  type: 'text' | 'collect-info';
  text: string;
}

const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const contains = (msg: string, keywords: string[]) =>
  keywords.some((k) => normalize(msg).includes(normalize(k)));

const BOOKING_KW = [
  'đặt phòng', 'còn phòng', 'phòng trống', 'đặt lịch', 'book',
  'thuê ngay', 'đặt ngay', 'còn không', 'lịch trống', 'check in',
  'nhận phòng', 'đặt homestay', 'muốn thuê', 'tìm phòng', 'tìm nhà',
  'có phòng', 'ngày mai', 'cuối tuần', 'đặt chỗ',
];
const PRICE_KW = ['giá', 'bao nhiêu', 'chi phí', 'tiền thuê', 'mức giá', 'giá thuê', 'giá cả', 'phí'];
const AREA_KW = ['khu vực', 'địa điểm', 'vị trí', 'ở đâu', 'phường', 'gần', 'trung tâm', 'khu nào', 'địa chỉ'];
const HOMESTAY_KW = ['homestay', 'nhà nghỉ', 'theo ngày', 'du lịch', 'ngắn ngày', 'nghỉ dưỡng', 'nghỉ ngơi'];
const HOUSE_KW = ['nhà nguyên căn', 'thuê nhà', 'nguyên căn', 'dài hạn', 'thuê tháng', 'hợp đồng'];
const APARTMENT_KW = ['căn hộ', 'apartment', 'chung cư', 'studio'];
const INVEST_KW = ['đầu tư', 'mua', 'sinh lời', 'lợi nhuận', 'tiềm năng'];
const GREETING_KW = ['xin chào', 'hello', ' hi ', 'chào', 'alo', 'hey', 'chao'];
const CONTACT_KW = ['liên hệ', 'tư vấn', 'nhân viên', 'hỗ trợ', 'gặp', 'gọi điện', 'zalo'];

export function getSmartResponse(message: string): ChatResponse {
  if (contains(message, BOOKING_KW)) {
    return {
      type: 'collect-info',
      text: 'Cảm ơn bạn đã quan tâm! Để kiểm tra lịch trống và đặt phòng/thuê nhà tốt nhất cho bạn, vui lòng để lại thông tin bên dưới nhé. Nhân viên sẽ liên hệ hỗ trợ bạn ngay! 🏠',
    };
  }

  if (contains(message, CONTACT_KW)) {
    return {
      type: 'collect-info',
      text: 'Tất nhiên rồi! Bạn vui lòng để lại thông tin, nhân viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất! 😊',
    };
  }

  if (contains(message, PRICE_KW)) {
    return {
      type: 'text',
      text: 'Mức giá tham khảo tại Đà Lạt:\n\n🏡 Homestay: 500k – 2.5 triệu/đêm\n🏠 Nhà nguyên căn: 5 – 25 triệu/tháng\n🏢 Căn hộ cao cấp: 8 – 30 triệu/tháng\n\nGiá thực tế tuỳ khu vực và diện tích. Bạn muốn tư vấn cụ thể hơn không? 😊',
    };
  }

  if (contains(message, AREA_KW)) {
    return {
      type: 'text',
      text: 'Các khu vực hot tại Đà Lạt:\n\n📍 Trung tâm (P.1, P.2): Tiện nghi, sầm uất, giá cao\n🌿 Xuân Thọ, Lạc Dương: Không khí trong lành, giá hợp lý\n🏔 Ngoại ô: Yên tĩnh, phù hợp gia đình\n\nBạn muốn ở khu vực nào?',
    };
  }

  if (contains(message, HOMESTAY_KW)) {
    return {
      type: 'text',
      text: 'Homestay tại Đà Lạt Key Stay:\n\n✨ Thiết kế lãng mạn, phong cách châu Âu\n🌸 View đồi thông, thung lũng đẹp\n👨‍👩‍👧 Phòng 2–8 người\n🅿️ Có đậu xe, bếp nấu ăn riêng\n\nBạn dự định đến Đà Lạt ngày nào? Mình kiểm tra phòng trống cho bạn liền!',
    };
  }

  if (contains(message, HOUSE_KW)) {
    return {
      type: 'text',
      text: 'Nhà nguyên căn cho thuê tại Đà Lạt:\n\n🏠 Diện tích: 80 – 300m²\n💰 Giá: 5 – 25 triệu/tháng\n📋 Hợp đồng 6 tháng – 2 năm\n🔑 Hỗ trợ toàn bộ thủ tục pháp lý\n\nBạn cần bao nhiêu phòng ngủ? Khu vực nào ưu tiên?',
    };
  }

  if (contains(message, APARTMENT_KW)) {
    return {
      type: 'text',
      text: 'Căn hộ cao cấp tại Đà Lạt:\n\n🏢 Loại: Studio, 1PN, 2PN, Penthouse\n💰 Thuê: 8 – 30 triệu/tháng\n✅ Đầy đủ nội thất cao cấp\n🛗 Thang máy, bãi xe, bảo vệ 24/7\n\nBạn quan tâm đến loại căn hộ nào?',
    };
  }

  if (contains(message, INVEST_KW)) {
    return {
      type: 'text',
      text: 'Đà Lạt là thị trường BĐS tiềm năng:\n\n📈 Giá trị tăng 15–20%/năm gần đây\n🏡 Homestay cho thuê sinh lời tốt mùa du lịch\n🌿 Đất nền ngoại ô tiềm năng cao\n\nBạn muốn đầu tư loại hình nào? Mình tư vấn cụ thể hơn nhé!',
    };
  }

  if (contains(message, GREETING_KW)) {
    return {
      type: 'text',
      text: 'Xin chào! 👋 Mình là trợ lý của DaLat Key Stay.\n\nMình có thể giúp bạn:\n🏡 Tìm homestay theo ngày\n🏠 Thuê nhà nguyên căn\n🏢 Căn hộ cao cấp\n💰 Tư vấn giá & khu vực\n\nBạn cần tìm gì tại Đà Lạt?',
    };
  }

  return {
    type: 'text',
    text: 'Cảm ơn bạn đã nhắn tin! DaLat Key Stay có thể hỗ trợ về:\n\n🏡 Homestay & nhà nghỉ theo ngày\n🏠 Nhà nguyên căn dài hạn\n🏢 Căn hộ cao cấp\n💰 Tư vấn giá & khu vực đẹp\n\nBạn cần tư vấn về loại hình nào?',
  };
}

export const QUICK_REPLIES = [
  '🏡 Tìm homestay',
  '🏠 Thuê nhà dài hạn',
  '💰 Hỏi giá thuê',
  '📍 Khu vực nào đẹp?',
];
