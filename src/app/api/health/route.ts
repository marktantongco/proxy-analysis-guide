import { NextRequest, NextResponse } from "next/server";

// Health check endpoints for GoZen and OWL-AGENT
const HEALTH_ENDPOINTS = {
  gozen: {
    url: "http://localhost:19841/health",
    port: 19841,
    name: "GoZen",
    maxRam: 50,
  },
  owl: {
    url: "http://127.0.0.1:60000/health",
    port: 60000,
    name: "OWL-AGENT",
    maxRam: 120,
  },
} as const;

// ── Type-safe health check result ──────────────────────────────────────
type HealthStatus = "healthy" | "degraded" | "down";

interface HealthCheckResult {
  status: HealthStatus;
  source: "http";
  proxy: string;
  port: number;
  timestamp: string;
  data?: unknown;
  httpStatus?: number;
  error?: string;
}

function buildResult(
  status: HealthStatus,
  endpoint: { name: string; port: number },
  extra?: Partial<Pick<HealthCheckResult, "data" | "httpStatus" | "error">>,
): HealthCheckResult {
  return {
    status,
    source: "http",
    proxy: endpoint.name,
    port: endpoint.port,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target"); // "gozen" | "owl" | "all"
  const timeout = parseInt(searchParams.get("timeout") || "3000");

  if (target === "gozen" || target === "owl") {
    const endpoint = HEALTH_ENDPOINTS[target];
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(endpoint.url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(
          buildResult("healthy", endpoint, { data }),
        );
      }
      return NextResponse.json(
        buildResult("degraded", endpoint, { httpStatus: res.status }),
      );
    } catch {
      return NextResponse.json(
        buildResult("down", endpoint, { error: "Connection refused or timeout" }),
      );
    }
  }

  // "all" — check both endpoints in parallel
  const results: Record<string, HealthCheckResult> = {};
  const checks = Object.entries(HEALTH_ENDPOINTS).map(async ([key, endpoint]) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(endpoint.url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        results[key] = buildResult("healthy", endpoint, { data });
      } else {
        results[key] = buildResult("degraded", endpoint, { httpStatus: res.status });
      }
    } catch {
      results[key] = buildResult("down", endpoint, { error: "Connection refused or timeout" });
    }
  });

  await Promise.all(checks);
  return NextResponse.json(results);
}
