"use client";

import { useState } from "react";

let idCounter = 1;
const makeId = () => idCounter++;

export function useOptions(initialOptions) {
  const [options, setOptions] = useState(() =>
    initialOptions.map((o) => ({ ...o, id: makeId() }))
  );

  const addOption = (label, qty) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const safeQty = Math.max(1, Math.min(99, Number(qty) || 1));
    setOptions((prev) => [...prev, { id: makeId(), label: trimmed, qty: safeQty }]);
  };

  const removeOption = (id) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const updateQty = (id, delta) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, qty: Math.max(1, Math.min(99, o.qty + delta)) } : o
      )
    );
  };

  const clearAll = () => setOptions([]);

  return { options, addOption, removeOption, updateQty, clearAll };
}
