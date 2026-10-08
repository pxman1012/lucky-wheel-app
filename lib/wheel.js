import { PALETTE } from "./constants";

/**
 * Quy ước góc: tính theo độ, chiều kim đồng hồ, 0° = đỉnh vòng quay (nơi đặt kim).
 */

/** Chia danh sách lựa chọn thành các ô có góc bắt đầu/kết thúc/giữa, màu và tỉ lệ %. */
export function computeSegments(options) {
    const total = options.reduce((sum, o) => sum + o.weight, 0);
    const count = options.length;
    let acc = 0;

    const segments = options.map((o, i) => {
        const sweep = total > 0 ? (o.weight / total) * 360 : 0;
        const start = acc;
        const end = acc + sweep;
        acc = end;

        // Tránh ô cuối trùng màu với ô đầu khi số lượng không chia hết bảng màu.
        let colorIndex = i % PALETTE.length;
        if (count > 1 && i === count - 1 && colorIndex === 0) {
            colorIndex = Math.floor(PALETTE.length / 2);
        }

        return {
            ...o,
            start,
            end,
            mid: (start + end) / 2,
            sweep,
            color: PALETTE[colorIndex],
            percent: total > 0 ? Math.round((o.weight / total) * 100) : 0,
        };
    });

    return { segments, total };
}

/** Bốc ngẫu nhiên một ô, xác suất tỉ lệ thuận với trọng số. */
export function pickWeightedSegment(segments, total) {
    const roll = Math.random() * total;
    let acc = 0;
    for (const s of segments) {
        acc += s.weight;
        if (roll < acc) return s;
    }
    return segments[segments.length - 1];
}

/**
 * Góc quay tuyệt đối mới sao cho kim (cố định ở 0°) dừng trong ô đã bốc.
 * Luôn quay tiếp về phía trước, không bao giờ lùi.
 */
export function computeTargetRotation(currentRotation, picked) {
    const sweep = picked.end - picked.start;
    const pad = sweep * 0.15; // tránh dừng sát mép ô
    const theta = picked.start + pad + Math.random() * (sweep - 2 * pad);

    const fullSpins = 6 + Math.floor(Math.random() * 3); // 6-8 vòng
    const currentMod = ((currentRotation % 360) + 360) % 360;
    const diff = (((360 - theta - currentMod) % 360) + 360) % 360;

    return currentRotation + fullSpins * 360 + diff;
}

/** Ô đang nằm dưới kim ở góc quay hiện tại. */
export function segmentAt(segments, rotation) {
    if (segments.length === 0) return undefined;
    const theta = (((360 - rotation) % 360) + 360) % 360;
    return (
        segments.find((s) => theta >= s.start && theta < s.end) ??
        segments[segments.length - 1]
    );
}

export const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/* ---------- Hình học SVG ---------- */

export function polar(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180;
    return {
        x: +(cx + r * Math.sin(rad)).toFixed(3),
        y: +(cy - r * Math.cos(rad)).toFixed(3),
    };
}

export function slicePath(cx, cy, r, start, end) {
    const s = polar(cx, cy, r, start);
    const e = polar(cx, cy, r, end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

export function truncate(text, maxChars) {
    const chars = Array.from(text);
    return chars.length <= maxChars
        ? text
        : `${chars
              .slice(0, Math.max(1, maxChars - 1))
              .join("")
              .trimEnd()}…`;
}
