import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TICK_MS = 1000;
const INITIAL_BLOCKS = 10;
const MAX_BLOCKS = 60;
const ADD_BLOCKS = 5;
const POLL_MS = 500;
const POLL_TIMEOUT_MS = 5000;

const AuthConfirm = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  const [filledBlocks, setFilledBlocks] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(INITIAL_BLOCKS);
  const [paused, setPaused] = useState(false);
  const [closeJammed, setCloseJammed] = useState(false);
  const pausedRef = useRef(false);
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
  const totalBlocksRef = useRef(totalBlocks);
  totalBlocksRef.current = totalBlocks;

  useEffect(() => {
    if (!sessionConfirmed) return;

    const interval = setInterval(() => {
      if (pausedRef.current) return;

      setFilledBlocks(prev => {
        const next = prev + 1;
        if (next >= totalBlocksRef.current) {
          clearInterval(interval);
          setTimeout(() => {
            window.close();
            setTimeout(() => setCloseJammed(true), 500);
          }, TICK_MS);
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [sessionConfirmed]);

  const togglePause = useCallback(() => {
    setPaused(prev => {
      pausedRef.current = !prev;
      return !prev;
    });
  }, []);

  const addTime = useCallback(() => {
    setTotalBlocks(prev => Math.min(prev + ADD_BLOCKS, MAX_BLOCKS));
  }, []);

  const atMaxLimit = totalBlocks >= MAX_BLOCKS;

  const progressBar = '▓'.repeat(Math.min(filledBlocks, totalBlocks)).padEnd(totalBlocks, ' ');

  if (loading || (!sessionConfirmed && !closeJammed)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <span className="text-muted-foreground font-mono text-sm">polling session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-md border-dashed">
        {/* Terminal header */}
        <div className="terminal-header flex items-center gap-2">
          <span className="text-syntax-green">■</span>
          <span className="text-muted-foreground">auth_terminal</span>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className="text-syntax-green text-sm">[✓] confirm_email</span>
            <span className="text-sm">{'>'} welcome aboard!</span>
          </div>

          {/* Comment */}
          <p className="text-muted-foreground text-xs">
            // auth_terminal will close in {totalBlocks}s or close it manually
          </p>

          {/* ASCII progress bar */}
          <div className="flex items-center text-primary">
            <span className="text-muted-foreground text-base">[</span>
            <span className="text-[10px] leading-none whitespace-pre-wrap">{progressBar}</span>
            <span className="text-muted-foreground text-base">]</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs border-dashed ${paused ? 'hover:bg-accent hover:text-accent-foreground' : 'hover:bg-[hsl(var(--syntax-amber))] hover:text-background'}`}
              onClick={togglePause}
              disabled={filledBlocks >= totalBlocks}
            >
              {paused ? 'start' : 'pause'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`group text-xs border-dashed ${atMaxLimit ? 'cursor-not-allowed hover:bg-muted/50 hover:text-muted-foreground' : ''}`}
              onClick={atMaxLimit ? undefined : addTime}
              disabled={filledBlocks >= totalBlocks && !atMaxLimit}
            >
              {atMaxLimit ? (
                <>
                  <span className="group-hover:hidden">add_time(5s)</span>
                  <span className="hidden group-hover:inline text-muted-foreground">add_time(max_limit)</span>
                </>
              ) : (
                'add_time(5s)'
              )}
            </Button>
          </div>

          {/* Jammed message */}
          {closeJammed && (
            <p className="text-syntax-amber text-xs">
              autoclose_jammed {'>'} requires(manual_intervention)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;
