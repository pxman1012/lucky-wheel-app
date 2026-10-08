import { Baloo_2, Nunito } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import { STORAGE_KEYS } from "@/lib/constants";
import "./globals.css";

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
    title: "Vòng Quay May Mắn",
    description:
        "Vòng quay ngẫu nhiên cho các lựa chọn tuỳ chỉnh: ăn gì, ai trả tiền, có hay không...",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Vòng Quay",
    },
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
                <RegisterSW />
                {children}
            </body>
        </html>
    );
}