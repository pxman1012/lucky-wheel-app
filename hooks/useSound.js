"use client";

import { useCallback, useEffect, useRef } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { useLocalStorage } from "./useLocalStorage";

/** Âm thanh tạo bằng Web Audio API (không cần file mp3). */
export function useSound() {
    const [muted, setMuted] = useLocalStorage(STORAGE_KEYS.muted, false, {
        parse: (v) => (typeof v === "boolean" ? v : undefined),
    });
    const mutedRef = useRef(muted);
    const ctxRef = useRef(null);
    const lastTickRef = useRef(0);

    useEffect(() => {
        mutedRef.current = muted;
    }, [muted]);

    const getContext = useCallback(() => {
        if (typeof window === "undefined") return null;
        if (!ctxRef.current) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            ctxRef.current = new AudioCtx();
        }
        if (ctxRef.current.state === "suspended") ctxRef.current.resume();
        return ctxRef.current;
    }, []);

    const beep = useCallback(
        (
            frequency,
            duration,
            { type = "triangle", volume = 0.06, delay = 0 } = {},
        ) => {
            const ctx = getContext();
            if (!ctx) return;
            const start = ctx.currentTime + delay;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, start);
            gain.gain.setValueAtTime(volume, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            osc.connect(gain).connect(ctx.destination);
            osc.start(start);
            osc.stop(start + duration);
        },
        [getContext],
    );

    /** Gọi trong sự kiện click để trình duyệt cho phép phát âm thanh. */
    const unlock = useCallback(() => {
        if (!mutedRef.current) getContext();
    }, [getContext]);

    const tick = useCallback(() => {
        if (mutedRef.current) return;
        const now = performance.now();
        if (now - lastTickRef.current < 35) return; // tránh dồn tiếng khi quay nhanh
        lastTickRef.current = now;
        beep(900, 0.04, { type: "square", volume: 0.025 });
    }, [beep]);

    const win = useCallback(() => {
        if (mutedRef.current) return;
        [523.25, 659.25, 783.99].forEach((f, i) =>
            beep(f, 0.35, { volume: 0.07, delay: i * 0.12 }),
        );
    }, [beep]);

    const toggleMuted = useCallback(() => setMuted((m) => !m), [setMuted]);

    return { muted, toggleMuted, unlock, tick, win };
}
