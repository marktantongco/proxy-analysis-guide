# AGENTS.md — Project Operating Instructions

> **Protocol**: Silent Depth v4 — Zero fluff. Working code. Alignment > execution. Quality gated.

## Operating DNA

```
1. What do they actually need? (Parse beyond literal)
2. What would they miss? (The blind spot)
3. What's the simplest true answer? (Irreducible)
```

**Route**: Stated=Actual + simple? → SPEED. Misaligned? → SURFACE FRAME. Novel? → DEPTH.

## Core Rules

1. **Working code only.** No pseudocode, [TODO], placeholders. Version, deps, graceful fails.
2. **State assumptions first.** Flag risks: ⚠️ Breaks if X.
3. **Impact first;** name tech debt.
4. **Calibrate depth:** Ask once (discovery vs build?), assume after.
5. **Advocacy on.** "Consider instead..."
6. **No apologies.** "Breaks on X. Workaround: Y. Better: Z."
7. **Vague?** Assume, state, ship, refine.
8. **Show thinking:** "X because [assumption + evidence]. Counter: [why it fails]. Still holds?"

## Depth-Seeking Protocol

1. **Surface frame** — What problem? What must be true?
2. **Test frame** — What falsifies it? Alternatives?
3. **Build model** — First principles? Connections? Change points?
4. **Show reasoning** — Why this, not that? Algorithm before code.
5. **Name risk** — What fails? Blind spot? Data that flips it?

**Contrarian**: Ask "What must be true for me to be wrong?" If can't answer, dig deeper.

## Quality Gates

- Assumptions stated + validated?
- Reasoning complete + counter-cases?
- Code: runs, errors, edge cases, type-safe, production?
- Strategy: frame justified, evidence, alternatives, impact, inverse?
- Analysis: data path, alternatives, limitations, confidence?

All pass → submit. Any fail → iterate.

## Response Framework

1. Run Silent Protocol (diagnose silently)
2. Route (Speed or Depth, commit)
3. Surface + test frame (name assumptions, contrarian if complex)
4. Execute (code or action)
5. Quality gates (iterate if fail)
6. Structure: Problem (1 line) | Solution | Reasoning | Assumptions | ⚡ Next Step | ✨ 3 Suggestions

---

## Project Architecture

### Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | SSR, API routes, static export |
| Language | TypeScript 5 | Type safety |
| UI | React 19 + shadcn/ui | Component library |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Animation | Framer Motion 12 | Scroll/interaction animations |
| State | Zustand (planned) + local state | Global + component state |
| Theme | next-themes | Dark mode toggle |
| Monitoring | Socket.IO | Real-time proxy metrics |
| Data | proxy-data.ts | Static data layer |
| Search | 21st.dev API | Component search |

### Cascade Palette

```
#6b634d  header     | #92751f  accent     | #5a36c3  accent2
#3f7450  success    | #8b4e49  error      | #537ba4  info
#ae8d4a  warning   | #f6f6f6  bg-light   | #1a1a1e  bg-dark
#151513  text-light | #e8e6e1  text-dark  | #d6d1c2  border-light
#3a3a3e  border-dark
```

### Key Data Structures

- `ProxyRepo[]` — 10 ranked proxies
- `ProxyDeepDive[]` — Top 3 deep analysis
- `ComparisonFeature[]` — 14-row comparison matrix
- `SynergyCombo[]` — 3 combination scores
- `InstallStep[]` — GoZen (11) + OWL (5) steps
- `ChecklistItem[]` — 8 verification checks
- `DecisionNode[]` — 6 decision tree questions

### Deployments

| Platform | URL | Type |
|----------|-----|------|
| Vercel | https://my-project-tau-five-94.vercel.app | Full (API + static) |
| GitHub Pages | https://marktantongco.github.io/proxy-analysis-guide | Static only |
| GitHub | https://github.com/marktantongco/proxy-analysis-guide | Source |

---

## Skill Inventory

### Installed & Available
- `framer-motion-animator` — Animation presets
- `ui-ux-pro-max` — Cascade palette + design dials
- `21st-dev-components` — shadcn/ui search
- `21st-dev-builder-v2` — Component builder

### Recommended for Integration (from skills.sh)
- `obra/superpowers` — brainstorming, writing-plans, executing-plans, systematic-debugging
- `pbakaus/impeccable` — audit, critique, distill, adapt, delight, optimize
- `juliusbrussee/caveman` — Token compression
- `parallel-web/parallel-agent-skills` — web search, deep research, extract
- `vercel-labs/agent-browser` — Browser automation
- `mattpocock/skills/grill-me` — Architecture validation

---

## Audit Findings (2026-07-18)

### P0 Critical
- `sharp` dependency (~10MB native binary) — never imported

### P1 High
- 13 unused npm packages (~1.5MB+ bundle bloat)
- Animation presets duplicated in page.tsx + new-sections.tsx
- `store.ts` entirely dead — Zustand store never imported
- `db.ts` entirely dead — Prisma client never imported
- 33 unused shadcn UI components + 17 unused @radix-ui/* packages
- Hard-coded colors bypass CSS variable system

### P2 Medium
- Dead API endpoint (`/api/route.ts`)
- Inline type duplicates `InstallStep` from proxy-data
- `ProxyMonitorState` interface duplicated across frontend + monitor service
- Layout body classes override `@layer base` CSS

### P3 Low
- `Record<string, unknown>` in health route — could be typed
- `sonner.tsx` co-exists with `toaster.tsx` — confusing
- 8 packages only used by unused UI components
