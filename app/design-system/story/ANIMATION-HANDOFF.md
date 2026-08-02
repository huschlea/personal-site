# Animation handoff: the full-run sequence

The "run" stage was removed in the static-blueprint pass (2026-08-01). The
finale ("The system", stage 7) is deliberately static: no ticks, no caret, no
pulses. A future pass may add a continuous animation of briefs traveling
through the whole system on that stage. This file is the map for whoever
builds it.

## Where it hooks in

Everything lives in `assembly.ts` inside `mountAssembly`.

- `drawRun(t, k)` is the tabled reference choreography, still in the file and
  never called. `k` in [0..1] is one normalized pass of a single brief:
  arrival from the window (k<0.3), belt traversal with a labelled traveler
  chip, an interpreter consult, the rust "claim unverified · revised" moment
  in `drawGov` (0.52<k<0.68), dispatch through the exporters (0.66..0.74),
  delivery fan to the interface (>0.68), outputs appearing (>0.8).
- `runClock` (still declared) was the clock: it advanced `dt / 14` while the
  run stage was active, so one pass took 14s. `frame()` now pins
  `const runK = -1`, which disables every run-conditional in one place.
- `RUN_MOTION` (top of the file, `false`) gates every idle motion on the
  board: the bus tick slugs and the MCP caret today, and any motion the
  future animation adds. Flip it to bring the dormant motion back; keep the
  finale (`active === BEATS - 1`) still regardless.
- `drawHall(t, runK)` and `drawGov(t, runK)` accept runK and contain the
  belt boosts (`inBoost`/`outBoost`), the traveler chip (`tokX`, "blog
  campaign"), checkpoint pulses (`CHECK_PULSE`), and the rust moment. All are
  dormant at runK = -1, not deleted.
- `route(pts, t, { pulse })` is the traveling-brightness idiom: pulse in
  (0,1) draws a bright segment at that fraction of the path. The evidence bus
  ticks in `drawObs` (gated off on the finale by `active !== BEATS - 1`) are
  the slug-in-channel idiom for the double rule.

## Stable anchors to target

The drawing is canvas, so the "IDs" are the named world constants: `BI`,
`COMPILE`, `DL`, `HALL`, `SPINE`, `STATIONS` (workflow stops), `CHECKPOINTS`,
`REC`, `PARTS`, `RB` (renderer bank), `BENCH`, `WIN` (Design OS), `APIS`,
`MCP`, `PLINTH`, `OUTPUTS`, `SHELF` (signed releases), `NOTES` (release
notes), `SEAT` (feedback loop), `BUS_Y`, `BUS_X1`, `REVIEW`, `REL_LINE`,
`FAN_X`, `GOV`. Route through these, never through literals, and relocations
will not break the animation.

## The intended sequence (as designed, never built)

Several briefs in flight at once on the finale, staggered ~5s on a ~20s
circuit; only the leading brief carries a name, the rest travel as anonymous
slugs. One circuit: request enters from the interface through a governance
gate into the intake mouth; becomes a chip on the belt; context assembly
pulls the recipe; interpreter checkpoint flickers; render lights only that
recipe's renderers via the manifold; validate occasionally throws the rust
moment; out through the exporters and a gate; an outputs tile brightens; a
register row writes itself into signed releases; the Slack and Gmail marks
pulse on release notes; a slug rides the evidence bus left, ticks a meter,
reaches the feedback loop; the findings artery pulses up into brand
intelligence and design language. What accumulates across circuits: register
rows, outputs tiles, meter ticks. Reset quietly after a few.

## Constraints the drawing imposes

- One ink; motion is brightness and position, never colour. Rust is reserved
  for rejected work.
- The double rule's channel is screen-space (RULE_GAP); anything traveling
  inside it must size in screen px (see the tick slugs).
- The finale must remain available as a static view: gate all motion behind
  an explicit toggle, do not re-entangle it with stage index arithmetic.
