import { Link } from 'react-router-dom';
import { Home, Library, User, LogOut, Terminal } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm tracking-tight text-foreground/40">
            <span className="font-normal">manga</span>
            <span className="font-normal">Mapper</span>
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
                    <span className="hidden sm:inline">user</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-dashed font-mono">
                  <DropdownMenuItem className="text-muted-foreground text-xs">
                    <span className="text-syntax-cyan">email:</span> {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dashed" />
                  <DropdownMenuItem asChild>
                    <Link to="/library" className="flex items-center gap-2 cursor-pointer text-xs">
                      <Library className="w-3.5 h-3.5" />
                      {'>'} my_library
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-dashed" />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer gap-2 text-destructive text-xs">
                    <LogOut className="w-3.5 h-3.5" />
                    {'>'} sign_out
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
