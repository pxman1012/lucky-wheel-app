# 🎡 Vòng Quay May Mắn

Web app vòng quay ngẫu nhiên viết bằng **Next.js (App Router)**: nhập các lựa chọn, bấm quay, nhận kết quả. Giao diện gọn, chạy tốt trên cả điện thoại lẫn máy tính, cài được như một PWA. Không cần database: dữ liệu lưu ngay trên máy người dùng, chia sẻ qua link.

## Tính năng

- **Vòng quay SVG**: chữ trắng đậm, tự lật ở nửa trái để luôn đọc xuôi, tên dài tự cắt kèm "…". Bấm vào vòng hoặc nút **QUAY** ở tâm để quay.
- **Kim rung và tiếng "tách"** mỗi khi lướt qua một ô (âm thanh tạo bằng Web Audio, có nút tắt/bật).
- **Thêm nhanh**: gõ rồi nhấn Enter; dán nhiều dòng sẽ thêm nhiều mục cùng lúc. Bấm vào tên một mục để sửa tại chỗ.
- **Chế độ Nâng cao**: bật công tắc để chỉnh *trọng số* (xác suất) và xem tỉ lệ %. Mặc định ẩn cho đơn giản.
- **Kết quả**: popup kèm pháo giấy, hai nút **Quay tiếp** và **Loại bỏ mục này** (tiện khi bốc thăm lần lượt).
- **Hoàn tác** sau khi xoá một mục, xoá tất cả hoặc áp dụng mẫu (không có hộp thoại xác nhận phiền phức).
- **Mẫu có sẵn** (public): Ăn gì?, Ai trả tiền?, Có / Không, PES: CLB, PES: ĐTQG.
- **Mẫu của tôi**: lưu tối đa 12 mẫu ngay trên máy, dùng lại nhiều lần.
- **Chia sẻ bằng link** cho cả mẫu có sẵn lẫn mẫu tự tạo, không cần server.
- **Lịch sử** 5 kết quả gần nhất.
- **Sáng / Tối**: theo hệ thống, đổi tay được, không bị nháy màu khi tải trang.
- **Lưu tự động** vào `localStorage` (danh sách, chế độ nâng cao, lịch sử, âm thanh, theme, mẫu của tôi).
- **PWA**: có manifest và service worker (chỉ bật ở production).
- Tôn trọng `prefers-reduced-motion`.

## Chạy ở máy

Yêu cầu Node.js 18.18 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000

Build production:

```bash
npm run build
npm start
```

## Mẫu và chia sẻ

### Mẫu có sẵn

Khai báo trong mảng `PRESETS` ở `lib/constants.js`. Link chia sẻ dùng vị trí trong mảng nên **chỉ thêm vào cuối, không đổi thứ tự và không xoá**, kẻo link cũ mở sai mẫu.

```js
{ id: "food", label: "Ăn gì?", options: ["Cơm", "Phở", "Bún chả"] },
```

### Mẫu của tôi

- Lưu trong `localStorage` (khoá `lucky-wheel:drafts`), tối đa `MAX_DRAFTS` = 12 mẫu.
- Đủ 12 mẫu thì không tự xoá mẫu cũ; nút lưu bị khoá kèm thông báo.
- Lưu trùng tên (không phân biệt hoa thường) sẽ ghi đè mẫu cũ.
- Dữ liệu chỉ nằm trên trình duyệt của bạn. Đổi máy hoặc xoá dữ liệu trình duyệt thì mất; muốn mang sang máy khác hãy dùng nút **Chia sẻ**.

### Link chia sẻ

| Link | Ý nghĩa |
| --- | --- |
| `/?i=3` | Mở mẫu có sẵn thứ 4 (tính từ 0) trong `PRESETS` |
| `/?p=pes-clubs` | Mở mẫu có sẵn theo `id` (bền hơn khi đổi thứ tự) |
| `/?d=<mã hoá>` | Mở một danh sách tự tạo; dữ liệu được mã hoá base64url ngay trong link (khoảng 200-300 ký tự cho 15 mục) |

Khi mở link, danh sách hiện tại được thay thế nhưng vẫn có toast **Hoàn tác**. Sau đó URL được dọn sạch để F5 không áp dụng lại.

## Cấu trúc thư mục

```
app/
  layout.js            # font, metadata, script đặt theme, đăng ký service worker
  page.js              # trang chủ, chỉ render <LuckyWheel />
  globals.css          # design tokens (màu, bo góc) cho theme sáng/tối + reset
  manifest.js          # web app manifest (PWA)
  favicon.ico

components/
  LuckyWheel.jsx       # component gốc: nối state, hooks, đọc link chia sẻ
  LuckyWheel.module.css# bố cục tổng (lưới 2 cột / xếp dọc trên mobile)
  Header.jsx           # tiêu đề + nút âm thanh + nút đổi theme
  Wheel.jsx            # vòng quay SVG, kim, nút QUAY ở tâm (thuần hiển thị)
  History.jsx          # các kết quả gần đây
  ResultModal.jsx      # popup kết quả
  Confetti.jsx         # pháo giấy bằng canvas
  Toast.jsx            # thông báo + nút Hoàn tác
  Icons.jsx            # icon SVG dùng chung
  RegisterSW.jsx       # đăng ký/gỡ service worker
  options/
    OptionsPanel.jsx   # khung bên phải: ghép form + danh sách + mẫu
    OptionForm.jsx     # ô nhập + nút "+"
    OptionList.jsx     # danh sách, sửa tên tại chỗ, xoá
    WeightStepper.jsx  # bộ tăng/giảm trọng số
    PresetPicker.jsx   # tab "Có sẵn" / "Của tôi", lưu mẫu, chia sẻ
    options.module.css
    presets.module.css

hooks/
  useLocalStorage.js   # useState có lưu localStorage (an toàn với SSR)
  useOptions.js        # thêm/xoá/sửa lựa chọn, thay thế danh sách, hoàn tác
  useDrafts.js         # "Mẫu của tôi" (tối đa 12, lưu local)
  useSpin.js           # vòng lặp quay bằng requestAnimationFrame
  useSound.js          # tiếng tách + tiếng thắng (Web Audio)
  useTheme.js          # đổi theme sáng/tối

lib/
  constants.js         # bảng màu, mặc định, mẫu có sẵn, giới hạn, khoá localStorage
  options.js           # hàm thuần: tạo/chuẩn hoá/đọc lựa chọn
  wheel.js             # hàm thuần: chia ô, bốc ngẫu nhiên, tính góc dừng, hình học SVG
  share.js             # mã hoá/giải mã danh sách trong link chia sẻ

public/
  sw.js                # service worker
  icons/               # icon PWA
```

### Quy ước

- `lib/` chỉ chứa **hàm thuần**, không phụ thuộc React, dễ test riêng.
- `hooks/` chứa state và side-effect, không render JSX.
- `components/` là UI; mỗi component đi kèm một file `.module.css` (style được scope riêng).
- Import dùng alias `@/` (cấu hình trong `jsconfig.json`), ví dụ `import { PALETTE } from "@/lib/constants"`.
- Màu sắc luôn lấy từ biến CSS trong `globals.css` (`var(--accent)`, `var(--surface)`...), nên đổi giao diện chỉ cần sửa một chỗ.
- Thụt lề 4 space cho file `.js` và `.jsx`. Format nhanh bằng `npx prettier --tab-width 4 --write "**/*.{js,jsx}"`.

## Cách vòng quay hoạt động

1. `computeSegments` chia 360° theo trọng số, gán màu cho từng ô.
2. `pickWeightedSegment` bốc kết quả **trước khi quay**, xác suất đúng bằng kích thước ô.
3. `computeTargetRotation` tính góc dừng sao cho kim nằm trong ô đó (quay 6 đến 8 vòng, luôn tiến về phía trước).
4. `useSpin` chạy animation bằng `requestAnimationFrame` và ghi góc quay thẳng vào DOM, nên không phải render lại React 60 lần/giây. Mỗi khi `segmentAt` đổi ô, kim rung và phát tiếng tách.

## Tuỳ chỉnh nhanh

| Muốn đổi | Sửa ở |
| --- | --- |
| Danh sách mặc định | `DEFAULT_OPTIONS` trong `lib/constants.js` |
| Mẫu có sẵn | `PRESETS` trong `lib/constants.js` (chỉ thêm vào cuối) |
| Bảng màu các ô | `PALETTE` trong `lib/constants.js` (giữ 8 màu cùng độ đậm, xen kẽ ấm/lạnh) |
| Thời gian quay | `SPIN_DURATION_MS` trong `lib/constants.js` |
| Số mục tối đa, độ dài tên, giới hạn trọng số | `MAX_OPTIONS`, `MAX_LABEL_LENGTH`, `MAX_WEIGHT` |
| Số mẫu tự lưu tối đa | `MAX_DRAFTS`, `MAX_DRAFT_NAME` |
| Màu giao diện sáng/tối | biến CSS trong `app/globals.css` |
| Font | `app/layout.js`: Nunito (nội dung) và Baloo 2 (tiêu đề, chữ trên vòng, nút QUAY) qua `next/font` |

## Triển khai

### Vercel (nhanh nhất)

1. Đẩy project lên GitHub.
2. Vào https://vercel.com/new, chọn repo, bấm **Deploy** (Vercel tự nhận diện Next.js).

Hoặc dùng CLI:

```bash
npm install -g vercel
vercel
```

### Netlify

1. Đẩy code lên GitHub.
2. Trên Netlify: **Add new site → Import an existing project**.
3. Build command: `npm run build` (Netlify tự dùng plugin Next.js khi phát hiện dự án).

## Ghi chú

- Service worker chỉ đăng ký ở production. Khi chạy `npm run dev`, app tự gỡ service worker cũ để tránh dính cache.
- Nếu đổi danh sách file cần cache offline, tăng `CACHE_NAME` trong `public/sw.js`.
- Dữ liệu cũ (định dạng `qty`) trong `localStorage` vẫn được đọc và tự chuyển sang `weight`.
- Link chia sẻ dùng `window.location.origin`, nên hoạt động đúng trên mọi domain sau khi deploy.