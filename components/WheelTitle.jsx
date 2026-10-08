"use client";

import { useState } from "react";
import { MAX_DRAFT_NAME } from "@/lib/constants";
import { PencilIcon, PlusIcon } from "./Icons";
import styles from "./WheelTitle.module.css";

/**
 * Tên vòng quay hiển thị phía trên vòng quay.
 * - Có tên (mẫu có sẵn / mẫu đã lưu): hiện tên, mẫu đã lưu có thể đổi tên.
 * - Chưa có tên: hiện nút "Đặt tên"; bấm vào sẽ mở ô nhập, lưu lại thành mẫu của tôi.
 */
export default function WheelTitle({ name, kind, canSave, onSave, onRename, locked }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const canRename = kind === "draft";

    const start = () => {
        setValue(name ?? "");
        setError("");
        setEditing(true);
    };

    const cancel = () => {
        setEditing(false);
        setError("");
    };

    const submit = (e) => {
        e.preventDefault();
        const result = name ? onRename(value) : onSave(value);
        if (result.ok) cancel();
        else setError(result.error ?? "Không lưu được tên.");
    };

    if (editing) {
        return (
            <div className={styles.root}>
                <form className={styles.form} onSubmit={submit}>
                    <input
                        className={styles.input}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setError("");
                        }}
                        onKeyDown={(e) => e.key === "Escape" && cancel()}
                        maxLength={MAX_DRAFT_NAME}
                        placeholder="Tên vòng quay, ví dụ: Đi ăn team"
                        aria-label="Tên vòng quay"
                        autoFocus
                    />
                    <button type="submit" className={styles.saveBtn}>
                        Lưu
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={cancel}>
                        Huỷ
                    </button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        );
    }

    if (!name) {
        return (
            <div className={styles.root}>
                <button
                    type="button"
                    className={styles.nameBtn}
                    onClick={start}
                    disabled={!canSave || locked}
                    title="Đặt tên và lưu vào mẫu của tôi"
                >
                    <PlusIcon width={16} height={16} /> Đặt tên cho vòng quay
                </button>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleRow}>
                <h2 className={styles.title} title={name}>
                    {name}
                </h2>
                <span className={styles.badge}>{canRename ? "Đã lưu" : "Mẫu có sẵn"}</span>
                {canRename && (
                    <button
                        type="button"
                        className={styles.editBtn}
                        onClick={start}
                        disabled={locked}
                        aria-label="Đổi tên vòng quay"
                        title="Đổi tên"
                    >
                        <PencilIcon width={16} height={16} />
                    </button>
                )}
            </div>
        </div>
    );
}