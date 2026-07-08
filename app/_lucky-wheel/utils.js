/**
 * Chuyển danh sách lựa chọn (mỗi item có `qty` là trọng số) thành các lát
 * cắt hình quạt với góc bắt đầu/kết thúc/trung điểm, cùng tổng trọng số.
 */
export function computeSegments(options) {
  const total = options.reduce((sum, o) => sum + o.qty, 0);
  let acc = 0;

  const segments = options.map((o) => {
    const sweep = total > 0 ? (o.qty / total) * 360 : 0;
    const start = acc;
    const end = acc + sweep;
    acc = end;
    return { ...o, start, end, mid: (start + end) / 2 };
  });

  return { segments, total };
}

/** Chuỗi conic-gradient CSS tương ứng với các lát cắt. */
export function buildConicGradient(segments, total, palette) {
  if (total === 0) return "#23264A";
  return segments
    .map((s, i) => `${palette[i % palette.length]} ${s.start}deg ${s.end}deg`)
    .join(", ");
}

/** Bốc ngẫu nhiên một lát cắt, trọng số theo đúng kích thước lát trên vòng quay. */
export function pickWeightedSegment(segments, total) {
  const roll = Math.random() * total;
  let acc = 0;
  let picked = segments[0];
  for (const s of segments) {
    acc += s.qty;
    if (roll < acc) {
      picked = s;
      break;
    }
  }
  return picked;
}

/**
 * Tính góc quay tuyệt đối mới để mũi tên (cố định ở đỉnh, 0deg) dừng đúng
 * vào lát cắt đã bốc, luôn quay tiếp về phía trước (không bao giờ lùi).
 */
export function computeSpinRotation(currentRotation, picked) {
  const pad = (picked.end - picked.start) * 0.15;
  const targetTheta =
    picked.start + pad + Math.random() * (picked.end - picked.start - 2 * pad);

  const fullSpins = 6 + Math.floor(Math.random() * 3); // 6-8 vòng
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const diff = ((360 - targetTheta - currentMod) % 360 + 360) % 360;

  return currentRotation + fullSpins * 360 + diff;
}
