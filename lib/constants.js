// Bảng màu xoay vòng cho các ô. Đủ đậm để chữ trắng luôn dễ đọc.
export const PALETTE = [
    "#4F46E5", // indigo
    "#DB2777", // pink
    "#D97706", // amber
    "#059669", // emerald
    "#2563EB", // blue
    "#EA580C", // orange
    "#7C3AED", // violet
    "#0D9488", // teal
];

export const DEFAULT_OPTIONS = [
    { label: "Trà sữa", weight: 2 },
    { label: "Cơm gà", weight: 1 },
    { label: "Bún chả", weight: 1 },
    { label: "Pizza", weight: 1 },
];

/**
 * Mẫu có sẵn (public). Link chia sẻ dùng vị trí trong mảng (?i=0, ?i=1...)
 * nên CHỈ THÊM VÀO CUỐI, không đổi thứ tự / không xoá, kẻo link cũ mở sai mẫu.
 */
export const PRESETS = [
    { id: "food", label: "Ăn gì?", options: ["Cơm", "Phở", "Bún chả", "Pizza", "Lẩu", "Bánh mì"] },
    { id: "pay", label: "Ai trả tiền?", options: ["Mình", "Bạn A", "Bạn B", "Bạn C"] },
    { id: "yesno", label: "Có / Không", options: ["Có", "Không"] },
        {
        id: "pes-clubs",
        label: "⚽ PES: CLB",
        options: [
            "Real Madrid",
            "Barcelona",
            "Man City",
            "Man United",
            "Liverpool",
            "Chelsea",
            "Arsenal",
            "Tottenham",
            "Newcastle",
            "Aston Villa",
            "Bayern",
            "Dortmund",
            "Leverkusen",
            "PSG",
            "Marseille",
            "Juventus",
            "AC Milan",
            "Inter Milan",
            "Napoli",
            "AS Roma",
            "Atletico Madrid",
            "Benfica",
            "Porto",
            "Ajax",
        ],
    },
    {
        id: "pes-nations",
        label: "🏆 PES: ĐTQG",
        options: [
            "Brazil",
            "Argentina",
            "Pháp",
            "Anh",
            "Đức",
            "Tây Ban Nha",
            "Bồ Đào Nha",
            "Hà Lan",
            "Ý",
            "Bỉ",
            "Croatia",
            "Uruguay",
            "Colombia",
            "Thụy Sĩ",
            "Đan Mạch",
            "Ba Lan",
            "Thụy Điển",
            "Ma-rốc",
            "Senegal",
            "Ai Cập",
            "Nhật Bản",
            "Hàn Quốc",
            "Mexico",
            "Mỹ",
        ],
    },
];

export const MIN_WEIGHT = 1;
export const MAX_WEIGHT = 99;
export const MAX_OPTIONS = 50;
export const MAX_LABEL_LENGTH = 40;

export const MAX_DRAFTS = 12;
export const MAX_DRAFT_NAME = 30;

export const SPIN_DURATION_MS = 5000;
export const HISTORY_LIMIT = 5;
export const UNDO_TIMEOUT_MS = 6000;

export const STORAGE_KEYS = {
    options: "lucky-wheel:options",
    advanced: "lucky-wheel:advanced",
    history: "lucky-wheel:history",
    muted: "lucky-wheel:muted",
    theme: "lucky-wheel:theme",
    drafts: "lucky-wheel:drafts",
};