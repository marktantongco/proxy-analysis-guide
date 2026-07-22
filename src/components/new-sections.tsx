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
  Monitor, ArrowRight, ExternalLink, Sparkles, Eye, Loader2,
  AlertCircle, Hash, Timer, Star, GitFork, Archive
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
import { fadeUp, staggerContainer, staggerItem, scaleIn, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { palette, tw } from "@/lib/theme-tokens";
import { type ProxyMonitorState, type RequestLogEntry } from "@/lib/proxy-monitor-types";
import { useProxyStore } from "@/lib/store";
import { type RepoMetrics, type MetricsResponse } from "@/lib/live-metrics";

/* ════════════════════════════════════════════════════════════════════════════
   SHARED: Loading Skeleton Component
   ════════════════════════════════════════════════════════════════════════════ */

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/40 rounded-md ${className}`} />;
}

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <Card className={`${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder}`}>
      <CardContent className="p-4 space-y-3">
        <SkeletonPulse className="h-4 w-2/3" />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <SkeletonPulse key={i} className={`h-3 ${i === lines - 2 ? "w-1/2" : "w-full"}`} />
        ))}
      </CardContent>
    </Card>
  );
}

function SkeletonMetricCard() {
  return (
    <div className={`${tw.bgBg} ${tw.darkBgHoverAlt} rounded-lg p-3 text-center space-y-2`}>
      <SkeletonPulse className="h-4 w-4 mx-auto rounded-full" />
      <SkeletonPulse className="h-5 w-12 mx-auto" />
      <SkeletonPulse className="h-3 w-16 mx-auto" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SHARED: Toast Notification Component
   ════════════════════════════════════════════════════════════════════════════ */

function ToastNotification({ message, visible, type = "success" }: { message: string; visible: boolean; type?: "success" | "error" | "info" }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className={`fixed bottom-6 left-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium ${
            type === "success" ? "bg-cascade-success text-white" :
            type === "error" ? "bg-cascade-error text-white" :
            "bg-cascade-info text-white"
          }`}
        >
          {type === "success" && <CheckCircle2 className="h-4 w-4" />}
          {type === "error" && <XCircle className="h-4 w-4" />}
          {type === "info" && <AlertCircle className="h-4 w-4" />}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 1: Dark Mode Toggle + ui-ux-pro-max Design Dials
   ════════════════════════════════════════════════════════════════════════════ */

const THEME_PRESETS = [
  { name: "Warm", accent: palette.accent, bg: palette.bg, header: palette.header, darkAccent: "#ae8d4a", darkBg: "#1a1a1e", darkHeader: "#ae964d" },
  { name: "Cool", accent: palette.info, bg: "#f0f4f8", header: "#3a5a7c", darkAccent: "#6b9cc4", darkBg: "#1a1a2e", darkHeader: "#6b9cc4" },
  { name: "Midnight", accent: "#7c5cbf", bg: "#f5f3fa", header: "#5a3e8a", darkAccent: "#9c7cdf", darkBg: "#1a1a2e", darkHeader: "#b8a9d4" },
  { name: "Forest", accent: palette.success, bg: "#f0f5f1", header: "#2d5a3b", darkAccent: "#5a9c6e", darkBg: "#1a2e1a", darkHeader: "#5a9c6e" },
  { name: "Ember", accent: "#c45c3e", bg: "#faf5f3", header: palette.error, darkAccent: "#e07050", darkBg: "#2e1a1a", darkHeader: "#c45c57" },
];

export function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const themePreference = useProxyStore((s) => s.themePreference);
  const setThemePreference = useProxyStore((s) => s.setThemePreference);
  const [showPanel, setShowPanel] = useState(false);
  const isDark = resolvedTheme === "dark";
  const reduced = useReducedMotionSafe();

  const handleThemeToggle = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    setThemePreference(next);
  }, [isDark, setTheme, setThemePreference]);

  const handleThemeSet = useCallback((pref: "light" | "dark" | "system") => {
    setTheme(pref);
    setThemePreference(pref);
  }, [setTheme, setThemePreference]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleThemeToggle}
        className={`relative w-9 h-9 rounded-full border ${tw.borderBorder} ${tw.darkBorderBorder} ${tw.hoverBgBg} ${tw.darkBgHover}`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={reduced ? { duration: 0 } : { duration: 0.2 }}>
              <Sun className="h-4 w-4 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={reduced ? { duration: 0 } : { duration: 0.2 }}>
              <Moon className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className={`ml-1 w-9 h-9 rounded-full border ${tw.borderBorder} ${tw.darkBorderBorder} ${tw.hoverBgBg} ${tw.darkBgHover}`}
      >
        <Palette className="h-4 w-4 text-primary" />
      </Button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className={`absolute right-0 top-12 z-50 w-64 ${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder} rounded-xl shadow-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Design Dials</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">ui-ux-pro-max palette presets</div>
            <div className="space-y-2">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${tw.hoverBgBg} ${tw.darkBgHoverAlt} transition-colors text-left`}
                  onClick={() => {
                    const colors = isDark
                      ? { accent: preset.darkAccent, header: preset.darkHeader, bg: preset.darkBg }
                      : { accent: preset.accent, header: preset.header, bg: preset.bg };
                    document.documentElement.style.setProperty("--accent-preset", colors.accent);
                    document.documentElement.style.setProperty("--header-preset", colors.header);
                  }}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: isDark ? preset.darkAccent : preset.accent }} />
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: isDark ? preset.darkHeader : preset.header }} />
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: isDark ? preset.darkBg : preset.bg }} />
                  </div>
                  <span className="text-xs font-medium text-foreground">{preset.name}</span>
                </button>
              ))}
            </div>
            <div className={`mt-3 pt-3 border-t ${tw.borderBorder} ${tw.darkBorderBorder}`}>
              <div className="text-xs text-muted-foreground mb-2">Quick Actions</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className={`flex-1 text-xs ${tw.borderBorder} ${tw.darkBorderBorder} ${themePreference === "light" ? "ring-1 ring-accent/40" : ""}`} onClick={() => handleThemeSet("light")}>
                  <Sun className="h-3 w-3 mr-1" /> Light
                </Button>
                <Button variant="outline" size="sm" className={`flex-1 text-xs ${tw.borderBorder} ${tw.darkBorderBorder} ${themePreference === "dark" ? "ring-1 ring-accent/40" : ""}`} onClick={() => handleThemeSet("dark")}>
                  <Moon className="h-3 w-3 mr-1" /> Dark
                </Button>
                <Button variant="outline" size="sm" className={`flex-1 text-xs ${tw.borderBorder} ${tw.darkBorderBorder} ${themePreference === "system" ? "ring-1 ring-accent/40" : ""}`} onClick={() => handleThemeSet("system")}>
                  <Monitor className="h-3 w-3 mr-1" /> System
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

const FALLBACK_RESULTS: SearchResult[] = [
  {
    name: "Animated Button", preview_url: null, demo_id: 1,
    component_data: { id: 1, name: "Animated Button", component_slug: "animated-button", library_id: "shadcn", description: "A button with hover and click animations built on Framer Motion", install_command: 'npx shadcn@latest add "button"' },
    component_user_data: { name: "shadcn", username: "shadcn-ui", image_url: null },
    usage_count: 24500,
  },
  {
    name: "Dialog Modal", preview_url: null, demo_id: 2,
    component_data: { id: 2, name: "Dialog Modal", component_slug: "dialog", library_id: "shadcn", description: "Accessible modal dialog with overlay, animations, and focus trapping", install_command: 'npx shadcn@latest add "dialog"' },
    component_user_data: { name: "shadcn", username: "shadcn-ui", image_url: null },
    usage_count: 18200,
  },
  {
    name: "Animated Card", preview_url: null, demo_id: 3,
    component_data: { id: 3, name: "Animated Card", component_slug: "card", library_id: "shadcn", description: "Card component with entrance animations and hover effects", install_command: 'npx shadcn@latest add "card"' },
    component_user_data: { name: "shadcn", username: "shadcn-ui", image_url: null },
    usage_count: 15800,
  },
  {
    name: "Toast Notifications", preview_url: null, demo_id: 4,
    component_data: { id: 4, name: "Toast Notifications", component_slug: "sonner", library_id: "shadcn", description: "Beautiful toast notifications powered by Sonner", install_command: 'npx shadcn@latest add "sonner"' },
    component_user_data: { name: "shadcn", username: "shadcn-ui", image_url: null },
    usage_count: 12400,
  },
  {
    name: "Command Palette", preview_url: null, demo_id: 5,
    component_data: { id: 5, name: "Command Palette", component_slug: "command", library_id: "shadcn", description: "Quick command palette for keyboard-driven navigation", install_command: 'npx shadcn@latest add "command"' },
    component_user_data: { name: "shadcn", username: "shadcn-ui", image_url: null },
    usage_count: 9800,
  },
  {
    name: "Data Table", preview_url: null, demo_id: 6,
    component_data: { id: 6, name: "Data Table", component_slug: "table", library_id: "shadcn", description: "Powerful data table with sorting, filtering, and pagination", install_command: 'npx shadcn@latest add "table"' },
    component_user_data: { name: "shadcn", username: "shadcn-ui", image_url: null },
    usage_count: 8500,
  },
];

function ComponentCard({ result, onInstall, isPreviewed, onPreview }: {
  result: SearchResult;
  onInstall: (cmd: string) => void;
  isPreviewed: boolean;
  onPreview: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotionSafe();

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result.component_data.install_command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result.component_data.install_command]);

  return (
    <Card
      className={`${tw.bgCard} ${tw.darkBgCard} border ${isPreviewed ? "border-cascade-accent/50 ring-1 ring-cascade-accent/20" : `${tw.borderBorder} ${tw.darkBorderBorder}`} hover:shadow-md transition-all group cursor-pointer`}
      onClick={onPreview}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-semibold text-sm ${tw.textText} ${tw.darkTextText}`}>{result.component_data.name}</span>
              <Badge variant="outline" className={`text-xs ${tw.borderAccent30} ${tw.textAccent} ${tw.darkTextAccent} ${tw.darkBorderAccent30}`}>
                {result.component_user_data.username}
              </Badge>
              {result.preview_url && (
                <a href={result.preview_url} target="_blank" rel="noopener noreferrer" className={`${tw.textInfo} ${tw.hoverInfoText}`} onClick={(e) => e.stopPropagation()}>
                  <Eye className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <p className={`text-xs ${tw.textMuted} ${tw.darkTextMuted} mt-1 line-clamp-2`}>{result.component_data.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-xs ${tw.textMuted} ${tw.darkTextMuted}`}>
              {(result.usage_count / 1000).toFixed(1)}K uses
            </div>
          </div>
        </div>

        {/* Install command — prominently displayed */}
        <div className="mt-3 relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-2.5 font-mono text-xs overflow-x-auto group/code">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="h-3 w-3 text-cascade-success flex-shrink-0" />
            <span className="text-cascade-info text-[10px] font-sans uppercase tracking-wide">Install</span>
          </div>
          <code className="whitespace-nowrap">{result.component_data.install_command}</code>
          <div className="absolute top-1 right-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 ${tw.textMuted} hover:text-white opacity-0 group-hover/code:opacity-100 transition-opacity text-xs`}
              onClick={handleCopy}
            >
              {copied ? <Check className={`h-3 w-3 ${tw.textSuccess}`} /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 ${tw.textSuccess} ${tw.hoverSuccessText} opacity-0 group-hover/code:opacity-100 transition-opacity text-xs font-medium`}
              onClick={(e) => { e.stopPropagation(); onInstall(result.component_data.install_command); }}
            >
              + Add
            </Button>
          </div>
        </div>

        {/* Expanded preview when selected */}
        <AnimatePresence>
          {isPreviewed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`mt-3 pt-3 border-t ${tw.borderBorder} ${tw.darkBorderBorder}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Package className={`h-4 w-4 ${tw.textAccent} ${tw.darkTextAccent}`} />
                  <span className={`text-xs font-semibold ${tw.textText} ${tw.darkTextText}`}>Component Details</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className={`${tw.textMuted} ${tw.darkTextMuted}`}>Slug:</span>{" "}
                    <code className={`${tw.textAccent} ${tw.darkTextAccent}`}>{result.component_data.component_slug}</code>
                  </div>
                  <div>
                    <span className={`${tw.textMuted} ${tw.darkTextMuted}`}>Library:</span>{" "}
                    <code className={`${tw.textInfo} ${tw.darkTextInfo}`}>{result.component_data.library_id}</code>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className={`flex-1 text-xs ${tw.bgSuccess} ${tw.hoverSuccessDark} text-white`}
                    onClick={(e) => { e.stopPropagation(); onInstall(result.component_data.install_command); }}
                  >
                    <ArrowRight className="h-3 w-3 mr-1" /> Add to Project
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-xs ${tw.borderBorder} ${tw.darkBorderBorder}`}
                    onClick={handleCopy}
                  >
                    {copied ? <Check className={`h-3 w-3 mr-1 ${tw.textSuccess}`} /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? "Copied!" : "Copy Cmd"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function ComponentSearchSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsLeft, setRequestsLeft] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [installedCmds, setInstalledCmds] = useState<string[]>([]);
  const [previewedIdx, setPreviewedIdx] = useState<number | null>(null);
  const [apiError, setApiError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Simulate initial loading
  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const search = useCallback(async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) { setResults([]); setApiError(false); setUsingFallback(false); return; }
    setLoading(true);
    setApiError(false);
    setUsingFallback(false);
    try {
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchQuery, page, per_page: 12 }),
      });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
        if (data.metadata) {
          setTotalPages(data.metadata.pagination?.total_pages || 0);
          setRequestsLeft(data.metadata.requests_remaining);
        }
      } else {
        // API returned no results — use fallback
        const filtered = FALLBACK_RESULTS.filter(r =>
          r.component_data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.component_data.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered.length > 0 ? filtered : FALLBACK_RESULTS);
        setUsingFallback(true);
      }
    } catch {
      setApiError(true);
      // Use fallback data when API is unreachable
      const filtered = FALLBACK_RESULTS.filter(r =>
        r.component_data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.component_data.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : FALLBACK_RESULTS);
      setUsingFallback(true);
    }
    setLoading(false);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    setPreviewedIdx(null);
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
    <section ref={ref} id="components" className={`py-12 sm:py-20 ${tw.bgCard} ${tw.darkBgBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className={`text-2xl sm:text-3xl font-bold ${tw.textHeader} ${tw.darkTextHeader}`}>Component Explorer</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${tw.borderInfo30} ${tw.textInfo}`}>
                <Package className="h-3 w-3 mr-1" /> 21st.dev
              </Badge>
              <Badge variant="outline" className={`text-xs ${tw.borderSuccess30} ${tw.textSuccess}`}>
                <Sparkles className="h-3 w-3 mr-1" /> 999K+ searches
              </Badge>
            </div>
          </div>
          <p className={`${tw.textMuted} ${tw.darkTextMuted} mb-6 text-sm sm:text-base`}>
            Search 1400+ React UI components from the 21st.dev registry. Find, preview, and install with one command.
          </p>
        </motion.div>

        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          {/* Category Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? `bg-primary text-primary-foreground`
                    : `${tw.bgBg} ${tw.darkBgCard} ${tw.textMuted} ${tw.darkTextMuted} ${tw.hoverBgText} ${tw.darkHoverBgBorderDark}`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${tw.textMuted} ${tw.darkTextMuted}`} />
              <Input
                placeholder="Search components (button, card, dialog, animation...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search(query, 1)}
                className={`pl-10 ${tw.bgBg} ${tw.darkBgCard} ${tw.borderBorder} ${tw.darkBorderBorder} ${tw.textText} ${tw.darkTextText}`}
              />
            </div>
            <Button onClick={() => search(query, 1)} disabled={loading} className={`${tw.btnPrimary}`}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* API status indicators */}
          {usingFallback && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 mb-4 text-xs p-2.5 rounded-lg bg-cascade-warning/10 border border-cascade-warning/20`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-cascade-warning flex-shrink-0" />
              <span className="text-cascade-warning font-medium">API unreachable</span>
              <span className="text-muted-foreground">— showing curated fallback components. Live search will resume when the API is available.</span>
            </motion.div>
          )}

          {apiError && !usingFallback && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 mb-4 text-xs p-2.5 rounded-lg bg-cascade-error/10 border border-cascade-error/20`}
            >
              <WifiOff className="h-3.5 w-3.5 text-cascade-error flex-shrink-0" />
              <span className="text-cascade-error font-medium">Connection failed</span>
              <span className="text-muted-foreground">— check your network and try again.</span>
            </motion.div>
          )}

          {requestsLeft !== null && (
            <div className={`flex items-center gap-2 mb-4 text-xs ${tw.textMuted} ${tw.darkTextMuted}`}>
              <span>API calls remaining: {requestsLeft.toLocaleString()}</span>
              <span className={`${tw.borderMutedText}`}>|</span>
              <span>Free plan: 1M requests/month</span>
            </div>
          )}

          {/* Installed Components Tracker */}
          {installedCmds.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
              <Card className={`bg-cascade-success/5 border-cascade-success/20 dark:bg-cascade-success/10`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className={`h-4 w-4 ${tw.textSuccess}`} />
                    <span className={`text-xs font-medium ${tw.textSuccess}`}>{installedCmds.length} component{installedCmds.length > 1 ? "s" : ""} ready to install</span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {installedCmds.map((cmd, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ArrowRight className={`h-3 w-3 ${tw.textSuccess} flex-shrink-0`} />
                        <code className={`${tw.textText} ${tw.darkTextText}`}>{cmd}</code>
                        <button
                          onClick={() => setInstalledCmds((prev) => prev.filter((_, idx) => idx !== i))}
                          className={`${tw.textError} ${tw.hoverErrorText} ml-auto flex-shrink-0`}
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

        {/* Loading Skeleton */}
        {initialLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} lines={4} />
            ))}
          </div>
        )}

        {!initialLoading && (
          <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((result, i) => (
              <motion.div key={`${result.component_data.component_slug}-${result.demo_id || i}`} variants={variants.staggerItem}>
                <ComponentCard
                  result={result}
                  onInstall={handleInstall}
                  isPreviewed={previewedIdx === i}
                  onPreview={() => setPreviewedIdx(previewedIdx === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {results.length === 0 && query && !loading && !initialLoading && (
          <div className={`text-center py-8 ${tw.textMuted} ${tw.darkTextMuted}`}>
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No components found for &quot;{query}&quot;</p>
            <p className="text-xs mt-1">Try: &quot;button&quot;, &quot;card&quot;, &quot;dialog&quot;, &quot;animation&quot;</p>
          </div>
        )}

        {results.length === 0 && !query && !initialLoading && (
          <div className={`text-center py-8 ${tw.textMuted} ${tw.darkTextMuted}`}>
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
              className={`${tw.borderBorder} ${tw.darkBorderBorder}`}
            >
              Previous
            </Button>
            <span className={`text-sm ${tw.textMuted} ${tw.darkTextMuted}`}>Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`${tw.borderBorder} ${tw.darkBorderBorder}`}
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
   FEATURE 3: JSON Config Export (Enhanced with Preview + Syntax Highlighting)
   ════════════════════════════════════════════════════════════════════════════ */

function syntaxHighlightJSON(json: string): React.ReactNode[] {
  const lines = json.split("\n");
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Highlight keys
    const keyMatch = remaining.match(/^(\s*)"([^"]+)":/);
    if (keyMatch) {
      parts.push(<span key={`k${keyIdx}`} className="text-cascade-info">{keyMatch[1]}</span>);
      parts.push(<span key={`k${keyIdx}q`} className="text-cascade-accent2">&quot;{keyMatch[2]}&quot;</span>);
      parts.push(<span key={`c${keyIdx}`}>:</span>);
      remaining = remaining.slice(keyMatch[0].length);
      keyIdx++;
    }

    // Highlight values
    const valueMatch = remaining.match(/^\s*/);
    const indent = valueMatch ? valueMatch[0] : "";
    remaining = remaining.replace(/^\s*/, "");

    if (remaining.startsWith('"')) {
      // String value
      const strMatch = remaining.match(/^"([^"]*)"(,?)$/);
      if (strMatch) {
        parts.push(<span key={`s${lineIdx}`}>{indent}</span>);
        parts.push(<span key={`sv${lineIdx}`} className="text-cascade-success">&quot;{strMatch[1]}&quot;</span>);
        if (strMatch[2]) parts.push(<span key={`sc${lineIdx}`}>{strMatch[2]}</span>);
      } else {
        parts.push(<span key={`raw${lineIdx}`}>{line}</span>);
      }
    } else if (/^-?\d+(\.\d+)?/.test(remaining)) {
      const numMatch = remaining.match(/^(-?\d+(?:\.\d+)?)(,?)$/);
      if (numMatch) {
        parts.push(<span key={`n${lineIdx}`}>{indent}</span>);
        parts.push(<span key={`nv${lineIdx}`} className="text-cascade-warning">{numMatch[1]}</span>);
        if (numMatch[2]) parts.push(<span key={`nc${lineIdx}`}>{numMatch[2]}</span>);
      } else {
        parts.push(<span key={`raw${lineIdx}`}>{line}</span>);
      }
    } else if (remaining === "true" || remaining === "false") {
      parts.push(<span key={`b${lineIdx}`}>{indent}</span>);
      parts.push(<span key={`bv${lineIdx}`} className="text-cascade-accent2">{remaining}</span>);
    } else if (remaining === "null") {
      parts.push(<span key={`nl${lineIdx}`}>{indent}</span>);
      parts.push(<span key={`nlv${lineIdx}`} className="text-muted-foreground">{remaining}</span>);
    } else {
      // Brackets, braces, etc.
      parts.push(<span key={`raw${lineIdx}`}>{line}</span>);
    }

    return <div key={lineIdx}>{parts}</div>;
  });
}

export function ConfigExportSection() {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [validating, setValidating] = useState(false);
  const [valid, setValid] = useState<boolean | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(unifiedStackConfig);
    setCopied(true);
    showToast("Config copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [showToast]);

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
    setDownloaded(true);
    showToast("Config file downloaded!");
    setTimeout(() => setDownloaded(false), 2000);
  }, [showToast]);

  const handleValidate = useCallback(() => {
    setValidating(true);
    try {
      const parsed = JSON.parse(unifiedStackConfig);
      const hasProviders = parsed.providers && Object.keys(parsed.providers).length > 0;
      const hasProfiles = parsed.profiles && Object.keys(parsed.profiles).length > 0;
      setValid(hasProviders && hasProfiles);
      if (hasProviders && hasProfiles) {
        showToast("Config is valid!", "success");
      } else {
        showToast("Config validation failed", "error");
      }
    } catch {
      setValid(false);
      showToast("Invalid JSON format", "error");
    }
    setValidating(false);
  }, [showToast]);

  const deployCmd = "mkdir -p ~/.zen && cp zen-owl-unified-config.json ~/.zen/zen.json && zen daemon restart";

  return (
    <>
      <motion.div ref={ref} variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
        <Card className={`border-cascade-success/30 dark:border-cascade-success/20 ${tw.darkBgCard}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className={`text-base sm:text-lg ${tw.textSuccess} ${tw.darkTextSuccess} flex items-center gap-2`}>
                <Layers className="h-5 w-5" /> Unified Stack Configuration
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleValidate} disabled={validating} className={`${tw.borderInfo30} ${tw.textInfo} ${tw.darkTextInfo} ${tw.darkBorderInfo20}`}>
                  {validating ? <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" /> : valid === true ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : valid === false ? <XCircle className="h-3.5 w-3.5 mr-1" /> : null}
                  {valid === true ? "Valid" : valid === false ? "Invalid" : "Validate"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy} className={`${tw.borderSuccess30} ${tw.textSuccess} ${tw.darkTextSuccess} ${tw.darkBorderSuccess20}`}>
                  {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button size="sm" onClick={handleDownload} className={`${tw.bgSuccess} ${tw.hoverSuccessDark} text-white`}>
                  {downloaded ? <Check className="h-3.5 w-3.5 mr-1" /> : <Download className="h-3.5 w-3.5 mr-1" />}
                  {downloaded ? "Saved!" : "Download JSON"}
                </Button>
              </div>
            </div>
            <CardDescription className={`${tw.textMuted} ${tw.darkTextMuted}`}>GoZen → OWL-AGENT → Upstream wiring in ~/.zen/zen.json</CardDescription>
          </CardHeader>
          <CardContent>
            {/* JSON Preview with syntax highlighting */}
            <div className="relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs sm:text-sm overflow-x-auto max-h-64">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[10px] text-white/40 ml-2">zen-owl-unified-config.json</span>
              </div>
              <pre className="whitespace-pre">{syntaxHighlightJSON(unifiedStackConfig)}</pre>
            </div>

            {/* Deploy command */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className={`h-4 w-4 ${tw.textWarning}`} />
                <span className={`text-xs font-semibold ${tw.textWarning}`}>Deploy to System</span>
              </div>
              <div className="relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs overflow-x-auto group">
                <code className="whitespace-nowrap">{deployCmd}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-1 right-1 h-6 px-2 ${tw.textMuted} hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs`}
                  onClick={() => { navigator.clipboard.writeText(deployCmd); showToast("Deploy command copied!"); }}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
              </div>
              <p className={`mt-2 text-xs ${tw.textMuted} ${tw.darkTextMuted}`}>
                <strong>Startup sequence:</strong> Always start OWL-AGENT first, then GoZen. Download JSON then run the deploy command to apply.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <ToastNotification message={toastMessage} visible={toastVisible} type={toastType} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE 4: WebSocket Real-Time Monitoring Dashboard (Enhanced)
   ════════════════════════════════════════════════════════════════════════════ */

function StatusDot({ status }: { status: string }) {
  const color = status === "healthy" ? "bg-cascade-success" : status === "degraded" ? "bg-cascade-warning" : "bg-cascade-error";
  const pulse = status === "healthy";
  return (
    <span className="relative inline-flex">
      {pulse && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-40`} />
      )}
      <span className={`relative inline-block w-2.5 h-2.5 rounded-full ${color} ${status === "degraded" ? "animate-pulse" : ""}`} />
    </span>
  );
}

function MetricCard({ label, value, unit, icon: Icon, color }: { label: string; value: string | number; unit?: string; icon: React.ElementType; color: string }) {
  return (
    <div className={`${tw.bgBg} ${tw.darkBgHoverAlt} rounded-lg p-3 text-center`}>
      <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
      <div className={`text-lg font-bold ${color}`}>{value}{unit && <span className="text-xs font-normal">{unit}</span>}</div>
      <div className={`text-xs ${tw.textMuted} ${tw.darkTextMuted}`}>{label}</div>
    </div>
  );
}

function ProxyDashboard({ proxy }: { proxy: ProxyMonitorState }) {
  const ramPct = proxy.name === "OWL-AGENT" ? (proxy.ram / 120) * 100 : (proxy.ram / 50) * 100;

  return (
    <Card className={`${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusDot status={proxy.status} />
            <CardTitle className={`text-base ${tw.textText} ${tw.darkTextText}`}>{proxy.name}</CardTitle>
            <Badge variant="outline" className="text-xs">:{proxy.port}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {proxy.source && (
              <Badge variant="outline" className={`text-xs ${tw.borderInfo30} ${tw.textInfo} ${tw.darkTextInfo}`}>
                {proxy.source === "websocket" ? <Wifi className="h-3 w-3 mr-1" /> :
                 proxy.source === "http" ? <Monitor className="h-3 w-3 mr-1" /> :
                 <Activity className="h-3 w-3 mr-1" />}
                {proxy.source}
              </Badge>
            )}
            <Badge className={`text-xs ${
              proxy.status === "healthy" ? "bg-cascade-success/10 text-cascade-success dark:bg-cascade-success/20" :
              proxy.status === "degraded" ? `${tw.bgWarning10} ${tw.textWarning}` :
              "bg-cascade-error/10 text-cascade-error"
            }`}>
              {proxy.status.toUpperCase()}
            </Badge>
          </div>
        </div>
        {proxy.lastError && (
          <div className={`flex items-center gap-1 text-xs ${tw.textError} mt-1`}>
            <AlertTriangle className="h-3 w-3" /> {proxy.lastError}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MetricCard label="RAM" value={proxy.ram.toFixed(1)} unit=" MB" icon={Cpu} color={`${tw.textAccent} ${tw.darkTextAccent}`} />
          <MetricCard label="Latency" value={proxy.latencyMs} unit=" ms" icon={Clock} color={`${tw.textInfo} ${tw.darkTextInfo}`} />
          <MetricCard label="Req/min" value={proxy.requestsPerMin} icon={Activity} color={`${tw.textSuccess} ${tw.darkTextSuccess}`} />
          <MetricCard label="Connections" value={proxy.activeConnections} icon={Server} color={`${tw.textHeader} ${tw.darkTextHeader}`} />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`${tw.textMuted} ${tw.darkTextMuted}`}>RAM Usage</span>
            <span className={`font-medium ${tw.textText} ${tw.darkTextText}`}>{proxy.ram.toFixed(1)} / {proxy.name === "OWL-AGENT" ? 120 : 50} MB</span>
          </div>
          <Progress value={ramPct} className="h-2" />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1 ${tw.textMuted} ${tw.darkTextMuted}`}>
            <Radio className="h-3 w-3" /> Uptime: {proxy.uptime}
          </div>
          <div className="flex items-center gap-1">
            <span className={`${tw.textMuted} ${tw.darkTextMuted}`}>Circuit:</span>
            <Badge variant="outline" className={`text-xs ${
              proxy.circuitBreaker === "closed" ? `${tw.borderSuccess30} ${tw.textSuccess}` :
              proxy.circuitBreaker === "half-open" ? `${tw.borderWarning30} ${tw.textWarning}` :
              `${tw.borderError30} ${tw.textError}`
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
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
  const monitoringConnected = useProxyStore((s) => s.monitoringConnected);
  const setMonitoringConnected = useProxyStore((s) => s.setMonitoringConnected);
  const [dataSource, setDataSource] = useState<"websocket" | "http" | "simulated">("simulated");
  const [gozenState, setGozenState] = useState<ProxyMonitorState | null>(null);
  const [owlState, setOwlState] = useState<ProxyMonitorState | null>(null);
  const [logs, setLogs] = useState<RequestLogEntry[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const httpPollRef = useRef<NodeJS.Timeout | null>(null);

  // Initial loading effect
  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Try WebSocket first, fall back to HTTP polling, then simulated
  useEffect(() => {
    const socket = io("/?XTransformPort=3030", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setMonitoringConnected(true);
      setDataSource("websocket");
      setLastUpdate(new Date());
    });

    socket.on("disconnect", () => {
      setMonitoringConnected(false);
    });

    socket.on("proxy:state", (data: { gozen: ProxyMonitorState; owl: ProxyMonitorState }) => {
      setGozenState({ ...data.gozen, source: "websocket" });
      setOwlState({ ...data.owl, source: "websocket" });
      setLastUpdate(new Date());
    });

    socket.on("proxy:logs", (entries: RequestLogEntry[]) => {
      setLogs(entries);
      setLastUpdate(new Date());
    });

    socket.on("proxy:log", (entry: RequestLogEntry) => {
      setLogs((prev) => [entry, ...prev].slice(0, 50));
      setLastUpdate(new Date());
    });

    socketRef.current = socket;

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

          if ((data.gozen && data.gozen.status !== "down") || (data.owl && data.owl.status !== "down")) {
            setDataSource("http");
            setMonitoringConnected(true);
            setLastUpdate(new Date());
          }
        } catch {
          // HTTP failed too, will fall back to simulated
        }
      };

      poll();
      httpPollRef.current = setInterval(poll, 5000);
    };

    const httpTimer = setTimeout(startHttpPolling, 3000);

    return () => {
      socket.disconnect();
      clearTimeout(httpTimer);
      if (httpPollRef.current) clearInterval(httpPollRef.current);
    };
  }, []);

  // Fallback: simulated data if no real connection
  useEffect(() => {
    if (!monitoringConnected && !gozenState) {
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
        setLastUpdate(new Date());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [monitoringConnected, gozenState]);

  return (
    <section ref={ref} id="monitor" className={`py-12 sm:py-20 ${tw.bgBg} ${tw.darkBgBgDark}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className={`text-2xl sm:text-3xl font-bold ${tw.textHeader} ${tw.darkTextHeader}`}>Live Monitoring</h2>
            <div className="flex items-center gap-2">
              {/* Connection status indicator */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                monitoringConnected
                  ? "bg-cascade-success/10 text-cascade-success border border-cascade-success/20"
                  : "bg-cascade-error/10 text-cascade-error border border-cascade-error/20"
              }`}>
                {monitoringConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {monitoringConnected ? "Connected" : "Disconnected"}
              </div>
              <Badge className={`text-xs ${
                dataSource === "websocket" ? "bg-cascade-success/10 text-cascade-success dark:bg-cascade-success/20" :
                dataSource === "http" ? "bg-cascade-info/10 text-cascade-info dark:bg-cascade-info/20" :
                "bg-cascade-warning/10 text-cascade-warning"
              }`}>
                {dataSource === "websocket" ? <Wifi className="h-3 w-3 mr-1" /> :
                 dataSource === "http" ? <Monitor className="h-3 w-3 mr-1" /> :
                 <WifiOff className="h-3 w-3 mr-1" />}
                {dataSource === "websocket" ? "WebSocket" : dataSource === "http" ? "HTTP Polling" : "Simulated"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className={`${tw.textMuted} ${tw.darkTextMuted} text-sm sm:text-base`}>
              Real-time proxy health metrics.{" "}
              {dataSource === "websocket" ? "Live data from WebSocket monitoring service." :
               dataSource === "http" ? "Polling GoZen (:19841/health) and OWL-AGENT (:60000/health) directly." :
               "Simulated data — start GoZen or OWL-AGENT to see live metrics."}
            </p>
            {lastUpdate && (
              <span className={`text-xs ${tw.textMuted} ${tw.darkTextMuted} flex items-center gap-1`}>
                <Clock className="h-3 w-3" />
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        {initialLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 mt-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className={`${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <SkeletonPulse className="h-2.5 w-2.5 rounded-full" />
                    <SkeletonPulse className="h-4 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <SkeletonMetricCard key={j} />
                    ))}
                  </div>
                  <SkeletonPulse className="h-2 w-full mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!initialLoading && (
          <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 mt-6">
            {gozenState && (
              <motion.div variants={variants.staggerItem}>
                <ProxyDashboard proxy={gozenState} />
              </motion.div>
            )}
            {owlState && (
              <motion.div variants={variants.staggerItem}>
                <ProxyDashboard proxy={owlState} />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Combined RAM */}
        {gozenState && owlState && !initialLoading && (
          <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
            <Card className={`${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder} mb-6`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${tw.textHeader} ${tw.darkTextHeader}`}>Combined Stack RAM</span>
                  <span className={`text-sm font-bold ${tw.textAccent} ${tw.darkTextAccent}`}>
                    {(gozenState.ram + owlState.ram).toFixed(1)} MB / 8192 MB ({((gozenState.ram + owlState.ram) / 81.92).toFixed(1)}%)
                  </span>
                </div>
                <Progress value={((gozenState.ram + owlState.ram) / 8192) * 100} className="h-3" />
                <div className={`flex justify-between mt-1 text-xs ${tw.textMuted} ${tw.darkTextMuted}`}>
                  <span>GoZen: {gozenState.ram.toFixed(1)} MB</span>
                  <span>OWL: {owlState.ram.toFixed(1)} MB</span>
                  <span>Available: {(8192 - gozenState.ram - owlState.ram).toFixed(0)} MB</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Request Log */}
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <Card className={`${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm ${tw.textHeader} ${tw.darkTextHeader} flex items-center gap-2`}>
                  <Terminal className="h-4 w-4" /> Request Log
                </CardTitle>
                {logs.length > 0 && (
                  <Badge variant="outline" className="text-xs">{logs.length} entries</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto font-mono text-xs space-y-0">
                {logs.length === 0 && (
                  <div className={`${tw.textMuted} ${tw.darkTextMuted} py-4 text-center`}>
                    Waiting for log entries...
                  </div>
                )}
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log.timestamp}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 py-1.5 px-2 rounded ${
                      i % 2 === 0 ? "bg-transparent" : "bg-muted/30 dark:bg-muted/10"
                    } ${
                      log.status >= 400 ? "bg-cascade-error/5 dark:bg-cascade-error/10" : ""
                    }`}
                  >
                    <span className={`${tw.textMuted} ${tw.darkTextMuted} w-[70px] flex-shrink-0`}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline" className="text-xs w-16 flex-shrink-0 justify-center">
                      {log.proxy}
                    </Badge>
                    <span className={`w-8 text-center font-bold ${log.status >= 400 ? `${tw.textError}` : `${tw.textSuccess}`}`}>
                      {log.status}
                    </span>
                    <span className={`${tw.textMuted} ${tw.darkTextMuted} flex-1 truncate`}>{log.path}</span>
                    <span className={`${tw.textInfo} ${tw.darkTextInfo} w-16 text-right`}>{log.latency}ms</span>
                    <span className={`${tw.textMuted} ${tw.darkTextMuted} w-20 text-right truncate`}>{log.model}</span>
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
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
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
    <section ref={ref} id="component-install" className={`py-12 sm:py-16 ${tw.bgCard} ${tw.darkBgBg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center gap-2 mb-2">
            <Package className={`h-6 w-6 ${tw.textInfo}`} />
            <h2 className={`text-2xl sm:text-3xl font-bold ${tw.textHeader} ${tw.darkTextHeader}`}>Recommended Components</h2>
          </div>
          <p className={`${tw.textMuted} ${tw.darkTextMuted} mb-6 text-sm sm:text-base`}>
            Essential UI components for your proxy management app. One-click install via 21st.dev + shadcn.
          </p>
        </motion.div>

        <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {RECOMMENDED_COMPONENTS.map((comp, i) => (
            <motion.div key={comp.name} variants={variants.staggerItem}>
              <Card className={`${tw.bgCard} ${tw.darkBgCard} border transition-colors ${
                installed.has(comp.name) ? `border-cascade-success/40 dark:border-cascade-success/30` : `${tw.borderBorder} ${tw.darkBorderBorder}`
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${tw.textText} ${tw.darkTextText}`}>{comp.name}</span>
                        {installed.has(comp.name) && (
                          <Badge className="bg-cascade-success/10 text-cascade-success text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Added
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs ${tw.textMuted} ${tw.darkTextMuted} mt-0.5`}>{comp.reason}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="relative bg-[#1a1a2e] dark:bg-[#0d0d1a] text-[#e0e0e0] rounded-lg px-3 py-1.5 font-mono text-xs group">
                        <code className="whitespace-nowrap">{comp.install}</code>
                        <button
                          onClick={() => handleCopy(comp.install, i)}
                          className={`absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#2a2a3e] ${tw.textMuted} hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                          {copiedIdx === i ? <Check className={`h-2.5 w-2.5 ${tw.textSuccess}`} /> : <Copy className="h-2.5 w-2.5" />}
                        </button>
                      </div>
                      <Button
                        size="sm"
                        variant={installed.has(comp.name) ? "outline" : "default"}
                        className={`text-xs ${
                          installed.has(comp.name)
                            ? `${tw.borderSuccess30} ${tw.textSuccess} ${tw.darkTextSuccess}`
                            : `${tw.bgSuccess} ${tw.hoverSuccessDark} text-white`
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
          <motion.div variants={variants.fadeUp} initial="hidden" animate="visible" className="mt-6">
            <Card className="bg-cascade-success/5 border-cascade-success/20 dark:bg-cascade-success/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className={`h-4 w-4 ${tw.textSuccess}`} />
                  <span className={`text-sm font-medium ${tw.textSuccess}`}>{installed.size} component{installed.size > 1 ? "s" : ""} queued for install</span>
                </div>
                <p className={`text-xs ${tw.textMuted} ${tw.darkTextMuted}`}>
                  Run each install command in your project directory. Components will be added to your <code className={`${tw.textInfo}`}>src/components/ui/</code> folder.
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
   FEATURE 6: Run Installation Mode (Enhanced Step-by-Step)
   ════════════════════════════════════════════════════════════════════════════ */

type StepStatus = "pending" | "running" | "success" | "failed" | "skipped";

interface InstallStepState {
  step: InstallStep & { status: StepStatus; output: string[]; startedAt?: number; finishedAt?: number };
}

const STEP_ESTIMATED_TIMES: Record<string, string> = {
  "free -h": "~1s",
  "lsb_release -a": "~1s",
  "which curl": "~1s",
  "curl -fsSL https://raw.githubusercontent.com/dopejs/gozen/main/install.sh | sh": "~8s",
  "zen config add provider": "~3s",
  "zen config add profile": "~3s",
  "zen": "~4s",
  "zen daemon status": "~2s",
  "export ANTHROPIC_BASE_URL=http://localhost:19841 && claude": "~3s",
  "zen daemon enable": "~2s",
  "zen web": "~2s",
  "sudo apt update && sudo apt install -y python3 python3-venv python3-pip git": "~15s",
  "git clone https://github.com/marktantongco/owl-agent-free-ai-proxy-gateway.git": "~6s",
  "bash install_owl_unified.sh": "~10s",
  "curl http://127.0.0.1:60000/health": "~2s",
  "export OWL_ENABLE_MESH=true": "~1s",
  "sudo systemctl restart owl-forward-proxy": "~3s",
  "export OWL_ALLOW_EXTRA": "~1s",
};

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
  for (const [key, value] of Object.entries(TERMINAL_LINES)) {
    if (command.includes(key) || key.includes(command.split(" ")[0])) {
      return value;
    }
  }
  return ["Command executed successfully."];
}

function getEstimatedTime(command: string): string {
  for (const [key, value] of Object.entries(STEP_ESTIMATED_TIMES)) {
    if (command.includes(key) || key.includes(command.split(" ")[0])) {
      return value;
    }
  }
  return "~3s";
}

export function InstallationRunner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
  const installRunning = useProxyStore((s) => s.installRunning);
  const setInstallRunning = useProxyStore((s) => s.setInstallRunning);
  const completedSteps = useProxyStore((s) => s.completedSteps);
  const toggleStep = useProxyStore((s) => s.toggleStep);
  const resetSteps = useProxyStore((s) => s.resetSteps);
  const [mode, setMode] = useState<"gozen" | "owl">("gozen");
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState<InstallStepState["step"][]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [showOutput, setShowOutput] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  const allSteps = mode === "gozen" ? gozenInstallSteps : owlInstallSteps;

  // Initialize steps
  useEffect(() => {
    setSteps(allSteps.map((s) => ({ ...s, status: "pending" as StepStatus, output: [] })));
    setCurrentStepIdx(-1);
    setInstallRunning(false);
    setIsPaused(false);
  }, [mode, allSteps, setInstallRunning]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [steps]);

  const runStep = useCallback(async (idx: number) => {
    if (idx >= steps.length) {
      setInstallRunning(false);
      return;
    }

    setCurrentStepIdx(idx);
    setSteps((prev) => prev.map((s, i) => i === idx ? { ...s, status: "running" as StepStatus, startedAt: Date.now() } : s));

    const output = getTerminalOutput(steps[idx]?.command || "");
    for (let lineIdx = 0; lineIdx < output.length; lineIdx++) {
      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
      setSteps((prev) => prev.map((s, i) =>
        i === idx ? { ...s, output: [...s.output, output[lineIdx]] } : s
      ));
    }

    const success = Math.random() > 0.05;
    setSteps((prev) => prev.map((s, i) =>
      i === idx ? { ...s, status: (success ? "success" : "failed") as StepStatus, finishedAt: Date.now() } : s
    ));

    if (success) {
      // Track completed step in global store
      const stepNum = steps[idx]?.step;
      if (stepNum && !completedSteps.includes(stepNum)) {
        toggleStep(stepNum);
      }
    }

    if (success && idx < steps.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStep(idx + 1);
    } else {
      setInstallRunning(false);
      if (!success) {
        setToastMessage(`Step ${steps[idx]?.step} failed! Check output for details.`);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      } else if (idx === steps.length - 1) {
        setToastMessage("Installation complete! All steps succeeded.");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      }
    }
  }, [steps, completedSteps, toggleStep, setInstallRunning]);

  const handleStart = useCallback(() => {
    setInstallRunning(true);
    setIsPaused(false);
    setSteps(allSteps.map((s) => ({ ...s, status: "pending" as StepStatus, output: [] })));
    setTimeout(() => runStep(0), 300);
  }, [allSteps, runStep, setInstallRunning]);

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleReset = useCallback(() => {
    setInstallRunning(false);
    setIsPaused(false);
    setCurrentStepIdx(-1);
    setSteps(allSteps.map((s) => ({ ...s, status: "pending" as StepStatus, output: [] })));
    setShowOutput(null);
    resetSteps();
  }, [allSteps, setInstallRunning, resetSteps]);

  const completedCount = steps.filter((s) => s.status === "success").length;
  const failedCount = steps.filter((s) => s.status === "failed").length;
  const progressPct = steps.length > 0 ? ((completedCount + failedCount) / steps.length) * 100 : 0;

  const statusIcon = (status: StepStatus) => {
    switch (status) {
      case "success": return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 15 }}>
          <CheckCircle2 className={`h-5 w-5 ${tw.textSuccess}`} />
        </motion.div>
      );
      case "failed": return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 15 }}>
          <XCircle className={`h-5 w-5 ${tw.textError}`} />
        </motion.div>
      );
      case "running": return <RefreshCw className={`h-5 w-5 ${tw.textInfo} animate-spin`} />;
      case "skipped": return <ChevronRight className={`h-5 w-5 ${tw.textMuted}`} />;
      default: return <div className={`h-5 w-5 rounded-full border-2 ${tw.borderBorder} ${tw.darkBorderBorder}`} />;
    }
  };

  return (
    <>
      <section ref={ref} id="install-runner" className={`py-12 sm:py-20 ${tw.bgBg} ${tw.darkBgBgDark}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className={`h-6 w-6 ${tw.textHeader} ${tw.darkTextHeader}`} />
              <h2 className={`text-2xl sm:text-3xl font-bold ${tw.textHeader} ${tw.darkTextHeader}`}>Run Installation</h2>
            </div>
            <p className={`${tw.textMuted} ${tw.darkTextMuted} mb-6 text-sm sm:text-base`}>
              Step-by-step installation with live status tracking. Simulates terminal output for each command.
            </p>
          </motion.div>

          <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
            {/* Mode Tabs */}
            <div className="flex gap-3 mb-6">
              <Button
                variant={mode === "gozen" ? "default" : "outline"}
                className={mode === "gozen" ? `${tw.btnPrimary}` : `${tw.borderBorder} ${tw.darkBorderBorder}`}
                onClick={() => { setMode("gozen"); handleReset(); }}
              >
                GoZen (Steps 1-11)
              </Button>
              <Button
                variant={mode === "owl" ? "default" : "outline"}
                className={mode === "owl" ? `${tw.btnPrimary}` : `${tw.borderBorder} ${tw.darkBorderBorder}`}
                onClick={() => { setMode("owl"); handleReset(); }}
              >
                OWL-AGENT (Steps 12-16)
              </Button>
            </div>

            {/* Progress Bar */}
            <Card className={`${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder} mb-4`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${tw.textHeader} ${tw.darkTextHeader}`}>
                    {completedCount}/{steps.length} steps completed
                    {failedCount > 0 && <span className={`${tw.textError} ml-2`}>({failedCount} failed)</span>}
                    {completedSteps.length > 0 && !installRunning && (
                      <span className={`text-xs ${tw.textMuted} ${tw.darkTextMuted} ml-2`}>
                        ({completedSteps.length} total across runs)
                      </span>
                    )}
                  </span>
                  <span className={`text-sm font-bold ${tw.textAccent} ${tw.darkTextAccent}`}>{Math.round(progressPct)}%</span>
                </div>
                <Progress value={progressPct} className="h-3" />
              </CardContent>
            </Card>

            {/* Control Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleStart}
                disabled={installRunning}
                className={`${tw.bgSuccess} ${tw.hoverSuccessDark} text-white h-11 px-6 text-sm font-semibold shadow-lg shadow-cascade-success/20`}
              >
                <Play className="h-5 w-5 mr-2" /> Run Installation
              </Button>
              <Button
                variant="outline"
                onClick={handlePause}
                disabled={!installRunning}
                className={`${tw.borderBorder} ${tw.darkBorderBorder}`}
              >
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className={`${tw.borderBorder} ${tw.darkBorderBorder}`}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reset All
              </Button>
            </div>

            {/* Step List + Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Steps */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={reduced ? { duration: 0 } : { delay: i * 0.03 }}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      i === currentStepIdx ? `bg-cascade-info/5 dark:bg-cascade-info/10 border border-cascade-info/20` :
                      step.status === "success" ? "bg-cascade-success/5" :
                      step.status === "failed" ? "bg-cascade-error/5" :
                      `${tw.bgCard} ${tw.darkBgCard} border ${tw.borderBorder} ${tw.darkBorderBorder}`
                    }`}
                    onClick={() => setShowOutput(showOutput === i ? null : i)}
                  >
                    {/* Step Number */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      step.status === "success" ? "bg-cascade-success/20 border-cascade-success text-cascade-success" :
                      step.status === "failed" ? "bg-cascade-error/20 border-cascade-error text-cascade-error" :
                      step.status === "running" ? "bg-cascade-info/20 border-cascade-info text-cascade-info" :
                      `border-border text-muted-foreground`
                    }`}>
                      {step.status === "success" ? <Check className="h-3.5 w-3.5" /> :
                       step.status === "failed" ? <XCircle className="h-3.5 w-3.5" /> :
                       step.status === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                       step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${tw.textText} ${tw.darkTextText}`}>{step.title}</span>
                        <span className={`text-[10px] font-mono ${tw.textMuted} ${tw.darkTextMuted} flex items-center gap-0.5`}>
                          <Timer className="h-2.5 w-2.5" /> {getEstimatedTime(step.command)}
                        </span>
                      </div>
                      <div className={`mt-1 font-mono text-xs ${tw.textAccent} ${tw.darkTextAccent} truncate`}>
                        {step.command}
                      </div>
                      {step.status !== "pending" && (
                        <div className={`text-xs ${tw.textMuted} ${tw.darkTextMuted} mt-0.5`}>{step.explanation}</div>
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
                      <span className={`text-xs ${tw.textMuted} ${tw.darkTextMuted} flex-shrink-0`}>
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
                    <span className="text-xs text-white/40 ml-2">terminal — {mode}</span>
                    {installRunning && <RefreshCw className="h-3 w-3 text-cascade-info animate-spin ml-auto" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div ref={terminalRef} className="min-h-[400px] max-h-[400px] overflow-y-auto font-mono text-xs text-[#e0e0e0] space-y-1">
                    {steps.filter((s) => s.output.length > 0 || s.status === "running").map((step) => (
                      <div key={step.step}>
                        <div className={`flex items-center gap-2 py-1 ${
                          step.status === "running" ? "text-cascade-info" :
                          step.status === "success" ? "text-cascade-success" :
                          step.status === "failed" ? "text-cascade-error" :
                          "text-white/40"
                        }`}>
                          <span className="text-white/40">$</span>
                          <span>{step.command.length > 60 ? step.command.substring(0, 60) + "..." : step.command}</span>
                        </div>
                        {step.output.map((line, li) => (
                          <div key={li} className="pl-4 text-[#c0c0c0]">{line}</div>
                        ))}
                        {step.status === "running" && (
                          <div className="pl-4 text-cascade-info animate-pulse">▌</div>
                        )}
                      </div>
                    ))}
                    {!installRunning && steps.every((s) => s.status === "pending") && (
                      <div className="text-white/40 py-8 text-center">
                        <Terminal className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p>Click &quot;Run Installation&quot; to begin</p>
                        <p className="text-xs mt-1">Terminal output will appear here</p>
                      </div>
                    )}
                    {completedCount === steps.length && steps.length > 0 && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 15 }}
                        className="text-cascade-success py-4 text-center font-semibold"
                      >
                        <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                        Installation Complete!
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
      <ToastNotification message={toastMessage} visible={toastVisible} type={toastVisible && failedCount > 0 ? "error" : "success"} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Live Proxy Repo Metrics
   ════════════════════════════════════════════════════════════════════════════ */

type SortKey = "healthScore" | "stars" | "lastCommitDaysAgo" | "name";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "healthScore", label: "Health Score" },
  { key: "stars", label: "Stars" },
  { key: "lastCommitDaysAgo", label: "Last Commit" },
  { key: "name", label: "Name" },
];

function healthColor(score: number): string {
  if (score >= 80) return "text-cascade-success";
  if (score >= 60) return "text-cascade-info";
  if (score >= 40) return "text-cascade-warning";
  return "text-cascade-error";
}

function healthBg(score: number): string {
  if (score >= 80) return "bg-cascade-success/10 border-cascade-success/30";
  if (score >= 60) return "bg-cascade-info/10 border-cascade-info/30";
  if (score >= 40) return "bg-cascade-warning/10 border-cascade-warning/30";
  return "bg-cascade-error/10 border-cascade-error/30";
}

function sourceBadgeColor(source: string): string {
  if (source === "live") return "bg-cascade-success/15 text-cascade-success border-cascade-success/30";
  if (source === "cached") return "bg-cascade-info/15 text-cascade-info border-cascade-info/30";
  return "bg-cascade-warning/15 text-cascade-warning border-cascade-warning/30";
}

function formatDaysAgo(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function RepoMetricCard({ repo, index }: { repo: RepoMetrics; index: number }) {
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
  return (
    <motion.div variants={variants.staggerItem}>
      <Card className={`h-full border ${repo.isArchived ? "border-cascade-error/40 bg-cascade-error/5" : tw.borderBorder} ${tw.bgCard} transition-shadow hover:shadow-md`}>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-bold text-foreground truncate">{repo.name}</CardTitle>
            {repo.isArchived && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-cascade-error/10 text-cascade-error border-cascade-error/30 shrink-0">
                <Archive className="h-3 w-3 mr-0.5" />
                Archived
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-2.5">
          {/* Health Score */}
          <div className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 ${healthBg(repo.healthScore)}`}>
            <div className="flex items-center gap-1.5">
              <Activity className={`h-3.5 w-3.5 ${healthColor(repo.healthScore)}`} />
              <span className="text-xs font-medium text-muted-foreground">Health</span>
            </div>
            <span className={`text-sm font-bold ${healthColor(repo.healthScore)}`}>{repo.healthScore}</span>
          </div>

          {/* Stars & Forks */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 text-cascade-warning" />
              <span className="text-foreground font-medium">{repo.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <GitFork className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground font-medium">{repo.forks}</span>
            </div>
          </div>

          {/* Last Commit */}
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground">{formatDaysAgo(repo.lastCommitDaysAgo)}</span>
          </div>

          {/* Language & License */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/50 text-muted-foreground border-border">
              {repo.language}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/50 text-muted-foreground border-border">
              {repo.license}
            </Badge>
          </div>

          {/* Issues & Contributors */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <span>{repo.openIssues} issues</span>
            <span>{repo.contributors} contributors</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LiveMetricsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("healthScore");
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/proxy-metrics");
      if (res.ok) {
        const data: MetricsResponse = await res.json();
        setMetrics(data);
      }
    } catch {
      // Silently fail — UI shows loading skeleton
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const sortedRepos = metrics
    ? [...metrics.repos].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "lastCommitDaysAgo") return a.lastCommitDaysAgo - b.lastCommitDaysAgo;
        // For numeric fields (healthScore, stars), sort descending
        const aVal = a[sortBy] as number;
        const bVal = b[sortBy] as number;
        return bVal - aVal;
      })
    : [];

  return (
    <section id="live-metrics" ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Live Proxy Repo Metrics</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">Real-time GitHub data for all 10 proxy repositories</p>
        </motion.div>

        {/* Controls Row */}
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center gap-3 flex-wrap">
            {/* Source indicator */}
            {metrics && (
              <Badge variant="outline" className={`text-xs px-2.5 py-1 ${sourceBadgeColor(metrics.source)}`}>
                {metrics.source === "live" && "● Live"}
                {metrics.source === "cached" && "● Cached"}
                {metrics.source === "fallback" && "● Fallback"}
              </Badge>
            )}
            {metrics && (
              <span className="text-xs text-muted-foreground">
                Updated {new Date(metrics.fetchedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort toggle */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5 border border-border">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    sortBy === opt.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchMetrics(true)}
              disabled={refreshing}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Card Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className={`${tw.bgCard} border ${tw.borderBorder}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="animate-pulse bg-muted/40 rounded h-4 w-2/3" />
                  <div className="animate-pulse bg-muted/40 rounded h-8 w-full" />
                  <div className="animate-pulse bg-muted/40 rounded h-3 w-1/2" />
                  <div className="animate-pulse bg-muted/40 rounded h-3 w-3/4" />
                  <div className="animate-pulse bg-muted/40 rounded h-3 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={variants.staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {sortedRepos.map((repo, i) => (
              <RepoMetricCard key={repo.name} repo={repo} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
