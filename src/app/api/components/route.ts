import { NextRequest, NextResponse } from "next/server";

const API_KEY = "21st_sk_11169f975e70543173ac97bf9f4f5804aa787a7df69b5bf96f439769d507aa55";
const API_BASE = "https://21st.dev/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  try {
    const url = `${API_BASE}/components${query ? `?q=${encodeURIComponent(query)}` : ""}${category ? `&category=${encodeURIComponent(category)}` : ""}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(getCuratedComponents());
  } catch {
    return NextResponse.json(getCuratedComponents());
  }
}

function getCuratedComponents() {
  return {
    components: [
      { id: "hero-gradient", name: "Hero Gradient", category: "hero", description: "Animated gradient hero section with floating particles", author: "21st-community", tags: ["hero", "gradient", "animated", "landing"] },
      { id: "feature-cards", name: "Feature Cards", category: "features", description: "Staggered feature cards with hover lift effects", author: "21st-community", tags: ["features", "cards", "hover", "stagger"] },
      { id: "stats-counter", name: "Stats Counter", category: "stats", description: "Animated number counter with scroll-triggered reveal", author: "21st-community", tags: ["stats", "counter", "scroll", "animated"] },
      { id: "testimonials", name: "Testimonial Carousel", category: "social-proof", description: "Swipeable testimonial cards with avatar and rating", author: "21st-community", tags: ["testimonials", "carousel", "social-proof"] },
      { id: "pricing-table", name: "Pricing Table", category: "pricing", description: "Responsive pricing cards with feature comparison", author: "21st-community", tags: ["pricing", "cards", "comparison"] },
      { id: "cta-banner", name: "CTA Banner", category: "cta", description: "Call-to-action banner with gradient background and pulse animation", author: "21st-community", tags: ["cta", "banner", "gradient", "pulse"] },
      { id: "navigation-bar", name: "Navigation Bar", category: "navigation", description: "Mobile-responsive nav with hamburger menu and smooth transitions", author: "21st-community", tags: ["nav", "mobile", "hamburger", "responsive"] },
      { id: "footer-links", name: "Footer Links", category: "footer", description: "Multi-column footer with social links and newsletter signup", author: "21st-community", tags: ["footer", "links", "newsletter"] },
    ],
  };
}
