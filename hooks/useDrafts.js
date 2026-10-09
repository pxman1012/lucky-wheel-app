"use client";

import { MAX_DRAFT_NAME, MAX_DRAFTS, STORAGE_KEYS } from "@/lib/constants";
import { sanitizeIcon } from "@/lib/icons";
import { clampWeight, cleanLabel, makeId } from "@/lib/options";
import { useLocalStorage } from "./useLocalStorage";

const cleanName = (value) =>
    String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_DRAFT_NAME);

const toStoredOption = ({ label, weight, icon }) => {
    const item = { label: cleanLabel(label), weight: clampWeight(weight) };
    const safeIcon = sanitizeIcon(icon, true);
    if (safeIcon) item.icon = safeIcon;
    return item;
};

/** Đọc và chuẩn hoá dữ liệu đã lưu; trả về undefined nếu hỏng. */
function parseDrafts(raw) {
    if (!Array.isArray(raw)) return undefined;
    return raw
        .filter((d) => d && typeof d.name === "string" && Array.isArray(d.options))
        .map((d) => ({
            id: typeof d.id === "string" ? d.id : makeId(),
            name: cleanName(d.name),
            options: d.options
                .filter((o) => o && typeof o.label === "string")
                .map(toStoredOption)
                .filter((o) => o.label),
            updatedAt: Number(d.updatedAt) || 0,
        }))
        .filter((d) => d.name && d.options.length > 0)
        .slice(0, MAX_DRAFTS);
}

/**
 * "Mẫu của tôi": lưu local tối đa MAX_DRAFTS mẫu.
 * Lưu trùng tên (không phân biệt hoa thường) sẽ ghi đè mẫu cũ.
 */
export function useDrafts() {
    const [drafts, setDrafts] = useLocalStorage(STORAGE_KEYS.drafts, [], { parse: parseDrafts });

    /** Trả về { ok: true } hoặc { ok: false, error } */
    const saveDraft = (name, options) => {
        const clean = cleanName(name);
        if (!clean) return { ok: false, error: "Hãy nhập tên mẫu." };
        if (options.length === 0) return { ok: false, error: "Danh sách đang trống." };

        const existing = drafts.find((d) => d.name.toLowerCase() === clean.toLowerCase());
        if (!existing && drafts.length >= MAX_DRAFTS) {
            return { ok: false, error: `Đã đủ ${MAX_DRAFTS} mẫu, hãy xoá bớt.` };
        }

        const entry = {
            id: existing?.id ?? makeId(),
            name: clean,
            options: options.map(toStoredOption),
            updatedAt: Date.now(),
        };
        setDrafts((prev) =>
            existing ? prev.map((d) => (d.id === existing.id ? entry : d)) : [entry, ...prev]
        );
        return { ok: true, id: entry.id };
    };

    /** Đổi tên một mẫu đã lưu. Trả về { ok: true } hoặc { ok: false, error } */
    const renameDraft = (id, name) => {
        const clean = cleanName(name);
        if (!clean) return { ok: false, error: "Hãy nhập tên mẫu." };
        const taken = drafts.some((d) => d.id !== id && d.name.toLowerCase() === clean.toLowerCase());
        if (taken) return { ok: false, error: "Đã có mẫu trùng tên này." };
        setDrafts((prev) =>
            prev.map((d) => (d.id === id ? { ...d, name: clean, updatedAt: Date.now() } : d))
        );
        return { ok: true };
    };

    const removeDraft = (id) => setDrafts((prev) => prev.filter((d) => d.id !== id));

    return { drafts, saveDraft, renameDraft, removeDraft };
}