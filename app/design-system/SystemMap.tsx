"use client";

/* Two candidate forms for the system map. Both share the selection contract
   and the drawn-status vocabulary: solid strokes are live, long dashes are in
   progress, short dashes are conceptual. One ships; the other stays until the
   direction is picked.

   Flow recreates the original infrastructure diagram's grammar: foundations
   feed a production engine, output crosses the governance boundary into the
   interface, observability loops back. Strata is the site-native vertical
   reading of the same six layers. */

import type { Layer, Status } from "./model";

type MapProps = {
  layers: Layer[];
  activeId: string;
  onSelect: (id: string) => void;
};

const a = (o: number) => `rgba(20, 18, 16, ${o})`;

const STROKE_FOR: Record<Status, { strokeDasharray?: string }> = {
  live: {},
  "in-progress": { strokeDasharray: "7 4" },
  conceptual: { strokeDasharray: "2 4" },
};

function regionProps(layer: Layer, activeId: string, onSelect: (id: string) => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": `${layer.name}: ${layer.definition}`,
    "aria-pressed": layer.id === activeId,
    className: `ds-map-region${layer.id === activeId ? " ds-map-region-active" : ""}`,
    onClick: () => onSelect(layer.id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(layer.id);
      }
    },
  };
}

/* ─── Candidate A: the flow ─── */

export function SystemMapFlow({ layers, activeId, onSelect }: MapProps) {
  const byId = Object.fromEntries(layers.map((l) => [l.id, l]));
  const stroke = (id: string) => STROKE_FOR[byId[id].status];

  return (
    <div className="ds-map-scroll">
      <svg
        className="ds-map-flow"
        viewBox="0 0 1040 452"
        role="group"
        aria-label="The system as one flow: brand intelligence and design language feed production, output crosses governance into the interface, and observability loops back."
      >
        {/* 01 Brand intelligence */}
        <g {...regionProps(byId.intelligence, activeId, onSelect)}>
          <rect x="8" y="60" width="200" height="120" className="ds-region-box" {...stroke("intelligence")} />
          <rect x="8" y="60" width="200" height="120" className="ds-hit" />
          <text x="24" y="84" className="ds-map-ordinal">01</text>
          <text x="24" y="106" className="ds-map-title">Brand intelligence</text>
          <text x="24" y="130" className="ds-map-line">strategy snapshots</text>
          <text x="24" y="148" className="ds-map-line">voice rulebook</text>
          <text x="24" y="166" className="ds-map-line">open questions</text>
        </g>

        {/* 02 Design language */}
        <g {...regionProps(byId.language, activeId, onSelect)}>
          <rect x="8" y="210" width="200" height="120" className="ds-region-box" {...stroke("language")} />
          <rect x="8" y="210" width="200" height="120" className="ds-hit" />
          <text x="24" y="234" className="ds-map-ordinal">02</text>
          <text x="24" y="256" className="ds-map-title">Design language</text>
          <text x="24" y="280" className="ds-map-line">tokens and marks</text>
          <text x="24" y="298" className="ds-map-line">signed references</text>
          <text x="24" y="316" className="ds-map-line">imagery direction</text>
        </g>

        {/* feed strands into production, crossing the interpretation seam */}
        <path d="M208 100 C 268 100, 280 165, 336 178" className="ds-strand" />
        <path d="M208 150 C 262 150, 276 178, 336 190" className="ds-strand" />
        <path d="M208 250 C 262 250, 276 214, 336 202" className="ds-strand" />
        <path d="M208 300 C 268 300, 280 227, 336 214" className="ds-strand" />
        <line x1="304" y1="130" x2="304" y2="262" className="ds-seam" />
        <text x="304" y="118" textAnchor="middle" className="ds-map-line">the interpretation seam</text>
        <text x="304" y="280" textAnchor="middle" className="ds-map-faint">words and selections only</text>

        {/* 03 Production */}
        <g {...regionProps(byId.production, activeId, onSelect)}>
          <circle cx="404" cy="196" r="62" className="ds-region-box" {...stroke("production")} />
          <rect x="330" y="122" width="148" height="212" className="ds-hit" />
          <circle cx="404" cy="196" r="42" className="ds-engine-ring" />
          <circle cx="404" cy="196" r="22" className="ds-engine-ring" />
          <circle cx="404" cy="196" r="3" className="ds-engine-dot" />
          <text x="404" y="286" textAnchor="middle" className="ds-map-ordinal">03</text>
          <text x="404" y="306" textAnchor="middle" className="ds-map-title">Production</text>
          <text x="404" y="326" textAnchor="middle" className="ds-map-line">fit · treat · compose · render</text>
        </g>

        {/* out-strands crossing governance */}
        <path d="M466 196 C 510 196, 520 120, 570 120" className="ds-strand" />
        <line x1="466" y1="196" x2="570" y2="196" className="ds-strand" />
        <path d="M466 196 C 510 196, 520 272, 570 272" className="ds-strand" />

        {/* 05 Governance and validation */}
        <g {...regionProps(byId.governance, activeId, onSelect)}>
          <rect x="560" y="64" width="20" height="264" className="ds-region-box" {...stroke("governance")} />
          <rect x="536" y="24" width="68" height="330" className="ds-hit" />
          <text x="570" y="40" textAnchor="middle" className="ds-map-ordinal">05</text>
          <text x="570" y="56" textAnchor="middle" className="ds-map-title">Governance</text>
          <circle cx="570" cy="120" r="3.5" className="ds-gate-node" />
          <circle cx="570" cy="196" r="3.5" className="ds-gate-node" />
          <circle cx="570" cy="272" r="3.5" className="ds-gate-node" />
          <text x="570" y="348" textAnchor="middle" className="ds-map-faint">gates fail closed</text>
        </g>

        <line x1="580" y1="120" x2="640" y2="120" className="ds-strand" />
        <line x1="580" y1="196" x2="640" y2="196" className="ds-strand" />
        <line x1="580" y1="272" x2="640" y2="272" className="ds-strand" />

        {/* 04 Interface */}
        <g {...regionProps(byId.interface, activeId, onSelect)}>
          {/* The window draws solid: the human surface is live. The layer's
              in-progress status belongs to the agents block, drawn dashed. */}
          <rect x="640" y="64" width="250" height="264" className="ds-region-box" />
          <rect x="640" y="64" width="392" height="264" className="ds-hit" />
          <line x1="640" y1="92" x2="890" y2="92" className="ds-hairline" />
          <circle cx="656" cy="78" r="3" className="ds-window-dot" />
          <circle cx="668" cy="78" r="3" className="ds-window-dot" />
          <circle cx="680" cy="78" r="3" className="ds-window-dot" />
          <text x="656" y="116" className="ds-map-ordinal">04</text>
          <text x="656" y="138" className="ds-map-title">Interface</text>
          {["marks", "palette", "type", "social", "documents", "campaign"].map((item, i) => (
            <text key={item} x="656" y={162 + i * 18} className="ds-map-line">{item}</text>
          ))}
          <line x1="756" y1="104" x2="756" y2="316" className="ds-hairline" />
          <rect x="772" y="152" width="46" height="46" className="ds-skeleton" />
          <rect x="828" y="152" width="46" height="46" className="ds-skeleton" />
          <rect x="772" y="208" width="46" height="46" className="ds-skeleton" />
          <rect x="828" y="208" width="46" height="46" className="ds-skeleton" />
          <rect x="906" y="140" width="126" height="112" className="ds-region-box" strokeDasharray="2 4" />
          <text x="922" y="166" className="ds-map-line">agents</text>
          <text x="922" y="186" className="ds-map-faint">same gates,</text>
          <text x="922" y="202" className="ds-map-faint">still ahead</text>
        </g>

        {/* 06 Observability loop */}
        <g {...regionProps(byId.observability, activeId, onSelect)}>
          <path
            d="M765 328 C 765 396, 700 404, 520 404 L 160 404 C 108 404, 108 396, 108 342"
            className="ds-region-loop"
            {...STROKE_FOR[byId.observability.status]}
          />
          <path d="M103 350 L 108 340 L 113 350" className="ds-loop-head" />
          <rect x="96" y="372" width="684" height="80" className="ds-hit" />
          <text x="520" y="392" textAnchor="middle" className="ds-map-ordinal">06</text>
          <text x="520" y="426" textAnchor="middle" className="ds-map-title">Observability and learning</text>
          <text x="520" y="444" textAnchor="middle" className="ds-map-line">run records · failure records · what the system learns</text>
        </g>
      </svg>
    </div>
  );
}

/* ─── Candidate B: the strata ─── */

export function SystemMapStrata({ layers, activeId, onSelect }: MapProps) {
  return (
    <div className="ds-strata" role="group" aria-label="The six layers of the system, top to bottom.">
      {layers.map((layer) => (
        <button
          key={layer.id}
          type="button"
          className={`ds-stratum ds-stratum-${layer.status}${layer.id === activeId ? " ds-stratum-active" : ""}`}
          aria-pressed={layer.id === activeId}
          onClick={() => onSelect(layer.id)}
        >
          <span className="ds-stratum-ordinal">{String(layer.order).padStart(2, "0")}</span>
          <span className="ds-stratum-name">{layer.name}</span>
          <span className="ds-stratum-def">{layer.definition}</span>
        </button>
      ))}
    </div>
  );
}

export const MAP_INK = a(0.3);
