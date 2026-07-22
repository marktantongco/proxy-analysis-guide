"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { decisionTree } from "@/lib/proxy-data";
import { fadeUp, staggerContainer, staggerItem, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";

export function DecisionTreeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [answers, setAnswers] = useState<Record<number, "yes" | "no">>({});
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

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
    <section id="decision-tree" ref={ref} className="py-12 sm:py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Decision Tree</h2>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">Answer questions to find the right proxy configuration for your needs</p>
        </motion.div>

        <motion.div variants={variants.staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-3">
          {decisionTree.map((node, i) => {
            const selected = answers[i];
            return (
              <motion.div key={i} variants={variants.staggerItem}>
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
                              transition={reduced ? { duration: 0 } : { duration: 0.3 }}
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
