"use client";

/* Routes the reader to the right rendering of the page. The press story is a
   desktop experience by design: it needs a fine pointer, a wide viewport, and
   motion. Everything else gets the classic view, which carries the same
   content and the same record. Decided once on mount; a resize mid-visit does
   not yank the page out from under the reader. */

import { useEffect, useState } from "react";
import { DesignSystemView } from "./DesignSystemView";
// Earlier worlds stay parked on file (PressStory, WaterStory); the literal
// component-based assembly ships.
import { AssemblyStory } from "./story/AssemblyStory";

export function Chooser() {
  const [mode, setMode] = useState<"story" | "classic" | null>(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const wide = window.innerWidth >= 1080;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(fine && wide && !still ? "story" : "classic");
  }, []);

  if (mode === null) return <div className="ds-boot" aria-hidden="true" />;
  return mode === "story" ? <AssemblyStory /> : <DesignSystemView />;
}
