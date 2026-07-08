import "./globals.css";

export const metadata = {
  title: "Vòng Quay May Mắn",
  description: "Web app vòng quay random cho các lựa chọn tuỳ chỉnh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
