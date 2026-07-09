"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "lucky-wheel:options";

let idCounter = 1;
const makeId = () => idCounter++;
const withIds = (list) => list.map((o) => ({ ...o, id: makeId() }));

function readStoredOptions() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return null;

        const cleaned = parsed
            .filter((o) => o && typeof o.label === "string" && Number.isFinite(o.qty))
            .map((o) => ({ label: o.label, qty: Math.max(1, Math.min(99, o.qty)) }));

        return cleaned.length > 0 ? cleaned : null;
    } catch {
        return null;
    }
}

export function useOptions(defaultOptions) {
    const [options, setOptions] = useState(() => withIds(defaultOptions));
    const [isLoaded, setIsLoaded] = useState(false); // true sau khi đã đọc xong localStorage
    const isFirstSave = useRef(true);

    useEffect(() => {
        const stored = readStoredOptions();
        if (stored) setOptions(withIds(stored));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isFirstSave.current) {
            isFirstSave.current = false;
            return;
        }
        try {
            const toSave = options.map((o) => ({ label: o.label, qty: o.qty }));
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch {
            // quota đầy hoặc private mode -> bỏ qua
        }
    }, [options]);

    const addOption = (label, qty) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        const safeQty = Math.max(1, Math.min(99, Number(qty) || 1));
        setOptions((prev) => [...prev, { id: makeId(), label: trimmed, qty: safeQty }]);
    };

    const removeOption = (id) => {
        setOptions((prev) => prev.filter((o) => o.id !== id));
    };

    const updateQty = (id, delta) => {
        setOptions((prev) =>
            prev.map((o) =>
                o.id === id ? { ...o, qty: Math.max(1, Math.min(99, o.qty + delta)) } : o
            )
        );
    };

    const clearAll = () => setOptions([]);

    return { options, addOption, removeOption, updateQty, clearAll, isLoaded };
}