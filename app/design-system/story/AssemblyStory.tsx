"use client";

/* The destination system story, per SPEC.md. Scroll beats spotlight each
   layer; panels render in HTML so the hierarchy trees stay crisp; the final
   beat unlocks the clickable explorer. */

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
    concepts: "Components are reusable parts. Recipes are approved assembly logic for recurring jobs. Workflows run from request to completion. Interpreters read the source material and draft the language for the work: headlines, subcopy, which quotes to pull, which directions to propose. They never decide how anything looks. Renderers produce the actual files; where a renderer carries no mark, the system renders that file itself. Input schemas check what comes in, exporters package what goes out, and production tests re-run every renderer and compare the files against known-good copies, so a change that breaks the output is caught immediately.",
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
    - the brand center and its tools
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
    - signed releases, checked byte for byte
    - unintended change stops the line`,
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

const SIMPLE_CAPS = [
  {
    kicker: "One job, all six layers",
    title: "A run, end to end",
    body: "A brief arrives at the interface. Intelligence retrieves what the brand knows; design language applies its forms; production executes the recipe; the gates check every claim and every line, and what fails is revised before it ships. The artifact set releases whole, and the run writes its record.",
  },
  {
    kicker: "The whole system",
    title: "One system, operating",
    body: "Knowledge in, governed work out, evidence back. Select any layer to open it.",
  },
];

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

export function AssemblyStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ destroy: () => void; setLayer: (i: number | null) => void } | null>(null);
  const [explorer, setExplorer] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const captions = Array.from(wrap.querySelectorAll<HTMLElement>(".ds-cap"));
    const api = mountAssembly({ wrap, canvas, captions, titleBlock: titleRef.current });
    apiRef.current = api;
    return () => api.destroy();
  }, []);

  const pick = (i: number) => {
    const next = explorer === i ? null : i;
    setExplorer(next);
    apiRef.current?.setLayer(next);
  };

  return (
    <div className="site-ds ds-story-mode">
      <a href="/" className="ds-home ds-story-home">Alden Huschle</a>

      <div className="ds-stage-wrap ds-stage-wrap-9" ref={wrapRef}>
        <div className="ds-stage-sticky">
          <canvas
            ref={canvasRef}
            className="ds-stage-canvas"
            role="img"
            aria-label="A brand operating system assembling on scroll: brand intelligence and design language feed a production hall of components, recipes, workflows, interpreters, and renderers; work passes governance into the interfaces; evidence returns through observability."
          />
        </div>

        <div className="ds-title-block" ref={titleRef}>
          <h1 className="ds-title">Design system</h1>
          <p className="ds-lead">
            A traditional brand system describes the brand. This one operates it.
          </p>
          <p className="ds-body">
            An operating system for creative work: what the brand knows, how it
            speaks, the machinery that produces the work, and the law that keeps
            it safe. No brand baked in. Scroll, and the system comes together.
          </p>
          <p className="ds-scroll-cue" aria-hidden="true">Scroll ↓</p>
        </div>

        {LAYER_PANELS.map((p, i) => (
          <div className="ds-cap ds-cap-panel" style={{ top: `${(i + 1) * 130 + 40}vh` }} key={p.title}>
            <p className="ds-cap-kicker">{p.kicker}</p>
            <p className="ds-cap-title">{p.title}</p>
            <PanelBody p={p} />
          </div>
        ))}
        {SIMPLE_CAPS.map((c, i) => (
          <div className="ds-cap" style={{ top: `${(i + 7) * 130 + 40}vh` }} key={c.title}>
            <p className="ds-cap-kicker">{c.kicker}</p>
            <p className="ds-cap-title">{c.title}</p>
            <p className="ds-cap-body">{c.body}</p>
          </div>
        ))}

        <div className="ds-explorer-chips" role="tablist" aria-label="Explore the system's layers">
          {LAYER_PANELS.map((p, i) => (
            <button
              key={p.title}
              type="button"
              role="tab"
              aria-selected={explorer === i}
              className={`ds-explorer-chip${explorer === i ? " ds-explorer-chip-on" : ""}`}
              onClick={() => pick(i)}
            >
              <span className="ds-explorer-num">{p.kicker}</span>
              {p.title}
            </button>
          ))}
        </div>

        {explorer !== null && (
          <div className="ds-explorer-panel" role="tabpanel">
            <p className="ds-cap-kicker">{LAYER_PANELS[explorer].kicker}</p>
            <p className="ds-cap-title">{LAYER_PANELS[explorer].title}</p>
            <PanelBody p={LAYER_PANELS[explorer]} />
          </div>
        )}
      </div>
    </div>
  );
}
