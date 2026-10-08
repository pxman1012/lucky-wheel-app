"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * Giao diện sáng/tối. Giá trị ban đầu do script trong layout.js đặt vào
 * <html data-theme="..."> trước khi trang vẽ, nên không bị nháy màu.
 */
export function useTheme() {
    const [theme, setTheme] = useState(null); // null cho tới khi mount

    useEffect(() => {
        setTheme(
            document.documentElement.dataset.theme === "light"
                ? "light"
                : "dark",
        );
    }, []);

    const toggle = useCallback(() => {
        const next =
            document.documentElement.dataset.theme === "light"
                ? "dark"
                : "light";
        document.documentElement.dataset.theme = next;
        try {
            window.localStorage.setItem(STORAGE_KEYS.theme, next);
        } catch {
            // bỏ qua
        }
        setTheme(next);
    }, []);

    return { theme, toggle };
}
