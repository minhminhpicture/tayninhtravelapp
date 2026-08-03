# tayninh-lnm-vn

> **PRODUCTION DUY NHẤT: https://tayninh.lnm.vn**

Ứng dụng mobile-first giới thiệu du lịch Tây Ninh, hỗ trợ khách khám phá điểm đến, xem tour, thuê xe và đặt đặc sản qua Zalo.

## Nhận diện dự án

| Thành phần | Giá trị chính thức |
| --- | --- |
| Domain production | `tayninh.lnm.vn` |
| GitHub | `minhminhpicture/tayninhtravelapp` |
| Vercel project | `tayninh-lnm-vn` |
| Tên package | `tayninh-lnm-vn` |
| Thư mục local | `tayninh-lnm-vn` |

Tên GitHub hiện tại được giữ tạm thời vì tài khoản đang đăng nhập chưa có quyền quản trị repository. Khi đổi được quyền, hãy đổi GitHub thành `minhminhpicture/tayninh-lnm-vn` và cập nhật bảng này.

## Quy tắc an toàn

- Chỉ triển khai production lên `tayninh.lnm.vn`.
- Không dùng `tayninhtravel.lnm.vn`, `tayninhtravel` hoặc `app-beta-gold` làm đích triển khai.
- Trước mỗi lần sửa hoặc xuất bản, kiểm tra Git remote và Vercel project phải khớp bảng nhận diện ở trên.
- Không xóa hoặc thay đổi `.openai/hosting.json` nếu chưa xác minh project ID.

## Phát triển

Yêu cầu Node.js `>=22.13.0`.

```bash
npm install
npx next build
```

Ứng dụng sử dụng Next.js, Vinext và Lucide Icons. Trạng thái yêu thích, lịch trình và bản nháp thuê xe được lưu cục bộ trên thiết bị người dùng.
