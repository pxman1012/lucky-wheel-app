import styles from "./Wheel.module.css";

export default function SpinButton({ onClick, disabled, spinning }) {
    return (
        <div className={styles.spinWrap}>
            <button
                type="button"
                className={styles.spinBtn}
                onClick={onClick}
                disabled={disabled}
            >
                {spinning ? "Đang quay..." : "🎡 Quay"}
            </button>
        </div>
    );
}
