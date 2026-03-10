import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

const TOTAL_BLOCKS = 20;
const TICK_MS = 500;
const POLL_MS = 500;
const POLL_TIMEOUT_MS = 5000;

const AuthConfirm = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  const [filledBlocks, setFilledBlocks] = useState(0);
  const [closeJammed, setCloseJammed] = useState(false);
  const pollStartRef = useRef(Date.now());

  // Poll for session
  useEffect(() => {
    if (loading) return;

    if (user) {
      setSessionConfirmed(true);
      return;
    }

    const interval = setInterval(() => {
      if (user) {
        setSessionConfirmed(true);
        clearInterval(interval);
        return;
      }
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT_MS) {
        clearInterval(interval);
        navigate('/auth', { replace: true });
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [user, loading, navigate]);

  // Progress bar + auto-close
  useEffect(() => {
    if (!sessionConfirmed) return;

    const interval = setInterval(() => {
      setFilledBlocks(prev => {
        const next = prev + 1;
        if (next >= TOTAL_BLOCKS) {
          clearInterval(interval);
          // Attempt auto-close after one more tick
          setTimeout(() => {
            window.close();
            // If still open after 500ms, it was blocked
            setTimeout(() => {
              setCloseJammed(true);
            }, 500);
          }, TICK_MS);
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [sessionConfirmed]);

  const progressBar = '▓'.repeat(Math.min(filledBlocks, TOTAL_BLOCKS)).padEnd(TOTAL_BLOCKS, ' ');

  if (loading || (!sessionConfirmed && !closeJammed)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <span className="text-muted-foreground font-mono text-sm">polling session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-dashed border-border bg-card">
        {/* Terminal header */}
        <div className="border-b border-dashed border-border px-4 py-3 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <span className="text-sm font-mono text-muted-foreground">auth_terminal</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="w-2 h-2 rounded-full bg-accent/60" />
            <div className="w-2 h-2 rounded-full bg-accent/30" />
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className="text-accent font-mono text-sm">[✓]</span>
            <span className="text-accent font-mono text-sm">email_confirmed</span>
          </div>

          {/* Comment */}
          <p className="text-muted-foreground font-mono text-xs">
            // close this tab manually or it will attempt to close in 10 seconds ...
          </p>

          {/* ASCII progress bar */}
          <div className="font-mono text-xs text-accent">
            <span className="text-muted-foreground">[</span>
            <span className="whitespace-pre">{progressBar}</span>
            <span className="text-muted-foreground">]</span>
          </div>

          {/* Jammed message */}
          {closeJammed && (
            <p className="text-syntax-amber font-mono text-xs">
              auto-close jammed → close manually at your convenience
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;
