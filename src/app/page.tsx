"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Shield, Zap, Server, CheckCircle2, XCircle, ChevronDown,
  Copy, Check, ArrowDown, Cpu, HardDrive, BarChart3, Globe,
  Terminal, BookOpen, Layers, Star, AlertTriangle, Radio,
  Menu, X, ExternalLink, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  rankedProxies, deepDives, comparisonFeatures, synergyCombos,
  gozenInstallSteps, owlInstallSteps, verificationChecklist as initialChecklist,
  decisionTree, ramImpact, unifiedStackConfig, startupSequence, scoringWeights,
  type ProxyRepo, type ProxyDeepDive, type ChecklistItem
} from "@/lib/proxy-data";
import { DarkModeToggle, ComponentSearchSection, ConfigExportSection, MonitoringSection } from "@/components/new-sections";

/* ──────────────── ANIMATION PRESETS (framer-motion-animator) ──────────────── */

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

/* ──────────────── DESIGN TOKENS (ui-ux-pro-max cascade palette) ──────────── */

const palette = {
  bg: "bg-[#f6f6f6]",
  card: "bg-white",
  header: "text-[#6b634d]",
  accent: "text-[#92751f]",
  accent2: "text-[#5a36c3]",
  coverBlock: "text-[#8b7d53]",
  muted: "text-[#86837c]",
  success: "text-[#3f7450] bg-[#3f7450]/10",
  warning: "text-[#ae8d4a] bg-[#ae8d4a]/10",
  error: "text-[#8b4e49] bg-[#8b4e49]/10",
  info: "text-[#537ba4] bg-[#537ba4]/10",
  border: "border-[#d6d1c2]",
  btnPrimary: "bg-[#6b634d] hover:bg-[#5a5540] text-white",
  btnAccent: "bg-[#92751f] hover:bg-[#7a6119] text-white",
};

/* ──────────────── HELPER: Score Color ────────────────────────────────────── */

function scoreColor(score: number) {
  if (score >= 9) return "text-[#3f7450]";
  if (score >= 7.5) return "text-[#537ba4]";
  if (score >= 6.5) return "text-[#ae8d4a]";
  return "text-[#8b4e49]";
}

function scoreBg(score: number) {
  if (score >= 9) return "bg-[#3f7450]/10 border-[#3f7450]/30";
  if (score >= 7.5) return "bg-[#537ba4]/10 border-[#537ba4]/30";
  if (score >= 6.5) return "bg-[#ae8d4a]/10 border-[#ae8d4a]/30";
  return "bg-[#8b4e49]/10 border-[#8b4e49]/30";
}

/* ──────────────── COPY BUTTON HOOK ──────────────────────────────────────── */

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  return { copied, copy };
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Hero
   ════════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#f6f6f6] dark:bg-[#1a1a1e]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#92751f]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5a36c3]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6b634d]/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div variants={staggerItem}>
          <Badge className="mb-4 bg-[#92751f]/10 text-[#92751f] border-[#92751f]/20 text-xs sm:text-sm px-3 py-1">
            SMP v5.1 Protocol — 8 GB RAM Ubuntu
          </Badge>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#151513] dark:text-[#e8e6e1] leading-tight tracking-tight"
        >
          Comprehensive Proxy
          <br />
          <span className="text-[#92751f] dark:text-[#ae964d]">Analysis & Guide</span>
        </motion.h1>

        <motion.p variants={staggerItem} className="mt-4 sm:mt-6 text-base sm:text-lg text-[#86837c] max-w-2xl mx-auto leading-relaxed">
          10 open-source AI proxies ranked, deep-dived, and compared.
          Interactive installation guide for your 8 GB RAM Ubuntu system.
        </motion.p>

        {/* Key Stats */}
        <motion.div
          variants={staggerContainer}
          className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto"
        >
          {[
            { value: "9.4", label: "GoZen", sub: "#1 Overall" },
            { value: "8.7", label: "routatic", sub: "#2 macOS" },
            { value: "7.7", label: "OWL-AGENT", sub: "#3 Hardware" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={staggerItem} className="text-center">
              <div className={`text-2xl sm:text-4xl font-bold ${scoreColor(parseFloat(stat.value))}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#6b634d] mt-1">{stat.label}</div>
              <div className="text-xs text-[#86837c]">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={staggerItem} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button className={`${palette.btnPrimary} rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base`} onClick={() => document.getElementById("ranked")?.scrollIntoView({ behavior: "smooth" })}>
            View Rankings <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className={`${palette.border} rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base`} onClick={() => document.getElementById("install")?.scrollIntoView({ behavior: "smooth" })}>
            Installation Guide <Terminal className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Best Synergy Badge */}
        <motion.div variants={staggerItem} className="mt-8">
          <div className="inline-flex items-center gap-2 bg-[#3f7450]/10 border border-[#3f7450]/20 rounded-full px-4 py-2 text-sm">
            <Star className="h-4 w-4 text-[#3f7450]" />
            <span className="text-[#3f7450] font-medium">Best Synergy: GoZen + OWL-AGENT — 9.2/10</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 text-[#86837c]" />
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Scoring Methodology
   ════════════════════════════════════════════════════════════════════════════ */

function MethodologySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Scoring Methodology</h2>
          <p className="text-[#86837c] mb-8 text-sm sm:text-base">Weighted criteria optimized for resource-constrained 8 GB RAM systems</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
          {scoringWeights.map((w) => (
            <motion.div key={w.criterion} variants={staggerItem}>
              <Card className={`${palette.card} border ${palette.border} h-full`}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#92751f]">{w.weight}%</div>
                  <div className="text-sm font-semibold text-[#6b634d] mt-1">{w.criterion}</div>
                  <div className="text-xs text-[#86837c] mt-1">{w.description}</div>
                  <Progress value={w.weight} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Ranked Table
   ════════════════════════════════════════════════════════════════════════════ */

function RankedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="ranked" ref={ref} className="py-12 sm:py-20 bg-[#f6f6f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">All 10 Proxies Ranked</h2>
          <p className="text-[#86837c] mb-8 text-sm sm:text-base">Click any proxy to see details. Weighted scoring: Memory 40%, Features 25%, Maintenance 15%, Setup 10%, Unique Value 10%</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {rankedProxies.map((proxy) => (
            <motion.div key={proxy.name} variants={staggerItem}>
              <Card
                className={`${palette.card} border ${palette.border} cursor-pointer transition-shadow hover:shadow-md`}
                onClick={() => setExpanded(expanded === proxy.rank ? null : proxy.rank)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${scoreBg(proxy.score)}`}>
                        <span className={scoreColor(proxy.score)}>{proxy.rank}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#151513] text-sm sm:text-base">{proxy.name}</span>
                          <Badge variant="outline" className="text-xs">{proxy.language}</Badge>
                          <Badge variant="outline" className="text-xs border-[#3f7450]/30 text-[#3f7450]">{proxy.estRam}</Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-[#86837c] mt-0.5 truncate">{proxy.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xl sm:text-2xl font-bold ${scoreColor(proxy.score)}`}>{proxy.score}</span>
                      <ChevronDown className={`h-5 w-5 text-[#86837c] transition-transform ${expanded === proxy.rank ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === proxy.rank && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <Separator className="my-3 bg-[#d6d1c2]" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="text-center p-2 rounded-lg bg-[#f6f6f6]">
                            <div className="text-lg font-bold text-[#92751f]">{proxy.features}/10</div>
                            <div className="text-xs text-[#86837c]">Features</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[#f6f6f6]">
                            <div className="text-lg font-bold text-[#537ba4]">{proxy.maintenance}/10</div>
                            <div className="text-xs text-[#86837c]">Maintenance</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[#f6f6f6]">
                            <div className="text-lg font-bold text-[#3f7450]">{proxy.setup}/10</div>
                            <div className="text-xs text-[#86837c]">Setup</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-[#f6f6f6]">
                            <div className="text-lg font-bold text-[#6b634d]">{proxy.estRam}</div>
                            <div className="text-xs text-[#86837c]">Est. RAM</div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-[#6b634d]">
                          <strong>Unique Value:</strong> {proxy.uniqueValue}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Deep Dives
   ════════════════════════════════════════════════════════════════════════════ */

function DeepDiveCard({ dive }: { dive: ProxyDeepDive }) {
  const [activeTab, setActiveTab] = useState("features");
  const { copied, copy } = useCopy();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
      <Card className={`${palette.card} border ${palette.border} overflow-hidden`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-[#f6f6f6] to-white">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl text-[#6b634d]">{dive.name}</CardTitle>
              <CardDescription className="text-[#92751f] font-medium">{dive.tagline}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-[#f6f6f6] h-auto">
              <TabsTrigger value="features" className="text-xs sm:text-sm py-2">Features</TabsTrigger>
              <TabsTrigger value="architecture" className="text-xs sm:text-sm py-2">Architecture</TabsTrigger>
              <TabsTrigger value="ram" className="text-xs sm:text-sm py-2">RAM</TabsTrigger>
              <TabsTrigger value="pros-cons" className="text-xs sm:text-sm py-2">Pros/Cons</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-4">
              <div className="space-y-2">
                {dive.features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 p-2 rounded-lg hover:bg-[#f6f6f6] transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#3f7450] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-sm text-[#151513]">{f.title}:</span>{" "}
                      <span className="text-sm text-[#86837c]">{f.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-[#86837c] mb-1">Quick Install:</p>
                <div className="relative bg-[#1a1a2e] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs sm:text-sm overflow-x-auto">
                  <code>{dive.installCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-7 w-7 p-0 text-[#86837c] hover:text-white"
                    onClick={(e) => { e.stopPropagation(); copy(dive.installCmd); }}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="mt-4">
              <p className="text-sm text-[#151513] leading-relaxed">{dive.architecture}</p>
            </TabsContent>

            <TabsContent value="ram" className="mt-4">
              <div className="flex items-start gap-3 mb-4">
                <Cpu className="h-5 w-5 text-[#92751f] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#151513] leading-relaxed">{dive.ramDetail}</p>
              </div>
              <div className="bg-[#f6f6f6] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-[#6b634d]" />
                  <span className="text-sm font-medium text-[#6b634d]">Memory Footprint</span>
                </div>
                <div className="w-full bg-[#d6d1c2] rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: dive.name === "OWL-AGENT" ? "65%" : "25%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${dive.name === "OWL-AGENT" ? "bg-[#ae8d4a]" : "bg-[#3f7450]"}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#86837c] mt-1">
                  <span>0 MB</span>
                  <span>{dive.name === "OWL-AGENT" ? "120 MB" : "50 MB"}</span>
                  <span>400 MB</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pros-cons" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#3f7450] mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Pros
                  </h4>
                  <ul className="space-y-1.5">
                    {dive.pros.map((p) => (
                      <li key={p} className="text-xs sm:text-sm text-[#151513] flex gap-2">
                        <span className="text-[#3f7450]">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#8b4e49] mb-2 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Cons
                  </h4>
                  <ul className="space-y-1.5">
                    {dive.cons.map((c) => (
                      <li key={c} className="text-xs sm:text-sm text-[#151513] flex gap-2">
                        <span className="text-[#8b4e49]">-</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DeepDivesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Deep Dives: Top 3 Proxies</h2>
          <p className="text-[#86837c] mb-8 text-sm sm:text-base">Full architecture, features, RAM analysis, and honest limitations</p>
        </motion.div>
        <div className="space-y-6">
          {deepDives.map((dive) => (
            <DeepDiveCard key={dive.name} dive={dive} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Comparison Matrix
   ════════════════════════════════════════════════════════════════════════════ */

function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [highlight, setHighlight] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-[#f6f6f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Feature Comparison</h2>
          <p className="text-[#86837c] mb-6 text-sm sm:text-base">GoZen vs routatic-proxy vs OWL-AGENT — tap a row to highlight</p>
        </motion.div>

        <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#6b634d] text-white">
                <th className="p-3 text-left rounded-tl-lg font-medium">Feature</th>
                <th className="p-3 text-center font-medium">GoZen</th>
                <th className="p-3 text-center font-medium">routatic</th>
                <th className="p-3 text-center rounded-tr-lg font-medium">OWL-AGENT</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, i) => {
                const isHl = highlight === row.feature;
                return (
                  <tr
                    key={row.feature}
                    onClick={() => setHighlight(isHl ? null : row.feature)}
                    className={`cursor-pointer transition-colors border-b border-[#d6d1c2]/50 ${isHl ? "bg-[#92751f]/10" : i % 2 === 0 ? "bg-white" : "bg-[#f6f6f6]"} hover:bg-[#92751f]/5`}
                  >
                    <td className="p-2 sm:p-3 font-medium text-[#6b634d] text-xs sm:text-sm">{row.feature}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {row.gozen === "Yes" || row.gozen.startsWith("Yes") ? (
                        <span className="text-[#3f7450] font-medium">{row.gozen}</span>
                      ) : row.gozen === "No" ? (
                        <span className="text-[#8b4e49]">{row.gozen}</span>
                      ) : (
                        <span className="text-[#537ba4]">{row.gozen}</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {row.routatic === "Yes" || row.routatic.startsWith("Yes") ? (
                        <span className="text-[#3f7450] font-medium">{row.routatic}</span>
                      ) : row.routatic === "No" ? (
                        <span className="text-[#8b4e49]">{row.routatic}</span>
                      ) : (
                        <span className="text-[#537ba4]">{row.routatic}</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {row.owl === "Yes" || row.owl.startsWith("Yes") ? (
                        <span className="text-[#3f7450] font-medium">{row.owl}</span>
                      ) : row.owl === "No" ? (
                        <span className="text-[#8b4e49]">{row.owl}</span>
                      ) : (
                        <span className="text-[#537ba4]">{row.owl}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Synergy Assessment
   ════════════════════════════════════════════════════════════════════════════ */

function SynergySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Synergy Assessment</h2>
          <p className="text-[#86837c] mb-8 text-sm sm:text-base">Which stack combination delivers the best combined value?</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-4">
          {synergyCombos.map((combo, i) => (
            <motion.div key={combo.combo} variants={staggerItem}>
              <Card className={`${palette.card} border ${i === 0 ? "border-[#3f7450]/40 bg-[#3f7450]/5" : palette.border}`}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {i === 0 && <Star className="h-5 w-5 text-[#3f7450]" />}
                      {i === 1 && <AlertTriangle className="h-5 w-5 text-[#ae8d4a]" />}
                      {i === 2 && <Zap className="h-5 w-5 text-[#537ba4]" />}
                      <span className="font-semibold text-[#151513] text-sm sm:text-base">{combo.combo}</span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-bold ${i === 0 ? "text-[#3f7450]" : i === 1 ? "text-[#ae8d4a]" : "text-[#537ba4]"}`}>
                      {combo.score}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#86837c] mt-2">{combo.assessment}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Why GoZen + OWL-AGENT */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
          <Card className="border-[#3f7450]/30 bg-[#3f7450]/5">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-[#3f7450] mb-3">Why GoZen + OWL-AGENT Wins</h3>
              <div className="space-y-3 text-sm text-[#151513] leading-relaxed">
                <p>GoZen provides the feature breadth (scenario routing, budget controls, Web UI, context compression, Bot Gateway) that OWL-AGENT lacks, while OWL-AGENT provides the security (SSRF allowlist) and proactive resilience (predictive circuit breaker, mesh health) that GoZen lacks.</p>
                <p>When layered together, GoZen acts as the primary proxy handling request routing, failover, and management, while OWL-AGENT acts as a security and observability layer between GoZen and upstream providers. Combined RAM: <strong>110-170 MB</strong> (~2.1% of 8 GB).</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#3f7450]">
                <Layers className="h-4 w-4" />
                <span>Request flow: Claude Code → GoZen (19841) → OWL-AGENT (60000) → Upstream</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Installation Guide
   ════════════════════════════════════════════════════════════════════════════ */

function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="relative bg-[#1a1a2e] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs sm:text-sm overflow-x-auto group">
      <code className="whitespace-pre-wrap break-all">{code}</code>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-1 right-1 h-7 w-7 p-0 text-[#86837c] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(code)}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-[#3f7450]" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

function InstallStepCard({ step, accentColor }: { step: { step: number; title: string; command: string; explanation: string }; accentColor: string }) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${accentColor}`}>
        {step.step}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[#151513] text-sm">{step.title}</h4>
        <CodeBlock code={step.command} />
        <p className="text-xs text-[#86837c] mt-1.5">{step.explanation}</p>
      </div>
    </div>
  );
}

function InstallSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeGuide, setActiveGuide] = useState<"gozen" | "owl">("gozen");
  const { copied: configCopied, copy: configCopy } = useCopy();

  return (
    <section id="install" ref={ref} className="py-12 sm:py-20 bg-[#f6f6f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Step-by-Step Installation</h2>
          <p className="text-[#86837c] mb-6 text-sm sm:text-base">Copy-paste commands for your 8 GB RAM Ubuntu system</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <Tabs value={activeGuide} onValueChange={(v) => setActiveGuide(v as "gozen" | "owl")}>
            <TabsList className="grid w-full grid-cols-2 bg-white border border-[#d6d1c2] h-auto mb-6">
              <TabsTrigger value="gozen" className="py-2.5 text-sm">GoZen (Primary)</TabsTrigger>
              <TabsTrigger value="owl" className="py-2.5 text-sm">OWL-AGENT (Secondary)</TabsTrigger>
            </TabsList>

            <TabsContent value="gozen" className="space-y-4">
              {gozenInstallSteps.map((step) => (
                <InstallStepCard key={step.step} step={step} accentColor="bg-[#6b634d]" />
              ))}
            </TabsContent>

            <TabsContent value="owl" className="space-y-4">
              {owlInstallSteps.map((step) => (
                <InstallStepCard key={step.step} step={step} accentColor="bg-[#5a36c3]" />
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Unified Stack Config */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-10">
          <Card className="border-[#3f7450]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg text-[#3f7450] flex items-center gap-2">
                <Layers className="h-5 w-5" /> Unified Stack Configuration
              </CardTitle>
              <CardDescription>GoZen → OWL-AGENT → Upstream wiring in ~/.zen/zen.json</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <CodeBlock code={unifiedStackConfig} />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-[#86837c] font-medium">STARTUP SEQUENCE (always start OWL-AGENT first):</p>
                {startupSequence.map((s) => (
                  <div key={s.step} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs flex-shrink-0">Step {s.step}</Badge>
                    <div>
                      <code className="text-xs bg-[#1a1a2e] text-[#e0e0e0] px-1.5 py-0.5 rounded">{s.cmd}</code>
                      <p className="text-xs text-[#86837c] mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RAM Impact Table */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
          <Card className={`${palette.card} border ${palette.border}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg text-[#6b634d] flex items-center gap-2">
                <Cpu className="h-5 w-5" /> Combined Stack RAM Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ramImpact.map((item) => (
                  <div key={item.component} className="flex items-center justify-between p-3 rounded-lg bg-[#f6f6f6]">
                    <div>
                      <div className="text-sm font-medium text-[#151513]">{item.component}</div>
                      <div className="text-xs text-[#86837c]">{item.purpose}</div>
                    </div>
                    <Badge variant="outline" className="text-sm font-bold border-[#92751f]/30 text-[#92751f]">{item.ram}</Badge>
                  </div>
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
   SECTION: Decision Tree
   ════════════════════════════════════════════════════════════════════════════ */

function DecisionTreeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [answers, setAnswers] = useState<Record<number, "yes" | "no">>({});

  const toggle = (idx: number, val: "yes" | "no") => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (next[idx] === val) {
        delete next[idx];
      } else {
        next[idx] = val;
      }
      return next;
    });
  };

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Decision Tree</h2>
          <p className="text-[#86837c] mb-8 text-sm sm:text-base">Answer questions to find the right proxy configuration for your needs</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {decisionTree.map((node, i) => {
            const selected = answers[i];
            return (
              <motion.div key={i} variants={staggerItem}>
                <Card className={`${palette.card} border ${palette.border}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-[#92751f] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base text-[#151513]">{node.question}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Button
                            size="sm"
                            variant={selected === "yes" ? "default" : "outline"}
                            className={selected === "yes" ? `${palette.btnPrimary} text-xs` : `${palette.border} text-xs`}
                            onClick={() => toggle(i, "yes")}
                          >
                            YES
                          </Button>
                          <Button
                            size="sm"
                            variant={selected === "no" ? "default" : "outline"}
                            className={selected === "no" ? "bg-[#5a36c3] hover:bg-[#4a2da3] text-white text-xs" : `${palette.border} text-xs`}
                            onClick={() => toggle(i, "no")}
                          >
                            NO
                          </Button>
                        </div>
                        <AnimatePresence>
                          {selected && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="mt-2 p-2 rounded-lg bg-[#f6f6f6] text-xs sm:text-sm"
                            >
                              <span className="font-medium text-[#92751f]">{selected === "yes" ? "→ YES:" : "→ NO:"}</span>{" "}
                              <span className="text-[#151513]">{selected === "yes" ? node.yes : node.no}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Verification Checklist
   ════════════════════════════════════════════════════════════════════════════ */

function ChecklistSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklist);

  const toggleItem = (idx: number) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  };

  const doneCount = items.filter((i) => i.done).length;
  const progress = (doneCount / items.length) * 100;

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-[#f6f6f6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6b634d] mb-2">Verification Checklist</h2>
          <p className="text-[#86837c] mb-4 text-sm sm:text-base">Check off each item after installation to verify your stack</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#6b634d]">{doneCount}/{items.length} completed</span>
            <span className="text-sm font-bold text-[#92751f]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-2">
          {items.map((item, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Card className={`${palette.card} border ${item.done ? "border-[#3f7450]/40 bg-[#3f7450]/5" : palette.border}`}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItem(i)}
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${item.done ? "bg-[#3f7450] border-[#3f7450]" : "border-[#d6d1c2] hover:border-[#92751f]"}`}
                    >
                      {item.done && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.done ? "text-[#3f7450] line-through" : "text-[#151513]"}`}>
                        {item.check}
                      </p>
                      <code className="text-xs bg-[#1a1a2e] text-[#e0e0e0] px-1.5 py-0.5 rounded mt-1 inline-block max-w-full overflow-x-auto">{item.command}</code>
                      <p className="text-xs text-[#86837c] mt-1">{item.expected}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SECTION: Footer
   ════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="bg-[#6b634d] dark:bg-[#1a1a1e] text-white/80 dark:text-[#a0a0a0] py-8 border-t border-[#5a5540] dark:border-[#3a3a3e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm">Generated by Z.ai | July 2026 | SMP v5.1 Protocol</p>
        <p className="text-xs mt-2 text-white/50 dark:text-[#606060]">Comprehensive Proxy Analysis & Installation Guide — Interactive Web Edition</p>
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <Badge variant="outline" className="text-xs border-white/30 dark:border-[#4a4a4e] text-white/60 dark:text-[#808080]">Next.js 16</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-[#4a4a4e] text-white/60 dark:text-[#808080]">Framer Motion</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-[#4a4a4e] text-white/60 dark:text-[#808080]">shadcn/ui</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-[#4a4a4e] text-white/60 dark:text-[#808080]">Tailwind CSS 4</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-[#4a4a4e] text-white/60 dark:text-[#808080]">WebSocket</Badge>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export default function ProxyAnalysisPage() {
  const [mobileNav, setMobileNav] = useState(false);

  const navItems = [
    { id: "ranked", label: "Rankings" },
    { id: "components", label: "Components" },
    { id: "install", label: "Install" },
    { id: "monitor", label: "Monitor" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f6] dark:bg-[#141418]">
      {/* Sticky Nav Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#1a1a1e]/90 backdrop-blur-md border-b border-[#d6d1c2]/50 dark:border-[#3a3a3e]/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#92751f] dark:text-[#ae964d]" />
          <span className="font-semibold text-[#6b634d] dark:text-[#ae964d] text-sm hidden sm:inline">Proxy Analysis</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
              className="px-3 py-1.5 rounded-lg text-sm text-[#6b634d] dark:text-[#ae964d] hover:bg-[#f6f6f6] dark:hover:bg-[#2a2a2e] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button onClick={() => setMobileNav(!mobileNav)} className="p-1 md:hidden">
            {mobileNav ? <X className="h-5 w-5 text-[#6b634d] dark:text-[#ae964d]" /> : <Menu className="h-5 w-5 text-[#6b634d] dark:text-[#ae964d]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-[#1a1a1e] border-b border-[#d6d1c2]/50 dark:border-[#3a3a3e]/50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    setMobileNav(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm text-[#6b634d] dark:text-[#ae964d] hover:bg-[#f6f6f6] dark:hover:bg-[#2a2a2e]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <MethodologySection />
        <RankedSection />
        <DeepDivesSection />
        <ComparisonSection />
        <SynergySection />
        <ComponentSearchSection />
        <InstallSection />
        <ConfigExportSection />
        <DecisionTreeSection />
        <ChecklistSection />
        <MonitoringSection />
      </main>

      <Footer />
    </div>
  );
}
