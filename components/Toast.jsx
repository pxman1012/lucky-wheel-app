"use client";

import { useEffect } from "react";
import { UNDO_TIMEOUT_MS } from "@/lib/constants";
import { CloseIcon } from "./Icons";
import styles from "./Toast.module.css";

/** Thông báo ngắn kèm nút Hoàn tác, tự tắt sau vài giây. */
export default function Toast({ toast, onUndo, onClose }) {
    const id = toast?.id;

    useEffect(() => {
        if (!id) return;
        const timer = window.setTimeout(onClose, UNDO_TIMEOUT_MS);
        return () => window.clearTimeout(timer);
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!toast) return null;

    return (
        <div
            className={styles.toast}
            role="status"
            aria-live="polite"
            key={toast.id}
        >
            <span className={styles.message}>{toast.message}</span>
            <button type="button" className={styles.undo} onClick={onUndo}>
                Hoàn tác
            </button>
            <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Đóng thông báo"
            >
                <CloseIcon width={16} height={16} />
            </button>
        </div>
    );
}
