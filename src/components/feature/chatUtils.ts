import { supabase } from '../../lib/supabase';

export interface ChatResponse {
  type: 'text' | 'collect-info' | 'properties' | 'booking';
  text: string;
  properties?: PropertyResult[];
  useAI?: boolean;
}

export interface PropertyResult {
  id: string;
  title: string;
  address: string | null;
  district: string | null;
  type: string;
  price_per_night: number | null;
  price_per_month: number | null;
  sale_price: number | null;
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  thumbnail: string | null;
  listing_type: string;
  status: string;
}

// ======= Normalize helpers =======
export const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const contains = (msg: string, keywords: string[]) =>
  keywords.some((k) => normalize(msg).includes(normalize(k)));

// ======= Keyword groups =======
const BOOKING_KW = [
  'dat phong', 'dat lich', 'book phong', 'thue ngay', 'dat ngay',
  'lich trong', 'check in', 'nhan phong', 'dat cho', 'muon dat',
];

const BOOKING_INTENT_KW = [
  'lay can', 'lấy căn', 'muon thue', 'muốn thuê', 'thue luon', 'thuê luôn',
  'chot luon', 'chốt luôn', 'dang ky thue', 'đăng ký thuê',
  'ky hop dong', 'ký hợp đồng', 'dat coc', 'đặt cọc',
  'muon xem thuc te', 'muốn xem thực tế', 'xem can ho nay', 'xem căn hộ này',
  'toi muon thue', 'tôi muốn thuê', 'minh lay', 'mình lấy',
  'chon can nay', 'chọn căn này', 'nhan can', 'nhận căn',
  'muon dat truoc', 'muốn đặt trước', 'book can', 'book căn',
  'lay phong', 'lấy phòng', 'chot phong', 'chốt phòng',
];

const CONTACT_KW = [
  'lien he truc tiep', 'goi cho toi', 'nhan vien goi', 'ho tro ngay',
  'goi dien', 'lien he zalo', 'nhan vien tu van', 'can tu van truc tiep',
];

const GREETING_KW = ['xin chao', 'hello', 'chao ban', 'alo'];
const GREETING_SINGLE = ['hi', 'hey', 'chao'];

// Known areas/wards in Đà Lạt
const KNOWN_AREAS: { keyword: string; display: string }[] = [
  { keyword: 'xuan tho', display: 'Xuân Thọ' },
  { keyword: 'lac duong', display: 'Lạc Dương' },
  { keyword: 'van thanh', display: 'Vạn Thành' },
  { keyword: 'dong da', display: 'Đống Đa' },
  { keyword: 'phu dong', display: 'Phù Đổng' },
  { keyword: 'xuan truong', display: 'Xuân Trường' },
  { keyword: 'ta nung', display: 'Tà Nung' },
  { keyword: 'tram hanh', display: 'Trạm Hành' },
  { keyword: 'trung tam', display: 'Trung tâm' },
  { keyword: 'lang biang', display: 'Lạc Dương' },
];

// ======= Extract ward/area from message =======
function extractAreaKeyword(msg: string): { query: string; display: string } | null {
  const normed = normalize(msg);

  // Match "phuong" + number strictly: must follow whitespace or start
  const wardNum = normed.match(/(?:^|\s)(?:phuong|p\.)\s*(\d{1,2})(?:\s|$)/);
  if (wardNum) {
    const num = wardNum[1];
    return { query: num, display: `Phường ${num}` };
  }

  for (const area of KNOWN_AREAS) {
    if (normed.includes(area.keyword)) {
      return { query: area.display, display: area.display };
    }
  }

  return null;
}

// ======= Extract budget from message =======
function extractBudget(msg: string): number | null {
  const normed = normalize(msg);

  const triMatch = normed.match(/(\d+(?:[.,]\d+)?)\s*(?:trieu|tr(?:\s|$|\/|,|\.))/);
  if (triMatch) {
    return parseFloat(triMatch[1].replace(',', '.')) * 1_000_000;
  }

  const kMatch = normed.match(/(\d+(?:[.,]\d+)?)\s*(?:nghin|nghìn|k(?:\s|$|\/|,|\.))/);
  if (kMatch) {
    return parseFloat(kMatch[1].replace(',', '.')) * 1_000;
  }

  const tyMatch = normed.match(/(\d+(?:[.,]\d+)?)\s*(?:ty|ti|ty)/);
  if (tyMatch) {
    return parseFloat(tyMatch[1].replace(',', '.')) * 1_000_000_000;
  }

  return null;
}

function formatBudget(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} triệu`;
  return `${(amount / 1_000).toFixed(0)}k`;
}

// ======= Detect if strictly a property search keyword =======
function isPropertySearch(msg: string): boolean {
  const normed = normalize(msg);
  const searchTerms = [
    'tim phong', 'tim nha', 'co phong', 'con phong', 'xem phong',
    'phong tro', 'nha nguyen can', 'can ho', 'homestay', 'tim can',
    'thue phong', 'thue nha', 'nha cho thue', 'phong cho thue',
    'xem tat ca phong', 'danh sach phong', 'tat ca bat dong san',
    'phong available', 'con trong',
  ];
  return searchTerms.some((t) => normed.includes(t));
}

// ======= Supabase query =======
interface QueryFilters {
  districtQuery?: string;
  type?: string;
  listingType?: string;
  status?: string;
  maxMonthly?: number;
  maxNightly?: number;
  limit?: number;
}

async function queryProperties(filters: QueryFilters): Promise<PropertyResult[]> {
  try {
    let query = supabase
      .from('properties')
      .select(
        'id,title,address,district,type,price_per_night,price_per_month,sale_price,bedrooms,bathrooms,area,thumbnail,listing_type,status',
      )
      .neq('status', 'hidden')
      .order('is_featured', { ascending: false })
      .limit(filters.limit ?? 6);

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.listingType) query = query.eq('listing_type', filters.listingType);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.maxMonthly) query = query.lte('price_per_month', filters.maxMonthly);
    if (filters.maxNightly) query = query.lte('price_per_night', filters.maxNightly);

    if (filters.districtQuery) {
      query = query.or(
        `district.ilike.%${filters.districtQuery}%,address.ilike.%${filters.districtQuery}%`,
      );
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as PropertyResult[];
  } catch {
    return [];
  }
}

async function fetchPriceStats() {
  try {
    const { data } = await supabase
      .from('properties')
      .select('price_per_night,price_per_month')
      .neq('status', 'hidden');

    const nights = (data ?? []).filter((p) => p.price_per_night).map((p) => p.price_per_night as number);
    const months = (data ?? []).filter((p) => p.price_per_month).map((p) => p.price_per_month as number);

    return {
      minNight: nights.length ? Math.min(...nights) : 700_000,
      maxNight: nights.length ? Math.max(...nights) : 2_500_000,
      minMonth: months.length ? Math.min(...months) : 3_000_000,
      maxMonth: months.length ? Math.max(...months) : 25_000_000,
    };
  } catch {
    return { minNight: 700_000, maxNight: 2_500_000, minMonth: 3_000_000, maxMonth: 25_000_000 };
  }
}

// ======= Format helpers =======
export function formatPropertyPrice(p: PropertyResult): string {
  if (p.listing_type === 'sale' && p.sale_price) {
    const v = p.sale_price;
    return v >= 1_000_000_000
      ? `${(v / 1_000_000_000).toFixed(1)} tỷ`
      : `${(v / 1_000_000).toFixed(0)} triệu`;
  }
  if (p.price_per_night) return `${(p.price_per_night / 1_000).toFixed(0)}k/đêm`;
  if (p.price_per_month) {
    const m = p.price_per_month;
    return m >= 1_000_000
      ? `${(m / 1_000_000).toFixed(1)} tr/tháng`
      : `${m.toLocaleString()}/tháng`;
  }
  return 'Liên hệ';
}

export function formatPropertyType(t: string): string {
  const map: Record<string, string> = {
    homestay: 'Homestay',
    apartment: 'Căn hộ',
    villa: 'Villa',
    room: 'Phòng trọ',
  };
  return map[t] || t;
}

// ======= Detect pure greeting =======
function isPureGreeting(msg: string): boolean {
  const normed = normalize(msg);
  const words = normed.split(/\s+/).filter(Boolean);
  if (words.length <= 3) {
    if (contains(msg, GREETING_KW)) return true;
    if (GREETING_SINGLE.some((g) => words.includes(g))) return true;
  }
  return false;
}

// ======= Main response function =======
export async function getSmartResponse(message: string): Promise<ChatResponse> {
  const lc = message.trim();
  const normed = normalize(lc);

  // Extract structured info
  const areaResult = extractAreaKeyword(lc);
  const budget = extractBudget(lc);
  const hasBudgetWord = /\d/.test(normed) && contains(lc, ['trieu', 'tr ', 'nghin', ' k ', 'ty ', 'tỷ', 'triệu', 'nghìn', 'tài chính', 'ngân sách', 'co bao nhieu', 'chi phi']);
  const hasPropertySearchWord = isPropertySearch(lc);

  // --- 0. Booking intent (customer wants to rent a specific unit) ---
  if (contains(lc, BOOKING_INTENT_KW)) {
    return {
      type: 'booking',
      text: 'Tuyệt vời! Bạn điền thông tin bên dưới để đăng ký thuê nhé — nhân viên sẽ liên hệ xác nhận trong vòng 30 phút!',
    };
  }

  // --- 1. Pure greeting ---
  if (isPureGreeting(lc)) {
    return {
      type: 'text',
      text: 'Xin chào! Mình là tư vấn viên của Đà Lạt Key Stay.\n\nMình có thể giúp bạn tìm phòng theo khu vực & ngân sách, giải đáp thắc mắc về Đà Lạt, hay bất cứ điều gì bạn muốn biết về dịch vụ của mình.\n\nBạn cần hỗ trợ gì nhỉ?',
    };
  }

  // --- 2. Direct contact request ---
  if (contains(lc, CONTACT_KW)) {
    return {
      type: 'collect-info',
      text: 'Để lại thông tin, chuyên viên tư vấn sẽ gọi lại cho bạn ngay!',
    };
  }

  // --- 3. Booking request ---
  if (contains(lc, BOOKING_KW) && !areaResult && !budget) {
    return {
      type: 'collect-info',
      text: 'Để kiểm tra lịch trống và đặt phòng, vui lòng để lại thông tin bên dưới. Nhân viên sẽ hỗ trợ ngay!',
    };
  }

  // --- 4. Budget + Area combined (DB query needed) ---
  if (budget !== null && areaResult) {
    const isNightly = budget <= 3_000_000 && contains(lc, ['ngay', 'dem', 'ngắn ngày', 'homestay', 'du lich']);
    const filters: QueryFilters = {
      districtQuery: areaResult.query,
      limit: 6,
    };
    if (isNightly) filters.maxNightly = budget;
    else filters.maxMonthly = budget;

    const props = await queryProperties(filters);
    const budgetStr = formatBudget(budget);

    if (props.length > 0) {
      const suitable = props.filter((p) => isNightly ? p.price_per_night !== null : p.price_per_month !== null);
      const showProps = suitable.length > 0 ? suitable : props;
      return {
        type: 'properties',
        text: `Với ngân sách **${budgetStr}**, mình tìm được **${showProps.length} lựa chọn** tại **${areaResult.display}**:`,
        properties: showProps,
      };
    }

    const stats = await fetchPriceStats();
    if (budget < stats.minMonth && !isNightly) {
      return {
        type: 'text',
        text: `Với **${budgetStr}/tháng** tại **${areaResult.display}**, hiện mức giá thấp nhất hệ thống đang từ **${formatBudget(stats.minMonth)}/tháng**.\n\nGợi ý: thử khu ngoại ô Xuân Thọ, Lạc Dương giá rẻ hơn, hoặc ở ghép để chia tiền. Bạn muốn mình tìm thêm không?`,
      };
    }

    const fallback = await queryProperties({ districtQuery: areaResult.query, limit: 4 });
    if (fallback.length > 0) {
      return {
        type: 'properties',
        text: `Chưa có phòng khớp chính xác ngân sách **${budgetStr}** tại **${areaResult.display}**. Đây là các phòng gần khu vực đó:`,
        properties: fallback,
      };
    }

    return { type: 'text', text: '', useAI: true };
  }

  // --- 5. Area search only (DB query) ---
  if (areaResult && !budget) {
    const props = await queryProperties({ districtQuery: areaResult.query, limit: 6 });
    if (props.length > 0) {
      return {
        type: 'properties',
        text: `Tìm được **${props.length} bất động sản** tại **${areaResult.display}**:\n\nCho mình biết ngân sách để lọc phù hợp hơn nhé!`,
        properties: props,
      };
    }
    const fallback = await queryProperties({ limit: 4 });
    if (fallback.length > 0) {
      return {
        type: 'properties',
        text: `Hiện chưa có phòng tại **${areaResult.display}**. Dưới đây là các phòng khác tại Đà Lạt bạn tham khảo:`,
        properties: fallback,
      };
    }
    return { type: 'text', text: '', useAI: true };
  }

  // --- 6. Budget only (DB query) ---
  if (budget !== null && hasBudgetWord && !areaResult) {
    const stats = await fetchPriceStats();
    const isNightly = budget <= 2_000_000 && contains(lc, ['ngay', 'dem', 'homestay', 'ngắn ngày']);
    const filters: QueryFilters = { limit: 5 };
    if (isNightly) filters.maxNightly = budget;
    else filters.maxMonthly = budget;
    const props = await queryProperties(filters);

    if (props.length > 0) {
      return {
        type: 'properties',
        text: `Với ngân sách **${formatBudget(budget)}**, đây là các lựa chọn phù hợp nhất:\n\nBạn muốn ở khu vực nào để mình lọc thêm?`,
        properties: props,
      };
    }

    if (budget < stats.minMonth && !isNightly) {
      return {
        type: 'text',
        text: `Với **${formatBudget(budget)}/tháng**, mức giá thực tế tại Đà Lạt đang từ **${formatBudget(stats.minMonth)} – ${formatBudget(stats.maxMonth)}/tháng**.\n\nBạn có thể cân nhắc ở ghép hoặc tìm khu ngoại ô. Bạn có muốn mình tư vấn thêm không?`,
      };
    }

    return { type: 'text', text: '', useAI: true };
  }

  // --- 7. Explicit property list request (DB query) ---
  if (hasPropertySearchWord && !areaResult && !budget) {
    const props = await queryProperties({ status: 'available', limit: 6 });
    if (props.length > 0) {
      return {
        type: 'properties',
        text: `Hiện có **${props.length} bất động sản** đang sẵn sàng tại Đà Lạt:`,
        properties: props,
      };
    }
  }

  // --- 8. ALL other questions → AI handles naturally ---
  // This covers: Đà Lạt info, weather, food, travel, investment advice,
  // general chat, website questions, financial advice, etc.
  return { type: 'text', text: '', useAI: true };
}

export const QUICK_REPLIES = [
  'Tìm phòng theo ngân sách',
  'Khu vực nào đẹp nhất?',
  'Giá thuê hiện tại ra sao?',
  'Xem tất cả phòng trống',
];
