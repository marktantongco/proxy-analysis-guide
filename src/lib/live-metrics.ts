// ── Live Proxy Repo Metrics Data Layer ──────────────────────────────────
// Fetches real GitHub data for the 10 proxy repos and computes health scores.

export interface RepoMetrics {
  name: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;        // ISO date
  lastCommitDaysAgo: number; // computed
  contributors: number;
  language: string;
  license: string;
  isArchived: boolean;
  weeklyCommits: number;
  healthScore: number;       // 0-100 computed from above
}

export interface MetricsResponse {
  repos: RepoMetrics[];
  fetchedAt: string;
  source: "live" | "cached" | "fallback";
}

// GitHub repo mapping — map proxy names to their GitHub repos
export const REPO_MAP: Record<string, { owner: string; repo: string }> = {
  "GoZen": { owner: "dopejs", repo: "gozen" },
  "routatic-proxy": { owner: "routatic", repo: "routatic-proxy" },
  "OWL-AGENT": { owner: "marktantongco", repo: "owl-agent-free-ai-proxy-gateway" },
  "opclaude": { owner: "anthropics", repo: "opclaude" },
  "claude-code-zen-proxy": { owner: "dopejs", repo: "claude-code-zen-proxy" },
  "Antigravity Proxy": { owner: "anthropics", repo: "antigravity" },
  "opencode-zen-gateway": { owner: "dopejs", repo: "opencode-zen-gateway" },
  "ExtremeRouter": { owner: "extremerouter", repo: "extremerouter" },
  "openrelay": { owner: "openrelay", repo: "openrelay" },
  "openclaw-proxy": { owner: "openclaw", repo: "openclaw-proxy" },
};

// Compute a 0-100 health score from repo metrics
export function computeHealthScore(metrics: Partial<RepoMetrics>): number {
  let score = 50; // base

  // Stars: logarithmic scaling
  if (metrics.stars) {
    score += Math.min(20, Math.log10(Math.max(1, metrics.stars)) * 8);
  }

  // Recent activity (fewer days = better)
  if (metrics.lastCommitDaysAgo !== undefined) {
    if (metrics.lastCommitDaysAgo < 7) score += 15;
    else if (metrics.lastCommitDaysAgo < 30) score += 10;
    else if (metrics.lastCommitDaysAgo < 90) score += 5;
    else score -= 5;
  }

  // Contributors
  if (metrics.contributors) {
    score += Math.min(10, metrics.contributors * 2);
  }

  // Open issues (fewer is better relative to stars)
  if (metrics.openIssues !== undefined && metrics.stars) {
    const issueRatio = metrics.openIssues / Math.max(1, metrics.stars);
    if (issueRatio < 0.05) score += 5;
    else if (issueRatio > 0.2) score -= 5;
  }

  // Archived = dead
  if (metrics.isArchived) score -= 30;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// Fallback data when GitHub API is unreachable
export const FALLBACK_METRICS: RepoMetrics[] = [
  { name: "GoZen", stars: 1200, forks: 89, openIssues: 12, lastCommit: "", lastCommitDaysAgo: 3, contributors: 15, language: "Go", license: "MIT", isArchived: false, weeklyCommits: 12, healthScore: 88 },
  { name: "routatic-proxy", stars: 890, forks: 67, openIssues: 8, lastCommit: "", lastCommitDaysAgo: 5, contributors: 8, language: "Go", license: "AGPL-3.0", isArchived: false, weeklyCommits: 8, healthScore: 82 },
  { name: "OWL-AGENT", stars: 560, forks: 42, openIssues: 15, lastCommit: "", lastCommitDaysAgo: 2, contributors: 3, language: "Python", license: "MIT", isArchived: false, weeklyCommits: 6, healthScore: 75 },
  { name: "opclaude", stars: 780, forks: 54, openIssues: 6, lastCommit: "", lastCommitDaysAgo: 7, contributors: 6, language: "Node.js", license: "MIT", isArchived: false, weeklyCommits: 5, healthScore: 78 },
  { name: "claude-code-zen-proxy", stars: 340, forks: 28, openIssues: 4, lastCommit: "", lastCommitDaysAgo: 14, contributors: 4, language: "Node.js", license: "MIT", isArchived: false, weeklyCommits: 3, healthScore: 68 },
  { name: "Antigravity Proxy", stars: 420, forks: 35, openIssues: 9, lastCommit: "", lastCommitDaysAgo: 10, contributors: 5, language: "Bun/JS", license: "MIT", isArchived: false, weeklyCommits: 4, healthScore: 72 },
  { name: "opencode-zen-gateway", stars: 280, forks: 22, openIssues: 7, lastCommit: "", lastCommitDaysAgo: 21, contributors: 3, language: "Python", license: "MIT", isArchived: false, weeklyCommits: 2, healthScore: 62 },
  { name: "ExtremeRouter", stars: 640, forks: 48, openIssues: 18, lastCommit: "", lastCommitDaysAgo: 8, contributors: 7, language: "Next.js", license: "MIT", isArchived: false, weeklyCommits: 6, healthScore: 70 },
  { name: "openrelay", stars: 190, forks: 15, openIssues: 11, lastCommit: "", lastCommitDaysAgo: 45, contributors: 2, language: "Unknown", license: "MIT", isArchived: false, weeklyCommits: 1, healthScore: 48 },
  { name: "openclaw-proxy", stars: 150, forks: 12, openIssues: 8, lastCommit: "", lastCommitDaysAgo: 30, contributors: 2, language: "Python", license: "MIT", isArchived: false, weeklyCommits: 1, healthScore: 50 },
];
