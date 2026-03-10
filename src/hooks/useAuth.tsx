import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  const stableSetUser = (newUser: User | null) => {
    const newId = newUser?.id ?? null;
    if (newId !== userIdRef.current) {
      userIdRef.current = newId;
      setUser(newUser);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        stableSetUser(session?.user ?? null);
        setLoading(false);
        
        // Only show toast for OAuth sign-ins (email/password handled in signIn function)
        if (event === 'SIGNED_IN') {
          const pendingOAuth = sessionStorage.getItem('pending_oauth_signin');
          if (pendingOAuth) {
            sessionStorage.removeItem('pending_oauth_signin');
            setTimeout(() => {
              toast.success('Welcome back!');
            }, 0);
          }
          // Handle post-login redirect for OAuth flows
          const postLoginRedirect = sessionStorage.getItem('post_login_redirect');
          if (postLoginRedirect) {
            sessionStorage.removeItem('post_login_redirect');
            setTimeout(() => {
              window.location.replace(postLoginRedirect);
            }, 100);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      stableSetUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      toast.success('Welcome back!');
    }
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    sessionStorage.setItem('pending_oauth_signin', 'true');
    const redirectUrl = `${window.location.origin}/`;

    const isLovableHost =
      window.location.hostname.endsWith('lovable.app') ||
      window.location.hostname.endsWith('lovableproject.com');
    const isEmbedded = window.parent !== window;

    // In Lovable preview (iframe), use popup + token handoff to the embedded window.
    if (isLovableHost && isEmbedded) {
      const callbackUrl = `${window.location.origin}/auth/popup-callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        sessionStorage.removeItem('pending_oauth_signin');
        return { error: error as Error | null };
      }

      if (!data?.url) {
        sessionStorage.removeItem('pending_oauth_signin');
        return { error: new Error('Unable to start Google sign-in. Please try again.') };
      }

      const popup = window.open(data.url, 'google_oauth', 'width=500,height=700');

      if (!popup) {
        sessionStorage.removeItem('pending_oauth_signin');
        return { error: new Error('Popup blocked. Please allow popups and try again.') };
      }

      return await new Promise<{ error: Error | null }>((resolve) => {
        let settled = false;

        const finish = (err: Error | null) => {
          if (settled) return;
          settled = true;
          window.removeEventListener('message', messageHandler);
          clearInterval(closedInterval);
          clearTimeout(timeoutId);
          if (err) {
            sessionStorage.removeItem('pending_oauth_signin');
          }
          resolve({ error: err });
        };

        const handleMessage = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          const data = event.data as {
            type?: string;
            message?: string;
            payload?: { accessToken?: string; refreshToken?: string };
          };

          if (data?.type === 'oauth-error') {
            finish(new Error(data.message || 'Google sign-in failed.'));
            return;
          }

          if (data?.type === 'oauth-session') {
            const accessToken = data.payload?.accessToken;
            const refreshToken = data.payload?.refreshToken;

            if (!accessToken || !refreshToken) {
              finish(new Error('Missing auth session from popup.'));
              return;
            }

            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            finish(sessionError ? (sessionError as Error) : null);
          }
        };

        const messageHandler = (event: MessageEvent) => {
          void handleMessage(event);
        };

        window.addEventListener('message', messageHandler);

        const closedInterval = window.setInterval(() => {
          if (popup.closed && !settled) {
            finish(new Error('Google sign-in was cancelled.'));
          }
        }, 400);

        const timeoutId = window.setTimeout(() => {
          if (!popup.closed) {
            popup.close();
          }
          finish(new Error('Google sign-in timed out. Please try again.'));
        }, 120000);
      });
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
