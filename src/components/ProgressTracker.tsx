import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AnimeSeries } from '@/types/anime';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Tv, BookOpen, LogIn, RotateCcw } from 'lucide-react';
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
  in_library: boolean;
  updated_at: string;
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  return `${month} ${day} ${year} ${hour12}:${minutes}${ampm}`;
};

export const ProgressTracker = ({ anime }: ProgressTrackerProps) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [inLibrary, setInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingLibrary, setTogglingLibrary] = useState(false);
  
  const [watchedEpisode, setWatchedEpisode] = useState<string>('');
  const [readVolume, setReadVolume] = useState<string>('');
  const [readChapter, setReadChapter] = useState<string>('');
  const [originalValues, setOriginalValues] = useState({ watchedEpisode: '', readVolume: '', readChapter: '' });

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
      setInLibrary(data.in_library);
      const ep = data.last_watched_episode?.toString() || '';
      const vol = data.last_read_volume?.toString() || '';
      const ch = data.last_read_chapter || '';
      setWatchedEpisode(ep);
      setReadVolume(vol);
      setReadChapter(ch);
      setOriginalValues({ watchedEpisode: ep, readVolume: vol, readChapter: ch });
    } else {
      setInLibrary(false);
      setOriginalValues({ watchedEpisode: '', readVolume: '', readChapter: '' });
    }
    setLoading(false);
  };

  const toggleLibrary = async () => {
    if (!user) return;
    
    setTogglingLibrary(true);
    
    if (inLibrary) {
      // Remove from library
      const { error } = await supabase
        .from('anime_progress')
        .update({ in_library: false })
        .eq('anime_id', anime.id)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to remove from library');
        console.error('Error removing from library:', error);
      } else {
        toast.success('Removed from library');
        setInLibrary(false);
      }
    } else {
      // Add to library (upsert with in_library = true)
      const { error } = await supabase
        .from('anime_progress')
        .upsert({
          user_id: user.id,
          anime_id: anime.id,
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

  const saveProgress = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const progressData = {
      user_id: user.id,
      anime_id: anime.id,
      last_watched_episode: watchedEpisode ? parseInt(watchedEpisode) : null,
      last_read_volume: readVolume ? parseInt(readVolume) : null,
      last_read_chapter: readChapter || null,
      in_library: inLibrary,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('anime_progress')
      .upsert(progressData, { onConflict: 'user_id,anime_id' });

    if (error) {
      toast.error('Failed to save progress');
      console.error('Error saving progress:', error);
    } else {
      toast.success('Progress saved');
      setOriginalValues({ watchedEpisode, readVolume, readChapter });
      fetchProgress();
    }
    
    setSaving(false);
  };

  if (!user) {
    return (
      <Card className="border-dashed">
        <div className="terminal-header">
          <span className="text-muted-foreground">// user_progress</span>
        </div>
        <CardContent className="py-6">
          <div className="font-mono">
            <p className="text-muted-foreground text-sm mb-4">
              {'>'} auth_required
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
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center font-mono text-sm">...loading</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <div className="terminal-header">
        <span className="text-muted-foreground">my_progress</span>
      </div>
      <CardContent className="p-4 font-mono space-y-4">
        {/* Library toggle button */}
        <div className="pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLibrary}
            disabled={togglingLibrary}
            className={`font-mono text-xs h-7 ${inLibrary ? 'border-dashed' : 'bg-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent border border-dashed border-border'}`}
          >
            {togglingLibrary ? '...' : inLibrary ? '[✓] in_library' : '[ ] add_to_library'}
          </Button>
        </div>

        {/* Last watched & Last read row */}
        <div className="flex flex-wrap gap-6">
          {/* Last watched */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs">
              <Tv className="w-3.5 h-3.5 text-primary" />
              <span className="text-syntax-cyan">last_watched</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs block mb-1">episode</span>
              <div className="flex items-center gap-2">
                <Input
                  id="watchedEpisode"
                  type="number"
                  min="1"
                  max={anime.totalEpisodes || anime.currentEpisode}
                  placeholder="—"
                  value={watchedEpisode}
                  onChange={(e) => setWatchedEpisode(e.target.value)}
                  className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7"
                />
                <span className="text-muted-foreground text-xs">/{anime.totalEpisodes || anime.currentEpisode}</span>
              </div>
            </div>
          </div>

          {/* Last read */}
          {anime.hasManga && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-syntax-cyan">last_read</span>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">vol</span>
                  <Input
                    id="readVolume"
                    type="number"
                    min="1"
                    placeholder="—"
                    value={readVolume}
                    onChange={(e) => setReadVolume(e.target.value)}
                    className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7"
                  />
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">ch</span>
                  <Input
                    id="readChapter"
                    type="number"
                    min="1"
                    placeholder="—"
                    value={readChapter}
                    onChange={(e) => setReadChapter(e.target.value)}
                    className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {(() => {
              const hasChanges = watchedEpisode !== originalValues.watchedEpisode ||
                readVolume !== originalValues.readVolume ||
                readChapter !== originalValues.readChapter;
              
              const resetChanges = () => {
                setWatchedEpisode(originalValues.watchedEpisode);
                setReadVolume(originalValues.readVolume);
                setReadChapter(originalValues.readChapter);
              };
              
              return (
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={saveProgress} 
                    disabled={saving || !hasChanges}
                    size="sm"
                    className={`font-mono text-xs h-7 ${!hasChanges ? 'bg-transparent text-muted-foreground hover:bg-transparent border border-dashed border-border' : 'border-dashed'}`}
                  >
                    {'✓'} {saving ? 'saving...' : 'save_progress()'}
                  </Button>
                  <Button
                    onClick={resetChanges}
                    disabled={!hasChanges}
                    size="sm"
                    className={`h-7 w-7 p-0 ${!hasChanges ? 'bg-transparent text-muted-foreground hover:bg-transparent border border-dashed border-border' : 'border-dashed'}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            })()}
          </div>
          {progress?.updated_at && (
            <span className="text-muted-foreground text-xs">
              <span className="text-muted-foreground">last_saved:</span>
              <span className="text-syntax-string ml-1">{formatTimestamp(progress.updated_at)}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
