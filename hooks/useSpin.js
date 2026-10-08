"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SPIN_DURATION_MS } from "@/lib/constants";
import {
    computeTargetRotation,
    easeOutQuart,
    pickWeightedSegment,
    segmentAt,
} from "@/lib/wheel";

/**
 * Điều khiển việc quay bằng requestAnimationFrame.
 * Góc quay được ghi thẳng vào DOM (dialRef) nên không phải render lại 60 lần/giây,
 * và ta biết chính xác lúc kim lướt qua ranh giới giữa hai ô để phát tiếng "tách".
 */
export function useSpin({ segments, total, dialRef, onTick, onFinish }) {
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState(null);

    const rotationRef = useRef(0);
    const rafRef = useRef(0);
    const busyRef = useRef(false);
    const handlers = useRef({ onTick, onFinish });

    useEffect(() => {
        handlers.current = { onTick, onFinish };
    });

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    const spin = useCallback(() => {
        if (busyRef.current || total === 0 || !dialRef.current) return;

        busyRef.current = true;
        setSpinning(true);
        setWinner(null);

        const picked = pickWeightedSegment(segments, total);
        const from = rotationRef.current;
        const to = computeTargetRotation(from, picked);
        const reduceMotion = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const duration = reduceMotion ? 1200 : SPIN_DURATION_MS;
        const startedAt = performance.now();
        let lastId = segmentAt(segments, from)?.id;

        const frame = (now) => {
            const t = Math.min(1, Math.max(0, (now - startedAt) / duration));
            const rotation = from + (to - from) * easeOutQuart(t);
            rotationRef.current = rotation;
            if (dialRef.current)
                dialRef.current.style.transform = `rotate(${rotation}deg)`;

            const current = segmentAt(segments, rotation);
            if (current && current.id !== lastId) {
                lastId = current.id;
                handlers.current.onTick?.();
            }

            if (t < 1) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }
            busyRef.current = false;
            setSpinning(false);
            setWinner(picked);
            handlers.current.onFinish?.(picked);
        };

        rafRef.current = requestAnimationFrame(frame);
    }, [segments, total, dialRef]);

    return { spinning, winner, spin };
}
