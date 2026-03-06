import { Link } from 'react-router-dom';
import { Home, Library, User, LogOut, Terminal, AtSign, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, signOut } = useAuth();
  const logoText = "mangaMapper";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="group flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
          <span className="text-sm tracking-tight">
            {logoText.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block text-foreground/40 transition-colors duration-150 group-hover:text-accent"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="font-mono text-xs">
            <Link to="/" className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">home</span>
            </Link>
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild className="font-mono text-xs">
                <Link to="/library" className="flex items-center gap-1.5">
                  <Library className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">library</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-mono text-xs gap-1.5 border-dashed">
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{user.email?.split('@')[0] || 'user'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-dashed font-mono">
                  <div className="text-muted-foreground text-xs gap-2 flex items-center px-2 py-1.5">
                    <AtSign className="w-3.5 h-3.5" />
                    {user.email?.split('@')[1] || 'email.com'}
                  </div>
                  <DropdownMenuSeparator className="border-dashed" />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer gap-2 text-destructive text-xs">
                    <LogOut className="w-3.5 h-3.5" />
                    sign_out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" asChild className="font-mono text-xs border-dashed">
              <Link to="/auth">{'>'} sign_in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
