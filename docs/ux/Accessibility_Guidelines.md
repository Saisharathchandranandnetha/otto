# Accessibility Guidelines

Otto's UI is designed with a dark theme and amber accent, using JetBrains Mono for typography. Accessibility is crucial to ensure all users can effectively manage their business.

## Color and Contrast
- **Dark Theme**: The background must be a deep gray/black to reduce eye strain, but not pure `#000000` to avoid smearing on OLED screens (e.g., use `#121212` or `slate-900`).
- **Amber Accent**: The primary action color (Amber) must maintain a minimum contrast ratio of 4.5:1 against the dark background for standard text, and 3:1 for large text or UI components.
- **Text Contrast**: Primary text should be high-contrast (e.g., almost white, `slate-50`), while secondary/tertiary text can be muted (`slate-400`), provided it meets the 4.5:1 ratio.
- **Error/Warning States**: Ensure error states (red) and warnings are easily distinguishable from the amber accent, both in hue and lightness.

## Typography
- **Font**: JetBrains Mono.
- **Legibility**: As a monospaced font, it provides excellent alignment for tabular data (ledger, inventory). Ensure font sizes are legible (minimum 14px for body text).
- **Hierarchy**: Use clear font weight and size distinctions to separate headings, action card titles, and metadata.

## Focus and Interaction
- **Focus States**: All interactive elements (buttons, inputs, toggles) must have a highly visible focus ring (e.g., a solid amber outline with an offset) for keyboard navigation.
- **Touch Targets**: Mobile or tablet interactions require minimum touch targets of 44x44 CSS pixels.
- **Idempotency Feedback**: Since actions are idempotent, provide immediate visual feedback (disabling the button, showing a spinner) when an action is triggered, followed by a clear success state.

## Screen Readers
- Use semantic HTML (Next.js components) to ensure proper document structure (`<main>`, `<nav>`, `<article>` for action cards).
- Include `aria-live` regions for the "Live Narrated Build" during the Resurrection phase to announce progress updates.
