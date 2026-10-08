"use client";

import { useRef, useState } from "react";
import { MAX_LABEL_LENGTH } from "@/lib/constants";
import { PlusIcon } from "../Icons";
import WeightStepper from "./WeightStepper";
import styles from "./options.module.css";

/** Ô nhập + nút "+" trên một dòng. Enter để thêm; dán nhiều dòng sẽ thêm nhiều mục. */
export default function OptionForm({ advanced, onAdd }) {
    const [label, setLabel] = useState("");
    const [weight, setWeight] = useState(1);
    const inputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        if (onAdd(label, weight)) {
            setLabel("");
            setWeight(1);
        }
        inputRef.current?.focus();
    };

    const handlePaste = (e) => {
        const text = e.clipboardData.getData("text");
        if (!/\r?\n/.test(text)) return;
        e.preventDefault();
        onAdd(text.split(/\r?\n/), weight);
    };

    return (
        <form className={styles.form} onSubmit={submit}>
            <div className={styles.addRow}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onPaste={handlePaste}
                    maxLength={MAX_LABEL_LENGTH}
                    placeholder="Thêm lựa chọn, nhấn Enter…"
                    aria-label="Tên lựa chọn mới"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className={styles.addBtn}
                    aria-label="Thêm lựa chọn"
                    disabled={!label.trim()}
                >
                    <PlusIcon />
                </button>
            </div>

            {advanced && (
                <div className={styles.weightRow}>
                    <span className={styles.muted}>Trọng số cho mục mới</span>
                    <WeightStepper value={weight} onChange={setWeight} />
                </div>
            )}
        </form>
    );
}
