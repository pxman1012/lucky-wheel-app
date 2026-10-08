"use client";

import { useState } from "react";
import { MAX_DRAFT_NAME, MAX_DRAFTS, PRESETS } from "@/lib/constants";
import { buildShareLink, encodeShare } from "@/lib/share";
import { CloseIcon } from "../Icons";
import styles from "./presets.module.css";

/** Tab "Có sẵn" (mẫu public) và "Của tôi" (mẫu lưu local), kèm chia sẻ bằng link. */
export default function PresetPicker({
    segments,
    drafts,
    onApplyPreset,
    onApplyDraft,
    onSaveDraft,
    onRemoveDraft,
    activeName,
}) {
    const [tab, setTab] = useState("builtin"); // "builtin" | "mine"
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [copiedKey, setCopiedKey] = useState(null);

    const isFull = drafts.length >= MAX_DRAFTS;

    const share = async (url, title, key) => {
        // Điện thoại: mở bảng chia sẻ của hệ điều hành. Máy tính: copy link.
        if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
            try {
                await navigator.share({ title, url });
            } catch {
                // người dùng đóng bảng chia sẻ
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopiedKey(key);
            window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
        } catch {
            window.prompt("Sao chép link này:", url);
        }
    };

    const toShareOptions = (list) => list.map((o) => ({ label: o.label, weight: o.weight ?? 1, icon: o.icon }));

    const submitSave = (e) => {
        e.preventDefault();
        const result = onSaveDraft(name);
        if (result.ok) {
            setName("");
            setError("");
            setSaving(false);
        } else {
            setError(result.error);
        }
    };

    const cancelSave = () => {
        setSaving(false);
        setName("");
        setError("");
    };

    const shareLabel = (key) => (copiedKey === key ? "Đã copy" : "Chia sẻ");

    return (
        <div className={styles.wrap}>
            <div className={styles.tabs} role="tablist" aria-label="Mẫu">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "builtin"}
                    className={styles.tab}
                    onClick={() => setTab("builtin")}
                >
                    Có sẵn
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "mine"}
                    className={styles.tab}
                    onClick={() => setTab("mine")}
                >
                    Của tôi ({drafts.length}/{MAX_DRAFTS})
                </button>
            </div>

            {tab === "builtin" && (
                <ul className={styles.list}>
                    {PRESETS.map((preset, index) => (
                        <li key={preset.id} className={styles.row}>
                            <button
                                type="button"
                                className={styles.main}
                                onClick={() => onApplyPreset(preset)}
                            >
                                <span className={styles.name}>{preset.label}</span>
                                <span className={styles.count}>{preset.options.length} mục</span>
                            </button>
                            <button
                                type="button"
                                className={styles.action}
                                onClick={() =>
                                    share(buildShareLink({ i: index }), preset.label, `p-${index}`)
                                }
                            >
                                {shareLabel(`p-${index}`)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {tab === "mine" && (
                <>
                    {drafts.length === 0 ? (
                        <p className={styles.empty}>
                            Chưa có mẫu nào. Tạo danh sách rồi bấm "Lưu danh sách hiện tại" để dùng lại
                            sau.
                        </p>
                    ) : (
                        <ul className={styles.list}>
                            {drafts.map((draft) => (
                                <li key={draft.id} className={styles.row}>
                                    <button
                                        type="button"
                                        className={styles.main}
                                        onClick={() => onApplyDraft(draft)}
                                    >
                                        <span className={styles.name}>{draft.name}</span>
                                        <span className={styles.count}>
                                            {draft.options.length} mục
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.action}
                                        onClick={() =>
                                            share(
                                                buildShareLink({ d: encodeShare(draft.options) }),
                                                draft.name,
                                                draft.id
                                            )
                                        }
                                    >
                                        {shareLabel(draft.id)}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.remove}
                                        onClick={() => onRemoveDraft(draft.id)}
                                        aria-label={`Xoá mẫu ${draft.name}`}
                                    >
                                        <CloseIcon width={16} height={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {saving ? (
                        <form className={styles.saveForm} onSubmit={submitSave}>
                            <input
                                className={styles.saveInput}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={MAX_DRAFT_NAME}
                                placeholder="Tên mẫu, ví dụ: Đi ăn team"
                                aria-label="Tên mẫu"
                                autoFocus
                            />
                            <button type="submit" className={styles.saveBtn}>
                                Lưu
                            </button>
                            <button type="button" className={styles.cancelBtn} onClick={cancelSave}>
                                Huỷ
                            </button>
                        </form>
                    ) : (
                        <div className={styles.footerRow}>
                            <button
                                type="button"
                                className={styles.primaryLink}
                                onClick={() => {
                                    setName(activeName ?? "");
                                    setSaving(true);
                                }}
                                disabled={segments.length === 0 || isFull}
                            >
                                + Lưu danh sách hiện tại
                            </button>
                            <button
                                type="button"
                                className={styles.action}
                                disabled={segments.length === 0}
                                onClick={() =>
                                    share(
                                        buildShareLink({ d: encodeShare(toShareOptions(segments)) }),
                                        "Vòng quay may mắn",
                                        "current"
                                    )
                                }
                            >
                                {shareLabel("current")} danh sách này
                            </button>
                        </div>
                    )}

                    {isFull && !saving && (
                        <p className={styles.error}>Đã đủ {MAX_DRAFTS} mẫu, hãy xoá bớt để lưu thêm.</p>
                    )}
                    {error && <p className={styles.error}>{error}</p>}
                </>
            )}
        </div>
    );
}