// ── Proxy Analysis Data Layer ─────────────────────────────────────────
// Extracted from the Comprehensive Proxy Analysis & Installation Guide PDF
// SMP v5.1 Protocol | 8-GB RAM Ubuntu | Intel i5-6200U

export interface ProxyRepo {
  rank: number;
  name: string;
  language: string;
  estRam: string;
  features: number;
  maintenance: number;
  setup: number;
  score: number;
  description: string;
  uniqueValue: string;
}

export interface ProxyDeepDive {
  name: string;
  tagline: string;
  architecture: string;
  features: { title: string; detail: string }[];
  ramDetail: string;
  installCmd: string;
  limitations: string[];
  pros: string[];
  cons: string[];
}

export interface ComparisonFeature {
  feature: string;
  gozen: string;
  routatic: string;
  owl: string;
}

export interface SynergyCombo {
  combo: string;
  score: string;
  assessment: string;
}

export interface InstallStep {
  step: number;
  title: string;
  command: string;
  explanation: string;
}

export interface ChecklistItem {
  check: string;
  command: string;
  expected: string;
  done: boolean;
}

export interface DecisionNode {
  question: string;
  yes: string;
  no: string;
}

// ── All 10 Ranked Proxies ────────────────────────────────────────────
export const rankedProxies: ProxyRepo[] = [
  { rank: 1, name: "GoZen", language: "Go", estRam: "30-50 MB", features: 10, maintenance: 9, setup: 9, score: 9.4, description: "Multi-CLI environment switcher with API proxy auto-failover, scenario routing, budget controls, Web UI, and Bot Gateway.", uniqueValue: "Most feature-complete proxy with lowest RAM" },
  { rank: 2, name: "routatic-proxy", language: "Go", estRam: "30-50 MB", features: 9, maintenance: 8, setup: 8, score: 8.7, description: "Go CLI proxy with circuit breaker, Anthropic-first failover, native macOS GUI, and live format transformation.", uniqueValue: "Best circuit breaker + native macOS GUI" },
  { rank: 3, name: "OWL-AGENT", language: "Python", estRam: "80-120 MB", features: 7, maintenance: 7, setup: 8, score: 7.7, description: "Local-first mesh aggregator for free-tier AI providers with SSRF allowlist, predictive circuit breaker, and MCP server.", uniqueValue: "Only proxy optimized for 8 GB RAM + SSRF security" },
  { rank: 4, name: "opclaude", language: "Node.js", estRam: "100-200 MB", features: 8, maintenance: 8, setup: 8, score: 7.5, description: "Auto-routing proxy that switches between cheap and real Claude based on task type.", uniqueValue: "Automatic cheap vs real Claude routing" },
  { rank: 5, name: "claude-code-zen-proxy", language: "Node.js", estRam: "60-100 MB", features: 7, maintenance: 7, setup: 9, score: 7.3, description: "Lightweight proxy focused on simplicity and ease of configuration.", uniqueValue: "Simplest setup among Node.js proxies" },
  { rank: 6, name: "Antigravity Proxy", language: "Bun/JS", estRam: "80-150 MB", features: 8, maintenance: 7, setup: 8, score: 7.2, description: "Bun-based proxy with performance-optimized request handling.", uniqueValue: "Bun runtime for faster cold starts" },
  { rank: 7, name: "opencode-zen-gateway", language: "Python", estRam: "80-120 MB", features: 7, maintenance: 6, setup: 8, score: 7.0, description: "Python gateway for OpenCode ecosystem integration.", uniqueValue: "OpenCode-native integration" },
  { rank: 8, name: "ExtremeRouter", language: "Next.js", estRam: "200-400 MB", features: 9, maintenance: 8, setup: 7, score: 6.8, description: "Feature-rich router claiming 20-40% token savings through intelligent caching and compression.", uniqueValue: "Token savings up to 40%" },
  { rank: 9, name: "openrelay", language: "Unknown", estRam: "100-200 MB", features: 8, maintenance: 7, setup: 6, score: 6.5, description: "Open-source relay proxy with basic routing capabilities.", uniqueValue: "Community-driven relay approach" },
  { rank: 10, name: "openclaw-proxy", language: "Python", estRam: "80-120 MB", features: 6, maintenance: 6, setup: 7, score: 6.3, description: "Python proxy with Claw ecosystem integration.", uniqueValue: "Claw platform integration" },
];

// ── Deep Dives: Top 3 ────────────────────────────────────────────────
export const deepDives: ProxyDeepDive[] = [
  {
    name: "GoZen",
    tagline: "Best Overall — Rank #1",
    architecture: "GoZen runs as a unified daemon (zend) hosting both the HTTP proxy server (port 19841) and the Web management UI (port 19840). The daemon starts automatically when you run `zen` or `zen web`. Configuration is hot-reloaded via file watching on `~/.zen/zen.json`, so edits take effect without restart.",
    features: [
      { title: "Multi-CLI Support", detail: "Claude Code, Codex, and OpenCode with per-project directory bindings" },
      { title: "Proxy Failover", detail: "Auto-switch to backup providers with 4 strategies: failover, round-robin, least-latency, least-cost" },
      { title: "Scenario Routing", detail: "Route by request type: thinking, image, long context, web search, background tasks" },
      { title: "Budget Control", detail: "Daily/weekly/monthly limits with warn, downgrade, or block actions" },
      { title: "Context Compression", detail: "Auto-compress when tokens exceed configurable threshold with target ratio" },
      { title: "Web Management UI", detail: "Browser-based UI with session auth, brute-force protection, RSA key encryption" },
      { title: "Config Sync", detail: "Sync across devices via WebDAV, S3, GitHub Gist, or Repo with AES-256-GCM" },
      { title: "Bot Gateway", detail: "Remote control via Telegram, Discord, Slack, Lark, or Facebook Messenger" },
      { title: "Middleware Pipeline", detail: "Pluggable request/response transformation: context-injection, rate-limiter, compression" },
      { title: "Provider Health", detail: "Real-time health checks with latency and error rate tracking via API and Web UI" },
    ],
    ramDetail: "30-50 MB RSS as a Go binary. No runtime interpreter needed. Web UI adds minimal overhead as static assets. Even with health monitoring, compression, and budget tracking active, total footprint rarely exceeds 60 MB — leaving ~7.9 GB for Claude Code.",
    installCmd: "curl -fsSL https://raw.githubusercontent.com/dopejs/gozen/main/install.sh | sh",
    limitations: [
      "No built-in circuit breaker — relies on reactive failover chains",
      "No native desktop GUI (Web UI only)",
      "SSRF protection is absent — any reachable URL can be proxied",
      "Bot Gateway requires per-platform token setup (configuration overhead)",
    ],
    pros: [
      "Lowest memory footprint (30-50 MB Go binary) — ideal for 8 GB RAM",
      "Most feature-complete: scenario routing, budget controls, compression, Bot Gateway",
      "One-line installation with no runtime dependencies",
      "Web UI with strong security (session auth, RSA encryption, brute-force protection)",
      "MIT license allows unrestricted commercial use",
    ],
    cons: [
      "No built-in circuit breaker — reactive failover only",
      "No native desktop GUI (Web UI only)",
      "No SSRF protection — any reachable URL can be proxied",
      "Bot Gateway requires per-platform token configuration",
    ],
  },
  {
    name: "routatic-proxy",
    tagline: "Best for macOS — Rank #2",
    architecture: "Go CLI proxy that routes Claude Code requests through multiple upstream providers with automatic model selection and format transformation. Sits between Claude Code and providers, intercepting Anthropic API requests and transforming them to OpenAI, Anthropic, Responses, or Gemini format. Supports 5 provider backends: OpenCode Go, OpenCode Zen, AWS Bedrock, OpenRouter, and Anthropic direct.",
    features: [
      { title: "Circuit Breaker", detail: "Tracks model health and proactively skips failing models to avoid latency spikes" },
      { title: "Fallback Chains", detail: "Auto-tries next model in chain if current one fails" },
      { title: "Anthropic-First Failover", detail: "Keep Claude on Anthropic, use OpenCode only during rate limits" },
      { title: "Real-time Streaming", detail: "Full SSE streaming with live format transformation between protocols" },
      { title: "Tool Calling Translation", detail: "Bidirectional Anthropic tool_use ↔ OpenAI/Gemini function calling" },
      { title: "Hot Reload", detail: "Watch config file for changes, reload without restart" },
      { title: "Native macOS GUI", detail: "System tray integration with Cocoa window; browser dashboard on Linux" },
      { title: "Streaming Scenario Routing", detail: "Configurable routing for streaming requests by context type" },
    ],
    ramDetail: "30-50 MB RSS as a Go binary — identical memory class to GoZen. The native GUI adds negligible overhead on macOS. On Linux, the browser dashboard runs as a separate lightweight process.",
    installCmd: "brew tap routatic/tap && brew install routatic-proxy",
    limitations: [
      "Native GUI is macOS-only; Linux gets browser dashboard",
      "No budget controls, context compression, or Bot Gateway",
      "AGPL-3.0 license may restrict commercial use",
      "Fewer community contributors than GoZen",
    ],
    pros: [
      "Circuit breaker proactively skips unhealthy models",
      "Native macOS GUI with system tray integration",
      "Anthropic-first failover preserves native Claude experience",
      "Full SSE streaming with live format transformation",
      "Hot reload for configuration without restart",
    ],
    cons: [
      "Native GUI is macOS-only; Linux gets browser dashboard",
      "No budget controls, context compression, or Bot Gateway",
      "AGPL-3.0 license may restrict commercial use",
      "Fewer community contributors than GoZen",
    ],
  },
  {
    name: "OWL-AGENT",
    tagline: "Best for Your Hardware — Rank #3",
    architecture: "Described as 'not a proxy but a mesh' — a local-first aggregator for free tiers of 6 AI providers (Antigravity, Claude, OpenCode, Copilot, Kiro, Hermes). Explicitly targets Ubuntu 22.04+ with 8 GB RAM. Architecture prioritizes security (SSRF allowlist), observability (UDP mesh health), and proactive resilience (predictive circuit breaker) over feature breadth.",
    features: [
      { title: "SSRF Allowlist", detail: "Only 6 provider domains reachable; loopback, link-local, RFC1918, and cloud-metadata IPs rejected" },
      { title: "Predictive Circuit Breaker", detail: "Per-domain latency ring buffer (20 requests); opens before 5th failure if last 3 exceed 2x p50" },
      { title: "Mesh Health Broadcast", detail: "UDP multicast (239.255.255.250:42100) for LAN-wide observability" },
      { title: "MCP Server", detail: "5 JSON-RPC tools over stdin/stdout, compatible with Claude Code and Cursor" },
      { title: "8 GB RAM Optimization", detail: "Default max_connections=5, AutoTuner warns when RAM exceeds 85%" },
      { title: "Systemd Unit", detail: "Included service file for automatic startup and process management" },
      { title: "Podman Support", detail: "Rootless container deployment with optional mesh and authentication" },
    ],
    ramDetail: "80-120 MB due to Python runtime (2-4x Go binaries). Default max_connections=5 is tuned for 8 GB RAM. AutoTuner monitors RAM pressure and logs warnings at 85%. The mesh UDP broadcast adds minimal overhead (~1 MB).",
    installCmd: "git clone https://github.com/marktantongco/owl-agent-free-ai-proxy-gateway.git && cd owl-agent-free-ai-proxy-gateway && bash install_owl_unified.sh",
    limitations: [
      "Python runtime uses 2-4x more RAM than Go alternatives",
      "Still in active development (v7.2 pending); some features are no-ops",
      "Mesh is observability-only, not load balancing",
      "Single primary contributor increases bus factor risk",
      "No Web UI, budget controls, or scenario routing",
    ],
    pros: [
      "Only proxy explicitly optimized for 8 GB RAM environments",
      "Predictive circuit breaker opens before upstream fails",
      "SSRF allowlist provides security no other proxy offers",
      "Mesh health broadcast enables LAN-wide observability",
      "MCP server integration for direct Claude Code / Cursor usage",
    ],
    cons: [
      "Python runtime uses 2-4x more RAM than Go alternatives",
      "Still in active development (v7.2 pending); some features are no-ops",
      "Mesh is observability-only, not load balancing",
      "Single primary contributor increases bus factor risk",
      "No Web UI, budget controls, or scenario routing",
    ],
  },
];

// ── Feature Comparison Matrix ─────────────────────────────────────────
export const comparisonFeatures: ComparisonFeature[] = [
  { feature: "Multi-CLI Support", gozen: "Yes (3 CLIs)", routatic: "No (Claude Code)", owl: "No (agnostic)" },
  { feature: "Circuit Breaker", gozen: "No (reactive failover)", routatic: "Yes (health-based)", owl: "Yes (predictive)" },
  { feature: "Scenario Routing", gozen: "Yes (5 scenarios)", routatic: "Yes (streaming)", owl: "No" },
  { feature: "Budget Control", gozen: "Yes (daily/weekly/monthly)", routatic: "No", owl: "No" },
  { feature: "Context Compression", gozen: "Yes (threshold-based)", routatic: "No", owl: "No" },
  { feature: "Web UI", gozen: "Yes (built-in, secure)", routatic: "Yes (browser dashboard)", owl: "No" },
  { feature: "Native GUI", gozen: "No (Web only)", routatic: "Yes (macOS Cocoa)", owl: "No" },
  { feature: "Config Sync", gozen: "Yes (4 backends)", routatic: "No", owl: "No" },
  { feature: "Bot Gateway", gozen: "Yes (5 platforms)", routatic: "No", owl: "No" },
  { feature: "SSRF Protection", gozen: "No", routatic: "No", owl: "Yes (allowlist)" },
  { feature: "Mesh Health", gozen: "No", routatic: "No", owl: "Yes (UDP broadcast)" },
  { feature: "MCP Server", gozen: "No", routatic: "No", owl: "Yes (5 tools)" },
  { feature: "Language / RAM", gozen: "Go / 30-50 MB", routatic: "Go / 30-50 MB", owl: "Python / 80-120 MB" },
  { feature: "License", gozen: "MIT", routatic: "AGPL-3.0", owl: "MIT" },
];

// ── Synergy Scores ───────────────────────────────────────────────────
export const synergyCombos: SynergyCombo[] = [
  { combo: "GoZen + OWL-AGENT", score: "9.2/10", assessment: "Complementary: features + security + observability" },
  { combo: "GoZen + routatic-proxy", score: "6.5/10", assessment: "Redundant overlap in core proxy functionality" },
  { combo: "routatic-proxy + OWL-AGENT", score: "7.8/10", assessment: "Good resilience + security, lacks management features" },
];

// ── Installation Steps: GoZen ────────────────────────────────────────
export const gozenInstallSteps: InstallStep[] = [
  { step: 1, title: "Verify RAM", command: "free -h", explanation: "Expected: ~8 GB total, with at least 4 GB available" },
  { step: 2, title: "Check OS Version", command: "lsb_release -a", explanation: "Expected: Ubuntu 22.04+" },
  { step: 3, title: "Verify curl", command: "which curl || sudo apt install -y curl", explanation: "Ensure curl is available for download" },
  { step: 4, title: "Install GoZen", command: "curl -fsSL https://raw.githubusercontent.com/dopejs/gozen/main/install.sh | sh", explanation: "One-line install — downloads pre-compiled binary to ~/.local/bin/zen" },
  { step: 5, title: "Add Provider", command: "zen config add provider", explanation: "Interactive prompt for provider name, URL, and API key" },
  { step: 6, title: "Create Profile", command: "zen config add profile", explanation: "Ordered list of providers for failover + scenario routing" },
  { step: 7, title: "Launch GoZen", command: "zen", explanation: "Starts zend daemon, configures env vars, launches CLI" },
  { step: 8, title: "Verify Daemon", command: "zen daemon status", explanation: "Should show 'running' with PID" },
  { step: 9, title: "Test with Claude Code", command: "export ANTHROPIC_BASE_URL=http://localhost:19841 && claude", explanation: "Route all API requests through GoZen proxy" },
  { step: 10, title: "Enable Auto-Start", command: "zen daemon enable", explanation: "Install as systemd user service for boot auto-start" },
  { step: 11, title: "Open Web UI", command: "zen web", explanation: "Visual management at http://localhost:19840" },
];

// ── Installation Steps: OWL-AGENT ────────────────────────────────────
export const owlInstallSteps: InstallStep[] = [
  { step: 12, title: "Install Python + deps", command: "sudo apt update && sudo apt install -y python3 python3-venv python3-pip git", explanation: "Python 3.10+ with venv support required" },
  { step: 13, title: "Clone & Install", command: "git clone https://github.com/marktantongco/owl-agent-free-ai-proxy-gateway.git\ncd owl-agent-free-ai-proxy-gateway\nbash install_owl_unified.sh", explanation: "Creates ~/.owl-agent/{config,logs,cache}, sets up venv, installs systemd unit" },
  { step: 14, title: "Verify Health", command: "curl http://127.0.0.1:60000/health", explanation: "Should return JSON with status 'ok', version 7.1.0" },
  { step: 15, title: "Enable Mesh (Optional)", command: "export OWL_ENABLE_MESH=true\nsudo systemctl restart owl-forward-proxy", explanation: "UDP multicast broadcast every 30s for LAN observability" },
  { step: 16, title: "Add Custom Domains", command: 'export OWL_ALLOW_EXTRA="my-internal-llm.corp.example.com,api.my-provider.com"', explanation: "Comma-separated domains added to SSRF allowlist" },
];

// ── Verification Checklist ────────────────────────────────────────────
export const verificationChecklist: ChecklistItem[] = [
  { check: "GoZen daemon running", command: "zen daemon status", expected: "Should show 'running' with PID", done: false },
  { check: "GoZen Web UI accessible", command: "curl http://localhost:19840", expected: "Should return HTML page", done: false },
  { check: "OWL-AGENT healthy", command: "curl http://127.0.0.1:60000/health", expected: 'JSON with status "ok"', done: false },
  { check: "Proxy chain working", command: "zen list then claude", expected: "Claude connects through proxy", done: false },
  { check: "Budget controls active", command: "Check Web UI Settings", expected: "Budget limits displayed", done: false },
  { check: "SSRF protection active", command: "Attempt non-allowlisted URL", expected: "403 Forbidden", done: false },
  { check: "Mesh broadcasting", command: "tcpdump -i any port 42100", expected: "UDP packets every 30s", done: false },
  { check: "System RAM under 200 MB", command: "ps aux | grep -E 'zen|owl'", expected: "Combined under 200 MB", done: false },
];

// ── Decision Tree ─────────────────────────────────────────────────────
export const decisionTree: DecisionNode[] = [
  { question: "Is RAM your primary constraint?", yes: "GoZen (Go binary, 30-50 MB)", no: "Any option works; optimize for features" },
  { question: "Need a Web management UI?", yes: "GoZen (built-in, secure)", no: "routatic-proxy (native macOS GUI)" },
  { question: "Need SSRF protection?", yes: "GoZen + OWL-AGENT (layered stack)", no: "GoZen alone" },
  { question: "Need a circuit breaker?", yes: "routatic-proxy or OWL-AGENT", no: "GoZen reactive failover is adequate" },
  { question: "Want auto-task routing?", yes: "opclaude (cheap vs real Claude)", no: "GoZen scenario routing covers this" },
  { question: "Need token savings (20-40%)?", yes: "ExtremeRouter (but 200-400 MB RAM)", no: "Skip; GoZen context compression suffices" },
];

// ── RAM Impact ────────────────────────────────────────────────────────
export const ramImpact = [
  { component: "GoZen (zend daemon)", ram: "30-50 MB", purpose: "Proxy + Web UI + Health monitoring" },
  { component: "OWL-AGENT (Python)", ram: "80-120 MB", purpose: "SSRF filter + Circuit breaker + Mesh" },
  { component: "Total Stack", ram: "110-170 MB", purpose: "~2.1% of 8 GB RAM" },
  { component: "Remaining for Claude Code", ram: "~7.8 GB", purpose: "Sufficient for most workloads" },
];

// ── Unified Stack Config ─────────────────────────────────────────────
export const unifiedStackConfig = `{
  "providers": {
    "owl-secure": {
      "base_url": "http://127.0.0.1:60000",
      "auth_token": "your-upstream-api-key",
      "model": "claude-sonnet-4-20250514"
    }
  },
  "profiles": {
    "default": {
      "providers": ["owl-secure"]
    }
  }
}`;

// ── Startup Sequence ─────────────────────────────────────────────────
export const startupSequence = [
  { step: 17, cmd: "sudo systemctl start owl-forward-proxy", desc: "Start OWL-AGENT first (security layer)" },
  { step: 18, cmd: "curl http://127.0.0.1:60000/health", desc: "Verify OWL-AGENT is healthy" },
  { step: 19, cmd: "zen", desc: "Start GoZen (management layer)" },
  { step: 20, cmd: "zen daemon status && curl http://localhost:19840", desc: "Verify full stack" },
];

// ── Scoring Weights ──────────────────────────────────────────────────
export const scoringWeights = [
  { criterion: "Memory", weight: 40, description: "Dominant constraint on 8 GB systems" },
  { criterion: "Features", weight: 25, description: "Capability breadth for proxy management" },
  { criterion: "Maintenance", weight: 15, description: "Community activity and update frequency" },
  { criterion: "Setup", weight: 10, description: "Installation and configuration simplicity" },
  { criterion: "Unique Value", weight: 10, description: "Differentiating capabilities" },
];
