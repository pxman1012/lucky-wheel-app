import { MAX_WEIGHT, MIN_WEIGHT } from "@/lib/constants";
import styles from "./options.module.css";

export default function WeightStepper({ value, onChange, label = "trọng số" }) {
    return (
        <div className={styles.stepper}>
            <button
                type="button"
                className={styles.stepBtn}
                onClick={() => onChange(value - 1)}
                disabled={value <= MIN_WEIGHT}
                aria-label={`Giảm ${label}`}
            >
                −
            </button>
            <span className={styles.stepValue} aria-label={label}>
                {value}
            </span>
            <button
                type="button"
                className={styles.stepBtn}
                onClick={() => onChange(value + 1)}
                disabled={value >= MAX_WEIGHT}
                aria-label={`Tăng ${label}`}
            >
                +
            </button>
        </div>
    );
}
