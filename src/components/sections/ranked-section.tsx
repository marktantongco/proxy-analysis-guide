"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { rankedProxies, type ProxyRepo } from "@/lib/proxy-data";
import { fadeUp, staggerContainer, staggerItem, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";
import { useProxyStore } from "@/lib/store";

export function RankedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [expanded, setExpanded] = useState<number | null>(null);
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
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
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">All 10 Proxies Ranked</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Click any proxy to see details. Weighted scoring: Memory 40%, Features 25%, Maintenance 15%, Setup 10%, Unique Value 10%</p>
        </motion.div>

        {/* Search Filter */}
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-4">
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

        <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {filteredProxies.map((proxy) => (
            <motion.div key={proxy.name} variants={variants.staggerItem}>
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
                        transition={reduced ? { duration: 0 } : { duration: 0.3 }}
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
