# Task 01 design direction

Current display override: the user's [later instruction](../02-year-over-year-investment/design.md#comparison-content-and-constraints) supersedes the earlier requirement below to display source table/model or keep a source footer visible. Hide that technical text in the UI; preserve API metadata/contracts, validation, and documented provenance. Source-related execution evidence below describes the earlier implementation, not a requirement to restore it. Final-content clearance above the composer still applies.

Status: Implemented under user authorization. See [execution evidence](README.md#review-and-validation-results) for adopted details and verification limits. Earlier proposals below are retained as design context.

The top navbar, fixed bottom composer, workspace above, loading skeletons, and gradual title/chart reveal after both responses succeed are the chosen primary approach for Task 01. This direction is implemented; the earlier top-form layout is retained only in historical studies.

## Confirmed user direction

- Present “Media Hero” in a top navbar, rather than as a standalone heading. A fixed top navbar is not required by this direction.
- Make the question composer look like a modern floating chat input, fixed at the bottom independently of scrolling, with a visual workspace above it where the dashboard appears. Do not clone ChatGPT. “Canvas” means this workspace, not an HTML canvas requirement.
- Reserve enough bottom padding and scroll space for the final chart, source line, and controls to become fully visible above the composer. Account for its variable height, mobile viewport changes, and safe-area insets where needed; the implementation mechanism is delegable.
- On submission, show loading/skeleton feedback that gives the sense of a panel being composed. Once both complete API responses succeed, reveal chart components one by one and introduce the returned title and text.
- Keep Portuguese UI, the Media Hero name, system sans-serif, off-white `#f6f6f4`, dark text and controls, 8px corners, and the adaptable centered 960px foundation. Use existing CSS and Recharts, without Tailwind/shadcn.
- Preserve the specification's titles, summary, period, source, metrics, and three chart types: sales per real invested by marketing channel (bar), investment by vehicle (bar), and attributed-sales share by channel (pie).

This is a single dashboard flow. Conversation history, sidebars, message bubbles, backend streaming, and new endpoints are outside this direction. The existing mock APIs return complete responses; progressive reveal is frontend presentation of an already successful result, not evidence of agent reasoning or streamed data.

## Interaction states

| State | Implemented behavior |
| --- | --- |
| Idle | Workspace above the bottom composer, with a visible input label and submit action. A short invitation asks for a question, without sample numeric results. |
| Loading | Show skeleton regions while required responses are pending. Represent waiting for the panel, without invented reasoning/tool stages or fabricated values. One concise status announcement accompanies disabled duplicate submission. |
| Success / gradual reveal | Reveal real content only after both responses succeed. Introduce title, summary and context, then the three charts in specification order with 90/180/270ms CSS delays. |
| Error / retry | Clearly explain failure and preserve the question for recovery. Do not complete the canvas as a successful dashboard if either endpoint fails. An explicit retry repeats both requests for the submitted question. |

Respect `prefers-reduced-motion`: omit staggered movement/delays and show the completed result promptly. A typewriter effect is not required; a simple appearance or fade can introduce text. Implemented accessibility details: announce loading and errors, preserve keyboard focus in the composer, and avoid announcing every animated element separately.

## Chosen Task 01 layout

Use [option 1](design/dashboard-inspiration-v2.png) as the desktop base for this task only: a responsive CSS grid with two columns. The first chart answers the question and spans the full width; subsequent cards fill pairs in API order. Use [option 2](design/dashboard-option-2.png) as the reference for vertical organization in a single column on mobile and narrower screens. Tablets follow the available width, not a device-wide single-column rule. These are Task 01 layout rules, not global project guidelines.

Render a loop over `charts` in the returned order. Keep the layout in small CSS rules, without a layout generator, templates, chart-ID rules, backend positions, or new libraries. For example, `repeat(2, minmax(0, 1fr))`, a first-card span of `1 / -1`, a 24px gap, and a 720px single-column breakpoint illustrate the approach; gap and breakpoint are delegable parameters, not fixed approved requirements.

Recharts follows each card's available width. Choose proportional heights by chart type and category count with simple bounds; do not build an automatic layout engine. Heights, spacing, colors and animation timing are defined in the stylesheet and chart components. Prioritize a small, readable implementation within the challenge's time budget.

Keep the workspace above the fixed, floating composer. Bottom clearance must allow charts, source context, and focusable controls to scroll fully above it. On mobile, adapt chart labels and the input/button arrangement without horizontal overflow; account for the composer's variable height, on-screen keyboard, viewport, and safe areas. Fixed bottom positioning is confirmed; scroll ownership and clearance mechanics remain delegable.

## Earlier visual study

The [v1 image](design/dashboard-inspiration-v1.png) remains a useful study of chart hierarchy, labels, and values. Its top composer and static page arrangement are superseded by the confirmed direction above. It is generated inspiration, not an app screenshot or an approved final UI.

Data-selection and undefined-ratio policies were adopted as recorded in the [task decisions](README.md#adopted-decisions); the [decision brief](decision-brief.md) retains planning context. Request coordination research is in [research](research.md); complete responses are compatible with subsequent visual reveal.
