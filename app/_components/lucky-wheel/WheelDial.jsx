import styles from "./Wheel.module.css";

export default function WheelDial({ segments, total, gradient, rotation, spinning }) {
    return (
        <div className={styles.wheelWrap}>
            <div className={styles.pointer} />

            <div
                className={styles.dial}
                style={{
                    background: `conic-gradient(${gradient})`,
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning
                        ? "transform 5.2s cubic-bezier(0.12, 0.75, 0.14, 1)"
                        : "none",
                }}
            >
                {segments.map((s) => (
                    <div
                        key={s.id}
                        className={styles.segment}
                        style={{ transform: `rotate(${s.mid}deg)` }}
                    >
                        <span
                            className={styles.segmentLabel}
                            style={{ fontSize: total > 8 ? 11 : 13 }}
                        >
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.centerCap} />
        </div>
    );
}
