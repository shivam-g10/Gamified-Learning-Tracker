# 🎨 Design System — CS → Senior Gamified Tracker

**Modes:** Light & Dark • **System:** shadcn/ui-compatible (semantic tokens)

## Overview

This design system provides a fun, motivating look for a gamified learning tracker app that works seamlessly in both light and dark modes while maintaining excellent contrast and accessibility.

## Goals

- Fun, motivating look for a gamified app
- Works in **light and dark** without losing contrast
- Uses **semantic tokens** so components inherit colors correctly
- Maintains accessibility standards (WCAG AA compliance)

---

## Semantic Tokens (shadcn/ui)

| Token                                        | Purpose                            |
| -------------------------------------------- | ---------------------------------- |
| `--background` / `--foreground`              | Base surfaces & text               |
| `--card` / `--card-foreground`               | Cards, panels                      |
| `--muted` / `--muted-foreground`             | Subtle backgrounds, secondary text |
| `--border`                                   | Dividers, outlines                 |
| `--primary` / `--primary-foreground`         | Main actions (CTA)                 |
| `--secondary` / `--secondary-foreground`     | Rewards/XP visuals                 |
| `--accent` / `--accent-foreground`           | Achievements, special elements     |
| `--success` / `--success-foreground`         | Completed states                   |
| `--destructive` / `--destructive-foreground` | Danger/warnings                    |
| `--ring`                                     | Focus ring color                   |

---

## Color Palette

### Light Mode

| Role                       | Hex       | Foreground |
| -------------------------- | --------- | ---------- |
| **Background**             | `#FAFAFA` | `#0B0B0C`  |
| **Card**                   | `#FFFFFF` | `#0B0B0C`  |
| **Muted**                  | `#F4F4F5` | `#52525B`  |
| **Border**                 | `#E4E4E7` | —          |
| **Primary (Teal Pop)**     | `#14B8A6` | `#052725`  |
| **Secondary (Amber Glow)** | `#F59E0B` | `#231606`  |
| **Accent (Purple Pulse)**  | `#8B5CF6` | `#1C0E3A`  |
| **Success (Emerald)**      | `#10B981` | `#06261D`  |
| **Destructive (Rose)**     | `#EF4444` | `#3E0A0D`  |
| **Ring**                   | `#0EA5E9` | —          |

### Dark Mode

| Role                       | Hex       | Foreground |
| -------------------------- | --------- | ---------- |
| **Background**             | `#09090B` | `#F4F4F5`  |
| **Card**                   | `#0F0F12` | `#EAEAEA`  |
| **Muted**                  | `#18181B` | `#A1A1AA`  |
| **Border**                 | `#27272A` | —          |
| **Primary (Teal Pop)**     | `#2DD4BF` | `#062C28`  |
| **Secondary (Amber Glow)** | `#FBBF24` | `#2A1A06`  |
| **Accent (Purple Pulse)**  | `#A78BFA` | `#1F133E`  |
| **Success (Emerald)**      | `#34D399` | `#0B2E22`  |
| **Destructive (Rose)**     | `#F43F5E` | `#3F0C12`  |
| **Ring**                   | `#38BDF8` | —          |

---

## Usage Guidelines

### Actions & Gamification

- **Primary** (teal): CTAs, primary buttons, active tabs
- **Secondary** (amber): XP progress, rewards, "gold" moments
- **Accent** (purple): Achievements, rare items, streak highlights

### Surfaces & Text

- **Background/Card**: Large surfaces; keep text on **foreground**
- **Muted**: Subtle sections (empty states, secondary metadata)
- **Border**: Dividers, input borders (don't exceed 1–2px)

### States

- **Success**: Completed quests, streak increases
- **Destructive**: Deletes, irreversible actions
- **Ring**: Focus outlines for accessibility

---

## Contrast & Accessibility

- Minimum contrast **4.5:1** for body text; **3:1** for large/UI text
- Never place light **accent** on **light background** without darkening the accent or using `*-foreground`
- For chips/badges: use the token's **`*-foreground`** on the filled background token to guarantee legibility

---

## Implementation Notes

This design system is implemented in `src/app/globals.css` using CSS custom properties that automatically switch between light and dark mode values based on the `:root` and `.dark` selectors.

The system integrates seamlessly with shadcn/ui components, ensuring consistent theming across all UI elements.

---

## Future Enhancements

- Consider adding hover state variations for interactive elements
- Explore micro-interactions using accent colors
- Potential for seasonal color variations while maintaining accessibility
