// ── Shared Proxy Monitor Types (mirrored from src/lib/proxy-monitor-types.ts) ──
// These types are shared between the Next.js frontend and the proxy-monitor mini-service.
// Update src/lib/proxy-monitor-types.ts and this file together.

export type CircuitBreakerState = "closed" | "open" | "half-open";
export type ProxyStatus = "healthy" | "degraded" | "down";

export interface ProxyMonitorState {
  name: string;
  status: ProxyStatus;
  ram: number;
  requestsPerMin: number;
  latencyMs: number;
  uptime: string;
  port: number;
  activeConnections: number;
  circuitBreaker: CircuitBreakerState;
  lastError: string | null;
}

export interface RequestLogEntry {
  timestamp: string;
  proxy: string;
  method: string;
  path: string;
  status: number;
  latency: number;
  model: string;
}
