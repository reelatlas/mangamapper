import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AnimeDetail from "./pages/AnimeDetail";
import Auth from "./pages/Auth";
import Library from "./pages/Library";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import OAuthPopupCallback from "./pages/OAuthPopupCallback";
import AuthConfirm from "./pages/AuthConfirm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
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
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/auth/popup-callback" element={<OAuthPopupCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
