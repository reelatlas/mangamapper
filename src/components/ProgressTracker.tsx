import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AnimeSeries } from '@/types/anime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tv, BookOpen, Save, LogIn } from 'lucide-react';
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Save className="w-5 h-5" />
            Track your progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Sign in to track your watched episodes and manga chapters
            </p>
            <Button asChild>
              <Link to="/auth" className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Save className="w-5 h-5" />
          Your progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="watchedEpisode" className="flex items-center gap-2">
            <Tv className="w-4 h-4" />
            Last watched episode
          </Label>
          <Input
            id="watchedEpisode"
            type="number"
            min="1"
            max={anime.totalEpisodes || anime.currentEpisode}
            placeholder={`1 - ${anime.totalEpisodes || anime.currentEpisode}`}
            value={watchedEpisode}
            onChange={(e) => setWatchedEpisode(e.target.value)}
          />
        </div>

        {anime.hasManga && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="readVolume" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Last read volume
                </Label>
                <Input
                  id="readVolume"
                  type="number"
                  min="1"
                  placeholder="e.g., 5"
                  value={readVolume}
                  onChange={(e) => setReadVolume(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readChapter">Chapter</Label>
                <Input
                  id="readChapter"
                  placeholder="e.g., 45 or 45-46"
                  value={readChapter}
                  onChange={(e) => setReadChapter(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <Button onClick={saveProgress} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save progress'}
        </Button>
      </CardContent>
    </Card>
  );
};
