import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="border border-dashed border-border bg-card max-w-md w-full mx-4">
        <div className="terminal-header">
          <span className="text-syntax-cyan">&gt; resolve_route()</span>
        </div>
        <div className="p-6 space-y-3 font-mono text-sm">
          <p>
            <span className="text-syntax-cyan">status:</span>{" "}
            <span className="text-syntax-amber">404</span>
          </p>
          <p>
            <span className="text-syntax-cyan">path:</span>{" "}
            <span className="text-syntax-green">"{location.pathname}"</span>
          </p>
          <p className="text-muted-foreground">// route_not_found</p>
          <Link
            to="/"
            className="inline-block text-primary hover:text-accent transition-colors"
          >
            {"> return_home()"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
