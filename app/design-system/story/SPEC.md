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
- The drawing lives on canvas; panel text lives in HTML so it is always crisp.
- The record and chat are removed. The page is the system.

## The master visual (the end state everything works backward from)

Left lane: Brand intelligence above Design language.
Center: the production hall, the largest structure.
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
- gate posts at production's exit and at each interface door
- the approval seat: human judgment, drawn as a seat, not a checkbox
- the exceptions register: a small bound book
- the release shelf: signed releases, checked byte for byte

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

The return bus along the bottom: small meters reading adoption · time to
output · overrides · search failures · rework · render errors · agent
activity. Signal ticks travel backward continuously, collect at a review
point, and feed three lines back into the records, the tokens, and the
recipes.

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
