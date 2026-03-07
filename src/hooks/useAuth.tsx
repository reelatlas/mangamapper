import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
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
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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

    // In Lovable preview (iframe), use popup flow to avoid embedded OAuth restrictions.
    if (isLovableHost && isEmbedded) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
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
          clearInterval(closedInterval);
          clearTimeout(timeoutId);
          subscription.unsubscribe();
          if (err) {
            sessionStorage.removeItem('pending_oauth_signin');
          }
          resolve({ error: err });
        };

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'SIGNED_IN') {
            if (!popup.closed) {
              popup.close();
            }
            finish(null);
          }
        });

        const closedInterval = window.setInterval(async () => {
          if (!popup || popup.closed) {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (session) {
              finish(null);
            } else {
              finish(new Error('Google sign-in was cancelled.'));
            }
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
