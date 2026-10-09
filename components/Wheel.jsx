"use client";

import { useState } from "react";
import { resolveIcon } from "@/lib/icons";
import { truncate, slicePath } from "@/lib/wheel";
import styles from "./Wheel.module.css";

const SIZE = 400;
const C = SIZE / 2; // tâm
const R = SIZE / 2; // bán kính
const EDGE = 188; // mép ngoài của nội dung (cách rìa vòng 12 đơn vị) - hình và chữ đều căn từ đây
const INNER = 58; // mép trong, chừa chỗ cho nút QUAY ở tâm
const GAP = 8; // khoảng cách giữa hình và chữ
const CENTER_BELOW = 9; // dưới số ô này: chữ căn giữa dải [INNER, mép ngoài] thay vì dính rìa

/** Cỡ chữ + nội dung đã cắt để vừa trong khoảng từ INNER tới `dEnd`. */
function fitText(label, sweep, count, dEnd, shrink = 0) {
    const length = dEnd - INNER;
    const base =
        (count <= 4 ? 26 : count <= 6 ? 22 : count <= 10 ? 18 : 15) - shrink;
    const arc = (2 * Math.PI * ((dEnd + INNER) / 2) * sweep) / 360; // bề ngang ô quanh vùng chữ
    const fontSize = Math.max(9, Math.min(base, arc * 0.55));
    const maxChars = Math.max(2, Math.floor(length / (fontSize * 0.55)));
    return { fontSize, text: truncate(label, maxChars) };
}

/** Cỡ hình vừa với bề ngang ô tại bán kính `radius`. */
function fitIcon(sweep, max, radius = EDGE - 18) {
    const arc = (2 * Math.PI * radius * sweep) / 360;
    return Math.max(16, Math.min(max, arc * 0.72));
}

/** Icon trong một ô, tâm tại (cx, C): emoji, cờ (cắt tròn) hoặc logo (nền trắng). */
function SliceIcon({ icon, cx, size, flip, clipId, onError }) {
    const half = size / 2;
    const rotate = flip ? `rotate(180 ${cx} ${C})` : undefined; // nửa trái: lật để hình luôn thẳng

    if (icon.type === "emoji") {
        return (
            <text
                x={cx}
                y={C}
                transform={rotate}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={size * 0.85}
            >
                {icon.text}
            </text>
        );
    }

    const isFlag = icon.type === "flag" || icon.type === "food";

    const box = isFlag ? size : size * 0.78;
    return (
        <g transform={rotate}>
            <clipPath id={clipId}>
                <circle cx={cx} cy={C} r={half} />
            </clipPath>
            <circle cx={cx} cy={C} r={half + 2} fill="#fff" />
            <image
                href={icon.src}
                x={cx - box / 2}
                y={C - box / 2}
                width={box}
                height={box}
                preserveAspectRatio={isFlag ? "xMidYMid slice" : "xMidYMid meet"}
                clipPath={isFlag ? `url(#${clipId})` : undefined}
                onError={onError}
            />
        </g>
    );
}

/**
 * Vòng quay dạng SVG. `dialRef` trỏ vào <svg> để useSpin ghi góc quay trực tiếp.
 * `display`:
 *   "text" - chỉ chữ
 *   "icon" - chỉ hình (mục không có hình hoặc hình lỗi thì hiện chữ)
 *   "both" - hình sát rìa ngoài, chữ nằm phía trong hình
 *
 * Vị trí chữ:
 *   nhiều ô (>= CENTER_BELOW) - chữ dính rìa ngoài
 *   ít ô (< CENTER_BELOW)     - chữ căn giữa dải bán kính, không bị trống ở giữa
 */
export default function Wheel({
    segments,
    total,
    spinning,
    onSpin,
    dialRef,
    pointerRef,
    display = "text",
}) {
    const [brokenIcons, setBrokenIcons] = useState(() => new Set());
    const canSpin = total > 0 && !spinning;
    const only = segments.length === 1 ? segments[0] : null;
    const centered = segments.length < CENTER_BELOW;

    const markBroken = (icon) => setBrokenIcons((prev) => new Set(prev).add(icon));

    return (
        <div className={styles.wrap}>
            <svg ref={pointerRef} className={styles.pointer} viewBox="0 0 30 38" aria-hidden="true">
                <path
                    d="M15 38 2.5 15.5a15 15 0 1 1 25 0z"
                    fill="var(--accent)"
                    stroke="var(--surface)"
                    strokeWidth="2"
                />
                <circle cx="15" cy="13" r="4.5" fill="var(--surface)" />
            </svg>

            <div
                className={styles.rim}
                data-clickable={canSpin}
                onClick={canSpin ? onSpin : undefined}
            >
                <svg
                    ref={dialRef}
                    className={styles.dial}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    aria-hidden="true"
                >
                    <defs>
                        {/* Đổ bóng nhẹ ở mép + sáng nhẹ ở giữa cho vòng có chiều sâu */}
                        <radialGradient id="lw-depth" cx="50%" cy="50%" r="50%">
                            <stop offset="55%" stopColor="#000" stopOpacity="0" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0.14" />
                        </radialGradient>
                        <radialGradient id="lw-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
                            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {total === 0 && <circle cx={C} cy={C} r={R} fill="var(--surface-2)" />}

                    {only && <circle cx={C} cy={C} r={R} fill={only.color} />}

                    {!only &&
                        segments.map((s) => (
                            <path
                                key={s.id}
                                d={slicePath(C, C, R, s.start, s.end)}
                                fill={s.color}
                                stroke="rgba(255,255,255,0.85)"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                        ))}

                    {total > 0 && (
                        <>
                            <circle cx={C} cy={C} r={R} fill="url(#lw-glow)" />
                            <circle cx={C} cy={C} r={R} fill="url(#lw-depth)" />
                        </>
                    )}

                    {segments.map((s) => {
                        const flip = s.mid > 180; // nửa trái: lật để luôn đọc xuôi
                        const icon =
                            display !== "text" && s.icon && !brokenIcons.has(s.icon)
                                ? resolveIcon(s.icon)
                                : null;
                        const showText = display !== "icon" || !icon;
                        const both = display === "both";

                        // Mép ngoài của chữ: sát rìa, hoặc lùi vào trong nếu có hình đứng ngoài.
                        let textEdge = EDGE;
                        let iconNode = null;
                        let textX = null; // tâm chữ khi căn giữa cùng hình (chế độ "both")

                        if (icon) {
                            // Ít ô: ô rộng nên cho hình to hơn và tính cỡ theo bán kính giữa dải.
                            const maxIcon = both ? (centered ? 56 : 40) : centered ? 84 : 52;
                            const size = fitIcon(
                                s.sweep,
                                maxIcon,
                                centered ? (INNER + EDGE) / 2 : EDGE - 18
                            );
                            let iconX = C + EDGE - size / 2; // mặc định: sát rìa ngoài
                            textEdge = EDGE - size - GAP;

                            if (centered) {
                                if (showText) {
                                    // "both": đặt cả cụm [chữ + khoảng cách + hình] vào giữa dải.
                                    const { fontSize, text } = fitText(
                                        s.label,
                                        s.sweep,
                                        segments.length,
                                        textEdge,
                                        2
                                    );
                                    const w = Math.min(
                                        textEdge - INNER,
                                        text.length * fontSize * 0.55
                                    );
                                    const start = INNER + (EDGE - INNER - (w + GAP + size)) / 2;
                                    textX = C + start + w / 2;
                                    iconX = C + start + w + GAP + size / 2;
                                } else {
                                    // "icon": hình nằm giữa dải.
                                    iconX = C + (INNER + EDGE) / 2;
                                }
                            }

                            iconNode = (
                                <SliceIcon
                                    icon={icon}
                                    cx={iconX}
                                    size={size}
                                    flip={flip}
                                    clipId={`lw-clip-${s.id}`}
                                    onError={() => markBroken(s.icon)}
                                />
                            );
                        }

                        let textNode = null;
                        if (showText) {
                            const { fontSize, text } = fitText(
                                s.label,
                                s.sweep,
                                segments.length,
                                textEdge,
                                icon ? 2 : 0
                            );

                            // Ít ô: đặt chữ ở giữa dải [INNER, textEdge], căn giữa theo chiều ngang.
                            // Nhiều ô: dính mép ngoài - nửa phải chữ kết thúc tại mép,
                            // nửa trái (lật 180°) chữ bắt đầu tại mép.
                            const x =
                                textX ?? C + (centered ? (INNER + textEdge) / 2 : textEdge);
                            const anchor = centered ? "middle" : flip ? "start" : "end";

                            textNode = (
                                <text
                                    x={x}
                                    y={C}
                                    transform={flip ? `rotate(180 ${x} ${C})` : undefined}
                                    textAnchor={anchor}
                                    dominantBaseline="central"
                                    fontSize={fontSize}
                                    fill="#fff"
                                    stroke="rgba(0,0,0,0.22)"
                                    strokeWidth="3"
                                    paintOrder="stroke"
                                    strokeLinejoin="round"
                                    style={{
                                        fontFamily:
                                            "var(--font-display), var(--font-sans), sans-serif",
                                        fontWeight: 700,
                                    }}
                                >
                                    {text}
                                </text>
                            );
                        }

                        return (
                            <g key={s.id} transform={`rotate(${s.mid - 90} ${C} ${C})`}>
                                {textNode}
                                {iconNode}
                            </g>
                        );
                    })}
                </svg>

                <button
                    type="button"
                    className={styles.hub}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (canSpin) onSpin();
                    }}
                    disabled={!canSpin}
                    aria-label="Quay"
                >
                    {spinning ? "···" : "QUAY"}
                </button>

                {total === 0 && <p className={styles.emptyHint}>Thêm lựa chọn để bắt đầu</p>}
            </div>
        </div>
    );
}