"use client";

import { MAX_OPTIONS } from "@/lib/constants";
import { TrashIcon } from "../Icons";
import OptionForm from "./OptionForm";
import OptionList from "./OptionList";
import PresetPicker from "./PresetPicker";
import styles from "./options.module.css";

export default function OptionsPanel({
    segments,
    advanced,
    onToggleAdvanced,
    onAdd,
    onRename,
    onWeight,
    onRemove,
    onClear,
    drafts,
    onApplyPreset,
    onApplyDraft,
    onSaveDraft,
    onRemoveDraft,
    locked,
    activeName
}) {
    return (
        <section
            className={styles.panel}
            aria-label="Danh sách lựa chọn"
            inert={locked}
            data-locked={locked}
        >
            <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Lựa chọn</h2>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={advanced}
                        onChange={(e) => onToggleAdvanced(e.target.checked)}
                    />
                    <span className={styles.track} aria-hidden="true" />
                    Nâng cao
                </label>
            </div>

            {advanced && (
                <p className={styles.hint}>
                    Trọng số càng lớn thì ô càng to và càng dễ được chọn.
                </p>
            )}

            <OptionForm advanced={advanced} onAdd={onAdd} />

            <OptionList
                segments={segments}
                advanced={advanced}
                onRename={onRename}
                onWeight={onWeight}
                onRemove={onRemove}
            />

            <div className={styles.footer}>
                <span className={styles.muted}>
                    {segments.length}/{MAX_OPTIONS} lựa chọn
                </span>
                <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={onClear}
                    disabled={segments.length === 0}
                >
                    <TrashIcon width={14} height={14} /> Xoá tất cả
                </button>
            </div>

            <PresetPicker
                segments={segments}
                drafts={drafts}
                onApplyPreset={onApplyPreset}
                onApplyDraft={onApplyDraft}
                onSaveDraft={onSaveDraft}
                onRemoveDraft={onRemoveDraft}
                activeName={activeName}
            />
        </section>
    );
}