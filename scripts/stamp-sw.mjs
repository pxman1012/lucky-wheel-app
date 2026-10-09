// Gắn phiên bản vào CACHE_NAME của public/sw.js dựa trên nội dung thư mục public.
// Chạy tự động trước `npm run build` (script "prebuild").
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const PUBLIC_DIR = "public";
const SW_FILE = join(PUBLIC_DIR, "sw.js");
const CACHE_RE = /const CACHE_NAME = "[^"]*";/;

function listFiles(dir) {
    return readdirSync(dir)
        .filter((name) => !name.startsWith(".")) // bỏ .DS_Store...
        .flatMap((name) => {
            const full = join(dir, name);
            return statSync(full).isDirectory() ? listFiles(full) : [full];
        });
}

const sw = readFileSync(SW_FILE, "utf8");
if (!CACHE_RE.test(sw)) {
    console.error('[stamp-sw] Không thấy dòng `const CACHE_NAME = "...";` trong public/sw.js');
    process.exit(1);
}

const hash = createHash("sha256");

// Logic của sw.js (trừ chính dòng CACHE_NAME) cũng tính vào phiên bản.
hash.update(sw.replace(CACHE_RE, ""));

for (const file of listFiles(PUBLIC_DIR)
    .filter((f) => f !== SW_FILE)
    .sort()) {
    hash.update(relative(PUBLIC_DIR, file).split(sep).join("/"));
    hash.update(readFileSync(file));
}

const version = hash.digest("hex").slice(0, 10);
const next = sw.replace(CACHE_RE, `const CACHE_NAME = "lucky-wheel-${version}";`);

if (next !== sw) writeFileSync(SW_FILE, next);
console.log(`[stamp-sw] CACHE_NAME = lucky-wheel-${version}`);