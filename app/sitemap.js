import { SITE_URL } from "@/lib/site";

// Trang chỉ có một URL chính. Link chia sẻ (?i=, ?p=, ?d=) không đưa vào sitemap.
export default function sitemap() {
    return [{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 }];
}
