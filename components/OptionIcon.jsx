"use client";

import { useState } from "react";
import { resolveIcon } from "@/lib/icons";

/**
 * Icon dạng HTML (danh sách, popup kết quả). Ảnh lỗi thì tự ẩn.
 * `glow`: viền trắng + quầng sáng theo màu --winner, để hình luôn tách khỏi nền.
 */
export default function OptionIcon({ icon, size = 20, glow = false }) {
    const [failed, setFailed] = useState(false);
    const resolved = resolveIcon(icon);
    if (!resolved || failed) return null;

    if (resolved.type === "emoji") {
        return (
            <span
                aria-hidden="true"
                style={{
                    display: "inline-block",
                    width: size,
                    flexShrink: 0,
                    fontSize: size * 0.85,
                    lineHeight: 1,
                    textAlign: "center",
                    filter: glow ? "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25))" : undefined,
                }}
            >
                {resolved.text}
            </span>
        );
    }

    const isFlag = resolved.type === "flag";
    const glowColor = "color-mix(in srgb, var(--winner, #6366d9) 60%, transparent)";

    const style = {
        flexShrink: 0,
        objectFit: isFlag ? "cover" : "contain",
        borderRadius: isFlag ? "50%" : 0,
    };

    if (isFlag) {
        // Viền trắng + viền mảnh + quầng sáng: nhìn rõ ranh giới ngay cả khi cờ có nền trắng.
        style.boxShadow = glow
            ? `0 0 0 3px #fff, 0 0 0 4px rgba(0, 0, 0, 0.12), 0 6px 18px rgba(0, 0, 0, 0.25), 0 0 28px 6px ${glowColor}`
            : "0 0 0 1.5px var(--border), 0 1px 3px rgba(0, 0, 0, 0.2)";
    } else if (glow) {
        // Logo không tròn: drop-shadow bám theo hình dạng thật của huy hiệu.
        style.filter = `drop-shadow(0 0 2px #fff) drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))`;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={resolved.src}
            alt=""
            width={size}
            height={size}
            onError={() => setFailed(true)}
            style={style}
        />
    );
}