import styles from "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>🎡 Vòng Quay May Mắn</h1>
            <p className={styles.subtitle}>
                Nhập các lựa chọn rồi nhấn Quay để chọn ngẫu nhiên.
            </p>
        </header>
    );
}
