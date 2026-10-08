"use client";

import { useEffect, useRef } from "react";
import { PALETTE } from "@/lib/constants";

const COUNT = 140;
const DURATION_MS = 2800;

/** Pháo giấy vẽ bằng canvas, không cần thư viện. Tự dừng sau ~3 giây. */
export default function Confetti() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
            return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const pieces = Array.from({ length: COUNT }, () => ({
            x: width / 2 + (Math.random() - 0.5) * width * 0.25,
            y: height * 0.4,
            vx: (Math.random() - 0.5) * 14,
            vy: -Math.random() * 14 - 4,
            size: 6 + Math.random() * 6,
            rotation: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 0.35,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        }));

        const startedAt = performance.now();
        let raf = 0;

        const frame = (now) => {
            const elapsed = now - startedAt;
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = Math.max(
                0,
                Math.min(1, (DURATION_MS - elapsed) / 600),
            );

            for (const p of pieces) {
                p.vy += 0.35; // trọng lực
                p.vx *= 0.99;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.spin;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                ctx.restore();
            }

            if (elapsed < DURATION_MS) raf = requestAnimationFrame(frame);
            else ctx.clearRect(0, 0, width, height);
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 60,
            }}
        />
    );
}
