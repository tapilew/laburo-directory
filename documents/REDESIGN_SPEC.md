# Laburo Directory - Comprehensive Redesign Specification

## Executive Summary

This document defines a complete visual and UX redesign for Laburo Directory, a decentralized talent marketplace on Scroll network. The redesign addresses current design weaknesses (generic Inter font, flat grayscale palette, weak branding) with a bold, distinctive aesthetic that reinforces the product's core value proposition: **trust through economic stake**.

---

## 1. Aesthetic Direction: "Digital Brutalism"

### 1.1 Direction Selection

**Chosen Direction: Digital Brutalism**

After analyzing Laburo Directory's purpose as a trust-based professional marketplace where users stake ETH to signal seriousness, Digital Brutalism emerges as the perfect aesthetic match:

**Why Digital Brutalism for Laburo:**

1. **Honesty & Transparency**: Brutalism's "exposed structure" philosophy mirrors blockchain's transparency. Just as brutalist architecture reveals concrete and structural elements, Laburo reveals the economic stakes behind each profile.

2. **Economic Gravity**: The raw, weighty aesthetic visually communicates the seriousness of staking ETH. Light, airy designs would undermine the product's core message of "skin in the game."

3. **Differentiation**: Web3 is saturated with purple gradients and glassmorphism. Brutalism cuts through the noise with unforgettable boldness.

4. **Professional Credibility**: The stark, editorial quality signals that this is a serious tool for serious professionals—not a speculative casino.

5. **Scroll Network Synergy**: The raw, industrial feel complements Scroll's zk-rollup technology—sophisticated infrastructure presented without unnecessary decoration.

### 1.2 Brutalist Principles Applied

- **Raw typography**: Oversized, impactful headings with tight leading
- **High contrast**: Stark black/white with strategic accent color
- **Exposed structure**: Visible grid lines, borders as design elements
- **Asymmetric layouts**: Breaking the centered-container convention
- **Generous whitespace**: Let content breathe while maintaining density where needed
- **Functional honesty**: No decorative elements without purpose

---

## 2. Design System Specifications

### 2.1 Color Palette

#### Primary Colors

| Token | Hex | OKLCH | Usage |
|-------|-----|-------|-------|
| `--color-bg-primary` | `#0A0A0A` | `oklch(0.05 0 0)` | Main background |
| `--color-bg-secondary` | `#141414` | `oklch(0.08 0 0)` | Card backgrounds, elevated surfaces |
| `--color-bg-tertiary` | `#1A1A1A` | `oklch(0.11 0 0)` | Input fields, hover states |
| `--color-fg-primary` | `#FFFFFF` | `oklch(1 0 0)` | Primary text, headings |
| `--color-fg-secondary` | `#A3A3A3` | `oklch(0.65 0 0)` | Secondary text, descriptions |
| `--color-fg-muted` | `#525252` | `oklch(0.45 0 0)` | Tertiary text, placeholders |

#### Accent Colors (Amber-Orange for "Stake Signal")

| Token | Hex | OKLCH | Usage |
|-------|-----|-------|-------|
| `--color-accent-primary` | `#F59E0B` | `oklch(0.75 0.18 80)` | Primary CTAs, active states, stake indicators |
| `--color-accent-hover` | `#FBBF24` | `oklch(0.82 0.16 85)` | Hover states on accent |
| `--color-accent-subtle` | `#F59E0B20` | `oklch(0.75 0.18 80 / 0.12)` | Subtle accent backgrounds |
| `--color-accent-glow` | `#F59E0B40` | `oklch(0.75 0.18 80 / 0.25)` | Glow effects, shadows |

#### Semantic Colors

| Token | Hex | OKLCH | Usage |
|-------|-----|-------|-------|
| `--color-success` | `#22C55E` | `oklch(0.72 0.22 145)` | Success states, confirmations |
| `--color-success-subtle` | `#22C55E15` | `oklch(0.72 0.22 145 / 0.08)` | Success backgrounds |
| `--color-error` | `#EF4444` | `oklch(0.63 0.22 25)` | Errors, destructive actions |
| `--color-error-subtle` | `#EF444415` | `oklch(0.63 0.22 25 / 0.08)` | Error backgrounds |
| `--color-warning` | `#EAB308` | `oklch(0.75 0.16 95)` | Warnings, busy status |
| `--color-warning-subtle` | `#EAB30815` | `oklch(0.75 0.16 95 / 0.08)` | Warning backgrounds |
| `--color-info` | `#3B82F6` | `oklch(0.65 0.18 250)` | Information, links |

#### Border & Divider Colors

| Token | Hex | OKLCH | Usage |
|-------|-----|-------|-------|
| `--color-border-default` | `#262626` | `oklch(0.18 0 0)` | Default borders |
| `--color-border-hover` | `#404040` | `oklch(0.28 0 0)` | Hover state borders |
| `--color-border-accent` | `#F59E0B50` | `oklch(0.75 0.18 80 / 0.3)` | Accent borders |
| `--color-divider` | `#1F1F1F` | `oklch(0.15 0 0)` | Section dividers |

### 2.2 Typography System

**Font Philosophy**: Pair a bold, editorial display font with a highly legible monospace body font. This combination screams "technical precision meets bold vision."

#### Font Families

**Display/Headings: "Space Grotesk"**
- Source: Google Fonts / `next/font/google`
- Weights: 500 (Medium), 600 (SemiBold), 700 (Bold)
- Character: Geometric sans-serif with distinctive letterforms
- Usage: All headings, logo, CTAs, numbers

**Body/UI: "IBM Plex Mono"**
- Source: Google Fonts / `next/font/google`
- Weights: 400 (Regular), 500 (Medium), 600 (SemiBold)
- Character: Clean monospace with excellent readability
- Usage: Body text, labels, captions, code, data

#### Type Scale

| Style | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| Display XL | Space Grotesk | 72px/4.5rem | 700 | 0.9 | -0.03em | Hero headline |
| Display L | Space Grotesk | 56px/3.5rem | 700 | 0.95 | -0.02em | Section titles |
| Display M | Space Grotesk | 40px/2.5rem | 600 | 1.0 | -0.02em | Page titles |
| Display S | Space Grotesk | 32px/2rem | 600 | 1.1 | -0.01em | Card titles |
| Heading 1 | Space Grotesk | 28px/1.75rem | 600 | 1.2 | -0.01em | Modal titles |
| Heading 2 | Space Grotesk | 24px/1.5rem | 600 | 1.2 | 0 | Subsection titles |
| Heading 3 | Space Grotesk | 20px/1.25rem | 600 | 1.3 | 0 | Card headers |
| Heading 4 | Space Grotesk | 18px/1.125rem | 500 | 1.4 | 0 | Small headers |
| Body Large | IBM Plex Mono | 16px/1rem | 400 | 1.6 | 0 | Primary body |
| Body | IBM Plex Mono | 14px/0.875rem | 400 | 1.6 | 0 | Secondary body |
| Body Small | IBM Plex Mono | 13px/0.8125rem | 400 | 1.5 | 0 | Captions |
| Label | IBM Plex Mono | 12px/0.75rem | 500 | 1.4 | 0.05em | Labels, tags |
| Code | IBM Plex Mono | 13px/0.8125rem | 400 | 1.5 | 0 | Code, addresses |

#### Typography Patterns

- **All-caps labels**: Use for tags, badges, navigation (letter-spacing: 0.05em)
- **Tight headings**: Negative letter-spacing on large headings for impact
- **Monospace data**: Wallet addresses, ETH amounts, timestamps in mono
- **Color hierarchy**: White for primary, fg-secondary for descriptions, fg-muted for metadata

### 2.3 Spacing Scale

Based on 4px grid system:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | - |
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Inline spacing, small gaps |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Default padding, card gaps |
| `--space-5` | 20px | Medium padding |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Large gaps, section padding |
| `--space-10` | 40px | XL gaps |
| `--space-12` | 48px | Section separators |
| `--space-16` | 64px | Major section padding |
| `--space-20` | 80px | Page sections |
| `--space-24` | 96px | Hero spacing |

### 2.4 Border Radius Philosophy

Brutalist but refined—sharp edges with strategic rounding:

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Cards, containers, structural elements |
| `--radius-sm` | 2px | Small elements, tags, badges |
| `--radius-md` | 4px | Buttons, inputs, interactive elements |
| `--radius-lg` | 8px | Modals, dropdowns, floating elements |

**Principle**: Structural elements (cards, sections) are sharp (0px). Interactive elements (buttons, inputs) have subtle rounding (4px). Floating elements (modals) have more rounding (8px) to distinguish elevation.

### 2.5 Shadow & Elevation System

Minimal shadows—rely on borders and color contrast for depth:

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.5)` | Modals, popovers |
| `--shadow-accent` | `0 0 20px var(--color-accent-glow)` | Accent glow, focus states |
| `--shadow-inset` | `inset 0 1px 2px rgb(0 0 0 / 0.3)` | Inset inputs |

---

## 3. Component Redesign Specifications

### 3.1 Hero Section

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [NAV: Logo ──────────────── Connect Wallet]                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [BADGE: ● LIVE ON SCROLL]                          │   │
│  │                                                     │   │
│  │  HIRE STAKED                                        │   │
│  │  TALENT                                             │   │
│  │                                                     │   │
│  │  Professionals lock ETH as skin in the game.        │   │
│  │  You unlock warm, high-intent leads.                │   │
│  │                                                     │   │
│  │  [FIND TALENT]  [LIST MY PROFILE]                   │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │ 127 PROFILES │  │ 420 ETH      │  │ 0.01 ETH  │ │   │
│  │  │ STAKED       │  │ TOTAL STAKE  │  │ MIN STAKE │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**

- **Background**: Solid `#0A0A0A` with subtle grid pattern overlay (1px lines at `#141414`, 40px intervals)
- **Headline**: 
  - Font: Space Grotesk, 72px/4.5rem, weight 700
  - Color: White
  - Line height: 0.9
  - Max-width: 12ch per line (break into multiple lines)
- **Badge**: 
  - Border: 1px solid `#262626`
  - Background: transparent
  - Text: IBM Plex Mono, 12px, uppercase, letter-spacing 0.05em
  - Dot: 6px circle, `#22C55E`, pulse animation
- **Stats row**:
  - Sharp-bordered boxes (0px radius)
  - Border: 1px solid `#262626`
  - Number: Space Grotesk, 32px, weight 700, accent color
  - Label: IBM Plex Mono, 12px, uppercase, fg-muted

**Content Structure:**
- Badge: "LIVE ON SCROLL" with green pulse dot
- Headline: "HIRE STAKED TALENT" (or "HIRE STAKED\nTALENT" with line break)
- Subheadline: "Professionals lock ETH as skin in the game. You unlock warm, high-intent leads with a simple on-chain payment."
- Primary CTA: "FIND TALENT" (accent fill, sharp corners)
- Secondary CTA: "LIST MY PROFILE" (outline, sharp corners)
- Stats: Profile count, Total ETH staked, Minimum stake

### 3.2 TalentCard

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RUST ENGINEER, ZK EXP                          [STATUS] │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ Building zero-knowledge proof systems for Ethereum      │ │
│ │ L2s. 5+ years Rust, Circom experience. Previously       │ │
│ │ at [company].                                           │ │
│ │                                                         │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │ │
│ │ │ rust         │ │ circom       │ │ ethereum     │     │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘     │ │
│ │                                                         │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ STAKE                        DEADLINE         ACTION    │ │
│ │ 2.5 ETH                      14 FEB 2025      [UNLOCK]  │ │
│ │ $6,250 USD                   16 days left               │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**

- **Container**:
  - Background: `#141414`
  - Border: 1px solid `#262626`
  - Border-radius: 0px (sharp)
  - Padding: 24px
  
- **Title row**:
  - Title: Space Grotesk, 20px, weight 600, white
  - Status badge: Sharp-bordered pill
    - Available: Border `#22C55E`, text `#22C55E`, bg `#22C55E15`
    - Busy: Border `#EAB308`, text `#EAB308`, bg `#EAB30815`
    - Completed: Border `#525252`, text `#A3A3A3`, bg transparent

- **Description**:
  - Font: IBM Plex Mono, 14px
  - Color: `#A3A3A3`
  - Line clamp: 3 lines
  - Line height: 1.6

- **Skills tags**:
  - Border: 1px solid `#262626`
  - Background: transparent
  - Text: IBM Plex Mono, 12px, uppercase
  - Padding: 4px 8px
  - Border-radius: 2px

- **Divider**: 1px solid `#1F1F1F`, full width

- **Bottom row (3 columns)**:
  - Label: IBM Plex Mono, 11px, uppercase, `#525252`
  - Value: Space Grotesk, 18px, weight 600
  - ETH value in accent color
  - USD value in fg-secondary

- **Unlock button**:
  - Variant: Secondary (outline)
  - Border: 1px solid `#F59E0B`
  - Text: `#F59E0B`
  - Hover: bg `#F59E0B20`, text `#FBBF24`

**Hover State:**
- Border color transitions to `#404040`
- Subtle lift: translateY(-2px)
- Transition: 200ms ease-out

### 3.3 TalentList

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  STAKED TALENT DIRECTORY                    127 PROFILES    │
│  ────────────────────────────────────────────────────────   │
│  Every profile has ETH at stake. Browse with confidence.    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [FILTER: ALL ▼]  [SORT: NEWEST ▼]    [GRID/LIST ▦]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [TALENT CARD]                                      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [TALENT CARD]                                      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ────────────────────────────────────────────────────────   │
│  SHOWING 10 OF 127        [PREV] [1] [2] [3] ... [NEXT]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Visual Specifications:**

- **Section header**:
  - Title: Space Grotesk, 24px, weight 600
  - Count badge: Sharp box, border `#262626`, mono text
  - Description: IBM Plex Mono, 14px, `#A3A3A3`

- **Filter bar**:
  - Background: `#0A0A0A`
  - Border: 1px solid `#262626`
  - Padding: 12px 16px
  - Filters: Dropdown buttons with chevron icons

- **Grid layout**:
  - Desktop: 1 column (cards are wide, information-dense)
  - Gap: 16px

- **Pagination**:
  - Buttons: Sharp, 40px min touch target
  - Active page: Accent background
  - Inactive: Border only

### 3.4 Buttons

**Button Variants:**

| Variant | Background | Border | Text | Hover | Usage |
|---------|------------|--------|------|-------|-------|
| Primary | `#F59E0B` | none | `#0A0A0A` | `#FBBF24` | Main CTAs |
| Secondary | transparent | `#262626` | `#FFFFFF` | bg `#1A1A1A` | Secondary actions |
| Outline Accent | transparent | `#F59E0B` | `#F59E0B` | bg `#F59E0B20` | Special actions |
| Ghost | transparent | none | `#A3A3A3` | text `#FFFFFF` | Tertiary actions |
| Destructive | `#EF4444` | none | `#FFFFFF` | darken 10% | Delete, remove |

**Button Sizes:**

| Size | Height | Padding | Font | Usage |
|------|--------|---------|------|-------|
| Small | 32px | 12px 16px | 12px mono | Compact UI |
| Default | 40px | 16px 24px | 14px mono | Standard |
| Large | 48px | 20px 32px | 14px mono | Hero CTAs |
| Icon | 40px | 0 | - | Icon buttons |

**Button States:**

- **Default**: As specified above
- **Hover**: Background lighten, subtle scale(1.02)
- **Active**: Scale(0.98), darker background
- **Disabled**: Opacity 0.4, cursor not-allowed
- **Loading**: Spinner replaces text, disabled state

**Button Structure:**
```
┌───────────────────────────────┐
│  [ICON]  BUTTON LABEL  [ICON] │
└───────────────────────────────┘
```

- Icons: 16px, centered with 8px gap
- All buttons: border-radius 4px
- Font: IBM Plex Mono, 500 weight, uppercase, letter-spacing 0.05em

### 3.5 Modals

**Payment Modal Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  UNLOCK CONTACT                                [×]          │
│  ────────────────────────────────────────────────────────   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  REVIEW PAYMENT                                     │   │
│  │                                                     │   │
│  │  Amount                              0.01 ETH       │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Network fee (Scroll)                < $0.01        │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Total                               0.01 ETH       │   │
│  │                                 ≈ $25.00 USD        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Settlement: Instant on Scroll                              │
│                                                             │
│  [CONFIRM & PAY]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Modal Specifications:**

- **Backdrop**: `#0A0A0A` at 80% opacity, blur 4px
- **Container**:
  - Background: `#141414`
  - Border: 1px solid `#262626`
  - Border-radius: 8px
  - Max-width: 480px
  - Padding: 32px

- **Header**:
  - Title: Space Grotesk, 20px, weight 600
  - Close button: Top-right, 24px icon, hover `#FFFFFF`

- **Content area**: 24px gap between sections

- **Step indicator** (for multi-step modals):
  - Horizontal line with dots
  - Active step: Accent color, filled
  - Completed: Accent color, checkmark
  - Future: `#262626`, empty

**Modal Animations:**
- **Entrance**: 
  - Backdrop: fade in 200ms
  - Content: scale(0.95) → scale(1), opacity 0 → 1, 300ms ease-out
- **Exit**: Reverse of entrance, 200ms

### 3.6 Forms & Inputs

**Input Field Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ LABEL                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Placeholder text                              [ICON]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Helper text or error message                                │
└─────────────────────────────────────────────────────────────┘
```

**Input Specifications:**

- **Label**: IBM Plex Mono, 12px, uppercase, `#A3A3A3`, letter-spacing 0.05em
- **Input container**:
  - Background: `#0A0A0A`
  - Border: 1px solid `#262626`
  - Border-radius: 4px
  - Height: 48px
  - Padding: 0 16px

- **Input text**: IBM Plex Mono, 14px, `#FFFFFF`
- **Placeholder**: `#525252`

**Input States:**

| State | Border | Background | Shadow |
|-------|--------|------------|--------|
| Default | `#262626` | `#0A0A0A` | none |
| Hover | `#404040` | `#0A0A0A` | none |
| Focus | `#F59E0B` | `#0A0A0A` | 0 0 0 3px `#F59E0B20` |
| Error | `#EF4444` | `#EF444415` | 0 0 0 3px `#EF444420` |
| Disabled | `#1F1F1F` | `#141414` | none |

**Textarea:**
- Same styling as input
- Min-height: 120px
- Padding: 16px
- Resize: vertical only

**Select/Dropdown:**
- Same styling as input
- Chevron icon on right
- Dropdown panel: same styling as modal

---

## 4. Animation & Interaction Guidelines

### 4.1 Page Load Sequence

**Staggered entrance animation:**

```
Timeline:
0ms    - Background visible
100ms  - Navigation fades in (opacity 0→1, y: -10→0)
300ms  - Hero badge fades in
400ms  - Hero headline animates (clip-path reveal left-to-right)
600ms  - Hero subheadline fades in
700ms  - Hero CTAs fade in
900ms  - Stats row fades in
1100ms - Talent list section fades in
```

**Animation values:**
- Duration: 400ms per element
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- Stagger delay: 100ms between elements

### 4.2 Scroll-Triggered Animations

**Section reveal:**
- Trigger: When section enters viewport (20% from bottom)
- Animation: opacity 0→1, translateY(30px)→0
- Duration: 600ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`

**Card stagger in list:**
- Each card delays 50ms from previous
- Same animation as section reveal

### 4.3 Hover Micro-interactions

**Buttons:**
- Scale: 1 → 1.02
- Duration: 150ms
- Easing: ease-out

**Cards:**
- Border color: `#262626` → `#404040`
- Transform: translateY(0) → translateY(-2px)
- Duration: 200ms

**Links:**
- Color transition to accent
- Optional underline slide-in from left

**Tags/Badges:**
- Background opacity increase
- Subtle scale: 1 → 1.05

### 4.4 Modal Transitions

**Open:**
1. Backdrop fades in (200ms)
2. Modal scales from 0.95 → 1, fades in (300ms, ease-out)
3. Content staggers in (50ms delay per element)

**Close:**
1. Modal scales to 0.95, fades out (200ms)
2. Backdrop fades out (150ms)

### 4.5 Loading States

**Button loading:**
- Spinner replaces text or appears beside it
- Spinner: 16px, accent color, 1px stroke
- Animation: 360deg rotation, 1s linear infinite

**Card skeleton:**
- Background: `#141414`
- Shimmer overlay: linear-gradient(90deg, transparent, `#1A1A1A`, transparent)
- Animation: translateX(-100%) → translateX(100%), 1.5s infinite

**Page loading:**
- Full-screen overlay with centered spinner
- Spinner: 48px, accent color
- Optional: Loading text below with ellipsis animation

### 4.6 Success/Error Animations

**Success checkmark:**
- SVG stroke animation (draw checkmark)
- Duration: 400ms
- Followed by subtle scale pulse (1 → 1.1 → 1)

**Error shake:**
- TranslateX: 0 → -10px → 10px → -10px → 10px → 0
- Duration: 400ms
- Red border flash

---

## 5. UX Improvements

### 5.1 Empty States

**No profiles yet:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌─────────────┐                          │
│                    │   [ICON]    │                          │
│                    │  (diamond)  │                          │
│                    └─────────────┘                          │
│                                                             │
│              NO PROFILES YET                                │
│                                                             │
│     Be the first to stake your profile and signal           │
│     your availability to recruiters.                        │
│                                                             │
│              [LIST MY PROFILE]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Icon: 64px, stroke-only, `#525252`
- Title: Space Grotesk, 20px, `#FFFFFF`
- Description: IBM Plex Mono, 14px, `#A3A3A3`
- CTA: Primary button

**No search results:**
- Icon: Search icon, 48px
- Title: "NO MATCHES FOUND"
- Description: "Try adjusting your filters or browse all profiles."
- CTA: "CLEAR FILTERS"

**Wallet not connected:**
- Icon: Wallet icon
- Title: "CONNECT TO BROWSE"
- Description: "Connect your wallet to view staked talent profiles."
- CTA: "CONNECT WALLET"

### 5.2 Error State Treatments

**Inline errors:**
- Border: `#EF4444`
- Icon: Alert triangle, 16px, `#EF4444`
- Text: IBM Plex Mono, 13px, `#EF4444`
- Position: Below input, 8px gap

**Toast notifications:**
- Position: Top-right, 16px from edges
- Background: `#141414`
- Border-left: 3px solid (color by type)
- Padding: 16px 20px
- Icon + Title + Message layout
- Auto-dismiss: 5 seconds
- Manual close: X button

**Error types:**
- Error: Border `#EF4444`, icon alert-circle
- Warning: Border `#EAB308`, icon alert-triangle
- Success: Border `#22C55E`, icon check-circle
- Info: Border `#3B82F6`, icon info

**Full-page error:**
- Centered layout
- Large error icon (64px)
- Error code (if applicable) in mono
- Human-readable message
- Retry CTA

### 5.3 Success Confirmations

**Payment success:**
- Modal content switches to success view
- Large checkmark icon (animated)
- "PAYMENT CONFIRMED" title
- Transaction hash (clickable, mono)
- "View on Scrollscan" link
- "CLOSE" button

**Profile listed success:**
- Toast notification
- "PROFILE STAKED" title
- "Your profile is now live with 0.5 ETH stake."
- Link to view profile

### 5.4 Progress Indicators

**Transaction pending:**
- Spinner + "CONFIRM IN WALLET..."
- Subtext: "Please confirm the transaction in your wallet."

**Transaction processing:**
- Progress bar (indeterminate)
- "PROCESSING ON SCROLL..."
- Subtext: "This usually takes 2-3 seconds."

**Step indicator (multi-step):**
```
●──────●──────○
1      2      3
```
- Completed: Filled accent circle
- Current: Filled accent circle with pulse
- Future: Empty `#262626` circle
- Line: 2px, completed portions accent, future `#262626`

### 5.5 Navigation & Wayfinding

**Active section indicator:**
- Left border accent color on active nav item
- Or: Accent underline

**Breadcrumbs:**
- Format: HOME / DIRECTORY / PROFILE
- Separator: `/` in muted color
- Current page: White, no link
- Parents: `#A3A3A3`, hover white

**Back to top:**
- Appears after scrolling 500px
- Fixed bottom-right
- Small button with arrow-up icon

---

## 6. Responsive Behavior

### 6.1 Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Single column, stacked layouts |
| Tablet | 640-1024px | Adjusted spacing, 1-2 columns |
| Desktop | > 1024px | Full layout, max-width containers |

### 6.2 Mobile Adaptations

**Hero:**
- Headline: 40px (down from 72px)
- Stats: Stack vertically
- CTAs: Full width, stacked

**TalentCard:**
- Maintain single column
- Reduce padding: 16px
- Stack bottom row vertically

**Modals:**
- Full-screen on mobile (< 640px)
- Reduced padding: 24px

**Navigation:**
- Hamburger menu on mobile
- Sheet slides from right

---

## 7. Implementation Notes

### 7.1 CSS Custom Properties

All design tokens should be defined as CSS custom properties in `:root`:

```css
:root {
  /* Colors */
  --color-bg-primary: #0A0A0A;
  --color-bg-secondary: #141414;
  /* ... etc */
  
  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  /* ... etc */
  
  /* Animation */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
}
```

### 7.2 Tailwind Configuration

Extend Tailwind theme with custom values:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'laburo-bg': {
          primary: '#0A0A0A',
          secondary: '#141414',
          tertiary: '#1A1A1A',
        },
        'laburo-accent': {
          DEFAULT: '#F59E0B',
          hover: '#FBBF24',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
}
```

### 7.3 Font Loading

```typescript
// layout.tsx
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});
```

---

## 8. Asset Requirements

### 8.1 Icons

Use Lucide React icons throughout:
- `Wallet` - wallet connection
- `Shield` / `ShieldCheck` - stake/security
- `Lock` / `Unlock` - contact unlocking
- `CheckCircle` / `XCircle` - success/error states
- `AlertTriangle` - warnings
- `Loader2` - loading spinner
- `ChevronDown` / `ChevronUp` - dropdowns
- `ExternalLink` - external links
- `Copy` - copy to clipboard
- `Search` - search/filter

### 8.2 Graphics

- Grid pattern background: CSS-generated or SVG
- Pulse dot animation: CSS keyframes
- No illustrations needed—let typography and data speak

---

## 9. Accessibility

### 9.1 Contrast Requirements

- All text meets WCAG 4.5:1 ratio minimum
- Large text (18px+): 3:1 ratio minimum
- Interactive elements: 3:1 ratio against adjacent colors

### 9.2 Focus States

- Visible focus ring on all interactive elements
- Focus ring: 2px solid accent, 2px offset
- No focus trap in modals

### 9.3 Motion Preferences

- Respect `prefers-reduced-motion` media query
- Disable animations for users who prefer reduced motion
- Keep functionality without animations

### 9.4 Screen Readers

- Semantic HTML structure
- ARIA labels on icon-only buttons
- Live regions for dynamic content updates
- Proper heading hierarchy (h1 → h2 → h3)

---

## 10. Summary

This redesign transforms Laburo Directory from a generic Web3 interface into a bold, memorable experience that communicates trust and seriousness through its brutalist aesthetic. The key improvements:

1. **Distinctive typography**: Space Grotesk + IBM Plex Mono creates immediate visual identity
2. **Purposeful color**: Amber accent signals "stake" and value against stark black/white
3. **Editorial layouts**: Asymmetric, grid-based compositions that break conventions
4. **Thoughtful interactions**: Every hover, click, and transition reinforces the brand
5. **Comprehensive UX**: Empty states, errors, loading—all designed with intention

The result is a product that looks and feels as serious as the economic stakes it represents.
