import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AnimeDetail from "./pages/AnimeDetail";
import Auth from "./pages/Auth";
import Library from "./pages/Library";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
      </MotionConfig>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
