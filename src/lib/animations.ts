// ── Shared Framer Motion Animation Presets ──────────────────────────────
// Single source of truth for animation variants used across the app.
// Includes prefers-reduced-motion support via useReducedMotionSafe.

import { useReducedMotion } from "framer-motion";

/* ── Reduced Motion Hook ──────────────────────────────────────────────── */
// Returns true when the user prefers reduced motion.
// Components should check this and skip decorative animations.

export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}

/* ── Reduced Motion-Aware Variants ──────────────────────────────────── */
// These variants automatically reduce to instant (duration: 0) transitions
// when reduced motion is preferred. Use them instead of raw fadeUp etc.

export function makeVariants(reduced: boolean) {
  if (reduced) {
    // Instant appearance — no motion
    return {
      fadeUp: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
      },
      staggerContainer: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } },
      },
      staggerItem: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
      },
      scaleIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
      },
    };
  }
  // Full motion — the original presets
  return {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    },
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
    },
    staggerItem: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    },
  };
}

/* ── Original Static Variants ────────────────────────────────────────── */
// Still exported for backward compatibility with components that don't
// use the reduced-motion hook (they'll get full animations always).

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
