# Design System Strategy: Humain & IA

## 1. Overview & Creative North Star
**Creative North Star: "The Luminous Synthesis"**

The design system moves beyond the binary of "Man vs. Machine." Instead, it visualizes the intersection of human intuition and artificial intelligence as a fluid, atmospheric environment. While the parent brand, Digital Technology, provides a foundation of "Professional Reliability," this system introduces a "Signature Editorial" layer. 

We break the "standard template" look by utilizing intentional asymmetry—where large, high-contrast typography interacts with vast negative space—and overlapping glass layers that suggest depth without the use of rigid, boxed containers. The goal is to feel like a high-end digital journal: authoritative, breathable, and technologically advanced.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the deep blues of the parent brand but energized by a "Neon Cyan" AI pulse.

### The Palette
- **Deep Foundation:** `background` (#10141a) and `primary_container` (#1a4288) form the core of the experience, providing the "Professional" weight.
- **AI Pulse:** `secondary_container` (#00eefc) acts as the high-visibility accent, representing the active, modern AI side.
- **Human Warmth:** `tertiary` (#ffb86f) is used sparingly for micro-interactions to signify the "Human" touchpoint.

### Structural Rules
- **The "No-Line" Rule:** 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts. Use `surface_container_low` for sections sitting on a `surface` background to create soft, logical partitions.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers of frosted glass. An inner container (like a search bar or a sub-card) should use a higher tier (e.g., `surface_container_high`) than its parent to create "natural" depth.
- **The "Glass & Gradient" Rule:** To represent "augmented" humanity, floating components must utilize Glassmorphism. Use semi-transparent `surface_variant` with a 20px–40px backdrop blur. 
- **Signature Textures:** For Hero sections and primary CTAs, apply a subtle linear gradient transitioning from `primary` (#afc6ff) to `primary_container` (#1a4288) at a 135° angle.

---

## 3. Typography
We utilize a hierarchy that balances the clinical precision of AI with the warmth of human editorial design.

- **Display & Headlines (Inter):** Used in high-contrast scales. `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to create a bold, "Digital Curator" presence. 
- **Titles & Body (Inter):** Clean and highly readable. `body-lg` (1rem) is the standard for long-form content, ensuring accessibility and a "reliable" feel.
- **Labels (Space Grotesk):** We introduce **Space Grotesk** for `label-md` and `label-sm`. This mono-spaced influence provides a "high-tech" nuance for metadata and system statuses, contrasting against the human-centric Inter body text.

---

## 4. Elevation & Depth
In this system, elevation is a product of light and tone, not structure.

- **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface_container_lowest` card on a `surface_container_low` section to create a soft, recessed lift.
- **Ambient Shadows:** Shadows are reserved for floating elements (like Modals or Tooltips). Use extra-diffused values: `blur: 32px`, `spread: -4px`, and `opacity: 6%`. The shadow color should be a tinted version of the surface color to mimic natural light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at 15% opacity. Never use 100% opaque borders.
- **Glassmorphism:** All "AI-driven" components (chatbots, data cards) must use a 60% opacity fill of `surface_container` with a strong backdrop blur to soften the edges of the digital environment.

---

## 5. Components

### Buttons
- **Primary:** Filled with `primary_container` (#1a4288) with `on_primary_container` text. Apply a `roundedness.full` (9999px) for a modern, approachable feel.
- **Secondary (AI-Accent):** Use `secondary_container` (#00eefc). This button should have a soft `secondary` glow effect (box-shadow) when hovered to represent the "Neon Cyan" pulse.
- **Tertiary:** Text-only with an underline that appears on hover, utilizing `tertiary_fixed_dim`.

### Cards & Lists
- **Editorial Cards:** No dividers. Use `spacing.10` (2.5rem) as internal padding. Separate cards through vertical white space (`spacing.12`) rather than lines. 
- **Interactive States:** On hover, a card should shift from `surface_container` to `surface_container_high` with a subtle 2px vertical lift.

### Input Fields & Forms
- **Modern Inputs:** Use a "Bottom-Only" highlight. The field background is `surface_container_lowest`. Upon focus, the bottom edge glows with the `secondary` (Cyan) token.
- **Error States:** Use `error` (#ffb4ab) tokens only for the helper text and the focal border, keeping the container background neutral to avoid "visual panic."

### Specialized Components
- **The "Augmentation" Glow:** Use a radial gradient background behind key data visualizations, transitioning from 10% opacity `secondary` to 0% at the edges.
- **Floating AI Helper:** A permanent glassmorphic bubble in the bottom right, utilizing `roundedness.xl` and a high backdrop blur.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional asymmetry. Allow text to align to the left while imagery or data cards float to the right with different vertical offsets.
- **Do** prioritize white space. If a layout feels "busy," increase the `spacing` tokens between sections.
- **Do** use `secondary` (Cyan) exclusively for AI-related actions and highlights.

### Don't
- **Don't** use 1px solid dividers. They "trap" the content and break the fluid, editorial feel.
- **Don't** use pure black (#000000). Always use `surface` (#10141a) to maintain the "Deep Blue" brand DNA.
- **Don't** use "Drop Shadows" on cards that are resting on the background. Use tonal shifts (`surface_container` levels) instead.
- **Don't** use Fredoka One (the parent brand's secondary font) for body text; keep it strictly for the logo or very specific high-level branding callouts to ensure the AI branch feels more modern and "Human-Centric."