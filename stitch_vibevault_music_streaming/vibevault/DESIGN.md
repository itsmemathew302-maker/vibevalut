---
name: VibeVault
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb0cd'
  on-tertiary: '#640039'
  tertiary-container: '#f751a1'
  on-tertiary-container: '#570032'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-main:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The brand personality is high-fidelity, immersive, and futuristic. It targets an audience that views music as an experiential journey rather than just a utility. The visual narrative is built on "Sonic Depth"—using layers of transparency and light to mimic the feeling of a premium audio interface.

The design style is a refined mix of **Glassmorphism** and **High-Contrast Bold**. It utilizes deep, dark backgrounds to make vibrant accents and glowing interactive elements feel like they are floating in a digital void. The interface should evoke a sense of late-night energy, technical precision, and rhythmic movement.

## Colors
This design system utilizes a "Deep Space" palette. The background is a solid, non-reflective `#0F172A`. Interaction and hierarchy are driven by three high-vibrancy neon tones:
- **Primary (Electric Violet):** Used for main actions, active states, and brand presence.
- **Secondary (Cyber Cyan):** Used for progress bars, secondary metrics, and playback controls.
- **Accent (Neon Pink):** Used for high-energy highlights like "Live" indicators, favorites, and trending badges.

Surfaces do not use solid colors; instead, they use a semi-transparent glass effect that allows background gradients or album art to bleed through subtly.

## Typography
The typography uses **Plus Jakarta Sans** (as a high-quality alternative to Poppins) to maintain a modern, geometric, and friendly aesthetic. 

- **Display styles** should be used sparingly for artist names or hero sections, utilizing tight letter spacing to feel impactful.
- **Label-caps** are intended for small metadata, like genre tags or track durations.
- **Hierarchy** is established primarily through weight rather than just size, ensuring legibility against complex glass backgrounds.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous internal padding to create an "airy" premium feel. 

- **Desktop:** 12-column grid with 48px outside margins. Sections (like Playlists or New Releases) should use horizontal overflow scrolling rather than vertical stacking where possible to maintain a cinematic "dashboard" feel.
- **Mobile:** 4-column grid. Most cards should span the full width or 2-columns (for artist tiles).
- **Rhythm:** Use a strict 8px spacing scale. Vertical spacing between sections should be a minimum of 48px to allow the glass backgrounds to breathe.

## Elevation & Depth
Elevation is not achieved through traditional shadows, but through **Luminance and Blur**. 

1.  **Level 0 (Base):** The `#0F172A` canvas.
2.  **Level 1 (Surface):** Glassmorphic cards with `backdrop-filter: blur(20px)` and a 1px solid border at 10% opacity white.
3.  **Level 2 (Floating):** Active modals or popovers with `backdrop-filter: blur(40px)` and a subtle glow shadow matching the primary color (e.g., `0px 10px 30px rgba(139, 92, 246, 0.2)`).

Interactive elements use "Inner Glows" to simulate physical light within the glass.

## Shapes
The shape language is consistently rounded to feel approachable and smooth.
- **Standard Cards:** 16px (rounded-lg)
- **Buttons & Chips:** Fully rounded (pill-shaped)
- **Album Art:** 12px for standard lists, 24px for featured hero items.
- **Inputs:** 12px to match the internal radius of cards.

## Components

### Buttons
- **Primary:** Gradient background (Violet to Cyan), white text, and a soft glow on hover.
- **Ghost:** Glassmorphic background with a 1px primary-colored border.
- **Icon Buttons:** Circular glass containers with centered white icons.

### Cards (Album/Playlist)
- Cards must have no solid background. Use the glass container.
- On hover, the image should scale slightly (1.05x) and the card border opacity should increase from 10% to 30%.

### Playback Controls
- The progress bar is a 4px tall track. The "played" portion uses a Cyan-to-Pink gradient.
- The "thumb" or scrubber only appears on hover to maintain a clean aesthetic.

### Inputs & Search
- Search bars are wide, pill-shaped glass fields with a secondary color (Cyan) icon.
- Focus state: The border transitions from 10% white to a 100% Primary Violet.

### Glowing States
- Active music tracks in a list should have a subtle "glow" behind the text or a small animated equalizer icon in the Primary color.