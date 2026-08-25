import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import About from "./About";

// About -> Header -> useAuth -> supabase client, which opens a network client
// at import time. vi.mock is hoisted above imports, so the stub is pulled in
// lazily inside the (async) factory. It lives in a leaf module with no app
// imports -- importing test/utils here would cycle back through this mock.
vi.mock("@/integrations/supabase/client", async () => {
  const { supabaseAuthStub } = await import("@/test/supabase-stub");
  return { supabase: supabaseAuthStub() };
});

describe("About page", () => {
  // Exercises the full UI stack under React 19: lucide-react icons, Radix
  // Collapsible, shadcn components and the Header's auth-aware dropdown.
  it("mounts the page and its header without crashing", () => {
    renderWithProviders(<About />, { route: "/about" });
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("renders its section headers", () => {
    renderWithProviders(<About />, { route: "/about" });
    for (const label of ["welcome", "features", "why_build", "built_with"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
