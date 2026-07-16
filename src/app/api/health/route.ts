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
};

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
        return NextResponse.json({
          status: "healthy",
          source: "http",
          proxy: endpoint.name,
          port: endpoint.port,
          data,
          timestamp: new Date().toISOString(),
        });
      }
      return NextResponse.json({
        status: "degraded",
        source: "http",
        proxy: endpoint.name,
        port: endpoint.port,
        httpStatus: res.status,
        timestamp: new Date().toISOString(),
      });
    } catch {
      return NextResponse.json({
        status: "down",
        source: "http",
        proxy: endpoint.name,
        port: endpoint.port,
        error: "Connection refused or timeout",
        timestamp: new Date().toISOString(),
      });
    }
  }

  // "all" — check both endpoints in parallel
  const results: Record<string, unknown> = {};
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
        results[key] = {
          status: "healthy",
          source: "http",
          proxy: endpoint.name,
          port: endpoint.port,
          data,
          timestamp: new Date().toISOString(),
        };
      } else {
        results[key] = {
          status: "degraded",
          source: "http",
          proxy: endpoint.name,
          port: endpoint.port,
          httpStatus: res.status,
          timestamp: new Date().toISOString(),
        };
      }
    } catch {
      results[key] = {
        status: "down",
        source: "http",
        proxy: endpoint.name,
        port: endpoint.port,
        error: "Connection refused or timeout",
        timestamp: new Date().toISOString(),
      };
    }
  });

  await Promise.all(checks);
  return NextResponse.json(results);
}
