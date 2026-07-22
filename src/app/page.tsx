"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Shield, Zap, Server, CheckCircle2, XCircle, ChevronDown,
  Copy, Check, ArrowDown, Cpu, HardDrive, BarChart3, Globe,
  Terminal, BookOpen, Layers, Star, AlertTriangle, Radio,
  Menu, X, ExternalLink, ChevronRight, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  rankedProxies, deepDives, comparisonFeatures, synergyCombos,
  gozenInstallSteps, owlInstallSteps, verificationChecklist as initialChecklist,
  decisionTree, ramImpact, unifiedStackConfig, startupSequence, scoringWeights,
  type ProxyRepo, type ProxyDeepDive, type ChecklistItem, type InstallStep
} from "@/lib/proxy-data";
import { DarkModeToggle, ComponentSearchSection, ConfigExportSection, MonitoringSection, ComponentInstallSection, InstallationRunner, LiveMetricsSection } from "@/components/new-sections";
import { fadeUp, staggerContainer, staggerItem, scaleIn } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";
import { useProxyStore } from "@/lib/store";

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
    <section id="hero" ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cascade-accent2/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div variants={staggerItem}>
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 text-xs sm:text-sm px-3 py-1">
            SMP v5.1 Protocol — 8 GB RAM Ubuntu
          </Badge>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight"
        >
          Find YOUR Best
          <br />
          <span className="text-accent">AI Proxy</span>
        </motion.h1>

        <motion.p variants={staggerItem} className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          10 open-source AI proxies analyzed with live metrics.
          Discover which proxy fits YOUR setup — not a one-size-fits-all ranking.
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
              <div className={`text-2xl sm:text-4xl font-bold ${tw.scoreText(parseFloat(stat.value))}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-primary mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={staggerItem} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button className={`${tw.btnPrimary} rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base`} onClick={() => document.getElementById("ranked")?.scrollIntoView({ behavior: "smooth" })}>
            View Rankings <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className={`${tw.borderBorder} rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base`} onClick={() => document.getElementById("install")?.scrollIntoView({ behavior: "smooth" })}>
            Installation Guide <Terminal className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Best Synergy Badge */}
        <motion.div variants={staggerItem} className="mt-8">
          <div className="inline-flex items-center gap-2 bg-cascade-success/10 border border-cascade-success/20 rounded-full px-4 py-2 text-sm">
            <Star className="h-4 w-4 text-cascade-success" />
            <span className="text-cascade-success font-medium">Best Synergy: GoZen + OWL-AGENT — 9.2/10</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
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
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Scoring Methodology</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Weighted criteria optimized for resource-constrained 8 GB RAM systems</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
          {scoringWeights.map((w) => (
            <motion.div key={w.criterion} variants={staggerItem}>
              <Card className={`${tw.bgCard} border ${tw.borderBorder} h-full`}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{w.weight}%</div>
                  <div className="text-sm font-semibold text-primary mt-1">{w.criterion}</div>
                  <div className="text-xs text-muted-foreground mt-1">{w.description}</div>
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
  const selectedProxy = useProxyStore((s) => s.selectedProxy);
  const setSelectedProxy = useProxyStore((s) => s.setSelectedProxy);
  const searchFilter = useProxyStore((s) => s.searchFilter);
  const setSearchFilter = useProxyStore((s) => s.setSearchFilter);

  const filteredProxies = rankedProxies.filter((proxy) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      proxy.name.toLowerCase().includes(q) ||
      proxy.description.toLowerCase().includes(q) ||
      proxy.language.toLowerCase().includes(q) ||
      proxy.estRam.toLowerCase().includes(q) ||
      proxy.uniqueValue.toLowerCase().includes(q)
    );
  });

  return (
    <section id="ranked" ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">All 10 Proxies Ranked</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Click any proxy to see details. Weighted scoring: Memory 40%, Features 25%, Maintenance 15%, Setup 10%, Unique Value 10%</p>
        </motion.div>

        {/* Search Filter */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter proxies by name, language, RAM..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {filteredProxies.map((proxy) => (
            <motion.div key={proxy.name} variants={staggerItem}>
              <Card
                className={`${tw.bgCard} border ${tw.borderBorder} cursor-pointer transition-shadow hover:shadow-md ${selectedProxy === proxy.name ? "ring-2 ring-accent/40" : ""}`}
                onClick={() => {
                  setExpanded(expanded === proxy.rank ? null : proxy.rank);
                  setSelectedProxy(expanded === proxy.rank ? null : proxy.name);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${tw.scoreBg(proxy.score)}`}>
                        <span className={tw.scoreText(proxy.score)}>{proxy.rank}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm sm:text-base">{proxy.name}</span>
                          <Badge variant="outline" className="text-xs">{proxy.language}</Badge>
                          <Badge variant="outline" className="text-xs border-cascade-success/30 text-cascade-success">{proxy.estRam}</Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{proxy.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xl sm:text-2xl font-bold ${tw.scoreText(proxy.score)}`}>{proxy.score}</span>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === proxy.rank ? "rotate-180" : ""}`} />
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
                        <Separator className="my-3 bg-border" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="text-center p-2 rounded-lg bg-background">
                            <div className="text-lg font-bold text-accent">{proxy.features}/10</div>
                            <div className="text-xs text-muted-foreground">Features</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-background">
                            <div className="text-lg font-bold text-cascade-info">{proxy.maintenance}/10</div>
                            <div className="text-xs text-muted-foreground">Maintenance</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-background">
                            <div className="text-lg font-bold text-cascade-success">{proxy.setup}/10</div>
                            <div className="text-xs text-muted-foreground">Setup</div>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-background">
                            <div className="text-lg font-bold text-primary">{proxy.estRam}</div>
                            <div className="text-xs text-muted-foreground">Est. RAM</div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-primary">
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

function DeepDiveCard({ dive, isSelected }: { dive: ProxyDeepDive; isSelected: boolean }) {
  const [activeTab, setActiveTab] = useState("features");
  const { copied, copy } = useCopy();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
      <Card className={`${tw.bgCard} border ${isSelected ? "ring-2 ring-accent/40 border-accent/30" : tw.borderBorder} overflow-hidden`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-background to-card">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl text-primary">{dive.name}</CardTitle>
              <CardDescription className="text-accent font-medium">{dive.tagline}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-background h-auto">
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
                    className="flex gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-cascade-success mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-sm text-foreground">{f.title}:</span>{" "}
                      <span className="text-sm text-muted-foreground">{f.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">Quick Install:</p>
                <div className="relative bg-[#1a1a2e] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs sm:text-sm overflow-x-auto">
                  <code>{dive.installCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-7 w-7 p-0 text-muted-foreground hover:text-white"
                    onClick={(e) => { e.stopPropagation(); copy(dive.installCmd); }}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="architecture" className="mt-4">
              <p className="text-sm text-foreground leading-relaxed">{dive.architecture}</p>
            </TabsContent>

            <TabsContent value="ram" className="mt-4">
              <div className="flex items-start gap-3 mb-4">
                <Cpu className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{dive.ramDetail}</p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Memory Footprint</span>
                </div>
                <div className="w-full bg-border rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: dive.name === "OWL-AGENT" ? "65%" : "25%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${dive.name === "OWL-AGENT" ? "bg-cascade-warning" : "bg-cascade-success"}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 MB</span>
                  <span>{dive.name === "OWL-AGENT" ? "120 MB" : "50 MB"}</span>
                  <span>400 MB</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pros-cons" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-cascade-success mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Pros
                  </h4>
                  <ul className="space-y-1.5">
                    {dive.pros.map((p) => (
                      <li key={p} className="text-xs sm:text-sm text-foreground flex gap-2">
                        <span className="text-cascade-success">+</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cascade-error mb-2 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Cons
                  </h4>
                  <ul className="space-y-1.5">
                    {dive.cons.map((c) => (
                      <li key={c} className="text-xs sm:text-sm text-foreground flex gap-2">
                        <span className="text-cascade-error">-</span> {c}
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
  const selectedProxy = useProxyStore((s) => s.selectedProxy);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Deep Dives: Top 3 Proxies</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Full architecture, features, RAM analysis, and honest limitations</p>
        </motion.div>
        <div className="space-y-6">
          {deepDives.map((dive) => (
            <DeepDiveCard key={dive.name} dive={dive} isSelected={selectedProxy === dive.name} />
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
    <section ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Feature Comparison</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">GoZen vs routatic-proxy vs OWL-AGENT — tap a row to highlight</p>
        </motion.div>

        <motion.div variants={scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
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
                    className={`cursor-pointer transition-colors border-b border-border/50 ${isHl ? "bg-accent/10" : i % 2 === 0 ? "bg-card" : "bg-background"} hover:bg-accent/5`}
                  >
                    <td className="p-2 sm:p-3 font-medium text-primary text-xs sm:text-sm">{row.feature}</td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {row.gozen === "Yes" || row.gozen.startsWith("Yes") ? (
                        <span className="text-cascade-success font-medium">{row.gozen}</span>
                      ) : row.gozen === "No" ? (
                        <span className="text-cascade-error">{row.gozen}</span>
                      ) : (
                        <span className="text-cascade-info">{row.gozen}</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {row.routatic === "Yes" || row.routatic.startsWith("Yes") ? (
                        <span className="text-cascade-success font-medium">{row.routatic}</span>
                      ) : row.routatic === "No" ? (
                        <span className="text-cascade-error">{row.routatic}</span>
                      ) : (
                        <span className="text-cascade-info">{row.routatic}</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">
                      {row.owl === "Yes" || row.owl.startsWith("Yes") ? (
                        <span className="text-cascade-success font-medium">{row.owl}</span>
                      ) : row.owl === "No" ? (
                        <span className="text-cascade-error">{row.owl}</span>
                      ) : (
                        <span className="text-cascade-info">{row.owl}</span>
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
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Synergy Assessment</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Which stack combination delivers the best combined value?</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-4">
          {synergyCombos.map((combo, i) => (
            <motion.div key={combo.combo} variants={staggerItem}>
              <Card className={`${tw.bgCard} border ${i === 0 ? "border-cascade-success/40 bg-cascade-success/5" : tw.borderBorder}`}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {i === 0 && <Star className="h-5 w-5 text-cascade-success" />}
                      {i === 1 && <AlertTriangle className="h-5 w-5 text-cascade-warning" />}
                      {i === 2 && <Zap className="h-5 w-5 text-cascade-info" />}
                      <span className="font-semibold text-foreground text-sm sm:text-base">{combo.combo}</span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-bold ${i === 0 ? "text-cascade-success" : i === 1 ? "text-cascade-warning" : "text-cascade-info"}`}>
                      {combo.score}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">{combo.assessment}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Why GoZen + OWL-AGENT */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
          <Card className="border-cascade-success/30 bg-cascade-success/5">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-cascade-success mb-3">Why GoZen + OWL-AGENT Wins</h3>
              <div className="space-y-3 text-sm text-foreground leading-relaxed">
                <p>GoZen provides the feature breadth (scenario routing, budget controls, Web UI, context compression, Bot Gateway) that OWL-AGENT lacks, while OWL-AGENT provides the security (SSRF allowlist) and proactive resilience (predictive circuit breaker, mesh health) that GoZen lacks.</p>
                <p>When layered together, GoZen acts as the primary proxy handling request routing, failover, and management, while OWL-AGENT acts as a security and observability layer between GoZen and upstream providers. Combined RAM: <strong>110-170 MB</strong> (~2.1% of 8 GB).</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-cascade-success">
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
        className="absolute top-1 right-1 h-7 w-7 p-0 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(code)}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-cascade-success" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

function InstallStepCard({ step, accentColor }: { step: InstallStep; accentColor: string }) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${accentColor}`}>
        {step.step}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
        <CodeBlock code={step.command} />
        <p className="text-xs text-muted-foreground mt-1.5">{step.explanation}</p>
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
    <section id="install" ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Step-by-Step Installation</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">Copy-paste commands for your 8 GB RAM Ubuntu system</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <Tabs value={activeGuide} onValueChange={(v) => setActiveGuide(v as "gozen" | "owl")}>
            <TabsList className="grid w-full grid-cols-2 bg-card border border-border h-auto mb-6">
              <TabsTrigger value="gozen" className="py-2.5 text-sm">GoZen (Primary)</TabsTrigger>
              <TabsTrigger value="owl" className="py-2.5 text-sm">OWL-AGENT (Secondary)</TabsTrigger>
            </TabsList>

            <TabsContent value="gozen" className="space-y-4">
              {gozenInstallSteps.map((step) => (
                <InstallStepCard key={step.step} step={step} accentColor="bg-primary" />
              ))}
            </TabsContent>

            <TabsContent value="owl" className="space-y-4">
              {owlInstallSteps.map((step) => (
                <InstallStepCard key={step.step} step={step} accentColor="bg-cascade-accent2" />
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Unified Stack Config */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-10">
          <Card className="border-cascade-success/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg text-cascade-success flex items-center gap-2">
                <Layers className="h-5 w-5" /> Unified Stack Configuration
              </CardTitle>
              <CardDescription>GoZen → OWL-AGENT → Upstream wiring in ~/.zen/zen.json</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <CodeBlock code={unifiedStackConfig} />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">STARTUP SEQUENCE (always start OWL-AGENT first):</p>
                {startupSequence.map((s) => (
                  <div key={s.step} className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs flex-shrink-0">Step {s.step}</Badge>
                    <div>
                      <code className="text-xs bg-[#1a1a2e] text-[#e0e0e0] px-1.5 py-0.5 rounded">{s.cmd}</code>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RAM Impact Table */}
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
          <Card className={`${tw.bgCard} border ${tw.borderBorder}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg text-primary flex items-center gap-2">
                <Cpu className="h-5 w-5" /> Combined Stack RAM Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ramImpact.map((item) => (
                  <div key={item.component} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.component}</div>
                      <div className="text-xs text-muted-foreground">{item.purpose}</div>
                    </div>
                    <Badge variant="outline" className="text-sm font-bold border-accent/30 text-accent">{item.ram}</Badge>
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
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Decision Tree</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Answer questions to find the right proxy configuration for your needs</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {decisionTree.map((node, i) => {
            const selected = answers[i];
            return (
              <motion.div key={i} variants={staggerItem}>
                <Card className={`${tw.bgCard} border ${tw.borderBorder}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base text-foreground">{node.question}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Button
                            size="sm"
                            variant={selected === "yes" ? "default" : "outline"}
                            className={selected === "yes" ? `${tw.btnPrimary} text-xs` : `${tw.borderBorder} text-xs`}
                            onClick={() => toggle(i, "yes")}
                          >
                            YES
                          </Button>
                          <Button
                            size="sm"
                            variant={selected === "no" ? "default" : "outline"}
                            className={selected === "no" ? "bg-cascade-accent2 hover:bg-cascade-accent2/80 text-white text-xs" : `${tw.borderBorder} text-xs`}
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
                              className="mt-2 p-2 rounded-lg bg-secondary text-xs sm:text-sm"
                            >
                              <span className="font-medium text-accent">{selected === "yes" ? "→ YES:" : "→ NO:"}</span>{" "}
                              <span className="text-foreground">{selected === "yes" ? node.yes : node.no}</span>
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
  const completedChecks = useProxyStore((s) => s.completedChecks);
  const toggleCheck = useProxyStore((s) => s.toggleCheck);
  const resetChecks = useProxyStore((s) => s.resetChecks);

  const items = initialChecklist;
  const doneCount = items.filter((item) => completedChecks.includes(item.check)).length;
  const progress = (doneCount / items.length) * 100;

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Verification Checklist</h2>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Check off each item after installation to verify your stack</p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">{doneCount}/{items.length} completed</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-accent">{Math.round(progress)}%</span>
              {doneCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetChecks} className="text-xs text-muted-foreground hover:text-foreground h-6 px-2">
                  Reset
                </Button>
              )}
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-2">
          {items.map((item, i) => {
            const isDone = completedChecks.includes(item.check);
            return (
            <motion.div key={i} variants={staggerItem}>
              <Card className={`${tw.bgCard} border ${isDone ? "border-cascade-success/40 bg-cascade-success/5" : tw.borderBorder}`}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleCheck(item.check)}
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isDone ? "bg-cascade-success border-cascade-success" : "border-border hover:border-accent"}`}
                    >
                      {isDone && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDone ? "text-cascade-success line-through" : "text-foreground"}`}>
                        {item.check}
                      </p>
                      <code className="text-xs bg-[#1a1a2e] text-[#e0e0e0] px-1.5 py-0.5 rounded mt-1 inline-block max-w-full overflow-x-auto">{item.command}</code>
                      <p className="text-xs text-muted-foreground mt-1">{item.expected}</p>
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
   SECTION: Footer
   ════════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="bg-primary dark:bg-background text-primary-foreground dark:text-muted-foreground py-8 border-t border-primary/50 dark:border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm">Generated by Z.ai | July 2026 | SMP v5.1 Protocol</p>
        <p className="text-xs mt-2 text-white/50 dark:text-muted-foreground/50">Comprehensive Proxy Analysis & Installation Guide — Interactive Web Edition</p>
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <Badge variant="outline" className="text-xs border-white/30 dark:border-border text-white/60 dark:text-muted-foreground">Next.js 16</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-border text-white/60 dark:text-muted-foreground">Framer Motion</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-border text-white/60 dark:text-muted-foreground">shadcn/ui</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-border text-white/60 dark:text-muted-foreground">Tailwind CSS 4</Badge>
          <Badge variant="outline" className="text-xs border-white/30 dark:border-border text-white/60 dark:text-muted-foreground">WebSocket</Badge>
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
  const setActiveSection = useProxyStore((s) => s.setActiveSection);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["hero", "ranked", "components", "install", "install-runner", "component-install", "monitor"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [setActiveSection]);

  const navItems = [
    { id: "ranked", label: "Rankings" },
    { id: "components", label: "Components" },
    { id: "install", label: "Install" },
    { id: "install-runner", label: "Run Install" },
    { id: "component-install", label: "Add-ons" },
    { id: "monitor", label: "Monitor" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Nav Bar */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <span className="font-semibold text-primary text-sm hidden sm:inline">Proxy Analysis</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
              className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-secondary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button onClick={() => setMobileNav(!mobileNav)} className="p-1 md:hidden">
            {mobileNav ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
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
            className="md:hidden bg-card border-b border-border/50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    setMobileNav(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm text-primary hover:bg-secondary"
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
        <LiveMetricsSection />
        <SynergySection />
        <ComponentSearchSection />
        <InstallSection />
        <ComponentInstallSection />
        <InstallationRunner />
        <ConfigExportSection />
        <DecisionTreeSection />
        <ChecklistSection />
        <MonitoringSection />
      </main>

      <Footer />
    </div>
  );
}
