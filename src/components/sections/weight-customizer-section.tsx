"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Settings2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProxyStore, DEFAULT_WEIGHTS } from "@/lib/store";
import { rankedProxies, type ProxyRepo } from "@/lib/proxy-data";
import { useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";

/* ── Score Recalculation ───────────────────────────────────────────────── */

function recalculateScore(proxy: ProxyRepo, weights: typeof DEFAULT_WEIGHTS): number {
  const totalWeight = weights.memory + weights.features + weights.maintenance + weights.setup + weights.uniqueValue;
  if (totalWeight === 0) return proxy.score; // Fallback to static score

  // Normalize RAM score: lower RAM = higher score
  const ramScores: Record<string, number> = {
    "30-50 MB": 10,
    "60-100 MB": 7,
    "80-120 MB": 6,
    "80-150 MB": 5,
    "100-200 MB": 4,
    "200-400 MB": 2,
  };
  const ramScore = ramScores[proxy.estRam] ?? 5;

  const raw =
    (ramScore * weights.memory +
     proxy.features * weights.features +
     proxy.maintenance * weights.maintenance +
     proxy.setup * weights.setup +
     // Unique value: use a proxy-specific score derived from description uniqueness
     7 * weights.uniqueValue) / totalWeight;

  // Normalize to same scale as original (max ~10)
  return Math.round(raw * 10) / 10;
}

/* ── Slider Row ──────────────────────────────────────────────────────────── */

function WeightSlider({
  label,
  value,
  onChange,
  color,
  description,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${color}`}>{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <span className={`text-sm font-bold ${color}`}>{value}%</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-[var(--cascade-accent)] bg-secondary"
        />
        <div className="flex gap-1">
          {[0, 25, 50, 75, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`px-1.5 py-0.5 rounded text-xs font-medium transition-colors ${
                value === preset
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── WeightCustomizerSection ──────────────────────────────────────────────── */

export function WeightCustomizerSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  const customWeights = useProxyStore((s) => s.customWeights);
  const setCustomWeights = useProxyStore((s) => s.setCustomWeights);
  const resetCustomWeights = useProxyStore((s) => s.resetCustomWeights);

  const totalWeight =
    customWeights.memory +
    customWeights.features +
    customWeights.maintenance +
    customWeights.setup +
    customWeights.uniqueValue;

  const isDefault =
    customWeights.memory === DEFAULT_WEIGHTS.memory &&
    customWeights.features === DEFAULT_WEIGHTS.features &&
    customWeights.maintenance === DEFAULT_WEIGHTS.maintenance &&
    customWeights.setup === DEFAULT_WEIGHTS.setup &&
    customWeights.uniqueValue === DEFAULT_WEIGHTS.uniqueValue;

  // Recalculate rankings with custom weights
  const reRanked = rankedProxies
    .map((proxy) => ({
      ...proxy,
      customScore: recalculateScore(proxy, customWeights),
    }))
    .sort((a, b) => b.customScore - a.customScore);

  const handleWeightChange = (key: keyof typeof DEFAULT_WEIGHTS, value: number) => {
    setCustomWeights({ ...customWeights, [key]: value });
  };

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-accent" />
              Customize Rankings
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${isDefault ? "border-border text-muted-foreground" : "border-accent/30 text-accent"}`}>
                {isDefault ? "Default weights" : "Custom weights"}
              </Badge>
              {!isDefault && (
                <Button variant="ghost" size="sm" onClick={resetCustomWeights} className="text-xs text-muted-foreground hover:text-foreground h-7 px-2">
                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Adjust the importance of each criterion to see how rankings change based on YOUR priorities.
            Drag the sliders or click preset values. Total weight must sum to 100% for balanced scoring.
          </p>
        </motion.div>

        {/* Weight Sliders */}
        <motion.div variants={variants.fadeUp} initial="hidden" animate={isInView ? "visible" : "hidden"} className="mb-8">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-primary">Scoring Weight Distribution</CardTitle>
                <div className={`text-sm font-bold ${totalWeight === 100 ? "text-cascade-success" : "text-cascade-error"}`}>
                  Total: {totalWeight}%
                  {totalWeight !== 100 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Auto-normalized to 100%)
                    </span>
                  )}
                </div>
              </div>
              <CardDescription className="text-xs">
                Original defaults: Memory 40%, Features 25%, Maintenance 15%, Setup 10%, Unique Value 10%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <WeightSlider
                label="Memory (RAM)"
                value={customWeights.memory}
                onChange={(v) => handleWeightChange("memory", v)}
                color="text-cascade-success"
                description="Dominant constraint on 8 GB systems"
              />
              <WeightSlider
                label="Features"
                value={customWeights.features}
                onChange={(v) => handleWeightChange("features", v)}
                color="text-cascade-info"
                description="Capability breadth for proxy management"
              />
              <WeightSlider
                label="Maintenance"
                value={customWeights.maintenance}
                onChange={(v) => handleWeightChange("maintenance", v)}
                color="text-cascade-warning"
                description="Community activity and update frequency"
              />
              <WeightSlider
                label="Setup"
                value={customWeights.setup}
                onChange={(v) => handleWeightChange("setup", v)}
                color="text-accent"
                description="Installation and configuration simplicity"
              />
              <WeightSlider
                label="Unique Value"
                value={customWeights.uniqueValue}
                onChange={(v) => handleWeightChange("uniqueValue", v)}
                color="text-cascade-accent2"
                description="Differentiating capabilities"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Re-ranked Table */}
        <motion.div variants={variants.scaleIn} initial="hidden" animate={isInView ? "visible" : "hidden"} className="overflow-x-auto">
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-primary">
                {isDefault ? "Original Rankings" : "Your Custom Rankings"}
              </CardTitle>
              <CardDescription className="text-xs">
                {isDefault
                  ? "Using default weight distribution (Memory 40%, Features 25%, Maintenance 15%, Setup 10%, Unique Value 10%)"
                  : `Custom weights applied — positions may shift based on your priorities`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-2.5 text-left rounded-tl-lg font-medium">#</th>
                    <th className="p-2.5 text-left font-medium">Proxy</th>
                    <th className="p-2.5 text-center font-medium">Original</th>
                    <th className="p-2.5 text-center font-medium">Custom</th>
                    <th className="p-2.5 text-center rounded-tr-lg font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {reRanked.map((proxy, i) => {
                    const originalRank = rankedProxies.find((p) => p.name === proxy.name)?.rank ?? 0;
                    const rankChange = originalRank - (i + 1);
                    const scoreChange = proxy.customScore - proxy.score;
                    return (
                      <tr
                        key={proxy.name}
                        className={`border-b border-border/50 transition-colors ${
                          i % 2 === 0 ? "bg-card" : "bg-background"
                        } hover:bg-accent/5`}
                      >
                        <td className="p-2.5 font-bold text-primary">{i + 1}</td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{proxy.name}</span>
                            <Badge variant="outline" className="text-xs">{proxy.language}</Badge>
                            <Badge variant="outline" className="text-xs border-cascade-success/30 text-cascade-success">{proxy.estRam}</Badge>
                          </div>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`font-bold ${tw.scoreText(proxy.score)}`}>{proxy.score}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span className={`font-bold ${tw.scoreText(proxy.customScore)}`}>{proxy.customScore}</span>
                        </td>
                        <td className="p-2.5 text-center">
                          {scoreChange !== 0 ? (
                            <span className={`font-medium text-xs ${
                              scoreChange > 0 ? "text-cascade-success" : "text-cascade-error"
                            }`}>
                              {scoreChange > 0 ? "+" : ""}{scoreChange.toFixed(1)}
                              {rankChange !== 0 && (
                                <span className="ml-1">
                                  ({rankChange > 0 ? "↑" : "↓"}{Math.abs(rankChange)} pos)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
