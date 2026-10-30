"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Palette = dynamic(
  () => import("./command-palette-content").then((module) => module.CommandPaletteContent),
  { ssr: false },
);

/** Search is interactive on demand; keep its index after the first opening. */
export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (isOpen) setOpened(true);
  }, [isOpen]);
  return opened || isOpen ? <Palette isOpen={isOpen} onClose={onClose} /> : null;
}
