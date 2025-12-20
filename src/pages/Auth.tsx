import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Terminal, Mail, Lock, Eye, EyeClosed } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const TEST_EMAIL = 'test@mangamapper.com';
const TEST_PASSWORD = 'test123456';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(TEST_EMAIL);
  const [password, setPassword] = useState(TEST_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
          if (userEmail === TEST_EMAIL && error.message.includes('Invalid login credentials')) {
            const { error: signUpError } = await signUp(userEmail, userPassword);
            if (signUpError) {
              if (signUpError.message.includes('already registered')) {
                toast.error('Invalid password for test account');
              } else {
                toast.error(signUpError.message);
              }
            } else {
              toast.success('Test account created! You are now logged in.');
              navigate('/');
            }
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          navigate('/');
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
          toast.success('Account created! You are now logged in.');
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-md border-dashed">
        <div className="terminal-header flex items-center gap-2">
          <span className="text-syntax-amber">■</span>
          <span className="text-muted-foreground">auth_terminal</span>
        </div>
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-xs text-muted-foreground">
              // {isLogin ? 'view progress' : 'create account to start tracking'}
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

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-dashed" />
            <span className="text-xs text-muted-foreground">// or</span>
            <div className="flex-1 border-t border-dashed" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full font-mono text-xs border-dashed gap-2"
            disabled={loading || googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              const { error } = await signInWithGoogle();
              if (error) {
                toast.error(error.message);
                setGoogleLoading(false);
              }
              // Don't setGoogleLoading(false) on success - redirect will happen
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? 'redirecting...' : 'google.sign_in()'}
          </Button>

          <div className="my-6">
            <div className="w-full border-t border-dashed" />
          </div>

          <div className="text-center space-y-3">
            <div className="text-xs">
              <span className="text-muted-foreground">
                {isLogin ? "// account(does_not_exist) → " : "// account(exists) → "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? 'sign_up' : 'sign_in'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
