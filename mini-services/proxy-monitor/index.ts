import { Server } from "socket.io";
import { createServer } from "http";

const PORT = 3030;

// Simulated proxy monitoring state
interface ProxyState {
  name: string;
  status: "healthy" | "degraded" | "down";
  ram: number;
  requestsPerMin: number;
  latencyMs: number;
  uptime: string;
  port: number;
  activeConnections: number;
  circuitBreaker: "closed" | "open" | "half-open";
  lastError: string | null;
}

const gozenState: ProxyState = {
  name: "GoZen",
  status: "healthy",
  ram: 42,
  requestsPerMin: 12,
  latencyMs: 145,
  uptime: "3d 14h 22m",
  port: 19841,
  activeConnections: 3,
  circuitBreaker: "closed",
  lastError: null,
};

const owlState: ProxyState = {
  name: "OWL-AGENT",
  status: "healthy",
  ram: 98,
  requestsPerMin: 8,
  latencyMs: 210,
  uptime: "3d 14h 20m",
  port: 60000,
  activeConnections: 2,
  circuitBreaker: "closed",
  lastError: null,
};

// Simulate realistic metric fluctuations
function fluctuate(base: number, range: number): number {
  return Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;
}

function updateState(state: ProxyState, isOwl: boolean): ProxyState {
  state.ram = fluctuate(isOwl ? 98 : 42, isOwl ? 15 : 8);
  state.requestsPerMin = Math.max(0, Math.round(fluctuate(isOwl ? 8 : 12, 6)));
  state.latencyMs = Math.max(50, Math.round(fluctuate(isOwl ? 210 : 145, 80)));

  // Occasionally simulate issues
  const rand = Math.random();
  if (rand > 0.97) {
    state.status = "degraded";
    state.latencyMs = Math.round(fluctuate(800, 300));
    state.lastError = "Upstream timeout (502)";
    state.circuitBreaker = "half-open";
  } else if (rand > 0.93) {
    state.status = "healthy";
    state.lastError = null;
    state.circuitBreaker = "closed";
  } else {
    state.status = "healthy";
    state.lastError = null;
    state.circuitBreaker = "closed";
  }

  state.activeConnections = Math.max(0, Math.round(fluctuate(isOwl ? 2 : 3, 2)));
  return state;
}

// Request log entries
interface RequestLogEntry {
  timestamp: string;
  proxy: string;
  method: string;
  path: string;
  status: number;
  latency: number;
  model: string;
}

const requestModels = ["claude-sonnet-4-20250514", "claude-opus-4-20250514", "gpt-4o", "gpt-4o-mini"];
const requestPaths = ["/v1/messages", "/v1/chat/completions", "/v1/responses"];

function generateLogEntry(): RequestLogEntry {
  const isGozen = Math.random() > 0.4;
  return {
    timestamp: new Date().toISOString(),
    proxy: isGozen ? "GoZen" : "OWL-AGENT",
    method: "POST",
    path: requestPaths[Math.floor(Math.random() * requestPaths.length)],
    status: Math.random() > 0.95 ? 502 : 200,
    latency: Math.round(100 + Math.random() * 400),
    model: requestModels[Math.floor(Math.random() * requestModels.length)],
  };
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`[monitor] Client connected: ${socket.id}`);

  // Send initial state
  socket.emit("proxy:state", { gozen: gozenState, owl: owlState });

  // Send recent log entries
  const recentLogs: RequestLogEntry[] = [];
  for (let i = 0; i < 20; i++) {
    recentLogs.push(generateLogEntry());
  }
  socket.emit("proxy:logs", recentLogs);

  socket.on("disconnect", () => {
    console.log(`[monitor] Client disconnected: ${socket.id}`);
  });
});

// Broadcast updates every 2 seconds
setInterval(() => {
  updateState(gozenState, false);
  updateState(owlState, true);
  io.emit("proxy:state", { gozen: gozenState, owl: owlState });
}, 2000);

// Broadcast new log entries every 3-6 seconds
setInterval(() => {
  const entry = generateLogEntry();
  io.emit("proxy:log", entry);
}, 3000 + Math.random() * 3000);

httpServer.listen(PORT, () => {
  console.log(`[monitor] Proxy monitor WebSocket running on port ${PORT}`);
});
