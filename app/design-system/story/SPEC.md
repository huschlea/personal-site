# The destination system: content spec for redline

The single source for the rebuild. Everything drawn, every panel's text, every
connection. Redline anything; what survives is what gets built.

## Doctrine (settled)

- Literal and component-based. No metaphor.
- Brand-agnostic everywhere. No company name, no brand-specific artifacts.
- The destination state is drawn as real. No dashed-because-unfinished, no
  today/next/long-term.
- Sentence case everywhere.
- One accent: rust, appearing only where work is rejected.
- Glyph imagery is printed, not drawn: opaque masses and counterforms in a
  fixed neutral ink set (graphite, umber, stone, greige, mist, paper), with
  fine printed rules beside the ink. Graphite is the emphasis ink: one small
  mass per glyph, never more. Masses sit left-aligned on a baseline rhythm.
  The neutral family is achromatic in spirit and does not compete with rust;
  favicon marks remain the sanctioned true-colour exception.
- Every glyph is a little page: its drawing is measured and centred in its
  own enclosure, so no tile, part or device sits off its own axis.
- The drawing lives on canvas; panel text lives in HTML so it is always crisp.
- The record and chat are removed. The page is the system.

## The master visual (the end state everything works backward from)

Left lane: Brand intelligence above Design language.
Center: the production hall, the largest structure, centred in its corridor:
the gap from the lane's right edge to the hall equals the gap from the hall
to the interface. Governance overhangs the hall equally on both sides.
Right lane: the interface with its three doors, on a substrate plinth.
Governance drawn as the boundary around production and its exits, with
instruments mounted on the line. Observability as the return bus along the
bottom, feeding back into the left lane.

Connections (real marks, attached where they belong):

| Mark | Attaches to | Label |
|---|---|---|
| Anthropic | the interpreters rail | interpretation · proposes words and selections |
| OpenAI | the interpreters rail, and the image renderer | interpretation · generated imagery |
| Google Drive | intelligence authoring | where the knowledge is written |
| Notion | intelligence authoring | where the knowledge is written |
| Figma | design language authoring | explore in → · versioned release out ← |
| Paper | design language authoring | foundations that terminate in CSS |
| KREA | the image renderer | generated imagery |
| Recraft | the image renderer | brand-locked style, exact colors |
| Gamma | the deck renderer | presentation output |
| Higgsfield | the video renderer | video output |

At most three marks per section. The web and document renderers stay
markless on purpose: in-house code renders those, and the absence is the
argument.

Infrastructure carries no mark: hosting, CI, frameworks, the font foundry,
and the browser engine the system drives. A mark means an outside service
generated the artifact, nothing else. (An engine class was built and cut on
2026-07-31: naming the engine put it in the same row as the generators and
blurred exactly the distinction the row exists to draw.)

Marks ride bare: no container, no rule, no fill. The favicon itself is the
whole element, centered on its card title's line. Where a mark shares a row
with empty seats, it is sized to read at the same width as those seats.

The pattern of marks is itself information. Image, deck and video carry
marks: those files are generated outside. Web and document carry none: the
system renders those itself.

## Beat 0 · The opening field

One uniform tile size, arranged in a composed five-column grid with ample
gutters, no rotation. Every fragment drawn as the thing it is:

- positioning: a two-line statement, first line bolder
- company narrative: a paragraph fragment with an opening line
- audience profile: a mini profile card, dot avatar and three rows
- message hierarchy: three indented lines, stepped
- approved claim: one sentence with a small seal
- voice and tone: a quoted line in quotation marks
- channel behavior: three channel rows with differing line lengths
- creative principles: a numbered pair
- examples: a tiny before and after pair
- color tokens: a strip of four value swatches (ink values, page stays mono)
- typography: Aa at two sizes
- spacing: ruler ticks
- grid: a small frame with column lines
- scale: three squares stepping up
- shape: a rounded and a sharp rectangle
- motion: an easing curve
- image behavior: a small frame with a crop mark
- data visualization: a five-bar sparkline
- accessibility: an AA contrast pair

Title block over paper, thesis line unchanged. Scroll cue.

## Beats 1 and 2 · The sorting

Fragments fly on arcs into their two cards. Docked, each fragment keeps a
compact version of its representative drawing beside its name (a swatch strip
next to "color tokens", the Aa next to "typography"): the cards become real
inventories, not lists.

Panel, layer 01 (spotlight: Brand intelligence at full ink, all else dimmed):

> **What it does.** Turn positioning, audiences, messaging, claims, voice, and
> principles into structured, current, and retrievable knowledge.
>
> **Comprised of.** Positioning · company narrative · audience profiles ·
> message hierarchy · approved claims · voice and tone · channel behavior ·
> creative principles · examples and counterexamples
>
> **Technical hierarchy.**
> ```
> brand intelligence
>   authoring
>     - YAML for human-authored structured records
>     - markdown or MDX for nuance, rationale, examples
>     - CMS where contributors need frequent editing
>   contracts
>     - JSON Schema for required fields and validation
>   versioning
>     - dated snapshots, sources sealed by hash
>     - open questions recorded, never inferred
>   distribution
>     - compiled JSON bundles
>     - search indexes
>     - type definitions
>     - channel-specific subsets
>     - agent-readable context
> ```

Drawing detail for 01: the record cards stack with version tags and seals; a
compile step beneath them emits four bundle glyphs that flow toward production.

Panel, layer 02:

> **What it does.** Convert visual and behavioral decisions into reusable,
> versioned foundations.
>
> **Comprised of.** Color · typography · spacing · grids · scale · shape ·
> motion · image behavior · illustration behavior · data visualization ·
> accessibility foundations
>
> **Technical hierarchy.**
> ```
> design language
>   token levels
>     - primitive tokens
>     - semantic tokens
>     - component tokens where necessary
>   authoring
>     - Figma for exploration and application
>     - versioned token files for approved releases
>   distribution
>     - CSS variables
>     - JavaScript and TypeScript values
>     - JSON bundles
>     - Figma synchronization
> ```

Drawing detail for 02: the token stack drawn as three physical levels feeding a
distribution fan; the Figma mark with its two one-way arrows.

Both left-lane cards are sized to their content rather than to a round number,
and share one width so the lane aligns. Design language spends its reclaimed
width on a right-hand column giving each foundation its token level, which the
card's own footer already reads as a legend: primitive to semantic to
component. Brand intelligence simply reclaims the space; a column is only
worth adding where there is something true and varied to put in it.

## Beat 3 · The production hall

The centerpiece. One hall, five visible stations:

- **Components**: a parts rack of twelve artifact parts, each drawn as the
  thing it is: headline · body · quote · credit · lockup · image · ground ·
  palette · figure · list · chip · seal. These are the parts of a rendered
  artifact, not the controls of an application: no buttons, inputs or nav,
  which belong to a product interface and were already ruled out of
  rendered work.
- **Recipes**: five cards of assembly logic: blog campaign, branded document,
  slide deck, event campaign, newsletter.
- **Workflows**: the run lane crossing the hall: request → context assembly →
  render → validate → review → release. Interpretation is not one station:
  diamond checkpoints sit at the seams where the run consults the model:
  after the request (the brief), before render (the words and selections),
  after validate (the redraft). Every marker on the line, station or
  checkpoint, sits one equal interval from its neighbour; where no
  checkpoint belongs, two stations simply stand adjacent. The label sits at
  the head of the line, close above it. A run token idles through it
  continuously, slow.
- **Interpreters**: a thin rail between the workflow and the renderers,
  spanning the checkpoints, each stemmed into it: two seated model marks,
  Anthropic and OpenAI, centered in the rail, and on the right what they do:
  drafts headlines, picks quotes, proposes directions. The render manifold
  trunk passes behind it.
- **Renderers**: the output devices along the hall's right wall: web · image
  (OpenAI, KREA) · document · deck (Gamma) · video (Higgsfield).
- **Input schemas** and **exporters**: the engine's mouth and its dispatch,
  drawn as bare jaws. The intake narrows from the hall wall to where the belt
  begins; the dispatch widens from where the belt ends out to the wall. The
  belt exists only between them, and the hall's own boundary breaks across
  each opening, so the engine visibly opens and closes instead of being
  sealed by its own wall. The dotted delivery passes straight through the
  open intake and becomes the belt; the dotted output leaves the belt and
  passes out through the dispatch. Nothing is drawn inside a throat. Both
  wake as the run passes. Labeled above on knockouts.
- **Production tests**: the full rig under the renderer bank: a bench
  spanning the bank's width, stemmed to every renderer, one passed check
  straddling its edge beneath each machine, and on the right what it does:
  re-runs every renderer and flags any file that comes out different.
  Distinct from the governance gates, and still during the run.

Copy law for every label on this page: name the job the thing performs, in
words that need no knowledge of the system. Not the boundary it respects,
not the mechanism it uses. A reader should learn what happens here.

Inputs dock from the left lane, each at its true stage: the token release
is standing environment, entering at the intake and riding the belt from
the head through the schema grating; the compiled context bundle is
retrieved per run, docking at the context assembly station by an
under-rail lane that rises behind the interpreters rail and the station
label's knockout. Recipes tap request: the request names the job, so the
recipe comes off the shelf at the head and rides as the traveler.

Panel, layer 03:

> **What it does.** Turn intelligence, design language, content, assets, and
> intent into finished artifacts.
>
> **Comprised of.** Components · recipes · workflows · renderers · exporters ·
> input schemas · production tests
>
> Components are reusable parts. Recipes are approved assembly logic for
> recurring jobs. Workflows run from request to completion. Renderers produce
> the actual files.
>
> **Technical hierarchy.**
> ```
> production
>   runtime
>     - runs, with explicit state
>     - artifact sets: coordinated families, never lone files
>     - provenance recorded on every artifact
>   the model boundary
>     - interpretation proposes words and selections only
>     - deterministic code decides everything visual
>   outputs
>     - standardized renderer inputs and outputs
>     - versioned production releases
> ```

## Beat 4 · The interface

Three doors, side by side, all real:

- **People**: the brand center window: chrome dots, nav (create · library ·
  guidelines · campaigns), a work grid with two labeled thumbnails.
- **Applications**: the API panel: brand API · search API · render API ·
  workflow API, drawn as labeled endpoints with method ticks.
- **Agents**: the MCP panel: resources · tools · prompts as a mono tree, a
  waiting caret at the bottom. Drawn solid.

All three are fed from the dispatch: one dotted output leaves the exporters,
fans inside the governed boundary, and reaches each door through its own
gate. Nothing connects to the interface from a bare point on the hall wall.

Beneath all three, the substrate plinth: runtime database · object storage ·
event log.

Panel, layer 04:

> **What it does.** Provide the right interface for people, applications, and
> agents.
>
> **Comprised of.** Human surfaces · application APIs · the agent surface ·
> the runtime substrate
>
> **Technical hierarchy.**
> ```
> interface
>   human surfaces
>     - the brand center and its tools
>   application surfaces
>     - brand, search, render, and workflow APIs
>   agent surface
>     - MCP resources, tools, and prompts
>     - authenticated, scoped, recorded
>   substrate
>     - runtime database: projects, drafts, approvals
>     - object storage: generated output
> ```

## Beat 5 · Governance

The boundary itself comes forward, instruments mounted on the line:

- the lifecycle strip: draft · experimental · approved · deprecated · retired
- gate posts wherever work crosses the line, in both directions: three on the
  way out, one per interface surface, and two on the way in, where the
  compiled context and the token release enter. Nothing reaches production
  that is not approved and released; nothing leaves that is not gated. The
  fan that distributes output sits inside the boundary so each branch crosses
  at its own gate.
- the approval seat: human judgment, drawn as a seat, not a checkbox
- the exceptions register: a small bound book
- the release shelf: signed releases, checked byte for byte

Evidence returning from observability is not gated: measurement flows back
freely, it is not governed output.

Panel, layer 05:

> **What it does.** Define ownership, lifecycle, validation, approval, and
> exceptions. Automate compliance. Preserve creative judgment.
>
> **Comprised of.** Ownership · lifecycle states · automated validation ·
> human review · approvals · exceptions · release history
>
> **Technical hierarchy.**
> ```
> governance and validation
>   lifecycle
>     - draft, experimental, approved, deprecated, retired
>   automated checks
>     - claims, rights, accessibility
>     - voice, verbatim quotes, fit
>   human judgment
>     - creative review and approval
>     - intentional, documented exceptions
>   release history
>     - signed releases, checked byte for byte
>     - unintended change stops the line
> ```

## Beat 6 · Observability

The return bus along the bottom, connected at both ends: signals enter from
the interface, where every use is written to the event log on the substrate,
and travel backward past small meters reading adoption · time to output ·
overrides · search failures · rework · render errors · agent activity. They
collect at the review point, and evidence returns from there up the left
margin to the records and the tokens, and up into production. The bus stops
short of the interface lane so it never crosses the outputs card, and it
breaks where the signed-releases shelf sits on it.

Panel, layer 06:

> **What it does.** Measure adoption, friction, quality, and recurring
> behavior, and return the evidence to the people who tend the system.
>
> **Comprised of.** Adoption · time to output · overrides · search failures ·
> rework · render errors · agent activity · feedback
>
> **Technical hierarchy.**
> ```
> observability and learning
>   signals
>     - usage, overrides, failures, rework
>   records
>     - every run records itself
>     - every failure keeps its evidence
>   learning
>     - evidence returns to the people
>     - findings feed the roadmap
> ```

## Beat 7 · One job, all six layers

The demonstration run, auto-looping while the beat is active:

1. A brief arrives at the interface.
2. Intelligence retrieves positioning, audience, claims, channel voice: the
   involved records pulse.
3. Design language applies: the token stack pulses, the release flows.
4. Production executes the launch recipe: the run token crosses the workflow
   lane, renderers light in turn.
5. The gates check: one candidate blocks in rust with its evidence named, is
   redrafted, and passes. (The one rust moment. Kill on redline if unwanted.)
6. The artifact set releases: website section · social post · social graphic ·
   slide · document · email module.
7. The run writes its record; a signal travels the return bus.

## Beat 8 · The whole system, unlocked

Camera out to the full drawing, everything at full ink. The six layer chips
appear in a row; clicking a chip re-runs its spotlight and panel. The scroll
story ends; the explorer remains. No click-to-jump during the scroll (v1).

## Stage navigation and the partition (settled 2026-08-01)

- Stages advance by explicit control, never by scroll: a rail of stage
  buttons with prev and next, plus the arrow keys. The sweeping transitions
  survive intact because the camera, reveal, and spotlight are chase
  currents; navigation only moves their targets. Jumping three stages sweeps
  through the same motion grammar as stepping one.
- The layout is hard-partitioned. The text column is a reserved region the
  drawing may never enter, separated by a drawn divider, not an implied one.
  The canvas is sized to the left region, so the partition is structural: the
  drawing cannot occlude the copy because it does not share pixels with it.
- A stage's camera is authored as a world rectangle, never as a zoom number:
  the subsystem the stage is about, plus its breathing room. The fit is
  DERIVED each frame from the live region, so a dense stage genuinely zooms
  in, a larger display genuinely gains scale, and the panel releasing its
  column is just a camera move. pad keeps margin, maxZoom keeps a close-up
  from blowing past the ink density the drawing was authored at, and the
  stage rail's band is subtracted before fitting so the drawing never parks
  under the buttons.
- Anchoring is part of framing. The world ends just below the release row,
  so a centred fit on the observability band would strand a third of the
  region as bare paper: the band anchors to the bottom and the dimmed system
  above is the context. Cropping the plinth from that frame is what buys the
  band its zoom; the feed still enters from the right, labelled.
- The final stage releases the column and the system takes the whole screen;
  the stage chips unfold their titles there, and clicking any of them
  returns to that stage with its text restored. One canvas centring rule
  (dead centre, no optical drop): the fitted camera assumes it, and a 2%
  anchor bias pushes every fitted rect out the bottom of its region.

## Interaction and craft (carried from v2, tightened)

- Spotlight: selected structures at full ink, everything else at 45 percent;
  camera zooms gently toward the layer and returns.
- Five-level stroke and text hierarchy; tracked small-caps section labels;
  card anatomy with the quiet shadow; orthogonal connectors with rounded
  elbows that draw on; the dot grid beneath everything.
- Two line classes. Solid is reserved for the run itself: inside production
  the workflow belt is the only solid line, drawn wall to wall in one
  stroke. Everything else that connects is dotted: what the workflow reaches
  into (recipes, components, interpreters, renderers, the test bench) and
  every line crossing in from another layer (intelligence, design language,
  the interfaces, the evidence bus). The class, not the ink weight, is what
  distinguishes them, so a solid line holds one weight along its whole
  length and a dotted line may curve into it without the junction reading
  as a mistake. Every dotted line on the page carries the identical ink,
  whatever its caller asks for: they are one class and must read as one.
- Three line classes, then. The third is the double rule, and it belongs to
  the two layers that watch rather than make: governance and observability.
  Both are drawn as a pair of hairlines with a narrow channel between them,
  which is the printer's own answer to this problem. A double rule has always
  marked a boundary of a different order than the rules inside it, which is
  exactly the claim: these layers enclose and measure the work, they do not
  participate in it. Each line of the pair runs finer than the page's 1px
  linework (0.75) and lighter (0.34), so the two together read as one slick
  rule rather than as two lines or as a heavier one. The channel and the
  stroke are both held in screen pixels, like line width itself, so the pair
  keeps its proportion at every zoom instead of closing up when the camera
  pulls back. Colour was tried first and rejected: filling the two layers
  read as highlighting a region, and colouring their linework spent the
  page's one-ink credibility on a distinction that pattern can carry alone.
- Corners on a double rule mitre. Each side is offset along its own normal
  and the corner taken at the intersection of the offset segments, with the
  inside of a turn given the smaller radius, so the channel stays even round
  a bend. A run that turns must therefore be one path: the evidence bus's
  right-hand leg and the feed down from the substrate are a single route for
  this reason, not two that butt at the elbow.
- The rule is quiet, the fittings are crisp. Whatever breaks a double rule
  (a governance gate, a meter on the bus, the review point) stays a single
  stroke at full weight, and is never smaller than the channel it has to
  break, however far out the camera is. That floor is derived, never chosen:
  clear of the far hairline's outer edge, plus the fitting's own half stroke,
  plus a little paper. A floor picked by eye instead will quietly beat the
  world-scaled radius at every camera the reader can reach, freeze the
  fitting at a fixed screen size, and turn the smallest marks on the page
  into the largest. Above the floor a fitting keeps its authored world size,
  which is what holds the hierarchy between a station dot, a meter, and the
  terminus a whole line runs back to.
- A branch meeting a double rule stops on the trunk's near hairline. The
  centreline is the one place it must not stop: both of its rails would then
  dead-end inside the channel with the far rail left unbroken, which reads as
  puncturing the trunk rather than meeting it. The trunk's rails are screen
  offsets, so this cannot be expressed in the world coordinates a caller
  writes; the trim belongs to the router.
- The bus's traveling ticks fill the channel exactly, a slug moving between
  the two rules rather than on them, and they are drawn before the fittings
  so a tick submerges behind a meter the way it submerges behind the shelf.
- A knockout with no word in it is a hole in the drawing. Text below 4px is
  dropped rather than rendered as mush, so anything that clears paper for a
  label has to ask whether the label will actually render at the current
  camera, and skip the clearing too when it will not. The failure is silent
  and only appears at the wider beats, which is where it is least excusable.
- The lifecycle strip carries no marker beside each state. The word is the
  mark, and the rule breaking to let it through is what mounts it; which
  state is current is carried by ink alone. Every knockout on the strip is
  measured off the word it has to clear, never hardcoded, so the states can
  be set at a readable size without a fixed box cropping them.
- Everything the governed line has to say is said on it. A caption that
  describes the gates belongs set into the rule beside them, not floating in
  the margin inside the boundary, where it reads as unplaced. But a caption
  knocks the rule out for its whole measured width, so that stretch is no
  longer line: nothing may tie into it there. Anything hanging off a rule
  hangs from a clear stretch of it, and two elements added to the same rule
  in the same edit must be checked against each other before either is
  believed.
- The bottom of the board carries TWO chains and they must never share a line.
  The evidence chain: released work gets used, usage lands in the event log on
  the substrate, the bus carries it back, the feedback loop turns it into
  decisions, and those travel up into the knowledge layers. The release chain,
  on its own line below: production's finished outputs are what a release is
  made of, governance signs that set, and the signed release is announced.
  They meet in the world, not on the diagram. Both run right to left, so the
  whole bottom reads in one direction. Where the governed line reaches past
  the bus to sign a release it CROSSES, at a joint; it does not join.
- A signed release is a set of output files, so outputs is what feeds the
  register. When outputs sat unconnected, the bus threading the register was
  the only visible input and the diagram read as though telemetry produced
  releases. One missing link can make three other things look wrong.
- The release shelf is the one object both watching layers touch: governance
  signs a release, so the record is governance's and hangs off its line;
  observability returns evidence about it, so the bus runs through it. Its
  place on the bus is load-bearing, not decorative. Reading the bus in its
  own direction, right to left, signals leave the interface, pass the meters,
  are bound to a specific signed release, and only then reach the people at
  the review point.
- Where two double rules cross, they do not overprint. Four separate crossings
  read as two systems laid over each other; the joint stops both rails of each
  rule at the other's channel and draws the four corners back in, so the two
  channels open into one another and what reads is a single continuous run of
  pipe. A joint belongs to both layers it joins, so it takes whichever of them
  is the more lit rather than dimming with one while the other stays bright.
- A line that ends in a bare circle claims to be a station. Where a line
  terminates in something the system actually does, it terminates in a card
  that names it: the evidence bus runs into the seat where people read it, and
  the return artery leaves that card rather than a point on the line.
- Signed releases are frozen files, not a recipe for making them again.
  Approved work is hashed and stored; it is never regenerated, so a release is
  a thing rather than a procedure. Re-rendering therefore is not a correctness
  check on the artifact, it is a drift alarm on the system: it says the tokens
  or the renderers have moved underneath approved work and it needs re-approving.
  Do not claim work is "checked byte for byte" without saying against what.
- Verify by asserting, not by looking. Render once and read device pixels
  against named invariants (a rule has two rails at the declared spacing, a
  branch leaves no ink in the trunk's channel, a wall has no notch, a plate
  always has a word in it). Looking at pictures catches only what you thought
  to look at, and a picture of a canvas is not evidence of its geometry.
- Verify line craft by reading pixels, not by looking at an enlargement. The
  canvas backs at dpr = min(2, devicePixelRatio); a screenshot taken above
  that upscales the bitmap and returns every hairline fatter and softer than
  it is, which will send you chasing weight that was never there.
- A line meeting a card simply lands on its edge: no port dot. Circles are
  reserved for the workflow stations, each drawn with a thin inner ring, so
  a circle on this page always means a stop on the run.
- Station labels are always centered under their dots. Where a line must
  cross a label, the label sits on a paper knockout and the line passes
  behind it; the render label and the boundary-pinned renderers tag are
  the canonical cases. Canvas text is middle-baseline: a label's y is its
  vertical center.
- Ambient life at rest: the production run token and the return-bus ticks
  only. Everything else is still.
- Desktop only; narrow screens and reduced motion get the classic page
  (alignment of the classic page to this doctrine comes after sign-off).

## Redline outcomes (settled 2026-07-30)

1. Google Workspace is the intelligence-authoring connection (Google mark).
2. Higgsfield is the video renderer connection (typographic chip).
3. Workflow stops revised (2026-07-31, his correction): request → context
   assembly → render → validate → review → release, with interpretation
   drawn as checkpoints between stations, not as one station: "wouldn't
   there be multiple interpretation checkpoints throughout the workflow?"
4. Brand center nav stands: create · library · guidelines · campaigns.
5. The fragment inventory stands.
6. The demo output list stands.
7. Recipes: blog campaign · branded document · slide deck · event campaign ·
   newsletter.
8. Copy never says "brand-agnostic"; where the idea appears it reads plainly:
   no brand baked in.
9. Interpreters are a first-class production section (2026-07-31): a thin
   rail between the workflow and the renderers, tapped by the interpretation
   checkpoints. Two seats, both filled: Anthropic and OpenAI. The empty
   socket that once stood for "built for multiple" is cut; two named seats
   make the point without the placeholder.
