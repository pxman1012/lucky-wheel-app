"use client";

import { computeSegments } from "./utils";
import { useOptions } from "./hooks/useOptions";
import { useSpin } from "./hooks/useSpin";
import { DEFAULT_OPTIONS } from "./constants";
import Header from "./components/Header";
import OptionsPanel from "./components/OptionsPanel";
import Wheel from "./components/Wheel";
import ResultModal from "./components/ResultModal";
import styles from "./LuckyWheel.module.css";

export default function LuckyWheel() {
    const { options, addOption, removeOption, updateQty, clearAll } =
        useOptions(DEFAULT_OPTIONS);

    const { segments, total } = computeSegments(options);

    const { rotation, spinning, winner, showResult, spin, closeResult } =
        useSpin(segments, total);

    const spinDisabled = spinning || total === 0;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Header />

                <div className={styles.grid}>
                    <OptionsPanel
                        options={options}
                        total={total}
                        onAdd={addOption}
                        onRemove={removeOption}
                        onUpdateQty={updateQty}
                        onClearAll={clearAll}
                    />

                    <Wheel
                        segments={segments}
                        total={total}
                        rotation={rotation}
                        spinning={spinning}
                        onSpin={spin}
                        disabled={spinDisabled}
                    />
                </div>
            </div>

            <ResultModal show={showResult} winner={winner} onClose={closeResult} />
        </div>
    );
}
