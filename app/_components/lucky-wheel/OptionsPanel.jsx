"use client";

import { useState } from "react";
import styles from "./OptionsPanel.module.css";
import { PALETTE } from "./constants";

export default function OptionsPanel({
    options,
    total,
    onAdd,
    onRemove,
    onUpdateQty,
    onClearAll,
}) {
    const [labelInput, setLabelInput] = useState("");
    const [qtyInput, setQtyInput] = useState(1);

    const handleAdd = () => {
        onAdd(labelInput, qtyInput);
        setLabelInput("");
        setQtyInput(1);
    };

    const handleClearAll = () => {
        if (options.length === 0) return;
        const ok = window.confirm(
            "Xoá toàn bộ lựa chọn? Hành động này không thể hoàn tác."
        );
        if (ok) onClearAll();
    };

    return (
        <div className={styles.panel}>
            {/* Add form */}
            <label className={styles.label} htmlFor="lw-option-input">
                Nhập lựa chọn
            </label>
            <input
                id="lw-option-input"
                className={styles.input}
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Ví dụ: Pizza, Bóng đá, Âm nhạc..."
            />

            <div className={styles.weightRow}>
                <label className={styles.label}>Trọng số</label>
                <span
                    className={styles.tooltip}
                    title="Trọng số càng lớn thì xác suất được chọn càng cao."
                >
                    ?
                </span>
            </div>
            <div className={styles.stepper}>
                <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => setQtyInput((q) => Math.max(1, Number(q) - 1))}
                    aria-label="Giảm trọng số"
                >
                    −
                </button>
                <span className={styles.stepValue}>{qtyInput}</span>
                <button
                    type="button"
                    className={styles.stepBtn}
                    onClick={() => setQtyInput((q) => Math.min(99, Number(q) + 1))}
                    aria-label="Tăng trọng số"
                >
                    +
                </button>
            </div>

            <button type="button" className={styles.addBtn} onClick={handleAdd}>
                + Thêm
            </button>

            {/* List */}
            <div className={styles.list}>
                {options.length === 0 && (
                    <p className={styles.empty}>
                        Chưa có lựa chọn nào. Thêm để bắt đầu quay.
                    </p>
                )}
                {options.map((o, i) => (
                    <div key={o.id} className={styles.row}>
                        <span
                            className={styles.dot}
                            style={{ background: PALETTE[i % PALETTE.length] }}
                        />
                        <span className={styles.rowLabel}>{o.label}</span>
                        <div className={styles.rowStepper}>
                            <button
                                type="button"
                                className={styles.stepBtn}
                                onClick={() => onUpdateQty(o.id, -1)}
                                aria-label="Giảm trọng số"
                            >
                                −
                            </button>
                            <span className={styles.rowQty}>{o.qty}</span>
                            <button
                                type="button"
                                className={styles.stepBtn}
                                onClick={() => onUpdateQty(o.id, 1)}
                                aria-label="Tăng trọng số"
                            >
                                +
                            </button>
                        </div>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => onRemove(o.id)}
                            aria-label="Xoá lựa chọn"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Stats + clear all */}
            <div className={styles.footer}>
                <div className={styles.stats}>
                    <span>📝 {options.length} lựa chọn</span>
                    <span>🎯 Tổng trọng số: {total}</span>
                </div>
                <button
                    type="button"
                    className={styles.clearBtn}
                    disabled={options.length === 0}
                    onClick={handleClearAll}
                >
                    🗑 Xóa tất cả
                </button>
            </div>
        </div>
    );
}
