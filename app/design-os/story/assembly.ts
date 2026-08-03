/* The destination system, built from SPEC.md (settled 2026-07-30).
   Literal and component-based. Brand-agnostic. The destination drawn as real.
   Six layers, each with a spotlight beat; a demonstration run; an explorer
   end state. Panels live in HTML; this file owns the drawing.

   Craft system carried from v2: fixed-grid lanes, five-level stroke and text
   hierarchy, card anatomy with quiet depth, orthogonal routed connectors,
   draw-on choreography, the dot grid. Rust appears only on rejected work. */

import { ICONS } from "./icons";

type Camera = { zoom: number; cx: number; cy: number };

export const LAYER_COUNT = 6;
const BEATS = 8; // 0 the whole system, small · 1-6 layers · 7 the whole system, full
/* every idle motion on the board (the bus ticks today, the run choreography
   when it returns) sits behind this one switch; see ANIMATION-HANDOFF.md */
const RUN_MOTION = false;
const INK = (o: number) => `rgba(20, 18, 16, ${o})`;
const PAPER = "#FEFEFD";
const RUST = (o: number) => `rgba(156, 63, 33, ${o})`;
const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

const S_MAIN = 0.52, S_MID = 0.3, S_SOFT = 0.16;
const T_TITLE = 0.85, T_BODY = 0.6, T_FAINT = 0.42;

/* ── the double rule ──
   Governance and observability are the two layers that watch rather than make,
   and they are drawn as a double rule: a pair of hairlines with a narrow
   channel between them. In print a double rule has always marked a boundary of
   a different order than the rules inside it, which is exactly the claim here.
   Each line of the pair runs a shade finer than the page's 1px linework, and
   no finer: taken below that the pair stops reading as a boundary and starts
   reading as a smudge, which is a worse failure than reading heavy. Both the
   channel and the stroke are held in screen pixels, like line width itself,
   so the pair keeps its proportion at every zoom instead of closing up when
   the camera pulls back. Fittings that break the rule (gates, meters, the
   review point) stay single and at S_MAIN: rule quiet, fittings crisp. */
const S_RULE = 0.52;   // one hairline of the pair
const RULE_GAP = 1.8;  // half the channel, css px, constant across zooms
const RULE_W = 0.9;    // a shade finer than the page's linework, no finer
/* The smallest a fitting may be and still cut a legible break in the pair:
   clear of the far hairline's outer edge, plus its own half stroke, plus a
   little paper. Derived, not chosen, so a fitting never grows heavier than the
   rule actually requires. Above this floor fittings keep their authored world
   size, which is what preserves the hierarchy between a station dot, a meter
   and the terminus the whole bus runs back to. */
const FIT_MIN = RULE_GAP + RULE_W / 2 + 1;
const DIM = 0.38; // spotlight: everything not selected drops to this

/* ── layout: 2000 x 1150 world ── */

/* ── per-stage framing ──
   A stage is authored as a world rectangle: the subsystem it is about, plus
   the breathing room it deserves. The camera is DERIVED, never hand-tuned:
   each frame the rect is fitted to the canvas region the stage actually has,
   so a dense stage genuinely zooms in, a wide region genuinely gains scale,
   and a change in region width (the panel releasing its column) becomes a
   camera move like any other. pad is the fraction of the region kept clear
   around the rect; maxZoom keeps a close-up from blowing past the ink density
   the drawing was authored at. */
type View = { x: number; y: number; w: number; h: number; pad?: number; maxZoom?: number; anchor?: "bottom" };
const VIEWS: View[] = [
  /* 0 and 7 share one rect: the whole system. The intro shows it small beside
     the title, with generous margin so the whole reads as an object at rest;
     the finale shows it full-bleed. One persistent system, and the stages
     between are a camera moving around it. */
  { x: 60, y: 60, w: 1950, h: 1120, pad: 0.11 },               // 0 the whole system, small
  { x: 120, y: 128, w: 360, h: 515, pad: 0.06, maxZoom: 2.1 }, // 1 brand intelligence
  { x: 120, y: 578, w: 360, h: 435, pad: 0.06, maxZoom: 2.1 }, // 2 design language
  { x: 505, y: 128, w: 890, h: 855, pad: 0.04, maxZoom: 1.65 },// 3 production
  /* the interface frames only its own surfaces: the release chain below is
     governance's and stays out of this stage's rect */
  { x: 1370, y: 140, w: 640, h: 800, pad: 0.05, maxZoom: 1.9 }, // 4 interface
  /* governance frames its whole domain: the boundary and the release chain it
     signs, out to the notes card's right edge, so no card is cut mid-face */
  /* extra world above the boundary pushes the frame down clear of the home
     link, and the bottom reaches past the register so nothing is cut */
  { x: 430, y: 30, w: 1560, h: 1040, pad: 0.03 },              // 5 governance
  /* the evidence chain: seat, bus, meters, the feed's corner. Anchored to the
     bottom so the dimmed system above is the context, not bare paper below. */
  { x: 140, y: 830, w: 1330, h: 330, pad: 0.04, anchor: "bottom" }, // 6 observability
  { x: 60, y: 60, w: 1950, h: 1120, pad: 0.03 },               // 7 the whole system
];

/* The lane is sized to its content: label column plus, on design language,
   the token level each foundation belongs to. */
const BI = { x: 170, y: 174, w: 240, h: 340 };
const COMPILE = { x: 170, y: 540, w: 240, h: 54 };
const DL = { x: 170, y: 624, w: 240, h: 340 };
// what each design-language foundation is, in the token hierarchy
const TOKEN_LEVEL: Record<string, string> = {
  "color tokens": "primitive", typography: "primitive", spacing: "primitive",
  scale: "primitive", shape: "primitive", grids: "semantic", motion: "semantic",
  "image behavior": "semantic", accessibility: "semantic", "data visualization": "component",
};
const HALL = { x: 560, y: 160, w: 780, h: 840 };
/* the hall: two shelves above the spine, the renderer bank below it.
   the workflow is not a station among stations; it is the artery that
   pulls from all of them */
const REC = { x: 600, y: 220, w: 330, h: 300 };
const PARTS = { x: 970, y: 220, w: 330, h: 300 };
const SPINE = { x0: 620, x1: 1280, y: 585 };
const RB = { x: 600, y: 720, w: 700, h: 150 };
// the test bench, hung below the bank with air on both sides
const BENCH = { x: 600, y: 910, w: 700, h: 36 };
// the manifold rail: where render fans out to the machines
const MANIFOLD_Y = 700;
/* Every dotted line on the page carries the same ink, whatever its caller asks
   for: they are one class and must read as one. Already lifted for the fact that
   a dash covers only ~40% of its run. */
const DASH_INK = 0.27;
// the belt exists only between the two mouths; the mouths span wall to belt
const BELT_X0 = 600;
const BELT_X1 = 1300;
const MOUTH_H = 15;
// the interpreters rail, inset like the bench so both read as one family
const RAIL = { x: 674, y: 628, w: 486, h: 40 };
const CARD_PAD = 12;
/* Every marker on the line sits one interval from its neighbour: nine markers,
   eight intervals of 82.5 from 620 to 1280. Where no checkpoint belongs, two
   stations simply stand next to each other. */
const STATIONS: Array<{ name: string; x: number }> = [
  { name: "request", x: 620 },
  { name: "context assembly", x: 785 },
  { name: "render", x: 950 },
  { name: "validate", x: 1032.5 },
  { name: "review", x: 1197.5 },
  { name: "release", x: 1280 },
];
// where the run taps the model: the brief, the words and selections, the redraft
const CHECKPOINTS = [702.5, 867.5, 1115];
// station labels ride just under their dots
const LABEL_DROP = 17;
const RECIPE_DEFS: Array<{ name: string; slots: number; ports: number }> = [
  { name: "blog campaign", slots: 3, ports: 2 },
  { name: "branded document", slots: 2, ports: 1 },
  { name: "slide deck", slots: 3, ports: 1 },
  { name: "event campaign", slots: 4, ports: 3 },
  { name: "newsletter", slots: 2, ports: 2 },
];
/* What a brand system actually assembles: the parts of a rendered artifact,
   not the controls of an application. */
const PART_DEFS = ["headline", "body", "quote", "credit", "lockup", "image", "ground", "palette", "figure", "list", "chip", "seal"];
/* ── the interface column, dense ──
   The column carries every surface plus, at its foot, the release chain: a
   release is made of outputs, so the register lives directly under the card
   that fills it, and the announcement beside the register. Tighter cards, no
   underfilled stretches, and the world's floor rises to ~1150. */
const WIN = { x: 1490, y: 160, w: 500, h: 290 };
const APIS = { x: 1490, y: 488, w: 500, h: 146 };
const MCP = { x: 1490, y: 672, w: 500, h: 154 };
const PLINTH = { x: 1490, y: 852, w: 500, h: 74 };
/* the outputs card is gone from the board, its room given to the release
   chain; the constant stays only because the dormant drawRun references it */
const OUTPUTS = { x: 1490, y: 938, w: 500, h: 88 };
const GOV = { x: 480, y: 128, w: 940, h: 902 };
// where the dispatch fans out to the three surfaces, inside the governed line
/* inside the governed boundary: the branches must cross the line at their
   own gate, which is the whole point of three gates */
const FAN_X = 1385;
const BUS_Y = 1100;
/* ── two chains, not one line ──
   The EVIDENCE chain runs along BUS_Y: released work gets used, usage lands in
   the event log on the substrate, the bus carries it back, and the feedback
   loop turns it into decisions that travel up into the knowledge layers. The
   RELEASE chain lives in the interface column's foot: outputs drop into signed
   releases, the register links to release notes, and governance reaches across
   to sign, crossing the bus at a joint on the way. They meet in the world, not
   on the diagram. */
const REL_Y = 960, REL_H = 92;
const REL_LINE = REL_Y + REL_H / 2;
const SHELF = { x: 1490, y: REL_Y, w: 240, h: REL_H };
const NOTES = { x: 1750, y: REL_Y, w: 240, h: REL_H };
/* the bus runs from the substrate's event log to the feedback loop, and stops
   short of the interface lane so the column is never crossed */
const BUS_X1 = 1460;
/* the evidence riser: placed in the seam between evenly spread meters, so
   the middle meter (x920) never collides with its tee */
const RISER_X = 837;
// the only card on the evidence line, and the only thing the bus touches
const SEAT = { x: 150, y: BUS_Y - 32, w: 200, h: 64 };
// the bus terminates in the feedback loop; there is no run past it
const REVIEW = { x: SEAT.x + SEAT.w, y: BUS_Y };

const RECIPE_NAMES = ["blog campaign", "branded document", "slide deck", "event campaign", "newsletter"];
// seats on the model boundary: a mark name, or null for an open seat
const INTERPRETER_SEATS: Array<string | null> = ["anthropic", "openai"];
// marks sit as a tight set, not a spread row
const MARK_GAP = 21;
// where the two knowledge layers are authored, in reading order left to right
const BI_MARKS = ["notion", "drive"];
const DL_MARKS = ["figma", "paper"];
// the channels a signed release is announced through
const NOTE_MARKS = ["slack", "gmail"];
const RENDERER_DEFS: Array<{ name: string; fmt: string; marks: string[] }> = [
  { name: "web", fmt: "HTML", marks: [] },
  { name: "image", fmt: "PNG", marks: ["openai", "krea", "recraft"] },
  { name: "document", fmt: "PDF", marks: [] },
  { name: "deck", fmt: "PDF", marks: ["gamma"] },
  { name: "video", fmt: "MP4", marks: ["higgsfield"] },
];
const METERS = ["adoption", "time to output", "overrides", "search failures", "rework", "render errors", "agent activity"];
const OUTPUT_NAMES = ["website section", "social post", "social graphic", "slide", "document", "email module"];

/* fragments: representative mini-drawings. kind selects the sketch. */
type Frag = { kind: string; label: string; layer: 0 | 1; sx: number; sy: number; rot: number; sc: number };
const FRAGS: Frag[] = [
  // beat 0: a composed grid, five columns by four rows, ample gutters
  { kind: "statement", label: "positioning", layer: 0, sx: 988, sy: 380, rot: 0, sc: 1 },
  { kind: "paragraph", label: "company narrative", layer: 0, sx: 1140, sy: 380, rot: 0, sc: 1 },
  { kind: "profile", label: "audience profiles", layer: 0, sx: 1292, sy: 380, rot: 0, sc: 1 },
  { kind: "hierarchy", label: "message hierarchy", layer: 0, sx: 1444, sy: 380, rot: 0, sc: 1 },
  { kind: "claim", label: "approved claims", layer: 0, sx: 1596, sy: 380, rot: 0, sc: 1 },
  { kind: "quote", label: "voice and tone", layer: 0, sx: 988, sy: 500, rot: 0, sc: 1 },
  { kind: "banned", label: "banned terms", layer: 0, sx: 1140, sy: 500, rot: 0, sc: 1 },
  { kind: "channels", label: "channel behavior", layer: 0, sx: 1292, sy: 500, rot: 0, sc: 1 },
  { kind: "principles", label: "creative principles", layer: 0, sx: 1444, sy: 500, rot: 0, sc: 1 },
  { kind: "beforeafter", label: "examples", layer: 0, sx: 1596, sy: 500, rot: 0, sc: 1 },
  { kind: "swatches", label: "color tokens", layer: 1, sx: 988, sy: 620, rot: 0, sc: 1 },
  { kind: "aa", label: "typography", layer: 1, sx: 1140, sy: 620, rot: 0, sc: 1 },
  { kind: "ruler", label: "spacing", layer: 1, sx: 1292, sy: 620, rot: 0, sc: 1 },
  { kind: "grid", label: "grids", layer: 1, sx: 1444, sy: 620, rot: 0, sc: 1 },
  { kind: "steps", label: "scale", layer: 1, sx: 1596, sy: 620, rot: 0, sc: 1 },
  { kind: "shapes", label: "shape", layer: 1, sx: 988, sy: 740, rot: 0, sc: 1 },
  { kind: "easing", label: "motion", layer: 1, sx: 1140, sy: 740, rot: 0, sc: 1 },
  { kind: "frame", label: "image behavior", layer: 1, sx: 1292, sy: 740, rot: 0, sc: 1 },
  { kind: "sparkline", label: "data visualization", layer: 1, sx: 1444, sy: 740, rot: 0, sc: 1 },
  { kind: "contrast", label: "accessibility", layer: 1, sx: 1596, sy: 740, rot: 0, sc: 1 },
];
const BI_ROWS = FRAGS.filter((f) => f.layer === 0);
const DL_ROWS = FRAGS.filter((f) => f.layer === 1);

export function mountAssembly(opts: { canvas: HTMLCanvasElement; panel?: HTMLElement | null }) {
  const { canvas, panel } = opts;
  let ctx = canvas.getContext("2d");
  if (!ctx) return { destroy: () => {}, setStage: (_: number) => {} };

  let W = 0, H = 0, dpr = 1;
  let raf = 0, running = false, last = 0;
  /* the scene redraws only when something in it has moved */
  let dirty = true;
  /* the panel's width, kept by its own observer: reading clientWidth inside
     the frame loop forces a synchronous layout on exactly the frames a
     transition can least afford one */
  let panelW = panel ? panel.clientWidth : 0;

  /* everything renders in final position on load: no entrance choreography */
  const reveal = new Array(BEATS).fill(1);
  const focus = new Array(BEATS).fill(0);
  let booted = false;
  const layerLight = new Array(LAYER_COUNT).fill(1); // spotlight currents
  let active = 0;
  let runClock = 0;
  let idleClock = 0;

  /* ── the partition is the camera's, not the canvas's ──
     The canvas always spans the full viewport and the panel simply overlays
     its right edge. Resizing the canvas element mid-transition translated the
     whole drawing half a panel-width in a single frame, which no easing could
     hide; instead the element never changes and the panel's width only moves
     the FIT TARGET, which the camera chases. Every stage change, the finale
     in both directions included, is one continuous camera move. */
  let inset = 0;
  /* the stage rail owns the bottom band; the camera fits into what remains */
  const NAV_INSET = 96;
  function fitView(v: View): Camera {
    const base = Math.min(W / 2060, H / 1210);
    if (base <= 0) return { zoom: 1, cx: v.x + v.w / 2, cy: v.y + v.h / 2 };
    const We = Math.max(200, W - inset);
    const He = Math.max(200, H - NAV_INSET);
    const pad = 1 - (v.pad ?? 0.04);
    const zoom = Math.min(
      (We / (base * v.w)) * pad,
      (He / (base * v.h)) * pad,
      v.maxZoom ?? 1.5,
    );
    const s = base * zoom;
    const cy = v.anchor === "bottom"
      ? v.y + v.h - (He - ((v.pad ?? 0.04) / 2) * He - H * 0.5) / s
      : v.y + v.h / 2 + (NAV_INSET / 2) / s;
    /* centre the rect in the region left of the panel */
    return { zoom, cx: v.x + v.w / 2 + inset / (2 * s), cy };
  }
  const cam: Camera = { zoom: 0.8, cx: 1080, cy: 560 };
  const camT: Camera = { zoom: 0.8, cx: 1080, cy: 560 }; // the smoothed target

  const iconPaths = new Map<string, Path2D>();
  for (const [k, d] of Object.entries(ICONS)) iconPaths.set(k, new Path2D(d));

  /* connector favicons: real product marks, drawn as uniform tiles in the
     top-right corner of the card each tool connects to */
  const MARK_NAMES = ["anthropic", "openai", "figma", "paper", "drive", "notion", "krea", "recraft", "gamma", "higgsfield", "slack", "gmail"];
  const marks = new Map<string, HTMLImageElement>();
  for (const name of MARK_NAMES) {
    const im = new Image();
    im.src = `/design-system/marks/${name}.png`;
    marks.set(name, im);
  }

  /* the mark rides nearly bare: a whisper of an outline hugging the favicon's
     edge, no fill, no padding. */
  function markTile(name: string, cx2: number, cy2: number, t: number, size = 26) {
    const tt = t * inkMul;
    if (tt <= 0.02) return;
    const im = marks.get(name);
    if (!im || !im.complete || im.naturalWidth <= 0) return;
    const p = toScreen(cx2, cy2);
    ctx!.save();
    ctx!.globalAlpha = Math.min(1, tt);
    const g = size * 0.62 * p.s;
    ctx!.drawImage(im, p.x - g / 2, p.y - g / 2, g, g);
    ctx!.restore();
    ctx!.beginPath();
    ctx!.rect(p.x - g / 2, p.y - g / 2, g, g);
    ctx!.strokeStyle = INK(0.22 * tt);
    ctx!.lineWidth = 0.5;
    ctx!.stroke();
    ctx!.lineWidth = 1;
  }

  /* Assigning canvas.width resets the backing store to transparent, so it can
     only ever happen immediately BEFORE a draw. A ResizeObserver fires after
     rAF callbacks, so resizing inside it would wipe the frame that was just
     drawn and leave the canvas blank for the whole of the panel's collapse.
     Observers therefore only raise a flag; the resize is applied at the top of
     the next frame, in the same tick as the draw that follows it. */
  let needsResize = true;
  /* A hi-dpi ultrawide asks for a backing store past twenty million pixels,
     which costs real milliseconds on integrated graphics for every frame a
     transition draws. Both acceptance viewports sit under this, so they back
     at a full dpr 2 and only the very largest displays soften at all. */
  const MAX_BACKING_PX = 16e6;
  function applyResize() {
    if (!needsResize) return false;
    needsResize = false;
    const want = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    const px = W * H * want * want;
    dpr = px > MAX_BACKING_PX ? Math.max(1.25, want * Math.sqrt(MAX_BACKING_PX / px)) : want;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    return true;
  }

  /* dead centre: the camera fit assumes it, and the old 2% optical drop would
     push every fitted rect out the bottom of its region */
  function toScreen(wx: number, wy: number) {
    const base = Math.min(W / 2060, H / 1210);
    const s = base * cam.zoom;
    return { x: W * 0.5 + (wx - cam.cx) * s, y: H * 0.5 + (wy - cam.cy) * s, s };
  }

  /* every drawn element belongs to a layer; its ink rides the spotlight */
  let inkMul = 1;
  function withLayer(i: number, fn: () => void) {
    const prev = inkMul;
    inkMul = layerLight[i];
    fn();
    inkMul = prev;
  }

  function text(str: string, wx: number, wy: number, t: number, o?: {
    size?: number; alpha?: number; caps?: boolean; anchor?: CanvasTextAlign;
    weight?: string; rust?: boolean; maxW?: number; track?: boolean; mono?: boolean;
  }) {
    const tt = t * inkMul;
    if (tt <= 0.02) return;
    const p = toScreen(wx, wy);
    const size = (o?.size ?? 10.5) * p.s;
    if (size < 2.5) return;
    const family = o?.mono
      ? "'SF Mono', ui-monospace, Menlo, monospace"
      : "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif";
    ctx!.font = `${o?.weight ?? (o?.caps ? "500" : "400")} ${size}px ${family}`;
    ctx!.letterSpacing = o?.track ? `${0.08 * size}px` : "0px";
    ctx!.fillStyle = o?.rust ? RUST(0.9 * tt) : INK((o?.alpha ?? T_BODY) * tt);
    ctx!.textAlign = o?.anchor ?? "left";
    ctx!.textBaseline = "middle";
    if (o?.maxW) ctx!.fillText(o?.caps ? str.toUpperCase() : str, p.x, p.y, o.maxW * p.s);
    else ctx!.fillText(o?.caps ? str.toUpperCase() : str, p.x, p.y);
    ctx!.textAlign = "left";
    ctx!.letterSpacing = "0px";
  }

  /* A knockout with no word in it is just a hole in the drawing. text() drops
     anything that would render under 4px, so every element that clears paper
     for a label has to ask first, or it leaves a gap where the label was. */
  function willRender(size: number) {
    return size * toScreen(0, 0).s >= 2.5;
  }

  /* A label set into a line sits on a small plate, not on bare paper. Cleared
     paper alone makes the line look as though it simply stopped, and leaves
     the word floating in the break with nothing holding it; a plate gives the
     line something to stop against and gives the label an edge, so it reads
     as mounted rather than as damage. The border sits under the weight of the
     rule it interrupts, so a plate never competes with its own line. */
  /* A tee: a branch meeting a trunk reads as one merged pipe. The trunk's
     near rail opens strictly between the branch's rails, so the two channels
     connect; square miters, the same grammar as every junction on the board.
     Runs AFTER both the trunk and the branch are stroked. */
  function teeJoint(wx: number, wy: number, branch: "up" | "right", t: number) {
    const p = toScreen(wx, wy);
    const g = RULE_GAP, w = ruleW();
    const inner = g - w / 2 - 0.2;
    if (inner <= 0 || t <= 0.02) return;
    ctx!.fillStyle = PAPER;
    if (branch === "up") ctx!.fillRect(p.x - inner, p.y - g - w, inner * 2, w * 2);
    else ctx!.fillRect(p.x + g - w, p.y - inner, w * 2, inner * 2);
  }

  /* Where two double rules cross, they must not simply overprint: four
     separate crossings read as two systems laid over each other. The joint
     opens both channels into one another, so what reads is a single continuous
     run of pipe with a turn in it. Both rails of each rule stop at the other's
     channel, and the four corners are drawn back in. */
  function crossJoint(wx: number, wy: number, t: number, mul: number) {
    const p = toScreen(wx, wy);
    const g = RULE_GAP, w = ruleW();
    const arm = g + w;                       // how far past the channel to clear
    ctx!.fillStyle = `rgba(254, 254, 253, ${0.99 * t})`;
    ctx!.fillRect(p.x - arm, p.y - arm, arm * 2, arm * 2);
    ctx!.strokeStyle = INK(S_RULE * t * mul);
    ctx!.lineWidth = w;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
      ctx!.beginPath();
      ctx!.moveTo(p.x + sx * g, p.y + sy * arm);
      ctx!.lineTo(p.x + sx * g, p.y + sy * g);
      ctx!.lineTo(p.x + sx * arm, p.y + sy * g);
      ctx!.stroke();
    });
    ctx!.lineWidth = 1;
  }

  const PLATE_INK = S_MID;
  function plate(x0: number, y0: number, x1: number, y1: number, t: number) {
    const a = toScreen(x0, y0);
    const b = toScreen(x1, y1);
    ctx!.fillStyle = `rgba(254, 254, 253, ${0.99 * t})`;
    ctx!.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    ctx!.strokeStyle = INK(PLATE_INK * t * inkMul);
    ctx!.lineWidth = 1;
    ctx!.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
  }

  /* width of a tracked caps label in world units, so elements can sit beside
     text without hardcoding font metrics */
  /* The printed pen: masses, fine rules, knockouts, in the specimen inks.
     Every primitive reports its extents, so a glyph can be measured before it
     is drawn and then centred in its own tile. Fine rules stay one device
     hairline at any glyph scale, the way a printed rule stays fine. */
  let glyphBox: { x0: number; y0: number; x1: number; y1: number } | null = null;
  function note(x0: number, y0: number, x1: number, y1: number) {
    if (!glyphBox) return;
    if (x0 < glyphBox.x0) glyphBox.x0 = x0;
    if (y0 < glyphBox.y0) glyphBox.y0 = y0;
    if (x1 > glyphBox.x1) glyphBox.x1 = x1;
    if (y1 > glyphBox.y1) glyphBox.y1 = y1;
  }
  /* paint once to measure, then again shifted so the drawing sits centred */
  function centred(paint: (cx2: number, cy2: number) => void, cx2: number, cy2: number) {
    glyphBox = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    paint(cx2, cy2);
    const b = glyphBox;
    glyphBox = null;
    if (!isFinite(b.x0)) { paint(cx2, cy2); return; }
    paint(cx2 + (cx2 - (b.x0 + b.x1) / 2), cy2 + (cy2 - (b.y0 + b.y1) / 2));
  }

  function printPen(cx2: number, cy2: number, u: number, tt: number) {
    const P = (px: number, py: number) => ({ x: cx2 + px * u, y: cy2 + py * u });
    const measuring = () => glyphBox !== null;
    return {
      M(px: number, py: number, w: number, h: number, ink: InkName) {
        const q = P(px, py);
        note(q.x, q.y, q.x + w * u, q.y + h * u);
        if (measuring()) return;
        ctx!.fillStyle = NINK(ink, tt);
        ctx!.fillRect(q.x, q.y, w * u, h * u);
      },
      R(x1: number, y: number, x2: number, ink: InkName, w = 0.75) {
        const q1 = P(x1, y), q2 = P(x2, y);
        note(q1.x, q1.y - w / 2, q2.x, q1.y + w / 2);
        if (measuring()) return;
        ctx!.strokeStyle = NINK(ink, tt); ctx!.lineWidth = w;
        ctx!.beginPath(); ctx!.moveTo(q1.x, q1.y); ctx!.lineTo(q2.x, q2.y); ctx!.stroke();
      },
      V(px: number, y1: number, y2: number, ink: InkName, w = 0.75) {
        const q1 = P(px, y1), q2 = P(px, y2);
        note(q1.x - w / 2, Math.min(q1.y, q2.y), q1.x + w / 2, Math.max(q1.y, q2.y));
        if (measuring()) return;
        ctx!.strokeStyle = NINK(ink, tt); ctx!.lineWidth = w;
        ctx!.beginPath(); ctx!.moveTo(q1.x, q1.y); ctx!.lineTo(q2.x, q2.y); ctx!.stroke();
      },
      C(px: number, py: number, r: number, ink: InkName) {
        const q = P(px, py), rr = r * u;
        note(q.x - rr, q.y - rr, q.x + rr, q.y + rr);
        if (measuring()) return;
        ctx!.beginPath(); ctx!.arc(q.x, q.y, rr, 0, Math.PI * 2);
        ctx!.fillStyle = NINK(ink, tt); ctx!.fill();
      },
      G(pts: Array<[number, number]>, ink: InkName) {
        pts.forEach(([px, py]) => { const q = P(px, py); note(q.x, q.y, q.x, q.y); });
        if (measuring()) return;
        ctx!.beginPath();
        pts.forEach(([px, py], i) => { const q = P(px, py); i ? ctx!.lineTo(q.x, q.y) : ctx!.moveTo(q.x, q.y); });
        ctx!.closePath(); ctx!.fillStyle = NINK(ink, tt); ctx!.fill();
      },
      S(pts: Array<[number, number]>, ink: InkName, w = 1.4) {
        pts.forEach(([px, py]) => { const q = P(px, py); note(q.x, q.y - w / 2, q.x, q.y + w / 2); });
        if (measuring()) return;
        ctx!.strokeStyle = NINK(ink, tt); ctx!.lineWidth = w;
        ctx!.beginPath();
        pts.forEach(([px, py], i) => { const q = P(px, py); i ? ctx!.lineTo(q.x, q.y) : ctx!.moveTo(q.x, q.y); });
        ctx!.stroke();
      },
      T(str: string, px: number, py: number, size: number, ink: InkName, weight = "500", anchor: CanvasTextAlign = "left") {
        const q = P(px, py), fs = size * u;
        ctx!.font = `${weight} ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
        const w = ctx!.measureText(str).width;
        const x0 = anchor === "center" ? q.x - w / 2 : anchor === "right" ? q.x - w : q.x;
        note(x0, q.y - fs * 0.36, x0 + w, q.y + fs * 0.36);
        if (measuring()) return;
        ctx!.fillStyle = NINK(ink, tt);
        ctx!.textAlign = anchor; ctx!.textBaseline = "middle";
        ctx!.fillText(str, q.x, q.y);
        ctx!.textAlign = "left";
      },
      /* A set quotation mark: the ball and its tail are one continuous
         contour, so the tail tapers out of the bowl instead of sitting
         beside it as a second lump. cs is the mark's ball radius. */
      comma(px: number, py: number, cs: number, ink: InkName) {
        const q = P(px, py), r = cs * u;
        note(q.x - r, q.y - r, q.x + 1.15 * r, q.y + 3.05 * r);
        if (measuring()) return;
        ctx!.fillStyle = NINK(ink, tt);
        ctx!.beginPath();
        ctx!.arc(q.x, q.y, r, Math.PI * 0.42, Math.PI * 2.08);
        ctx!.bezierCurveTo(
          q.x + 1.32 * r, q.y + 1.34 * r,
          q.x + 0.62 * r, q.y + 2.36 * r,
          q.x - 0.52 * r, q.y + 3.0 * r,
        );
        ctx!.bezierCurveTo(
          q.x + 0.06 * r, q.y + 2.02 * r,
          q.x + 0.34 * r, q.y + 1.24 * r,
          q.x + Math.cos(Math.PI * 0.42) * r, q.y + Math.sin(Math.PI * 0.42) * r,
        );
        ctx!.closePath(); ctx!.fill();
      },
      /* a pair, set at the spacing a double quote actually takes */
      quotes(px: number, py: number, cs: number, ink: InkName) {
        this.comma(px, py, cs, ink);
        this.comma(px + 2.55 * cs, py, cs, ink);
      },
      /* the sitter: head and shoulders held inside the disc, never spilling */
      avatar(px: number, py: number, r: number, disc: InkName, fig: InkName) {
        const q = P(px, py), R = r * u;
        note(q.x - R, q.y - R, q.x + R, q.y + R);
        if (measuring()) return;
        ctx!.save();
        ctx!.beginPath(); ctx!.arc(q.x, q.y, R, 0, Math.PI * 2);
        ctx!.fillStyle = NINK(disc, tt); ctx!.fill();
        ctx!.clip();
        ctx!.fillStyle = NINK(fig, tt);
        ctx!.beginPath(); ctx!.arc(q.x, q.y - R * 0.26, R * 0.34, 0, Math.PI * 2); ctx!.fill();
        ctx!.beginPath(); ctx!.arc(q.x, q.y + R * 0.72, R * 0.62, 0, Math.PI * 2); ctx!.fill();
        ctx!.restore();
      },
    };
  }

  /* A component in the rack, printed. Cell 58x36; glyph box ~50x28. */
  function partGlyph(kind: string, cx2: number, cy2: number, u: number, t: number) {
    const g = printPen(cx2, cy2, u, t * inkMul);
    switch (kind) {
      case "headline":
        g.M(-23, -11, 40, 6, "graphite"); g.M(-23, -2, 30, 6, "graphite");
        g.R(-23, 8, 23, "greige");
        g.M(-23, 10.5, 32, 3, "stone");
        break;
      case "body":
        g.V(-24, -11, 12, "greige");
        [0, 1, 2, 3].forEach((i) => g.M(-20, -10 + i * 5.6, [40, 43, 36, 24][i], 3, "stone"));
        break;
      case "quote":
        g.quotes(-20, -9, 2.2, "graphite");
        g.M(-21, 1, 42, 3.2, "umber");
        g.M(-21, 7, 32, 3.2, "umber");
        break;
      case "credit":
        g.M(-16, -6, 10, 2.6, "graphite");
        g.M(-16, -0.5, 32, 3.4, "umber");
        g.M(-16, 6, 22, 2.6, "stone");
        break;
      case "lockup":
        g.M(-20, -8, 13, 13, "umber");
        g.M(-3, -6, 24, 4, "stone"); g.M(-3, 1, 15, 2.6, "greige");
        g.R(-24, -12, -18, "stone"); g.V(-24, -12, -6, "stone");
        g.R(18, 12, 24, "stone"); g.V(24, 6, 12, "stone");
        break;
      case "image":
        g.M(-22, -12, 44, 24, "mist");
        g.G([[-22, 12], [-9, -2], [0, 6], [10, -6], [22, 12]], "greige");
        g.C(13, -6, 3, "umber");
        break;
      case "ground":
        g.M(-22, -12, 44, 24, "mist");
        for (let i = 0; i < 7; i++) g.V(-18 + i * 6.2, -12 + (i % 2) * 3, 12 - ((i + 1) % 2) * 3, "greige");
        g.C(-8, -3, 1.2, "umber"); g.C(6, 4, 1.2, "umber");
        break;
      case "palette":
        (["graphite", "umber", "stone", "greige", "mist"] as InkName[]).forEach((ink, i) => g.M(-22 + i * 9.2, -9, 8, 13, ink));
        g.R(-22, 8, 24, "greige");
        [0, 1, 2, 3, 4].forEach((i) => g.V(-18 + i * 9.2, 8, 11, "umber"));
        break;
      case "figure":
        g.V(-20, -11, 10, "stone"); g.R(-20, 10, 22, "stone");
        [[-15, 6], [-7, 12], [1, 8], [9, 16]].forEach(([px, h]) => g.M(px, 10 - h, 5.5, h, "greige"));
        g.S([[-12, 2], [-4, -3], [4, -1], [13, -8]], "umber", 1.2);
        g.C(13, -8, 1.5, "graphite");
        break;
      case "list":
        [0, 1, 2].forEach((i) => {
          g.M(-20, -9 + i * 8, 3, 3, "umber");
          g.M(-13, -9 + i * 8, [30, 34, 24][i], 3, "stone");
        });
        break;
      case "chip":
        g.M(-22, -6, 34, 12, "umber");
        g.M(-17, -1.7, 18, 3.4, "paper");
        g.R(12, 0, 20, "umber", 1.1);
        g.G([[20, -2.8], [24.5, 0], [20, 2.8]], "umber");
        break;
      default: { // seal
        const N = 22, R0 = 11.5;
        for (let i = 0; i < N; i++) {
          const a1 = (i / N) * Math.PI * 2, a2 = ((i + 0.42) / N) * Math.PI * 2;
          g.G([
            [Math.cos(a1) * (R0 - 2.6), Math.sin(a1) * (R0 - 2.6)],
            [Math.cos(a1) * R0, Math.sin(a1) * R0],
            [Math.cos(a2) * R0, Math.sin(a2) * R0],
            [Math.cos(a2) * (R0 - 2.6), Math.sin(a2) * (R0 - 2.6)],
          ], "umber");
        }
        g.C(0, 0, 5.8, "graphite");
        g.S([[-2.6, 0.2], [-0.7, 2.2], [3.1, -2.2]], "paper", 1.6);
        break;
      }
    }
  }

  /* A renderer's device, printed. Interior ~104x64. */
  function deviceGlyph(i: number, cx2: number, cy2: number, u: number, t: number) {
    const g = printPen(cx2, cy2, u, t * inkMul);
    if (i === 0) { // web: the browser, set quiet
      g.M(-36, -26, 72, 11, "greige");
      [0, 1, 2].forEach((d) => g.C(-30 + d * 5.5, -20.5, 1.4, "paper"));
      g.M(-8, -23.6, 36, 5.5, "paper");
      g.M(-36, -15, 72, 41, "mist");
      g.M(-29, -9, 36, 12, "umber");
      g.M(-29, 8, 28, 3, "stone"); g.M(-29, 14, 23, 3, "stone");
      g.V(13, -9, 20, "greige");
      g.M(18, -9, 13, 18, "greige");
      g.M(18, 13, 13, 3, "stone");
    } else if (i === 1) { // image: the plate, its crop, its focal mark
      g.M(-34, -22, 68, 44, "mist");
      g.G([[-34, 22], [-13, 0], [1, 12], [15, -6], [34, 22]], "greige");
      g.C(19, -10, 3.6, "umber");
    } else if (i === 2) { // document: the page, its fold, its margins
      g.G([[-19, -26], [9, -26], [19, -16], [19, 26], [-19, 26], [-19, -26]], "mist");
      g.G([[9, -26], [9, -16], [19, -16]], "greige");
      g.M(-12, -19, 17, 3.6, "graphite");
      g.R(-12, -11, 12, "stone");
      [0, 1, 2].forEach((d) => g.M(-12, -7 + d * 5, [22, 19, 22][d], 2.2, "stone"));
      g.V(-9.5, 9, 18, "umber", 1.1);
      g.M(-5, 9, 16, 2.2, "umber"); g.M(-5, 14, 13, 2.2, "umber");
    } else if (i === 3) { // deck: the slide and its furniture
      g.M(-36, -24, 72, 40, "mist");
      g.M(-29, -17, 30, 6, "graphite");
      g.M(-29, -6, 22, 2.6, "stone"); g.M(-29, -1, 18, 2.6, "stone");
      g.V(6, -17, 10, "greige");
      g.G([[11, 9], [20, -3], [26, 3], [31, -6], [31, 9]], "greige");
      [0, 1, 2].forEach((d) => g.M(-36 + d * 12, 21, 9, 4, d === 0 ? "umber" : "greige"));
    } else { // video: the frame and its timeline
      g.M(-36, -25, 72, 38, "greige");
      g.G([[-5, -14], [10, -6], [-5, 2]], "paper");
      g.R(-36, 19, 36, "greige", 2.4);
      g.R(-36, 19, -8, "umber", 2.4);
      g.M(-9.5, 16, 3, 7, "graphite");
      [0, 1, 2, 3, 4, 5].forEach((d) => g.V(-36 + d * 14.4, 24, 27, "stone"));
    }
  }

  function capsWidth(str: string, size: number) {
    const p0 = toScreen(0, 0);
    const px = size * p0.s;
    ctx!.font = `500 ${px}px -apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif`;
    ctx!.letterSpacing = `${0.08 * px}px`;
    const w = ctx!.measureText(str.toUpperCase()).width;
    ctx!.letterSpacing = "0px";
    return w / p0.s;
  }

  /* One line of a double rule, never thinner than the screen can actually draw:
     on a retina panel this is a true single device pixel, and on a 1x display it
     floors at one rather than dissolving into a grey wash. */
  const ruleW = () => Math.max(RULE_W, 1 / dpr);

  function stroke(alpha: number, dash?: number[]) {
    ctx!.strokeStyle = INK(alpha * inkMul);
    ctx!.lineWidth = 1;
    ctx!.setLineDash(dash ?? []);
    ctx!.stroke();
    ctx!.setLineDash([]);
  }

  function icon(name: string, wx: number, wy: number, sizeWorld: number, t: number) {
    const p2 = iconPaths.get(name);
    const tt = t * inkMul;
    if (!p2 || tt <= 0.02) return;
    const p = toScreen(wx, wy);
    const s = (sizeWorld * p.s) / 24;
    ctx!.save();
    ctx!.translate(p.x - (sizeWorld * p.s) / 2, p.y - (sizeWorld * p.s) / 2);
    ctx!.scale(s, s);
    ctx!.fillStyle = INK(0.8 * tt);
    ctx!.fill(p2);
    ctx!.restore();
  }

  /* a typographic chip standing in for a mark with no vector source */
  function markChip(label: string, wx: number, wy: number, t: number) {
    const tt = t * inkMul;
    if (tt <= 0.02) return;
    const p = toScreen(wx, wy);
    const size = 8 * p.s;
    if (size < 4) return;
    ctx!.font = `600 ${size}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const tw = ctx!.measureText(label.toUpperCase()).width;
    ctx!.beginPath();
    ctx!.roundRect(p.x - tw / 2 - 5 * p.s, p.y - size / 2 - 4 * p.s, tw + 10 * p.s, size + 8 * p.s, 0);
    ctx!.strokeStyle = INK(0.4 * tt);
    ctx!.lineWidth = 1;
    ctx!.stroke();
    ctx!.fillStyle = INK(0.7 * tt);
    ctx!.textAlign = "center";
    ctx!.textBaseline = "middle";
    ctx!.letterSpacing = `${0.06 * size}px`;
    ctx!.fillText(label.toUpperCase(), p.x, p.y);
    ctx!.textAlign = "left";
    ctx!.letterSpacing = "0px";
  }

  function card(x: number, y: number, w: number, h: number, t: number, o?: {
    rise?: boolean; strong?: boolean; radius?: number;
  }) {
    const tt = t * Math.max(inkMul, 0.001);
    if (tt <= 0.02) return;
    const lift = o?.rise === false ? 0 : (1 - EASE(t)) * 14;
    const a = toScreen(x, y + lift);
    const b = toScreen(x + w, y + h + lift);
    ctx!.beginPath();
    ctx!.roundRect(a.x, a.y, b.x - a.x, b.y - a.y, 0);
    ctx!.save();
    ctx!.shadowColor = `rgba(23, 23, 26, ${0.06 * tt})`;
    ctx!.shadowBlur = 14 * a.s;
    ctx!.shadowOffsetY = 3 * a.s;
    ctx!.fillStyle = `rgba(255, 255, 255, ${0.97 * t})`;
    ctx!.fill();
    ctx!.restore();
    stroke((o?.strong ? S_MAIN : S_MID) * t);
  }

  /* Shift a screen polyline by d along each segment's left normal and mitre the
     corners at the intersection of the shifted segments, so a doubled run keeps
     an even channel all the way round a bend instead of pinching at the elbow. */
  type SP = { x: number; y: number };
  function offsetPoly(sp: SP[], d: number): SP[] {
    const segs = sp.slice(0, -1).map((a, i) => {
      const dx = sp[i + 1].x - a.x, dy = sp[i + 1].y - a.y;
      const L = Math.hypot(dx, dy) || 1;
      const nx = (-dy / L) * d, ny = (dx / L) * d;
      return { a: { x: a.x + nx, y: a.y + ny }, ux: dx / L, uy: dy / L, b: { x: sp[i + 1].x + nx, y: sp[i + 1].y + ny } };
    });
    const out: SP[] = [segs[0].a];
    for (let i = 1; i < segs.length; i++) {
      const p = segs[i - 1], q = segs[i];
      const den = p.ux * q.uy - p.uy * q.ux;
      if (Math.abs(den) < 1e-6) { out.push(q.a); continue; }   // collinear, nothing to mitre
      const u = ((q.a.x - p.a.x) * q.uy - (q.a.y - p.a.y) * q.ux) / den;
      out.push({ x: p.a.x + p.ux * u, y: p.a.y + p.uy * u });
    }
    out.push(segs[segs.length - 1].b);
    return out;
  }
  /* which way a corner turns; the inside of the turn takes the smaller radius */
  function turnSign(sp: SP[], i: number) {
    const z = (sp[i].x - sp[i - 1].x) * (sp[i + 1].y - sp[i].y) - (sp[i].y - sp[i - 1].y) * (sp[i + 1].x - sp[i].x);
    return z > 0 ? 1 : z < 0 ? -1 : 0;
  }

  /* dash: the line belongs to another layer and is only crossing into this one.
     Dashed routes fade in rather than draw on, since the dash pattern is the
     line's identity and animating the offset would set the dots marching.
     double: the run belongs to one of the two watching layers, and is drawn as
     a double rule. */
  function route(pts: Array<[number, number]>, t: number, o?: { alpha?: number; pulse?: number; dash?: boolean; double?: boolean; trimStart?: number; trimEnd?: number }) {
    const tt = t * inkMul;
    if (tt <= 0.02 || pts.length < 2) return;
    const sp = pts.map(([x, y]) => toScreen(x, y));
    /* Pull an end back along its own segment by a screen distance. A branch
       meeting a double rule has to stop on the trunk's near hairline: the
       centreline is the one place it must not stop, since both of its rails
       would dead-end in the channel with the far rail left unbroken. The
       trunk's rails are screen offsets, so a caller working in world
       coordinates cannot shorten the branch itself. */
    const trim = (i: number, j: number, d: number) => {
      const a = sp[i], b2 = sp[j];
      const L = Math.hypot(b2.x - a.x, b2.y - a.y) || 1;
      sp[i] = { ...a, x: a.x + ((b2.x - a.x) / L) * d, y: a.y + ((b2.y - a.y) / L) * d };
    };
    if (o?.trimStart) trim(0, 1, o.trimStart);
    if (o?.trimEnd) trim(sp.length - 1, sp.length - 2, o.trimEnd);
    const r = 8 * sp[0].s;
    const mk = (off: number) => {
      const q = off === 0 ? sp : offsetPoly(sp, off);
      const p = new Path2D();
      p.moveTo(q[0].x, q[0].y);
      for (let i = 1; i < q.length - 1; i++) {
        p.arcTo(q[i].x, q[i].y, q[i + 1].x, q[i + 1].y, off === 0 ? r : Math.max(0.5, r - off * turnSign(sp, i)));
      }
      p.lineTo(q[q.length - 1].x, q[q.length - 1].y);
      let len = 0;
      for (let i = 1; i < q.length; i++) len += Math.hypot(q[i].x - q[i - 1].x, q[i].y - q[i - 1].y);
      return { p, len };
    };
    const runs = o?.double ? [mk(RULE_GAP), mk(-RULE_GAP)] : [mk(0)];
    const lw = o?.double ? ruleW() : 1;
    // a pulse always rides the centre of the run, never one side of a pair
    const pulse = () => {
      if (o?.pulse === undefined || o.pulse <= 0 || o.pulse >= 1) return;
      const c = o?.double ? mk(0) : runs[0];
      ctx!.strokeStyle = INK(0.8 * inkMul);
      ctx!.lineWidth = 1.5;
      const seg = c.len * 0.1;
      ctx!.setLineDash([seg, c.len]);
      ctx!.lineDashOffset = -(c.len - seg) * o.pulse + seg;
      ctx!.stroke(c.p);
      ctx!.setLineDash([]);
      ctx!.lineDashOffset = 0;
      ctx!.lineWidth = 1;
    };
    if (o?.dash) {
      // one uniform ink for the whole dotted class; alpha is ignored here
      ctx!.strokeStyle = INK(DASH_INK * Math.min(1, tt * 1.4) * EASE(t));
      ctx!.lineWidth = lw;
      ctx!.setLineDash([2 * sp[0].s, 3 * sp[0].s]);
      runs.forEach(({ p }) => ctx!.stroke(p));
      ctx!.setLineDash([]);
      ctx!.lineWidth = 1;
      pulse();
      return;
    }
    ctx!.strokeStyle = INK((o?.alpha ?? S_SOFT) * Math.min(1, tt * 1.4));
    ctx!.lineWidth = lw;
    const e = EASE(t);
    runs.forEach(({ p, len }) => {
      ctx!.setLineDash([len]);
      ctx!.lineDashOffset = len * (1 - e);
      ctx!.stroke(p);
    });
    ctx!.setLineDash([]);
    ctx!.lineDashOffset = 0;
    ctx!.lineWidth = 1;
    pulse();
  }

  /* bare: the chip is not set into a line, so it needs no plate to stop one */
  function chipLabel(str: string, wx: number, wy: number, t: number, o?: { bare?: boolean }) {
    const tt = t * inkMul;
    if (tt <= 0.02) return;
    const p = toScreen(wx, wy);
    const size = 9 * p.s;
    if (size < 4) return;
    ctx!.font = `500 ${size}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const tw = (ctx!.measureText(str.toUpperCase()).width + 0.08 * size * str.length) / p.s;
    if (o?.bare) {
      ctx!.fillStyle = `rgba(254, 254, 253, ${0.98 * t})`;
      ctx!.fillRect(p.x - 8 * p.s, p.y - size, (tw + 16) * p.s, size * 2);
    } else {
      plate(wx - 8, wy - 9, wx + tw + 8, wy + 9, t);
    }
    text(str, wx, wy, t, { size: 9, caps: true, alpha: T_FAINT, track: true });
  }

  /* ── fragment sketches: each drawn at its own small scale ── */

  /* each fragment is an enclosed tile: one uniform size, white fill,
     hairline border, quiet shadow, sharp corners, with an ultra-detailed
     glyph inside. compact mode renders the docked icon. */
  const FRAG_W = 96, FRAG_H = 64;

  /* ── the specimen inks: opaque neutrals, mixed like a print run ──
     Graphite is the emphasis ink: one small mass per glyph, never more.
     Reveal and spotlight multiply into the alpha, so a fading or dimmed
     glyph fades as a whole print, not stroke by stroke. */
  const NEUTRAL = {
    graphite: [74, 70, 63],
    umber: [132, 124, 113],
    stone: [175, 168, 157],
    greige: [215, 209, 199],
    mist: [236, 232, 225],
    paper: [254, 254, 253],
  } as const;
  type InkName = keyof typeof NEUTRAL;
  function NINK(name: InkName, a2: number) {
    const c = NEUTRAL[name];
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${Math.max(0, Math.min(1, a2))})`;
  }
  /* Glyph painters draw with hairlines multiplied by this factor. Live it is 1;
     while painting a sprite it is raised so the stroke, once the picture is
     scaled down, reads as the same hairline. */
  let glyphLWF = 1;

  function fragSketch(kind: string, px: number, py: number, s: number, t: number, rot: number, compact = false) {
    const tt = t * inkMul;
    if (tt <= 0.02) return;
    ctx!.save();
    ctx!.translate(px, py);
    ctx!.rotate((rot * Math.PI) / 180);

    /* the enclosure: one size for every fragment */
    const tw = compact ? 34 : FRAG_W;
    const th = compact ? 24 : FRAG_H;
    ctx!.beginPath();
    ctx!.roundRect((-tw / 2) * s, (-th / 2) * s, tw * s, th * s, 0);
    ctx!.save();
    ctx!.shadowColor = `rgba(23, 23, 26, ${(compact ? 0.04 : 0.07) * tt})`;
    ctx!.shadowBlur = (compact ? 5 : 10) * s;
    ctx!.shadowOffsetY = 2 * s;
    ctx!.fillStyle = `rgba(255, 255, 255, ${0.97 * t})`;
    ctx!.fill();
    ctx!.restore();
    ctx!.strokeStyle = INK((compact ? 0.24 : 0.32) * tt);
    ctx!.lineWidth = glyphLWF;
    ctx!.stroke();

    centred((gx2, gy2) => fragGlyph(kind, gx2, gy2, s, tt, compact), 0, 0);
    ctx!.restore();
  }

  function fragGlyph(kind: string, cx2: number, cy2: number, s: number, tt: number, compact: boolean) {
    const g = printPen(cx2, cy2, s, tt);

    if (compact) {
      /* the signature element, printed small */
      switch (kind) {
        case "statement": g.M(-13, -6, 26, 5, "graphite"); g.M(-13, 2.5, 12, 3, "stone"); break;
        case "paragraph": g.M(-13, -6.6, 6, 6, "umber"); g.M(-5.5, -6.4, 18, 2.5, "stone"); g.M(-5.5, -2.6, 14, 2.5, "stone"); g.M(-13, 1.6, 25.5, 2.5, "stone"); g.M(-13, 5.6, 18, 2.5, "stone"); break;
        case "profile": g.avatar(-9.5, -1, 4.3, "stone", "paper"); g.M(-3, -4.3, 15, 2.9, "umber"); g.M(-3, 0.4, 10, 2.4, "greige"); g.M(-3, 4.2, 6, 2.4, "greige"); break;
        case "hierarchy": g.M(-13, -8, 17, 3.4, "graphite"); g.V(-11.5, -4, 6.5, "umber", 1); g.R(-11.5, -0.6, -7, "umber", 1); g.M(-6, -2, 13, 2.6, "stone"); g.R(-11.5, 6, -7, "umber", 1); g.M(-6, 4.6, 9, 2.6, "stone"); break;
        case "claim": g.M(-13, -4.4, 15, 3, "umber"); g.M(-13, 1.4, 11, 3, "stone"); g.C(9.6, -1.4, 3.8, "graphite"); g.S([[8, -1.2], [9.2, 0.1], [11.4, -2.6]], "paper", 1.1); break;
        case "quote": g.quotes(-12, -5, 1.7, "graphite"); g.M(-13, 3.5, 24, 3, "umber"); g.M(-13, 8.5, 15, 2.4, "stone"); break;
        case "channels": g.C(-11, -6, 2.1, "umber"); g.M(-6.5, -7.2, 19, 2.5, "stone"); g.M(-13, -1.6, 4.2, 4.2, "umber"); g.M(-6.5, -1.2, 14, 2.5, "stone"); g.G([[-11, 3.4], [-8.6, 7.6], [-13.4, 7.6]], "umber"); g.M(-6.5, 4.8, 16, 2.5, "stone"); break;
        case "principles": g.T("1", -12.5, -4.6, 5.4, "umber", "600"); g.M(-7.5, -5.8, 20, 2.7, "stone"); g.T("2", -12.5, 3, 5.4, "umber", "600"); g.M(-7.5, 1.8, 16, 2.7, "stone"); break;
        case "beforeafter": g.M(-13, -7, 9.5, 14, "mist"); g.M(5, -7, 9.5, 14, "greige"); g.M(7, -4, 5.5, 2.2, "paper"); g.M(7, 0, 3.5, 2.2, "paper"); g.R(-2, 0, 1.2, "umber", 1.2); g.G([[1.2, -1.8], [2.9, 0], [1.2, 1.8]], "umber"); break;
        case "banned": g.M(-13, -6.4, 18, 3.2, "greige"); g.R(-14.6, -4.8, 7.6, "graphite", 1.1); g.M(-13, 1.2, 14, 3.2, "umber"); g.S([[8.6, 2.6], [9.9, 4], [12.6, 1], ], "umber", 1.2); break;
        case "swatches": (["umber", "stone", "greige"] as InkName[]).forEach((ink, i) => g.M(-10 + i * 7.4, -3.6, 6.4, 7.2, ink)); break;
        case "aa": g.T("A", -8, 0, 11, "graphite", "600"); g.T("a", 3, 1, 7.5, "stone", "400"); break;
        case "ruler": g.R(-11, 2, 11, "umber", 1); [0, 1, 2, 3, 4].forEach((i) => g.V(-9 + i * 4.5, i % 2 ? -1 : -3, 2, "stone", 1)); break;
        case "grid": g.M(-9, -6, 18, 12, "mist"); g.M(-6, -4, 4, 8, "greige"); g.M(1, -4, 4, 8, "greige"); break;
        case "steps": g.M(-10, 1, 5, 4, "greige"); g.M(-3, -1, 6, 6, "stone"); g.M(5, -4, 7, 9, "umber"); break;
        case "shapes": g.C(-6, 0, 4, "stone"); g.M(2, -4, 8, 8, "umber"); break;
        case "easing": g.S([[-9, 5], [-2, 5], [0, -5], [9, -5]], "umber", 1.2); g.C(9, -5, 1.4, "graphite"); break;
        case "frame": g.M(-10, -6.5, 20, 13, "mist"); g.G([[-10, 6.5], [-3, -1], [3, 3], [10, 6.5]], "greige"); g.C(5, -3, 1.6, "umber"); break;
        case "sparkline": [3, 7, 5, 9].forEach((h, i) => g.M(-9 + i * 5, 5 - h, 3.6, h, "stone")); g.C(9, -4.5, 1.4, "graphite"); break;
        default: g.M(-10, -5, 9, 10, "graphite"); g.T("A", -5.5, 0.5, 6.5, "paper", "500", "center"); g.T("A", 5, 0.5, 6.5, "stone", "500", "center"); break;
      }
      return;
    }

    /* the full drawing, printed */
    const L0 = -38;
    switch (kind) {
      case "statement":
        g.M(L0, -22, 58, 6.5, "graphite");
        g.M(L0, -12, 44, 6.5, "graphite");
        g.M(L0, 0, 50, 3.6, "stone");
        g.M(L0, 7, 41, 3.6, "stone");
        g.R(L0, 18, L0 + 72, "greige");
        g.M(L0, 21.5, 24, 2.6, "umber");
        break;
      case "paragraph":
        g.R(L0, -23, L0 + 72, "greige");
        g.M(L0, -16, 12, 12, "umber");
        g.M(L0 + 16, -16, 50, 3.2, "stone");
        g.M(L0 + 16, -9.5, 56, 3.2, "stone");
        g.M(L0, 0, 72, 3.2, "stone");
        g.M(L0, 6.5, 66, 3.2, "stone");
        g.M(L0, 13, 40, 3.2, "stone");
        break;
      case "profile":
        g.avatar(L0 + 9, -13, 9, "stone", "paper");
        g.M(L0 + 24, -17, 34, 4.2, "umber");
        g.M(L0 + 24, -9, 26, 3, "stone");
        g.R(L0, 0, L0 + 72, "greige");
        g.M(L0, 5, 30, 3, "stone");
        g.M(L0 + 38, 5, 24, 3, "stone");
        g.M(L0, 12, 26, 3, "stone");
        g.M(L0 + 38, 12, 30, 3, "stone");
        g.M(L0, 19, 20, 5, "mist");
        break;
      case "hierarchy":
        g.M(L0, -22, 40, 5, "graphite");
        g.V(L0 + 4, -15, 16, "umber");
        [[-8, 34], [1, 42], [10, 28]].forEach(([y, w]) => {
          g.R(L0 + 4, y + 1.5, L0 + 12, "umber");
          g.M(L0 + 14, y, w, 3.4, "stone");
        });
        break;
      case "claim":
        g.M(L0, -18, 62, 3.6, "umber");
        g.M(L0, -11, 48, 3.6, "umber");
        g.R(L0, 0, L0 + 72, "greige");
        g.M(L0, 6, 30, 3, "stone");
        g.C(L0 + 62, 12, 7.5, "graphite");
        g.S([[L0 + 59, 12.3], [L0 + 61.2, 14.6], [L0 + 65.4, 9.6]], "paper", 1.4);
        break;
      case "quote":
        g.quotes(L0 + 2, -16, 2.9, "graphite");
        g.M(L0, -3, 66, 4, "umber");
        g.M(L0, 5, 54, 4, "umber");
        g.M(L0, 15, 14, 2.6, "graphite");
        break;
      case "channels": {
        const rows: Array<[string, number, number]> = [["c", -18, 40], ["s", -8, 46], ["t", 2, 34], ["d", 12, 43]];
        rows.forEach(([shape, y, w]) => {
          if (shape === "c") g.C(L0 + 3, y + 1.6, 2.6, "stone");
          else if (shape === "s") g.M(L0 + 0.6, y - 0.8, 4.8, 4.8, "stone");
          else if (shape === "t") g.G([[L0 + 3, y - 1.2], [L0 + 5.8, y + 3.6], [L0 + 0.2, y + 3.6]], "stone");
          else g.G([[L0 + 3, y - 1.4], [L0 + 6, y + 1.6], [L0 + 3, y + 4.6], [L0, y + 1.6]], "stone");
          g.M(L0 + 11, y, w, 3.2, "umber");
          g.M(L0 + 58, y, 14, 3.2, "greige");
        });
        g.M(L0 + 58, -18, [9, 14, 6, 11][3], 3.2, "greige");
        break;
      }
      case "principles":
        g.T("01", L0 + 3, -15, 6.5, "umber", "500");
        g.M(L0 + 14, -18, 52, 3.6, "stone");
        g.M(L0 + 14, -11, 40, 3.6, "stone");
        g.R(L0, -1, L0 + 72, "greige");
        g.T("02", L0 + 3, 7, 6.5, "umber", "500");
        g.M(L0 + 14, 4, 46, 3.6, "stone");
        g.M(L0 + 14, 11, 34, 3.6, "stone");
        break;
      case "beforeafter":
        g.M(L0, -16, 30, 34, "mist");
        g.M(L0 + 4, -11, 18, 2.6, "stone");
        g.M(L0 + 4, -5, 22, 2.6, "stone");
        g.M(L0 + 4, 1, 14, 2.6, "stone");
        g.M(L0 + 42, -16, 30, 34, "greige");
        g.M(L0 + 46, -11, 20, 4, "umber");
        g.M(L0 + 46, -3, 22, 2.6, "paper");
        g.M(L0 + 46, 3, 16, 2.6, "paper");
        g.R(L0 + 32, 1, L0 + 40, "umber", 1.1);
        g.G([[L0 + 40, -1.4], [L0 + 42.6, 1], [L0 + 40, 3.4]], "umber");
        break;
      case "banned":
        g.M(L0, -20, 44, 3.6, "stone");
        g.R(L0 - 2, -18.2, L0 + 48, "graphite", 1.1);
        g.M(L0, -11, 36, 3.6, "stone");
        g.R(L0 - 2, -9.2, L0 + 40, "graphite", 1.1);
        g.R(L0, 1, L0 + 72, "greige");
        g.M(L0, 7, 48, 3.6, "umber");
        g.S([[L0 + 56, 9.5], [L0 + 58.4, 12], [L0 + 63, 6.4]], "umber", 1.4);
        break;
      case "swatches":
        (["graphite", "umber", "stone", "greige", "mist"] as InkName[]).forEach((ink, i) => g.M(L0 + i * 14.6, -18, 13, 17, ink));
        g.R(L0, 4, L0 + 71, "greige");
        [0, 1, 2, 3, 4].forEach((i) => g.V(L0 + 6.5 + i * 14.6, 4, 7.5, "umber"));
        g.M(L0, 15, 18, 3, "umber");
        g.M(L0 + 24, 15, 12, 3, "stone");
        g.M(L0 + 42, 15, 15, 3, "greige");
        break;
      case "aa":
        g.T("A", L0 + 12, -3, 24, "graphite", "600", "center");
        g.T("a", L0 + 32, 1, 15, "stone", "400", "center");
        g.R(L0 + 46, -14, L0 + 72, "greige");
        g.R(L0 + 46, -3, L0 + 72, "greige");
        g.R(L0 + 46, 8, L0 + 72, "greige");
        g.M(L0 + 46, -16.4, 5, 2.4, "umber");
        g.M(L0 + 46, -5.4, 5, 2.4, "umber");
        g.R(L0, 17, L0 + 72, "greige");
        break;
      case "ruler":
        g.R(L0, -6, L0 + 72, "umber", 1.1);
        [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((i) => g.V(L0 + 2 + i * 8.5, -6, i % 2 ? -12 : -16, "stone", 1));
        g.V(L0 + 2, 2, 8, "umber"); g.V(L0 + 36, 2, 8, "umber");
        g.R(L0 + 2, 5, L0 + 36, "umber");
        g.M(L0 + 46, 8, 22, 3, "stone");
        break;
      case "grid":
        g.M(L0, -20, 72, 36, "mist");
        [0, 1, 2, 3, 4].forEach((i) => g.M(L0 + 5 + i * 13.4, -15, 9.5, 26, "greige"));
        g.R(L0, 21, L0 + 72, "greige");
        break;
      case "steps":
        g.R(L0, 18, L0 + 72, "greige");
        g.M(L0 + 4, 8, 14, 10, "greige");
        g.M(L0 + 26, -2, 17, 20, "stone");
        g.M(L0 + 51, -14, 20, 32, "umber");
        break;
      case "shapes":
        g.C(L0 + 13, -2, 11, "stone");
        g.M(L0 + 34, -13, 22, 22, "umber");
        g.R(L0, 16, L0 + 72, "greige");
        g.M(L0, 19.5, 16, 2.6, "stone");
        g.M(L0 + 34, 19.5, 16, 2.6, "umber");
        break;
      case "easing":
        g.R(L0, -18, L0 + 66, "mist"); g.R(L0, 14, L0 + 66, "mist");
        g.V(L0, -18, 14, "mist"); g.V(L0 + 66, -18, 14, "mist");
        g.S([[L0, 14], [L0 + 26, 14], [L0 + 38, -18], [L0 + 66, -18]], "umber", 1.5);
        g.C(L0, 14, 1.8, "stone");
        g.C(L0 + 66, -18, 2.2, "graphite");
        break;
      case "frame":
        g.M(L0 + 4, -20, 64, 38, "mist");
        g.G([[L0 + 4, 18], [L0 + 24, -3], [L0 + 37, 8], [L0 + 51, -8], [L0 + 68, 18]], "greige");
        g.C(L0 + 55, -12, 3.4, "umber");

        break;
      case "sparkline":
        g.R(L0, 16, L0 + 72, "greige");
        [7, 13, 9, 17, 12, 20].forEach((h, i) => g.M(L0 + 3 + i * 11.6, 16 - h, 7.5, h, "stone"));
        g.S([[L0 + 7, 6], [L0 + 18, 0], [L0 + 30, 4], [L0 + 42, -4], [L0 + 53, 1], [L0 + 65, -7]], "umber", 1.3);
        g.C(L0 + 65, -7, 1.8, "graphite");
        break;
      default: // contrast
        g.M(L0 + 2, -16, 30, 30, "graphite");
        g.T("A", L0 + 17, 0, 15, "paper", "500", "center");
        g.M(L0 + 40, -16, 30, 30, "mist");
        g.T("A", L0 + 55, 0, 15, "stone", "500", "center");
        g.R(L0 + 2, 20, L0 + 32, "umber");
        g.R(L0 + 40, 20, L0 + 70, "greige");
        break;
    }
  }


  /* fragments fly on arcs into their card rows */
  function drawFrags() {
    ([[BI_ROWS, BI, reveal[1]], [DL_ROWS, DL, reveal[2]]] as const).forEach(([rows, def, t]) => {
      rows.forEach((f, idx) => {
        const local = Math.max(0, Math.min(1, t * 2.1 - idx * 0.12));
        const e = EASE(local);
        const tx = def.x + 40;
        const ty = def.y + 66 + idx * 24;
        const mx = (f.sx + tx) / 2, my = Math.min(f.sy, ty) - 100;
        const wx = (1 - e) * (1 - e) * f.sx + 2 * (1 - e) * e * mx + e * e * tx;
        const wy = (1 - e) * (1 - e) * f.sy + 2 * (1 - e) * e * my + e * e * ty;
        const p = toScreen(wx, wy);
        const appear = Math.min(1, reveal[0] * 3);
        const docked = e > 0.96;
        withLayer(f.layer, () => {
          fragSketch(f.kind, p.x, p.y, p.s * (docked ? 0.72 : 1), appear, docked ? 0 : f.rot * (1 - e), docked);
          if (docked) {
            text(f.label, def.x + 72, ty, appear, { size: 10, alpha: T_BODY });
            const lvl = def === DL ? TOKEN_LEVEL[f.label] : undefined;
            if (lvl) text(lvl, def.x + def.w - 18, ty, appear, { size: 8, alpha: 0.34, anchor: "right" as CanvasTextAlign });
          }
        });
      });
    });
  }

  /* ── layer 01: brand intelligence ── */
  function drawBI(t: number) {
    withLayer(0, () => {
      if (t <= 0.02) return;
      card(BI.x, BI.y, BI.w, BI.h, t);
      text("Brand intelligence", BI.x + 18, BI.y + 26, t, { size: 10.5, caps: true, alpha: T_TITLE, weight: "500", track: true });
      const a = toScreen(BI.x + 18, BI.y + 42);
      const b = toScreen(BI.x + BI.w - 18, BI.y + 42);
      ctx!.strokeStyle = INK(0.1 * t * inkMul);
      ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      // where the knowledge is written: the row ends at the card's right edge
      BI_MARKS.forEach((m, i) => markTile(m, BI.x + BI.w - 22 - (BI_MARKS.length - 1 - i) * MARK_GAP, BI.y + 26, t));
      // the compile step, its content centred, its products worn as pills
      card(COMPILE.x, COMPILE.y, COMPILE.w, COMPILE.h, t);
      text("compile", COMPILE.x + 18, COMPILE.y + 17, t, { size: 9.5, caps: true, alpha: 0.6, weight: "500", track: true });
      {
        let px2 = COMPILE.x + 18;
        (["bundles", "search index", "types", "agent context"] as const).forEach((nm) => {
          const p = toScreen(px2, COMPILE.y + 37);
          const size = 7.5 * p.s;
          ctx!.font = `400 ${size}px -apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif`;
          const w = ctx!.measureText(nm).width / p.s;
          ctx!.beginPath();
          ctx!.roundRect(p.x - 5 * p.s, p.y - 7 * p.s, (w + 10) * p.s, 14 * p.s, 0);
          stroke(0.16 * t);
          text(nm, px2, COMPILE.y + 37, t, { size: 7.5, alpha: T_FAINT });
          px2 += w + 15;
        });
      }
      route([[BI.x + BI.w / 2, BI.y + BI.h], [BI.x + BI.w / 2, COMPILE.y]], t, { alpha: 0.2, dash: true });
      // Google Workspace: where the knowledge is written
      {
        const fa = toScreen(BI.x + 18, BI.y + BI.h - 30);
        const fb = toScreen(BI.x + BI.w - 18, BI.y + BI.h - 30);
        ctx!.strokeStyle = INK(0.1 * t * inkMul);
        ctx!.beginPath(); ctx!.moveTo(fa.x, fa.y); ctx!.lineTo(fb.x, fb.y); ctx!.stroke();
      }
      text("v2026-07", BI.x + 18, BI.y + BI.h - 15, t, { size: 8.5, alpha: T_FAINT });
    });
  }

  /* ── layer 02: design language ── */
  function drawDL(t: number) {
    withLayer(1, () => {
      if (t <= 0.02) return;
      card(DL.x, DL.y, DL.w, DL.h, t);
      text("Design language", DL.x + 18, DL.y + 26, t, { size: 10.5, caps: true, alpha: T_TITLE, weight: "500", track: true });
      const a = toScreen(DL.x + 18, DL.y + 42);
      const b = toScreen(DL.x + DL.w - 18, DL.y + 42);
      ctx!.strokeStyle = INK(0.1 * t * inkMul);
      ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      DL_MARKS.forEach((m, i) => markTile(m, DL.x + DL.w - 22 - (DL_MARKS.length - 1 - i) * MARK_GAP, DL.y + 26, t));
      // Figma: explore in, versioned release out
      {
        const fa = toScreen(DL.x + 18, DL.y + DL.h - 30);
        const fb = toScreen(DL.x + DL.w - 18, DL.y + DL.h - 30);
        ctx!.strokeStyle = INK(0.1 * t * inkMul);
        ctx!.beginPath(); ctx!.moveTo(fa.x, fa.y); ctx!.lineTo(fb.x, fb.y); ctx!.stroke();
      }
      text("primitive → semantic → component", DL.x + 18, DL.y + DL.h - 15, t, { size: 8.5, alpha: T_FAINT });
    });
  }

  /* the two feeds into the hall. The token release is standing environment:
     it enters at the intake and rides the belt from the head. The context
     bundle is retrieved per run: it docks at the context assembly station,
     rising behind the interpreters rail. */
  function drawFeeds(t: number) {
    withLayer(2, () => {
      route([[DL.x + DL.w, DL.y + 160], [520, DL.y + 160], [520, SPINE.y], [BELT_X0, SPINE.y]], t, { alpha: 0.22, dash: true });
      route([[COMPILE.x + COMPILE.w, COMPILE.y + 27], [540, COMPILE.y + 27], [540, 684], [785, 684], [785, 585]], t, { alpha: 0.22, dash: true });
    });
  }

  /* ── layer 03: the production hall: spine and shelves ── */

  /* The hall's plane draws before the feeds so their ink is not washed by its
     fill; its contents draw after, so the feeds still pass behind the cards. */
  function drawHallPlane(t: number) {
    withLayer(2, () => {
      if (t <= 0.02) return;
      const a = toScreen(HALL.x, HALL.y);
      const b = toScreen(HALL.x + HALL.w, HALL.y + HALL.h);
      ctx!.beginPath();
      ctx!.roundRect(a.x, a.y, b.x - a.x, b.y - a.y, 0);
      ctx!.fillStyle = `rgba(255, 255, 255, ${0.6 * t})`;
      ctx!.fill();
      // the boundary breaks where the engine opens: the mouths are ways in and out
      {
        const gt = toScreen(HALL.x, SPINE.y - MOUTH_H).y;
        const gb = toScreen(HALL.x, SPINE.y + MOUTH_H).y;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, a.y);
        ctx!.moveTo(b.x, a.y); ctx!.lineTo(b.x, gt);
        ctx!.moveTo(b.x, gb); ctx!.lineTo(b.x, b.y);
        ctx!.moveTo(b.x, b.y); ctx!.lineTo(a.x, b.y);
        ctx!.moveTo(a.x, b.y); ctx!.lineTo(a.x, gb);
        ctx!.moveTo(a.x, gt); ctx!.lineTo(a.x, a.y);
      }
      stroke(S_MAIN * t);
      text("Production", HALL.x + 24, HALL.y + 30, t, { size: 12, caps: true, alpha: T_TITLE, weight: "500", track: true });
    });
  }

  function drawHall(t: number, runK: number) {
    withLayer(2, () => {
      if (t <= 0.02) return;

      /* the recipe shelf: every card shows its real assembly */
      card(REC.x, REC.y, REC.w, REC.h, t);
      text("recipes", REC.x + 14, REC.y + 22, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true });
      RECIPE_DEFS.forEach((rc, i) => {
        const ry = REC.y + 40 + i * 50;
        card(REC.x + 14, ry, REC.w - 28, 42, t, { rise: false });
        text(rc.name, REC.x + 26, ry + 21, t, { size: 9.5, alpha: T_TITLE, weight: "500" });
        // slot schematic, right-aligned: component slots → renderer ports
        const right = REC.x + REC.w - 26;
        let px2 = right - rc.ports * 9;
        for (let k = 0; k < rc.ports; k++) {
          const p = toScreen(px2 + k * 9 + 3, ry + 21);
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 2 * p.s, 0, Math.PI * 2);
          ctx!.fillStyle = INK(0.5 * t * inkMul);
          ctx!.fill();
        }
        const arrowX = px2 - 14;
        {
          const p = toScreen(arrowX, ry + 21);
          const q = toScreen(arrowX + 8, ry + 21);
          ctx!.strokeStyle = INK(0.35 * t * inkMul);
          ctx!.beginPath(); ctx!.moveTo(p.x, p.y); ctx!.lineTo(q.x, q.y); ctx!.stroke();
        }
        for (let k = 0; k < rc.slots; k++) {
          const p = toScreen(arrowX - 8 - (rc.slots - k) * 9, ry + 18);
          ctx!.beginPath();
          ctx!.rect(p.x, p.y, 6 * p.s, 6 * p.s);
          ctx!.strokeStyle = INK(0.4 * t * inkMul);
          ctx!.stroke();
        }
      });

      /* the component shelf: labeled parts */
      card(PARTS.x, PARTS.y, PARTS.w, PARTS.h, t);
      text("components", PARTS.x + 14, PARTS.y + 22, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const px = PARTS.x + 20 + c * 76, py = PARTS.y + 38 + r * 84;
        const pa = toScreen(px, py);
        const pb = toScreen(px + 58, py + 36);
        const u = pa.s;
        ctx!.beginPath();
        ctx!.rect(pa.x, pa.y, pb.x - pa.x, pb.y - pa.y);
        stroke(0.24 * t);
        centred((gx2, gy2) => partGlyph(PART_DEFS[idx], gx2, gy2, u, t), pa.x + 29 * u, pa.y + 18 * u);
        text(PART_DEFS[idx], px + 29, py + 46, t, { size: 7.5, caps: true, alpha: 0.4, anchor: "center" as CanvasTextAlign, track: true });
      }

      /* the spine: the workflow, running through everything */
      text("workflow", 636, 562, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true });
      {
        // the belt runs wall to wall at one weight: in through the schema
        // grating, out through the exporters, with every station on it
        const p = toScreen(BELT_X0, SPINE.y);
        const q = toScreen(BELT_X1, SPINE.y);
        ctx!.strokeStyle = INK(0.4 * t * inkMul);
        ctx!.lineWidth = 1;
        ctx!.beginPath(); ctx!.moveTo(p.x, p.y); ctx!.lineTo(q.x, q.y); ctx!.stroke();
      }
      STATIONS.forEach((st) => {
        const p = toScreen(st.x, SPINE.y);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 4.6 * p.s, 0, Math.PI * 2);
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(0.5 * t);
        // a thin inner ring: the station reads as a fitting, not a bullet
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 2.1 * p.s, 0, Math.PI * 2);
        ctx!.strokeStyle = INK(0.34 * t * inkMul);
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
        ctx!.lineWidth = 1;
        // render and context assembly draw later, over knockouts their vertical
        // lines pass behind (the trunk down, the context feed up)
        if (st.name !== "render" && st.name !== "context assembly") text(st.name, st.x, SPINE.y + LABEL_DROP, t, { size: 8, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
      });
      if (willRender(8)) {
        const ka = toScreen(744, 595);
        const kb = toScreen(826, 610);
        ctx!.fillStyle = `rgba(254, 254, 253, ${0.97 * t})`;
        ctx!.fillRect(ka.x, ka.y, kb.x - ka.x, kb.y - ka.y);
        text("context assembly", 785, SPINE.y + LABEL_DROP, t, { size: 8, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
      }
      // interpretation checkpoints: the seams where the run consults the seats
      CHECKPOINTS.forEach((cx3) => {
        const p = toScreen(cx3, SPINE.y);
        const r = 4.1 * p.s;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y - r); ctx!.lineTo(p.x + r, p.y); ctx!.lineTo(p.x, p.y + r); ctx!.lineTo(p.x - r, p.y); ctx!.closePath();
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(0.5 * t);
      });

      /* the pulls: what the workflow reaches into, drawn as standing truth */
      route([[620, 571], [620, REC.y + REC.h]], t, { alpha: 0.18, dash: true, pulse: runK >= 0 ? Math.max(0, Math.min(1, (runK - 0.08) * 8)) : -1 });
      route([[950, 571], [950, 540], [1010, 540], [1010, PARTS.y + PARTS.h]], t, { alpha: 0.18, dash: true, pulse: runK >= 0 ? Math.max(0, Math.min(1, (runK - 0.33) * 8)) : -1 });
      // the manifold: render drives every renderer. The trunk drops straight from
      // the station, passing behind its label's knockout and the interpreters rail.
      route([[950, 599], [950, MANIFOLD_Y]], t, { alpha: 0.18, dash: true });
      if (willRender(8)) {
        const ka = toScreen(929, 595);
        const kb = toScreen(971, 610);
        ctx!.fillStyle = `rgba(254, 254, 253, ${0.97 * t})`;
        ctx!.fillRect(ka.x, ka.y, kb.x - ka.x, kb.y - ka.y);
        text("render", 950, SPINE.y + LABEL_DROP, t, { size: 8, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
      }
      // two arms out to the outer machines, matching elbows, nothing stroked twice
      route([[950, MANIFOLD_Y], [RB.x + 64, MANIFOLD_Y], [RB.x + 64, RB.y]], t, { alpha: 0.18, dash: true });
      route([[950, MANIFOLD_Y], [RB.x + RB.w - 64, MANIFOLD_Y], [RB.x + RB.w - 64, RB.y]], t, { alpha: 0.18, dash: true });
      for (let i = 1; i < 4; i++) {
        route([[RB.x + 64 + i * 143, MANIFOLD_Y], [RB.x + 64 + i * 143, RB.y]], t, { alpha: 0.18, dash: true });
      }

      /* the interpreters rail: the model boundary, tapped at every checkpoint.
         Drawn after the trunk so the trunk reads as passing behind it. */
      const CHECK_PULSE = [0.16, 0.28, 0.53];
      CHECKPOINTS.forEach((cx3, ci) => {
        route([[cx3, 599], [cx3, 628]], t, { alpha: 0.18, dash: true, pulse: runK >= 0 ? Math.max(0, Math.min(1, (runK - CHECK_PULSE[ci]) * 8)) : -1 });
      });
      card(RAIL.x, RAIL.y, RAIL.w, RAIL.h, t, { rise: false });
      const railTitleX = RAIL.x + CARD_PAD;
      const railMid = RAIL.y + RAIL.h / 2;
      text("interpreters", railTitleX, railMid, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true });
      // the seats sit just past the title, measured so they never drift into it
      const seatX0 = railTitleX + capsWidth("interpreters", 9) + 22 + (26 * 0.62) / 2;
      INTERPRETER_SEATS.forEach((seat, mi) => {
        const sx = seatX0 + mi * MARK_GAP;
        if (seat) markTile(seat, sx, railMid, t, 26);
        else {
          // the empty socket matches a seated mark exactly: same box, same hairline
          const r2 = 26 * 0.62 / 2;
          const sa = toScreen(sx - r2, railMid - r2);
          const sb = toScreen(sx + r2, railMid + r2);
          ctx!.beginPath();
          ctx!.rect(sa.x, sa.y, sb.x - sa.x, sb.y - sa.y);
          ctx!.strokeStyle = INK(0.22 * t * inkMul);
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
          ctx!.lineWidth = 1;
          const sd = toScreen(sx, railMid);
          ctx!.beginPath();
          ctx!.arc(sd.x, sd.y, 1.8 * sd.s, 0, Math.PI * 2);
          ctx!.fillStyle = INK(0.35 * t * inkMul);
          ctx!.fill();
        }
      });
      text("drafts headlines, picks quotes, proposes directions", RAIL.x + RAIL.w - CARD_PAD, railMid, t, { size: 8.5, alpha: T_FAINT, anchor: "right" as CanvasTextAlign });

      /* two abstract instruments on the engine line: the schema grating at intake,
         the dispatch chevrons at the exit. Both wake as the run passes through. */
      const knock = (x1: number, y1: number, x2: number, y2: number) => {
        const a2 = toScreen(x1, y1);
        const b2 = toScreen(x2, y2);
        ctx!.fillStyle = `rgba(254, 254, 253, ${0.97 * t})`;
        ctx!.fillRect(a2.x, a2.y, b2.x - a2.x, b2.y - a2.y);
      };
      const inBoost = runK >= 0.1 && runK < 0.24 ? 1 : 0;
      const outBoost = runK >= 0.66 && runK < 0.74 ? 1 : 0;
      /* The engine opens at the intake and closes at the dispatch: two jaws
         funnelling between the hall wall and the belt's true ends, with graded
         ticks across the throat. The belt exists only between them, so the run
         has a mouth and an end rather than passing through decoration. */
      const mouth = (xWide: number, xThroat: number, boost: number) => {
        [-1, 1].forEach((s) => {
          const a2 = toScreen(xWide, SPINE.y + s * MOUTH_H);
          const b2 = toScreen(xThroat, SPINE.y);
          ctx!.strokeStyle = INK((0.42 + 0.24 * boost) * t * inkMul);
          ctx!.lineWidth = 1;
          ctx!.beginPath(); ctx!.moveTo(a2.x, a2.y); ctx!.lineTo(b2.x, b2.y); ctx!.stroke();
        });
      };
      mouth(HALL.x, BELT_X0, inBoost);
      mouth(HALL.x + HALL.w, BELT_X1, outBoost);
      // the two mouths, named at a size that can actually be read
      /* Both mouth plates sit a little higher and narrower than the knockouts
         they replaced: a plate has a border, so it needs real clearance where
         a bare fill needed none. The right edge stays clear of the recipes
         pull at x=620, and the bottom clears the traveler's lane. */
      if (willRender(10.5)) {
        plate(530, 538, 614, 560, t);
        text("input schemas", 572, 549, t, { size: 10.5, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
        plate(1284, 538, 1356, 560, t);
        text("exporters", 1320, 549, t, { size: 10.5, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
      }

      /* the test bench: the full rig under the bank, one passed check per machine */
      RENDERER_DEFS.forEach((rd, i) => {
        route([[RB.x + 64 + i * 143, RB.y + RB.h], [RB.x + 64 + i * 143, BENCH.y - 6]], t, { alpha: 0.18, dash: true });
      });
      card(BENCH.x, BENCH.y, BENCH.w, BENCH.h, t, { rise: false });
      RENDERER_DEFS.forEach((rd, i) => {
        const cx4 = RB.x + 64 + i * 143;
        const p = toScreen(cx4 - 6, BENCH.y - 6);
        const q = toScreen(cx4 + 6, BENCH.y + 6);
        ctx!.beginPath();
        ctx!.rect(p.x, p.y, q.x - p.x, q.y - p.y);
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(0.35 * t);
        const c1 = toScreen(cx4 - 3, BENCH.y + 0.5);
        const c2 = toScreen(cx4 - 1, BENCH.y + 3);
        const c3 = toScreen(cx4 + 3.5, BENCH.y - 2.5);
        ctx!.strokeStyle = INK(0.5 * t * inkMul);
        ctx!.beginPath(); ctx!.moveTo(c1.x, c1.y); ctx!.lineTo(c2.x, c2.y); ctx!.lineTo(c3.x, c3.y); ctx!.stroke();
      });
      text("production tests", BENCH.x + CARD_PAD, BENCH.y + BENCH.h / 2, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true });
      text("re-runs every renderer and flags where the system would now produce something different", BENCH.x + BENCH.w - CARD_PAD, BENCH.y + BENCH.h / 2, t, { size: 8.5, alpha: T_FAINT, anchor: "right" as CanvasTextAlign });

      /* the run token, with its traveler recipe clipped on */
      if (runK >= 0) {
      const tok = Math.max(0, Math.min(1, (runK - 0.12) / 0.62));
      const tokX = SPINE.x0 + EASE(tok) * (SPINE.x1 - SPINE.x0);
      const tp = toScreen(tokX, SPINE.y);
      ctx!.beginPath();
      ctx!.arc(tp.x, tp.y, 3.4 * tp.s, 0, Math.PI * 2);
      ctx!.fillStyle = INK(0.78 * t * inkMul);
      ctx!.fill();
      // the traveler: the chosen recipe rides the run
      const showTraveler = runK > 0.14 ? 1 : 0;
      if (showTraveler > 0 && tok > 0.02) {
        const w2 = 58;
        const p2 = toScreen(tokX - w2 / 2, SPINE.y - 20);
        const q2 = toScreen(tokX + w2 / 2, SPINE.y - 9);
        ctx!.beginPath();
        ctx!.rect(p2.x, p2.y, q2.x - p2.x, q2.y - p2.y);
        ctx!.fillStyle = `rgba(255,255,255,${0.95 * t * showTraveler})`;
        ctx!.fill();
        ctx!.strokeStyle = INK(0.4 * t * inkMul * showTraveler);
        ctx!.stroke();
        text("blog campaign", tokX, SPINE.y - 14.5, t * showTraveler, { size: 6.5, alpha: 0.6, anchor: "center" as CanvasTextAlign });
      }
      // component parts streaming into the jig during the run
      if (runK >= 0.42 && runK < 0.52) {
        const e = EASE((runK - 0.42) / 0.1);
        [[990, 0], [990, 12], [990, -12]].forEach(([lx, off]) => {
          const yy = (PARTS.y + PARTS.h) + e * (552 - (PARTS.y + PARTS.h)) + (off as number);
          const p = toScreen(lx as number, yy);
          ctx!.fillStyle = INK(0.6 * t);
          ctx!.fillRect(p.x - 2.5 * p.s, p.y - 2.5 * p.s, 5 * p.s, 5 * p.s);
        });
      }

      }

      /* the renderer bank: five devices with real IO */
      // the row tag, pinned on the hall boundary beside the first machine
      // clear of the design-language feed at x=520 and the first renderer card at x=600
      // the row tag cuts straight through the hall wall, no card, per his call
      if (willRender(9)) {
        knock(526, 715, 594, 735);
        text("renderers", 588, 725, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true, anchor: "right" as CanvasTextAlign });
      }
      RENDERER_DEFS.forEach((rd, i) => {
        const ux = RB.x + i * 143;
        card(ux, RB.y, 128, RB.h, t, { rise: false });
        text(rd.name, ux + 12, RB.y + 20, t, { size: 10, alpha: T_TITLE, weight: "500" });
        text("renderer", ux + 12, RB.y + 34, t, { size: 8, alpha: T_FAINT });
        rd.marks.forEach((m, mi) => {
          markTile(m, ux + 128 - 16 - (rd.marks.length - 1 - mi) * MARK_GAP, RB.y + 20, t, 26);
        });
        // the device glyph
        const gc = toScreen(ux + 64, RB.y + 78);
        centred((gx2, gy2) => deviceGlyph(i, gx2, gy2, gc.s, t), gc.x, gc.y);
        // output tray + format tag
        const ta = toScreen(ux + 24, RB.y + RB.h - 34);
        const tb = toScreen(ux + 104, RB.y + RB.h - 18);
        ctx!.beginPath();
        ctx!.rect(ta.x, ta.y, tb.x - ta.x, tb.y - ta.y);
        stroke(0.28 * t);
        text(rd.fmt, ux + 64, RB.y + RB.h - 26, t, { size: 7.5, caps: true, alpha: 0.5, anchor: "center" as CanvasTextAlign, track: true });
      });
    });
  }

  /* ── layer 04: the interface ── */
  function drawInterface(t: number) {
    withLayer(3, () => {
      if (t <= 0.02) return;
      // connectors from the hall, one per surface, at each card's centre
      /* the shared trunk once, then a branch per surface: stroking it three
         times composited the dashes darker than every other dotted line */
      route([[BELT_X1, 585], [FAN_X, 585]], t, { alpha: 0.2, dash: true });
      route([[FAN_X, 585], [FAN_X, 305], [WIN.x, 305]], t, { alpha: 0.2, dash: true });
      route([[FAN_X, 585], [FAN_X, 561], [APIS.x, 561]], t, { alpha: 0.2, dash: true });
      route([[FAN_X, 585], [FAN_X, 749], [MCP.x, 749]], t, { alpha: 0.2, dash: true });

      // design os: the window where people run the system
      card(WIN.x, WIN.y, WIN.w, WIN.h, t, { strong: true });
      const hl = toScreen(WIN.x, WIN.y + 30);
      const hr = toScreen(WIN.x + WIN.w, WIN.y + 30);
      ctx!.strokeStyle = INK(0.12 * t * inkMul);
      ctx!.beginPath(); ctx!.moveTo(hl.x, hl.y); ctx!.lineTo(hr.x, hr.y); ctx!.stroke();
      [14, 26, 38].forEach((dx) => {
        const d = toScreen(WIN.x + dx, WIN.y + 15);
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, 2.6 * d.s, 0, Math.PI * 2);
        ctx!.fillStyle = INK(0.18 * t * inkMul);
        ctx!.fill();
      });
      text("design os", WIN.x + 16, WIN.y + 50, t, { size: 10.5, caps: true, alpha: T_TITLE, weight: "500", track: true });
      ["create", "library", "guidelines", "campaigns"].forEach((nm, i) => {
        text(nm, WIN.x + 16, WIN.y + 80 + i * 26, t, { size: 10, alpha: T_BODY });
      });
      const dv = toScreen(WIN.x + 120, WIN.y + 42);
      const dv2 = toScreen(WIN.x + 120, WIN.y + WIN.h - 16);
      ctx!.strokeStyle = INK(0.1 * t * inkMul);
      ctx!.beginPath(); ctx!.moveTo(dv.x, dv.y); ctx!.lineTo(dv2.x, dv2.y); ctx!.stroke();
      /* the create module: six kinds of work, each a small page. Two tiles
         read as a demo; six read as a platform. */
      (["campaign", "document", "social", "deck", "email", "video"] as const).forEach((nm, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const dx = 140 + col * 116, dy = 48 + row * 100;
        const pa = toScreen(WIN.x + dx, WIN.y + dy);
        const pb = toScreen(WIN.x + dx + 104, WIN.y + dy + 88);
        ctx!.beginPath();
        ctx!.roundRect(pa.x, pa.y, pb.x - pa.x, pb.y - pa.y, 0);
        ctx!.fillStyle = INK(0.035 * t * inkMul);
        ctx!.fill();
        stroke(0.14 * t);
        const bx = WIN.x + dx + 8, by = WIN.y + dy + 8;
        const ia = toScreen(bx, by);
        const ib = toScreen(bx + 88, by + 34);
        ctx!.fillStyle = INK(0.05 * t * inkMul);
        ctx!.fillRect(ia.x, ia.y, ib.x - ia.x, ib.y - ia.y);
        [64, 44].forEach((bw, bi) => {
          const ba = toScreen(bx, by + 42 + bi * 9);
          const bb = toScreen(bx + bw, by + 46 + bi * 9);
          ctx!.fillStyle = INK((bi === 0 ? 0.14 : 0.09) * t * inkMul);
          ctx!.fillRect(ba.x, ba.y, bb.x - ba.x, bb.y - ba.y);
        });
        text(nm, WIN.x + dx + 8, WIN.y + dy + 74, t, { size: 8, alpha: T_FAINT });
      });

      /* a small framed terminal: a faint fill, a hairline border, a header
         rule with three dots and a title. The caller fills it with mono lines.
         Gives the live surfaces the density of a running console with no
         motion, which the static blueprint requires. */
      const term = (bx: number, by: number, bw: number, bh: number, title: string) => {
        const a = toScreen(bx, by), b2 = toScreen(bx + bw, by + bh);
        ctx!.fillStyle = INK(0.022 * t * inkMul);
        ctx!.fillRect(a.x, a.y, b2.x - a.x, b2.y - a.y);
        ctx!.strokeStyle = INK(0.14 * t * inkMul); ctx!.lineWidth = 1;
        ctx!.strokeRect(a.x, a.y, b2.x - a.x, b2.y - a.y);
        [0, 1, 2].forEach((i) => {
          const d = toScreen(bx + 11 + i * 7, by + 9);
          ctx!.beginPath(); ctx!.arc(d.x, d.y, 1.5 * d.s, 0, Math.PI * 2);
          ctx!.fillStyle = INK(0.18 * t * inkMul); ctx!.fill();
        });
        text(title, bx + 36, by + 9, t, { size: 6.5, alpha: T_FAINT, mono: true, track: true });
        const hy = toScreen(bx, by + 18);
        ctx!.strokeStyle = INK(0.08 * t * inkMul); ctx!.lineWidth = 1;
        ctx!.beginPath(); ctx!.moveTo(a.x, hy.y); ctx!.lineTo(b2.x, hy.y); ctx!.stroke();
      };
      /* applications: the endpoints as pills, and a live request console */
      card(APIS.x, APIS.y, APIS.w, APIS.h, t, { strong: true });
      text("applications · APIs", APIS.x + 16, APIS.y + 24, t, { size: 10.5, caps: true, alpha: T_TITLE, weight: "500", track: true });
      ["brand API", "search API", "render API", "workflow API"].forEach((nm, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const bx = APIS.x + 18 + col * 112, by = APIS.y + 58 + row * 32;
        const p = toScreen(bx, by);
        const size = 8.5 * p.s;
        ctx!.font = `400 ${size}px 'SF Mono', ui-monospace, Menlo, monospace`;
        const w = ctx!.measureText(nm).width / p.s;
        ctx!.beginPath();
        ctx!.roundRect(p.x, p.y - 9 * p.s, (w + 22) * p.s, 18 * p.s, 0);
        stroke(0.18 * t);
        text(nm, bx + 11, by, t, { size: 8.5, alpha: T_BODY, mono: true });
      });
      {
        const bx = APIS.x + 256, by = APIS.y + 40, bw = APIS.w - 256 - 16, bh = APIS.h - 40 - 14;
        term(bx, by, bw, bh, "requests");
        ([["GET /claims", "200"], ["POST /render", "202"], ["GET /search", "200"]] as const).forEach(([ln, code], i) => {
          const ey = by + 34 + i * 16;
          text(ln, bx + 12, ey, t, { size: 8, alpha: i === 0 ? 0.55 : 0.38, mono: true });
          text(code, bx + bw - 12, ey, t, { size: 8, alpha: T_FAINT, mono: true, anchor: "right" as CanvasTextAlign });
        });
      }

      /* agents: the tree, trust pills at its foot, and a live session console */
      card(MCP.x, MCP.y, MCP.w, MCP.h, t, { strong: true });
      text("agents · MCP", MCP.x + 16, MCP.y + 24, t, { size: 10.5, caps: true, alpha: T_TITLE, weight: "500", track: true });
      ["mcp", "├ resources", "├ tools", "└ prompts"].forEach((ln, i) => {
        text(ln, MCP.x + 20, MCP.y + 50 + i * 20, t, { size: 10, alpha: i === 0 ? 0.7 : T_BODY, mono: true });
      });
      {
        let px2 = MCP.x + 18;
        (["authenticated", "scoped", "recorded"] as const).forEach((nm) => {
          const p = toScreen(px2, MCP.y + 138);
          const size = 8.5 * p.s;
          ctx!.font = `400 ${size}px -apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif`;
          const w = ctx!.measureText(nm).width / p.s;
          ctx!.beginPath();
          ctx!.roundRect(p.x - 6 * p.s, p.y - 9 * p.s, (w + 12) * p.s, 18 * p.s, 0);
          stroke(0.16 * t);
          text(nm, px2, MCP.y + 138, t, { size: 8.5, alpha: T_FAINT });
          px2 += w + 18;
        });
      }
      {
        const bx = MCP.x + 256, by = MCP.y + 40, bw = MCP.w - 256 - 16, bh = MCP.h - 40 - 14;
        term(bx, by, bw, bh, "session");
        (["$ brand.claims.list", "  42 claims · ok", "$ render.preview", "  png · ok"] as const).forEach((ln, i) => {
          const ey = by + 34 + i * 16;
          text(ln, bx + 12, ey, t, { size: 8, alpha: ln.startsWith("$") ? 0.5 : 0.36, mono: true });
        });
      }

      /* the substrate: a titled card like its siblings, its stores worn as
         pills at the same size and treatment as the application endpoints */
      card(PLINTH.x, PLINTH.y, PLINTH.w, PLINTH.h, t, { radius: 3, strong: true });
      text("runtime substrate", PLINTH.x + 18, PLINTH.y + 22, t, { size: 10.5, caps: true, alpha: T_TITLE, weight: "500", track: true });
      {
        let px2 = PLINTH.x + 18;
        (["runtime database", "object storage", "event log"] as const).forEach((nm) => {
          const p = toScreen(px2, PLINTH.y + 50);
          const size = 8.5 * p.s;
          ctx!.font = `400 ${size}px 'SF Mono', ui-monospace, Menlo, monospace`;
          const w = ctx!.measureText(nm).width / p.s;
          ctx!.beginPath();
          ctx!.roundRect(p.x, p.y - 9 * p.s, (w + 22) * p.s, 18 * p.s, 0);
          stroke(0.18 * t);
          text(nm, px2 + 11, PLINTH.y + 50, t, { size: 8.5, alpha: T_BODY, mono: true });
          px2 += w + 32;
        });
      }

    });
  }

  /* ── layer 05: governance ── */
  function drawGov(t: number, runK: number) {
    withLayer(4, () => {
      if (t <= 0.02) return;
      const a = toScreen(GOV.x, GOV.y);
      const b = toScreen(GOV.x + GOV.w, GOV.y + GOV.h);
      // the governed line, a double rule with mitred corners
      ctx!.lineWidth = ruleW();
      [-RULE_GAP, RULE_GAP].forEach((d) => {
        ctx!.beginPath();
        ctx!.rect(a.x + d, a.y + d, b.x - a.x - 2 * d, b.y - a.y - 2 * d);
        ctx!.strokeStyle = INK(S_RULE * t * inkMul);
        ctx!.stroke();
      });
      ctx!.lineWidth = 1;
      chipLabel("governance and validation", GOV.x + 28, GOV.y, t);
      /* Lifecycle strip, set into the top rule. No marker beside each state:
         the word is the mark, and the rule breaking to let it through is what
         mounts it. Which state is current is carried by ink alone. Every
         knockout is measured off the word it has to clear, so the states can
         be set at a readable size without a hardcoded box cropping them. */
      const states = ["draft", "experimental", "approved", "deprecated", "retired"];
      if (willRender(10.5)) {
        let sx = GOV.x + 300;
        states.forEach((nm, i) => {
          const p = toScreen(sx, GOV.y);
          const px = 10.5 * p.s;
          ctx!.font = `400 ${px}px -apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif`;
          const w = ctx!.measureText(nm).width / p.s;
          plate(sx - 9, GOV.y - 10, sx + w + 9, GOV.y + 10, t);
          text(nm, sx, GOV.y, t, { size: 10.5, alpha: i === 2 ? T_BODY : T_FAINT });
          sx += w + 40;
        });
      }
      /* Gates stand wherever work crosses the line. Three on the way out, one
         per surface. Two on the way in: knowledge and tokens only reach
         production once they are approved and released. */
      const gate = (gx: number, gy: number) => {
        const p = toScreen(gx, gy);
        ctx!.strokeStyle = INK(0.5 * t * inkMul);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y - 12 * p.s);
        ctx!.lineTo(p.x, p.y + 12 * p.s);
        ctx!.stroke();
        ctx!.beginPath();
        // never smaller than the channel it has to break, however far out we are
        ctx!.arc(p.x, p.y, Math.max(3.4 * p.s, FIT_MIN), 0, Math.PI * 2);
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(0.5 * t);
      };
      [305, 561, 749, REL_LINE].forEach((gy) => gate(GOV.x + GOV.w, gy));
      [COMPILE.y + 27, DL.y + 160].forEach((gy) => gate(GOV.x, gy));
      /* Everything the governed line has to say is said ON it. This caption
         describes the gates, so it is set into the bottom rule beside them
         rather than left floating in the margin, alongside the approval seat
         and the exceptions register. */
      chipLabel("gates at every crossing · fail closed", GOV.x + 40, GOV.y + GOV.h, t);
      chipLabel("human approval", GOV.x + 470, GOV.y + GOV.h, t);
      chipLabel("exceptions, documented", GOV.x + 640, GOV.y + GOV.h, t);
      /* Governance signs the release through a gate of its own: a straight
         reach from the boundary into the register beside it. */
      route([[GOV.x + GOV.w, REL_LINE], [SHELF.x, REL_LINE]], t, { alpha: S_RULE, double: true, trimStart: RULE_GAP });
      /* A signed release is a set of finished files, and the files live in
         object storage on the substrate directly above: one short drop from
         storage into the register that freezes them. */
      route([[1600, PLINTH.y + PLINTH.h], [1600, SHELF.y]], t, { alpha: S_RULE, double: true });
      // signed, then announced: the chain continues left along its own line
      route([[SHELF.x + SHELF.w, REL_LINE], [NOTES.x, REL_LINE]], t, { alpha: S_RULE, double: true });
      /* The notes card sits on the same line, drawn by governance because a
         release is what triggers an announcement. The feedback loop is
         observability's and is drawn there, on its own line, at its own light. */
      card(NOTES.x, NOTES.y, NOTES.w, NOTES.h, t);
      text("release notes", NOTES.x + 16, NOTES.y + 22, t, { size: 9.5, alpha: T_TITLE, weight: "500" });
      text("every change announced to the people who use it", NOTES.x + 16, NOTES.y + 42, t, { size: 8.5, alpha: T_FAINT, maxW: NOTES.w - 32 });
      // top right, the same corner every other card hangs its connectors in
      NOTE_MARKS.forEach((m, i) => markTile(m, NOTES.x + NOTES.w - 22 - (NOTE_MARKS.length - 1 - i) * MARK_GAP, NOTES.y + 24, t));
      card(SHELF.x, SHELF.y, SHELF.w, SHELF.h, t);
      /* A register, not a row of blank tiles. Four anonymous thumbnails said
         nothing about what a signed release is; a dated line carrying the hash
         it was sealed with, and the count of files that hash covers, says the
         whole thing: this exact set of files, frozen, and provably unchanged.
         Approved work is never regenerated, so the hash is what makes a
         release a thing rather than a recipe for making one again. */
      text("signed releases", SHELF.x + 16, SHELF.y + 22, t, { size: 9.5, alpha: T_TITLE, weight: "500" });
      text("approved files frozen and hashed, never regenerated", SHELF.x + 16, SHELF.y + 40, t, { size: 8, alpha: T_FAINT, maxW: SHELF.w - 32 });
      /* The rule under the heading and the seal beside the entry are drawn ink,
         not text, so they survive a zoom the entry itself does not. Guarded
         together: a register with a divider and a seal but no line in it reads
         as a card that failed, which is the same failure as a knockout with no
         word in it. */
      if (willRender(8)) {
        const ry = SHELF.y + 54;
        const rl = toScreen(SHELF.x + 16, ry);
        const rr = toScreen(SHELF.x + SHELF.w - 16, ry);
        ctx!.strokeStyle = INK(0.14 * t * inkMul);
        ctx!.lineWidth = 1;
        ctx!.beginPath(); ctx!.moveTo(rl.x, rl.y); ctx!.lineTo(rr.x, rr.y); ctx!.stroke();

        const ry2 = SHELF.y + 72;
        text("2026-07-14", SHELF.x + 16, ry2, t, { size: 8, alpha: T_BODY, mono: true });
        text("8f3a91", SHELF.x + 84, ry2, t, { size: 8, alpha: 0.5, mono: true });
        text("42 files", SHELF.x + SHELF.w - 16, ry2, t, { size: 8, alpha: T_FAINT, anchor: "right" as CanvasTextAlign });
        // the seal on the release currently in force
        const p = toScreen(SHELF.x + 138, ry2);
        ctx!.strokeStyle = INK(0.62 * t * inkMul);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(p.x - 3 * p.s, p.y); ctx!.lineTo(p.x - 1 * p.s, p.y + 2.4 * p.s); ctx!.lineTo(p.x + 3.4 * p.s, p.y - 2.8 * p.s);
        ctx!.stroke();
      }
      // the one rust moment: during the run, validate blocks then clears
      if (runK >= 0.52 && runK < 0.68) {
        const sx = 1032.5;
        const p = toScreen(sx, 549);
        ctx!.strokeStyle = RUST(0.85);
        ctx!.beginPath();
        ctx!.moveTo(p.x - 4 * p.s, p.y - 4 * p.s); ctx!.lineTo(p.x + 4 * p.s, p.y + 4 * p.s);
        ctx!.moveTo(p.x + 4 * p.s, p.y - 4 * p.s); ctx!.lineTo(p.x - 4 * p.s, p.y + 4 * p.s);
        ctx!.stroke();
        text("claim unverified · revised", sx + 12, 549, 1, { size: 8.5, rust: true });
      }
    });
  }

  /* ── layer 06: observability ── */
  function drawObs(t: number) {
    withLayer(5, () => {
      if (t <= 0.02) return;
      /* One line throughout, in the same double rule the governed line takes:
         the bus, its return artery and both of its connections are a single
         system. The run in from the substrate and the run along the bus are one
         path, so the corner mitres instead of butting two doubled ends together.
         It ends in the feedback loop: the line arrives at the people who read
         it rather than running past them. */
      route([[PLINTH.x, PLINTH.y + PLINTH.h / 2], [BUS_X1, PLINTH.y + PLINTH.h / 2], [BUS_X1, BUS_Y], [REVIEW.x, BUS_Y]], t, { alpha: S_RULE, double: true });
      text("usage recorded", BUS_X1 - 10, 1046, t, { size: 9.5, alpha: 0.55, anchor: "right" as CanvasTextAlign });
      // evidence riser into the hall, in the clear stretch past the shelf,
      // stopping on the bus's near rail so the tee reads clean
      route([[RISER_X, BUS_Y], [RISER_X, HALL.y + HALL.h]], t, { alpha: S_RULE, double: true, trimStart: RULE_GAP });
      /* Ticks traveling backward along the bus: TABLED with the rest of the
         run motion until the full animation is built. RUN_MOTION is the one
         switch; see ANIMATION-HANDOFF.md. Drawn before the meters so a
         passing tick submerges behind a fitting rather than sitting as
         debris inside its break. */
      if (RUN_MOTION) {
        for (let i = 0; i < 5; i++) {
          const u = ((idleClock * 0.14 + i / 5) % 1);
          const tx = BUS_X1 - u * (BUS_X1 - REVIEW.x);
          const p = toScreen(tx, BUS_Y);
          ctx!.fillStyle = INK(0.5 * t * inkMul);
          // the tick fills the channel, a slug traveling between the two rules
          ctx!.fillRect(p.x - 2.5 * p.s, p.y - RULE_GAP, 5 * p.s, RULE_GAP * 2);
        }
      }
      // meters along the bus
      METERS.forEach((nm, i) => {
        // an even run between the shelf and the interface the bus collects from
        const mx2 = 420 + i * (1000 / 6);
        const p = toScreen(mx2, BUS_Y);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, Math.max(5 * p.s, FIT_MIN), 0, Math.PI * 2);
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(S_MAIN * t);
        text(nm, mx2, BUS_Y + 21, t, { size: 9.5, alpha: 0.55, anchor: "center" as CanvasTextAlign });
      });
      /* The card the bus terminates in, and the only one on the row that
         belongs to this layer. The one line that leaves it carries findings,
         never announcements: if a token keeps getting overridden the design
         language is wrong, and that is what has to travel back. */
      card(SEAT.x, SEAT.y, SEAT.w, SEAT.h, t);
      text("feedback loop", SEAT.x + 16, SEAT.y + 24, t, { size: 9.5, alpha: T_TITLE, weight: "500" });
      text("signals become decisions, not dashboards", SEAT.x + 16, SEAT.y + 44, t, { size: 8.5, alpha: T_FAINT, maxW: SEAT.w - 32 });
      route([[SEAT.x + 70, SEAT.y], [SEAT.x + 70, 1010], [80, 1010], [80, 400], [BI.x, 400]], t, { alpha: S_RULE, double: true });
      route([[80, DL.y + 160], [DL.x, DL.y + 160]], t, { alpha: S_RULE, double: true, trimStart: RULE_GAP });
      /* ── the junction audit: no two double rules ever simply cross ──
         Crossings get crossJoint (both channels open into each other); tees
         get teeJoint (the trunk's near rail opens between the branch's
         rails). Square miters, one grammar for every junction. */
      const bothLit = Math.max(layerLight[4], layerLight[5]);
      // the riser through the governed line's bottom rule
      crossJoint(RISER_X, GOV.y + GOV.h, t, bothLit);
      // the signing tie through the substrate feed's vertical
      crossJoint(BUS_X1, REL_LINE, t, bothLit);
      // the riser tees onto the bus
      teeJoint(RISER_X, BUS_Y, "up", t);
      // the design-language tap tees onto the return artery
      teeJoint(80, DL.y + 160, "right", t);
    });
  }

  /* ── the run and its outputs ──
     TABLED. Never called; kept as the reference choreography for the future
     full-run animation. See ANIMATION-HANDOFF.md before deleting or reviving.
     eslint-disable-next-line @typescript-eslint/no-unused-vars */
  function drawRun(t: number, k: number) {
    if (t <= 0.02) return;
    // the brief arrives from the window to the lane
    const brief = Math.max(0, Math.min(1, k * 4));
    if (k < 0.3) {
      const e = EASE(brief);
      const bx2 = WIN.x + 60 - e * (WIN.x + 60 - SPINE.x0);
      const by2 = WIN.y + 340 - e * (WIN.y + 340 - SPINE.y);
      const p = toScreen(bx2, by2);
      ctx!.beginPath();
      ctx!.roundRect(p.x - 14 * p.s, p.y - 9 * p.s, 28 * p.s, 18 * p.s, 0);
      ctx!.fillStyle = `rgba(255,255,255,${0.95 * t})`;
      ctx!.fill();
      ctx!.strokeStyle = INK(0.45 * t);
      ctx!.stroke();
      text("brief", bx2, by2, t, { size: 7.5, alpha: 0.6, anchor: "center" as CanvasTextAlign });
    }
    // feeds pulse
    withLayer(1, () => route([[DL.x + DL.w, DL.y + 160], [520, DL.y + 160], [520, SPINE.y], [BELT_X0, SPINE.y]], t, { alpha: 0.22, pulse: Math.max(0, Math.min(1, (k - 0.08) * 3)), dash: true }));
    withLayer(0, () => route([[COMPILE.x + COMPILE.w, COMPILE.y + 27], [540, COMPILE.y + 27], [540, 684], [748, 684]], t, { alpha: 0.22, pulse: Math.max(0, Math.min(1, (k - 0.2) * 3)), dash: true }));
    // delivery + outputs
    const del = Math.max(0, Math.min(1, (k - 0.68) * 4));
    if (del > 0) {
      withLayer(3, () => route([[BELT_X1, 585], [FAN_X, 585], [FAN_X, 320], [WIN.x, 320]], 1, { alpha: 0.2, pulse: del, dash: true }));
    }
    const outT = t * EASE(Math.max(0, Math.min(1, (k - 0.8) * 5)));
    if (outT > 0.02) {
      withLayer(3, () => {
        card(OUTPUTS.x, OUTPUTS.y, OUTPUTS.w, OUTPUTS.h, outT);
        OUTPUT_NAMES.forEach((nm, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const ox = OUTPUTS.x + 14 + col * 160, oy = OUTPUTS.y + 12 + row * 34;
          const p = toScreen(ox, oy);
          const q = toScreen(ox + 150, oy + 28);
          ctx!.beginPath();
          ctx!.roundRect(p.x, p.y, q.x - p.x, q.y - p.y, 0);
          stroke(0.2 * outT);
          text(nm, ox + 8, oy + 14, outT, { size: 8, alpha: T_BODY, maxW: 136 });
        });
      });
    }
  }

  function drawGrid(t: number) {
    if (t <= 0.03) return;
    const p0 = toScreen(0, 0);
    if (p0.s < 0.25) return;
    ctx!.fillStyle = INK(0.045 * t);
    for (let gx = 80; gx <= 2000; gx += 40) {
      for (let gy = 80; gy <= 1150; gy += 40) {
        const p = toScreen(gx, gy);
        if (p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) continue;
        ctx!.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);
      }
    }
  }

  /* ── frame ── */

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (applyResize()) dirty = true;   // must precede the draw: it clears the bitmap
    /* On the finale the inset is zero the moment the stage is chosen, not
       when the DOM gets around to collapsing: one target step, taken from
       rest, S-curved. The panel fades out over the drawing as it grows into
       the space, which is the crossfade the overlay architecture buys. */
    const wasInset = inset;
    inset = active === BEATS - 1 ? 0 : panelW;
    if (inset !== wasInset) dirty = true;

    /* A chase that lands. The exponential approach never actually arrives,
       which reads as sub-pixel alpha and position drift long after a
       transition looks finished; snapping inside a hair's width makes every
       settled frame byte-identical to the last. */
    const chase = 1 - Math.pow(0.0018, dt);
    /* Every current snaps onto its target inside a hair's width, so once a
       stage has landed nothing in the scene changes and the frame can be
       skipped outright: the bitmap already holds the picture. Any current
       that moves marks the scene dirty. (Reviving the run motion means
       marking dirty on the clock too; see ANIMATION-HANDOFF.md.) */
    const glide = (cur: number, target: number, eps: number) => {
      const next = cur + (target - cur) * chase;
      const out = Math.abs(next - target) < eps ? target : next;
      if (out !== cur) dirty = true;
      return out;
    };
    for (let b = 0; b < BEATS; b++) {
      /* one persistent system: everything is always drawn, and the currents
         only carry the load-in fade. The stages are a camera and a spotlight
         moving around a system that is already whole. */
      reveal[b] = glide(reveal[b], 1, 0.001);
      focus[b] = glide(focus[b], active === b ? 1 : 0, 0.001);
    }

    /* the spotlight: stages 1..6 select layers 0..5 */
    const sel = active >= 1 && active <= 6 ? active - 1 : null;
    for (let i = 0; i < LAYER_COUNT; i++) {
      layerLight[i] = glide(layerLight[i], sel === null ? 1 : (sel === i ? 1 : DIM), 0.001);
    }

    /* The camera is DOUBLE-smoothed (target glides into camT, camera glides
       toward camT), so any step becomes an S-curve, eased both ways. And it
       interpolates in VISIBLE-WIDTH space, not zoom: lerping zoom directly
       makes a combined pan-and-zoom read as a collapse that then re-expands,
       because screen paths under a zoom lerp are not monotonic. Gliding the
       viewport's world-width keeps every landmark on a single continuous
       path. On the first sized frame the camera snaps to its fit: the page
       loads composed, with no entrance sweep. */
    const f = fitView(VIEWS[active]);
    if (!booted && W > 0) {
      booted = true;
      dirty = true;
      cam.zoom = camT.zoom = f.zoom;
      cam.cx = camT.cx = f.cx;
      cam.cy = camT.cy = f.cy;
    }
    const chaseT = 1 - Math.pow(0.0006, dt);
    const glideT = (cur: number, target: number, eps: number) => {
      const next = cur + (target - cur) * chaseT;
      const out = Math.abs(next - target) < eps ? target : next;
      if (out !== cur) dirty = true;
      return out;
    };
    const wOf = (z: number) => 1 / Math.max(0.0001, z);
    camT.zoom = 1 / glideT(wOf(camT.zoom), wOf(f.zoom), 0.0001);
    camT.cx = glideT(camT.cx, f.cx, 0.05);
    camT.cy = glideT(camT.cy, f.cy, 0.05);
    cam.zoom = 1 / glide(wOf(cam.zoom), wOf(camT.zoom), 0.0001);
    cam.cx = glide(cam.cx, camT.cx, 0.05);
    cam.cy = glide(cam.cy, camT.cy, 0.05);

    /* a read-only window for the verification tooling: the live camera and
       region, so probes derive world-to-device mapping instead of mirroring it */
    (window as unknown as Record<string, unknown>).__ds = {
      W, H, dpr, active, inset,
      s: Math.min(W / 2060, H / 1210) * cam.zoom,
      cam: { zoom: cam.zoom, cx: cam.cx, cy: cam.cy },
      target: f,
      view: VIEWS[active],
      settled: Math.abs(cam.zoom - f.zoom) < 0.002 && Math.abs(cam.cx - f.cx) < 0.5 && Math.abs(cam.cy - f.cy) < 0.5,
    };

    /* The run choreography is tabled and lives behind runK = -1; the finale
       is a static blueprint (its idle draws gate on `active` at their sites).
       See ANIMATION-HANDOFF.md. */
    idleClock += dt * 0.08;
    const runK = -1;

    /* nothing moved: the last draw is still on screen and still correct */
    if (!dirty) {
      if (running) raf = requestAnimationFrame(frame);
      return;
    }
    dirty = false;

    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = PAPER;
    ctx!.fillRect(0, 0, W, H);

    drawGrid(Math.min(reveal[1] * 2, 1) * 0.9);
    if (reveal[5] > 0.01) drawGov(reveal[5], runK);
    if (reveal[3] > 0.01) drawHallPlane(reveal[3]);
    if (reveal[3] > 0.01) drawFeeds(reveal[3]);
    drawBI(reveal[1]);
    drawDL(reveal[2]);
    drawFrags();
    if (reveal[3] > 0.01) drawHall(reveal[3], runK);
    if (reveal[4] > 0.01) drawInterface(reveal[4]);
    if (reveal[6] > 0.01) drawObs(reveal[6]);

    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? start() : stop();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  const onResize = () => { needsResize = true; };
  window.addEventListener("resize", onResize);
  /* the canvas region changes size without the window doing so when the panel
     column collapses on the final stage; observe the element, not the window.
     The panel rides the same observer: a layout read inside the callback is
     already post-layout, so the width costs nothing there. */
  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      if (e.target === panel) panelW = (e.target as HTMLElement).clientWidth;
      else needsResize = true;
    }
  });
  ro.observe(canvas);
  if (panel) ro.observe(panel);

  start();

  return {
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    },
    setStage(i: number) {
      active = Math.max(0, Math.min(BEATS - 1, i));
      dirty = true;
    },
  };
}
