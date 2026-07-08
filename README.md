# Vòng Quay May Mắn

Web app Next.js (App Router) cho vòng quay random tuỳ chỉnh: thêm/xoá lựa chọn, chỉnh số lượng (trọng số), quay và hiển thị popup kết quả.

## Chạy thử ở local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Cấu trúc project

```
app/
  layout.js
  page.js
  globals.css                    # font import, reset, focus-visible dùng chung
  components/
    lucky-wheel/
      index.jsx                  # gốc: gộp state + các block UI
      constants.js                # bảng màu, danh sách mặc định
      utils.js                    # hàm thuần: tính lát cắt, gradient, quay số
      hooks/
        useOptions.js             # thêm/xoá/sửa trọng số/xoá tất cả
        useSpin.js                # trạng thái quay, người thắng, popup
      Header.jsx / .module.css
      OptionsPanel.jsx / .module.css   # form nhập + danh sách + thống kê
      Wheel.jsx / .module.css          # gộp WheelDial + SpinButton
      WheelDial.jsx                    # mặt vòng quay (thuần hiển thị)
      SpinButton.jsx                   # nút Quay (thuần hiển thị)
      ResultModal.jsx / .module.css    # popup kết quả
      LuckyWheel.module.css            # layout tổng (page/grid)
package.json
next.config.js
```

Quy ước phân tách:
- `hooks/` chứa state + side-effect logic, không render JSX.
- `utils.js` chỉ chứa hàm thuần (pure function), dễ test độc lập.
- Mỗi component UI đi kèm 1 file `.module.css` cùng tên — style được scope riêng, không rò rỉ class name ra ngoài.
- Style tĩnh (màu, spacing, transition...) nằm trong CSS Module; style động phụ thuộc dữ liệu (góc quay, gradient theo số lượng option) vẫn để inline vì không thể biết trước ở compile-time.


## Deploy lên Vercel

Cách nhanh nhất (không cần cài gì thêm):

1. Đẩy project này lên một repo GitHub (repo riêng của bạn).
2. Vào https://vercel.com/new, chọn "Import Git Repository", chọn repo vừa tạo.
3. Vercel tự nhận diện đây là project Next.js — bấm **Deploy**.

Hoặc dùng Vercel CLI:

```bash
npm install -g vercel
vercel
```

Làm theo hướng dẫn trên terminal (đăng nhập, chọn project name, v.v.), sau khi xong Vercel sẽ trả về URL production.

## Deploy lên Netlify (thay thế)

1. Đẩy code lên GitHub.
2. Trên Netlify, chọn "Add new site" -> "Import an existing project".
3. Build command: `npm run build`, Publish directory: `.next` (dùng plugin `@netlify/plugin-nextjs`, Netlify thường tự cấu hình khi phát hiện Next.js).

## Tuỳ chỉnh nhanh

- Danh sách lựa chọn mặc định nằm trong `DEFAULT_OPTIONS` ở đầu file `LuckyWheel.jsx`.
- Bảng màu các lát cắt nằm trong mảng `PALETTE`.
- Thời gian quay / số vòng quay nằm trong hàm `spin()` (biến `durationMs`, `fullSpins`).
