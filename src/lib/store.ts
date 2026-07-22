import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProxyStore {
  // Active proxy selection — tracks which proxy is expanded/active in ranked table + deep dives
  selectedProxy: string | null;
  setSelectedProxy: (name: string | null) => void;

  // Global search filter — used across ranked table and component search
  searchFilter: string;
  setSearchFilter: (filter: string) => void;

  // Theme preference — persisted to localStorage
  themePreference: "light" | "dark" | "system";
  setThemePreference: (pref: "light" | "dark" | "system") => void;

  // Monitoring WebSocket connection state
  monitoringConnected: boolean;
  setMonitoringConnected: (connected: boolean) => void;

  // Verification checklist — persisted completed items
  completedChecks: string[];
  toggleCheck: (check: string) => void;
  resetChecks: () => void;

  // Installation runner state
  installRunning: boolean;
  setInstallRunning: (running: boolean) => void;
  completedSteps: number[];
  toggleStep: (step: number) => void;
  resetSteps: () => void;

  // Active section for scroll tracking
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useProxyStore = create<ProxyStore>()(
  persist(
    (set) => ({
      selectedProxy: null,
      setSelectedProxy: (name) => set({ selectedProxy: name }),

      searchFilter: "",
      setSearchFilter: (filter) => set({ searchFilter: filter }),

      themePreference: "system",
      setThemePreference: (pref) => set({ themePreference: pref }),

      monitoringConnected: false,
      setMonitoringConnected: (connected) => set({ monitoringConnected: connected }),

      completedChecks: [],
      toggleCheck: (check) =>
        set((state) => ({
          completedChecks: state.completedChecks.includes(check)
            ? state.completedChecks.filter((c) => c !== check)
            : [...state.completedChecks, check],
        })),
      resetChecks: () => set({ completedChecks: [] }),

      installRunning: false,
      setInstallRunning: (running) => set({ installRunning: running }),
      completedSteps: [],
      toggleStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps.filter((s) => s !== step)
            : [...state.completedSteps, step],
        })),
      resetSteps: () => set({ completedSteps: [], installRunning: false }),

      activeSection: "hero",
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    {
      name: "proxy-analysis-store",
      storage: createJSONStorage(() => {
        // Safe for SSR
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        // Only persist these fields
        themePreference: state.themePreference,
        completedChecks: state.completedChecks,
        completedSteps: state.completedSteps,
      }),
    }
  )
);
