# 🛡️ Comprehensive Proxy Analysis & Installation Guide

> **Interactive web application** that analyzes, ranks, and guides you through installing 10 open-source AI proxy repositories — purpose-built for 8 GB RAM Ubuntu systems (Intel i5-6200U).

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple?logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📑 Table of Contents

- [What Is This Project?](#-what-is-this-project)
- [Live Demo](#-live-demo)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
  - [Layer 1: System Prerequisites](#layer-1-system-prerequisites)
  - [Layer 2: Project Bootstrap](#layer-2-project-bootstrap)
  - [Layer 3: Dependencies Installation](#layer-3-dependencies-installation)
  - [Layer 4: Database Setup](#layer-4-database-setup)
  - [Layer 5: Environment Configuration](#layer-5-environment-configuration)
  - [Layer 6: Development Server](#layer-6-development-server)
  - [Layer 7: Production Build](#layer-7-production-build)
  - [Layer 8: Proxy Monitor Service](#layer-8-proxy-monitor-service)
- [Project Structure](#-project-structure)
- [Feature Walkthrough](#-feature-walkthrough)
- [Layer-by-Layer Expectations](#-layer-by-layer-expectations)
- [Customization Guide](#-customization-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 What Is This Project?

This is a **full-stack interactive web application** that provides:

1. **Ranked analysis of 10 AI proxy repositories** — scored across Memory (40%), Features (25%), Maintenance (15%), Setup (10%), and Unique Value (10%)
2. **Deep dives into the top 3** — GoZen (#1, 9.4/10), routatic-proxy (#2, 8.7/10), OWL-AGENT (#3, 7.7/10)
3. **14-feature comparison matrix** — side-by-side analysis of multi-CLI support, circuit breakers, SSRF protection, and more
4. **Synergy scoring** — optimal proxy combinations ranked (GoZen + OWL-AGENT = 9.2/10)
5. **Step-by-step installation guides** — 11 steps for GoZen, 5 steps for OWL-AGENT with copy-paste commands
6. **Interactive decision tree** — answer questions to find your ideal proxy
7. **Verification checklist** — 8-point post-install validation
8. **21st.dev component search** — live API search for shadcn/ui components
9. **Real-time monitoring dashboard** — WebSocket-connected proxy health monitoring
10. **Dark mode** — full light/dark theme toggle with cascade palette
11. **Unified stack config export** — one-click JSON download for your proxy stack
12. **Installation runner** — step-by-step command execution with status tracking

---

## 🌐 Live Demo

Once running, visit **http://localhost:3000** in your browser.

The application is a single-page app with 9 animated sections, fully responsive from mobile to desktop.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Client)                        │
│  Next.js 16 App Router · React 19 · Framer Motion           │
│  shadcn/ui components · Zustand state · Tailwind CSS 4       │
│  next-themes (dark mode) · Socket.IO client                  │
├─────────────────────────────────────────────────────────────┤
│                     Next.js Server                           │
│  API Routes:                                                 │
│    /api            → Health check                            │
│    /api/health     → GoZen & OWL-AGENT health proxy         │
│    /api/components → 21st.dev component search proxy         │
│  SSR · Static Generation · Middleware                        │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  proxy-data.ts   → 10 ranked proxies, deep dives, install   │
│  store.ts        → Zustand global state                      │
│  db.ts           → Prisma client (SQLite)                    │
│  prisma/schema   → User & Post models                       │
├─────────────────────────────────────────────────────────────┤
│                  Mini-Services                               │
│  proxy-monitor/  → Bun + Socket.IO WebSocket server (3030)  │
│  Caddyfile       → Reverse proxy config (port 81)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.1+ | App Router, SSR, API routes |
| **Language** | TypeScript | 5+ | Type-safe development |
| **UI Library** | React | 19+ | Component rendering |
| **Styling** | Tailwind CSS | 4+ | Utility-first CSS |
| **Components** | shadcn/ui | latest | 45+ Radix UI primitives |
| **Animation** | Framer Motion | 12+ | Scroll animations, transitions |
| **State** | Zustand | 5+ | Lightweight global store |
| **Theme** | next-themes | 0.4+ | Dark mode toggle |
| **Database** | Prisma + SQLite | 6+ | Type-safe ORM |
| **Realtime** | Socket.IO | 4+ | WebSocket monitoring |
| **Runtime** | Bun | latest | Package manager & scripts |
| **Reverse Proxy** | Caddy | latest | Production proxy (optional) |

---

## ✅ Prerequisites

Before you begin, ensure your system meets these requirements:

| Requirement | Minimum | Recommended | How to Check |
|------------|---------|-------------|-------------|
| **Node.js** | 18.x | 20.x+ | `node --version` |
| **Bun** | 1.0+ | 1.1+ | `bun --version` |
| **Git** | 2.30+ | latest | `git --version` |
| **RAM** | 4 GB | 8 GB | `free -h` |
| **Disk** | 1 GB free | 2 GB free | `df -h` |
| **OS** | Ubuntu 20.04+ | Ubuntu 22.04+ | `lsb_release -a` |

> **Note for Windows/macOS users:** This project works on any OS that supports Node.js/Bun. The proxy analysis data is specifically tuned for 8 GB RAM Ubuntu, but the web app itself runs everywhere.

---

## 🚀 Step-by-Step Setup Guide

### Layer 1: System Prerequisites

**What you need:** Node.js, Bun, and Git installed on your machine.

**What to expect:** After this layer, your system will have all the foundational tools required to build and run JavaScript/TypeScript projects.

#### Step 1.1 — Install Node.js (if not installed)

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Verify
node --version   # Should show v20.x.x or higher
npm --version    # Should show 10.x.x or higher
```

**Expectation:** `node --version` outputs v20+ and `npm --version` outputs 10+.

#### Step 1.2 — Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verify
bun --version    # Should show 1.0+ or higher
```

**Expectation:** `bun --version` outputs 1.0+. Bun is used as the primary package manager for faster installs and as the runtime for the proxy-monitor service.

#### Step 1.3 — Install Git

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y git

# macOS (comes with Xcode CLI)
xcode-select --install

# Verify
git --version    # Should show 2.30+
```

**Expectation:** `git --version` outputs 2.30+.

---

### Layer 2: Project Bootstrap

**What you need:** Clone the repository and enter the project directory.

**What to expect:** A fully structured Next.js project on your local machine.

#### Step 2.1 — Clone the repository

```bash
git clone https://github.com/<your-username>/proxy-analysis-guide.git
cd proxy-analysis-guide
```

**Expectation:** You should see files like `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, and the `src/` directory.

#### Step 2.2 — Verify project structure

```bash
ls -la
# You should see:
# - package.json
# - next.config.ts
# - tsconfig.json
# - tailwind.config.ts
# - src/ (main source directory)
# - prisma/ (database schema)
# - mini-services/ (WebSocket monitor)
# - public/ (static assets)
```

**Expectation:** All the above files and directories exist. If anything is missing, re-clone the repository.

---

### Layer 3: Dependencies Installation

**What you need:** Install all npm packages required by the project.

**What to expect:** A `node_modules/` directory with ~500+ packages. This may take 1-3 minutes depending on your internet speed.

#### Step 3.1 — Install main project dependencies

```bash
bun install
```

**Expectation:**
- Command completes without errors
- `node_modules/` directory is created
- `bun.lock` file is updated
- You should see output like: `X packages installed`

> **Troubleshooting:** If you see peer dependency warnings, they are safe to ignore. If install fails, try `rm -rf node_modules bun.lock && bun install`.

#### Step 3.2 — Install proxy-monitor dependencies (optional)

```bash
cd mini-services/proxy-monitor
bun install
cd ../..
```

**Expectation:** `mini-services/proxy-monitor/node_modules/` is created with Socket.IO and CORS packages.

---

### Layer 4: Database Setup

**What you need:** Initialize the SQLite database with Prisma.

**What to expect:** A `prisma/dev.db` file is created with User and Post tables. The Prisma client is generated for type-safe database access.

#### Step 4.1 — Generate Prisma client

```bash
bun run db:generate
```

**Expectation:** Output shows "Generated Prisma Client". This creates the TypeScript client in `node_modules/@prisma/client`.

#### Step 4.2 — Push database schema

```bash
bun run db:push
```

**Expectation:** Output confirms the database was synced. A `prisma/dev.db` file is created (SQLite database).

> **Note:** The database is optional for running the proxy analysis app — it's included as a foundation for future features like user authentication and saved configurations. The core app works without any database data.

---

### Layer 5: Environment Configuration

**What you need:** Set up environment variables for API keys and database connection.

**What to expect:** A `.env.local` file with your configuration values.

#### Step 5.1 — Create environment file

```bash
cp .env.example .env.local   # If .env.example exists
# OR create from scratch:
cat > .env.local << 'EOF'
# Database
DATABASE_URL="file:./dev.db"

# 21st.dev API Key (for component search)
NEXT_PUBLIC_21ST_API_KEY=your_api_key_here

# Optional: GoZen & OWL-AGENT health endpoints
GOZEN_HEALTH_URL=http://localhost:19841/health
OWL_HEALTH_URL=http://127.0.0.1:60000/health
EOF
```

**Expectation:** `.env.local` exists and contains at minimum `DATABASE_URL`. The 21st.dev API key is optional — the component search section falls back to curated results when no key is provided.

> **Important:** Never commit `.env.local` to Git. It's already included in `.gitignore`.

---

### Layer 6: Development Server

**What you need:** Start the Next.js development server.

**What to expect:** A hot-reloading dev server at http://localhost:3000 with all 9 sections of the proxy analysis app.

#### Step 6.1 — Start the dev server

```bash
bun run dev
```

**Expectation:**
- Console output shows: `✓ Ready in Xs` or `Local: http://localhost:3000`
- Opening http://localhost:3000 in your browser shows the full app
- The page loads with a Hero section, animated sections, and full interactivity
- Hot Module Replacement (HMR) works — editing any file auto-refreshes the page

#### Step 6.2 — Verify all sections

Open http://localhost:3000 and scroll through the page. You should see:

| # | Section | What to Look For |
|---|---------|-----------------|
| 1 | Hero | Animated title, cascade palette, "Explore Analysis" button |
| 2 | Methodology | Scoring weights breakdown (Memory 40%, Features 25%, etc.) |
| 3 | Ranked Table | 10 proxies in ranked order with scores and badges |
| 4 | Deep Dives | 3 tabbed deep dives (GoZen, routatic, OWL-AGENT) |
| 5 | Comparison | 14-row feature comparison matrix |
| 6 | Synergy | 3 combo scores with assessment cards |
| 7 | Install Guide | GoZen (11 steps) and OWL-AGENT (5 steps) with copy buttons |
| 8 | Decision Tree | 6 yes/no questions to find your ideal proxy |
| 9 | Checklist | 8 verification items with done/undone toggle |

**Expectation:** All 9 sections render without errors. No console errors in the browser developer tools (warnings are acceptable).

---

### Layer 7: Production Build

**What you need:** Build the project for production deployment.

**What to expect:** An optimized standalone build in `.next/` directory, ready for deployment.

#### Step 7.1 — Build the project

```bash
bun run build
```

**Expectation:**
- Build completes without errors
- `.next/` directory contains the optimized output
- `.next/standalone/` directory is created (due to `output: "standalone"` in next.config.ts)
- Static assets are copied to `.next/standalone/public/`

#### Step 7.2 — Start production server

```bash
bun run start
```

**Expectation:**
- Server starts on port 3000 (or PORT env variable)
- Page loads significantly faster than dev mode
- No hot reload (expected for production)

> **Alternative with Caddy:** If you have Caddy installed, the included `Caddyfile` configures a reverse proxy on port 81 that forwards to the Next.js server.

---

### Layer 8: Proxy Monitor Service

**What you need:** Start the WebSocket monitoring service for real-time proxy health data.

**What to expect:** A Socket.IO server on port 3030 that broadcasts simulated proxy metrics every 2 seconds.

#### Step 8.1 — Start the monitor

```bash
cd mini-services/proxy-monitor
bun run dev
```

**Expectation:**
- Console shows: `[monitor] Proxy monitor WebSocket running on port 3030`
- The Monitoring section in the web app connects and shows live data
- Metrics (RAM, latency, connections) update every 2-3 seconds
- Request log entries appear in real-time

> **Note:** The monitor uses simulated data by default. To use real endpoints, update the health check URLs in `src/app/api/health/route.ts` and the monitor service in `mini-services/proxy-monitor/index.ts`.

---

## 📁 Project Structure

```
proxy-analysis-guide/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: fonts, metadata, ThemeProvider
│   │   ├── page.tsx            # Main page: 9 sections, ~650 lines
│   │   ├── globals.css         # Tailwind 4 + shadcn/ui CSS variables
│   │   └── api/
│   │       ├── route.ts        # Basic health check endpoint
│   │       ├── health/route.ts # GoZen & OWL-AGENT health proxy
│   │       └── components/route.ts  # 21st.dev API search proxy
│   ├── components/
│   │   ├── theme-provider.tsx  # next-themes wrapper
│   │   ├── new-sections.tsx    # Dark mode, search, monitoring, install runner
│   │   └── ui/                 # 45+ shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── tabs.tsx
│   │       ├── progress.tsx
│   │       └── ... (40+ more)
│   ├── lib/
│   │   ├── proxy-data.ts      # All proxy data, types, install steps
│   │   ├── store.ts           # Zustand global state
│   │   ├── db.ts              # Prisma client singleton
│   │   └── utils.ts           # cn() utility for Tailwind
│   └── hooks/
│       ├── use-toast.ts       # Toast notification hook
│       └── use-mobile.ts      # Mobile detection hook
├── prisma/
│   └── schema.prisma          # Database schema (User, Post models)
├── mini-services/
│   └── proxy-monitor/
│       ├── index.ts           # Socket.IO WebSocket server
│       └── package.json       # Monitor dependencies
├── public/
│   ├── logo.svg               # App logo
│   └── robots.txt             # SEO robots
├── examples/
│   └── websocket/
│       ├── frontend.tsx       # WebSocket client example
│       └── server.ts          # WebSocket server example
├── package.json               # Project dependencies & scripts
├── next.config.ts             # Next.js configuration (standalone output)
├── tailwind.config.ts         # Tailwind CSS + dark mode config
├── tsconfig.json              # TypeScript configuration
├── postcss.config.mjs         # PostCSS with Tailwind plugin
├── eslint.config.mjs          # ESLint with Next.js + TypeScript rules
├── components.json            # shadcn/ui configuration
├── Caddyfile                  # Caddy reverse proxy config
└── README.md                  # This file
```

---

## 🎬 Feature Walkthrough

### 1. Hero Section
Animated entrance with gradient text, cascade palette (#92751f accent, #5a36c3 accent2), and a scroll-triggered "Explore Analysis" CTA.

### 2. Methodology Section
Visual breakdown of the scoring system with animated progress bars: Memory (40%), Features (25%), Maintenance (15%), Setup (10%), Unique Value (10%).

### 3. Ranked Proxy Table
10 proxies displayed in ranked order with:
- Color-coded scores (green ≥8, yellow ≥6, red <6)
- Language, RAM, and feature count badges
- Hover effects with Framer Motion stagger animations

### 4. Deep Dive Tabs
Three tabbed panels for the top proxies:
- Architecture description
- Feature grid with details
- RAM analysis
- Pros/cons comparison
- One-line install command with copy button

### 5. Comparison Matrix
14-row feature comparison across GoZen, routatic-proxy, and OWL-AGENT with color-coded values.

### 6. Synergy Combos
Three combination scores with visual cards and synergy assessments.

### 7. Installation Guide
Step-by-step installation with:
- GoZen: 11 steps with commands and explanations
- OWL-AGENT: 5 steps with commands and explanations
- One-click copy buttons for every command
- Startup sequence with verification

### 8. Decision Tree
Six yes/no questions that guide you to the ideal proxy for your use case.

### 9. Verification Checklist
Eight post-install checks with toggle-able done/undone state.

### 10. Dark Mode Toggle
Seamless light/dark theme switching using next-themes with cascade palette tokens:
- Light: `#f6f6f6` background, `#151513` text
- Dark: `#1a1a1e` background, `#e8e6e1` text

### 11. Component Search
Live 21st.dev API integration for searching shadcn/ui components with:
- Search input with real-time results
- Component name, description, and install command
- Copy install command to clipboard
- Fallback curated results when API is unavailable

### 12. Real-time Monitoring
WebSocket-connected dashboard showing:
- GoZen and OWL-AGENT health status
- RAM usage, latency, active connections
- Circuit breaker state
- Live request log with model, path, and status

### 13. Config Export
One-click download of the unified stack configuration as a JSON file for GoZen + OWL-AGENT integration.

### 14. Installation Runner
Step-by-step command execution with:
- Status tracking (pending → running → success/failed)
- Auto-scroll through steps
- Retry and reset capabilities

---

## 📊 Layer-by-Layer Expectations

| Layer | What You Build | Time | Key Outcome |
|-------|---------------|------|-------------|
| **1. System Prerequisites** | Node.js, Bun, Git | 5-10 min | All CLI tools available |
| **2. Project Bootstrap** | Cloned repo, verified structure | 2 min | Source code on disk |
| **3. Dependencies** | node_modules installed | 1-3 min | All packages resolved |
| **4. Database** | Prisma client + SQLite | 1 min | Type-safe DB access ready |
| **5. Environment** | .env.local configured | 2 min | API keys and DB URL set |
| **6. Dev Server** | Hot-reloading app on :3000 | 30 sec | Full app in browser |
| **7. Production Build** | Optimized standalone build | 2-5 min | Deploy-ready artifacts |
| **8. Monitor Service** | WebSocket server on :3030 | 30 sec | Live proxy metrics |

**Total setup time: ~15-25 minutes** for a complete development environment.

---

## 🎨 Customization Guide

### Changing the Color Palette

The cascade palette is defined in `src/app/globals.css` as CSS custom properties. To change colors:

```css
:root {
  --background: oklch(1 0 0);          /* Main background */
  --foreground: oklch(0.145 0 0);      /* Main text */
  --primary: oklch(0.205 0.064 285.88); /* Primary accent */
  --secondary: oklch(0.969 0.016 285.89);
  /* ... more variables */
}
```

The custom cascade palette tokens are used directly in components:
- `bg-[#6b634d]` — Header
- `bg-[#92751f]` — Accent
- `bg-[#5a36c3]` — Accent 2
- `bg-[#3f7450]` — Success
- `bg-[#8b4e49]` — Error
- `bg-[#537ba4]` — Info

### Adding New Proxies

Edit `src/lib/proxy-data.ts` and add entries to the `rankedProxies` array:

```typescript
{ rank: 11, name: "MyProxy", language: "Rust", estRam: "20-30 MB",
  features: 8, maintenance: 7, setup: 8, score: 7.5,
  description: "Your proxy description here",
  uniqueValue: "What makes it unique" },
```

### Adding New Sections

Create a new section component in `src/app/page.tsx` following the existing pattern:

```tsx
<section id="my-section" className="py-20 px-6">
  <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
    {/* Your content */}
  </motion.div>
</section>
```

---

## 🔧 Troubleshooting

### Problem: `bun install` fails with network errors

**Solution:**
```bash
# Clear cache and retry
rm -rf node_modules bun.lock
bun install

# If still failing, try with npm
npm install
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run dev
```

### Problem: Dark mode doesn't persist on refresh

**Solution:** Ensure `next-themes` is properly wrapping the app in `layout.tsx` with `attribute="class"`. The theme is stored in localStorage automatically.

### Problem: WebSocket monitor won't connect

**Solution:**
1. Ensure the proxy-monitor service is running: `cd mini-services/proxy-monitor && bun run dev`
2. Check that port 3030 is open: `curl http://localhost:3030`
3. Verify the Socket.IO client URL in `src/components/new-sections.tsx` points to `http://localhost:3030`

### Problem: Build fails with TypeScript errors

**Solution:**
```bash
# The project has ignoreBuildErrors: true in next.config.ts
# If you want strict checking, remove that line and fix errors manually

# For a quick fix, just build with the current config:
bun run build
```

### Problem: 21st.dev component search returns no results

**Solution:** The API key in `/api/components/route.ts` may have expired. Either:
1. Get a new key from https://21st.dev and update the `API_KEY` constant
2. Or rely on the built-in fallback results (12 curated shadcn/ui components)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Development Workflow

```bash
# 1. Start dev server
bun run dev

# 2. Make changes in src/

# 3. Lint your code
bun run lint

# 4. Build to verify no production errors
bun run build

# 5. Commit and push
git add .
git commit -m "feat: description of your change"
git push
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

The analyzed proxy repositories have their own licenses:
- **GoZen** — MIT
- **routatic-proxy** — AGPL-3.0
- **OWL-AGENT** — MIT

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)

The easiest way to deploy this Next.js app is with [Vercel](https://vercel.com):

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `marktantongco/proxy-analysis-guide`
3. Vercel auto-detects Next.js — just click **Deploy**
4. Your app will be live at `https://your-project.vercel.app`

> **Note:** The `vercel.json` is already configured in the repo. No additional setup needed.

### Option 2: GitHub Actions + Vercel

A GitHub Actions workflow is included at `.github/workflows/deploy-vercel.yml`. To use it:

1. Create a Vercel account and get an API token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Add the token as a GitHub secret: `VERCEL_TOKEN` (Settings → Secrets → Actions)
3. Push to `main` — the workflow will auto-deploy

### Option 3: Self-Hosted (VPS/Cloud)

```bash
# Build the standalone production bundle
bun run build

# Start the production server
bun run start

# Or with Caddy reverse proxy (Caddyfile included):
caddy run
```

The standalone build outputs to `.next/standalone/` and can run with just Node.js/Bun — no `node_modules` needed in production.

### Option 4: Docker

```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run db:generate
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["bun", "server.js"]
```

---

## 🏆 Key Findings

| Rank | Proxy | Score | Best For |
|------|-------|-------|----------|
| #1 | GoZen | 9.4/10 | Overall best — lowest RAM + most features |
| #2 | routatic-proxy | 8.7/10 | macOS users — native GUI + circuit breaker |
| #3 | OWL-AGENT | 7.7/10 | Security — SSRF protection + predictive circuit breaker |

**Best synergy combo:** GoZen + OWL-AGENT (9.2/10) — features + security + observability at ~110-170 MB total RAM.

---

Built with ❤️ by [Z.ai](https://z.ai) · Powered by Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, and Framer Motion.
