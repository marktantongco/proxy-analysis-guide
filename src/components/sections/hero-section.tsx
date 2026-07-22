"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, Terminal, ChevronDown, Star } from "lucide-react";
import { staggerContainer, staggerItem, fadeUp, useReducedMotionSafe, makeVariants } from "@/lib/animations";
import { tw } from "@/lib/theme-tokens";

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotionSafe();
  const variants = makeVariants(reduced);

  return (
    <section id="hero" ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cascade-accent2/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={variants.staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div variants={variants.staggerItem}>
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 text-xs sm:text-sm px-3 py-1">
            SMP v5.1 Protocol — 8 GB RAM Ubuntu
          </Badge>
        </motion.div>

        <motion.h1
          variants={variants.staggerItem}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight"
        >
          Find YOUR Best
          <br />
          <span className="text-accent">AI Proxy</span>
        </motion.h1>

        <motion.p variants={variants.staggerItem} className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          10 open-source AI proxies analyzed with live metrics.
          Discover which proxy fits YOUR setup — not a one-size-fits-all ranking.
        </motion.p>

        {/* Key Stats */}
        <motion.div
          variants={variants.staggerContainer}
          className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto"
        >
          {[
            { value: "9.4", label: "GoZen", sub: "#1 Overall" },
            { value: "8.7", label: "routatic", sub: "#2 macOS" },
            { value: "7.7", label: "OWL-AGENT", sub: "#3 Hardware" },
          ].map((stat) => (
            <motion.div key={stat.label} variants={variants.staggerItem} className="text-center">
              <div className={`text-2xl sm:text-4xl font-bold ${tw.scoreText(parseFloat(stat.value))}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-primary mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={variants.staggerItem} className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button className={`${tw.btnPrimary} rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base`} onClick={() => document.getElementById("ranked")?.scrollIntoView({ behavior: "smooth" })}>
            View Rankings <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className={`${tw.borderBorder} rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base`} onClick={() => document.getElementById("install")?.scrollIntoView({ behavior: "smooth" })}>
            Installation Guide <Terminal className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {/* Best Synergy Badge */}
        <motion.div variants={variants.staggerItem} className="mt-8">
          <div className="inline-flex items-center gap-2 bg-cascade-success/10 border border-cascade-success/20 rounded-full px-4 py-2 text-sm">
            <Star className="h-4 w-4 text-cascade-success" />
            <span className="text-cascade-success font-medium">Best Synergy: GoZen + OWL-AGENT — 9.2/10</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {!reduced && (
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      )}
    </section>
  );
}
