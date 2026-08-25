import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Route-level code splitting. Index stays eager -- it is the landing route,
// so deferring it would only add a fallback flash. Everything else loads on
// navigation, which keeps the initial bundle to the home view plus vendor.
const AnimeDetail = lazy(() => import("./pages/AnimeDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Library = lazy(() => import("./pages/Library"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Deliberately minimal: a spinner that appears for a few hundred milliseconds
// reads as jank. The background matches the shell so a fast chunk load looks
// like nothing happened at all.
const RouteFallback = () => <div className="min-h-screen bg-background" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/anime/:id" element={<AnimeDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/library" element={<Library />} />
              <Route path="/about" element={<About />} />
              {/* Redirect old routes to /library */}
              <Route path="/readers" element={<Navigate to="/library" replace />} />
              <Route path="/progress" element={<Navigate to="/library" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </MotionConfig>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
