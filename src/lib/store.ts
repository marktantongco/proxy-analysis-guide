import { create } from "zustand";

interface AppState {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  components: ComponentItem[];
  setComponents: (components: ComponentItem[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  author: string;
  tags: string[];
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: "hero",
  setActiveSection: (section) => set({ activeSection: section }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  components: [],
  setComponents: (components) => set({ components }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
