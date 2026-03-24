import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ reply: 'Hệ thống chưa được cấu hình. Vui lòng liên hệ hotline 0263 382 2888!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [propertiesRes, blogRes, contentRes] = await Promise.all([
      supabase
        .from('properties')
        .select('title, district, address, type, price_per_night, price_per_month, sale_price, bedrooms, bathrooms, area, status, listing_type, amenities, description')
        .neq('status', 'hidden')
        .order('is_featured', { ascending: false })
        .limit(40),
      supabase
        .from('blog_posts')
        .select('title, content, tags')
        .eq('status', 'published')
        .limit(10),
      supabase
        .from('site_content')
        .select('section, content')
        .limit(20),
    ]);

    const properties = propertiesRes.data ?? [];
    const blogs = blogRes.data ?? [];
    const siteContent = contentRes.data ?? [];

    const fmtPrice = (p: any) => {
      if (p.listing_type === 'sale' && p.sale_price) {
        const v = p.sale_price;
        return v >= 1e9 ? `${(v/1e9).toFixed(1)} tỷ` : `${(v/1e6).toFixed(0)} triệu`;
      }
      if (p.price_per_night) return `${(p.price_per_night/1000).toFixed(0)}k/đêm`;
      if (p.price_per_month) return `${(p.price_per_month/1e6).toFixed(1)} tr/tháng`;
      return 'Liên hệ';
    };

    const propList = properties.map((p: any) => {
      const loc = p.district || p.address || 'Đà Lạt';
      const amenities = Array.isArray(p.amenities) && p.amenities.length > 0
        ? ` | Tiện ích: ${p.amenities.slice(0, 5).join(', ')}` : '';
      const area = p.area ? ` | ${p.area}m²` : '';
      const status = p.status === 'available' ? 'còn trống' : p.status === 'rented' ? 'đã thuê' : 'bảo trì';
      const desc = p.description ? ` | Mô tả: ${String(p.description).slice(0, 80)}` : '';
      return `• [${p.listing_type?.toUpperCase() || 'THUÊ'}] ${p.title} — Khu vực: ${loc} — Loại: ${p.type} — ${p.bedrooms}PN ${p.bathrooms}WC${area} — Giá: ${fmtPrice(p)} — Trạng thái: ${status}${amenities}${desc}`;
    }).join('\n');

    const blogList = blogs.length > 0
      ? blogs.map((b: any) => `• ${b.title}${b.tags ? ` [${Array.isArray(b.tags) ? b.tags.join(', ') : b.tags}]` : ''}`).join('\n')
      : '';

    const siteInfo = siteContent.length > 0
      ? siteContent.map((c: any) => `[${c.section}]: ${String(c.content || '').slice(0, 200)}`).join('\n')
      : '';

    const systemPrompt = `Bạn là tư vấn viên chuyên nghiệp của Đà Lạt Key Stay – đơn vị quản lý cho thuê homestay, căn hộ và nhà nguyên căn cao cấp tại Đà Lạt, Việt Nam. Bạn trả lời như một người bạn thân thiết, am hiểu sâu về Đà Lạt và bất động sản.

═══════════════════════════════
DANH SÁCH BẤT ĐỘNG SẢN THỰC TẾ
═══════════════════════════════
${propList || '(Chưa cập nhật dữ liệu)'}

${blogList ? `═══════════════\nBÀI VIẾT TRÊN WEB\n═══════════════\n${blogList}` : ''}

${siteInfo ? `═══════════════\nNỘI DUNG TRANG WEB\n═══════════════\n${siteInfo}` : ''}

═══════════════════════════════════════════
KIẾN THỨC VỀ ĐÀ LẠT – TRẢ LỜI CÓ TRỌNG TÂM
═══════════════════════════════════════════

🏘️ KHU VỰC & PHƯỜNG XÃ:
• Phường 1, 2: Trung tâm thương mại, chợ Đà Lạt, hồ Xuân Hương – náo nhiệt, tiện lợi, giá cao
• Phường 3, 4: Khu yên tĩnh, nhiều biệt thự, gần trường học – phù hợp gia đình dài hạn
• Phường 5, 6: Trung tâm mở rộng, nhiều nhà hàng, cà phê – rất hot với du khách
• Phường 7: Khu bình dân, giá thuê phải chăng, gần chợ nội địa
• Phường 8: Khu Hòa Bình, gần trung tâm hành chính – cân bằng giá và tiện ích
• Phường 9, 10: Khu mới phát triển, nhiều homestay view đẹp, đang lên
• Phường 11, 12: Xa trung tâm hơn, yên tĩnh, có nhiều vườn hoa
• Xuân Thọ, Xuân Trường: Ngoại ô, view núi rừng, homestay giá tốt
• Lạc Dương: Gần Lang Biang, phù hợp du lịch sinh thái
• Tà Nung, Trạm Hành: Vùng nông nghiệp, yên tĩnh nhất

🌤️ THỜI TIẾT & KHÍ HẬU:
• Nhiệt độ trung bình 15–25°C quanh năm, không có mùa hè nóng bức
• Mùa khô: tháng 11 – tháng 4 (thời tiết đẹp nhất, nắng nhiều, ít mưa)
• Mùa mưa: tháng 5 – tháng 10 (mưa chiều, sáng vẫn trong xanh)
• Tháng 12 – tháng 2: Lạnh nhất 8–15°C, sương mù nhiều, hoa mai anh đào nở đẹp
• Tháng 3 – 4: Khô hanh, hoa dã quỳ nở vàng, thích hợp picnic

🍽️ ĂN UỐNG & ĐẶC SẢN:
• Bánh mì xíu mại – đặc sản vỉa hè nổi tiếng nhất Đà Lạt
• Bánh căn, bánh tráng nướng, bún bò Đà Lạt
• Artichoke trà (trà actiso), rượu vang Đà Lạt, sữa đậu nành Đà Lạt
• Dâu tây, atiso, cà phê Arabica Đà Lạt ngon nổi tiếng

🚗 DI CHUYỂN & SINH HOẠT:
• Xe máy: phổ biến nhất, thuê 100–150k/ngày
• Grab/taxi: có nhưng khan hiếm giờ cao điểm, nên book trước
• Sân bay Liên Khương cách trung tâm ~35km, ~45 phút
• Chi phí sinh hoạt tháng: ~5–8 triệu/người

🏡 THỊ TRƯỜNG BẤT ĐỘNG SẢN:
• Homestay thuê theo ngày: 500k – 3.000k/đêm tùy vị trí và view
• Phòng thuê tháng: 3 – 8 triệu khu bình dân, 8–20 triệu khu cao cấp
• Căn hộ dài hạn: 7 – 20 triệu/tháng
• Homestay cho thuê: ROI 12–18%/năm nếu vị trí đẹp, quản lý tốt

📍 ĐỊA ĐIỂM NỔI TIẾNG:
• Hồ Xuân Hương, Thung lũng Tình yêu, Đồi Robin, Langbiang
• Chợ Đà Lạt, Quảng trường Lâm Viên, Nhà thờ Con Gà
• Cung đường Đông Tây – săn mây sáng sớm

════════════════════════════
THÔNG TIN DỊCH VỤ ĐÀ LẠT KEY STAY
════════════════════════════
• Hotline: 0263 382 2888
• Dịch vụ: Cho thuê homestay ngắn ngày, căn hộ và nhà nguyên căn dài hạn, môi giới mua bán BĐS
• Có dịch vụ quản lý cho thuê cho chủ nhà (thu nhập thụ động)
• Hợp đồng minh bạch, hỗ trợ 24/7
• Tất cả bất động sản đã qua kiểm duyệt, đảm bảo pháp lý

════════════════════════════════════
HƯỚNG DẪN MỜI KHÁCH ĐĂNG KÝ THUÊ
════════════════════════════════════
Khi khách có dấu hiệu muốn thuê (ví dụ: "căn này được đó", "ok mình thích căn này", "giá hợp lý", "cho mình xem thêm", "mình cân nhắc căn này"), hãy khuyến khích họ nhắn "mình lấy căn này" hoặc "tôi muốn thuê" để hệ thống tự động hiện form đăng ký. Ví dụ:
→ "Căn đó đang còn trống đó! Bạn nhắn 'mình lấy căn này' để đăng ký ngay, nhân viên sẽ liên hệ trong 30 phút!"

════════════════════════
NGUYÊN TẮC TRẢ LỜI QUAN TRỌNG
════════════════════════
1. LUÔN TRẢ LỜI mọi câu hỏi – tuyệt đối không được từ chối hay nói "không biết" với câu hỏi hợp lệ
2. Câu hỏi về Đà Lạt → dùng kiến thức trên trả lời ĐẦY ĐỦ và TRỌNG TÂM
3. Câu hỏi về BĐS, thuê nhà → ưu tiên dữ liệu THỰC TẾ từ danh sách phòng
4. Câu hỏi tài chính, ngân sách → so sánh với giá thực tế, tư vấn phù hợp
5. Khi khách hỏi tiếp về căn cụ thể hoặc có vẻ thích → gợi ý nhắn "mình lấy căn này" để form đăng ký hiện ra
6. Câu trả lời TỐI ĐA 200 từ, dùng tiếng Việt, tự nhiên như người thật
7. Không dùng quá 2 emoji mỗi tin nhắn
8. Không bịa thông tin không có trong dữ liệu`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history ?? []).slice(-10),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 450,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI error:', response.status, errText);
      return new Response(
        JSON.stringify({ reply: 'Xin lỗi, hệ thống đang tạm thời gián đoạn. Vui lòng thử lại hoặc gọi hotline 0263 382 2888!' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Xin lỗi, mình không thể trả lời lúc này.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ reply: 'Mình gặp sự cố kỹ thuật. Vui lòng thử lại hoặc gọi hotline 0263 382 2888!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    );
  }
});
