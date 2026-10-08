"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HISTORY_LIMIT, PRESETS, STORAGE_KEYS } from "@/lib/constants";
import { decodeShare } from "@/lib/share";
import { computeSegments } from "@/lib/wheel";
import { useDrafts } from "@/hooks/useDrafts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useOptions } from "@/hooks/useOptions";
import { useSound } from "@/hooks/useSound";
import { useSpin } from "@/hooks/useSpin";
import DisplayToggle from "./DisplayToggle";
import Header from "./Header";
import History from "./History";
import ResultModal from "./ResultModal";
import Toast from "./Toast";
import WheelTitle from "./WheelTitle";
import Wheel from "./Wheel";
import OptionsPanel from "./options/OptionsPanel";
import styles from "./LuckyWheel.module.css";

const parseHistory = (v) =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, HISTORY_LIMIT) : undefined;

const parseBoolean = (v) => (typeof v === "boolean" ? v : undefined);

/** Vòng quay đang dùng: { kind: "preset", name } | { kind: "draft", id } | null */
const parseActive = (v) => {
    if (v === null) return null;
    if (v?.kind === "preset" && typeof v.name === "string" && v.name) {
        return { kind: "preset", name: v.name };
    }
    if (v?.kind === "draft" && typeof v.id === "string") return { kind: "draft", id: v.id };
    return undefined;
};

const parseDisplay = (v) => (v === "text" || v === "icon" || v === "both" ? v : undefined);

export default function LuckyWheel() {
    const {
        options,
        isLoaded,
        addOptions,
        removeOption: removeOptionRaw,
        renameOption,
        setWeight,
        clearAll: clearAllRaw,
        replaceAll: replaceAllRaw,
        undoState,
        undo: undoRaw,
        dismissUndo,
    } = useOptions();
    const { drafts, saveDraft, renameDraft, removeDraft } = useDrafts();

    // Vòng quay đang dùng (mẫu có sẵn / mẫu đã lưu) để hiện tên phía trên vòng quay.
    const [active, setActive] = useLocalStorage(STORAGE_KEYS.active, null, { parse: parseActive });
    const prevActiveRef = useRef(null);

    const [advanced, setAdvanced] = useLocalStorage(STORAGE_KEYS.advanced, false, {
        parse: parseBoolean,
    });
    const [history, setHistory] = useLocalStorage(STORAGE_KEYS.history, [], {
        parse: parseHistory,
    });
    const [displayMode, setDisplayMode] = useLocalStorage(STORAGE_KEYS.display, "text", {
        parse: parseDisplay,
    });
    const [resultOpen, setResultOpen] = useState(false);

    const activeDraft = active?.kind === "draft" ? drafts.find((d) => d.id === active.id) : null;
    const wheelName = active?.kind === "preset" ? active.name : (activeDraft?.name ?? null);
    const wheelKind = wheelName ? active.kind : null;

    // Ghi nhớ tên hiện tại trước các thao tác có thể hoàn tác, để hoàn tác cũng trả lại tên.
    const keepActive = () => {
        prevActiveRef.current = active;
    };
    const removeOption = (id) => {
        keepActive();
        removeOptionRaw(id);
    };
    const clearAll = () => {
        keepActive();
        clearAllRaw();
        setActive(null);
    };
    const replaceAll = (list, message, nextActive = null) => {
        keepActive();
        replaceAllRaw(list, message);
        if (list.length > 0) setActive(nextActive);
    };
    const undo = () => {
        undoRaw();
        setActive(prevActiveRef.current);
    };

    const { segments, total } = useMemo(() => computeSegments(options), [options]);
    const { muted, toggleMuted, unlock, tick, win } = useSound();

    // Chế độ Hình / Cả hai chỉ có tác dụng khi có ít nhất một mục có hình.
    const hasIcons = options.some((o) => o.icon);
    const display = displayMode !== "text" && hasIcons ? displayMode : "text";

    const dialRef = useRef(null);
    const pointerRef = useRef(null);

    /* ---------- Mở link chia sẻ: ?i=<vị trí mẫu> | ?p=<id mẫu> | ?d=<danh sách mã hoá> ---------- */
    useEffect(() => {
        if (!isLoaded) return; // chờ đọc xong localStorage để không bị ghi đè
        const q = new URLSearchParams(window.location.search);
        const i = q.get("i");
        const p = q.get("p");
        const d = q.get("d");
        if (i === null && p === null && d === null) return;

        const index = i !== null && i.trim() !== "" ? Number(i) : NaN;
        const preset = Number.isInteger(index)
            ? PRESETS[index]
            : PRESETS.find((item) => item.id === p);

        if (preset) {
            replaceAll(preset.options, `Đã mở mẫu "${preset.label}"`, {
                kind: "preset",
                name: preset.label,
            });
        } else if (d) {
            const list = decodeShare(d);
            if (list?.length) replaceAll(list, "Đã mở danh sách được chia sẻ");
        }

        // Dọn URL để F5 không áp dụng lại
        window.history.replaceState(null, "", window.location.pathname);
    }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ---------- Quay ---------- */
    const handleTick = useCallback(() => {
        pointerRef.current?.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: "rotate(-26deg)" },
                { transform: "rotate(0deg)" },
            ],
            { duration: 90 }
        );
        tick();
    }, [tick]);

    const handleFinish = useCallback(
        (picked) => {
            win();
            setHistory((prev) => [picked.label, ...prev].slice(0, HISTORY_LIMIT));
            setResultOpen(true);
        },
        [win, setHistory]
    );

    const { spinning, winner, spin } = useSpin({
        segments,
        total,
        dialRef,
        onTick: handleTick,
        onFinish: handleFinish,
    });

    const startSpin = () => {
        unlock();
        setResultOpen(false);
        spin();
    };

    const closeResult = useCallback(() => setResultOpen(false), []);

    const removeWinner = () => {
        if (winner) removeOption(winner.id);
        setResultOpen(false);
    };

    /* ---------- Mẫu ---------- */
    const applyPreset = (preset) =>
        replaceAll(preset.options, `Đã áp dụng mẫu "${preset.label}"`, {
            kind: "preset",
            name: preset.label,
        });

    const applyDraft = (draft) =>
        replaceAll(draft.options, `Đã mở mẫu "${draft.name}"`, { kind: "draft", id: draft.id });

    const saveCurrentAsDraft = (name) => {
        const result = saveDraft(name, options);
        if (result.ok) setActive({ kind: "draft", id: result.id });
        return result;
    };

    /** Đặt tên cho vòng quay chưa có tên = lưu vào "Của tôi" với tên đó. */
    const nameCurrentWheel = (name) => {
        const clean = String(name ?? "").trim().toLowerCase();
        if (clean && drafts.some((d) => d.name.toLowerCase() === clean)) {
            return { ok: false, error: "Đã có mẫu trùng tên, hãy chọn tên khác." };
        }
        return saveCurrentAsDraft(name);
    };

    const renameWheel = (name) => (activeDraft ? renameDraft(activeDraft.id, name) : { ok: false });

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Header muted={muted} onToggleMuted={toggleMuted} />

                {!isLoaded ? (
                    <div className={styles.loading} aria-busy="true">
                        <div className={styles.skeleton} />
                    </div>
                ) : (
                    <main className={styles.main}>
                        <section className={styles.stage} aria-label="Vòng quay">
                            <WheelTitle
                                name={wheelName}
                                kind={wheelKind}
                                canSave={segments.length > 0}
                                onSave={nameCurrentWheel}
                                onRename={renameWheel}
                                locked={spinning}
                            />
                            <Wheel
                                segments={segments}
                                total={total}
                                spinning={spinning}
                                onSpin={startSpin}
                                dialRef={dialRef}
                                pointerRef={pointerRef}
                                display={display}
                            />
                            <DisplayToggle
                                value={display}
                                onChange={setDisplayMode}
                                hasIcons={hasIcons}
                            />
                            <History items={history} onClear={() => setHistory([])} />
                        </section>

                        <OptionsPanel
                            segments={segments}
                            advanced={advanced}
                            onToggleAdvanced={setAdvanced}
                            onAdd={addOptions}
                            onRename={renameOption}
                            onWeight={setWeight}
                            onRemove={removeOption}
                            onClear={clearAll}
                            drafts={drafts}
                            onApplyPreset={applyPreset}
                            onApplyDraft={applyDraft}
                            onSaveDraft={saveCurrentAsDraft}
                            onRemoveDraft={removeDraft}
                            locked={spinning}
                            activeName={wheelName}
                        />
                    </main>
                )}
            </div>

            <ResultModal
                winner={resultOpen ? winner : null}
                onClose={closeResult}
                onSpinAgain={startSpin}
                onRemove={removeWinner}
            />
            <Toast toast={undoState} onUndo={undo} onClose={dismissUndo} />
        </div>
    );
}