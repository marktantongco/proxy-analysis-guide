"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Check, CheckCircle2, XCircle, Cpu, HardDrive } from "lucide-react";
import { deepDives, type ProxyDeepDive } from "@/lib/proxy-data";
import { fadeUp, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";
import { useProxyStore } from "@/lib/store";
import { useCopy } from "@/components/sections/shared";

export function DeepDiveCard({ dive, isSelected }: { dive: ProxyDeepDive; isSelected: boolean }) {
  const [activeTab, setActiveTab] = useState("features");
  const { copied, copy } = useCopy();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  return (
    <motion.div ref={ref} variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
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
                    transition={reduced ? { duration: 0 } : { delay: i * 0.05 }}
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
                    transition={reduced ? { duration: 0 } : { duration: 1, ease: "easeOut" }}
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

export function DeepDivesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);
  const selectedProxy = useProxyStore((s) => s.selectedProxy);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
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
