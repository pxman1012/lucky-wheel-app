import { MAX_OPTIONS } from "./constants";
import { clampWeight, cleanLabel } from "./options";

const toBase64Url = (str) => {
    let bin = "";
    new TextEncoder().encode(str).forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (s) => {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

/** Mục trọng số 1 chỉ lưu tên cho link ngắn; còn lại lưu [tên, trọng số]. */
export function encodeShare(options) {
    return toBase64Url(
        JSON.stringify(options.map((o) => (o.weight > 1 ? [o.label, o.weight] : o.label)))
    );
}

/** Giải mã tham số ?d=... Trả về null nếu link hỏng. */
export function decodeShare(param) {
    try {
        const arr = JSON.parse(fromBase64Url(param));
        if (!Array.isArray(arr)) return null;
        return arr
            .slice(0, MAX_OPTIONS)
            .map((x) =>
                Array.isArray(x)
                    ? { label: cleanLabel(x[0]), weight: clampWeight(x[1]) }
                    : { label: cleanLabel(x), weight: 1 }
            )
            .filter((o) => o.label);
    } catch {
        return null;
    }
}

/** buildShareLink({ i: 3 }) -> https://domain/?i=3 */
export function buildShareLink(query) {
    return `${window.location.origin}/?${new URLSearchParams(query)}`;
}