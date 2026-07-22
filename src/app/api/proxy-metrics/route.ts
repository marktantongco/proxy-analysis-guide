import { NextResponse } from "next/server";
import { REPO_MAP, computeHealthScore, FALLBACK_METRICS, type RepoMetrics, type MetricsResponse } from "@/lib/live-metrics";

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
let cachedMetrics: MetricsResponse | null = null;
let lastFetch = 0;

export async function GET() {
  const now = Date.now();

  // Return cached if fresh
  if (cachedMetrics && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json({ ...cachedMetrics, source: "cached" });
  }

  try {
    const results: RepoMetrics[] = [];

    // Fetch all repos in parallel
    const fetches = Object.entries(REPO_MAP).map(async ([name, { owner, repo }]) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "proxy-analysis-guide",
          },
          signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const lastCommitDate = data.pushed_at ? new Date(data.pushed_at) : new Date();
        const daysAgo = Math.floor((Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          name,
          stars: data.stargazers_count ?? 0,
          forks: data.forks_count ?? 0,
          openIssues: data.open_issues_count ?? 0,
          lastCommit: data.pushed_at ?? "",
          lastCommitDaysAgo: daysAgo,
          contributors: data.network_count ?? 1,
          language: data.language ?? "Unknown",
          license: data.license?.spdx_id ?? "Unknown",
          isArchived: data.archived ?? false,
          weeklyCommits: 0,
          healthScore: 0,
        } as RepoMetrics;
      } catch {
        return null;
      }
    });

    const responses = await Promise.all(fetches);

    for (let i = 0; i < Object.keys(REPO_MAP).length; i++) {
      const proxyName = Object.keys(REPO_MAP)[i];
      const live = responses[i];
      if (live) {
        live.healthScore = computeHealthScore(live);
        results.push(live);
      } else {
        // Use fallback for this repo
        const fallback = FALLBACK_METRICS.find((m) => m.name === proxyName);
        if (fallback) results.push(fallback);
      }
    }

    cachedMetrics = { repos: results, fetchedAt: new Date().toISOString(), source: "live" };
    lastFetch = now;

    return NextResponse.json(cachedMetrics);
  } catch {
    // Return fallback on complete failure
    return NextResponse.json({
      repos: FALLBACK_METRICS,
      fetchedAt: new Date().toISOString(),
      source: "fallback",
    } as MetricsResponse);
  }
}
