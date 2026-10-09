/**
 * Xử lý ảnh người dùng tải lên: đọc file, cắt vuông (kéo + zoom), thu nhỏ, xuất data URL.
 * `view` = { zoom, ox, oy }: zoom >= 1, ox/oy là độ lệch tính theo tỉ lệ cạnh khung (không phụ thuộc kích thước hiển thị).
 */

export const IMAGE_SIZE = 128; // cạnh ảnh lưu lại (px)
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_ZOOM = 3;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => (img.naturalWidth ? resolve(img) : reject(new Error("empty")));
        img.onerror = () => reject(new Error("load"));
        img.src = src;
    });
}

/** Đọc file người dùng chọn. Ném Error với thông báo tiếng Việt nếu không dùng được. */
export async function loadImageFile(file) {
    if (!file || !file.type.startsWith("image/")) throw new Error("Hãy chọn một file ảnh.");
    if (file.size > MAX_FILE_BYTES) throw new Error("Ảnh quá lớn (tối đa 20 MB).");
    const url = URL.createObjectURL(file);
    try {
        return await loadImage(url);
    } catch {
        throw new Error("Không đọc được ảnh này.");
    } finally {
        URL.revokeObjectURL(url);
    }
}

/** Giữ ảnh luôn phủ kín khung (không lộ viền trống). */
export function clampView(img, { zoom, ox, oy }) {
    const z = clamp(zoom, 1, MAX_ZOOM);
    const m = Math.min(img.naturalWidth, img.naturalHeight);
    const maxX = Math.max(0, (z * img.naturalWidth) / m - 1) / 2;
    const maxY = Math.max(0, (z * img.naturalHeight) / m - 1) / 2;
    return { zoom: z, ox: clamp(ox, -maxX, maxX), oy: clamp(oy, -maxY, maxY) };
}

/** Vẽ ảnh vào ô vuông `size` px theo kiểu "cover" + zoom + lệch. */
export function drawCover(ctx, img, size, { zoom, ox, oy }) {
    const m = Math.min(img.naturalWidth, img.naturalHeight);
    const w = ((zoom * img.naturalWidth) / m) * size;
    const h = ((zoom * img.naturalHeight) / m) * size;
    ctx.fillStyle = "#fff"; // ảnh PNG trong suốt sẽ có nền trắng
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, size / 2 - w / 2 + ox * size, size / 2 - h / 2 + oy * size, w, h);
}

/** Xuất ảnh đã cắt thành icon "img:..." (tròn) hoặc "sq:..." (vuông). */
export function exportImage(img, view, round) {
    const canvas = document.createElement("canvas");
    canvas.width = IMAGE_SIZE;
    canvas.height = IMAGE_SIZE;
    drawCover(canvas.getContext("2d"), img, IMAGE_SIZE, view);
    let url = canvas.toDataURL("image/webp", 0.85);
    if (!url.startsWith("data:image/webp")) url = canvas.toDataURL("image/jpeg", 0.85); // Safari không mã hoá webp
    return `${round ? "img" : "sq"}:${url}`;
}