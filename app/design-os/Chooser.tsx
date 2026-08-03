"use client";

/* Routes the reader to the right rendering of the page. Width is the gate and
   it stays live: below the desktop breakpoint nothing renders but the message,
   on arrival and on any later resize or rotation. Above it, the story is a
   desktop experience by design and needs a fine pointer and motion; a reader
   who has neither gets the classic view, which carries the same record. That
   second choice is made once on mount, so a resize mid-visit never yanks the
   page out from under the reader. */

import { useEffect, useState } from "react";
import { DesignSystemView } from "./DesignSystemView";
import { DesktopGate } from "./DesktopGate";
// Earlier worlds stay parked on file (PressStory, WaterStory); the literal
// component-based assembly ships.
import { AssemblyStory } from "./story/AssemblyStory";

const DESKTOP = "(min-width: 1080px)";

export function Chooser() {
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"story" | "classic" | null>(null);

  useEffect(() => {
    const mq = matchMedia(DESKTOP);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(fine && !still ? "story" : "classic");
  }, []);

  if (desktop === null || mode === null) return <div className="ds-boot" aria-hidden="true" />;
  if (!desktop) return <DesktopGate />;
  return mode === "story" ? <AssemblyStory /> : <DesignSystemView />;
}
