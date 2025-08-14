# 🎨 Design System — CS → Gamified Learning Tracker

**Modes:** Light & Dark • **System:** shadcn/ui-compatible (semantic tokens)

## Overview

This design system provides a fun, motivating look for a gamified learning tracker app that works seamlessly in both light and dark modes while maintaining excellent contrast and accessibility. The app now features a "Mint Arcade" brand skin with playful gamification elements.

## Goals

- Fun, motivating look for a gamified app
- Works in **light and dark** without losing contrast
- Uses **semantic tokens** so components inherit colors correctly
- Maintains accessibility standards (WCAG AA compliance)
- **Game-like feel** while staying super simple
- Clear visual hierarchy with **Challenge**, **Check-in**, **Add Quest** as primary actions

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

## Color Palette - Mint Arcade Brand Skin

### Light Mode

| Role                      | Hex       | Foreground |
| ------------------------- | --------- | ---------- |
| **Background**            | `#FAFAFA` | `#0B0C0E`  |
| **Card**                  | `#FFFFFF` | `#0B0C0E`  |
| **Muted**                 | `#F4F4F5` | `#52525B`  |
| **Border**                | `#E7E7EA` | —          |
| **Primary (Mint)**        | `#21E6B6` | `#052725`  |
| **Secondary (Reward/XP)** | `#FFC745` | `#231606`  |
| **Accent (Achievement)**  | `#A176FF` | `#1C0E3A`  |
| **Success (Emerald)**     | `#10B981` | `#06261D`  |
| **Destructive (Rose)**    | `#F43F5E` | `#3E0A0D`  |
| **Ring**                  | `#21E6B6` | —          |

### Dark Mode

| Role                      | Hex       | Foreground |
| ------------------------- | --------- | ---------- |
| **Background**            | `#0B0C0E` | `#F4F4F5`  |
| **Card**                  | `#121417` | `#EAEAEA`  |
| **Muted**                 | `#18181B` | `#A1A1AA`  |
| **Border**                | `#26272B` | —          |
| **Primary (Mint)**        | `#21E6B6` | `#052725`  |
| **Secondary (Reward/XP)** | `#FFC745` | `#231606`  |
| **Accent (Achievement)**  | `#A176FF` | `#1C0E3A`  |
| **Success (Emerald)**     | `#10B981` | `#06261D`  |
| **Destructive (Rose)**    | `#F43F5E` | `#3E0A0D`  |
| **Ring**                  | `#21E6B6` | —          |

---

## Component Requirements

### 1) Overview Section (Top)

- **Consolidated Layout**: Single block containing Level, Total XP, Progress bar, Streak, Challenge button, and Focus count
- **Prominent Progress Bar**: Large progress bar with shimmer effect every 8s
- **Level Display**: Shows current level and XP progress (e.g., "Level 1 • 95/150 XP to next level")
- **Action Buttons**: Challenge (Roll Dice) and Check-in buttons prominently displayed
- **Focus Counter**: Shows "1/3 Quests focused" with clear visual hierarchy

### 2) Badges

- **Five Tiers**: Bronze (150 XP), Silver (400 XP), Gold (800 XP), Epic (1200 XP), Legendary (2000 XP)
- **Visual States**: Locked = muted gray; Unlocked = colored with sparkle effect
- **Sparkle Animation**: Tiny sparkle cluster for unlocked badges

### 3) Category Progress

- **Progress Bars**: Custom progress bars with muted brand colors and subtle opacity
- **Percentage Ticks**: Visual markers at 25%, 50%, 75%, 100% (only visible when progress exists)
- **Color Coding**: Uses opacity modifiers for better visual hierarchy
- **Empty State**: Graceful handling when no categories exist

### 4) Focus Panel

- **Compact Design**: Smaller, more focused elements with reduced padding
- **Quest Capsules**: Up to 3 focused quests displayed as compact capsules
- **Badge Display**: Shows category, type, and XP badges for each focused quest
- **Remove Action**: Ghost button for removing quests from focus
- **Empty State**: Clear messaging when no quests are focused

### 5) Quest Card

- **XP Stripe**: Left-side colored stripe indicating XP value
- **Title Display**: Truncated to 2 lines with proper line clamping
- **Badge System**: Category, type, and XP badges with consistent styling
- **Completion State**: Strike-through text and dimmed appearance when completed
- **XP Gain Animation**: Small "+XP" bubble that floats up on completion

### 6) Challenge Dice

- **Random Quest Selection**: Modal that selects unfinished quests
- **Accept CTA**: Clear call-to-action for accepting challenges

### 7) Add Quest

- **Inline Form**: Compact form with Title, XP, Type, Category fields
- **Fast Path**: Streamlined workflow for quick quest creation

---

## Micro-Interactions (only these 3)

1. **Quest complete:** strike-through + small "+XP" bubble float (≈250ms) + XP counter tick
2. **Progress bar shimmer:** passive sweep every 8s; paused when reduced motion
3. **Level-up confetti:** single burst, ≤1s, then done

> Everything else is instant. No extra animations.

---

## Usage Guidelines

### Actions & Gamification

- **Primary** (mint): CTAs, primary buttons, active tabs
- **Secondary** (amber): XP progress, rewards, "gold" moments
- **Accent** (purple): Achievements, rare items, streak highlights

### Surfaces & Text

- **Background/Card**: Large surfaces; keep text on **foreground**
- **Muted**: Subtle sections (empty states, secondary metadata)
- **Border**: Dividers, input borders (don't exceed 1–2px)

### States

- **Success**: Completed quests, streak increases
- **Destructive**: Deletes, irreversible actions
- **Ring**: Focus outlines for accessibility (2px mint focus ring)

---

## Layout Structure

**Top row:** Overview Section (Level, XP, Progress, Streak, Challenge, Focus)
**Middle:** Focus panel (left) • Category Progress (right)
**Bottom:** Quests list with a compact **Add Quest** button

- Make **Challenge**, **Check-in**, **Add Quest** the most prominent CTAs
- Collapse filters under a single **"More filters ▸"** toggle by default

---

## Accessibility & Settings

- Respect **prefers-reduced-motion**: disable shimmer/confetti; keep count-up
- Maintain AA contrast for body text; ≥3:1 for UI text on pills
- 2px **mint focus ring** for keyboard users
- Theme toggle: Light / Dark / System

---

## Copy Guidelines

- Check-in success: **"🔥 Streak +1 — see you tomorrow!"**
- Quest complete: **"Nice! +40 XP banked."**
- Empty Quests: **"No quests yet. Add your first quest to start earning XP."**

---

## Implementation Notes

This design system is implemented in `src/app/globals.css` using CSS custom properties that automatically switch between light and dark mode values based on the `:root` and `.dark` selectors.

The system integrates seamlessly with shadcn/ui components, ensuring consistent theming across all UI elements.

### Current Implementation Status

✅ **Completed Components:**

- Overview Section (consolidated top layout)
- Badges with sparkle effects
- Category Progress with custom progress bars
- Focus Panel with compact design
- Quest Cards with XP animations
- Search and Filters with collapsible interface

✅ **Completed Features:**

- Mint Arcade color scheme implementation
- Light/Dark mode switching
- Responsive design with mobile-first approach
- Accessibility features (prefers-reduced-motion, focus rings)
- Micro-interactions (shimmer, XP animations)

---

## Future Enhancements

- Consider adding hover state variations for interactive elements
- Explore micro-interactions using accent colors
- Potential for seasonal color variations while maintaining accessibility
