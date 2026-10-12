// Thông tin site dùng chung cho SEO (metadata, sitemap, robots, JSON-LD).
// Khi gắn tên miền riêng, chỉ cần đặt biến môi trường NEXT_PUBLIC_SITE_URL trên Vercel
// (ví dụ https://vongquay.example.com), không cần sửa code.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://pxman-lucky-wheel.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Vòng Quay May Mắn";

export const SITE_TITLE = "Vòng Quay May Mắn Online - Quay ngẫu nhiên miễn phí";

export const SITE_DESCRIPTION =
    "Vòng quay may mắn online miễn phí: tự tạo danh sách, quay chọn ngẫu nhiên ăn gì, ai trả tiền, đội PES. Có hình ảnh, chia sẻ bằng link, dùng được cả khi mất mạng.";

export const SITE_KEYWORDS = [
    "vòng quay may mắn",
    "vòng quay ngẫu nhiên",
    "vòng quay online",
    "random ăn gì",
    "ai trả tiền",
    "quay chọn người",
    "bốc thăm online",
    "random đội PES",
];

export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };
