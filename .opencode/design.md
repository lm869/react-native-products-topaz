---
name: Kinetic Atelier
colors:
  surface: '#fff7fa'
  surface-dim: '#e6d5e2'
  surface-bright: '#fff7fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ffeffb'
  surface-container: '#fae9f6'
  surface-container-high: '#f4e3f1'
  surface-container-highest: '#eedeeb'
  on-surface: '#221922'
  on-surface-variant: '#46464d'
  inverse-surface: '#372d37'
  inverse-on-surface: '#fdecf9'
  outline: '#77767d'
  outline-variant: '#c7c5cd'
  surface-tint: '#5b5d74'
  primary: '#16182c'
  on-primary: '#ffffff'
  primary-container: '#2b2d42'
  on-primary-container: '#9394ae'
  inverse-primary: '#c4c4df'
  secondary: '#885120'
  on-secondary: '#ffffff'
  secondary-container: '#fdb47a'
  on-secondary-container: '#784414'
  tertiary: '#251612'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c2a26'
  on-tertiary-container: '#aa908a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0fc'
  primary-fixed-dim: '#c4c4df'
  on-primary-fixed: '#181a2e'
  on-primary-fixed-variant: '#43455b'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77f'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6c3a0a'
  tertiary-fixed: '#fadcd5'
  tertiary-fixed-dim: '#ddc0ba'
  on-tertiary-fixed: '#281814'
  on-tertiary-fixed-variant: '#56423d'
  background: '#fff7fa'
  on-background: '#221922'
  surface-variant: '#eedeeb'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1.25rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the intimacy and discretion of an appointment-only boutique, translated into an ultra-considered mobile curation interface. It bridges quiet luxury with modern kinetic motion—rich tactile textures, cashmere-warm neutrals, and the metallic precision of brushed copper fittings.

Designed for discerning tastemakers discovering bespoke craft, couture, and archival objects, the aesthetic rejects the cold, sterile tropes of generic luxury apps. In their place, it establishes an editorial sensory world: deliberate pacing, expansive breathing room, restrained typography, and micro-interactions that feel weighted and physical rather than digital.

## Colors

The chromatic architecture is anchored in organic, tactile warmth:

- **Canvas & Backing (`#F2E9E4`):** Warm alabaster cream that eliminates stark digital glare, serving as the foundational atmospheric layer.
- **Surfaces & Cards (`#FAF6F0` / `#FFFFFF`):** Luminous parchment surfaces layered over the background to define focal objects with warmth.
- **Primary Text & Structure (`#2B2D42`):** Deep indigo navy. Used for core typography, structural chrome, and primary high-priority affordances, replacing harsh pitch black with high-depth pigment.
- **Accent & Primary Action (`#8D5524`):** Warm brushed copper. Applied selectively to interactive hardware moments—action triggers, price statements, curation badges, and active state indicators.
- **Soft Supporting Accent (`#C9ADA7`):** Soft rose taupe. Drives subtle secondary badges, inactive toggles, chip fills, and delicate dividing surfaces.
- **Secondary & Borders (`#9A8C98`):** Muted mauve gray used at 20% to 40% opacities for hairline architectural frames, subtle dividers, and tertiary metadata.

## Typography

The typography leverages modern, geometric, yet sculpted proportions to create an editorial cadence reminiscent of archival exhibition journals. 

- **Tracking Strategy:** Headings employ tight, confident negative tracking (`-0.02em` to `-0.03em`) to anchor editorial authority, while category tags, eyebrow captions, and micro metadata rely on wide, spaced-out uppercase tracking (`0.08em` to `0.1em`) to simulate luxury blind debossing.
- **Hierarchy Rules:** High-contrast pairing between Deep Indigo weights and Muted Mauve secondary copy keeps product discovery scannable without aggressive lines or clutter.

## Layout & Spacing

A 4-column fluid mobile grid forms the foundation of discovery feeds, expanding to 8 columns on tablet devices and 12 columns for editorial desktop viewports.

- **Negative Space Rhythm:** Generous vertical padding allows products to breathe unencumbered. Grouped interactive modules maintain compact gaps (`space-xs` and `space-sm`), while contextual transition blocks leverage expansive breaks (`space-xl`).
- **Edge Restraint:** Mobile margins are set at a firm 20px (`1.25rem`), preserving card silhouette integrity alongside bezel edges without edge clipping.

## Elevation & Depth

Visual hierarchy rejects intense synthetic dropshadows, drawing instead from tonal layering and the diffusion of warm ambient light:

- **Base Layer:** Natural Canvas (`#F2E9E4`) forms the deepest surface plane.
- **Tonal Card Elevation:** Lifted discovery cards use `#FAF6F0` or pure `#FFFFFF` offset with a warm copper-infused ambient diffusion: `0 8px 24px -4px rgba(43, 45, 66, 0.04), 0 2px 6px 0 rgba(141, 85, 36, 0.03)`.
- **Architectural Framing:** Subtle structural definitions rely on a hairline 1px stroke using `#9A8C98` at 20% opacity (`rgba(154, 140, 152, 0.2)`), imparting a bookbound finish.
- **Hardware Accents:** Active floating action bars and quick-save toggles feature an ultra-crisp top hairline highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.6)`), evoking machined metal inlay.

## Shapes

The interface balances soft geometry with tailored precision. Discovery cards, sheets, and modular panels sit between 16px (`1rem`) and 20px (`1.25rem`) border radii, producing an inviting silhouette without losing architectural structure. Small interaction surfaces, such as secondary tags and collection chips, employ continuous curvature matching the card radiuses proportionally.

## Components

- **Buttons:**
  - *Primary (Copper Hardware):* Solid `#8D5524` with crisp `#FFFFFF` typography. Features a warm inner micro-highlight and a soft copper glow on press.
  - *Secondary (Deep Indigo):* `#2B2D42` container with `#F2E9E4` text, providing grounding weight for critical confirmations.
  - *Tertiary / Ghost:* Transparent fill enclosed by a 1px border of `rgba(154, 140, 152, 0.3)` with `#2B2D42` label copy.

- **Cards (Discovery & Collection):**
  - Built with `#FAF6F0` or `#FFFFFF` fills, bounded by a 1px `rgba(154, 140, 152, 0.2)` border, and rounded at 18px. Images inside discovery cards preserve rounded inner corners with a 12px clip.

- **Chips & Filter Pills:**
  - Inactive chips adopt a soft `#C9ADA7` fill at 20% opacity with `#2B2D42` typography. Selected states fill with solid `#2B2D42` and render text in pure `#FAF6F0`.

- **Input Fields:**
  - Recessed field styling using `#FAF6F0` base background, 1px border of `rgba(154, 140, 152, 0.25)`, and 14px corner radiuses. Focus states gently brighten to `#FFFFFF` with a 1.5px `#8D5524` copper accent ring.

- **Favorite & Bookmark Toggles (Hardware Badges):**
  - Rounded circular buttons (40px x 40px) finished with a translucent frosted backing (`rgba(250, 246, 240, 0.85)`), 1px border, and a kinetic heart/pin icon that animates from `#9A8C98` to active `#8D5524`.

- **Lists & Attribute Rows:**
  - Separated by hairline dividers (`rgba(154, 140, 152, 0.15)`). Item specs feature wide-tracked `label-md` keys in `#9A8C98` alongside right-aligned values in `#2B2D42`.
