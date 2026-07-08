import WheelDial from "./WheelDial";
import SpinButton from "./SpinButton";
import styles from "./Wheel.module.css";
import { buildConicGradient } from "./utils";
import { PALETTE } from "./constants";

export default function Wheel({ segments, total, rotation, spinning, onSpin, disabled }) {
    const gradient = buildConicGradient(segments, total, PALETTE);

    return (
        <div className={styles.column}>
            <WheelDial
                segments={segments}
                total={total}
                gradient={gradient}
                rotation={rotation}
                spinning={spinning}
            />
            <SpinButton onClick={onSpin} disabled={disabled} spinning={spinning} />
        </div>
    );
}
