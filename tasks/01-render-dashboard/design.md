# Task 01 design direction

Status: User-confirmed direction; not implemented. Details explicitly marked as proposals remain open. This document does not authorize implementation or approve the data-handling proposals in the [decision brief](decision-brief.md).

The top navbar, fixed bottom composer, workspace above, loading skeletons, and gradual title/chart reveal after both responses succeed are the chosen primary approach for Task 01. This direction is settled and does not require reapproval; the earlier top-form layout is not a competing option.

## Confirmed user direction

- Present “Media Hero” in a top navbar, rather than as a standalone heading. A fixed top navbar is not required by this direction.
- Make the question composer look like a modern floating chat input, fixed at the bottom independently of scrolling, with a visual workspace above it where the dashboard appears. Do not clone ChatGPT. “Canvas” means this workspace, not an HTML canvas requirement.
- Reserve enough bottom padding and scroll space for the final chart, source line, and controls to become fully visible above the composer. Account for its variable height, mobile viewport changes, and safe-area insets where needed; the implementation mechanism is delegable.
- On submission, show loading/skeleton feedback that gives the sense of a panel being composed. Once both complete API responses succeed, reveal chart components one by one and introduce the returned title and text.
- Keep Portuguese UI, the Media Hero name, system sans-serif, off-white `#f6f6f4`, dark text and controls, 8px corners, and the adaptable centered 960px foundation. Use existing CSS and Recharts, without Tailwind/shadcn.
- Preserve the specification's titles, summary, period, source, metrics, and three chart types: sales per real invested by marketing channel (bar), investment by vehicle (bar), and attributed-sales share by channel (pie).

This is a single dashboard flow. Conversation history, sidebars, message bubbles, backend streaming, and new endpoints are outside this direction. The existing mock APIs return complete responses; progressive reveal is frontend presentation of an already successful result, not evidence of agent reasoning or streamed data.

## Interaction states

| State | Intended behavior and proposed details |
| --- | --- |
| Idle | Workspace above the bottom composer, with a visible input label and submit action. Proposal: a short invitation to ask a question, without sample numeric results. |
| Loading | Show skeleton regions while required responses are pending. Represent waiting for the panel, without invented reasoning/tool stages or fabricated values. Proposal: one concise status announcement and disabled duplicate submission. |
| Success / gradual reveal | Reveal real content only after both responses succeed. Proposal: introduce title, summary, and context, then reveal the three charts in specification order. Use short entrances rather than long artificial waits; exact order, timing, and animation remain open. |
| Error / retry | Clearly explain failure and preserve the question for recovery. Do not complete the canvas as a successful dashboard if either endpoint fails. Proposal: an explicit retry action that repeats both requests for the submitted question. |

Respect `prefers-reduced-motion`: omit staggered movement/delays and show the completed result promptly. A typewriter effect is not required; a simple appearance or fade can introduce text. Proposed accessibility details: announce loading and errors, preserve keyboard focus in the composer, and avoid announcing every animated element separately.

## Chosen Task 01 layout

Use [option 1](design/dashboard-inspiration-v2.png) as the desktop base for this task only: a responsive CSS grid with two columns. The first chart answers the question and spans the full width; subsequent cards fill pairs in API order. Use [option 2](design/dashboard-option-2.png) as the reference for vertical organization in a single column on mobile and narrower screens. Tablets follow the available width, not a device-wide single-column rule. These are Task 01 layout rules, not global project guidelines.

Render a loop over `charts` in the returned order. Keep the layout in small CSS rules, without a layout generator, templates, chart-ID rules, backend positions, or new libraries. For example, `repeat(2, minmax(0, 1fr))`, a first-card span of `1 / -1`, a 24px gap, and a 720px single-column breakpoint illustrate the approach; gap and breakpoint are delegable parameters, not fixed approved requirements.

Recharts follows each card's available width. Choose proportional heights by chart type and category count with simple bounds; do not build an automatic layout engine. Exact heights, spacing, colors, and animation timing remain implementation details. Prioritize a small, readable implementation within the challenge's time budget.

Keep the workspace above the fixed, floating composer. Bottom clearance must allow charts, source context, and focusable controls to scroll fully above it. On mobile, adapt chart labels and the input/button arrangement without horizontal overflow; account for the composer's variable height, on-screen keyboard, viewport, and safe areas. Fixed bottom positioning is confirmed; scroll ownership and clearance mechanics remain delegable.

## Earlier visual study

The [v1 image](design/dashboard-inspiration-v1.png) remains a useful study of chart hierarchy, labels, and values. Its top composer and static page arrangement are superseded by the confirmed direction above. It is generated inspiration, not an app screenshot or an approved final UI.

Data selection, aggregation, and undefined-ratio handling remain proposals in the [decision brief](decision-brief.md). Request coordination research is in [research](research.md); complete responses are compatible with subsequent visual reveal.
