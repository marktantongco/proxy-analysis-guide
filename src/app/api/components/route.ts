import { NextRequest, NextResponse } from "next/server";

const API_KEY = "21st_sk_11169f975e70543173ac97bf9f4f5804aa787a7df69b5bf96f439769d507aa55";

// ── Type-safe API response interfaces ──────────────────────────────────
interface ComponentData {
  id: number;
  name: string;
  component_slug: string;
  library_id: string;
  description: string;
  install_command: string;
}

interface ComponentUserData {
  name: string;
  username: string;
  image_url: string | null;
}

interface SearchResult {
  name: string;
  preview_url: string | null;
  demo_id: number;
  component_data: ComponentData;
  component_user_data: ComponentUserData;
  usage_count: number;
}

interface Pagination {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface SearchMetadata {
  plan: string;
  requests_remaining: number;
  pagination: Pagination;
}

interface SearchResponse {
  results: SearchResult[];
  metadata: SearchMetadata;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const search = body.search || "";
    const page = body.page || 1;
    const perPage = body.per_page || 12;

    if (!search.trim()) {
      return NextResponse.json<SearchResponse>({
        results: [],
        metadata: {
          plan: "free",
          requests_remaining: 999999,
          pagination: { total: 0, page: 1, per_page: perPage, total_pages: 0 },
        },
      });
    }

    const response = await fetch("https://21st.dev/api/search", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search, page, per_page: perPage }),
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const data = await response.json() as SearchResponse;
      return NextResponse.json(data);
    }

    return NextResponse.json(getFallbackResults(search));
  } catch {
    return NextResponse.json(getFallbackResults("component"));
  }
}

// Fallback curated results when API is unreachable
function getFallbackResults(query: string): SearchResponse {
  const allResults: SearchResult[] = [
    { name: "Animated Button", preview_url: null, demo_id: 1, component_data: { id: 1, name: "Button", component_slug: "button", library_id: "shadcn", description: "Displays a button or a component that looks like a button.", install_command: 'npx shadcn@latest add "button"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 42558 },
    { name: "Animated Card", preview_url: null, demo_id: 2, component_data: { id: 2, name: "Card", component_slug: "card", library_id: "shadcn", description: "Displays a card with header, content, and footer.", install_command: 'npx shadcn@latest add "card"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 38421 },
    { name: "Dialog Modal", preview_url: null, demo_id: 3, component_data: { id: 3, name: "Dialog", component_slug: "dialog", library_id: "shadcn", description: "A window overlaid on the primary window, rendering secondary content.", install_command: 'npx shadcn@latest add "dialog"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 31207 },
    { name: "Animated Tabs", preview_url: null, demo_id: 4, component_data: { id: 4, name: "Tabs", component_slug: "tabs", library_id: "shadcn", description: "A set of layered sections of content.", install_command: 'npx shadcn@latest add "tabs"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 28834 },
    { name: "Progress Bar", preview_url: null, demo_id: 5, component_data: { id: 5, name: "Progress", component_slug: "progress", library_id: "shadcn", description: "Displays an indicator showing the completion progress of a task.", install_command: 'npx shadcn@latest add "progress"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 24509 },
    { name: "Badge Component", preview_url: null, demo_id: 6, component_data: { id: 6, name: "Badge", component_slug: "badge", library_id: "shadcn", description: "Displays a badge or a component that looks like a badge.", install_command: 'npx shadcn@latest add "badge"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 21763 },
    { name: "Sheet Panel", preview_url: null, demo_id: 7, component_data: { id: 7, name: "Sheet", component_slug: "sheet", library_id: "shadcn", description: "A panel that slides out from the edge of the screen.", install_command: 'npx shadcn@latest add "sheet"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 19421 },
    { name: "Tooltip Hover", preview_url: null, demo_id: 8, component_data: { id: 8, name: "Tooltip", component_slug: "tooltip", library_id: "shadcn", description: "A popup that displays information related to an element.", install_command: 'npx shadcn@latest add "tooltip"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 17832 },
    { name: "Scroll Area", preview_url: null, demo_id: 9, component_data: { id: 9, name: "Scroll Area", component_slug: "scroll-area", library_id: "shadcn", description: "Augments native scroll functionality for custom cross-browser styling.", install_command: 'npx shadcn@latest add "scroll-area"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 15647 },
    { name: "Separator Divider", preview_url: null, demo_id: 10, component_data: { id: 10, name: "Separator", component_slug: "separator", library_id: "shadcn", description: "Visually or semantically separates content.", install_command: 'npx shadcn@latest add "separator"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 13429 },
    { name: "Skeleton Loader", preview_url: null, demo_id: 11, component_data: { id: 11, name: "Skeleton", component_slug: "skeleton", library_id: "shadcn", description: "Used to show a placeholder while content is loading.", install_command: 'npx shadcn@latest add "skeleton"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 12184 },
    { name: "Switch Toggle", preview_url: null, demo_id: 12, component_data: { id: 12, name: "Switch", component_slug: "switch", library_id: "shadcn", description: "A control that allows the user to toggle between two states.", install_command: 'npx shadcn@latest add "switch"' }, component_user_data: { name: "shadcn", username: "shadcn", image_url: null }, usage_count: 10876 },
  ];

  const q = query.toLowerCase();
  const filtered = q ? allResults.filter(r => r.component_data.name.toLowerCase().includes(q) || r.component_data.description.toLowerCase().includes(q) || r.component_data.component_slug.includes(q)) : allResults;

  return {
    results: filtered,
    metadata: { plan: "free", requests_remaining: 999978, pagination: { total: filtered.length, page: 1, per_page: 12, total_pages: 1 } },
  };
}
