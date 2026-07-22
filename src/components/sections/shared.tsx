"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotionSafe } from "@/lib/animations";

/* ── Copy Button Hook ──────────────────────────────────────────────────── */

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  return { copied, copy };
}

/* ── Code Block Component ──────────────────────────────────────────────── */

export function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className="relative bg-[#1a1a2e] text-[#e0e0e0] rounded-lg p-3 font-mono text-xs sm:text-sm overflow-x-auto group">
      <code className="whitespace-pre-wrap break-all">{code}</code>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-1 right-1 h-7 w-7 p-0 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(code)}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-cascade-success" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );
}

/* ── Install Step Card ──────────────────────────────────────────────────── */

import type { InstallStep } from "@/lib/proxy-data";

export function InstallStepCard({ step, accentColor }: { step: InstallStep; accentColor: string }) {
  return (
    <div className="flex gap-3 sm:gap-4">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${accentColor}`}>
        {step.step}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
        <CodeBlock code={step.command} />
        <p className="text-xs text-muted-foreground mt-1.5">{step.explanation}</p>
      </div>
    </div>
  );
}
