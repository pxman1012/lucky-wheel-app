"use client";

import { useState } from "react";
import { resolveIcon } from "@/lib/icons";
import { truncate, slicePath } from "@/lib/wheel";
import styles from "./Wheel.module.css";

const SIZE = 400;
const C = SIZE / 2; // tâm
const R = SIZE / 2; // bán kính
const LABEL_CENTER = 124; // khoảng cách từ tâm tới giữa nhãn chữ
const LABEL_LENGTH = 122; // chiều dài tối đa của nhãn chữ
const ICON_CENTER = 140; // khoảng cách từ tâm tới giữa icon

function layoutLabel(label, sweep, count) {
    const base = count <= 6 ? 22 : count <= 10 ? 18 : 15;
    const arc = (2 * Math.PI * LABEL_CENTER * sweep) / 360; // bề ngang ô tại vị trí nhãn
    const fontSize = Math.max(9, Math.min(base, arc * 0.55));
    const maxChars = Math.max(2, Math.floor(LABEL_LENGTH / (fontSize * 0.55)));
    return { fontSize, text: truncate(label, maxChars) };
}

function iconSize(sweep) {
    const arc = (2 * Math.PI * ICON_CENTER * sweep) / 360;
    return Math.max(16, Math.min(52, arc * 0.72));
}

/** Icon trong một ô: emoji, cờ (cắt tròn) hoặc logo (nền trắng). */
function SliceIcon({ icon, x, size, flip, clipId, onError }) {
    const half = size / 2;
    const rotate = flip ? `rotate(180 ${x} ${C})` : undefined;

    if (icon.type === "emoji") {
        return (
            <text
                x={x}
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

    const isFlag = icon.type === "flag";
    const box = isFlag ? size : size * 0.78;
    return (
        <g transform={rotate}>
            <clipPath id={clipId}>
                <circle cx={x} cy={C} r={half} />
            </clipPath>
            <circle cx={x} cy={C} r={half + 2} fill="#fff" />
            <image
                href={icon.src}
                x={x - box / 2}
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
 * `display`: "text" hiện chữ, "icon" hiện hình (mục không có hình hoặc hình lỗi thì hiện chữ).
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
                            display === "icon" && s.icon && !brokenIcons.has(s.icon)
                                ? resolveIcon(s.icon)
                                : null;

                        if (icon) {
                            return (
                                <g key={s.id} transform={`rotate(${s.mid - 90} ${C} ${C})`}>
                                    <SliceIcon
                                        icon={icon}
                                        x={C + ICON_CENTER}
                                        size={iconSize(s.sweep)}
                                        flip={flip}
                                        clipId={`lw-clip-${s.id}`}
                                        onError={() => markBroken(s.icon)}
                                    />
                                </g>
                            );
                        }

                        const { fontSize, text } = layoutLabel(
                            s.label,
                            s.sweep,
                            segments.length
                        );
                        const x = C + LABEL_CENTER;
                        return (
                            <g key={s.id} transform={`rotate(${s.mid - 90} ${C} ${C})`}>
                                <text
                                    x={x}
                                    y={C}
                                    transform={flip ? `rotate(180 ${x} ${C})` : undefined}
                                    textAnchor="middle"
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