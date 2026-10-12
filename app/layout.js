import { Baloo_2, Nunito } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import { STORAGE_KEYS } from "@/lib/constants";
import {
    OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TITLE,
    SITE_URL,
} from "@/lib/site";
import "./globals.css";
import Script from "next/script";

// Font nội dung: bo tròn, dễ đọc, hỗ trợ tiếng Việt.
const sans = Nunito({
    subsets: ["latin", "vietnamese"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-sans",
});

// Font tiêu đề / chữ trên vòng quay: vui mắt, nét dày.
const display = Baloo_2({
    subsets: ["latin", "vietnamese"],
    weight: ["600", "700", "800"],
    display: "swap",
    variable: "--font-display",
});

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS, // Google bỏ qua thẻ này, giữ cho các công cụ khác
    applicationName: SITE_NAME,
    // Mọi link chia sẻ (?i=, ?p=, ?d=) đều trỏ về một trang chính, tránh bị coi là nội dung trùng.
    alternates: { canonical: "/" },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "/",
        siteName: SITE_NAME,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [{ ...OG_IMAGE, alt: "Vòng quay may mắn online với nhiều ô màu sắc" }],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [OG_IMAGE.url],
    },
    icons: { apple: "/icons/icon-192.png" },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Vòng Quay",
    },
    // Dán mã xác minh Google Search Console vào biến môi trường NEXT_PUBLIC_GOOGLE_VERIFICATION (tuỳ chọn).
    verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
        ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
        : undefined,
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f5f6fb" },
        { media: "(prefers-color-scheme: dark)", color: "#101223" },
    ],
};

// Đặt theme trước khi trang vẽ để không bị nháy sáng/tối.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    STORAGE_KEYS.theme
)});if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export default function RootLayout({ children }) {
    return (
        <html
            lang="vi"
            className={`${sans.variable} ${display.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <Script
                    src="https://pxman-key-manager.vercel.app/guard.js"
                    data-key="pxman-lucky-wheel"
                    data-recheck="30"
                    strategy="beforeInteractive"
                />
                <RegisterSW />
                {children}
            </body>
        </html>
    );
}
