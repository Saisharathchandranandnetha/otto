---
name: Otto
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#56423d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#89726c'
  outline-variant: '#ddc0ba'
  surface-tint: '#9f4128'
  primary: '#9c3e26'
  on-primary: '#ffffff'
  primary-container: '#bc563c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a2'
  secondary: '#366667'
  on-secondary: '#ffffff'
  secondary-container: '#baecec'
  on-secondary-container: '#3d6c6d'
  tertiary: '#615c47'
  on-tertiary: '#ffffff'
  tertiary-container: '#7b745e'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3c0800'
  on-primary-fixed-variant: '#7f2a13'
  secondary-fixed: '#baecec'
  secondary-fixed-dim: '#9fcfd0'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#1c4e4f'
  tertiary-fixed: '#ebe2c8'
  tertiary-fixed-dim: '#cec6ad'
  on-tertiary-fixed: '#1f1c0b'
  on-tertiary-fixed-variant: '#4c4733'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 20px
  gutter: 16px
  touch-target-min: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 40px
---

## Brand & Style

The design system is built on the philosophy of "Digital Hospitality." It rejects the cold, data-heavy aesthetic of traditional SaaS dashboards in favor of a warm, human-centric interface tailored for small business owners. The experience should feel like a trusted ledger or a conversation with a helpful assistant—reliable, calm, and grounded.

The style is **Modern Tactile**, utilizing soft surfaces, organic color palettes, and generous spacing to reduce cognitive load. By avoiding high-tech tropes like neon accents or robotic imagery, the design system establishes immediate trust with users who value personal relationships and hard-earned stability. Every interaction is designed to feel intentional and supportive, emphasizing clarity over complexity.

## Colors

The palette is inspired by natural earth tones found in traditional Indian architecture and textiles. 

- **Primary (Terracotta):** Used for primary actions and brand moments. It conveys warmth and energy without the urgency of a standard "alert" red.
- **Secondary (Deep Teal):** Provides a grounding contrast, used for secondary navigation and headers. It suggests stability and professional depth.
- **Background (Warm Cream):** Replaces harsh whites with a soft off-white to reduce eye strain and create a paper-like feel.
- **Neutral (Sand):** Used for subtle borders and background fills in UI components to maintain a soft, low-contrast environment.

Avoid any "electric" or "neon" variants. Gradients should be extremely subtle or avoided entirely to keep the interface looking honest and straightforward.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, rounded terminals and high legibility. The typeface is modern yet approachable, making it ideal for users who may be transitioning from paper-based tracking to digital tools.

Typography is prioritized for hierarchy:
- **Headline Scales:** Use Bold or Semi-Bold weights for clear section breaks.
- **Body Text:** Standardized at 16px to ensure accessibility for all age groups. 18px is preferred for transactional values and critical descriptions.
- **Multi-language Support:** The system is optimized for Indic scripts (Hindi, Telugu). Ensure that line-heights are slightly increased (approx 1.5x) when rendering these scripts to avoid clipping accents and modifiers.

## Layout & Spacing

This is a **Mobile-First** layout model designed for one-handed operation. 

- **The Grid:** A 4-column fluid grid for mobile with a 20px outer margin. Gutters are kept at 16px to maintain clear separation of card-based content.
- **Safe Zones:** High-priority actions are anchored to the bottom of the viewport within a "Sticky Action Zone" to ensure they are within easy reach of the thumb.
- **Rhythm:** An 8px base unit governs all spacing. Vertical stacks use 24px (stack-md) to separate logical groups, ensuring the UI feels airy and un-cluttered.
- **Tap Targets:** Every interactive element—buttons, list items, and toggles—must maintain a minimum height of 48px to accommodate a variety of finger sizes and environments.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Soft Shadows**. 

1.  **Base Layer:** The background is the warm cream surface (#FDFBF7).
2.  **Raised Layer (Cards):** UI elements sit on pure white (#FFFFFF) cards. These cards use a very soft, diffused shadow (Blur: 16px, Y: 4px) with a hint of the secondary teal or terracotta color in the shadow's tint (low opacity) to create a sense of natural depth.
3.  **Floating Layer:** Primary Action Buttons (FABs) or bottom-anchored bars use a slightly higher elevation to indicate they are always accessible above the scrolling content.

Avoid heavy borders or harsh black shadows. The depth should feel like stacked sheets of high-quality paper.

## Shapes

The shape language is defined by **Rounded** geometry (0.5rem base radius). 

- **Cards and Containers:** Use `rounded-lg` (1rem) to feel soft and welcoming.
- **Buttons:** Use fully rounded (pill-shaped) ends to maximize the "friendly" aesthetic and clearly distinguish them from informational cards.
- **Input Fields:** Use `rounded-md` (0.5rem) to provide enough structure for data entry while maintaining the overall soft visual language.

## Components

### Buttons
Primary buttons are pill-shaped, filled with Terracotta, and use white text. Secondary buttons use a subtle Sand fill or a Deep Teal outline. Use "Loading" states with a gentle pulse animation rather than a spinning "techy" icon.

### Cards
The core unit of the UI. Every card should have a 1px stroke in a slightly darker cream or sand color and a soft shadow. Cards should contain specific, actionable info (e.g., "Pending Payments" or "Daily Sales").

### Language Switcher
Located at the top right of the persistent header. It should be a simple, accessible toggle or a dropdown clearly labeled in the native script (e.g., "English / हिन्दी").

### Bottom-Anchored Actions
The "Primary Action Bar" stays fixed at the bottom. It often contains a single, prominent button for the most likely next step (e.g., "Add New Sale").

### Input Fields
Inputs use a warm-neutral background and a clear label above the field. Ensure the focus state uses the Deep Teal color for the border to signal "trustworthy" data entry.

### Motion Cues
Use ease-in-out transitions for card entries (sliding up slightly). Processing states should use a "shimmer" effect on surfaces rather than aggressive spinning icons to maintain the "calm" tone.