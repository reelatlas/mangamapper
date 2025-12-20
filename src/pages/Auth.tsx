import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Terminal, Mail, Lock } from 'lucide-react';
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
  const { signIn, signUp, user } = useAuth();
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
          toast.success('Welcome back!');
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
              // {isLogin ? 'sign_in to view progress' : 'sign_up to start tracking'}
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
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono text-sm border-dashed bg-muted/30"
                required
              />
            </div>
            <Button type="submit" className="w-full font-mono text-xs border-dashed" disabled={loading}>
              {loading ? 'processing...' : isLogin ? 'sign_in()' : 'sign_up()'}
            </Button>
          </form>

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
