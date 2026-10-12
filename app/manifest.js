import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest() {
    return {
        id: "/",
        name: SITE_NAME,
        short_name: "Vòng Quay",
        description: SITE_DESCRIPTION,
        lang: "vi",
        start_url: "/",
        scope: "/",
        display: "standalone",
        categories: ["utilities", "games"],
        background_color: "#101223",
        theme_color: "#101223",
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
