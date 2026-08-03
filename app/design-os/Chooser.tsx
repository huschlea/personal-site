"use client";

/* Width is the only question, and it stays live: below the desktop breakpoint
   nothing renders but the message, on arrival and on any later resize or
   rotation. Above it, every reader gets the story. A reader who has asked for
   less motion gets the same system, arriving at each stage rather than
   traveling to it; the engine and the stylesheet both honour the preference.

   Earlier worlds stay parked on file (DesignSystemView, PressStory,
   WaterStory) and are no longer reachable; the assembly is the page. */

import { useEffect, useState } from "react";
import { DesktopGate } from "./DesktopGate";
import { AssemblyStory } from "./story/AssemblyStory";

const DESKTOP = "(min-width: 1080px)";

export function Chooser() {
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = matchMedia(DESKTOP);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (desktop === null) return <div className="ds-boot" aria-hidden="true" />;
  return desktop ? <AssemblyStory /> : <DesktopGate />;
}
