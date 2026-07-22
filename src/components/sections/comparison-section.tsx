"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { comparisonFeatures } from "@/lib/proxy-data";
import { scaleIn, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";

export function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [highlight, setHighlight] = useState<string | null>(null);
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Feature Comparison</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">GoZen vs routatic-proxy vs OWL-AGENT — tap a row to highlight</p>
        </motion.div>

        <motion.div variants={variants.scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className="overflow-x-auto -mx-4 px-4">
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
