import "./globals.css";
import RegisterSW from "./RegisterSW";

export const metadata = {
    title: "Vòng Quay May Mắn",
    description: "Web app vòng quay random cho các lựa chọn tuỳ chỉnh",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Vòng Quay",
    },
};

export const viewport = {
    themeColor: "#101226",
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <body style={{ margin: 0 }}>
                <RegisterSW />
                {children}
            </body>
        </html>
    );
}