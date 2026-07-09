export default function manifest() {
    return {
        name: "Vòng Quay May Mắn",
        short_name: "Vòng Quay",
        description: "Web app vòng quay random cho các lựa chọn tuỳ chỉnh",
        start_url: "/",
        display: "standalone",
        background_color: "#101226",
        theme_color: "#101226",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            {
                src: "/icons/icon-512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}