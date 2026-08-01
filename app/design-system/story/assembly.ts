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
const BEATS = 9; // 0 scatter · 1-6 layers · 7 the run · 8 the whole
const INK = (o: number) => `rgba(20, 18, 16, ${o})`;
const PAPER = "#FEFEFD";
const RUST = (o: number) => `rgba(156, 63, 33, ${o})`;
const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

const S_MAIN = 0.52, S_MID = 0.3, S_SOFT = 0.16;
const T_TITLE = 0.85, T_BODY = 0.6, T_FAINT = 0.42;
const DIM = 0.38; // spotlight: everything not selected drops to this

/* ── layout: 2000 x 1150 world ── */

const FRAMES: Camera[] = [
  { zoom: 0.8, cx: 1080, cy: 560 },    // 0 the scattered field
  { zoom: 1.3, cx: 560, cy: 430 },     // 1 brand intelligence
  { zoom: 1.3, cx: 560, cy: 810 },     // 2 design language
  { zoom: 0.88, cx: 1010, cy: 590 },   // 3 production
  { zoom: 0.9, cx: 1560, cy: 570 },    // 4 interface
  { zoom: 0.79, cx: 950, cy: 575 },    // 5 governance
  { zoom: 0.85, cx: 900, cy: 860 },    // 6 observability
  { zoom: 0.7, cx: 1150, cy: 610 },    // 7 the run
  { zoom: 0.66, cx: 1030, cy: 600 },   // 8 the whole system
];

const BI = { x: 120, y: 174, w: 340, h: 340 };
const COMPILE = { x: 120, y: 540, w: 340, h: 54 };
const DL = { x: 120, y: 624, w: 340, h: 340 };
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
const WIN = { x: 1440, y: 160, w: 500, h: 300 };
const APIS = { x: 1440, y: 500, w: 500, h: 160 };
const MCP = { x: 1440, y: 700, w: 500, h: 190 };
const PLINTH = { x: 1440, y: 930, w: 500, h: 60 };
const OUTPUTS = { x: 1440, y: 1030, w: 500, h: 88 };
const GOV = { x: 544, y: 128, w: 876, h: 902 };
// where the dispatch fans out to the three surfaces, inside the governed line
const FAN_X = 1385;
const BUS_Y = 1100;
const REVIEW = { x: 330, y: BUS_Y };

const RECIPE_NAMES = ["blog campaign", "branded document", "slide deck", "event campaign", "newsletter"];
// seats on the model boundary: a mark name, or null for an open seat
const INTERPRETER_SEATS: Array<string | null> = ["anthropic", "openai"];
// marks sit as a tight set, not a spread row
const MARK_GAP = 21;
// where the two knowledge layers are authored, in reading order left to right
const BI_MARKS = ["notion", "drive"];
const DL_MARKS = ["figma", "paper"];
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

export function mountAssembly(opts: {
  wrap: HTMLDivElement;
  canvas: HTMLCanvasElement;
  captions: HTMLElement[];
  titleBlock: HTMLElement | null;
}) {
  const { wrap, canvas, captions, titleBlock } = opts;
  let ctx = canvas.getContext("2d");
  if (!ctx) return { destroy: () => {}, setLayer: (_: number | null) => {} };

  let W = 0, H = 0, dpr = 1;
  let raf = 0, running = false, last = 0;

  const reveal = new Array(BEATS).fill(0);
  const focus = new Array(BEATS).fill(0);
  const layerLight = new Array(LAYER_COUNT).fill(1); // spotlight currents
  const cam = { ...FRAMES[0] };
  let active = 0;
  let runClock = 0;
  let idleClock = 0;
  let explorerLayer: number | null = null;

  const iconPaths = new Map<string, Path2D>();
  for (const [k, d] of Object.entries(ICONS)) iconPaths.set(k, new Path2D(d));

  /* connector favicons: real product marks, drawn as uniform tiles in the
     top-right corner of the card each tool connects to */
  const MARK_NAMES = ["anthropic", "openai", "figma", "paper", "drive", "notion", "krea", "recraft", "gamma", "higgsfield"];
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

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }

  function toScreen(wx: number, wy: number) {
    const base = Math.min(W / 2060, H / 1210);
    const s = base * cam.zoom;
    return { x: W * 0.5 + (wx - cam.cx) * s, y: H * 0.52 + (wy - cam.cy) * s, s };
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
    if (size < 4) return;
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

  /* width of a tracked caps label in world units, so elements can sit beside
     text without hardcoding font metrics */
  /* Detail vocabulary shared by the small glyphs: every mark is placed in the
     glyph's own units so a part reads as the thing it is, not as an outline. */
  function glyphPen(cx2: number, cy2: number, u: number, t: number) {
    const A = (a: number) => INK(a * t * inkMul);
    const P = (x: number, y: number) => ({ x: cx2 + x * u, y: cy2 + y * u });
    return {
      L(x1: number, y1: number, x2: number, y2: number, a: number) {
        const p1 = P(x1, y1), p2 = P(x2, y2);
        ctx!.strokeStyle = A(a); ctx!.lineWidth = glyphLWF;
        ctx!.beginPath(); ctx!.moveTo(p1.x, p1.y); ctx!.lineTo(p2.x, p2.y); ctx!.stroke();
      },
      poly(pts: Array<[number, number]>, a: number) {
        ctx!.strokeStyle = A(a); ctx!.lineWidth = glyphLWF;
        ctx!.beginPath();
        pts.forEach(([x, y], i) => { const q = P(x, y); i ? ctx!.lineTo(q.x, q.y) : ctx!.moveTo(q.x, q.y); });
        ctx!.stroke();
      },
      R(x: number, y: number, w: number, h: number, a: number) {
        const q = P(x, y);
        ctx!.strokeStyle = A(a); ctx!.lineWidth = glyphLWF;
        ctx!.beginPath(); ctx!.rect(q.x, q.y, w * u, h * u); ctx!.stroke();
      },
      F(x: number, y: number, w: number, h: number, a: number) {
        const q = P(x, y);
        ctx!.fillStyle = A(a); ctx!.fillRect(q.x, q.y, w * u, h * u);
      },
      C(x: number, y: number, r: number, a: number, fill = false) {
        const q = P(x, y);
        ctx!.beginPath(); ctx!.arc(q.x, q.y, r * u, 0, Math.PI * 2);
        if (fill) { ctx!.fillStyle = A(a); ctx!.fill(); }
        else { ctx!.strokeStyle = A(a); ctx!.lineWidth = glyphLWF; ctx!.stroke(); }
      },
    };
  }

  /* A component in the rack, drawn as the artifact part it is. Cell is 58x36
     world units; the glyph works in a 48x28 box around its centre. */
  function partGlyph(kind: string, cx2: number, cy2: number, u: number, t: number) {
    const g = glyphPen(cx2, cy2, u, t);
    switch (kind) {
      case "headline":
        g.L(-21, -12, -21, 11, 0.14);
        g.F(-18, -9, 33, 6, 0.5); g.F(-18, -1, 21, 6, 0.5);
        g.L(-18, 8, 17, 8, 0.18);
        g.L(-23, -9, -21, -9, 0.3); g.L(-23, 5, -21, 5, 0.3);
        break;
      case "body":
        g.L(-22, -11, -22, 11, 0.14);
        [0, 1, 2, 3, 4].forEach((i) => g.L(-18, -9 + i * 4.6, [16, 19, 14, 18, 2][i], -9 + i * 4.6, 0.34));
        break;
      case "quote":
        g.F(-19, -10, 3.4, 5, 0.5); g.F(-14, -10, 3.4, 5, 0.5);
        g.L(-19, -4.6, -17.9, -2.4, 0.5); g.L(-14, -4.6, -12.9, -2.4, 0.5);
        [0, 1, 2].forEach((i) => g.L(-19, 0 + i * 5, [17, 13, 8][i], 0 + i * 5, 0.36));
        break;
      case "credit":
        g.L(-9, -8, 9, -8, 0.3);
        g.F(-9, -4, 18, 3.4, 0.48);
        g.F(-9, 3, 11, 2.4, 0.26);
        g.L(-13, -4, -11, -4, 0.34);
        break;
      case "lockup":
        g.F(-18, -5, 10, 10, 0.5);
        g.F(-4, -4.5, 19, 4, 0.46); g.F(-4, 2, 12, 2.4, 0.26);
        [[-22, -10], [22, -10], [-22, 10], [22, 10]].forEach(([x, y]) => {
          g.L(x, y, x + (x < 0 ? 3 : -3), y, 0.2); g.L(x, y, x, y + (y < 0 ? 3 : -3), 0.2);
        });
        break;
      case "image":
        g.R(-19, -12, 38, 24, 0.4);
        g.poly([[-19, 5], [-9, -4], [-1, 3], [8, -7], [19, 4]], 0.36);
        g.L(-19, 5, 19, 5, 0.28);
        g.C(11, -7, 3, 0.4);
        [[-19, -12, 1], [19, -12, -1], [-19, 12, 1], [19, 12, -1]].forEach(([x, y, d]) => g.L(x, y, x + 4 * (d as number), y, 0.26));
        g.L(-8, -3, -4, -3, 0.44); g.L(-6, -5, -6, -1, 0.44);
        break;
      case "ground":
        g.R(-19, -12, 38, 24, 0.28);
        for (let i = 0; i < 9; i++) g.L(-19 + i * 4.6, 12, -19 + i * 4.6 + 9, -12, 0.06 + i * 0.028);
        for (let i = 0; i < 5; i++) g.C(-13 + i * 6.5, -6 + (i % 2) * 9, 0.9, 0.34, true);
        break;
      case "palette":
        [0.1, 0.22, 0.36, 0.5, 0.64].forEach((a, i) => g.F(-19 + i * 7.7, -10, 6.6, 13, a));
        g.R(-20.4, -11.4, 9.4, 15.8, 0.5);
        [0, 1, 2, 3, 4].forEach((i) => g.L(-15.7 + i * 7.7, 6, -15.7 + i * 7.7, 9, 0.3));
        g.L(-19, 10.5, 19, 10.5, 0.16);
        break;
      case "figure":
        g.L(-18, -12, -18, 10, 0.3); g.L(-18, 10, 19, 10, 0.3);
        g.L(-18, 1, 19, 1, 0.1); g.L(-18, -7, 19, -7, 0.1);
        [[-13, 6], [-5, 12], [3, 8], [11, 17]].forEach(([x, h]) => g.F(x, 10 - h, 6, h, 0.34));
        g.poly([[-10, 1], [-2, -3], [6, -1], [14, -9]], 0.5);
        g.C(14, -9, 1.6, 0.6, true);
        break;
      case "list":
        [0, 1, 2].forEach((i) => {
          const y = -8 + i * 8, ind = i === 1 ? 6 : 0;
          if (i === 1) g.L(-16 + ind, y, -13 + ind, y, 0.44);
          else g.F(-18 + ind, y - 1.6, 3.2, 3.2, 0.46);
          g.L(-12 + ind, y, [14, 16, 10][i], y, 0.34);
        });
        break;
      case "chip":
        g.R(-21, -7, 42, 14, 0.42);
        g.F(-16, -1.7, 20, 3.4, 0.32);
        g.L(8, 0, 16, 0, 0.5); g.L(13, -3, 16, 0, 0.5); g.L(13, 3, 16, 0, 0.5);
        break;
      default: // seal
        g.C(0, 0, 11.5, 0.4); g.C(0, 0, 8.5, 0.2);
        g.poly([[-4, 0], [-1.2, 3.2], [4.4, -3.4]], 0.55);
        for (let i = 0; i < 12; i++) {
          const a2 = (i / 12) * Math.PI * 2;
          g.L(Math.cos(a2) * 11.5, Math.sin(a2) * 11.5, Math.cos(a2) * 13.6, Math.sin(a2) * 13.6, 0.24);
        }
        break;
    }
  }

  /* A renderer's device, drawn as the thing that makes that file. */
  function deviceGlyph(i: number, cx2: number, cy2: number, u: number, t: number) {
    const g = glyphPen(cx2, cy2, u, t);
    if (i === 0) { // web: a browser window with a real page in it
      g.R(-24, -17, 48, 34, 0.42);
      g.L(-24, -9, 24, -9, 0.34);
      [0, 1, 2].forEach((d) => g.C(-20 + d * 3.4, -13, 1.1, 0.34, true));
      g.R(-11, -15, 26, 4, 0.18);
      g.F(-20, -5, 29, 8, 0.28);
      g.L(-20, 6, 4, 6, 0.3); g.L(-20, 10, 12, 10, 0.3); g.L(-20, 14, 0, 14, 0.3);
      g.F(20, -6, 2.4, 12, 0.2);
    } else if (i === 1) { // image: a framed photograph with crop marks
      g.R(-24, -15, 48, 30, 0.42);
      g.poly([[-24, 6], [-12, -5], [-2, 4], [9, -8], [24, 5]], 0.36);
      g.L(-24, 6, 24, 6, 0.26);
      g.C(14, -7, 3.6, 0.4);
      [[-24, -15, 1], [24, -15, -1], [-24, 15, 1], [24, 15, -1]].forEach(([x, y, d]) => g.L(x, y, x + 5 * (d as number), y, 0.26));
      g.L(-10, -2, -5, -2, 0.44); g.L(-7.5, -4.5, -7.5, 0.5, 0.44);
    } else if (i === 2) { // document: a page with a turned corner
      g.poly([[-16, -18], [8, -18], [16, -10], [16, 18], [-16, 18], [-16, -18]], 0.42);
      g.poly([[8, -18], [8, -10], [16, -10]], 0.3);
      g.F(-11, -13, 15, 3.6, 0.46);
      [0, 1, 2].forEach((d) => g.L(-11, -6 + d * 4, [11, 9, 11][d], -6 + d * 4, 0.3));
      g.L(-11, 8, -11, 14, 0.34);
      g.L(-8, 9, 6, 9, 0.28); g.L(-8, 13, 2, 13, 0.28);
      g.C(11, 15, 1.2, 0.3, true);
    } else if (i === 3) { // deck: a slide, and the deck it belongs to
      g.R(-24, -16, 48, 27, 0.42);
      g.F(-19, -11, 20, 3.6, 0.46);
      g.L(-19, -4, -3, -4, 0.3); g.L(-19, 0, -6, 0, 0.3); g.L(-19, 4, -9, 4, 0.3);
      g.R(3, -5, 17, 12, 0.28);
      g.poly([[3, 7], [8, 1], [12, 4], [16, -1], [20, 7]], 0.3);
      [0, 1, 2].forEach((d) => g.R(-18 + d * 13, 14, 11, 5, d === 0 ? 0.4 : 0.2));
    } else { // video: a frame and its timeline
      g.R(-24, -17, 48, 26, 0.42);
      g.poly([[-5, -10], [7, -4], [-5, 2], [-5, -10]], 0.5);
      g.C(0, -4, 11, 0.16);
      g.L(-24, 14, 24, 14, 0.3);
      for (let d = 0; d < 9; d++) g.L(-24 + d * 6, 12, -24 + d * 6, 16, 0.18);
      g.C(-8, 14, 2.4, 0.55, true);
      g.F(-24, 13.4, 16, 1.2, 0.4);
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

  /* dash: the line belongs to another layer and is only crossing into this one.
     Dashed routes fade in rather than draw on, since the dash pattern is the
     line's identity and animating the offset would set the dots marching. */
  function route(pts: Array<[number, number]>, t: number, o?: { alpha?: number; pulse?: number; dash?: boolean }) {
    const tt = t * inkMul;
    if (tt <= 0.02 || pts.length < 2) return;
    const sp = pts.map(([x, y]) => toScreen(x, y));
    const r = 8 * sp[0].s;
    const p = new Path2D();
    p.moveTo(sp[0].x, sp[0].y);
    for (let i = 1; i < sp.length - 1; i++) p.arcTo(sp[i].x, sp[i].y, sp[i + 1].x, sp[i + 1].y, r);
    p.lineTo(sp[sp.length - 1].x, sp[sp.length - 1].y);
    let len = 0;
    for (let i = 1; i < sp.length; i++) len += Math.hypot(sp[i].x - sp[i - 1].x, sp[i].y - sp[i - 1].y);
    if (o?.dash) {
      // one uniform ink for the whole dotted class; alpha is ignored here
      ctx!.strokeStyle = INK(DASH_INK * Math.min(1, tt * 1.4) * EASE(t));
      ctx!.lineWidth = 1;
      ctx!.setLineDash([2 * sp[0].s, 3 * sp[0].s]);
      ctx!.stroke(p);
      ctx!.setLineDash([]);
      if (o?.pulse !== undefined && o.pulse > 0 && o.pulse < 1) {
        ctx!.strokeStyle = INK(0.8 * inkMul);
        ctx!.lineWidth = 1.5;
        const seg = len * 0.1;
        ctx!.setLineDash([seg, len]);
        ctx!.lineDashOffset = -(len - seg) * o.pulse + seg;
        ctx!.stroke(p);
        ctx!.setLineDash([]);
        ctx!.lineDashOffset = 0;
        ctx!.lineWidth = 1;
      }
      return;
    }
    ctx!.strokeStyle = INK((o?.alpha ?? S_SOFT) * Math.min(1, tt * 1.4));
    ctx!.lineWidth = 1;
    const e = EASE(t);
    ctx!.setLineDash([len]);
    ctx!.lineDashOffset = len * (1 - e);
    ctx!.stroke(p);
    ctx!.setLineDash([]);
    ctx!.lineDashOffset = 0;
    if (o?.pulse !== undefined && o.pulse > 0 && o.pulse < 1) {
      ctx!.strokeStyle = INK(0.8 * inkMul);
      ctx!.lineWidth = 1.5;
      const seg = len * 0.1;
      ctx!.setLineDash([seg, len]);
      ctx!.lineDashOffset = -(len - seg) * o.pulse + seg;
      ctx!.stroke(p);
      ctx!.setLineDash([]);
      ctx!.lineDashOffset = 0;
      ctx!.lineWidth = 1;
    }
  }

  function chipLabel(str: string, wx: number, wy: number, t: number) {
    const tt = t * inkMul;
    if (tt <= 0.02) return;
    const p = toScreen(wx, wy);
    const size = 9 * p.s;
    if (size < 4) return;
    ctx!.font = `500 ${size}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const tw = ctx!.measureText(str.toUpperCase()).width + 0.08 * size * str.length;
    ctx!.fillStyle = `rgba(254, 254, 253, ${0.98 * t})`;
    ctx!.fillRect(p.x - 8 * p.s, p.y - size, tw + 16 * p.s, size * 2);
    text(str, wx, wy, t, { size: 9, caps: true, alpha: T_FAINT, track: true });
  }

  /* ── fragment sketches: each drawn at its own small scale ── */

  /* each fragment is an enclosed tile: one uniform size, white fill,
     hairline border, quiet shadow, sharp corners, with an ultra-detailed
     glyph inside. compact mode renders the docked icon. */
  const FRAG_W = 96, FRAG_H = 64;
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
    const L = (x1: number, y1: number, x2: number, y2: number, a = 0.42, wd = 1) => {
      ctx!.strokeStyle = INK(a * tt);
      ctx!.lineWidth = wd * glyphLWF;
      ctx!.beginPath();
      ctx!.moveTo(x1 * s, y1 * s);
      ctx!.lineTo(x2 * s, y2 * s);
      ctx!.stroke();
    };
    const R = (x: number, y: number, w: number, h: number, a = 0.4, fa = -1, r = 0) => {
      ctx!.beginPath();
      ctx!.roundRect(x * s, y * s, w * s, h * s, r * s);
      if (fa >= 0) { ctx!.fillStyle = INK(fa * tt); ctx!.fill(); }
      if (a > 0) { ctx!.strokeStyle = INK(a * tt); ctx!.lineWidth = glyphLWF; ctx!.stroke(); }
    };
    const C = (x: number, y: number, r: number, a = 0.45, fa = -1) => {
      ctx!.beginPath();
      ctx!.arc(x * s, y * s, r * s, 0, Math.PI * 2);
      if (fa >= 0) { ctx!.fillStyle = INK(fa * tt); ctx!.fill(); }
      if (a > 0) { ctx!.strokeStyle = INK(a * tt); ctx!.lineWidth = glyphLWF; ctx!.stroke(); }
    };
    const T = (str: string, x: number, y: number, sz: number, a = 0.7, weight = "500") => {
      ctx!.font = `${weight} ${sz * s}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx!.fillStyle = INK(a * tt);
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText(str, x * s, y * s);
      ctx!.textAlign = "left";
    };
    const P = (pts: Array<[number, number]>, a = 0.4, wd = 1, close = false) => {
      ctx!.strokeStyle = INK(a * tt);
      ctx!.lineWidth = wd * glyphLWF;
      ctx!.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx!.moveTo(x * s, y * s) : ctx!.lineTo(x * s, y * s)));
      if (close) ctx!.closePath();
      ctx!.stroke();
    };

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

    if (compact) {
      /* the signature element only, small and clean */
      switch (kind) {
        case "statement": L(-10, -3, 10, -3, 0.7, 1.3); L(-10, 3, 5, 3, 0.3); break;
        case "paragraph": R(-11, -6, 5, 5, 0.3, 0.1); L(-3, -4, 11, -4, 0.3); L(-11, 3, 11, 3, 0.3); break;
        case "profile": C(-6, 0, 4, 0.5); L(1, -2, 10, -2, 0.45); L(1, 3, 7, 3, 0.28); break;
        case "hierarchy": L(-10, -4, 4, -4, 0.6, 1.2); L(-7, -4, -7, 4, 0.28); L(-7, 4, 8, 4, 0.36); break;
        case "claim": L(-11, 0, 2, 0, 0.4); C(8, 0, 4, 0.55); break;
        case "quote": T("\u201C", -8, -1, 12, 0.5); L(-1, 1, 10, 1, 0.4); break;
        case "channels": C(-9, -4, 1.4, 0, 0.5); L(-5, -4, 8, -4, 0.3); R(-10.2, 2, 2.6, 2.6, 0.45); L(-5, 3.4, 6, 3.4, 0.3); break;
        case "principles": T("1", -9, -3, 5.5, 0.55); L(-4, -3, 9, -3, 0.32); T("2", -9, 4, 5.5, 0.55); L(-4, 4, 7, 4, 0.32); break;
        case "beforeafter": R(-11, -5, 7, 10, 0.28); R(4, -5, 7, 10, 0.5); L(-2, 0, 2, 0, 0.45); break;
        case "swatches": for (let i = 0; i < 4; i++) R(-11 + i * 5.8, -3.5, 4.6, 7, 0.2, 0.15 + i * 0.2); break;
        case "aa": T("A", -4, 0, 11, 0.8); T("a", 5, 1.5, 7.5, 0.5, "400"); break;
        case "ruler": L(-11, 2, 11, 2, 0.45); for (let i = 0; i < 5; i++) L(-9 + i * 4.5, 2, -9 + i * 4.5, i % 2 ? -2 : -4, 0.42); break;
        case "grid": R(-9, -6, 18, 12, 0.4); L(-3, -6, -3, 6, 0.22); L(3, -6, 3, 6, 0.22); break;
        case "steps": R(-10, 1, 4, 4, 0.45); R(-4, -1, 6, 6, 0.5); R(4, -4, 8, 9, 0.55); break;
        case "shapes": C(-6, 0, 4, 0.45); R(2, -4, 8, 8, 0.45, -1, 2.5); break;
        case "easing": ctx!.strokeStyle = INK(0.55 * tt); ctx!.lineWidth = 1.2; ctx!.beginPath(); ctx!.moveTo(-9 * s, 5 * s); ctx!.bezierCurveTo(-1 * s, 5 * s, 0, -5 * s, 9 * s, -5 * s); ctx!.stroke(); break;
        case "frame": R(-10, -7, 20, 14, 0.45); ctx!.strokeStyle = INK(0.35 * tt); ctx!.beginPath(); ctx!.moveTo(-7 * s, 4 * s); ctx!.lineTo(-2 * s, -2 * s); ctx!.lineTo(2 * s, 2 * s); ctx!.lineTo(7 * s, -3 * s); ctx!.stroke(); break;
        case "sparkline": for (let i = 0; i < 4; i++) { const h2 = [4, 8, 6, 10][i]; R(-9 + i * 5, 5 - h2, 3.6, h2, 0, 0.28); } break;
        case "contrast": R(-10, -6, 10, 12, 0, 0.75); ctx!.fillStyle = `rgba(254,254,253,${0.95 * tt})`; ctx!.font = `500 ${7 * s}px -apple-system, sans-serif`; ctx!.textAlign = "center"; ctx!.textBaseline = "middle"; ctx!.fillText("A", -5 * s, 0.5 * s); ctx!.textAlign = "left"; T("A", 5, 0.5, 7, 0.75); break;
      }
      ctx!.restore();
      return;
    }



    switch (kind) {
      case "statement":
        L(-38, -19, -30, -19, 0.55, 1.6);
        L(-38, -8, 20, -8, 0.78, 1.7);
        L(-38, 1, 34, 1, 0.3);
        L(-38, 9, 28, 9, 0.3);
        L(-38, 17, 10, 17, 0.3);
        L(-38, 23, -12, 23, 0.55, 1.4);
        break;
      case "paragraph":
        R(-38, -20, 15, 15, 0.35, 0.07);
        L(-18, -17, 36, -17, 0.3);
        L(-18, -10, 32, -10, 0.3);
        L(-38, 0, 36, 0, 0.3);
        L(-38, 7, 28, 7, 0.3);
        L(-34, 16, 36, 16, 0.3);
        L(-34, 23, 14, 23, 0.3);
        break;
      case "profile":
        C(-26, -9, 10, 0.5);
        C(-26, -12.5, 3, 0, 0.55);
        ctx!.strokeStyle = INK(0.55 * tt);
        ctx!.beginPath();
        ctx!.arc(-26 * s, -3.5 * s, 5.2 * s, Math.PI * 1.08, Math.PI * 1.92);
        ctx!.stroke();
        L(-10, -15, 28, -15, 0.62, 1.4);
        L(-10, -6, 18, -6, 0.3);
        R(-10, 2, 22, 3, 0, 0.14);
        R(-10, 8, 15, 3, 0, 0.22);
        L(-38, 17, 38, 17, 0.12);
        R(-38, 21, 18, 6, 0.28);
        break;
      case "hierarchy":
        L(-36, -19, 0, -19, 0.7, 1.5);
        L(-32, -19, -32, 20, 0.24);
        L(-32, -5, -26, -5, 0.24);
        L(-24, -5, 8, -5, 0.42);
        L(-20, -5, -20, 20, 0.18);
        L(-20, 6, -14, 6, 0.18);
        L(-12, 6, 16, 6, 0.32);
        L(-32, 20, -26, 20, 0.24);
        L(-24, 20, 12, 20, 0.42);
        break;
      case "claim":
        L(-38, -12, 8, -12, 0.42);
        L(-38, -3, 2, -3, 0.3);
        L(-38, 6, 6, 6, 0.3);
        C(26, -2, 11, 0.5);
        C(26, -2, 7.5, 0.3);
        ctx!.strokeStyle = INK(0.75 * tt);
        ctx!.lineWidth = 1.5 * glyphLWF;
        ctx!.beginPath();
        ctx!.moveTo(21 * s, -2 * s);
        ctx!.lineTo(24.6 * s, 2 * s);
        ctx!.lineTo(31.4 * s, -6 * s);
        ctx!.stroke();
        L(19, 14, 33, 14, 0.2);
        break;
      case "quote":
        T("\u201C", -34, -16, 21, 0.5);
        L(-16, -12, 30, -12, 0.4);
        L(-16, -3, 22, -3, 0.4);
        T("\u201D", 32, 1, 21, 0.5);
        ctx!.strokeStyle = INK(0.4 * tt);
        ctx!.lineWidth = 1.1 * glyphLWF;
        ctx!.beginPath();
        ctx!.moveTo(-16 * s, 14 * s);
        for (let i = 0; i <= 36; i++) {
          const x = -16 + i * 1.15;
          ctx!.lineTo(x * s, (14 + Math.sin(i * 0.55) * (1.4 + Math.sin(i * 0.13) * 1.2)) * s);
        }
        ctx!.stroke();
        C(4, 14, 1.4, 0, 0.55);
        break;
      case "banned":
        L(-38, -16, -2, -16, 0.42);
        L(-40, -16, 0, -16, 0.6, 1.4);
        L(-38, -5, 6, -5, 0.42);
        L(-40, -5, 8, -5, 0.6, 1.4);
        C(26, -10, 11, 0.55);
        L(18.2, -2.2, 33.8, -17.8, 0.55, 1.3);
        L(-38, 10, 12, 10, 0.34);
        ctx!.strokeStyle = INK(0.6 * tt);
        ctx!.lineWidth = 1.3 * glyphLWF;
        ctx!.beginPath();
        ctx!.moveTo(18 * s, 10 * s);
        ctx!.lineTo(20.6 * s, 12.8 * s);
        ctx!.lineTo(25 * s, 6.6 * s);
        ctx!.stroke();
        L(-38, 19, 2, 19, 0.22);
        break;
      case "channels":
        C(-33, -18, 2.8, 0, 0.5);
        L(-25, -18, 12, -18, 0.34);
        R(-24, -19.5, 0, 0, 0);
        R(20, -20, 14, 4, 0, 0.28);
        R(-35.8, -7.6, 5.6, 5.6, 0.5);
        L(-25, -5, 6, -5, 0.34);
        R(20, -7, 10, 4, 0, 0.2);
        P([[-33, 5], [-36, 10.5], [-30, 10.5]], 0.5, 1, true);
        L(-25, 8, 16, 8, 0.34);
        R(20, 6, 16, 4, 0, 0.35);
        P([[-33, 17], [-36.2, 20.5], [-33, 24], [-29.8, 20.5]], 0.5, 1, true);
        L(-25, 21, 2, 21, 0.34);
        R(20, 19, 7, 4, 0, 0.14);
        break;
      case "principles":
        T("1", -35, -16, 8.5, 0.62);
        L(-27, -16, 26, -16, 0.38);
        ctx!.strokeStyle = INK(0.6 * tt);
        ctx!.lineWidth = 1.3 * glyphLWF;
        ctx!.beginPath();
        ctx!.moveTo(30 * s, -16 * s);
        ctx!.lineTo(32.4 * s, -13.4 * s);
        ctx!.lineTo(36.6 * s, -19 * s);
        ctx!.stroke();
        L(-38, -8, 38, -8, 0.1);
        T("2", -35, 0, 8.5, 0.62);
        L(-27, 0, 18, 0, 0.38);
        L(-38, 8, 38, 8, 0.1);
        T("3", -35, 16, 8.5, 0.62);
        L(-27, 16, 22, 16, 0.38);
        break;
      case "beforeafter":
        R(-40, -18, 28, 36, 0.26);
        L(-36, 12, -18, -10, 0.2);
        L(-36, -4, -24, 12, 0.2);
        L(-36, 4, -30, 12, 0.16);
        R(12, -18, 28, 36, 0.55);
        L(16, -10, 36, -10, 0.42);
        L(16, -2, 32, -2, 0.42);
        L(16, 5, 34, 5, 0.42);
        L(16, 12, 26, 12, 0.42);
        L(36, -22, 40, -22, 0.6); L(40, -22, 40, -18, 0.6);
        L(-6, 0, 6, 0, 0.55, 1.2);
        L(3, -3, 6, 0, 0.55, 1.2);
        L(3, 3, 6, 0, 0.55, 1.2);
        break;
      case "swatches":
        for (let i = 0; i < 6; i++) {
          R(-39 + i * 13, -14, 11, 18, 0.24, 0.08 + i * 0.15);
          L(-36 + i * 13, 8, -31 + i * 13, 8, 0.22);
        }
        R(-39 + 4 * 13 - 2, -16, 15, 22, 0.65);
        L(-39, 15, 39, 15, 0.14);
        for (let i = 0; i < 6; i++) L(-33.5 + i * 13, 15, -33.5 + i * 13, 18, 0.25);
        break;
      case "aa":
        L(-40, -18, 40, -18, 0.15);
        L(-40, -4, 40, -4, 0.11);
        L(-40, 14, 40, 14, 0.26);
        L(-40, 21, 40, 21, 0.1);
        T("A", -16, -1, 30, 0.88);
        T("a", 12, 5, 19, 0.55, "400");
        L(28, -10, 34, -10, 0.6, 1.8);
        L(28, -4, 34, -4, 0.35, 1);
        L(28, 2, 34, 2, 0.22, 1);
        break;
      case "ruler":
        L(-40, 10, 40, 10, 0.55);
        for (let i = 0; i < 11; i++) {
          const h2 = i % 5 === 0 ? 14 : i % 2 === 0 ? 9 : 5.5;
          L(-40 + i * 8, 10, -40 + i * 8, 10 - h2, 0.44);
        }
        L(-24, -14, 0, -14, 0.42);
        L(-24, -17.5, -24, -10.5, 0.42);
        L(0, -17.5, 0, -10.5, 0.42);
        L(-21, -14, -24, -14, 0.42);
        L(16, -14, 32, -14, 0.3);
        L(16, -17, 16, -11, 0.3);
        L(32, -17, 32, -11, 0.3);
        L(-40, 20, 40, 20, 0.12);
        break;
      case "grid":
        R(-38, -22, 76, 44, 0.42);
        for (let i = 0; i < 6; i++) {
          const x = -34 + i * 12;
          R(x, -18, 8, 36, 0, 0.045);
        }
        R(-34, -18, 20, 16, 0.5, 0.02);
        L(-38, 0, 38, 0, 0.08);
        break;
      case "steps":
        L(-40, 22, 40, 22, 0.2);
        R(-36, 13, 8, 9, 0.48);
        R(-22, 7, 13, 15, 0.52);
        R(-3, -2, 18, 24, 0.56);
        R(21, -13, 24, 35, 0.6);
        ctx!.setLineDash([2 * s, 3 * s]);
        L(-32, 11, 30, -15, 0.22);
        ctx!.setLineDash([]);
        break;
      case "shapes":
        C(-26, 0, 11, 0.5);
        R(-8, -11, 22, 22, 0.5);
        R(20, -11, 22, 22, 0.5, -1, 7);
        L(27, -11, 27, -16, 0.35);
        L(27, -16, 32, -16, 0.35);
        break;
      case "easing":
        L(-34, 20, 36, 20, 0.28);
        L(-34, 20, -34, -22, 0.28);
        for (let i = 1; i < 5; i++) L(-34 + i * 17, 20, -34 + i * 17, 18, 0.18);
        for (let i = 1; i < 4; i++) L(-34, 20 - i * 12, -32, 20 - i * 12, 0.18);
        ctx!.strokeStyle = INK(0.65 * tt);
        ctx!.lineWidth = 1.5 * glyphLWF;
        ctx!.beginPath();
        ctx!.moveTo(-34 * s, 20 * s);
        ctx!.bezierCurveTo(-6 * s, 20 * s, -10 * s, -18 * s, 36 * s, -18 * s);
        ctx!.stroke();
        L(-34, 20, -20, 12, 0.25);
        C(-20, 12, 1.7, 0, 0.5);
        L(36, -18, 22, -14, 0.25);
        C(22, -14, 1.7, 0, 0.5);
        C(2, 0, 2.2, 0, 0.75);
        break;
      case "frame":
        R(-38, -24, 76, 48, 0.5);
        L(-12.6, -24, -12.6, 24, 0.08);
        L(12.6, -24, 12.6, 24, 0.08);
        L(-38, -8, 38, -8, 0.08);
        L(-38, 8, 38, 8, 0.08);
        P([[-32, 18], [-12, -10], [-2, 4], [10, -6], [32, 18]], 0.42, 1.2);
        C(18, -14, 4.6, 0.42);
        L(-42, -20, -42, -28, 0.6); L(-42, -28, -34, -28, 0.6);
        L(42, 20, 42, 28, 0.6); L(42, 28, 34, 28, 0.6);
        break;
      case "sparkline":
        L(-36, 18, 38, 18, 0.32);
        L(-36, 18, -36, -20, 0.2);
        for (let i = 1; i < 4; i++) L(-36, 18 - i * 10, 38, 18 - i * 10, 0.06);
        {
          const hs = [9, 19, 14, 25, 12, 21, 16];
          const tops: Array<[number, number]> = [];
          for (let i = 0; i < 7; i++) {
            R(-32 + i * 10, 18 - hs[i], 7, hs[i], 0, 0.15 + (i % 3) * 0.09);
            tops.push([-28.5 + i * 10, 18 - hs[i]]);
          }
          ctx!.strokeStyle = INK(0.5 * tt);
          ctx!.lineWidth = 1.2 * glyphLWF;
          ctx!.beginPath();
          tops.forEach(([x, y], i) => (i === 0 ? ctx!.moveTo(x * s, (y - 4) * s) : ctx!.lineTo(x * s, (y - 4) * s)));
          ctx!.stroke();
          C(tops[6][0], tops[6][1] - 4, 1.8, 0, 0.6);
        }
        break;
      case "contrast":
        R(-38, -24, 38, 48, 0, 0.8);
        ctx!.fillStyle = `rgba(254,254,253,${0.95 * tt})`;
        ctx!.font = `500 ${21 * s}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText("A", -19 * s, 0);
        ctx!.textAlign = "left";
        T("A", 19, 0, 21, 0.85);
        L(0, -24, 0, 24, 0.22);
        for (let i = 0; i < 4; i++) R(8 + i * 8, 16, 5, 4, 0, i < 3 ? 0.3 : 0.1);
        break;
    }
    ctx!.restore();
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
          if (docked) text(f.label, def.x + 72, ty, appear, { size: 10, alpha: T_BODY });
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
      // the compile step
      card(COMPILE.x, COMPILE.y, COMPILE.w, COMPILE.h, t);
      text("compile", COMPILE.x + 18, COMPILE.y + 27, t, { size: 9.5, caps: true, alpha: 0.6, weight: "500", track: true });
      (["JSON bundles", "search index", "types", "agent context"] as const).forEach((nm, i) => {
        text(nm, COMPILE.x + [96, 162, 226, 264][i], COMPILE.y + 27, t, { size: 8, alpha: T_FAINT, maxW: 58 });
      });
      route([[BI.x + BI.w / 2, BI.y + BI.h], [BI.x + BI.w / 2, COMPILE.y]], t, { alpha: 0.2 });
      // Google Workspace: where the knowledge is written
      {
        const fa = toScreen(BI.x + 18, BI.y + BI.h - 30);
        const fb = toScreen(BI.x + BI.w - 18, BI.y + BI.h - 30);
        ctx!.strokeStyle = INK(0.1 * t * inkMul);
        ctx!.beginPath(); ctx!.moveTo(fa.x, fa.y); ctx!.lineTo(fb.x, fb.y); ctx!.stroke();
      }
      text("v2026-07 · sealed by hash", BI.x + 18, BI.y + BI.h - 15, t, { size: 8.5, alpha: T_FAINT });
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
        partGlyph(PART_DEFS[idx], pa.x + 29 * u, pa.y + 18 * u, u, t);
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
      {
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
      {
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
      knock(543, 546, 613, 560);
      text("input schemas", 578, 553, t, { size: 7.5, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
      knock(1294, 546, 1346, 560);
      text("exporters", 1320, 553, t, { size: 7.5, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });

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
      text("re-runs every renderer and flags any file that comes out different", BENCH.x + BENCH.w - CARD_PAD, BENCH.y + BENCH.h / 2, t, { size: 8.5, alpha: T_FAINT, anchor: "right" as CanvasTextAlign });

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
      knock(526, 717, 597, 733);
      text("renderers", 594, 725, t, { size: 9, caps: true, alpha: 0.62, weight: "500", track: true, anchor: "right" as CanvasTextAlign });
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
        deviceGlyph(i, gc.x, gc.y, gc.s, t);
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
      // connectors from the hall
      route([[BELT_X1, 585], [FAN_X, 585], [FAN_X, 320], [WIN.x, 320]], t, { alpha: 0.2, dash: true });
      route([[BELT_X1, 585], [WIN.x, 585]], t, { alpha: 0.2, dash: true });
      route([[BELT_X1, 585], [FAN_X, 585], [FAN_X, 790], [WIN.x, 790]], t, { alpha: 0.2, dash: true });

      // people: the brand center window
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
      text("people · the brand center", WIN.x + 16, WIN.y + 50, t, { size: 9, caps: true, alpha: 0.66, weight: "500", track: true });
      ["create", "library", "guidelines", "campaigns"].forEach((nm, i) => {
        text(nm, WIN.x + 16, WIN.y + 80 + i * 26, t, { size: 10, alpha: T_BODY });
      });
      const dv = toScreen(WIN.x + 120, WIN.y + 42);
      const dv2 = toScreen(WIN.x + 120, WIN.y + WIN.h - 16);
      ctx!.strokeStyle = INK(0.1 * t * inkMul);
      ctx!.beginPath(); ctx!.moveTo(dv.x, dv.y); ctx!.lineTo(dv2.x, dv2.y); ctx!.stroke();
      ([[140, 56, "campaign"], [320, 56, "document"]] as const).forEach(([dx, dy, nm]) => {
        const pa = toScreen(WIN.x + dx, WIN.y + dy);
        const pb = toScreen(WIN.x + dx + 160, WIN.y + dy + 180);
        ctx!.beginPath();
        ctx!.roundRect(pa.x, pa.y, pb.x - pa.x, pb.y - pa.y, 0);
        ctx!.fillStyle = INK(0.035 * t * inkMul);
        ctx!.fill();
        stroke(0.14 * t);
        text(nm, WIN.x + dx + 10, WIN.y + dy + 164, t, { size: 8.5, alpha: T_FAINT });
      });

      // applications: the API panel
      card(APIS.x, APIS.y, APIS.w, APIS.h, t);
      text("applications · APIs", APIS.x + 16, APIS.y + 24, t, { size: 9, caps: true, alpha: 0.66, weight: "500", track: true });
      ["brand API", "search API", "render API", "workflow API"].forEach((nm, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const ex = APIS.x + 16 + col * 240, ey = APIS.y + 56 + row * 44;
        const p = toScreen(ex, ey);
        ctx!.beginPath();
        ctx!.arc(p.x + 3 * p.s, p.y, 2 * p.s, 0, Math.PI * 2);
        ctx!.fillStyle = INK(0.5 * t * inkMul);
        ctx!.fill();
        text(nm, ex + 14, ey, t, { size: 10, alpha: T_BODY, mono: true });
      });

      // agents: the MCP panel
      card(MCP.x, MCP.y, MCP.w, MCP.h, t);
      text("agents · MCP", MCP.x + 16, MCP.y + 24, t, { size: 9, caps: true, alpha: 0.66, weight: "500", track: true });
      ["mcp", "├ resources", "├ tools", "└ prompts"].forEach((ln, i) => {
        text(ln, MCP.x + 20, MCP.y + 54 + i * 24, t, { size: 10, alpha: i === 0 ? 0.7 : T_BODY, mono: true });
      });
      text("authenticated · scoped · recorded", MCP.x + 180, MCP.y + 102, t, { size: 8.5, alpha: T_FAINT });
      const caret = toScreen(MCP.x + 20, MCP.y + 158);
      if (Math.floor(idleClock * 2.2) % 2 === 0) {
        ctx!.fillStyle = INK(0.6 * t * inkMul);
        ctx!.fillRect(caret.x, caret.y - 5 * caret.s, 1.5 * caret.s, 10 * caret.s);
      }

      // the substrate plinth
      card(PLINTH.x, PLINTH.y, PLINTH.w, PLINTH.h, t, { radius: 3 });
      ["runtime database", "object storage", "event log"].forEach((nm, i) => {
        text(nm, PLINTH.x + 24 + i * 168, PLINTH.y + 33, t, { size: 9, alpha: T_FAINT, maxW: 150 });
        if (i > 0) {
          const d = toScreen(PLINTH.x + 12 + i * 168, PLINTH.y + 33);
          ctx!.strokeStyle = INK(0.14 * t * inkMul);
          ctx!.beginPath(); ctx!.moveTo(d.x, d.y - 10 * d.s); ctx!.lineTo(d.x, d.y + 10 * d.s); ctx!.stroke();
        }
      });
    });
  }

  /* ── layer 05: governance ── */
  function drawGov(t: number, runK: number) {
    withLayer(4, () => {
      if (t <= 0.02) return;
      const a = toScreen(GOV.x, GOV.y);
      const b = toScreen(GOV.x + GOV.w, GOV.y + GOV.h);
      ctx!.beginPath();
      ctx!.roundRect(a.x, a.y, b.x - a.x, b.y - a.y, 0);
      stroke(0.26 * t);
      chipLabel("governance and validation", GOV.x + 28, GOV.y, t);
      // lifecycle strip, mounted on the top line
      const states = ["draft", "experimental", "approved", "deprecated", "retired"];
      states.forEach((nm, i) => {
        const sx = GOV.x + 330 + i * 96;
        const p = toScreen(sx, GOV.y);
        ctx!.fillStyle = `rgba(254,254,253,${0.98 * t})`;
        ctx!.fillRect(p.x - 4 * p.s, p.y - 8 * p.s, 88 * p.s, 16 * p.s);
        ctx!.beginPath();
        ctx!.arc(p.x + 2 * p.s, p.y, 2 * p.s, 0, Math.PI * 2);
        ctx!.fillStyle = INK((i === 2 ? 0.7 : 0.3) * t * inkMul);
        ctx!.fill();
        text(nm, sx + 8, GOV.y, t, { size: 8, alpha: i === 2 ? 0.6 : T_FAINT });
      });
      // gate posts where work leaves the hall
      [320, 585, 790].forEach((gy) => {
        const p = toScreen(GOV.x + GOV.w, gy);
        ctx!.strokeStyle = INK(0.5 * t * inkMul);
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y - 12 * p.s);
        ctx!.lineTo(p.x, p.y + 12 * p.s);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 3 * p.s, 0, Math.PI * 2);
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(0.5 * t);
      });
      text("gates at every exit · fail closed", GOV.x + GOV.w - 20, 862, t, { size: 8.5, alpha: T_FAINT, anchor: "right" as CanvasTextAlign });
      // the approval seat + exceptions register, mounted on the bottom line
      chipLabel("human approval", GOV.x + 470, GOV.y + GOV.h, t);
      chipLabel("exceptions, documented", GOV.x + 640, GOV.y + GOV.h, t);
      // the release shelf
      card(GOV.x + 40, GOV.y + GOV.h + 26, 330, 64, t);
      text("signed releases", GOV.x + 56, GOV.y + GOV.h + 50, t, { size: 9.5, alpha: T_TITLE, weight: "500" });
      text("every render checked byte for byte", GOV.x + 56, GOV.y + GOV.h + 70, t, { size: 8.5, alpha: T_FAINT });
      [0, 1, 2, 3].forEach((i) => {
        const p = toScreen(GOV.x + 250 + i * 28, GOV.y + GOV.h + 58);
        ctx!.beginPath();
        ctx!.roundRect(p.x, p.y - 12 * p.s, 20 * p.s, 26 * p.s, 0);
        stroke(0.3 * t);
        ctx!.beginPath();
        ctx!.arc(p.x + 10 * p.s, p.y - 8 * p.s, 1.6 * p.s, 0, Math.PI * 2);
        ctx!.fillStyle = INK(0.5 * t * inkMul);
        ctx!.fill();
      });
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
      // the bus breaks at the release shelf: the shelf is docked on the line
      ctx!.strokeStyle = INK(0.3 * t * inkMul);
      {
        const a = toScreen(1900, BUS_Y);
        const b = toScreen(914, BUS_Y);
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }
      {
        const a = toScreen(584, BUS_Y);
        const b = toScreen(REVIEW.x, BUS_Y);
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
      }
      // meters along the bus
      METERS.forEach((nm, i) => {
        // spaced to clear the release shelf (584-914) and the evidence riser at 990
        const mx2 = [440, 535, 940, 1130, 1320, 1510, 1700][i];
        const p = toScreen(mx2, BUS_Y);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 3 * p.s, 0, Math.PI * 2);
        ctx!.fillStyle = PAPER;
        ctx!.fill();
        stroke(0.42 * t);
        text(nm, mx2, BUS_Y + 24, t, { size: 8, alpha: T_FAINT, anchor: "center" as CanvasTextAlign });
      });
      // ticks traveling backward, always
      for (let i = 0; i < 5; i++) {
        const u = ((idleClock * 0.14 + i / 5) % 1);
        const tx = 1900 - u * (1900 - REVIEW.x);
        if (tx > 584 && tx < 914) continue; // submerged behind the release shelf
        const p = toScreen(tx, BUS_Y);
        ctx!.fillStyle = INK(0.5 * t * inkMul);
        ctx!.fillRect(p.x - 2.5 * p.s, p.y - 1 * p.s, 5 * p.s, 2 * p.s);
      }
      // the review point + feeds back into the system
      const rp = toScreen(REVIEW.x, REVIEW.y);
      ctx!.beginPath();
      ctx!.arc(rp.x, rp.y, 7 * rp.s, 0, Math.PI * 2);
      ctx!.fillStyle = PAPER;
      ctx!.fill();
      stroke(0.5 * t);
      chipLabel("evidence returns to the people", REVIEW.x + 40, BUS_Y + 52, t);
      // one return artery up the left margin, tapping the records and the tokens at their edges
      route([[REVIEW.x, BUS_Y - 7], [REVIEW.x, 1010], [80, 1010], [80, 400], [BI.x, 400]], t, { alpha: 0.16 });
      route([[80, DL.y + 160], [DL.x, DL.y + 160]], t, { alpha: 0.16 });
      // evidence riser into the hall, clear of the shelf and the meters
      route([[990, BUS_Y], [990, HALL.y + HALL.h]], t, { alpha: 0.16, dash: true });
    });
  }

  /* ── the run and its outputs ── */
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

    const cy = window.innerHeight / 2;
    let n = 0;
    for (const c of captions) if (c.getBoundingClientRect().top < cy) n++;
    active = Math.min(BEATS - 1, n);

    captions.forEach((c, i) => c.classList.toggle("ds-cap-active", i + 1 === active));
    titleBlock?.classList.toggle("ds-title-gone", active > 0);
    wrap.classList.toggle("ds-explore-on", active >= BEATS - 1);
    if (active < BEATS - 1 && explorerLayer !== null) explorerLayer = null;

    const chase = 1 - Math.pow(0.0018, dt);
    for (let b = 0; b < BEATS; b++) {
      const target = active >= b ? 1 : 0;
      reveal[b] += (target - reveal[b]) * chase;
      const ft = active === b ? 1 : 0;
      focus[b] += (ft - focus[b]) * chase;
    }

    /* the spotlight: beats 1..6 select layers 0..5; explorer overrides */
    let sel: number | null = null;
    if (explorerLayer !== null && active >= BEATS - 1) sel = explorerLayer;
    else if (active >= 1 && active <= 6) sel = active - 1;
    for (let i = 0; i < LAYER_COUNT; i++) {
      const target = sel === null ? 1 : (sel === i ? 1 : DIM);
      layerLight[i] += (target - layerLight[i]) * chase;
    }

    const f = FRAMES[active];
    cam.zoom += (f.zoom - cam.zoom) * chase;
    cam.cx += (f.cx - cam.cx) * chase;
    cam.cy += (f.cy - cam.cy) * chase;

    idleClock += dt * 0.08;
    if (active === 7) runClock = (runClock + dt / 14) % 1;
    const runK = active === 7 ? runClock : -1;

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
    if (runK >= 0) drawRun(reveal[7], runK);
    else if (reveal[7] > 0.5) {
      // after the run beat the outputs stay, part of the system
      withLayer(3, () => {
        card(OUTPUTS.x, OUTPUTS.y, OUTPUTS.w, OUTPUTS.h, reveal[7]);
        OUTPUT_NAMES.forEach((nm, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const ox = OUTPUTS.x + 14 + col * 160, oy = OUTPUTS.y + 12 + row * 34;
          const p = toScreen(ox, oy);
          const q = toScreen(ox + 150, oy + 28);
          ctx!.beginPath();
          ctx!.roundRect(p.x, p.y, q.x - p.x, q.y - p.y, 0);
          stroke(0.2 * reveal[7]);
          text(nm, ox + 8, oy + 14, reveal[7], { size: 8, alpha: T_BODY, maxW: 136 });
        });
      });
    }

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
  io.observe(wrap);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  resize();
  start();

  return {
    destroy() {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    },
    setLayer(i: number | null) {
      explorerLayer = i;
    },
  };
}
