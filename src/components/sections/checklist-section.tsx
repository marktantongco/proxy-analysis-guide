"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { verificationChecklist as initialChecklist } from "@/lib/proxy-data";
import { fadeUp, staggerContainer, staggerItem, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";
import { useProxyStore } from "@/lib/store";

export function ChecklistSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const completedChecks = useProxyStore((s) => s.completedChecks);
  const toggleCheck = useProxyStore((s) => s.toggleCheck);
  const resetChecks = useProxyStore((s) => s.resetChecks);
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  const items = initialChecklist;
  const doneCount = items.filter((item) => completedChecks.includes(item.check)).length;
  const progress = (doneCount / items.length) * 100;

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Verification Checklist</h2>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Check off each item after installation to verify your stack</p>
        </motion.div>

        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-6">
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

        <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-2">
          {items.map((item, i) => {
            const isDone = completedChecks.includes(item.check);
            return (
            <motion.div key={i} variants={variants.staggerItem}>
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
