import styles from "./ResultModal.module.css";

export default function ResultModal({ show, winner, onClose }) {
    if (!show || !winner) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.emoji}>🎉</div>
                <div className={styles.kicker}>Hôm nay chọn</div>
                <div className={styles.winner}>{winner.label}</div>
                <button type="button" className={styles.closeBtn} onClick={onClose}>
                    Quay lại
                </button>
            </div>
        </div>
    );
}
