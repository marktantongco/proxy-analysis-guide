"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Cpu } from "lucide-react";
import { gozenInstallSteps, owlInstallSteps, ramImpact, unifiedStackConfig, startupSequence, type InstallStep } from "@/lib/proxy-data";
import { fadeUp, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";
import { CodeBlock, InstallStepCard, useCopy } from "@/components/sections/shared";

export function InstallSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeGuide, setActiveGuide] = useState<"gozen" | "owl">("gozen");
  const { copied: configCopied, copy: configCopy } = useCopy();
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  return (
    <section id="install" ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Step-by-Step Installation</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">Copy-paste commands for your 8 GB RAM Ubuntu system</p>
        </motion.div>

        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
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
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-10">
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
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
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
