"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { io, Socket } from "socket.io-client";
import {
  Search, Download, Moon, Sun, Activity, Wifi, WifiOff,
  Package, ArrowUpRight, Copy, Check, RefreshCw, Clock,
  AlertTriangle, CheckCircle2, XCircle, Cpu, Radio,
  Layers, Server, Terminal, Play, RotateCcw, Pause,
  Settings, Palette, Zap, ChevronDown, ChevronUp, ChevronRight,
  Monitor, ArrowRight, ExternalLink, Sparkles, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import {
  unifiedStackConfig, gozenInstallSteps, owlInstallSteps, startupSequence,
  type InstallStep
} from "@/lib/proxy-data";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 1: Dark Mode Toggle + ui-ux-pro-max Design Dials
   ════════════════════════════════════════════════════════════════════════════ */

const THEME_PRESETS = [
  { name: "Warm", accent: "#92751f", bg: "#f6f6f6", header: "#6b634d" },
  { name: "Cool", accent: "#537ba4", bg: "#f0f4f8", header: "#3a5a7c" },
  { name: "Midnight", accent: "#7c5cbf", bg: "#1a1a2e", header: "#b8a9d4" },
  { name: "Forest", accent: "#3f7450", bg: "#f0f5f1", header: "#2d5a3b" },
  { name: "Ember", accent: "#c45c3e", bg: "#faf5f3", header: "#8b4e49" },
];

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [showPanel, setShowPanel] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className="relative">
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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="ml-1 w-9 h-9 rounded-full border border-[#d6d1c2] dark:border-[#3a3a3e] hover:bg-[#f6f6f6] dark:hover:bg-[#2a2a2e]"
      >
        <Palette className="h-4 w-4 text-[#6b634d] dark:text-[#ae964d]" />
      </Button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e] rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-[#6b634d] dark:text-[#ae964d]" />
              <span className="text-sm font-semibold text-[#151513] dark:text-[#e8e6e1]">Design Dials</span>
            </div>
            <div className="text-xs text-[#86837c] dark:text-[#a0a0a0] mb-2">ui-ux-pro-max palette presets</div>
            <div className="space-y-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f6f6f6] dark:hover:bg-[#1e1e22] transition-colors text-left"
                  onClick={() => {
                    document.documentElement.style.setProperty("--accent-preset", preset.accent);
                    document.documentElement.style.setProperty("--header-preset", preset.header);
                  }}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.accent }} />
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.header }} />
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.bg }} />
                  </div>
                  <span className="text-xs font-medium text-[#151513] dark:text-[#e8e6e1]">{preset.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#d6d1c2] dark:border-[#3a3a3e]">
              <div className="text-xs text-[#86837c] dark:text-[#a0a0a0] mb-2">Quick Actions</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs border-[#d6d1c2] dark:border-[#3a3a3e]" onClick={() => setTheme("light")}>
                  <Sun className="h-3 w-3 mr-1" /> Light
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs border-[#d6d1c2] dark:border-[#3a3a3e]" onClick={() => setTheme("dark")}>
                  <Moon className="h-3 w-3 mr-1" /> Dark
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 2: 21st.dev Component Search Panel (Enhanced)
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

const SEARCH_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "animation", label: "Animation" },
  { id: "form", label: "Forms" },
  { id: "layout", label: "Layout" },
  { id: "feedback", label: "Feedback" },
  { id: "data", label: "Data Display" },
];

function ComponentCard({ result, onInstall }: { result: SearchResult; onInstall: (cmd: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result.component_data.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result.component_data.install_command]);

  return (
    <Card className="bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e] hover:shadow-md transition-shadow group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-[#151513] dark:text-[#e8e6e1]">{result.component_data.name}</span>
              <Badge variant="outline" className="text-xs border-[#92751f]/30 text-[#92751f] dark:text-[#ae964d] dark:border-[#ae964d]/30">
                {result.component_user_data.username}
              </Badge>
              {result.preview_url && (
                <a href={result.preview_url} target="_blank" rel="noopener noreferrer" className="text-[#537ba4] hover:text-[#3a5a7c]">
                  <Eye className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <p className="text-xs text-[#86837c] dark:text-[#a0a0a0] mt-1 line-clamp-2">{result.component_data.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-[#86837c] dark:text-[#a0a0a0]">
              {(result.usage_count / 1000).toFixed(1)}K uses
            </div>
          </div>
        </div>
        <div className="mt-3 relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-2 font-mono text-xs overflow-x-auto group/code">
          <code className="whitespace-nowrap">{result.component_data.install_command}</code>
          <div className="absolute top-0.5 right-0.5 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-[#86837c] hover:text-white opacity-0 group-hover/code:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3 text-[#3f7450]" /> : <Copy className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 p-0 text-[#3f7450] hover:text-[#5aad6a] opacity-0 group-hover/code:opacity-100 transition-opacity text-xs font-medium"
              onClick={() => onInstall(result.component_data.install_command)}
            >
              + Add
            </Button>
          </div>
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [installedCmds, setInstalledCmds] = useState<string[]>([]);

  const search = useCallback(async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery, page, per_page: 12 }),
      });
      const data = await res.json();
      setResults(data.results || []);
      if (data.metadata) {
        setTotalPages(data.metadata.pagination?.total_pages || 0);
        setRequestsLeft(data.metadata.requests_remaining);
      }
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    search(query, 1);
  }, [query, search]);

  const handleInstall = useCallback((cmd: string) => {
    setInstalledCmds((prev) => prev.includes(cmd) ? prev : [...prev, cmd]);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    search(query, page);
  }, [query, search]);

  return (
    <section ref={ref} id="components" className="py-12 sm:py-20 bg-white dark:bg-[#1a1a1e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] dark:text-[#ae964d]">Component Explorer</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-[#537ba4]/30 text-[#537ba4]">
                <Package className="h-3 w-3 mr-1" /> 21st.dev
              </Badge>
              <Badge variant="outline" className="text-xs border-[#3f7450]/30 text-[#3f7450]">
                <Sparkles className="h-3 w-3 mr-1" /> 999K+ searches
              </Badge>
            </div>
          </div>
          <p className="text-[#86837c] dark:text-[#a0a0a0] mb-6 text-sm sm:text-base">
            Search 1400+ React UI components from the 21st.dev registry. Find, preview, and install with one command.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#6b634d] text-white dark:bg-[#ae964d] dark:text-[#1a1a1e]"
                    : "bg-[#f6f6f6] dark:bg-[#2a2a2e] text-[#86837c] dark:text-[#a0a0a0] hover:bg-[#e8e6e1] dark:hover:bg-[#3a3a3e]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86837c] dark:text-[#a0a0a0]" />
              <Input
                placeholder="Search components (button, card, dialog, animation...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search(query, 1)}
                className="pl-10 bg-[#f6f6f6] dark:bg-[#2a2a2e] border-[#d6d1c2] dark:border-[#3a3a3e] text-[#151513] dark:text-[#e8e6e1]"
              />
            </div>
            <Button onClick={() => search(query, 1)} disabled={loading} className="bg-[#6b634d] hover:bg-[#5a5540] text-white">
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

          {/* Installed Components Tracker */}
          {installedCmds.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
              <Card className="bg-[#3f7450]/5 border-[#3f7450]/20 dark:bg-[#3f7450]/10">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3f7450]" />
                    <span className="text-xs font-medium text-[#3f7450]">{installedCmds.length} component{installedCmds.length > 1 ? "s" : ""} ready to install</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {installedCmds.map((cmd, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-[#3f7450] flex-shrink-0" />
                        <code className="text-[#151513] dark:text-[#e8e6e1]">{cmd}</code>
                        <button
                          onClick={() => setInstalledCmds((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-[#8b4e49] hover:text-[#a0605a] ml-auto flex-shrink-0"
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((result, i) => (
            <motion.div key={`${result.component_data.component_slug}-${result.demo_id || i}`} variants={staggerItem}>
              <ComponentCard result={result} onInstall={handleInstall} />
            </motion.div>
          ))}
        </motion.div>

        {results.length === 0 && query && !loading && (
          <div className="text-center py-8 text-[#86837c] dark:text-[#a0a0a0]">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No components found for &quot;{query}&quot;</p>
            <p className="text-xs mt-1">Try: &quot;button&quot;, &quot;card&quot;, &quot;dialog&quot;, &quot;animation&quot;</p>
          </div>
        )}

        {results.length === 0 && !query && (
          <div className="text-center py-8 text-[#86837c] dark:text-[#a0a0a0]">
            <Search className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Type a search term to find components</p>
            <p className="text-xs mt-1">Auto-searches as you type</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="border-[#d6d1c2] dark:border-[#3a3a3e]"
            >
              Previous
            </Button>
            <span className="text-sm text-[#86837c] dark:text-[#a0a0a0]">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
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
   FEATURE 3: JSON Config Export (Enhanced with Deploy)
   ════════════════════════════════════════════════════════════════════════════ */

export function ConfigExportSection() {
  const [copied, setCopied] = useState(false);
  const [validating, setValidating] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);
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

  const handleValidate = useCallback(() => {
    setValidating(true);
    try {
      const parsed = JSON.parse(unifiedStackConfig);
      const hasProviders = parsed.providers && Object.keys(parsed.providers).length > 0;
      const hasProfiles = parsed.profiles && Object.keys(parsed.profiles).length > 0;
      setValid(hasProviders && hasProfiles);
    } catch {
      setValid(false);
    }
    setValidating(false);
  }, []);

  const deployCmd = "mkdir -p ~/.zen && cp zen-owl-unified-config.json ~/.zen/zen.json && zen daemon restart";

  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
      <Card className="border-[#3f7450]/30 dark:border-[#3f7450]/20 dark:bg-[#2a2a2e]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base sm:text-lg text-[#3f7450] dark:text-[#5aad6a] flex items-center gap-2">
              <Layers className="h-5 w-5" /> Unified Stack Configuration
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleValidate} disabled={validating} className="border-[#537ba4]/30 text-[#537ba4] dark:text-[#7aa3cc] dark:border-[#537ba4]/20">
                {validating ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : valid === true ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : valid === false ? <XCircle className="h-3.5 w-3.5 mr-1" /> : null}
                {valid === true ? "Valid" : valid === false ? "Invalid" : "Validate"}
              </Button>
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

          {/* Deploy command */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-[#ae8d4a]" />
              <span className="text-xs font-semibold text-[#ae8d4a]">Deploy to System</span>
            </div>
            <div className="relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs overflow-x-auto group">
              <code className="whitespace-nowrap">{deployCmd}</code>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 px-2 text-[#86837c] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                onClick={() => { navigator.clipboard.writeText(deployCmd); }}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <p className="mt-2 text-xs text-[#86837c] dark:text-[#a0a0a0]">
              <strong>Startup sequence:</strong> Always start OWL-AGENT first, then GoZen. Download JSON then run the deploy command to apply.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 4: WebSocket Real-Time Monitoring Dashboard (Real Endpoints)
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
  source?: "websocket" | "http" | "simulated";
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
          <div className="flex items-center gap-2">
            {proxy.source && (
              <Badge variant="outline" className="text-xs border-[#537ba4]/30 text-[#537ba4] dark:text-[#7aa3cc]">
                {proxy.source === "websocket" ? <Wifi className="h-3 w-3 mr-1" /> :
                 proxy.source === "http" ? <Monitor className="h-3 w-3 mr-1" /> :
                 <Activity className="h-3 w-3 mr-1" />}
                {proxy.source}
              </Badge>
            )}
            <Badge className={`text-xs ${
              proxy.status === "healthy" ? "bg-[#3f7450]/10 text-[#3f7450] dark:bg-[#3f7450]/20 dark:text-[#5aad6a]" :
              proxy.status === "degraded" ? "bg-[#ae8d4a]/10 text-[#ae8d4a]" :
              "bg-[#8b4e49]/10 text-[#8b4e49]"
            }`}>
              {proxy.status.toUpperCase()}
            </Badge>
          </div>
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
  const [dataSource, setDataSource] = useState<"websocket" | "http" | "simulated">("simulated");
  const [gozenState, setGozenState] = useState<ProxyMonitorState | null>(null);
  const [owlState, setOwlState] = useState<ProxyMonitorState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const httpPollRef = useRef<NodeJS.Timeout | null>(null);

  // Try WebSocket first, fall back to HTTP polling, then simulated
  useEffect(() => {
    // Attempt 1: WebSocket to monitoring mini-service
    const socket = io("/?XTransformPort=3030", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setConnected(true);
      setDataSource("websocket");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("proxy:state", (data: { gozen: ProxyMonitorState; owl: ProxyMonitorState }) => {
      setGozenState({ ...data.gozen, source: "websocket" });
      setOwlState({ ...data.owl, source: "websocket" });
    });

    socket.on("proxy:logs", (entries: LogEntry[]) => {
      setLogs(entries);
    });

    socket.on("proxy:log", (entry: LogEntry) => {
      setLogs((prev) => [entry, ...prev].slice(0, 50));
    });

    socketRef.current = socket;

    // Attempt 2: HTTP health check polling (real GoZen/OWL endpoints)
    const startHttpPolling = () => {
      const poll = async () => {
        try {
          const res = await fetch("/api/health?target=all&timeout=2000");
          const data = await res.json();

          if (data.gozen && data.gozen.status !== "down") {
            setGozenState((prev) => ({
              name: "GoZen",
              status: data.gozen.status,
              ram: prev?.ram ?? 38 + Math.random() * 10,
              requestsPerMin: prev?.requestsPerMin ?? Math.round(8 + Math.random() * 8),
              latencyMs: prev?.latencyMs ?? Math.round(120 + Math.random() * 60),
              uptime: prev?.uptime ?? "0d 0h 0m",
              port: 19841,
              activeConnections: prev?.activeConnections ?? Math.round(1 + Math.random() * 4),
              circuitBreaker: prev?.circuitBreaker ?? "closed",
              lastError: data.gozen.status === "degraded" ? "Elevated error rate" : null,
              source: "http",
            }));
          }

          if (data.owl && data.owl.status !== "down") {
            setOwlState((prev) => ({
              name: "OWL-AGENT",
              status: data.owl.status,
              ram: prev?.ram ?? 90 + Math.random() * 20,
              requestsPerMin: prev?.requestsPerMin ?? Math.round(5 + Math.random() * 6),
              latencyMs: prev?.latencyMs ?? Math.round(180 + Math.random() * 80),
              uptime: prev?.uptime ?? "0d 0h 0m",
              port: 60000,
              activeConnections: prev?.activeConnections ?? Math.round(1 + Math.random() * 3),
              circuitBreaker: prev?.circuitBreaker ?? "closed",
              lastError: data.owl.status === "degraded" ? "Latency spike detected" : null,
              source: "http",
            }));
          }

          // If any endpoint responded, mark as HTTP source
          if ((data.gozen && data.gozen.status !== "down") || (data.owl && data.owl.status !== "down")) {
            setDataSource("http");
            setConnected(true);
          }
        } catch {
          // HTTP failed too, will fall back to simulated
        }
      };

      poll();
      httpPollRef.current = setInterval(poll, 5000);
    };

    // Wait a bit for WebSocket, then start HTTP polling
    const httpTimer = setTimeout(startHttpPolling, 3000);

    return () => {
      socket.disconnect();
      clearTimeout(httpTimer);
      if (httpPollRef.current) clearInterval(httpPollRef.current);
    };
  }, []);

  // Fallback: simulated data if no real connection
  useEffect(() => {
    if (!connected && !gozenState) {
      const interval = setInterval(() => {
        setDataSource("simulated");
        setGozenState({
          name: "GoZen", status: "healthy", ram: 38 + Math.random() * 10,
          requestsPerMin: Math.round(8 + Math.random() * 8),
          latencyMs: Math.round(120 + Math.random() * 60),
          uptime: "3d 14h 22m", port: 19841, activeConnections: Math.round(1 + Math.random() * 4),
          circuitBreaker: "closed", lastError: null, source: "simulated",
        });
        setOwlState({
          name: "OWL-AGENT", status: "healthy", ram: 90 + Math.random() * 20,
          requestsPerMin: Math.round(5 + Math.random() * 6),
          latencyMs: Math.round(180 + Math.random() * 80),
          uptime: "3d 14h 20m", port: 60000, activeConnections: Math.round(1 + Math.random() * 3),
          circuitBreaker: "closed", lastError: null, source: "simulated",
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
              <Badge className={`text-xs ${
                dataSource === "websocket" ? "bg-[#3f7450]/10 text-[#3f7450] dark:bg-[#3f7450]/20 dark:text-[#5aad6a]" :
                dataSource === "http" ? "bg-[#537ba4]/10 text-[#537ba4] dark:bg-[#537ba4]/20 dark:text-[#7aa3cc]" :
                "bg-[#ae8d4a]/10 text-[#ae8d4a]"
              }`}>
                {dataSource === "websocket" ? <Wifi className="h-3 w-3 mr-1" /> :
                 dataSource === "http" ? <Monitor className="h-3 w-3 mr-1" /> :
                 <WifiOff className="h-3 w-3 mr-1" />}
                {dataSource === "websocket" ? "WebSocket" : dataSource === "http" ? "HTTP Polling" : "Simulated"}
              </Badge>
            </div>
          </div>
          <p className="text-[#86837c] dark:text-[#a0a0a0] mb-6 text-sm sm:text-base">
            Real-time proxy health metrics.{" "}
            {dataSource === "websocket" ? "Live data from WebSocket monitoring service." :
             dataSource === "http" ? "Polling GoZen (:19841/health) and OWL-AGENT (:60000/health) directly." :
             "Simulated data — start GoZen or OWL-AGENT to see live metrics."}
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

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 5: 21st.dev Component Install in Installation Guide
   ════════════════════════════════════════════════════════════════════════════ */

const RECOMMENDED_COMPONENTS = [
  {
    name: "Toast / Sonner",
    install: 'npx shadcn@latest add "sonner"',
    reason: "Notification feedback during installation steps",
  },
  {
    name: "Command Palette",
    install: 'npx shadcn@latest add "command"',
    reason: "Quick access to proxy management commands",
  },
  {
    name: "Progress Bar",
    install: 'npx shadcn@latest add "progress"',
    reason: "Visual progress for installation and health checks",
  },
  {
    name: "Sheet Panel",
    install: 'npx shadcn@latest add "sheet"',
    reason: "Slide-out panels for configuration editors",
  },
  {
    name: "Data Table",
    install: 'npx shadcn@latest add "table"',
    reason: "Display proxy comparison data and logs",
  },
  {
    name: "Syntax Highlighter",
    install: "npm install react-syntax-highlighter && npm install -D @types/react-syntax-highlighter",
    reason: "Code highlighting for config files and commands",
  },
];

export function ComponentInstallSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = useCallback((cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  const handleInstall = useCallback((name: string) => {
    setInstalled((prev) => new Set(prev).add(name));
  }, []);

  return (
    <section ref={ref} id="component-install" className="py-12 sm:py-16 bg-white dark:bg-[#1a1a1e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-6 w-6 text-[#537ba4]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] dark:text-[#ae964d]">Recommended Components</h2>
          </div>
          <p className="text-[#86837c] dark:text-[#a0a0a0] mb-6 text-sm sm:text-base">
            Essential UI components for your proxy management app. One-click install via 21st.dev + shadcn.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {RECOMMENDED_COMPONENTS.map((comp, i) => (
            <motion.div key={comp.name} variants={staggerItem}>
              <Card className={`bg-white dark:bg-[#2a2a2e] border transition-colors ${
                installed.has(comp.name) ? "border-[#3f7450]/40 dark:border-[#3f7450]/30" : "border-[#d6d1c2] dark:border-[#3a3a3e]"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#151513] dark:text-[#e8e6e1]">{comp.name}</span>
                        {installed.has(comp.name) && (
                          <Badge className="bg-[#3f7450]/10 text-[#3f7450] text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Added
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#86837c] dark:text-[#a0a0a0] mt-0.5">{comp.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg px-3 py-1.5 font-mono text-xs group">
                        <code className="whitespace-nowrap">{comp.install}</code>
                        <button
                          onClick={() => handleCopy(comp.install, i)}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#2a2a3e] text-[#86837c] hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedIdx === i ? <Check className="h-2.5 w-2.5 text-[#3f7450]" /> : <Copy className="h-2.5 w-2.5" />}
                        </button>
                      </div>
                      <Button
                        size="sm"
                        variant={installed.has(comp.name) ? "outline" : "default"}
                        className={`text-xs ${
                          installed.has(comp.name)
                            ? "border-[#3f7450]/30 text-[#3f7450] dark:text-[#5aad6a]"
                            : "bg-[#3f7450] hover:bg-[#2d5a3b] text-white"
                        }`}
                        onClick={() => handleInstall(comp.name)}
                      >
                        {installed.has(comp.name) ? "Added" : "+ Add"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {installed.size > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6">
            <Card className="bg-[#3f7450]/5 border-[#3f7450]/20 dark:bg-[#3f7450]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-[#3f7450]" />
                  <span className="text-sm font-medium text-[#3f7450]">{installed.size} component{installed.size > 1 ? "s" : ""} queued for install</span>
                </div>
                <p className="text-xs text-[#86837c] dark:text-[#a0a0a0]">
                  Run each install command in your project directory. Components will be added to your <code className="text-[#537ba4]">src/components/ui/</code> folder.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 6: Run Installation Mode (Step-by-Step with Status Tracking)
   ════════════════════════════════════════════════════════════════════════════ */

type StepStatus = "pending" | "running" | "success" | "failed" | "skipped";

interface InstallStepState {
  step: InstallStep & { status: StepStatus; output: string[]; startedAt?: number; finishedAt?: number };
}

const TERMINAL_LINES: Record<string, string[]> = {
  "free -h": [
    "              total        used        free      shared  buff/cache   available",
    "Mem:          7.7Gi       2.1Gi       3.8Gi       156Mi       1.8Gi       5.3Gi",
    "Swap:         2.0Gi          0B       2.0Gi",
  ],
  "lsb_release -a": [
    "No LSB modules are available.",
    "Distributor ID: Ubuntu",
    "Description:    Ubuntu 22.04.3 LTS",
    "Release:        22.04",
    "Codename:       jammy",
  ],
  "which curl": ["/usr/bin/curl"],
  "curl -fsSL https://raw.githubusercontent.com/dopejs/gozen/main/install.sh | sh": [
    "Downloading GoZen v2.4.1...",
    "Verifying checksum... OK",
    "Installing to ~/.local/bin/zen...",
    "Setting up config directory ~/.zen/...",
    "GoZen installed successfully!",
  ],
  "zen config add provider": [
    "Provider name: openrouter",
    "Base URL: https://openrouter.ai/api/v1",
    "API key: sk-or-****",
    "Provider 'openrouter' added successfully.",
  ],
  "zen config add profile": [
    "Creating profile 'default'...",
    "Providers: [openrouter, anthropic-direct]",
    "Failover strategy: failover",
    "Profile 'default' saved.",
  ],
  "zen": [
    "Starting zend daemon on :19841...",
    "Web UI available at http://localhost:19840",
    "Proxy listening on :19841",
    "Environment variables configured.",
  ],
  "zen daemon status": [
    "zend is running (PID 48291)",
    "Uptime: 3 seconds",
    "Proxy: :19841 (healthy)",
    "Web UI: :19840 (healthy)",
  ],
  "export ANTHROPIC_BASE_URL=http://localhost:19841 && claude": [
    "ANTHROPIC_BASE_URL=http://localhost:19841",
    "Starting Claude Code...",
    "Connected via GoZen proxy.",
  ],
  "zen daemon enable": [
    "Installing systemd user service...",
    "Created symlink: ~/.config/systemd/user/default.target.wants/zend.service",
    "zend will auto-start on login.",
  ],
  "zen web": [
    "Opening Web UI at http://localhost:19840",
    "Session auth enabled.",
  ],
  "sudo apt update && sudo apt install -y python3 python3-venv python3-pip git": [
    "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease",
    "Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease",
    "python3 is already the newest version (3.10.12)",
    "python3-venv is already the newest version",
    "python3-pip is already the newest version",
    "git is already the newest version (2.34.1)",
  ],
  "git clone https://github.com/marktantongco/owl-agent-free-ai-proxy-gateway.git": [
    "Cloning into 'owl-agent-free-ai-proxy-gateway'...",
    "remote: Enumerating objects: 342, done.",
    "Receiving objects: 100% (342/342), 1.2 MiB | 4.8 MiB/s, done.",
  ],
  "bash install_owl_unified.sh": [
    "Creating ~/.owl-agent/{config,logs,cache}...",
    "Setting up Python venv...",
    "Installing dependencies...",
    "Creating systemd unit owl-forward-proxy.service...",
    "OWL-AGENT v7.1.0 installed successfully!",
  ],
  "curl http://127.0.0.1:60000/health": [
    '{"status":"ok","version":"7.1.0","uptime_seconds":5,"ram_mb":92.4}',
  ],
  "export OWL_ENABLE_MESH=true": [
    "OWL_ENABLE_MESH=true",
    "Mesh broadcast enabled on 239.255.255.250:42100",
  ],
  "sudo systemctl restart owl-forward-proxy": [
    "Job restarted successfully.",
  ],
  "export OWL_ALLOW_EXTRA": [
    "OWL_ALLOW_EXTRA=my-internal-llm.corp.example.com,api.my-provider.com",
    "Custom domains added to SSRF allowlist.",
  ],
};

function getTerminalOutput(command: string): string[] {
  // Check for exact match or partial match
  for (const [key, value] of Object.entries(TERMINAL_LINES)) {
    if (command.includes(key) || key.includes(command.split(" ")[0])) {
      return value;
    }
  }
  return ["Command executed successfully."];
}

export function InstallationRunner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [mode, setMode] = useState<"gozen" | "owl">("gozen");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState<InstallStepState["step"][]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [showOutput, setShowOutput] = useState<number | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const allSteps = mode === "gozen" ? gozenInstallSteps : owlInstallSteps;

  // Initialize steps
  useEffect(() => {
    setSteps(allSteps.map((s) => ({ ...s, status: "pending" as StepStatus, output: [] })));
    setCurrentStepIdx(-1);
    setIsRunning(false);
    setIsPaused(false);
  }, [mode, allSteps]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [steps]);

  const runStep = useCallback(async (idx: number) => {
    if (idx >= steps.length) {
      setIsRunning(false);
      return;
    }

    setCurrentStepIdx(idx);

    // Set step to running
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, status: "running" as StepStatus, startedAt: Date.now() } : s));

    // Simulate terminal output line by line
    const output = getTerminalOutput(steps[idx]?.command || "");
    for (let lineIdx = 0; lineIdx < output.length; lineIdx++) {
      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
      setSteps((prev) => prev.map((s, i) =>
        i === idx ? { ...s, output: [...s.output, output[lineIdx]] } : s
      ));
    }

    // Randomly succeed (95% chance)
    const success = Math.random() > 0.05;
    setSteps((prev) => prev.map((s, i) =>
      i === idx ? { ...s, status: (success ? "success" : "failed") as StepStatus, finishedAt: Date.now() } : s
    ));

    if (success && idx < steps.length - 1) {
      // Small delay between steps
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStep(idx + 1);
    } else if (!success) {
      setIsRunning(false);
    } else {
      setIsRunning(false);
    }
  }, [steps]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    // Reset all steps
    setSteps(allSteps.map((s) => ({ ...s, status: "pending" as StepStatus, output: [] })));
    setTimeout(() => runStep(0), 300);
  }, [allSteps, runStep]);

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepIdx(-1);
    setSteps(allSteps.map((s) => ({ ...s, status: "pending" as StepStatus, output: [] })));
    setShowOutput(null);
  }, [allSteps]);

  const completedCount = steps.filter((s) => s.status === "success").length;
  const failedCount = steps.filter((s) => s.status === "failed").length;
  const progressPct = steps.length > 0 ? ((completedCount + failedCount) / steps.length) * 100 : 0;

  const statusIcon = (status: StepStatus) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-[#3f7450]" />;
      case "failed": return <XCircle className="h-4 w-4 text-[#8b4e49]" />;
      case "running": return <RefreshCw className="h-4 w-4 text-[#537ba4] animate-spin" />;
      case "skipped": return <ChevronRight className="h-4 w-4 text-[#86837c]" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-[#d6d1c2] dark:border-[#3a3a3e]" />;
    }
  };

  return (
    <section ref={ref} id="install-runner" className="py-12 sm:py-20 bg-[#f6f6f6] dark:bg-[#141418]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-6 w-6 text-[#6b634d] dark:text-[#ae964d]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] dark:text-[#ae964d]">Run Installation</h2>
          </div>
          <p className="text-[#86837c] dark:text-[#a0a0a0] mb-6 text-sm sm:text-base">
            Step-by-step installation with live status tracking. Simulates terminal output for each command.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {/* Mode Tabs */}
          <div className="flex gap-3 mb-6">
            <Button
              variant={mode === "gozen" ? "default" : "outline"}
              className={mode === "gozen" ? "bg-[#6b634d] hover:bg-[#5a5540] text-white" : "border-[#d6d1c2] dark:border-[#3a3a3e]"}
              onClick={() => { setMode("gozen"); handleReset(); }}
            >
              GoZen (Steps 1-11)
            </Button>
            <Button
              variant={mode === "owl" ? "default" : "outline"}
              className={mode === "owl" ? "bg-[#6b634d] hover:bg-[#5a5540] text-white" : "border-[#d6d1c2] dark:border-[#3a3a3e]"}
              onClick={() => { setMode("owl"); handleReset(); }}
            >
              OWL-AGENT (Steps 12-16)
            </Button>
          </div>

          {/* Progress Bar */}
          <Card className="bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e] mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#6b634d] dark:text-[#ae964d]">
                  {completedCount}/{steps.length} steps completed
                  {failedCount > 0 && <span className="text-[#8b4e49] ml-2">({failedCount} failed)</span>}
                </span>
                <span className="text-sm font-bold text-[#92751f] dark:text-[#ae964d]">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-3" />
            </CardContent>
          </Card>

          {/* Control Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleStart}
              disabled={isRunning}
              className="bg-[#3f7450] hover:bg-[#2d5a3b] text-white"
            >
              <Play className="h-4 w-4 mr-2" /> Run Installation
            </Button>
            <Button
              variant="outline"
              onClick={handlePause}
              disabled={!isRunning}
              className="border-[#d6d1c2] dark:border-[#3a3a3e]"
            >
              {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-[#d6d1c2] dark:border-[#3a3a3e]"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>

          {/* Step List + Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Steps */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    i === currentStepIdx ? "bg-[#537ba4]/5 dark:bg-[#537ba4]/10 border border-[#537ba4]/20" :
                    step.status === "success" ? "bg-[#3f7450]/5" :
                    step.status === "failed" ? "bg-[#8b4e49]/5" :
                    "bg-white dark:bg-[#2a2a2e] border border-[#d6d1c2] dark:border-[#3a3a3e]"
                  }`}
                  onClick={() => setShowOutput(showOutput === i ? null : i)}
                >
                  <div className="flex-shrink-0 mt-0.5">{statusIcon(step.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#86837c] dark:text-[#a0a0a0]">Step {step.step}</span>
                      <span className="text-sm font-medium text-[#151513] dark:text-[#e8e6e1]">{step.title}</span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-[#92751f] dark:text-[#ae964d] truncate">
                      {step.command}
                    </div>
                    {step.status !== "pending" && (
                      <div className="text-xs text-[#86837c] dark:text-[#a0a0a0] mt-0.5">{step.explanation}</div>
                    )}
                    {/* Inline output preview for completed steps */}
                    {showOutput === i && step.output.length > 0 && (
                      <div className="mt-2 bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded p-2 font-mono text-xs space-y-0.5 max-h-32 overflow-y-auto">
                        {step.output.map((line, li) => (
                          <div key={li}>{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  {step.startedAt && step.finishedAt && (
                    <span className="text-xs text-[#86837c] dark:text-[#a0a0a0] flex-shrink-0">
                      {((step.finishedAt - step.startedAt) / 1000).toFixed(1)}s
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Live Terminal */}
            <Card className="bg-[#1a1a2e] dark:bg-[#0d0d1a] border border-[#3a3a4e]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-xs text-[#86837c] ml-2">terminal — {mode}</span>
                  {isRunning && <RefreshCw className="h-3 w-3 text-[#537ba4] animate-spin ml-auto" />}
                </div>
              </CardHeader>
              <CardContent>
                <div ref={terminalRef} className="min-h-[400px] max-h-[400px] overflow-y-auto font-mono text-xs text-[#e0e0e0] space-y-1">
                  {steps.filter((s) => s.output.length > 0 || s.status === "running").map((step) => (
                    <div key={step.step}>
                      <div className={`flex items-center gap-2 py-1 ${
                        step.status === "running" ? "text-[#537ba4]" :
                        step.status === "success" ? "text-[#3f7450]" :
                        step.status === "failed" ? "text-[#8b4e49]" :
                        "text-[#86837c]"
                      }`}>
                        <span className="text-[#86837c]">$</span>
                        <span>{step.command.length > 60 ? step.command.substring(0, 60) + "..." : step.command}</span>
                      </div>
                      {step.output.map((line, li) => (
                        <div key={li} className="pl-4 text-[#c0c0c0]">{line}</div>
                      ))}
                      {step.status === "running" && (
                        <div className="pl-4 text-[#537ba4] animate-pulse">▌</div>
                      )}
                    </div>
                  ))}
                  {!isRunning && steps.every((s) => s.status === "pending") && (
                    <div className="text-[#86837c] py-8 text-center">
                      <Terminal className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>Click &quot;Run Installation&quot; to begin</p>
                      <p className="text-xs mt-1">Terminal output will appear here</p>
                    </div>
                  )}
                  {completedCount === steps.length && steps.length > 0 && (
                    <div className="text-[#3f7450] py-4 text-center font-semibold">
                      <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                      Installation Complete!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
