import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeClosed, Check } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import GoogleIcon from '@/components/GoogleIcon';
import { supabase } from '@/integrations/supabase/client';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AnimatedDots = () => {
  const [dots, setDots] = useState('.');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return <span>{dots}</span>;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupPending, setSignupPending] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [visuallyConfirmed, setVisuallyConfirmed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normal redirect for already-authenticated users (not in signup pending flow)
  useEffect(() => {
    if (user && !signupPending) {
      const stored = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      const destination = stored || searchParams.get('redirect') || '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, searchParams, signupPending]);

  // Listen for email confirmation when signup is pending
  useEffect(() => {
    if (!signupPending) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setEmailConfirmed(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [signupPending]);

  // Visibility-aware redirect after email confirmation
  useEffect(() => {
    if (!emailConfirmed) return;

    const doRedirect = () => {
      setChecking(true);
      checkingTimerRef.current = setTimeout(() => {
        setChecking(false);
        setVisuallyConfirmed(true);
        setRedirecting(true);
        redirectTimerRef.current = setTimeout(() => {
          const stored = sessionStorage.getItem('redirectAfterLogin');
          sessionStorage.removeItem('redirectAfterLogin');
          const destination = stored || searchParams.get('redirect') || '/';
          navigate(destination, { replace: true });
        }, 3000);
      }, 2000);
    };

    if (document.visibilityState === 'visible') {
      doRedirect();
    } else {
      const onVisible = () => {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', onVisible);
          doRedirect();
        }
      };
      document.addEventListener('visibilitychange', onVisible);
      return () => {
        document.removeEventListener('visibilitychange', onVisible);
        if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current);
        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      };
    }

    return () => {
      if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [emailConfirmed, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticateUser(email, password, isLogin);
  };

  const authenticateUser = async (userEmail: string, userPassword: string, isLoginAttempt: boolean) => {
    const validation = authSchema.safeParse({ email: userEmail, password: userPassword });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    
    try {
      if (isLoginAttempt) {
        const { error } = await signIn(userEmail, userPassword);
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and confirm your account before signing in.');
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        }
      } else {
        const { error } = await signUp(userEmail, userPassword);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('An account with this email already exists');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created');
          setSignupPending(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const renderConfirmationView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className={visuallyConfirmed ? 'text-syntax-green' : 'text-muted-foreground'}>
          [{visuallyConfirmed ? <Check className="inline w-3.5 h-3.5 -mt-0.5" /> : ' '}]
        </span>
        <span className={visuallyConfirmed ? 'text-syntax-green' : 'text-muted-foreground'}>
          confirm_email
        </span>
        <span className="text-muted-foreground">to</span>
        <span className={visuallyConfirmed ? 'text-foreground' : 'text-muted-foreground'}>
          sign_in
        </span>
      </div>

      {checking && (
        <p className="text-xs text-muted-foreground">
          // auth_checking<AnimatedDots />
        </p>
      )}

      {redirecting && (
        <p className="text-xs text-muted-foreground">
          // auth_confirmed &gt; redirecting<AnimatedDots />
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-md flex flex-col">
        <Card className="w-full border-dashed">
          <div className="terminal-header flex items-center gap-2">
            <span className={signupPending && visuallyConfirmed ? "text-syntax-green" : "text-syntax-amber"}>■</span>
            <span className="text-muted-foreground">auth_terminal</span>
          </div>
          <CardContent className="p-6">
            {signupPending ? (
              <>
                {renderConfirmationView()}
              </>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground">
                    {isLogin ? '// sign in to view progress' : '// create account to start tracking'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-syntax-cyan" />
                      <span className="text-syntax-cyan">email</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="font-mono text-sm border-dashed bg-muted/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-syntax-cyan" />
                      <span className="text-syntax-cyan">password</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="font-mono text-sm border-dashed bg-muted/30 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeClosed className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full font-mono text-xs border-dashed" disabled={loading || googleLoading}>
                    {loading ? 'auth_init...' : isLogin ? 'sign_in()' : 'sign_up()'}
                  </Button>
                </form>

                <div className="mt-6 text-left text-xs">
                  <span className="text-muted-foreground">
                    {isLogin ? "// account_exists(false) → " : "// account_exists(true) → "}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline"
                  >
                    {isLogin ? 'sign_up' : 'sign_in'}
                  </button>
                </div>

                <div className="my-6">
                  <div className="w-full border-t border-dashed" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full font-mono text-xs border-dashed gap-2 group"
                  disabled={loading || googleLoading}
                  onClick={async () => {
                    setGoogleLoading(true);
                    const currentRedirect = sessionStorage.getItem('redirectAfterLogin') || searchParams.get('redirect') || '/';
                    sessionStorage.setItem('redirectAfterLogin', currentRedirect);
                    const { error } = await signInWithGoogle(currentRedirect);
                    if (error) {
                      toast.error(error.message);
                    }
                    setGoogleLoading(false);
                  }}
                >
                  <GoogleIcon />
                  {googleLoading ? 'auth_redir...' : 'google.sign_in()'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 text-left">
          <button
            type="button"
            onClick={() => {
              if (signupPending) {
                setSignupPending(false);
                setEmailConfirmed(false);
                setRedirecting(false);
                setIsLogin(false);
              } else if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="group text-xs"
          >
            {"← re_wind".split('').map((letter, index, arr) => (
              <span
                key={index}
                className="inline-block text-muted-foreground transition-colors duration-150 group-hover:text-syntax-green"
                style={{
                  transitionDelay: `${(arr.length - 1 - index) * 50}ms`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;