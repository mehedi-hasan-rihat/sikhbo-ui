# Design System — Project Review Portal

## 1. Design Philosophy

The visual language borrows from YukoHealth's storefront: calm, editorial, high-contrast-within-restraint. Everything is legible and unhurried. No decorative noise. The interface recedes so the content (submission state, review actions, feedback) occupies full attention.

Translated for a developer-facing review portal: the aesthetic is **minimal editorial** — clean type, generous whitespace, a near-white background, and confident use of near-black. Status indicators (pending/approved/rejected) are the only place color earns its presence. Interactions are quiet but responsive.

---

## 2. Color Palette

All tokens live in `src/app/globals.css` as CSS custom properties.

### Base Surface

| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#fafafa` | Page background |
| `--color-surface` | `#f5f5f5` | Card backgrounds, table rows, input backgrounds |
| `--color-foreground` | `#202020` | Primary text, headings, icons |
| `--color-muted` | `#666666` | Secondary text, labels, placeholder copy |
| `--color-border` | `#dedede` | Dividers, input borders, table rules |

### Interactive & Overlay

| Token | Value | Use |
|---|---|---|
| `--color-control` | `#2020200d` (~5% black) | Subtle hover fills on controls |
| `--color-glass` | `#ffffffb8` | Frosted overlay backgrounds |
| `--color-floating` | `#eeeeeef0` | Floating panels, dropdowns |
| `--color-floating-hover` | `#e5e5e5f5` | Hover state inside floating |
| `--color-floating-active` | `#dededef5` | Active/pressed floating |
| `--color-focus` | `#557993` | Focus ring (accessible blue-slate) |
| `--blur-floating` | `16px` | Backdrop blur for glass surfaces |

### Semantic Status (portal-specific, not in reference)

| Token | Value | Use |
|---|---|---|
| `--color-status-pending` | `#92650a` | Pending badge text |
| `--color-status-pending-bg` | `#fef3c7` | Pending badge background |
| `--color-status-approved` | `#166534` | Approved badge text |
| `--color-status-approved-bg` | `#dcfce7` | Approved badge background |
| `--color-status-rejected` | `#991b1b` | Rejected badge text |
| `--color-status-rejected-bg` | `#fee2e2` | Rejected badge background |

Dark mode: the reference is entirely light. Mirror the surface hierarchy — darken canvas/surface, lighten foreground/muted, keep status colors adjusted for contrast.

---

## 3. Typography

### Typeface

**Inter** at weight 400 (normal) throughout. No bold weight in headings — editorial tone is achieved through size and tracking, not weight. The reference sets `h1–h3` to `font-weight: normal` explicitly.

```css
/* globals.css */
--font-body: 'Inter', Arial, Helvetica, sans-serif;
```

Load Inter via `next/font/google` in `layout.tsx`.

### Type Scale

| Role | Size | Line-height | Tracking | Notes |
|---|---|---|---|---|
| Page heading (h1) | `clamp(28px, 4vw, 40px)` | `1.15` | `-0.03em` | Auth pages, portal title |
| Section heading (h2) | `28px` | `32px` (8×4px) | `-0.03em` | Dashboard section titles |
| Subsection (h3) | `15px` | `24px` | `0` | Card labels, table headers |
| Body | `15px` | `24px` | `0` | Default prose |
| Small / meta | `13px` | `20px` | `0` | Timestamps, helper text |
| Label / badge | `12px` | `16px` | `0.02em` | Status chips, UI labels |

All heading sizes use `font-weight: 400`. Use `letter-spacing: -0.03em` for anything 24px or larger.

---

## 4. Spacing & Layout

### Page Structure

- Max content width: **1376px** centered, with `padding-inline: max(var(--page-gutter), calc((100% - 1376px) / 2))`
- Page gutter (horizontal padding): `32px` → `24px` (md) → `20px` (sm) → `16px` (xs)
- Header height: `64px` desktop / `80px` mobile

### Spacing Tokens (Tailwind 4 native `--spacing` = 4px)

| Name | Value | Tailwind |
|---|---|---|
| Section gap | `112px` desktop / `88px` tablet / `112px` mobile | `gap-section` custom |
| Column gap | `40px` desktop / `24px` tablet/mobile | `gap-column` custom |
| Card padding | `24px` / `32px` on md | `p-6` / `p-8` |
| Form field gap | `16px` | `gap-4` |
| Button height | `36px` (h-9) | `h-9` |

Use `8px` increments for micro-spacing (margin between label and input, gap between icon and text).

---

## 5. Borders & Radius

The reference uses very generous radius on cards and a minimalist 1px border throughout.

| Component | Radius |
|---|---|
| Page cards / auth container | `28px` mobile → `32px` md → `40px` lg (`--card-radius`) |
| Table / data panel | `20px` |
| Input fields | `12px` (`rounded-xl`) |
| Buttons (primary/secondary) | `9999px` (`rounded-full`) — pill shape |
| Badges / status chips | `9999px` (`rounded-full`) |
| Floating menus / dropdowns | `20px` |

Border: `1px solid var(--color-border)` everywhere. Never thicker.

---

## 6. Component Patterns

### Buttons

Two variants — **primary** (foreground fill) and **ghost** (transparent with border). No outlined secondary with colored backgrounds.

```
Primary:  bg-foreground text-white hover:bg-[#454545] rounded-full px-5 h-9
Ghost:    border border-border bg-transparent hover:bg-control rounded-full px-5 h-9
```

- Disabled: `opacity-50 cursor-not-allowed`
- Loading: spinner replaces label, button disabled
- Focus: `outline-2 outline-offset-5 outline-[var(--color-focus)]`
- Destructive (reject): ghost styling with `--color-status-rejected` text on hover

No filled red/green buttons. Status is communicated through badges, not button color.

### Form Inputs

```
bg-surface border border-border rounded-xl px-4 h-9
placeholder: text-muted text-[13px]
focus-within: outline-2 outline-offset-2 outline-[var(--color-focus)]
error: border-[var(--color-status-rejected)] 
```

Error messages: `text-[13px] text-[var(--color-status-rejected)] mt-1`

Labels: `text-[13px] text-muted font-normal` above the input, `mb-1` spacing.

### Cards

```
bg-surface rounded-card border border-border p-6 md:p-8
```

Cards on auth pages (login/signup) use `rounded-card` (28–40px responsive) centered with `max-w-[440px]`.

### Status Badges

Pill-shaped, filled with semantic background color:

```
PENDING:  bg-[var(--color-status-pending-bg)]  text-[var(--color-status-pending)]  rounded-full px-2.5 py-0.5 text-[12px]
APPROVED: bg-[var(--color-status-approved-bg)] text-[var(--color-status-approved)] rounded-full px-2.5 py-0.5 text-[12px]
REJECTED: bg-[var(--color-status-rejected-bg)] text-[var(--color-status-rejected)] rounded-full px-2.5 py-0.5 text-[12px]
```

### Navigation / Header

```
height: var(--header-height) [64px desktop]
bg: var(--color-glass) with backdrop-blur-floating
border-bottom: 1px solid var(--color-border)
position: sticky top-0 z-20
```

Logo / app name: `text-[15px] font-normal text-foreground`
Nav links: `text-[13px] text-muted hover:text-foreground`
Action buttons: `size-[var(--header-control-height)]` (32px)

### Data Table (Mentor Dashboard)

```
bg-surface rounded-[20px] border border-border overflow-hidden
thead: text-[13px] text-muted border-b border-border
tbody tr: border-b border-border last:border-0 hover:bg-[#20202008]
td: text-[15px] py-3 px-4
```

No zebra striping. Only hover row highlight with a 4% black tint.

### Dialogs / Confirmation Modals

```
backdrop: bg-[#20202050] backdrop-blur-[8px]
panel: bg-floating backdrop-blur-floating rounded-[32px] p-8 shadow-[0_8px_32px_#20202012]
max-w: min(520px, calc(100% - 32px))
```

### Loading / Skeleton States

Skeletons use `bg-surface animate-pulse` with `rounded-xl`. Match the shape of the real content.

Full-page loading: centered spinner only, no text.

### Empty States

```
py-28 text-center
icon: 40px, text-muted, mb-4
heading: text-[15px] text-foreground mb-1
body: text-[13px] text-muted
```

---

## 7. Responsive Behavior

Three breakpoints, following the reference:

| Breakpoint | Width | Key changes |
|---|---|---|
| Mobile (default) | `< 768px` | Single-column, full-width cards, larger touch targets (h-10), stacked nav |
| Tablet (`md`) | `768px–1199px` | Two-column where appropriate, reduced gutters |
| Desktop (`xl`) | `≥ 1200px` | Full layout, sidebar nav visible, table horizontal scroll removed |

Forms stay single-column at all breakpoints. The mentor dashboard table uses horizontal scroll below `md`. Auth pages (login/signup) center a card with `max-w-[440px]`.

---

## 8. Motion & Interaction

- Transition duration: `150ms` (default), `180ms` for color/background
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (standard ease)
- Hover states on buttons/rows: background color transition only
- Focus rings: immediate (no delay)
- Dialogs: simple opacity + slight scale from 0.97 → 1, `150ms ease`
- `@media (prefers-reduced-motion: reduce)`: disable all transforms and transitions

---

## 9. Accessibility Baseline

- All interactive elements are keyboard-operable
- Focus ring: `outline: 2px solid var(--color-focus); outline-offset: 5px`
- Form inputs have visible labels (never placeholder-only)
- Status badges include a text label (not icon-only)
- Tables have `<caption>` or `aria-label` and proper `scope` on `<th>`
- Dialogs trap focus and restore on close
- Loading states announce via `aria-live="polite"`
- Color contrast: foreground `#202020` on canvas `#fafafa` = 16.5:1 ✓; muted `#666` on canvas = 5.7:1 ✓

---

## 10. globals.css Token Map

```css
@theme inline {
  /* Surfaces */
  --color-canvas: #fafafa;
  --color-surface: #f5f5f5;
  --color-foreground: #202020;
  --color-muted: #666666;
  --color-border: #dedede;

  /* Interactive */
  --color-control: #2020200d;
  --color-glass: #ffffffb8;
  --color-floating: #eeeeeef0;
  --color-floating-hover: #e5e5e5f5;
  --color-floating-active: #dededef5;
  --color-focus: #557993;
  --blur-floating: 16px;

  /* Status */
  --color-status-pending: #92650a;
  --color-status-pending-bg: #fef3c7;
  --color-status-approved: #166534;
  --color-status-approved-bg: #dcfce7;
  --color-status-rejected: #991b1b;
  --color-status-rejected-bg: #fee2e2;

  /* Layout */
  --header-height: 64px;
  --header-control-height: 32px;
  --card-radius: 40px;
  --page-gutter: 32px;
  --section-gap: 112px;
  --column-gap: 40px;

  /* Shadcn/ui bridge tokens */
  --background: var(--color-canvas);
  --foreground: var(--color-foreground);
  --card: var(--color-surface);
  --card-foreground: var(--color-foreground);
  --primary: var(--color-foreground);
  --primary-foreground: #ffffff;
  --secondary: var(--color-surface);
  --secondary-foreground: var(--color-foreground);
  --muted: var(--color-surface);
  --muted-foreground: var(--color-muted);
  --border: var(--color-border);
  --input: var(--color-border);
  --ring: var(--color-focus);
  --radius: 0.75rem; /* 12px — shadcn base, overridden per-component */
}
```

---

## 11. Screens to Implement (in order)

1. **Landing / home** (`/`) — app name, tagline, login + signup CTAs
2. **Login** (`/login`) — centered card, email + password, link to signup
3. **Signup** (`/signup`) — centered card, name + email + password, link to login
4. **Student dashboard** (`/student/dashboard`) — submission list/history, status badges, link to new submission
5. **New submission** (`/student/submissions/new`) — form with 4 fields, validation states
6. **Mentor dashboard** (`/mentor/submissions`) — table with filters, pagination, stats strip, approve/reject actions
