import styles from "./History.module.css";

export default function History({ items, onClear }) {
    if (items.length === 0) return null;

    return (
        <div className={styles.history}>
            <span className={styles.label}>Gần đây</span>
            <ul className={styles.list}>
                {items.map((label, i) => (
                    <li key={`${label}-${i}`} className={styles.chip}>
                        {label}
                    </li>
                ))}
            </ul>
            <button type="button" className={styles.clear} onClick={onClear}>
                Xoá
            </button>
        </div>
    );
}
