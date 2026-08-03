"use client";

/* The destination system story, per SPEC.md. Stages advance by explicit
   controls, never by scroll: the canvas owns the left region, the panel owns
   the right, and a hard divider keeps them honest. The final stage releases
   the panel's column and the system takes the whole screen. */

import { useEffect, useRef, useState } from "react";
import { mountAssembly } from "./assembly";

type LayerPanel = {
  kicker: string;
  title: string;
  what: string;
  chips: string[];
  concepts?: string;
  tree: string;
};

export const LAYER_PANELS: LayerPanel[] = [
  {
    kicker: "01",
    title: "Brand intelligence",
    what: "Turn positioning, audiences, messaging, claims, voice, and principles into structured, current, and retrievable knowledge.",
    chips: ["positioning", "company narrative", "audience profiles", "message hierarchy", "approved claims", "voice and tone", "channel behavior", "creative principles", "examples"],
    tree: `brand intelligence
  authoring
    - YAML for human-authored structured records
    - markdown or MDX for nuance and examples
    - CMS where contributors edit often
  contracts
    - JSON Schema for required fields
  versioning
    - dated snapshots, sources sealed by hash
    - open questions recorded, never inferred
  distribution
    - compiled JSON bundles
    - search indexes
    - type definitions
    - channel-specific subsets
    - agent-readable context`,
  },
  {
    kicker: "02",
    title: "Design language",
    what: "Convert visual and behavioral decisions into reusable, versioned foundations.",
    chips: ["color", "typography", "spacing", "grids", "scale", "shape", "motion", "image behavior", "data visualization", "accessibility"],
    tree: `design language
  token levels
    - primitive tokens
    - semantic tokens
    - component tokens where necessary
  authoring
    - Figma for exploration and application
    - versioned token files for releases
  distribution
    - CSS variables
    - JavaScript and TypeScript values
    - JSON bundles
    - Figma synchronization`,
  },
  {
    kicker: "03",
    title: "Production",
    what: "Turn intelligence, design language, content, assets, and intent into finished artifacts.",
    chips: ["components", "recipes", "workflows", "interpreters", "renderers", "exporters", "input schemas", "production tests"],
    concepts: "Components are reusable parts. Recipes are approved assembly logic for recurring jobs. Workflows run from request to completion. Interpreters read the source material and draft the language for the work: headlines, subcopy, which quotes to pull, which directions to propose. They never decide how anything looks. Renderers produce the actual files; where a renderer carries no mark, the system renders that file itself. Input schemas check what comes in, exporters package what goes out, and production tests re-run every renderer against the files a release froze, so when a token or a renderer shifts underneath approved work you find out before anyone ships against it.",
    tree: `production
  runtime
    - runs, with explicit state
    - artifact sets: coordinated families
    - provenance on every artifact
  the model boundary
    - interpretation proposes words
      and selections only
    - interpreter seats are pluggable
    - deterministic code decides
      everything visual
  outputs
    - standardized renderer contracts
    - versioned production releases`,
  },
  {
    kicker: "04",
    title: "Interface",
    what: "Provide the right interface for people, applications, and agents.",
    chips: ["human surfaces", "application APIs", "agent surface", "runtime substrate"],
    tree: `interface
  human surfaces
    - design os, the brand center
  application surfaces
    - brand, search, render, workflow APIs
  agent surface
    - MCP resources, tools, and prompts
    - authenticated, scoped, recorded
  substrate
    - runtime database: projects, drafts,
      approvals
    - object storage: generated output`,
  },
  {
    kicker: "05",
    title: "Governance and validation",
    what: "Define ownership, lifecycle, validation, approval, and exceptions. Automate compliance. Preserve creative judgment.",
    chips: ["ownership", "lifecycle states", "automated validation", "human review", "approvals", "exceptions", "release history"],
    tree: `governance and validation
  lifecycle
    - draft, experimental, approved,
      deprecated, retired
  automated checks
    - claims, rights, accessibility
    - voice, verbatim quotes, fit
  human judgment
    - creative review and approval
    - intentional, documented exceptions
  release history
    - approved files frozen and hashed
    - drift under a release stops the line
    - every release announced, in the channels people already use`,
  },
  {
    kicker: "06",
    title: "Observability and learning",
    what: "Measure adoption, friction, quality, and recurring behavior, and return the evidence to the people who tend the system.",
    chips: ["adoption", "time to output", "overrides", "search failures", "rework", "render errors", "agent activity", "feedback"],
    tree: `observability and learning
  signals
    - usage, overrides, failures, rework
  records
    - every run records itself
    - every failure keeps its evidence
  learning
    - evidence returns to the people
    - findings feed the roadmap`,
  },
];

const FINALE_CAP = {
  kicker: "The whole system",
  title: "One system, operating",
  body: "Knowledge in, governed work out, evidence back. Select any stage to open it.",
};

/* the rail: every stage, addressable directly */
const STAGES: Array<{ num: string | null; label: string }> = [
  { num: null, label: "Intro" },
  ...LAYER_PANELS.map((p) => ({ num: p.kicker, label: p.title })),
  { num: null, label: "The system" },
];
const FINAL = STAGES.length - 1;

function PanelBody({ p }: { p: LayerPanel }) {
  return (
    <>
      <p className="ds-cap-section">What it does</p>
      <p className="ds-cap-body">{p.what}</p>
      <p className="ds-cap-section">Comprised of</p>
      <div className="ds-chips">
        {p.chips.map((c) => (
          <span className="ds-chip" key={c}>{c}</span>
        ))}
      </div>
      {p.concepts && <p className="ds-cap-body ds-cap-concepts">{p.concepts}</p>}
      <p className="ds-cap-section">Technical hierarchy</p>
      <pre className="ds-tree">{p.tree}</pre>
    </>
  );
}

function PanelFor({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <div className="ds-panel-inner" key="intro">
        <h1 className="ds-title">Design OS</h1>
        <p className="ds-lead">A traditional brand system describes the brand. This one operates it.</p>
        <p className="ds-body">
          An operating system for creative work: what the brand knows, how it
          speaks, the machinery that produces the work, and the law that keeps
          it safe. No brand baked in. One system, explored a layer at a time.
        </p>
        <p className="ds-nav-hint" aria-hidden="true">Use the stages below, or the arrow keys</p>
      </div>
    );
  }
  if (stage <= LAYER_PANELS.length) {
    const p = LAYER_PANELS[stage - 1];
    return (
      <div className="ds-panel-inner" key={p.title}>
        <p className="ds-cap-kicker">{p.kicker}</p>
        <p className="ds-cap-title">{p.title}</p>
        <PanelBody p={p} />
      </div>
    );
  }
  const c = FINALE_CAP;
  return (
    <div className="ds-panel-inner" key={c.title}>
      <p className="ds-cap-kicker">{c.kicker}</p>
      <p className="ds-cap-title">{c.title}</p>
      <p className="ds-cap-body">{c.body}</p>
    </div>
  );
}

export function AssemblyStory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const apiRef = useRef<{ destroy: () => void; setStage: (i: number) => void } | null>(null);
  const [stage, setStage] = useState(0);
  /* the rail's titles unfold only once the column has actually gone; unfolding
     them while it is still collapsing overflows the region and clips the rail */
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const api = mountAssembly({ canvas, panel: panelRef.current });
    apiRef.current = api;
    return () => api.destroy();
  }, []);

  useEffect(() => {
    apiRef.current?.setStage(stage);
  }, [stage]);

  useEffect(() => {
    if (stage !== FINAL) { setWide(false); return; }
    // after the panel's fade (0.3s) and width snap (0.32s), never during
    const t = window.setTimeout(() => setWide(true), 420);
    return () => window.clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      // Cmd/Alt+Arrow is browser history; Shift+Arrow is selection
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
      // inside the panel the arrows belong to whatever is being read
      const el = e.target as HTMLElement | null;
      if (el && el.closest && el.closest(".ds-panel-col")) return;
      e.preventDefault();
      setStage((s) => (e.key === "ArrowRight" ? Math.min(FINAL, s + 1) : Math.max(0, s - 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const full = stage === FINAL;
  const stageName = stage === 0 ? "Intro" : STAGES[stage].label;

  return (
    <div className="site-ds ds-story-mode">
      <a href="/" className="ds-home ds-story-home">Alden Huschle</a>

      <div className={`ds-shell${full ? " ds-shell-full" : ""}${wide ? " ds-shell-wide" : ""}`}>
        <div className="ds-stage-region">
          <canvas
            ref={canvasRef}
            className="ds-stage-canvas"
            role="img"
            aria-label="A brand operating system, one persistent blueprint explored stage by stage: brand intelligence and design language feed a production hall of components, recipes, workflows, interpreters, and renderers; work passes governance into the interfaces; evidence returns through observability."
          />

          {/* the final view keeps its name without reclaiming the column */}
          <div className="ds-full-title" aria-hidden={!full}>
            <p className="ds-cap-kicker">{FINALE_CAP.kicker}</p>
            <p className="ds-cap-title">{FINALE_CAP.title}</p>
          </div>

          {/* stage changes are otherwise silent to screen readers */}
          <p className="ds-sr-only" aria-live="polite">{`Stage ${stage + 1} of ${STAGES.length}: ${stageName}`}</p>

          <nav className="ds-stage-nav" aria-label="Stages">
            <button
              type="button"
              className="ds-nav-step"
              aria-label="Previous stage"
              /* aria-disabled, not disabled: a disabled control drops focus to
                 the body when it disables under the user's own keypress */
              aria-disabled={stage === 0}
              onClick={() => setStage((s) => Math.max(0, s - 1))}
            >←</button>
            {STAGES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                data-stage={i}
                aria-current={stage === i ? "step" : undefined}
                aria-label={s.num ? `${s.num} ${s.label}` : s.label}
                className={`ds-nav-chip${stage === i ? " ds-nav-chip-on" : ""}`}
                onClick={() => setStage(i)}
              >
                {s.num ? <span className="ds-explorer-num" aria-hidden="true">{s.num}</span> : null}
                <span className="ds-nav-label" aria-hidden="true">{s.label}</span>
              </button>
            ))}
            <button
              type="button"
              className="ds-nav-step"
              aria-label="Next stage"
              aria-disabled={stage === FINAL}
              onClick={() => setStage((s) => Math.min(FINAL, s + 1))}
            >→</button>
          </nav>
        </div>

        <aside ref={panelRef} className="ds-panel-col" aria-hidden={full} inert={full}>
          {/* focusable so a keyboard user can scroll a tall tree (Safari) */}
          <div className="ds-panel-scroll" tabIndex={0} role="region" aria-label={`${stageName} details`}>
            <PanelFor stage={stage} />
          </div>
        </aside>
      </div>
    </div>
  );
}
