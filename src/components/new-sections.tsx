"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  Search, Download, Moon, Sun, Activity, Wifi, WifiOff,
  Package, ArrowUpRight, Copy, Check, RefreshCw, Clock,
  AlertTriangle, CheckCircle2, XCircle, Cpu, Radio,
  Layers, Server, Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { unifiedStackConfig } from "@/lib/proxy-data";

/* ──────────────── SHARED ANIMATIONS ────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 1: Dark Mode Toggle (ui-ux-pro-max design dials)
   ════════════════════════════════════════════════════════════════════════════ */

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  // Toggle handler — theme may be undefined during SSR, so default to "light"
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full border border-[#d6d1c2] dark:border-[#3a3a3e] hover:bg-[#f6f6f6] dark:hover:bg-[#2a2a2e]"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun className="h-4 w-4 text-[#ae964d]" />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon className="h-4 w-4 text-[#6b634d]" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 2: 21st.dev Component Search Panel
   ════════════════════════════════════════════════════════════════════════════ */

interface SearchResult {
  name: string;
  preview_url: string | null;
  demo_id: number;
  component_data: {
    id: number;
    name: string;
    component_slug: string;
    library_id: string;
    description: string;
    install_command: string;
  };
  component_user_data: {
    name: string;
    username: string;
    image_url: string | null;
  };
  usage_count: number;
}

function ComponentCard({ result }: { result: SearchResult }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result.component_data.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result.component_data.install_command]);

  return (
    <Card className="bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e] hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-[#151513] dark:text-[#e8e6e1]">{result.component_data.name}</span>
              <Badge variant="outline" className="text-xs border-[#92751f]/30 text-[#92751f] dark:text-[#ae964d] dark:border-[#ae964d]/30">
                {result.component_user_data.username}
              </Badge>
            </div>
            <p className="text-xs text-[#86837c] dark:text-[#a0a0a0] mt-1 line-clamp-2">{result.component_data.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-[#86837c] dark:text-[#a0a0a0]">
              {(result.usage_count / 1000).toFixed(1)}K uses
            </div>
          </div>
        </div>
        <div className="mt-3 relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-2 font-mono text-xs overflow-x-auto group">
          <code className="whitespace-nowrap">{result.component_data.install_command}</code>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0.5 right-0.5 h-6 w-6 p-0 text-[#86837c] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3 text-[#3f7450]" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ComponentSearchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsLeft, setRequestsLeft] = useState<number | null>(null);

  const search = useCallback(async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/components?XTransformPort=3030", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery, page, per_page: 12 }),
      });
      // Fallback: try direct 21st.dev API route (no port transform needed for Next.js API)
      const data = await res.json();
      setResults(data.results || []);
      if (data.metadata) {
        setTotalPages(data.metadata.pagination?.total_pages || 0);
        setRequestsLeft(data.metadata.requests_remaining);
      }
    } catch {
      // Try without port transform
      try {
        const res2 = await fetch("/api/components", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: searchQuery, page, per_page: 12 }),
        });
        const data = await res2.json();
        setResults(data.results || []);
        if (data.metadata) {
          setTotalPages(data.metadata.pagination?.total_pages || 0);
          setRequestsLeft(data.metadata.requests_remaining);
        }
      } catch {
        setResults([]);
      }
    }
    setLoading(false);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    search(query, 1);
  }, [query, search]);

  return (
    <section ref={ref} id="components" className="py-12 sm:py-20 bg-white dark:bg-[#1a1a1e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] dark:text-[#ae964d]">Component Explorer</h2>
            <Badge variant="outline" className="text-xs border-[#537ba4]/30 text-[#537ba4]">
              <Package className="h-3 w-3 mr-1" /> Powered by 21st.dev
            </Badge>
          </div>
          <p className="text-[#86837c] dark:text-[#a0a0a0] mb-6 text-sm sm:text-base">
            Search 1400+ React UI components from the 21st.dev registry. Find, preview, and install with one command.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86837c] dark:text-[#a0a0a0]" />
              <Input
                placeholder="Search components (button, card, dialog...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 bg-[#f6f6f6] dark:bg-[#2a2a2e] border-[#d6d1c2] dark:border-[#3a3a3e] text-[#151513] dark:text-[#e8e6e1]"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="bg-[#6b634d] hover:bg-[#5a5540] text-white">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {requestsLeft !== null && (
            <div className="flex items-center gap-2 mb-4 text-xs text-[#86837c] dark:text-[#a0a0a0]">
              <span>API calls remaining: {requestsLeft.toLocaleString()}</span>
              <span className="text-[#d6d1c2]">|</span>
              <span>Free plan: 1M requests/month</span>
            </div>
          )}
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((result, i) => (
            <motion.div key={`${result.component_data.component_slug}-${result.demo_id || i}`} variants={staggerItem}>
              <ComponentCard result={result} />
            </motion.div>
          ))}
        </motion.div>

        {results.length === 0 && query && !loading && (
          <div className="text-center py-8 text-[#86837c] dark:text-[#a0a0a0]">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Type a search term and press Enter to find components</p>
            <p className="text-xs mt-1">Try: &quot;button&quot;, &quot;card&quot;, &quot;dialog&quot;, &quot;animation&quot;</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => { const p = currentPage - 1; setCurrentPage(p); search(query, p); }}
              className="border-[#d6d1c2] dark:border-[#3a3a3e]"
            >
              Previous
            </Button>
            <span className="text-sm text-[#86837c] dark:text-[#a0a0a0]">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => { const p = currentPage + 1; setCurrentPage(p); search(query, p); }}
              className="border-[#d6d1c2] dark:border-[#3a3a3e]"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 3: JSON Config Export
   ════════════════════════════════════════════════════════════════════════════ */

export function ConfigExportSection() {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(unifiedStackConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([unifiedStackConfig], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zen-owl-unified-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
      <Card className="border-[#3f7450]/30 dark:border-[#3f7450]/20 dark:bg-[#2a2a2e]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base sm:text-lg text-[#3f7450] dark:text-[#5aad6a] flex items-center gap-2">
              <Layers className="h-5 w-5" /> Unified Stack Configuration
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="border-[#3f7450]/30 text-[#3f7450] dark:text-[#5aad6a] dark:border-[#3f7450]/20">
                {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button size="sm" onClick={handleDownload} className="bg-[#3f7450] hover:bg-[#2d5a3b] text-white">
                <Download className="h-3.5 w-3.5 mr-1" /> Download JSON
              </Button>
            </div>
          </div>
          <CardDescription className="text-[#86837c] dark:text-[#a0a0a0]">GoZen → OWL-AGENT → Upstream wiring in ~/.zen/zen.json</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs sm:text-sm overflow-x-auto max-h-64">
            <pre className="whitespace-pre">{unifiedStackConfig}</pre>
          </div>
          <div className="mt-3 text-xs text-[#86837c] dark:text-[#a0a0a0]">
            <strong>Startup sequence:</strong> Always start OWL-AGENT first, then GoZen. Use the JSON download to skip manual editing.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 4: WebSocket Real-Time Monitoring Dashboard
   ════════════════════════════════════════════════════════════════════════════ */

interface ProxyMonitorState {
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

interface LogEntry {
  timestamp: string;
  proxy: string;
  method: string;
  path: string;
  status: number;
  latency: number;
  model: string;
}

function StatusDot({ status }: { status: string }) {
  const color = status === "healthy" ? "bg-[#3f7450]" : status === "degraded" ? "bg-[#ae8d4a]" : "bg-[#8b4e49]";
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${color} ${status === "degraded" ? "animate-pulse" : ""}`} />
  );
}

function MetricCard({ label, value, unit, icon: Icon, color }: { label: string; value: string | number; unit?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-[#f6f6f6] dark:bg-[#1e1e22] rounded-lg p-3 text-center">
      <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
      <div className={`text-lg font-bold ${color}`}>{value}{unit && <span className="text-xs font-normal">{unit}</span>}</div>
      <div className="text-xs text-[#86837c] dark:text-[#a0a0a0]">{label}</div>
    </div>
  );
}

function ProxyDashboard({ proxy }: { proxy: ProxyMonitorState }) {
  const ramPct = proxy.name === "OWL-AGENT" ? (proxy.ram / 120) * 100 : (proxy.ram / 50) * 100;

  return (
    <Card className="bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusDot status={proxy.status} />
            <CardTitle className="text-base text-[#151513] dark:text-[#e8e6e1]">{proxy.name}</CardTitle>
            <Badge variant="outline" className="text-xs">:{proxy.port}</Badge>
          </div>
          <Badge className={`text-xs ${
            proxy.status === "healthy" ? "bg-[#3f7450]/10 text-[#3f7450] dark:bg-[#3f7450]/20 dark:text-[#5aad6a]" :
            proxy.status === "degraded" ? "bg-[#ae8d4a]/10 text-[#ae8d4a]" :
            "bg-[#8b4e49]/10 text-[#8b4e49]"
          }`}>
            {proxy.status.toUpperCase()}
          </Badge>
        </div>
        {proxy.lastError && (
          <div className="flex items-center gap-1 text-xs text-[#8b4e49] mt-1">
            <AlertTriangle className="h-3 w-3" /> {proxy.lastError}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MetricCard label="RAM" value={proxy.ram.toFixed(1)} unit=" MB" icon={Cpu} color="text-[#92751f] dark:text-[#ae964d]" />
          <MetricCard label="Latency" value={proxy.latencyMs} unit=" ms" icon={Clock} color="text-[#537ba4] dark:text-[#7aa3cc]" />
          <MetricCard label="Req/min" value={proxy.requestsPerMin} icon={Activity} color="text-[#3f7450] dark:text-[#5aad6a]" />
          <MetricCard label="Connections" value={proxy.activeConnections} icon={Server} color="text-[#6b634d] dark:text-[#ae964d]" />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#86837c] dark:text-[#a0a0a0]">RAM Usage</span>
            <span className="font-medium text-[#151513] dark:text-[#e8e6e1]">{proxy.ram.toFixed(1)} / {proxy.name === "OWL-AGENT" ? 120 : 50} MB</span>
          </div>
          <Progress value={ramPct} className="h-2" />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[#86837c] dark:text-[#a0a0a0]">
            <Radio className="h-3 w-3" /> Uptime: {proxy.uptime}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#86837c] dark:text-[#a0a0a0]">Circuit:</span>
            <Badge variant="outline" className={`text-xs ${
              proxy.circuitBreaker === "closed" ? "border-[#3f7450]/30 text-[#3f7450]" :
              proxy.circuitBreaker === "half-open" ? "border-[#ae8d4a]/30 text-[#ae8d4a]" :
              "border-[#8b4e49]/30 text-[#8b4e49]"
            }`}>
              {proxy.circuitBreaker}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonitoringSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [connected, setConnected] = useState(false);
  const [gozenState, setGozenState] = useState<ProxyMonitorState | null>(null);
  const [owlState, setOwlState] = useState<ProxyMonitorState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket monitoring service
    const socket = io("/?XTransformPort=3030", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setConnected(true);
      console.log("[monitor] Connected to proxy monitor service");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("proxy:state", (data: { gozen: ProxyMonitorState; owl: ProxyMonitorState }) => {
      setGozenState(data.gozen);
      setOwlState(data.owl);
    });

    socket.on("proxy:logs", (entries: LogEntry[]) => {
      setLogs(entries);
    });

    socket.on("proxy:log", (entry: LogEntry) => {
      setLogs((prev) => [entry, ...prev].slice(0, 50));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fallback: if WebSocket not connected, show simulated data
  useEffect(() => {
    if (!connected && !gozenState) {
      const interval = setInterval(() => {
        setGozenState({
          name: "GoZen", status: "healthy", ram: 38 + Math.random() * 10,
          requestsPerMin: Math.round(8 + Math.random() * 8),
          latencyMs: Math.round(120 + Math.random() * 60),
          uptime: "3d 14h 22m", port: 19841, activeConnections: Math.round(1 + Math.random() * 4),
          circuitBreaker: "closed", lastError: null,
        });
        setOwlState({
          name: "OWL-AGENT", status: "healthy", ram: 90 + Math.random() * 20,
          requestsPerMin: Math.round(5 + Math.random() * 6),
          latencyMs: Math.round(180 + Math.random() * 80),
          uptime: "3d 14h 20m", port: 60000, activeConnections: Math.round(1 + Math.random() * 3),
          circuitBreaker: "closed", lastError: null,
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [connected, gozenState]);

  return (
    <section ref={ref} id="monitor" className="py-12 sm:py-20 bg-[#f6f6f6] dark:bg-[#141418]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] dark:text-[#ae964d]">Live Monitoring</h2>
            <div className="flex items-center gap-2">
              {connected ? (
                <Badge className="bg-[#3f7450]/10 text-[#3f7450] dark:bg-[#3f7450]/20 dark:text-[#5aad6a]">
                  <Wifi className="h-3 w-3 mr-1" /> Connected
                </Badge>
              ) : (
                <Badge className="bg-[#ae8d4a]/10 text-[#ae8d4a]">
                  <WifiOff className="h-3 w-3 mr-1" /> Simulated
                </Badge>
              )}
            </div>
          </div>
          <p className="text-[#86837c] dark:text-[#a0a0a0] mb-6 text-sm sm:text-base">
            Real-time proxy health metrics via WebSocket. {connected ? "Live data from monitoring service." : "Showing simulated metrics (connect to monitoring service for live data)."}
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {gozenState && (
            <motion.div variants={staggerItem}>
              <ProxyDashboard proxy={gozenState} />
            </motion.div>
          )}
          {owlState && (
            <motion.div variants={staggerItem}>
              <ProxyDashboard proxy={owlState} />
            </motion.div>
          )}
        </motion.div>

        {/* Combined RAM */}
        {gozenState && owlState && (
          <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
            <Card className="bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e] mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#6b634d] dark:text-[#ae964d]">Combined Stack RAM</span>
                  <span className="text-sm font-bold text-[#92751f] dark:text-[#ae964d]">
                    {(gozenState.ram + owlState.ram).toFixed(1)} MB / 8192 MB ({((gozenState.ram + owlState.ram) / 81.92).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={((gozenState.ram + owlState.ram) / 8192) * 100} className="h-3" />
                <div className="flex justify-between mt-1 text-xs text-[#86837c] dark:text-[#a0a0a0]">
                  <span>GoZen: {gozenState.ram.toFixed(1)} MB</span>
                  <span>OWL: {owlState.ram.toFixed(1)} MB</span>
                  <span>Available: {(8192 - gozenState.ram - owlState.ram).toFixed(0)} MB</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Request Log */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <Card className="bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#6b634d] dark:text-[#ae964d] flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Request Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 && (
                  <div className="text-[#86837c] dark:text-[#a0a0a0] py-4 text-center">
                    Waiting for log entries...
                  </div>
                )}
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log.timestamp}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 py-1 px-2 rounded ${
                      log.status >= 400 ? "bg-[#8b4e49]/5 dark:bg-[#8b4e49]/10" : "hover:bg-[#f6f6f6] dark:hover:bg-[#1e1e22]"
                    }`}
                  >
                    <span className="text-[#86837c] dark:text-[#a0a0a0] w-[70px] flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline" className="text-xs w-16 flex-shrink-0 justify-center">
                      {log.proxy}
                    </Badge>
                    <span className={`w-8 text-center font-bold ${log.status >= 400 ? "text-[#8b4e49]" : "text-[#3f7450]"}`}>
                      {log.status}
                    </span>
                    <span className="text-[#86837c] dark:text-[#a0a0a0] flex-1 truncate">{log.path}</span>
                    <span className="text-[#537ba4] dark:text-[#7aa3cc] w-16 text-right">{log.latency}ms</span>
                    <span className="text-[#ae964d] dark:text-[#c9b56d] w-20 text-right truncate">{log.model}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
