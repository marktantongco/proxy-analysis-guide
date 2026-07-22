"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, AlertTriangle, Zap, Layers } from "lucide-react";
import { synergyCombos } from "@/lib/proxy-data";
import { fadeUp, staggerContainer, staggerItem, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";

export function SynergySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Synergy Assessment</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Which stack combination delivers the best combined value?</p>
        </motion.div>

        <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-4">
          {synergyCombos.map((combo, i) => (
            <motion.div key={combo.combo} variants={variants.staggerItem}>
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
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mt-8">
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
