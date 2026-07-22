"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scoringWeights } from "@/lib/proxy-data";
import { fadeUp, staggerContainer, staggerItem, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";

export function MethodologySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Scoring Methodology</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Weighted criteria optimized for resource-constrained 8 GB RAM systems</p>
        </motion.div>

        <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
          {scoringWeights.map((w) => (
            <motion.div key={w.criterion} variants={variants.staggerItem}>
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
