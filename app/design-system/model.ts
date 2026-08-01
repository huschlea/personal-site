// The system model behind /design-system: the six-layer spine from the
// original infrastructure page, brought current. Per brand-os decision 0005
// the six layers survive as roadmap language (the build collapsed to three
// technical layers with governance and observability cross-cutting); this
// page speaks the roadmap language on purpose.

export type Status = "live" | "in-progress" | "conceptual";

export type Subsystem = {
  name: string;
  line: string;
  status: Status;
};

export type Layer = {
  id: string;
  order: number;
  name: string;
  definition: string;
  status: Status;
  purpose: string;
  subsystems: Subsystem[];
  trajectory: { today: string; next: string; longTerm: string };
};

export const LAYERS: Layer[] = [
  {
    id: "intelligence",
    order: 1,
    name: "Brand intelligence",
    definition: "What the brand means and knows",
    status: "live",
    purpose:
      "The brand's working mind: current positioning, claims, and prohibitions, kept as data the rest of the system consumes.",
    subsystems: [
      {
        name: "Strategy snapshots",
        line: "Dated, versioned, source pinned by hash; every asset records the version it was drafted under.",
        status: "live",
      },
      {
        name: "Voice rulebook",
        line: "Mechanical rules that block with named evidence: banned terms, retired phrasings, analyst guardrails.",
        status: "live",
      },
      {
        name: "Open questions",
        line: "Where the source is silent the record says so; silences are never resolved by inference.",
        status: "live",
      },
    ],
    trajectory: {
      today: "Versioned snapshots power interpretation",
      next: "A structured claims registry",
      longTerm: "The brand's full working memory",
    },
  },
  {
    id: "language",
    order: 2,
    name: "Design language",
    definition: "How the brand is expressed",
    status: "live",
    purpose:
      "The visual system as code: tokens, marks, geometry, and signed reference artifacts that define what on-brand means.",
    subsystems: [
      {
        name: "Tokens and marks",
        line: "Color, type, spacing, and marks authored as code, not exported files.",
        status: "live",
      },
      {
        name: "Signed references",
        line: "Quote card, closing ad, and hero world settled through recorded rounds and signed as the standard.",
        status: "live",
      },
      {
        name: "Generated-imagery direction",
        line: "One material world per era; a deterministic treatment chain owns the look, raw model output never ships.",
        status: "live",
      },
    ],
    trajectory: {
      today: "One world governs the era",
      next: "Motion joins the language",
      longTerm: "A versioned package any surface consumes",
    },
  },
  {
    id: "production",
    order: 3,
    name: "Production",
    definition: "How the brand produces work",
    status: "live",
    purpose:
      "Source in, coordinated asset family out. One bounded AI step, then deterministic code the whole way down.",
    subsystems: [
      {
        name: "The interpretation seam",
        line: "The one model boundary: reads the source, proposes words and selections only, never touches a pixel.",
        status: "live",
      },
      {
        name: "Deterministic core",
        line: "Type fitting, image treatment, composition, and render, reproducible to the byte.",
        status: "live",
      },
      {
        name: "Provenance",
        line: "Every run records model, brief, hashes, and versions; failed runs keep their records too.",
        status: "live",
      },
    ],
    trajectory: {
      today: "A full campaign from one article",
      next: "An event asset generator",
      longTerm: "A capability per format family",
    },
  },
  {
    id: "interface",
    order: 4,
    name: "Interface",
    definition: "How people and agents reach the system",
    status: "in-progress",
    purpose:
      "The surfaces where the system meets its users: human tools first, application seams proven, agents still ahead.",
    subsystems: [
      {
        name: "The brand center",
        line: "The human surface: marks, palette, type, social kit, documents, and full campaign generation.",
        status: "live",
      },
      {
        name: "Application seams",
        line: "The capability consumed as a library by a production site, ported gate for gate.",
        status: "live",
      },
      {
        name: "Agent access",
        line: "Agents consuming the system under the same gates as humans.",
        status: "conceptual",
      },
    ],
    trajectory: {
      today: "Humans, through the brand center",
      next: "Internal APIs",
      longTerm: "Agents under the same law",
    },
  },
  {
    id: "governance",
    order: 5,
    name: "Governance and validation",
    definition: "How freedom stays safe",
    status: "live",
    purpose:
      "Compliance automated, judgment preserved. The gates are deterministic and fail closed; humans decide taste, never rule-checking.",
    subsystems: [
      {
        name: "Deterministic gates",
        line: "Quotes verbatim to the source, voice rules, copy fit against signed geometry, palette and legibility checks.",
        status: "live",
      },
      {
        name: "Goldens and regression",
        line: "Signed artifacts pinned byte-exact; unintended change fails the build, deliberate change re-signs.",
        status: "live",
      },
      {
        name: "Two surfaces, one law",
        line: "The authoring surface exposes every verdict; the product surface only ever delivers clean results.",
        status: "live",
      },
    ],
    trajectory: {
      today: "Every run passes the gates",
      next: "Broader coverage per format",
      longTerm: "Governance as the platform's floor",
    },
  },
  {
    id: "observability",
    order: 6,
    name: "Observability and learning",
    definition: "How the system remembers and improves",
    status: "in-progress",
    purpose:
      "The system watches itself: every run writes its own record, and every failure keeps its evidence.",
    subsystems: [
      {
        name: "Run records",
        line: "Every run stamps its provenance into the work: model, brief, hashes, and the versions it was drafted under.",
        status: "live",
      },
      {
        name: "Failure records",
        line: "Every failed run persists its evidence; the record of the failure is the diagnosis.",
        status: "live",
      },
      {
        name: "Usage learning",
        line: "The system improving from how its output performs in the world.",
        status: "conceptual",
      },
    ],
    trajectory: {
      today: "Runs and failures keep their records",
      next: "Run analytics",
      longTerm: "Taste that compounds",
    },
  },
];

export type Capability = {
  name: string;
  status: Status;
  statusLabel: string;
  line: string;
};

export const CAPABILITIES: Capability[] = [
  {
    name: "The coded foundation",
    status: "live",
    statusLabel: "Live",
    line: "A brand-blind core and a brand package that slots in; goldens and a regression harness hold the line.",
  },
  {
    name: "Brand website",
    status: "live",
    statusLabel: "Live",
    line: "The brand's public site, its identity authored in code.",
  },
  {
    name: "Document generator",
    status: "live",
    statusLabel: "Live",
    line: "Branded documents drafted from source text through one AI boundary.",
  },
  {
    name: "Blog campaign",
    status: "live",
    statusLabel: "Built, pre-release",
    line: "An article in, a coordinated campaign out, every gate on.",
  },
  {
    name: "Brand intelligence",
    status: "live",
    statusLabel: "Live",
    line: "Versioned strategy snapshots and the mechanical voice rulebook.",
  },
  {
    name: "Event asset generator",
    status: "conceptual",
    statusLabel: "Next",
    line: "Where the system extends next; cut from the first slice on purpose, and waiting.",
  },
  {
    name: "Agent access",
    status: "conceptual",
    statusLabel: "Conceptual",
    line: "Agents producing work through the same gates that govern humans.",
  },
];
