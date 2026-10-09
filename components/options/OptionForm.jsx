"use client";

import { useRef, useState } from "react";
import { MAX_LABEL_LENGTH } from "@/lib/constants";
import ImageEditor from "../ImageEditor";
import { ImageIcon, PlusIcon } from "../Icons";
import OptionIcon from "../OptionIcon";
import WeightStepper from "./WeightStepper";
import styles from "./options.module.css";

/**
 * Nút ảnh + ô nhập + nút "+" trên một dòng. Enter để thêm; dán nhiều dòng sẽ thêm nhiều mục.
 * Ảnh là tuỳ chọn: bấm nút ảnh để chọn / chỉnh, bấm lại để sửa hoặc xoá.
 */
export default function OptionForm({ advanced, onAdd }) {
    const [label, setLabel] = useState("");
    const [weight, setWeight] = useState(1);
    const [icon, setIcon] = useState(undefined);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        if (onAdd(label, weight, icon)) {
            setLabel("");
            setWeight(1);
            setIcon(undefined);
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
                <button
                    type="button"
                    className={styles.imgBtn}
                    onClick={() => setEditing(true)}
                    aria-label={icon ? "Sửa ảnh" : "Thêm ảnh (không bắt buộc)"}
                    title={icon ? "Sửa ảnh" : "Thêm ảnh (không bắt buộc)"}
                >
                    {icon ? <OptionIcon key={icon} icon={icon} size={30} /> : <ImageIcon />}
                </button>
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

            {editing && (
                <ImageEditor
                    icon={icon}
                    onSave={(next) => {
                        setIcon(next);
                        setEditing(false);
                    }}
                    onRemove={
                        icon
                            ? () => {
                                  setIcon(undefined);
                                  setEditing(false);
                              }
                            : undefined
                    }
                    onClose={() => setEditing(false)}
                />
            )}
        </form>
    );
}