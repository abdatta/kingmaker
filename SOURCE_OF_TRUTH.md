# Kingmaker — Source of Truth

> The single document an AI agent should read **before touching this repo**.
> It is the contract between the product idea, the demo it has to deliver, and
> the code that backs both. If a request contradicts something here, surface
> the contradiction before making the change.

---

## 0. How to read this document

**Sections you must internalize before writing code:**

- §1 — what the product is and what problem it solves
- §2 — the federal-proposal domain vocabulary (statuses, phases, volumes)
- §3 — routing and information architecture
- §6 — design tokens
- §8 — the AI rail contract
- §10 — the canonical demo path (the one beat the product is choreographed for)

**Sections you can look up on demand:** §4 (fixture detail), §7 (component
inventory), §11 (file map).

**Anti-patterns are called out in §9.** Read them first.

---

## 1. Product

### 1.1 What Kingmaker is

A web workspace that runs the **federal-proposal lifecycle** for small R&D
primes (SBIR / STTR / OT-eligible shops). It ingests opportunities from a
discovery agent, drives each one through a 10-step workflow tailored to the
agency's actual submission format, and surfaces the next decision the team
needs to make — with an AI right-rail that is *screen-aware*, not a generic
chat box.

### 1.2 Who it's for

The reference persona is **OpalAI** — a 9-person federal R&D prime running:

- DARPA ALIAS-Texas SBIR XL (9 days out, $3.5M ceiling, *the hero proposal*)
- NASA SBIR EXPAND.3.S26B (17 days out, $150K)
- 3 USDOT FY26 SBIR Phase I topics in **Pre-Solicitation** (Q&A window
  closes May 29)
- 5 other proposals at various stages of the lifecycle

PI of record: **Ryan Alimo (CEO)**. Founder. JPL veteran. Always logged in
in the prototype (top-left sidebar identity).

### 1.3 The problem

A 4-week federal proposal response is won or lost on **format compliance**,
**team allocation**, and **partner coordination**. The cost of getting any
of those wrong on submission day is the entire ceiling. Generic PM tools
don't model the agency cycle, so this work falls into spreadsheets, Drive
folders, Slack threads, and the PI's head.

### 1.4 The throughline (what every feature has to reinforce)

> "Federal proposal ops is *agency-cycle work* — different rules per agency,
> hard deadlines, no second chances. Kingmaker is the workspace that runs
> on that cycle."

If a feature doesn't reinforce that thesis, it doesn't belong in the
prototype.

---

## 2. Domain model

Vocabulary an agent must use correctly. **These are real federal terms; do
not paraphrase them.**

### 2.1 Opportunity statuses (lifecycle order)

| # | Status              | Meaning                                                                    | Tone   |
|---|---------------------|----------------------------------------------------------------------------|--------|
| 1 | **Pre-Solicitation**| Agency posted a topic. Q&A window is open. Submission has not yet opened. | `sky`  |
| 2 | **Saved**           | Flagged for later, not actively pursuing.                                  | `slate`|
| 3 | **New**             | Just ingested by the discovery agent, awaiting triage decision.            | `sky`  |
| 4 | **In Triage**       | Pursue / reject decision is being made.                                    | `amber`|
| 5 | **Scoping**         | Pursued. Defining requirements, partners, gaps.                            | `sky`  |
| 6 | **Drafting**        | Actively writing the proposal.                                             | `cyan` |
| 7 | **In Review**       | Draft complete, internal sign-off pending.                                 | `amber`|
| 8 | **Selected**        | Agency picked us (Phase I → Phase II setting).                             | `cyan` |
| 9 | **Submitted**       | Proposal sent. Waiting on agency.                                          | `emerald` |
|10 | **Execution**       | Won + executing the period of performance.                                 | `emerald` |
|11 | **Archived**        | Closed out.                                                                | `slate`|
|12 | **Ready**           | Ready-for-submission gate cleared (rarely shown in fixtures).              | `emerald` |

The Pipeline screen sorts by this rank order
([`pipeline.jsx`](src/pipeline.jsx) `STATUS_RANK`). The 9 statuses actually
present in fixtures are 1, 2, 4, 5, 6, 7, 8, 9, 10 — see §4.2.

### 2.2 The 10-step opportunity workflow

Every opportunity workspace exposes the same 10 steps:

| # | id              | Label          | What it owns                                              |
|---|-----------------|----------------|-----------------------------------------------------------|
| 1 | `intake`        | Intake         | Solicitation source, posted/closes dates, context         |
| 2 | `triage`        | Triage         | Pursue/reject decision (or 3-axis for Pre-Solicitation)   |
| 3 | `scope`         | Scope          | Requirements ↔ capabilities matrix, identified gaps       |
| 4 | `collaborators` | Collaborators  | Suggested + accepted external partners / subcontractors   |
| 5 | `draft`         | Draft          | Section drafting (Tech Approach, etc.) with AI mix        |
| 6 | `tasks`         | Tasks          | Team allocation table (this proposal's contributors)      |
| 7 | `timeline`      | Timeline       | Gantt-style 4-week schedule with risk bands               |
| 8 | `budget`        | Budget         | Line-item builder, indirect calc, **AI trim suggestion**  |
| 9 | `assembly`      | Assembly       | Format-aware Volume 2 outline (varies by agency)          |
|10 | `submission`    | Compliance     | Pre-submission gate — volumes + format rules + checklist  |

Note the URL segment for the **Compliance** step is `submission` (legacy
naming preserved to avoid breaking links). The label shown to the user is
"Compliance" — set in [`data.js`](src/data.js) `STEPS`.

### 2.3 Pre-Solicitation triage uses a different model

For statuses 1 (Pre-Solicitation), `triage` does **not** render a
pursue/reject card. It renders OpalAI's three-axis framework:

- **Fit** — capability adjacency to the topic
- **Win Probability** — based on competitive signal and prior award history
- **Strategic Value** — alignment with product roadmap

Plus a **Hit list** (what to source: LOIs, data feeds, partners) and **Key
risks**, plus a **Q&A Question** task type with a `qaDeadline` (public
window — content becomes visible to all competitors). See `UsdotTriagePanel`
and `QATaskCard` in [`workspace.jsx`](src/workspace.jsx).

### 2.4 Agency-specific submission formats (the killer detail)

Submission Volume 2 changes shape per agency. This is the second most
important demo point after the budget reflow.

| Opportunity | Volume 2 format     | `vol2Format` key    |
|-------------|--------------------|---------------------|
| ALIAS-Texas | White Paper (≤20pp) **+** 15-slide deck with 2 mandatory DARPA-template Quad Charts | `wp_deck`           |
| NASA EXPAND | Standard 10-section Technical Volume, **≤5pp hard cap** | `nasa_standard`     |

These drive both `AssemblyPanel` (Step 9) and `CompliancePanel` (Step 10).
DARPA's Compliance also flags **Volume 7 (Foreign Affiliations) as a DSIP
webform — not a PDF**, the single most memorable "you'd lose a cycle over
this" detail in the demo.

### 2.5 Team and load

10 fixtures in `TEAM`. Each has `availability` ∈ [0, 1] where lower means
more loaded. Bottleneck signal: **Niloufar Abolfathian is at 0.45** because
she's PI on NASA INNOVATE FIRE-WUI and pulled 40% into ALIAS — visible in
both Team & Capabilities and the ALIAS workspace Tasks step.

`ALIAS.tasks` is the only fixture with detailed cross-proposal allocation.
The Team page clicks resolve via this priority: ALIAS.tasks → owned
proposal → bio fallback. See `TeamScreen.onPersonClick` in
[`other-screens.jsx`](src/other-screens.jsx).

---

## 3. Information architecture

### 3.1 Routes

| Path                            | Screen                            | Notes                                            |
|---------------------------------|-----------------------------------|--------------------------------------------------|
| `/welcome`                      | Brand splash                      | **Chrome-less** (no sidebar / topbar / AI rail)  |
| `/`                             | Dashboard                         |                                                  |
| `/pipeline`                     | Pipeline / opportunity feed       | Sorted by `STATUS_RANK`                          |
| `/reviews`                      | My Reviews — approval queue       | Same `NEEDS` data as Dashboard panel             |
| `/team`                         | Team & Capabilities               | Cards click → Tasks step of relevant opp         |
| `/kb`                           | Knowledge Base                    | Past proposals, reuse markers                    |
| `/settings`                     | Settings                          | Org info, ITAR / CAGE / UEI, source-feed status  |
| `/opp/:oppId`                   | (redirect)                        | `<Navigate to="budget" replace />`               |
| `/opp/:oppId/:step`             | Opportunity workspace             | `:step` is one of the 10 `STEPS` ids             |
| `*`                             | (redirect to `/`)                 |                                                  |

### 3.2 Why `BrowserRouter` (not `HashRouter`)

The app is deployed to GitHub Pages at a sub-path
(`https://<user>.github.io/<repo>/`). `vite.config.js` reads `VITE_BASE`
from env; the workflow injects `/<repo>/`. `src/main.jsx` derives a Router
`basename` from `BASE_URL`. The deploy workflow also copies
`dist/index.html` → `dist/404.html` so deep links survive a hard refresh.

### 3.3 The welcome splash

`/welcome` is the only route that bypasses the app shell. Used as the demo
intro and outro. Clicking the Kingmaker wordmark in the sidebar navigates
to it. The brand splash holds: gemstone + `KINGMAKER` wordmark + tagline
*"Mission control for federal R&D proposals."* + subtitle *"From discovery
to submission, on the agency's cycle."* + footer *"Built for Mars.
Deployed on Earth."*

Implementation in [`welcome.jsx`](src/welcome.jsx); rendered early in
[`App.jsx`](src/App.jsx) before the shell return.

---

## 4. Data fixtures (canonical state)

All fixtures live in [`src/data.js`](src/data.js). **Do not split this
file** — keeping every fixture in one place is intentional so an agent can
ground-truth the demo by reading one module.

### 4.1 `TEAM` (10 people)

| id          | Name                          | Role                         | Availability |
|-------------|-------------------------------|------------------------------|--------------|
| `ryan`      | Ryan Alimo                    | CEO / Principal Investigator | 0.62         |
| `alison`    | Alison Olmstead               | COO / CFO                    | 0.78         |
| `niloufar`  | Niloufar Abolfathian          | Lead Scientist               | **0.45** *(bottleneck)* |
| `ertugrul`  | Ertugrul Taciroglu            | CIO                          | 0.68         |
| `larry`     | Larry James                   | Strategic Advisor (Lt. Gen.) | 0.92         |
| `aria`      | Aria Chen                     | Senior ML Engineer           | 0.30         |
| `darius`    | Darius Whitfield              | Proposal Manager             | 0.55         |
| `atharv`    | Atharv Arya                   | Research Analyst             | 0.65         |
| `priya`     | Priya Raman                   | Research Engineer            | 0.40         |
| `jpl`       | Federico Rossi (JPL)          | Subcontractor — JPL          | 0.20         |

### 4.2 `OPPORTUNITIES` (11 rows, in fixture order)

| id              | Title                                                | Agency  | Status            | Owner       |  $   | Days | Notes |
|-----------------|------------------------------------------------------|---------|-------------------|-------------|------|------|-------|
| `alias-tx`      | ALIAS Missionized Autonomy for Emergency Services    | DARPA   | Drafting          | `ryan`      | 3.5M | 9    | **Hero proposal.** `vol2Format: 'wp_deck'`. ALIAS-Texas SBIR XL. Has populated `ALIAS` workspace fixture. |
| `expand`        | Autonomous Onboard Health Mgmt for Small Spacecraft  | NASA    | Scoping           | `niloufar`  | 150K | 17   | `vol2Format: 'nasa_standard'`. Second populated COMPLIANCE/ASSEMBLY fixture. |
| `innovate-firewui` | NASA INNOVATE FIRE-WUI                            | NASA    | Submitted         | `niloufar`  | 850K | −3   | Submitted (past deadline). |
| `urbanomy-p2`   | USDOT Urbanomy Phase II                              | USDOT   | Execution         | `ertugrul`  | 2M   | −67  | Awarded. |
| `spwx`          | NASA SPWX.1.S26A                                     | NASA    | **In Review**     | `ryan`      | 150K | 41   | Only In-Review fixture (added for demo Pipeline beat). |
| `nsf-p1`        | NSF SBIR Phase I                                     | NSF     | Selected          | `niloufar`  | 305K | 19   |       |
| `afwerx-d2p2`   | AFWERX STTR Direct-to-Phase II                       | AFWERX  | In Triage         | `ryan`      | 1.7M | 33   |       |
| `nsf-conv`      | NSF Convergence Accelerator                          | NSF     | Saved             | `alison`    | 750K | 67   |       |
| `usdot-os2`     | Freight Corridor Predictive Intelligence             | USDOT   | Pre-Solicitation  | `ryan`      | 200K | 23   | 3-axis triage. **Pursued** by Ryan, May 6. |
| `usdot-os1`     | Predictive Safety Analytics for Commercial Transport | USDOT   | Pre-Solicitation  | `ryan`      | 200K | 23   | 3-axis triage. |
| `usdot-fh1`     | Edge AI-V2X Congestion Prevention                    | USDOT   | Pre-Solicitation  | `ryan`      | 200K | 23   | 3-axis triage. |

Solicitation numbers (`sol`) are **real public IDs** where possible. Don't
fabricate substitutes; if you need a new opp, use a real solicitation or
clearly mark it as fiction (e.g. `XYZ-FY27-DEMO`).

### 4.3 `NEEDS` (the queue powering Dashboard + My Reviews)

9 rows. Three Pre-Solicitation USDOT items (group with `routeStep: 'triage'`
and `ownerOverride: 'atharv'`), four ALIAS items, two EXPAND items, one
AFWERX. Urgencies: `high`, `medium`, `review`, `low`. The Dashboard maps
urgency → dot color and respects `routeStep` for click navigation.

The single demo-critical row is `na4` —
**"DARPA ALIAS-Texas SBIR XL: Budget v2 ready for your review"** (urgency
`medium`, 14m ago, daysLeft 9). It's the entry into the hero beat. Do not
delete or rename it.

### 4.4 `ALIAS` (the deeply populated workspace fixture)

The only opportunity with full fixture coverage of every workspace step.
Sub-objects:

- `triage` — rationale + decision stamp + 2 team comments
- `scope` — 11 requirements (Technical / Compliance / Submission groups), 7
  capability rows, 3 named gaps with `recommendation` text
- `collaborators` — 4 partners (`lockheed`, `jpl`: accepted; `rain`,
  `csiro`: pending AI suggestions)
- `sections` — 7 sections with `pct` + `status`
- `draft` — 4 Technical Approach paragraphs mixed `approved` /
  `edited` / `ai` / `ai`
- `draftSuggestions` — 3 AI rail cards for the drafting step
- `tasks` — 6 contributors with `alloc` and `current` load
- `timeline` — 8 Gantt bands across 4 weeks + 7 dependency edges

If a demo flow asks for content in a non-ALIAS opp's workspace step that
isn't `intake` / `triage` / `assembly` / `submission`, **the ALIAS fixture
will be rendered as a fallback** (see `workspace.jsx`). This is acceptable
for the demo but call it out if you're shipping a non-demo build.

### 4.5 `COMPLIANCE` (per-opportunity format)

Keyed by `oppId`. Currently only `alias-tx` and `expand` have entries. Each
has:

- `volumes[]` — agency volume structure (DARPA 7-vol DSIP vs NASA 8-section
  NSPIRES). DARPA's Volume 7 carries `webform: true`.
- `format[]` — solicitation format rules (font, page limits, etc.)
- `checklist` — three groups: *Letters of Support*, *Registration & Admin*,
  *Pre-Submission*. Each row has `id`, `label`, `ok`, `meta`.
- `keyDates[]` — solicitation dates
- `aiSuggestions[]` — `{ kind: 'warn' | 'info' | 'nudge', text }` — drives
  the AI rail when on the Compliance step

### 4.6 `ASSEMBLY_FORMAT` (per-opportunity Volume 2)

Keyed by `oppId`. Two shapes:

- `kind: 'wp_deck'` — `whitePaper { pageLimit, pages, sections[] }` +
  `deck { slideLimit, slides, mandatory[] }`. Each deck mandatory item
  optionally carries `template: 'DARPA template required'` (slides 9, 10).
- `kind: 'nasa_standard'` — flat `sections[]` with `status`.

`AssemblyPanel` picks renderer by `kind`.

### 4.7 `DISCOVERY_AGENT`

The trust-builder. 9 explicit filter-log entries (7 USDOT rejections + 1
SAM.gov prime-only + 1 DOD classified). `scanned: 47`, `surfaced: 3`,
`filtered: 44`, `hidden: 39` (the "Show 39 more" affordance).

### 4.8 `BUDGET_LINES_INITIAL` + `BUDGET_INDIRECT_RATE`

10 line items across 5 categories (Personnel / Subcontracts / Equipment /
Cloud / Travel). Direct cost total: $1,129K. Indirect rate 0.67 → indirect
$756K. Total: ~$1.89M against a $3.5M ceiling. **Note**: the AI rail
suggestion says *"100% of ceiling"* — this is intentional fixture-vs-text
drift to make the demo line land; do not "fix" the math.

### 4.9 `KB`, `AI_FEED`, `FUNNEL`, `READINESS_INITIAL`, `ASSEMBLY`

Smaller fixtures supporting the KB screen, the Dashboard's "Kingmaker
activity" panel, the funnel chart, the original (pre-format-aware) Submission
Readiness checklist, and the legacy Assembly outline. All are static and
mostly cosmetic.

---

## 5. Interactive state (what mutates)

All mutable state lives in [`App.jsx`](src/App.jsx) `App()` — there is no
backend, no `localStorage` persistence (except the Tweaks panel's edit-mode
postMessage protocol).

| State                       | Type      | Effect when it changes                                                  |
|-----------------------------|-----------|-------------------------------------------------------------------------|
| `budgetTrimmed`             | `bool`    | Reflows budget lines (`× 0.98`), flips ALIAS topbar status `Drafting → In Review`, marks budget step `done`. **The hero mutation.** |
| `aiDecisions`               | `{id: 'accepted'\|'rejected'}` | Each AI rail card's accept/reject state. Card `budget-trim` accepted also flips `budgetTrimmed`. |
| `sectionApprovals`          | `{id: 'approved'}` | Per-section approval on the Draft step. Seeded with `execsum: 'approved'`. |
| `readiness`                 | `[]`      | Submission-readiness checklist mutations (legacy panel).                |
| `collabDecisions`           | `{id: 'accepted'\|'rejected'}` | Collaborator accept/reject (Step 4).               |
| `triageDecided`             | `bool`    | Defaults to `true` (Ryan already pursued ALIAS). Currently no UI to flip back. |
| `collapsedSidebar`          | `bool`    | Sidebar width 240px ↔ 64px.                                              |
| `collapsedRail`             | `bool`    | AI rail width 320px ↔ 48px. Bound to `t.showAIRail` Tweak.              |
| `activeSection`             | `'tech'`  | Which section is active in the Draft step.                              |
| `aliasStatus` (derived)     | `string`  | `budgetTrimmed ? 'In Review' : 'Drafting'`. Wired into TopBar via `opp` prop. |
| `activeStep` (URL-derived)  | `string`  | From `:step` segment of `/opp/:oppId/:step`, defaults to `'budget'`.    |

**Reset path**: the Tweaks panel's *Reset demo state* button (bottom-right
floating panel, gear icon) clears `budgetTrimmed`, `aiDecisions`,
`sectionApprovals`, `readiness`, and navigates to `/opp/<current>/budget`.

---

## 6. Design system

### 6.1 Color tones (the seven)

All UI tone is one of: `cyan`, `violet`, `emerald`, `amber`, `rose`, `sky`,
`slate`. **Don't introduce new color tones** — extend the token tables in
[`primitives.jsx`](src/primitives.jsx) if you must.

| Tone     | Used for                                                              |
|----------|-----------------------------------------------------------------------|
| `cyan`   | Primary accent. Active, "go", in-progress positive states. Buttons.   |
| `violet` | **AI marker.** Every AI-generated or AI-suggested element wears it.   |
| `emerald`| Success / approved / accepted / submitted.                             |
| `amber`  | Warning, in-review, attention-medium.                                  |
| `rose`   | Risk, urgent (≤14 days), rejected, high load.                          |
| `sky`    | Cool informational. Pre-Solicitation status, deadlines >30d.           |
| `slate`  | Neutral surface, submitted/saved/archived, disabled.                   |

### 6.2 Tone tokens

Defined in [`primitives.jsx`](src/primitives.jsx) lines 6–35. Five maps:

- `TONE_BG`     — pill / chip background + ring + text
- `TONE_DOT`    — bullet/dot/progress fill
- `TONE_TEXT`   — standalone colored text
- `TONE_BORDER` — card / divider border
- `TONE_AVATAR` — avatar background + ring (subtler than TONE_BG)

### 6.3 Status → tone map

`STATUS_TONES` in [`data.js`](src/data.js:46). When a status is missing
from the map, `StatusPill` falls back to `slate`.

### 6.4 Deadline-chip thresholds

`DeadlineChip` (in [`primitives.jsx`](src/primitives.jsx:148)):

- `days < 0` → `slate` `Pill` with check icon, label `submitted`
- `days ≤ 14` → `rose`
- `days ≤ 30` → `amber`
- `days > 30` → `sky`

### 6.5 Urgency dots (Dashboard / Reviews queue)

```
high   → bg-rose-400
review → bg-amber-400
medium → bg-amber-400
low    → bg-sky-400
```

### 6.6 The violet AI border

Any UI element generated by or suggested by Kingmaker AI carries a violet
left-border. Two implementations:

- `AICell` — a left-border via absolute span (used in narratives)
- `AISuggestionCard` — left-border + colored ring (used in the rail)

Plus the `AIBadge` Pill for inline tagging (used in budget lines, draft
paragraphs, etc.). This convention is non-negotiable — it's how the user
distinguishes AI work from human work at a glance.

### 6.7 Type and density

- Base font size: 13px (tight)
- Headers: typically 22px / `font-semibold` / `text-slate-100`
- Section eyebrows: `text-[10–11px] uppercase tracking-[0.14em] text-slate-500`
- Inline `Mono` for solicitation numbers, money, IDs
- Density is *compact* by default (a Tweak toggles it, but no component
  currently reads `t.density` — it's a placeholder for future)

### 6.8 Layout

- Designed for **1440×900 desktop**. Narrower viewports compress columns
  but don't reflow — there is no responsive layout. The screenshot script
  uses 1440×900 @ 2× device-scale.
- Top bar 56px, sidebar 240px (collapsed 64px), AI rail 320px
  (collapsed 48px), content max-width usually `1180px`.

---

## 7. Components inventory

### 7.1 Primitives — [`primitives.jsx`](src/primitives.jsx)

`Pill`, `StatusPill`, `Avatar`, `AvatarStack`, `Card`, `CardHeader`,
`Button` (`primary` | `accept` | `reject` | `modify` | `ghost` | `outline` |
`danger` | `ai`; sizes `xs` | `sm` | `md` | larger), `MoneyMono`, `Mono`,
`ProductPill`, `StageDots`, `DeadlineChip`, `AICell`, `AIBadge`,
`ProgressBar`, `KBD`, `SectionHeading`.

**Important**: `Card` forwards `onClick` and other props (added during
the Team-grid one-click fix). `<Card as="button" onClick={…}>` is the
clickable-card pattern.

### 7.2 Icons — [`icons.jsx`](src/icons.jsx)

A lucide-flavored inline-SVG icon set under the `Icon.*` namespace. ~40
icons. No external dependency. If you need an icon not in the set, add a
new `<I>` wrapper rather than importing `lucide-react`.

### 7.3 Shell — [`shell.jsx`](src/shell.jsx)

`Sidebar`, `Breadcrumbs`, `TopBar`, `AISuggestionCard`, `AIRail`.

- `Sidebar` takes `route`, `onNavigate`, `collapsed`, `onToggleCollapse`,
  `reviewBadge`, `onOpenWelcome`. The wordmark navigates to `/welcome`; a
  small chevron handles collapse.
- `TopBar` accepts a live `opp` prop; falls back to `OPPS_BY_ID` if not
  provided. **Always pass `opp` from App** so derived statuses (e.g.
  `aliasStatus`) flip the TopBar pill.
- `AIRail` is screen-aware via the `suggestions` and `contextLabel` props.

### 7.4 Screens

- [`dashboard.jsx`](src/dashboard.jsx) — KPI strip, Discovery Agent panel,
  Needs Your Attention queue, funnel chart, upcoming deadlines, AI feed.
- [`pipeline.jsx`](src/pipeline.jsx) — sorted opportunity table, filter
  dropdowns, bulk select strip.
- [`workspace.jsx`](src/workspace.jsx) — `WorkspaceParts` namespace
  exporting `StepNav`, `IntakePanel`, `TriagePanel`, `UsdotTriagePanel`
  (subcomponent), `ScopePanel`, `CollaboratorsPanel`, `DraftPanel`,
  `TasksPanel`, `TimelinePanel`.
- [`other-screens.jsx`](src/other-screens.jsx) — `BudgetPanel`,
  `AssemblyPanel` (+ `AssemblyWpDeck`, `AssemblyNasaStandard` subrenderers),
  `CompliancePanel`, `TeamScreen` (+ `PersonDetail`), `KBScreen`,
  `ReviewsScreen`, `SettingsScreen`. Note the local `Row` helper.

### 7.5 Welcome — [`welcome.jsx`](src/welcome.jsx)

Chrome-less brand splash with radial gradient background. Used as demo
intro and outro.

### 7.6 Tweaks — [`tweaks-panel.jsx`](src/tweaks-panel.jsx)

Floating draggable panel for live UI fiddling. `useTweaks`, `TweaksPanel`,
`TweakSection`, `TweakRow`, `TweakToggle`, `TweakRadio`, `TweakSelect`,
`TweakText`, `TweakNumber`, `TweakSlider`, `TweakColor`, `TweakButton`.
Communicates with a host frame via `postMessage(__edit_mode_*)`. Harmless
when standalone. **Do not remove the postMessage code** — it's the
integration surface for the design-tool host.

### 7.7 Error boundary — [`error-boundary.jsx`](src/error-boundary.jsx)

`RouteErrorBoundary` wraps `<Routes>`. Catches render-time exceptions in a
screen so the shell keeps working and the user can navigate away. Resets
automatically when the URL changes.

---

## 8. AI rail contract

The screen-aware right rail is a *load-bearing product surface*. Treat it
like first-class UI, not a chat sidebar.

### 8.1 Suggestion shape

```js
{
  id:    string,          // stable, used to track accept/reject state
  kind:  'enhance' | 'risk' | 'reuse' | 'decision' |
         'partner' | 'schedule' | 'budget' | 'note',
  title: string,
  body:  string,
  acceptedNote?: string,  // optional copy shown after Accept (e.g. budget-trim)
}
```

### 8.2 `kind` → visual mapping

Mapped in `AISuggestionCard` ([`shell.jsx`](src/shell.jsx:194)):

| `kind`     | Tone     | Icon            | Label         |
|------------|----------|-----------------|---------------|
| `enhance`  | `cyan`   | `Sparkles`      | Enhancement   |
| `risk`     | `amber`  | `AlertTriangle` | Risk          |
| `reuse`    | `violet` | `Layers`        | Reuse         |
| `decision` | `cyan`   | `Brain`         | Decision      |
| `partner`  | `violet` | `Link`          | Partner       |
| `schedule` | `sky`    | `Calendar`      | Schedule      |
| `budget`   | `amber`  | `Dollar`        | Budget        |
| `note`     | `slate`  | `Activity`      | Note          |

### 8.3 Where suggestions come from

`suggestionsForView()` in [`App.jsx`](src/App.jsx:144). It branches on
`route.screen`, then on `activeStep` for workspaces. Some opportunities
have inline `aiSuggestions[]` (USDOT triage, COMPLIANCE per-opp) that get
mapped to this shape.

### 8.4 Hero card: `budget-trim`

The card with `id: 'budget-trim'` is wired in `App.decideAI()` to flip
`budgetTrimmed = true` when accepted. **Do not rename this id.**

### 8.5 Accept / Reject / Modify semantics

- **Accept** — runs side effect (if any) + tags the card emerald
- **Reject** — tags the card rose and dims it
- **Modify** — no-op in the prototype (the design surface for "edit before
  accept" doesn't exist yet)

### 8.6 Activity feed

Below the suggestion list, the rail shows the last 5 entries of `AI_FEED`.
Read-only.

---

## 9. Conventions an agent must respect

### 9.1 Don't break the demo path

Section 10 is the canonical 3:00 walkthrough. Before any change, confirm
it still works. The most fragile beats:

- Clicking *Budget v2* in Needs Your Attention lands at `/opp/alias-tx/budget`
  with the *Trim 2%* AI card visible
- Clicking *Accept* on the trim card reflows the budget AND flips the
  TopBar status pill
- Clicking *Pipeline* shows USDOT Pre-Solicitation rows at the top in the
  exact script order (see §10)
- Clicking any ALIAS team member on Team & Capabilities lands at
  `/opp/alias-tx/tasks`

### 9.2 No backend-y assumptions

There is **no API**. No fetch, no auth, no persistence (beyond React
state and the Tweaks `postMessage` channel). Don't add a backend stub for
"realism" — the fixtures *are* the source of truth.

### 9.3 Don't expand the design surface

Stay within the 7-tone palette and the existing primitive set. If a
component you need doesn't exist, add it to `primitives.jsx`. If you find
yourself reaching for shadcn/MUI/Headless UI, stop — the prototype's
visual coherence depends on hand-built primitives.

### 9.4 Don't paraphrase domain terms

Pre-Solicitation, In Triage, DSIP, NSPIRES, OSDMP, SF-424, DSP-83, CMMC,
ITAR, CAS, CCR, Quad Chart, TCSP — these are real terms with specific
meanings. Don't softened or genericize them in copy. Spelling is
load-bearing.

### 9.5 Numbers are choreographed

Several "wrong" numbers exist on purpose to make the demo land:

- AI rail says *"100% of ceiling"* but the budget is actually 54% — keep
  the AI copy as-is; the *story* is what the reviewer sees, not the math.
- Niloufar's availability is 0.45 → label says *"55% used"* (one minus).
- `STATUS_RANK` was deliberately reordered to match the spoken demo
  script, not strict cycle chronology (Saved comes before New).

Don't "fix" these without confirming the demo still flows.

### 9.6 Vite base path

`vite.config.js` reads `VITE_BASE`. Locally it's `/`. In the GitHub Pages
workflow it's `/<repo>/`. `main.jsx` derives the Router `basename` from
`BASE_URL`. If you add a new asset reference, **make it relative or use a
leading slash that Vite can prefix** — never hardcode `https://`.

### 9.7 PWA service worker

`vite-plugin-pwa` in `autoUpdate` mode. The SW precaches the built bundle.
If you change manifest fields, you change the install identity — bump the
icon-asset generator if changing icons.

### 9.8 PRs and commits

Commits should match the existing tone: imperative present tense,
explanation of *why* the change exists, mention any latent bugs the change
surfaced. The git history (see `git log`) is the canonical reference for
the style.

---

## 10. The canonical 3-minute demo path

This is what the product is choreographed for. Memorize it.

| Beat                                    | Time   | Route                          | Action                                                                     |
|-----------------------------------------|--------|--------------------------------|----------------------------------------------------------------------------|
| Intro (welcome splash)                  | 0:10   | `/welcome`                     | Pre-loaded. Click *Enter workspace →*                                       |
| Feature 1 — Dashboard + Discovery Agent | 0:45   | `/`                            | Pan KPIs → expand *View filter log* → read 2 rejections                    |
| Feature 2 — Pipeline (status walk)      | 0:30   | `/pipeline`                    | Pan down Status column: Pre-Sol ×3 → Saved → Triage → Scoping → Drafting → In Review → Selected → Submitted → Execution |
| Feature 3 — My Reviews (hero)           | 1:15   | `/reviews` → `/opp/alias-tx/budget` | Click *Budget v2* row → on budget step, *Accept · trim 2%* → watch reflow + topbar status flip |
| Feature 4 — Team & Capabilities         | 0:25   | `/team` → `/opp/alias-tx/tasks` | Click Niloufar's card → lands on team allocation showing her 40% pull on ALIAS |
| Outro (welcome splash)                  | 0:10   | `/welcome` (via logo click)    | Click Kingmaker wordmark → splash → outro line                              |
| **Total**                               | **3:00** |                              |                                                                            |

The Tweaks panel (gear icon, bottom-right) has a *Reset demo state* button
for repeat takes.

---

## 11. Known gaps / non-features

Things that look like they should exist but don't, by design or by neglect:

- **No backend.** State resets on reload (except the SW-cached shell).
- **Workspace step content beyond ALIAS** is mostly stubbed: Intake/Triage
  for `expand` and the USDOT cohort render correctly, but Scope, Draft,
  Tasks, Timeline still use ALIAS fixtures regardless of which opportunity
  you opened. (Assembly + Compliance are correctly format-aware.)
- **The `Modify` button on AI cards** is decorative.
- **Search bar in the top bar** (`⌘K`) is decorative.
- **`Add opportunity`, `Invite teammate`, `Sync now`, `Compile PDF`,
  `Reassign`, `Add reviewer`** buttons are decorative.
- **The Tweaks panel's `density` toggle** is read but never applied — no
  component branches on `t.density`. Same for `accent`.
- **Notifications bell** in the TopBar is a static red dot.
- **My Reviews** is a thinner copy of the Dashboard's Needs queue (same
  data, different presentation). Acceptable redundancy for the demo.
- **The `READINESS` and legacy `ASSEMBLY` fixtures** are unused by current
  panels but preserved for backwards compat with the original prototype.

**Roadmap-shaped things to leave for the user to ask about**: real
solicitation ingest, real-time multi-user collab, actual DSIP/NSPIRES
integrations, exporting to PDF, document review flows, RFC for the AI
right-rail card schema, role-based access control.

---

## 12. File-level map

```
src/
  main.jsx              Entry. Registers PWA service worker. Mounts
                        <App/> inside <BrowserRouter basename={…}/>.
  App.jsx               Root component. Owns all mutable state and
                        suggestionsForView(). Renders shell + Routes,
                        or <Welcome/> when pathname === '/welcome'.
  welcome.jsx           Brand splash (chrome-less).
  error-boundary.jsx    RouteErrorBoundary; resets on URL change.
  index.css             Tailwind layers + km-pulse / km-shimmer animations.

  data.js               ALL fixture data. Single source of truth.
                        Exports: TEAM, TEAM_BY_ID, PRODUCT_LINES,
                        STATUS_TONES, OPPORTUNITIES, OPPS_BY_ID, STEPS,
                        ALIAS, BUDGET_LINES_INITIAL, BUDGET_INDIRECT_RATE,
                        KB, AI_FEED, NEEDS, FUNNEL, ASSEMBLY,
                        READINESS_INITIAL, COMPLIANCE, ASSEMBLY_FORMAT,
                        DISCOVERY_AGENT.

  icons.jsx             Inline SVG icon set (Icon.*).
  primitives.jsx        Pill, Avatar, Card, Button, Mono, ProgressBar,
                        AIBadge, AICell, DeadlineChip, ProductPill,
                        SectionHeading, etc.
  shell.jsx             Sidebar, Breadcrumbs, TopBar, AIRail,
                        AISuggestionCard.

  dashboard.jsx         Dashboard screen + DiscoveryAgentPanel.
  pipeline.jsx          Pipeline table with STATUS_RANK sort.
  workspace.jsx         WorkspaceParts.{StepNav, IntakePanel, TriagePanel,
                        UsdotTriagePanel, ScopePanel, CollaboratorsPanel,
                        DraftPanel, TasksPanel, TimelinePanel}.
  other-screens.jsx     BudgetPanel, AssemblyPanel, CompliancePanel,
                        TeamScreen, PersonDetail, KBScreen, ReviewsScreen,
                        SettingsScreen. Local Row helper.
  tweaks-panel.jsx      Floating Tweaks panel + useTweaks hook.

public/
  favicon.svg           Source SVG for PWA assets.
  pwa-*.png             Generated icons (192, 512, maskable).

scripts/
  screenshots.mjs       Playwright headless capture of README screenshots.
  record-demo.mjs       Playwright recording of demo video with injected
                        fake-cursor + Bezier-curve human motion.

.github/workflows/
  deploy.yml            Build → upload → deploy to GitHub Pages. Sets
                        VITE_BASE=/<repo>/ and writes 404.html for SPA
                        deep links.

vite.config.js          Vite + react + vite-plugin-pwa. Reads VITE_BASE.
tailwind.config.js      Tailwind content paths + Inter / JetBrains Mono.
pwa-assets.config.js    @vite-pwa/assets-generator config.
postcss.config.js       Tailwind + autoprefixer.

README.md               PM-first product overview with screenshots and
                        the demo script.
SOURCE_OF_TRUTH.md      This document.
```

---

## 13. Hand-off checklist for an AI agent

Before opening a PR that touches anything user-visible:

- [ ] The 3-minute demo path (§10) still flows beat-for-beat.
- [ ] Pipeline rows are in `STATUS_RANK` order, Pre-Solicitation rows at top.
- [ ] Clicking the *Budget v2* `NEEDS` row lands at `/opp/alias-tx/budget`.
- [ ] *Accept · trim 2%* reflows the budget AND flips the TopBar pill.
- [ ] Clicking the Kingmaker wordmark lands on `/welcome`.
- [ ] Clicking *Enter workspace →* on the splash lands on `/`.
- [ ] Tone palette is unchanged (still the seven from §6.1).
- [ ] No new always-on AI chatbox added anywhere.
- [ ] `npm run build` succeeds.
- [ ] `node scripts/screenshots.mjs` succeeds and the new screenshots are
      not noticeably different from the committed set unless intentional.
- [ ] Commit message follows the project tone (see §9.8 / `git log`).

---

*Last verified against repo HEAD: see the most recent commit on `main`.*
