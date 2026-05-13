"use client";

import { useEffect, useRef, useState } from "react";

// ============ SCHEDULE DATA (verbatim from dixon-website-01) ============

type ClassEntry = {
  name: string;
  day: number;
  start: number;
  end: number;
  color: string;
};

const HOURS_START = 8;
const HOURS_END = 18;

const DAYS = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
] as const;

const COLOR_CW = "#1f9999";
const COLOR_PB = "#7fb821";
const COLOR_GTR = "#7e3acf";
const COLOR_PNT = "#e63a86";
const COLOR_SK8 = "#2563d6";
const COLOR_LW = "#2d8c40";
const COLOR_FB = "#dd711f";
const COLOR_FF = "#8c2e2e";

const SCHEDULE: ClassEntry[] = [
  { name: "creative writing", day: 0, start: 9, end: 11, color: COLOR_CW },
  { name: "creative writing", day: 1, start: 9, end: 11, color: COLOR_CW },
  { name: "creative writing", day: 2, start: 9, end: 11, color: COLOR_CW },
  { name: "creative writing", day: 3, start: 9, end: 11, color: COLOR_CW },
  { name: "creative writing", day: 4, start: 9, end: 11, color: COLOR_CW },
  { name: "pickleball", day: 0, start: 12, end: 14, color: COLOR_PB },
  { name: "electric guitar", day: 0, start: 15, end: 18, color: COLOR_GTR },
  { name: "pickleball", day: 2, start: 14, end: 16, color: COLOR_PB },
  { name: "intro to sk8boarding", day: 2, start: 16, end: 18, color: COLOR_SK8 },
  { name: "painting", day: 3, start: 12, end: 17, color: COLOR_PNT },
  { name: "life & wellness", day: 5, start: 8, end: 9, color: COLOR_LW },
  { name: "life & wellness", day: 5, start: 9, end: 10, color: COLOR_LW },
  { name: "life & wellness", day: 5, start: 10, end: 11, color: COLOR_LW },
  { name: "life & wellness", day: 5, start: 11, end: 12, color: COLOR_LW },
  { name: "life & wellness", day: 5, start: 12, end: 13, color: COLOR_LW },
  { name: "football", day: 5, start: 13, end: 16, color: COLOR_FB },
  { name: "fantasy football", day: 6, start: 10, end: 12, color: COLOR_FF },
];

function formatHourLabel(hour: number): string {
  if (hour === 12) return "12";
  return String(((hour - 1) % 12) + 1);
}

function formatRange(start: number, end: number): string {
  return `${formatHourLabel(start)}–${formatHourLabel(end)}`;
}

// ============ STYLES (verbatim from dixon globals.css, scoped under .dcs-wrap) ============

const FONT_HAND = "'Gloria Hallelujah', cursive";
const FONT_ATKINSON = "'Atkinson Hyperlegible', system-ui, sans-serif";

const STYLES = `
.dcs-wrap {
  --ink: #1a1a1a;
  --ink-muted: #5a5a5a;
  --rule: #e5dfd3;
  /* Bleed wider than the v2 editorial column (520px) so the full
     schedule fits on desktop without horizontal scroll, matching the
     Dixon page behavior. Falls back to the available viewport width on
     narrower screens, where the schedule scrolls horizontally and the
     mobile swipe hint appears. */
  width: min(880px, calc(100vw - 32px));
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* The schedule has ~50 SVG-filtered elements (feTurbulence is
     CPU-heavy). content-visibility: auto skips all paint/layout work
     when the schedule is offscreen, so page-level scrolling never
     touches it. contain-intrinsic-size reserves space so there's no
     layout shift when it scrolls into view. */
  content-visibility: auto;
  contain-intrinsic-size: auto 760px;
}

.dcs-wrap .dcs-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.dcs-wrap .schedule__scroll {
  width: 100%;
  max-width: 980px;
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
.dcs-wrap .schedule__scroll::-webkit-scrollbar {
  display: none;
}

.dcs-wrap .schedule__scrollbar {
  position: relative;
  width: 100%;
  max-width: 980px;
  height: 3px;
  margin: 12px auto 0;
  background: rgba(26, 26, 26, 0.06);
  border-radius: 999px;
  overflow: visible;
  opacity: 0;
  transition: opacity 400ms ease;
}
.dcs-wrap .schedule__scrollbar--active {
  opacity: 1;
  transition: opacity 100ms ease;
}
.dcs-wrap .schedule__scrollbar--hidden {
  visibility: hidden;
}
.dcs-wrap .schedule__scrollbar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(26, 26, 26, 0.26);
  border-radius: 999px;
  will-change: transform, width;
}

.dcs-wrap .schedule__board {
  position: relative;
  min-width: 760px;
  padding: 36px 30px 30px 56px;
}

.dcs-wrap .schedule__sketch {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 0;
}
.dcs-wrap .schedule__sketch path {
  fill: none;
  stroke: #6b4a2b;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  opacity: 0.85;
}

.dcs-wrap .schedule__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 36px repeat(7, 1fr);
  grid-template-rows: 30px repeat(10, 66px);
  gap: 0;
}

.dcs-wrap .schedule__corner {
  grid-column: 1;
  grid-row: 1;
}

.dcs-wrap .schedule__day-header {
  grid-row: 1;
  align-self: end;
  padding-bottom: 6px;
  font-family: ${FONT_HAND};
  font-size: 18px;
  letter-spacing: 0;
  color: var(--ink);
  text-align: center;
  filter: url(#dcs-pen-paper);
}

.dcs-wrap .schedule__hour-label {
  grid-column: 1;
  align-self: start;
  margin-top: -8px;
  padding-right: 8px;
  font-family: ${FONT_HAND};
  font-size: 14px;
  color: var(--ink-muted);
  text-align: right;
  filter: url(#dcs-pen-paper);
}

.dcs-wrap .schedule__hour-line {
  grid-column: 2 / -1;
  align-self: start;
  width: 100%;
  height: 1px;
  background: var(--rule);
  opacity: 0.7;
  z-index: 0;
}

.dcs-wrap .schedule__day-sep {
  grid-row: 1 / -1;
  justify-self: end;
  width: 1px;
  height: 100%;
  background: var(--rule);
  opacity: 0.55;
  z-index: 0;
}

.dcs-wrap .schedule__block {
  position: relative;
  margin: 3px 4px;
  padding: 8px 11px 7px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 2px;
  overflow: hidden;
  z-index: 2;
}
.dcs-wrap .schedule__block::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 1.6px solid var(--block-color);
  border-radius: 2px;
  background: color-mix(in srgb, var(--block-color) 16%, transparent);
  filter: url(#dcs-pen-paper-fine);
  pointer-events: none;
  z-index: 0;
}
.dcs-wrap .schedule__block-content {
  position: relative;
  z-index: 1;
}
.dcs-wrap .schedule__block-name {
  font-family: ${FONT_ATKINSON};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--ink);
  -webkit-text-stroke: 0.3px currentColor;
  text-wrap: balance;
}
.dcs-wrap .schedule__block-time {
  margin-top: 3px;
  font-family: ${FONT_HAND};
  font-size: 13px;
  line-height: 1;
  color: var(--block-color);
  filter: url(#dcs-pen-paper);
}

.dcs-wrap .schedule__hint {
  display: none;
}

@keyframes dcs-hint-nudge {
  0%, 100% { transform: translateX(0); }
  45% { transform: translateX(12px); }
  65% { transform: translateX(0); }
}

@media (max-width: 767px) {
  .dcs-wrap .schedule__hint {
    display: inline-flex;
    align-items: baseline;
    gap: 10px;
    margin-top: 16px;
    font-family: ${FONT_HAND};
    font-size: 18px;
    line-height: 1;
    color: var(--ink-muted);
    opacity: 0.9;
    filter: url(#dcs-pen-paper);
  }
  .dcs-wrap .schedule__hint-arrow {
    display: inline-block;
    animation: dcs-hint-nudge 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dcs-wrap .schedule__hint-arrow {
    animation: none;
  }
}

@media (max-width: 767px) {
  .dcs-wrap .schedule__scroll {
    padding: 0 2px;
  }
  .dcs-wrap .schedule__board {
    min-width: 700px;
    padding: 28px 22px 24px 44px;
  }
  .dcs-wrap .schedule__grid {
    grid-template-columns: 28px repeat(7, 1fr);
    grid-template-rows: 28px repeat(10, 56px);
  }
  .dcs-wrap .schedule__day-header {
    font-size: 15px;
  }
  .dcs-wrap .schedule__hour-label {
    font-size: 12px;
  }
  .dcs-wrap .schedule__block {
    margin: 2px 3px;
    padding: 5px 7px 5px;
  }
  .dcs-wrap .schedule__block-name {
    font-size: 12px;
    line-height: 1.02;
  }
  .dcs-wrap .schedule__block-time {
    font-size: 11px;
    margin-top: 2px;
  }
}
`;

// ============ COMPONENT ============

export function DixonScheduleSandbox() {
  const hourCount = HOURS_END - HOURS_START;
  const hourLabels = Array.from({ length: hourCount }, (_, i) => HOURS_START + i);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ visible: false, width: 0, offset: 0 });
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let idleTimer: number | null = null;
    const measure = () => {
      rafId = null;
      const visibleW = el.clientWidth;
      const totalW = el.scrollWidth;
      if (totalW - visibleW < 2) {
        setBar({ visible: false, width: 0, offset: 0 });
        return;
      }
      const trackW = visibleW;
      const ratio = visibleW / totalW;
      const width = Math.max(40, ratio * trackW);
      const maxScroll = totalW - visibleW;
      const progress = el.scrollLeft / maxScroll;
      const offset = progress * (trackW - width);
      setBar({ visible: true, width, offset });
    };

    const scheduleMeasure = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(measure);
    };

    const onScroll = () => {
      setActive(true);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setActive(false), 700);
      scheduleMeasure();
    };

    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="dcs-wrap">
        <svg
          className="dcs-filters"
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter id="dcs-pen-paper" x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.4 0.55"
                numOctaves={3}
                seed={11}
                result="edgeNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="edgeNoise"
                scale="1.6"
                result="displaced"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85 0.65"
                numOctaves={2}
                seed={19}
                result="grain"
              />
              <feColorMatrix
                in="grain"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1.7 -0.2"
                result="grainMask"
              />
              <feComposite in="displaced" in2="grainMask" operator="in" />
            </filter>
            <filter
              id="dcs-pen-paper-fine"
              x="-6%"
              y="-6%"
              width="112%"
              height="112%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.55 0.7"
                numOctaves={2}
                seed={11}
                result="edgeNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="edgeNoise"
                scale="1.15"
                result="displaced"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9 0.75"
                numOctaves={2}
                seed={19}
                result="grain"
              />
              <feColorMatrix
                in="grain"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1.5 -0.13"
                result="grainMask"
              />
              <feComposite in="displaced" in2="grainMask" operator="in" />
            </filter>
          </defs>
        </svg>

        <div
          className="schedule__scroll"
          ref={scrollRef}
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 280ms ease-out",
          }}
        >
          <div className="schedule__board">
            <svg
              className="schedule__sketch"
              viewBox="0 0 200 130"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="dcs-schedule-paper">
                  <path d="M3,4 C42,2 110,3 197,5 C198,40 196,92 197,126 C140,128 78,127 3,126 C2,92 4,40 3,4 Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#dcs-schedule-paper)">
                <rect x="0" y="0" width="200" height="130" fill="#f6f1e8" />
              </g>
              <path
                filter="url(#dcs-pen-paper-fine)"
                d="M3,4 C42,2 110,3 197,5 C198,40 196,92 197,126 C140,128 78,127 3,126 C2,92 4,40 3,4 Z"
              />
            </svg>

            <div className="schedule__grid">
              <div className="schedule__corner" aria-hidden="true" />

              {DAYS.map((day, dayIdx) => (
                <div
                  key={day.full}
                  className="schedule__day-header"
                  style={{ gridColumn: dayIdx + 2 }}
                >
                  {day.short}
                </div>
              ))}

              {hourLabels.map((h, i) => (
                <div
                  key={`hour-${h}`}
                  className="schedule__hour-label"
                  style={{ gridRow: i + 2 }}
                >
                  {formatHourLabel(h)}
                </div>
              ))}

              <div
                className="schedule__hour-line schedule__hour-line--header"
                style={{ gridRow: 2 }}
                aria-hidden="true"
              />

              {hourLabels.slice(1).map((h, i) => (
                <div
                  key={`line-${h}`}
                  className="schedule__hour-line"
                  style={{ gridRow: i + 3 }}
                  aria-hidden="true"
                />
              ))}

              {DAYS.slice(0, -1).map((day, i) => (
                <div
                  key={`sep-${day.full}`}
                  className="schedule__day-sep"
                  style={{ gridColumn: i + 2 }}
                  aria-hidden="true"
                />
              ))}

              {SCHEDULE.map((c) => {
                const rowStart = c.start - HOURS_START + 2;
                const rowSpan = c.end - c.start;
                const colStart = c.day + 2;
                return (
                  <article
                    key={`${c.name}-${c.day}-${c.start}`}
                    className="schedule__block"
                    style={{
                      gridColumn: colStart,
                      gridRow: `${rowStart} / span ${rowSpan}`,
                      ["--block-color" as string]: c.color,
                    }}
                    aria-label={`${c.name}, ${formatRange(c.start, c.end)}`}
                  >
                    <div className="schedule__block-content">
                      <div className="schedule__block-name">{c.name}</div>
                      <div className="schedule__block-time">
                        {formatRange(c.start, c.end)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`schedule__scrollbar${bar.visible ? "" : " schedule__scrollbar--hidden"}${active ? " schedule__scrollbar--active" : ""}`}
          aria-hidden="true"
        >
          <div
            className="schedule__scrollbar-thumb"
            style={{
              width: `${bar.width}px`,
              transform: `translateX(${bar.offset}px)`,
            }}
          />
        </div>

        <div className="schedule__hint" aria-hidden="true">
          <span className="schedule__hint-text">swipe</span>
          <span className="schedule__hint-arrow">→</span>
        </div>
      </div>
    </>
  );
}
