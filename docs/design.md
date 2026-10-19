# Design

## Observed starter

- `src/App.tsx` shows a “Media Hero” heading, a Portuguese question input, a “Perguntar” submit button, and an empty dashboard section.
- `src/styles.css` uses system fonts, dark text (`#1a1a1a`), and an off-white background (`#f6f6f4`). The centered page has a 960px maximum width and 32px vertical / 24px horizontal padding.
- The form is a flex row with an 8px gap. Controls have 8px corners and 15px text; the input has a gray border, and the button uses a dark background with white text.

## Not yet defined

There are no rendered charts, dashboard styles, loading/error treatments, or responsive breakpoints. Chart colors, typography hierarchy, mobile layout, and annual-comparison presentation remain undecided. Existing CSS is starter styling, not evidence of a brand design system.

The input has no explicit accessible label. Chart accessibility and state announcements are not implemented. Treat these as current limitations, not established conventions.

See [README](../README.md) for the requested experience and [Architecture](architecture.md) for the supplied chart specification and data constraints.
