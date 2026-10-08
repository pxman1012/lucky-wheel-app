import styles from "./DisplayToggle.module.css";

const OPTIONS = [
    { value: "text", label: "Aa Chữ", needsIcons: false },
    { value: "icon", label: "🖼 Hình", needsIcons: true },
    { value: "both", label: "Cả hai", needsIcons: true },
];

const HINT =
    "Chưa có mục nào có hình. Chọn mẫu có hình hoặc gõ emoji ở đầu tên (vd: 🍕 Pizza).";

/** Chuyển kiểu hiển thị trên vòng quay: Chữ / Hình / Cả hai. */
export default function DisplayToggle({ value, onChange, hasIcons }) {
    return (
        <div className={styles.wrap}>
            <div className={styles.toggle} role="radiogroup" aria-label="Hiển thị trên vòng quay">
                {OPTIONS.map((opt) => {
                    const disabled = opt.needsIcons && !hasIcons;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={value === opt.value}
                            className={styles.option}
                            onClick={() => onChange(opt.value)}
                            disabled={disabled}
                            title={disabled ? HINT : undefined}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}