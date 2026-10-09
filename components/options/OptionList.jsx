"use client";

import { useState } from "react";
import { MAX_LABEL_LENGTH } from "@/lib/constants";
import ImageEditor from "../ImageEditor";
import { CloseIcon, PlusIcon } from "../Icons";
import OptionIcon from "../OptionIcon";
import WeightStepper from "./WeightStepper";
import styles from "./options.module.css";

function OptionItem({ segment, advanced, onRename, onWeight, onIcon, onRemove }) {
    const [draft, setDraft] = useState(null); // null = không đang sửa tên
    const [editingImage, setEditingImage] = useState(false);

    const commit = () => {
        if (draft !== null && draft.trim()) onRename(segment.id, draft);
        setDraft(null);
    };

    return (
        <li className={styles.item}>
            <span className={styles.dot} style={{ background: segment.color }} />

            <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setEditingImage(true)}
                aria-label={segment.icon ? `Sửa ảnh của ${segment.label}` : `Thêm ảnh cho ${segment.label}`}
                title={segment.icon ? "Sửa ảnh" : "Thêm ảnh"}
            >
                {segment.icon ? (
                    <OptionIcon key={segment.icon} icon={segment.icon} size={22} />
                ) : (
                    <span className={styles.addImg}>
                        <PlusIcon width={12} height={12} />
                    </span>
                )}
            </button>

            <input
                className={styles.name}
                value={draft ?? segment.label}
                maxLength={MAX_LABEL_LENGTH}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") {
                        setDraft(null);
                        e.currentTarget.blur();
                    }
                }}
                aria-label="Sửa tên lựa chọn"
            />

            {advanced && (
                <>
                    <span className={styles.percent}>{segment.percent}%</span>
                    <WeightStepper
                        value={segment.weight}
                        onChange={(w) => onWeight(segment.id, w)}
                        label={`trọng số của ${segment.label}`}
                    />
                </>
            )}

            <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(segment.id)}
                aria-label={`Xoá ${segment.label}`}
            >
                <CloseIcon width={16} height={16} />
            </button>

            {editingImage && (
                <ImageEditor
                    icon={segment.icon}
                    onSave={(next) => {
                        onIcon(segment.id, next);
                        setEditingImage(false);
                    }}
                    onRemove={
                        segment.icon
                            ? () => {
                                  onIcon(segment.id, undefined);
                                  setEditingImage(false);
                              }
                            : undefined
                    }
                    onClose={() => setEditingImage(false)}
                />
            )}
        </li>
    );
}

export default function OptionList({ segments, advanced, onRename, onWeight, onIcon, onRemove }) {
    if (segments.length === 0) {
        return (
            <p className={styles.empty}>
                Chưa có lựa chọn nào. Hãy thêm vài mục hoặc chọn một mẫu bên dưới.
            </p>
        );
    }

    return (
        <ul className={styles.list}>
            {segments.map((s) => (
                <OptionItem
                    key={s.id}
                    segment={s}
                    advanced={advanced}
                    onRename={onRename}
                    onWeight={onWeight}
                    onIcon={onIcon}
                    onRemove={onRemove}
                />
            ))}
        </ul>
    );
}