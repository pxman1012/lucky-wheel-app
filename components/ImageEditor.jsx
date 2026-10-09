"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resolveIcon } from "@/lib/icons";
import { MAX_ZOOM, clampView, drawCover, exportImage, loadImage, loadImageFile } from "@/lib/image";
import styles from "./ImageEditor.module.css";

const PREVIEW = 260; // cạnh khung xem trước (px)
const START_VIEW = { zoom: 1, ox: 0, oy: 0 };

/**
 * Cửa sổ chọn / chỉnh ảnh cho một lựa chọn: chọn file, kéo để căn, kéo thanh để zoom,
 * chọn bo tròn hoặc vuông. `icon` là icon hiện tại (nếu là ảnh tải lên thì mở sẵn để sửa).
 */
export default function ImageEditor({ icon, onSave, onRemove, onClose }) {
    const existing = (() => {
        const r = resolveIcon(icon);
        return r?.type === "upload" ? r : null;
    })();

    const [img, setImg] = useState(null);
    const [view, setView] = useState(START_VIEW);
    const [round, setRound] = useState(existing ? existing.round : true);
    const [error, setError] = useState("");
    const canvasRef = useRef(null);
    const fileRef = useRef(null);
    const dragRef = useRef(null);

    // Mở sẵn ảnh đã tải lên trước đó.
    useEffect(() => {
        if (!existing) return;
        let alive = true;
        loadImage(existing.src)
            .then((loaded) => alive && setImg(loaded))
            .catch(() => alive && setError("Không mở được ảnh cũ, hãy chọn ảnh mới."));
        return () => {
            alive = false;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Vẽ lại khung xem trước.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !img) return;
        const px = Math.round(PREVIEW * (window.devicePixelRatio || 1));
        canvas.width = px;
        canvas.height = px;
        drawCover(canvas.getContext("2d"), img, px, view);
    }, [img, view]);

    useEffect(() => {
        const onKeyDown = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const onFile = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // cho phép chọn lại đúng file cũ
        if (!file) return;
        try {
            setImg(await loadImageFile(file));
            setView(START_VIEW);
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const onPointerDown = (e) => {
        if (!img) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = { x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy };
    };

    const onPointerMove = (e) => {
        const d = dragRef.current;
        if (!d) return;
        const dx = (e.clientX - d.x) / PREVIEW;
        const dy = (e.clientY - d.y) / PREVIEW;
        setView((v) => clampView(img, { ...v, ox: d.ox + dx, oy: d.oy + dy }));
    };

    const endDrag = () => {
        dragRef.current = null;
    };

    const onZoom = (e) => {
        const zoom = Number(e.target.value);
        setView((v) => clampView(img, { ...v, zoom }));
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-label="Ảnh của lựa chọn"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className={styles.title}>Ảnh cho lựa chọn</h3>

                {img ? (
                    <>
                        <div
                            className={styles.stage}
                            style={{ width: PREVIEW, height: PREVIEW }}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={endDrag}
                            onPointerCancel={endDrag}
                        >
                            <canvas ref={canvasRef} className={styles.canvas} />
                            <div className={styles.mask} data-round={round} />
                        </div>
                        <p className={styles.hint}>Kéo ảnh để căn, kéo thanh bên dưới để phóng to.</p>

                        <input
                            className={styles.zoom}
                            type="range"
                            min="1"
                            max={MAX_ZOOM}
                            step="0.01"
                            value={view.zoom}
                            onChange={onZoom}
                            aria-label="Phóng to"
                        />

                        <div className={styles.shape} role="radiogroup" aria-label="Kiểu hiển thị">
                            <button
                                type="button"
                                role="radio"
                                aria-checked={round}
                                className={styles.shapeBtn}
                                onClick={() => setRound(true)}
                            >
                                Tròn
                            </button>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={!round}
                                className={styles.shapeBtn}
                                onClick={() => setRound(false)}
                            >
                                Vuông
                            </button>
                        </div>
                    </>
                ) : (
                    <button type="button" className={styles.drop} onClick={() => fileRef.current?.click()}>
                        <span className={styles.dropTitle}>Chọn ảnh từ máy</span>
                        <span className={styles.dropSub}>JPG, PNG, WebP... (không bắt buộc)</span>
                    </button>
                )}

                {error && <p className={styles.error}>{error}</p>}

                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />

                <div className={styles.links}>
                    {img && (
                        <button type="button" className={styles.link} onClick={() => fileRef.current?.click()}>
                            Chọn ảnh khác
                        </button>
                    )}
                    {onRemove && (
                        <button type="button" className={styles.linkDanger} onClick={onRemove}>
                            Xoá ảnh
                        </button>
                    )}
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancel} onClick={onClose}>
                        Huỷ
                    </button>
                    <button
                        type="button"
                        className={styles.save}
                        disabled={!img}
                        onClick={() => onSave(exportImage(img, view, round))}
                    >
                        Lưu ảnh
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}