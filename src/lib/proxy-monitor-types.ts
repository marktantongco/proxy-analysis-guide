// ── Shared Proxy Monitor Types ─────────────────────────────────────────
// Single source of truth for proxy monitoring data structures.

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
  source?: "websocket" | "http" | "simulated";
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
