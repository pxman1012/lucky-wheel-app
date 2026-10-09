import { MAX_LABEL_LENGTH, MAX_WEIGHT, MIN_WEIGHT } from "./constants";
import { sanitizeIcon } from "./icons";

let counter = 0;

/** id duy nhất; chỉ gọi trong event handler / effect (không gọi lúc render đầu). */
export function makeId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    counter += 1;
    return `opt-${Date.now()}-${counter}`;
}

export function clampWeight(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return MIN_WEIGHT;
    return Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, n));
}

export function cleanLabel(value) {
    return String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_LABEL_LENGTH);
}

export function createOption(label, weight = 1, icon) {
    const option = { id: makeId(), label: cleanLabel(label), weight: clampWeight(weight) };
    const safeIcon = sanitizeIcon(icon, true);
    if (safeIcon) option.icon = safeIcon;
    return option;
}

/**
 * Đọc dữ liệu từ localStorage. Tương thích dữ liệu cũ (`qty` -> `weight`).
 * Trả về undefined nếu dữ liệu không hợp lệ (để giữ giá trị mặc định).
 */
export function parseStoredOptions(raw) {
    if (!Array.isArray(raw)) return undefined;
    return raw
        .filter((o) => o && typeof o.label === "string" && cleanLabel(o.label))
        .map((o) => createOption(o.label, o.weight ?? o.qty, o.icon));
}

export function serializeOptions(options) {
    return options.map(({ label, weight, icon }) =>
        icon ? { label, weight, icon } : { label, weight }
    );
}