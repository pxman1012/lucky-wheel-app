"use client";

import { useTheme } from "@/hooks/useTheme";
import { MoonIcon, SunIcon, VolumeIcon, VolumeOffIcon } from "./Icons";
import styles from "./Header.module.css";

export default function Header({ muted, onToggleMuted }) {
    const { theme, toggle } = useTheme();

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <span className={styles.logo} aria-hidden="true">
                    🎡
                </span>
                <div>
                    <h1 className={styles.title}>Vòng Quay May Mắn</h1>
                    <p className={styles.subtitle}>
                        Nhập lựa chọn, bấm quay để chọn ngẫu nhiên.
                    </p>
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={onToggleMuted}
                    aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
                    title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                    {muted ? <VolumeOffIcon /> : <VolumeIcon />}
                </button>
                <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={toggle}
                    aria-label="Đổi giao diện sáng/tối"
                    title="Đổi giao diện sáng/tối"
                >
                    {theme === "light" ? (
                        <MoonIcon />
                    ) : theme === "dark" ? (
                        <SunIcon />
                    ) : null}
                </button>
            </div>
        </header>
    );
}
