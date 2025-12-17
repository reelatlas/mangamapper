import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AnimeSeries } from '@/types/anime';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tv, BookOpen, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ProgressTrackerProps {
  anime: AnimeSeries;
}

interface Progress {
  id: string;
  last_watched_episode: number | null;
  last_read_volume: number | null;
  last_read_chapter: string | null;
}

export const ProgressTracker = ({ anime }: ProgressTrackerProps) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [watchedEpisode, setWatchedEpisode] = useState<string>('');
  const [readVolume, setReadVolume] = useState<string>('');
  const [readChapter, setReadChapter] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [user, anime.id]);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('anime_progress')
      .select('*')
      .eq('anime_id', anime.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching progress:', error);
    } else if (data) {
      setProgress(data);
      setWatchedEpisode(data.last_watched_episode?.toString() || '');
      setReadVolume(data.last_read_volume?.toString() || '');
      setReadChapter(data.last_read_chapter || '');
    }
    setLoading(false);
  };

  const saveProgress = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const progressData = {
      user_id: user.id,
      anime_id: anime.id,
      last_watched_episode: watchedEpisode ? parseInt(watchedEpisode) : null,
      last_read_volume: readVolume ? parseInt(readVolume) : null,
      last_read_chapter: readChapter || null,
    };

    const { error } = await supabase
      .from('anime_progress')
      .upsert(progressData, { onConflict: 'user_id,anime_id' });

    if (error) {
      toast.error('Failed to save progress');
      console.error('Error saving progress:', error);
    } else {
      toast.success('Progress saved');
      fetchProgress();
    }
    
    setSaving(false);
  };

  if (!user) {
    return (
      <Card className="border-dashed">
        <div className="terminal-header">
          <span className="text-muted-foreground">// user_progress.json</span>
        </div>
        <CardContent className="py-6">
          <div className="text-center font-mono">
            <p className="text-muted-foreground text-sm mb-4">
              {'>'} authentication_required
            </p>
            <Button asChild className="border-dashed">
              <Link to="/auth" className="gap-2 text-xs">
                <LogIn className="w-3.5 h-3.5" />
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
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center font-mono text-sm">...loading</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <div className="terminal-header">
        <span className="text-muted-foreground">// your_progress.json</span>
      </div>
      <CardContent className="p-4 space-y-4 font-mono">
        <div className="space-y-2">
          <Label htmlFor="watchedEpisode" className="flex items-center gap-2 text-xs">
            <Tv className="w-3.5 h-3.5 text-primary" />
            <span className="text-syntax-cyan">last_watched_episode</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">$</span>
            <Input
              id="watchedEpisode"
              type="number"
              min="1"
              max={anime.totalEpisodes || anime.currentEpisode}
              placeholder={`1 - ${anime.totalEpisodes || anime.currentEpisode}`}
              value={watchedEpisode}
              onChange={(e) => setWatchedEpisode(e.target.value)}
              className="font-mono text-sm border-dashed bg-muted/30"
            />
          </div>
        </div>

        {anime.hasManga && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="readVolume" className="flex items-center gap-2 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-syntax-cyan">last_read_volume</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  id="readVolume"
                  type="number"
                  min="1"
                  placeholder="e.g., 5"
                  value={readVolume}
                  onChange={(e) => setReadVolume(e.target.value)}
                  className="font-mono text-sm border-dashed bg-muted/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="readChapter" className="text-xs">
                <span className="text-syntax-cyan">chapter</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">$</span>
                <Input
                  id="readChapter"
                  placeholder="e.g., 45"
                  value={readChapter}
                  onChange={(e) => setReadChapter(e.target.value)}
                  className="font-mono text-sm border-dashed bg-muted/30"
                />
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={saveProgress} 
          disabled={saving} 
          className="w-full font-mono text-xs border-dashed"
        >
          {'>'} {saving ? 'saving...' : 'save_progress()'}
        </Button>
      </CardContent>
    </Card>
  );
};
