"use client";

import { useEffect, useRef } from "react";
import Confetti from "./Confetti";
import { CloseIcon } from "./Icons";
import styles from "./ResultModal.module.css";

export default function ResultModal({
    winner,
    onClose,
    onSpinAgain,
    onRemove,
}) {
    const primaryRef = useRef(null);

    useEffect(() => {
        if (!winner) return;
        primaryRef.current?.focus();
        const onKeyDown = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [winner, onClose]);

    if (!winner) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <Confetti />
            <div
                className={styles.modal}
                style={{ "--winner": winner.color }}
                role="dialog"
                aria-modal="true"
                aria-label="Kết quả"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles.close}
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <CloseIcon />
                </button>

                <p className={styles.kicker}>Kết quả</p>
                <p className={styles.winner}>{winner.label}</p>

                <div className={styles.actions}>
                    <button
                        ref={primaryRef}
                        type="button"
                        className={styles.primary}
                        onClick={onSpinAgain}
                    >
                        Quay tiếp
                    </button>
                    <button
                        type="button"
                        className={styles.secondary}
                        onClick={onRemove}
                    >
                        Loại bỏ mục này
                    </button>
                </div>
            </div>
        </div>
    );
}
