"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useProxyStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useReducedMotionSafe } from "@/lib/animations";
import { DarkModeToggle, ComponentSearchSection, ConfigExportSection, MonitoringSection, ComponentInstallSection, InstallationRunner, LiveMetricsSection } from "@/components/new-sections";
import { HeroSection } from "@/components/sections/hero-section";
import { MethodologySection } from "@/components/sections/methodology-section";
import { RankedSection } from "@/components/sections/ranked-section";
import { DeepDivesSection } from "@/components/sections/deep-dives-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { SynergySection } from "@/components/sections/synergy-section";
import { InstallSection } from "@/components/sections/install-section";
import { DecisionTreeSection } from "@/components/sections/decision-tree-section";
import { ChecklistSection } from "@/components/sections/checklist-section";
import { WeightCustomizerSection } from "@/components/sections/weight-customizer-section";
import { Footer } from "@/components/sections/footer";

export default function ProxyAnalysisPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const setActiveSection = useProxyStore((s) => s.setActiveSection);
  const reduced = useReducedMotionSafe();

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["hero", "ranked", "decision-tree", "components", "install", "install-runner", "component-install", "monitor"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [setActiveSection]);

  const navItems = [
    { id: "ranked", label: "Rankings" },
    { id: "decision-tree", label: "Decision Tree" },
    { id: "components", label: "Components" },
    { id: "install", label: "Install" },
    { id: "install-runner", label: "Run Install" },
    { id: "component-install", label: "Add-ons" },
    { id: "monitor", label: "Monitor" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Nav Bar */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <span className="font-semibold text-primary text-sm hidden sm:inline">Proxy Analysis</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
              className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-secondary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button onClick={() => setMobileNav(!mobileNav)} className="p-1 md:hidden">
            {mobileNav ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className="md:hidden bg-card border-b border-border/50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    setMobileNav(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm text-primary hover:bg-secondary"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <MethodologySection />
        <RankedSection />
        <WeightCustomizerSection />
        <DecisionTreeSection />
        <DeepDivesSection />
        <ComparisonSection />
        <LiveMetricsSection />
        <SynergySection />
        <ComponentSearchSection />
        <InstallSection />
        <ComponentInstallSection />
        <InstallationRunner />
        <ConfigExportSection />
        <ChecklistSection />
        <MonitoringSection />
      </main>

      <Footer />
    </div>
  );
}
