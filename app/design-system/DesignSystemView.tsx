"use client";

import { useState } from "react";
import { CAPABILITIES, LAYERS } from "./model";
import { SystemMapFlow } from "./SystemMap";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  "in-progress": "In progress",
  conceptual: "Conceptual",
};

export function DesignSystemView() {
  const [activeId, setActiveId] = useState(LAYERS[0].id);
  const active = LAYERS.find((l) => l.id === activeId) ?? LAYERS[0];

  return (
    <div className="site-ds">
      <header className="ds-top">
        <a href="/" className="ds-home">Alden Huschle</a>
      </header>

      <section className="ds-col ds-arrival">
        <h1 className="ds-title">Design system</h1>
        <p className="ds-lead">
          A traditional brand system describes the brand. This one operates it.
        </p>
        <p className="ds-body">
          brand-os is a production system for brands: source material in, finished
          on-brand work out, with judgment encoded where it can be enforced. One
          brand slots in today; the system itself never learns its name.
        </p>
      </section>

      <section className="ds-duo">
        <div>
          <h2 className="ds-eyebrow">The build</h2>
          <p className="ds-body">
            One bounded AI step reads the source and proposes words and selections:
            a thesis, quotes, copy, art direction. Everything visual is decided by
            deterministic code. Gates fail closed: quotes must be verbatim, voice
            rules block with named evidence, copy must fit signed geometry.
            Reference renders are pinned as goldens, a regression harness catches
            unintended change, and every artifact carries its provenance.
          </p>
        </div>
        <div>
          <h2 className="ds-eyebrow">The taste</h2>
          <p className="ds-body">
            The reference family was designed by hand, in code, to portfolio
            standard before any architecture existed; the system was extracted from
            what worked. Every rule traces to a recorded failure. Nothing generated
            is judged from a single candidate, and one material world governs each
            era so the work coheres as a body. The full decision record runs below.
          </p>
        </div>
      </section>

      <section className="ds-wide">
        <h2 className="ds-eyebrow">The system</h2>
        <SystemMapFlow layers={LAYERS} activeId={activeId} onSelect={setActiveId} />
        <p className="ds-legend">
          Solid is live. Long dashes are in progress. Short dashes are conceptual.
          Select a layer to open it.
        </p>

        <div className="ds-panel" key={active.id}>
          <div className="ds-panel-main">
            <p className="ds-panel-head">
              <span className="ds-panel-ordinal">{String(active.order).padStart(2, "0")}</span>
              <span className="ds-panel-name">{active.name}</span>
              <span className={`ds-status ds-status-${active.status}`}>{STATUS_LABEL[active.status]}</span>
            </p>
            <p className="ds-body">{active.purpose}</p>
            <ul className="ds-subsystems">
              {active.subsystems.map((s) => (
                <li key={s.name}>
                  <span className={`ds-dot ds-dot-${s.status}`} aria-hidden="true" />
                  <span className="ds-subsystem-name">{s.name}.</span>{" "}
                  <span className="ds-subsystem-line">{s.line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ds-panel-trajectory">
            {(
              [
                ["Today", active.trajectory.today],
                ["Next", active.trajectory.next],
                ["Long term", active.trajectory.longTerm],
              ] as const
            ).map(([label, value]) => (
              <p key={label}>
                <span className="ds-traj-label">{label}</span>
                <span className="ds-traj-value">{value}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="ds-mid">
        <h2 className="ds-eyebrow">Where it stands</h2>
        <ul className="ds-registry">
          {CAPABILITIES.map((c) => (
            <li key={c.name}>
              <span className="ds-registry-head">
                <span className="ds-registry-name">{c.name}</span>
                <span className={`ds-status ds-status-${c.status}`}>{c.statusLabel}</span>
              </span>
              <span className="ds-registry-line">{c.line}</span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
