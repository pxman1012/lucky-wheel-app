/**
 * Quy ước icon (chuỗi ngắn, an toàn khi nhận từ link chia sẻ):
 *   "🍕"               -> emoji
 *   "flag:br"          -> cờ quốc gia (flagcdn.com)
 *   "logo:real-madrid" -> file /public/logos/real-madrid.png
 */

const CODE_RE = /^(flag|logo):[a-z0-9-]{1,40}$/;
const EMOJI_RE = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{Emoji_Modifier}|[\u200d\ufe0f\u20e3])+$/u;
const LEADING_EMOJI_RE =
    /^(\p{Extended_Pictographic}(?:[\ufe0f\u20e3]|\p{Emoji_Modifier}|\u200d\p{Extended_Pictographic})*)\s*/u;

/** Chỉ cho phép emoji hoặc mã flag:/logo: hợp lệ; còn lại bỏ (chặn URL lạ từ link chia sẻ). */
export function sanitizeIcon(value) {
    if (typeof value !== "string") return undefined;
    const s = value.trim();
    if (CODE_RE.test(s)) return s;
    if (s.length <= 16 && EMOJI_RE.test(s)) return s;
    return undefined;
}

/** Biến icon thành thông tin để vẽ: { type: "emoji" | "flag" | "logo", text?, src? } */
export function resolveIcon(icon) {
    if (!icon) return null;
    if (icon.startsWith("flag:")) {
        return { type: "flag", src: `https://flagcdn.com/w80/${icon.slice(5)}.png` };
    }
    if (icon.startsWith("logo:")) {
        return { type: "logo", src: `/logos/${icon.slice(5)}.png` };
    }
    return { type: "emoji", text: icon };
}

/** "🍕 Pizza" -> { icon: "🍕", label: "Pizza" } */
export function splitIcon(raw) {
    const text = String(raw ?? "").trim();
    const match = text.match(LEADING_EMOJI_RE);
    if (!match) return { label: text, icon: undefined };
    return { label: text.slice(match[0].length), icon: match[1] };
}