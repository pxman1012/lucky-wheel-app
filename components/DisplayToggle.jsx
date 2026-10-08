import styles from "./DisplayToggle.module.css";

/** Nút chuyển kiểu hiển thị trên vòng quay: Chữ / Hình. */
export default function DisplayToggle({ value, onChange, hasIcons }) {
    return (
        <div className={styles.wrap}>
            <div className={styles.toggle} role="radiogroup" aria-label="Hiển thị trên vòng quay">
                <button
                    type="button"
                    role="radio"
                    aria-checked={value === "text"}
                    className={styles.option}
                    onClick={() => onChange("text")}
                >
                    Aa Chữ
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={value === "icon"}
                    className={styles.option}
                    onClick={() => onChange("icon")}
                    disabled={!hasIcons}
                    title={
                        hasIcons
                            ? undefined
                            : "Chưa có mục nào có hình. Chọn mẫu có hình hoặc gõ emoji ở đầu tên (vd: 🍕 Pizza)."
                    }
                >
                    🖼 Hình
                </button>
            </div>
        </div>
    );
}