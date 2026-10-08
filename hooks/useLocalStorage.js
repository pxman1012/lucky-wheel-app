"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useState có lưu vào localStorage.
 * - Render đầu tiên luôn dùng `initial` (khớp với server, tránh lỗi hydration),
 *   sau đó mới đọc dữ liệu đã lưu -> `isLoaded` chuyển sang true.
 * - `parse(stored)` trả về undefined nếu dữ liệu không hợp lệ.
 * - `serialize(value)` biến state thành dữ liệu cần lưu.
 */
export function useLocalStorage(key, initial, { parse, serialize } = {}) {
    const [value, setValue] = useState(initial);
    const [isLoaded, setIsLoaded] = useState(false);
    const helpers = useRef({ parse, serialize });

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(key);
            if (raw !== null) {
                const stored = JSON.parse(raw);
                const parsed = helpers.current.parse
                    ? helpers.current.parse(stored)
                    : stored;
                if (parsed !== undefined) setValue(parsed);
            }
        } catch {
            // dữ liệu hỏng hoặc bị chặn -> dùng giá trị mặc định
        }
        setIsLoaded(true);
    }, [key]);

    useEffect(() => {
        if (!isLoaded) return;
        try {
            const toSave = helpers.current.serialize
                ? helpers.current.serialize(value)
                : value;
            window.localStorage.setItem(key, JSON.stringify(toSave));
        } catch {
            // hết dung lượng hoặc chế độ ẩn danh -> bỏ qua
        }
    }, [key, value, isLoaded]);

    return [value, setValue, isLoaded];
}
