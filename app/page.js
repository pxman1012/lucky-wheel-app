import LuckyWheel from "@/components/LuckyWheel";
import SeoContent from "@/components/SeoContent";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Dữ liệu có cấu trúc giúp Google hiểu đây là một ứng dụng web miễn phí.
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Cần trình duyệt hỗ trợ JavaScript",
    inLanguage: "vi",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
};

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                // Thay "<" để chuỗi JSON không thể đóng thẻ script sớm.
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
            />
            <LuckyWheel />
            <SeoContent />
        </>
    );
}
