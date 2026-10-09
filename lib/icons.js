/**
 * Quy ước icon (chuỗi ngắn):
 *   "🍕"                     -> emoji
 *   "flag:br"                -> cờ quốc gia (file /public/flags/br.svg)
 *   "logo:real-madrid"       -> file /public/logos/real-madrid.png
 *   "food:pho"               -> file /public/food/pho.jpg
 *   "img:data:image/webp;..." -> ảnh người dùng tải lên, bo tròn
 *   "sq:data:image/webp;..."  -> ảnh người dùng tải lên, bo góc vuông
 *
 * Ảnh tải lên (img:/sq:) chỉ được lưu trên máy; link chia sẻ không mang theo.
 */

const CODE_RE = /^(flag|logo|food):[a-z0-9-]{1,40}$/;
const UPLOAD_RE = /^(img|sq):data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/;
const MAX_UPLOAD_LENGTH = 80000; // ~60 KB, ảnh 128x128 thường chỉ 5-12 KB
const EMOJI_RE =
    /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|[\u200d\ufe0f\u20e3])+$/u;
const LEADING_EMOJI_RE =
    /^(\p{Extended_Pictographic}(?:[\ufe0f\u20e3]|\p{Emoji_Modifier}|\u200d\p{Extended_Pictographic})*)\s*/u;

export const isUploadIcon = (icon) =>
    typeof icon === "string" && (icon.startsWith("img:") || icon.startsWith("sq:"));

/**
 * Chỉ cho phép emoji hoặc mã flag:/logo:/food: hợp lệ; còn lại bỏ.
 * `allowUpload` chỉ bật cho dữ liệu đã nằm trên máy (localStorage, người dùng vừa chọn ảnh),
 * KHÔNG bật cho dữ liệu đến từ link chia sẻ.
 */
export function sanitizeIcon(value, allowUpload = false) {
    if (typeof value !== "string") return undefined;
    const s = value.trim();
    if (CODE_RE.test(s)) return s;
    if (allowUpload && s.length <= MAX_UPLOAD_LENGTH && UPLOAD_RE.test(s)) return s;
    if (s.length <= 16 && EMOJI_RE.test(s)) return s;
    return undefined;
}

/** Biến icon thành thông tin để vẽ: { type: "emoji" | "flag" | "food" | "logo" | "upload", ... } */
export function resolveIcon(icon) {
    if (!icon) return null;
    if (icon.startsWith("img:")) return { type: "upload", round: true, src: icon.slice(4) };
    if (icon.startsWith("sq:")) return { type: "upload", round: false, src: icon.slice(3) };
    if (icon.startsWith("flag:")) return { type: "flag", src: `/flags/${icon.slice(5)}.svg` };
    if (icon.startsWith("food:")) return { type: "food", src: `/food/${icon.slice(5)}.jpg` };
    if (icon.startsWith("logo:")) return { type: "logo", src: `/logos/${icon.slice(5)}.png` };
    return { type: "emoji", text: icon };
}

/** "🍕 Pizza" -> { icon: "🍕", label: "Pizza" } */
export function splitIcon(raw) {
    const text = String(raw ?? "").trim();
    const match = text.match(LEADING_EMOJI_RE);
    if (!match) return { label: text, icon: undefined };
    return { label: text.slice(match[0].length), icon: match[1] };
}