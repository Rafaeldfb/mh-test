# Design

## Implemented Task 01

The dashboard uses system sans-serif, off-white `#f6f6f4`, dark text and controls, 8px corners, and a centered 960px content area. Media Hero appears in the top navbar. A fixed floating bottom composer has a visible label, an editable question, and a disabled submit action while pending.

The workspace shows an invitation, loading skeletons, contextual errors with manual retry, or the validated result. Metadata and cards reveal briefly after success; reduced-motion preference removes entrances and skeleton animation. Two desktop columns place the first card full-width; widths at or below 720px use one column. Charts use Recharts with static internal geometry, keyboard support, tooltips, and native details tables for precise values. Long axis labels are abbreviated; exact tables retain full text. Pie labels show contribution shares independently of color.

Composer height is measured through ResizeObserver and reserved as bottom space, including safe-area padding. The final source context remains scrollable above it. Browser inspection covered widths from 320 to 1440px; actual mobile software keyboard and screen-reader speech remain unverified.

The [task design record](../tasks/01-render-dashboard/design.md) retains the confirmed direction and reference studies. Annual comparison remains Task 02 scope.
