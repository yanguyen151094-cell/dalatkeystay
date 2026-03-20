# Key Stay Đà Lạt – Nền Tảng Cho Thuê Căn Hộ

## 1. Mô Tả Dự Án
Website cho thuê căn hộ Đà Lạt thương hiệu **Key Stay Đà Lạt**. Admin trực tiếp quản lý căn hộ, booking, khách thuê, nội dung website mà không cần chỉnh code. SEO chuẩn để hiển thị trên Google.

## 2. Cấu Trúc Trang Hiện Tại
- `/` – Trang Chủ (Home) ✅
- `/search` – Tìm Kiếm Phòng ✅
- `/homestay` – Homestay & Villa ✅
- `/apartment` – Căn Hộ Mua Bán ✅
- `/map` – Bản Đồ ✅
- `/contact` – Liên Hệ ✅
- `/faq` – Câu Hỏi Thường Gặp ✅
- `/property/:id` – Chi Tiết Bất Động Sản ✅

## 3. Tính Năng Đã Hoàn Thành
- [x] Trang chủ Key Stay với hero, tìm kiếm nhanh, featured listings
- [x] Tìm kiếm theo khu vực, loại hình, giá
- [x] Danh sách căn hộ cho thuê / homestay / mua bán
- [x] Tích hợp Google Maps
- [x] Form liên hệ
- [x] Chatbot AI trả lời tự động + thu thập lead
- [x] SEO: meta tags, Schema.org LodgingBusiness, geo tags, OG tags
- [x] Thương hiệu Key Stay Đà Lạt
- [x] Supabase Auth + AdminAuthContext (2 cấp: super_admin / operator)
- [x] Trang đăng nhập admin `/admin/login`
- [x] Dashboard `/admin/dashboard` – thống kê tổng quan
- [x] Quản lý căn hộ `/admin/properties` – CRUD đầy đủ, phân quyền
- [x] Quản lý booking `/admin/bookings` – tạo/sửa, trạng thái, thanh toán
- [x] Quản lý khách thuê `/admin/tenants` – CRUD
- [x] Protected routes + redirect về login nếu chưa đăng nhập

## 4. Yêu Cầu Quyền Admin (Cần Supabase)

### Admin Cấp 1 (Toàn quyền)
- Căn hộ/phòng: Thêm, sửa, xóa, giá, mô tả, hình ảnh, tiện ích
- Booking: Xem, cập nhật, hủy, hoàn tiền
- Khách thuê: Xem, sửa, xóa, gửi thông báo/email marketing
- Nội dung web: Thêm/sửa/xóa bài viết, banner, menu
- Thống kê & báo cáo: Doanh thu, phòng trống, khách quay lại
- Quyền & bảo mật: Tạo/sửa/xóa admin, 2FA, nhật ký truy cập
- SEO & Marketing: Quản lý title/meta, chatbot, email marketing

### Admin Cấp 2 (Vận hành)
- Căn hộ/phòng: Thêm/sửa giá, mô tả, hình ảnh; không xóa căn hộ
- Booking: Xác nhận trạng thái (đang xử lý → đã xác nhận → trả phòng)
- Khách thuê: Xem, gửi thông báo; không xóa khách
- Nội dung web: Thêm/sửa bài viết, banner; không xóa trang quan trọng
- Thống kê & báo cáo: Chỉ xem
- SEO & Marketing: Chỉ thao tác theo hướng dẫn

## 5. Kế Hoạch Phát Triển

### Phase 1: Website Frontend (HOÀN THÀNH ✅)
- Toàn bộ giao diện, trang, chatbot, SEO
- Thương hiệu Key Stay Đà Lạt

### Phase 2: Hệ Thống Admin + Database (HOÀN THÀNH ✅)
**Cần kết nối Supabase trước:**
- Trang đăng nhập admin (`/admin/login`)
- Dashboard admin (`/admin/dashboard`)
- Quản lý căn hộ (`/admin/properties`) – CRUD đầy đủ
- Quản lý booking (`/admin/bookings`)
- Quản lý khách thuê (`/admin/tenants`)
- Thống kê doanh thu (`/admin/analytics`)
- Phân quyền Admin Cấp 1 & Cấp 2

### Phase 3: Booking Flow (SAU PHASE 2)
- Khách đặt phòng online trực tiếp từ website
- Xác nhận email tự động
- Quản lý lịch phòng trống
- Thanh toán online (Stripe)

## 6. SEO Đã Triển Khai
- Title & meta description tối ưu từ khóa "cho thuê căn hộ Đà Lạt"
- Schema.org LodgingBusiness + AggregateRating
- Geo tags: Đà Lạt, Lâm Đồng (11.9404, 108.4583)
- Open Graph + Twitter Card
- Canonical URL

## 7. Tích Hợp Bên Thứ Ba
- Supabase: Cần kết nối (Phase 2 - admin panel, database)
- Google Maps: Nhúng iframe embed ✅
- Readdy Forms: Form liên hệ ✅
- Chatbot AI: Tích hợp sẵn ✅