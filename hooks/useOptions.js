"use client";

import { useState } from "react";
import { DEFAULT_OPTIONS, MAX_OPTIONS, STORAGE_KEYS } from "@/lib/constants";
import {
    clampWeight,
    cleanLabel,
    createOption,
    parseStoredOptions,
    serializeOptions,
} from "@/lib/options";
import { useLocalStorage } from "./useLocalStorage";

// id cố định để server và client render giống nhau ở lần đầu.
const INITIAL_OPTIONS = DEFAULT_OPTIONS.map((o, i) => ({ id: `default-${i}`, ...o }));

/**
 * Quản lý danh sách lựa chọn + lưu localStorage + hoàn tác thao tác xoá/thay thế.
 */
export function useOptions() {
    const [options, setOptions, isLoaded] = useLocalStorage(
        STORAGE_KEYS.options,
        INITIAL_OPTIONS,
        {
            parse: parseStoredOptions,
            serialize: serializeOptions,
        }
    );
    const [undoState, setUndoState] = useState(null); // { id, message, snapshot }

    const remember = (message) => setUndoState({ id: Date.now(), message, snapshot: options });

    /** Thêm một hoặc nhiều lựa chọn. Trả về true nếu có thêm được. */
    const addOptions = (labels, weight = 1) => {
        const list = (Array.isArray(labels) ? labels : [labels]).map(cleanLabel).filter(Boolean);
        const room = MAX_OPTIONS - options.length;
        if (list.length === 0 || room <= 0) return false;
        const created = list.slice(0, room).map((label) => createOption(label, weight));
        setOptions((prev) => [...prev, ...created]);
        return true;
    };

    const removeOption = (id) => {
        const target = options.find((o) => o.id === id);
        if (!target) return;
        remember(`Đã xoá "${target.label}"`);
        setOptions((prev) => prev.filter((o) => o.id !== id));
    };

    const renameOption = (id, label) => {
        const next = cleanLabel(label);
        if (!next) return;
        setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, label: next } : o)));
    };

    const setWeight = (id, weight) => {
        setOptions((prev) =>
            prev.map((o) => (o.id === id ? { ...o, weight: clampWeight(weight) } : o))
        );
    };

    const clearAll = () => {
        if (options.length === 0) return;
        remember("Đã xoá tất cả lựa chọn");
        setOptions([]);
    };

    /** Thay toàn bộ danh sách (mẫu có sẵn, mẫu của tôi, link chia sẻ). Có thể hoàn tác. */
    const replaceAll = (list, message) => {
        const next = list
            .map((o) => createOption(o.label, o.weight ?? 1))
            .filter((o) => o.label)
            .slice(0, MAX_OPTIONS);
        if (next.length === 0) return;
        remember(message);
        setOptions(next);
    };

    const undo = () => {
        if (!undoState) return;
        setOptions(undoState.snapshot);
        setUndoState(null);
    };

    const dismissUndo = () => setUndoState(null);

    return {
        options,
        isLoaded,
        addOptions,
        removeOption,
        renameOption,
        setWeight,
        clearAll,
        replaceAll,
        undoState,
        undo,
        dismissUndo,
    };
}