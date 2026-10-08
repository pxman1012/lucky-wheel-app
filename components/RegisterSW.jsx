"use client";

import { useEffect } from "react";

/** Đăng ký service worker ở production; ở dev thì gỡ để khỏi dính cache cũ. */
export default function RegisterSW() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        if (process.env.NODE_ENV === "production") {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        } else {
            navigator.serviceWorker
                .getRegistrations()
                .then((regs) => regs.forEach((r) => r.unregister()))
                .catch(() => {});
        }
    }, []);

    return null;
}
