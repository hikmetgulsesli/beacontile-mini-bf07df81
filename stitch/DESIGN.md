---
name: Deterministic Utility
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  header-sm:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  gutter: 12px
  container_max: 1024px
---

## Brand & Style
The design system is engineered for high-density information environments where clarity and performance are paramount. It targets power users, developers, and system administrators who require immediate status recognition without visual fatigue. 

The aesthetic is **Functional Minimalism**—a "tool-first" philosophy that prioritizes content over decoration. It avoids marketing-oriented flourishes like large hero sections or soft shadows, instead opting for a structured, grid-aligned layout reminiscent of physical rack-mounted hardware or terminal-based dashboards. The emotional response is one of calm control, reliability, and precision.

## Colors
This design system utilizes a restricted, professional palette focused on "Status at a Glance." 

- **Primary & Secondary:** Deep slate and cool grays provide a neutral canvas that recedes, allowing data to take center stage.
- **Semantic Colors:** Green, Amber, and Red are highly saturated and used exclusively for system status (OK, Warn, Down). They are paired with light background tints of the same hue for container fills.
- **Neutrals:** A range of cool grays (Slate) handles hierarchy, borders, and secondary text. The background is a crisp, off-white to reduce glare during long sessions.

## Typography
Typography is optimized for legibility at small sizes. **Hanken Grotesk** provides a sharp, contemporary sans-serif feel that remains readable in dense tables and grids. 

**JetBrains Mono** is used for technical labels, IDs, and status codes to differentiate "system data" from "interface text." 

- **Density:** Line heights are kept tight to maximize vertical space. 
- **Hierarchy:** Established through weight (SemiBold/Bold) rather than dramatic size increases.
- **Mobile:** Since this is a "Mini" utility, typography scales minimally; headers drop 2px on mobile to maintain the dense grid.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy within a narrow max-width, ideal for utility windows. A 4px baseline grid ensures deterministic alignment of all elements.

- **Grid:** A 12-column system is used for desktop, collapsing to a single column on mobile.
- **Margins:** Tight 16px outer margins emphasize the "compact" nature of the tool.
- **Density:** Padding inside components is minimal (8px or 12px) to allow as much data as possible to be visible above the fold.

## Elevation & Depth
The design system avoids ambient shadows to maintain a "flat" professional look. Depth is conveyed through **Low-contrast outlines** and **Tonal layering**:

- **Layer 0 (Background):** Slate-50.
- **Layer 1 (Cards/Containers):** White with a 1px border (Slate-200).
- **Layer 2 (Modals/Popovers):** White with a 1px border (Slate-300) and a very tight 2px "hard" shadow (Slate-900 at 5% opacity) to simulate a slight lift without blur.
- **Interactions:** Buttons use a subtle inner-shadow on "press" to simulate physical depression.

## Shapes
Shapes are disciplined and structural. A **Soft (0.25rem)** corner radius is applied to cards, buttons, and input fields. This is enough to prevent the UI from feeling aggressive while maintaining a precise, engineered appearance. Large elements like main containers use 0.5rem (rounded-lg) sparingly.

## Components
- **Buttons:** Solid Slate-900 for primary actions; White with Slate-200 border for secondary. High-contrast, rectangular, with `code-label` font for technical actions.
- **Status Tiles:** Large, centered metric with a top-accent border (2px) colored by status (Green/Amber/Red).
- **Input Fields:** Inset appearance with a 1px border. Focus state uses a 1px solid Primary Blue border—no glow.
- **Chips:** Small, square-cornered labels using `code-label` typography, used for tags or version numbers.
- **Data Tables:** Zebra-striping (Slate-50) with no vertical borders. Headers are all-caps `code-label` style.
- **Progress Bars:** Thin (4px), flat, using the semantic color palette to indicate health or completion.