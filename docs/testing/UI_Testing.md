# UI Testing

## Scope
Otto is built with Next.js 14 App Router, React 18, and Tailwind CSS. The UI requires testing for functionality, responsive design, and aesthetic consistency (dark theme, amber accent, JetBrains Mono font).

## Tooling
- **Component Testing:** React Testing Library.
- **Visual Regression:** Playwright or Percy (for pixel-perfect validation).

## Best Practices
1. **State Management:** Ensure that optimistic UI updates (e.g., clicking 'Approve') revert gracefully if the backend responds with an error.
2. **Trust Meter:** Verify that the `TrustMeter` component accurately reflects the underlying trust score visually.
3. **Loading States:** Test suspense boundaries and loading skeletons, as AI extraction processes may take several seconds.
4. **Accessibility:** Ensure buttons, forms, and uploaded image previews have correct ARIA labels and alt text.
