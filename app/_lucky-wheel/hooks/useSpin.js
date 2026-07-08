"use client";

import { useCallback, useState } from "react";
import { computeSpinRotation, pickWeightedSegment } from "../utils";
import { SPIN_DURATION_MS } from "../constants";

export function useSpin(segments, total) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const spin = useCallback(() => {
    if (spinning || total === 0) return;

    setShowResult(false);
    setWinner(null);
    setSpinning(true);

    const picked = pickWeightedSegment(segments, total);
    const newRotation = computeSpinRotation(rotation, picked);
    setRotation(newRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setShowResult(true);
    }, SPIN_DURATION_MS);
  }, [spinning, total, segments, rotation]);

  const closeResult = () => setShowResult(false);

  return { rotation, spinning, winner, showResult, spin, closeResult };
}
