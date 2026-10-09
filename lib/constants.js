// Bảng màu dịu, cùng độ đậm, xen kẽ ấm/lạnh để các ô cạnh nhau luôn hài hòa.
export const PALETTE = [
    "#6366D9", // indigo
    "#E0698F", // hồng
    "#3FA58F", // xanh ngọc
    "#E39A45", // cam mơ
    "#4C8FD6", // xanh da trời
    "#B166D1", // tím lan
    "#58A85F", // xanh lá
    "#E2705F", // san hô
];

// Rút gọn khai báo mục có hình.
const club = (label, slug) => ({ label, icon: `logo:${slug}` }); // cần file public/logos/<slug>.png
const nation = (label, code) => ({ label, icon: `flag:${code}` }); // mã ISO 2 ký tự (gb-eng cho Anh)

export const DEFAULT_OPTIONS = [
    { label: "Trà sữa", weight: 2, icon: "🥤" },
    { label: "Cơm gà", weight: 1, icon: "🍗" },
    { label: "Bún chả", weight: 1, icon: "🍖" },
    { label: "Pizza", weight: 1, icon: "🍕" },
];

/**
 * Mẫu có sẵn (public). Link chia sẻ dùng vị trí trong mảng (?i=0, ?i=1...)
 * nên CHỈ THÊM VÀO CUỐI, không đổi thứ tự / không xoá, kẻo link cũ mở sai mẫu.
 */
export const PRESETS = [
    {
        id: "food",
        label: "Ăn gì?",
        // options: [
        //     { label: "Cơm", icon: "🍚" },
        //     { label: "Phở", icon: "🍜" },
        //     { label: "Bún chả", icon: "🍜" },
        //     { label: "Pizza", icon: "🍕" },
        //     { label: "Lẩu", icon: "🍲" },
        //     { label: "Bánh mì", icon: "🥖" },
        //     { label: "Xiên bẩn", icon: "🍢" },
        //     { label: "Bánh tráng", icon: "🌮" },
        //     { label: "Chè", icon: "🥣" },
        //     { label: "Kem", icon: "🍦" },
        //     { label: "Nướng", icon: "🥩" },
        // ],
        options: [
            { label: "Cơm", icon: "food:com" },
            { label: "Phở", icon: "food:pho" },
            { label: "Bún chả", icon: "food:bun-cha" },
            { label: "Pizza", icon: "food:pizza" },
            { label: "Bánh mì", icon: "food:banh-mi" },
            { label: "Xiên bẩn", icon: "food:xien-ban" },
            { label: "Bánh tráng", icon: "food:banh-trang" },
            { label: "Chè", icon: "food:che" },
            { label: "Kem", icon: "food:kem" },
            { label: "Lẩu", icon: "food:lau" },
            { label: "Nướng", icon: "food:nuong" },
            { label: "Beef Steak", icon: "food:beef-steak" },
            { label: "Trà sữa", icon: "food:tra-sua" },
        ],
    },
    {
        id: "pay",
        label: "Ai trả tiền?",
        options: [
            { label: "Mình", icon: "🙋" },
            { label: "Bạn A", icon: "🧑" },
            { label: "Bạn B", icon: "👩" },
            { label: "Bạn C", icon: "🧔" },
        ],
    },
    {
        id: "yesno",
        label: "Có / Không",
        options: [
            { label: "Có", icon: "✅" },
            { label: "Không", icon: "❌" },
        ],
    },
    {
        id: "pes-clubs",
        label: "⚽ PES: CLB",
        options: [
            club("Real Madrid", "real-madrid"),
            club("Barcelona", "barcelona"),
            club("Man City", "man-city"),
            club("Man United", "man-united"),
            club("Liverpool", "liverpool"),
            club("Chelsea", "chelsea"),
            club("Arsenal", "arsenal"),
            club("Tottenham", "tottenham"),
            club("Newcastle", "newcastle"),
            club("Aston Villa", "aston-villa"),
            club("Bayern", "bayern"),
            club("Dortmund", "dortmund"),
            club("Leverkusen", "leverkusen"),
            club("PSG", "psg"),
            club("Marseille", "marseille"),
            club("Juventus", "juventus"),
            club("AC Milan", "ac-milan"),
            club("Inter Milan", "inter-milan"),
            club("Napoli", "napoli"),
            club("AS Roma", "as-roma"),
            club("Atletico Madrid", "atletico-madrid"),
            club("Benfica", "benfica"),
            club("Porto", "porto"),
            club("Ajax", "ajax"),
        ],
    },
    {
        id: "pes-nations",
        label: "🏆 PES: ĐTQG",
        options: [
            nation("Brazil", "br"),
            nation("Argentina", "ar"),
            nation("Pháp", "fr"),
            nation("Anh", "gb-eng"),
            nation("Đức", "de"),
            nation("Tây Ban Nha", "es"),
            nation("Bồ Đào Nha", "pt"),
            nation("Hà Lan", "nl"),
            nation("Ý", "it"),
            nation("Bỉ", "be"),
            nation("Croatia", "hr"),
            nation("Uruguay", "uy"),
            nation("Colombia", "co"),
            nation("Thụy Sĩ", "ch"),
            nation("Đan Mạch", "dk"),
            nation("Ba Lan", "pl"),
            nation("Thụy Điển", "se"),
            nation("Ma-rốc", "ma"),
            nation("Senegal", "sn"),
            nation("Ai Cập", "eg"),
            nation("Nhật Bản", "jp"),
            nation("Hàn Quốc", "kr"),
            nation("Mexico", "mx"),
            nation("Mỹ", "us"),
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
    display: "lucky-wheel:display",
    active: "lucky-wheel:active",
};