import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface LibrarySectionProps {
  animeId: string;
}

export const LibrarySection = ({ animeId }: LibrarySectionProps) => {
  const { user } = useAuth();
  const [inLibrary, setInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [togglingLibrary, setTogglingLibrary] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLibraryStatus();
    } else {
      setLoading(false);
    }
  }, [user, animeId]);

  const fetchLibraryStatus = async () => {
    const { data, error } = await supabase
      .from('anime_progress')
      .select('in_library')
      .eq('anime_id', animeId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching library status:', error);
    } else if (data) {
      setInLibrary(data.in_library);
    } else {
      setInLibrary(false);
    }
    setLoading(false);
  };

  const toggleLibrary = async () => {
    if (!user) return;
    
    setTogglingLibrary(true);
    
    if (inLibrary) {
      const { error } = await supabase
        .from('anime_progress')
        .update({ in_library: false })
        .eq('anime_id', animeId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to remove from library');
        console.error('Error removing from library:', error);
      } else {
        toast.success('Removed from library');
        setInLibrary(false);
      }
    } else {
      const { error } = await supabase
        .from('anime_progress')
        .upsert({
          user_id: user.id,
          anime_id: animeId,
          in_library: true,
        }, { onConflict: 'user_id,anime_id' });

      if (error) {
        toast.error('Failed to add to library');
        console.error('Error adding to library:', error);
      } else {
        toast.success('Added to library');
        setInLibrary(true);
      }
    }
    
    setTogglingLibrary(false);
  };

  if (!user) {
    return (
      <Card className="border-dashed">
        <div className="terminal-header">
          <span className="text-muted-foreground">my_library</span>
        </div>
        <CardContent className="py-6">
          <div className="font-mono">
            <p className="text-muted-foreground text-sm mb-4">
              !auth_required
            </p>
            <Button asChild className="border-dashed">
              <Link to="/auth" className="text-xs">
                {'>'} sign_in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-dashed">
        <div className="terminal-header">
          <span className="text-muted-foreground">my_library</span>
        </div>
        <CardContent className="p-4">
          <p className="text-muted-foreground font-mono text-sm">...loading</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <div className="terminal-header">
        <span className="text-muted-foreground">my_library</span>
      </div>
      <CardContent className="p-4 font-mono">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLibrary}
          disabled={togglingLibrary}
          className={`font-mono text-xs h-7 ${inLibrary ? 'border-dashed' : 'bg-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent border border-dashed border-border'}`}
        >
          {togglingLibrary ? '...' : inLibrary ? '[✓] in_library' : '[ ] add_to_library'}
        </Button>
      </CardContent>
    </Card>
  );
};
