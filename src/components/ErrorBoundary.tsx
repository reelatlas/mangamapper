import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// The one React error boundary in the app, mounted around the routes in
// App.tsx (inside BrowserRouter so the recovery link works). Catches render
// and lifecycle throws from any page; data-fetch failures are NOT throws —
// those are handled where the query lives (Index, AnimeDetail) through
// `isError`. Styled like the pages' own `anime_not_found` block so a crash
// reads as one of the app's states, not a browser default.
//
// A class because React still has no hook for componentDidCatch.

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No reporter is wired by policy (personal project; see README). The
    // component stack is the one thing the console would otherwise lose.
    console.error(error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen bg-background font-mono">
        <main className="container py-16 text-center">
          <div className="border border-dashed p-8 max-w-md mx-auto">
            <p className="text-destructive text-sm mb-4">
              <span className="text-syntax-cyan">error</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-syntax-green">render_failed</span>
            </p>
            <p className="text-muted-foreground text-xs mb-6">
              Something in this view threw. Reloading usually clears it; if it keeps happening, the console has the stack.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button className="border-dashed text-xs" onClick={this.reset}>
                retry
              </Button>
              <Button asChild className="border-dashed text-xs">
                <Link to="/" onClick={this.reset} className="flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> back_to_home
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
