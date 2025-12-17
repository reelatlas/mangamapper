import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getAnimeById } from '@/data/mockAnime';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library as LibraryIcon, BookOpen, Tv, Globe, Plus, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface AnimeProgress {
  id: string;
  anime_id: string;
  last_watched_episode: number | null;
  last_read_volume: number | null;
  last_read_chapter: string | null;
  updated_at: string;
}

interface ReaderSite {
  id: string;
  name: string;
  url: string;
  notes: string | null;
}

const Library = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<AnimeProgress[]>([]);
  const [readerSites, setReaderSites] = useState<ReaderSite[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteNotes, setNewSiteNotes] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchProgress(), fetchReaderSites()]);
    setLoading(false);
  };

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('anime_progress')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data || []);
    }
  };

  const fetchReaderSites = async () => {
    const { data, error } = await supabase
      .from('manga_reader_sites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reader sites:', error);
    } else {
      setReaderSites(data || []);
    }
  };

  const addReaderSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteUrl.trim()) {
      toast.error('Please fill in site name and URL');
      return;
    }

    const { error } = await supabase
      .from('manga_reader_sites')
      .insert({
        user_id: user!.id,
        name: newSiteName.trim(),
        url: newSiteUrl.trim(),
        notes: newSiteNotes.trim() || null,
      });

    if (error) {
      toast.error('Failed to add reader site');
    } else {
      toast.success('Reader site added');
      setNewSiteName('');
      setNewSiteUrl('');
      setNewSiteNotes('');
      fetchReaderSites();
    }
  };

  const deleteReaderSite = async (id: string) => {
    const { error } = await supabase
      .from('manga_reader_sites')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete reader site');
    } else {
      toast.success('Reader site removed');
      fetchReaderSites();
    }
  };

  const deleteProgress = async (id: string) => {
    const { error } = await supabase
      .from('anime_progress')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to remove from library');
    } else {
      toast.success('Removed from library');
      fetchProgress();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-sm">...loading</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <LibraryIcon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">user_library</span>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="bg-muted/30 border border-dashed">
            <TabsTrigger value="progress" className="gap-2 text-xs font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Tv className="w-3.5 h-3.5" />
              /progress
            </TabsTrigger>
            <TabsTrigger value="readers" className="gap-2 text-xs font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-3.5 h-3.5" />
              /reader_sites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            {progress.length > 0 ? (
              <div className="grid gap-3">
                {progress.map((item) => {
                  const anime = getAnimeById(item.anime_id);
                  if (!anime) return null;
                  
                    return (
                    <Link key={item.id} to={`/anime/${anime.id}`} className="block">
                      <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={anime.coverImage}
                              alt={anime.title}
                              className="w-14 h-20 object-cover opacity-90"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm truncate block">
                                <span className="text-syntax-cyan">title</span>
                                <span className="text-muted-foreground">: </span>
                                <span className="text-syntax-green">{anime.title}</span>
                              </span>
                              <div className="flex flex-wrap gap-6 mt-2 text-xs">
                                {item.last_watched_episode && (
                                  <span>
                                    <span className="text-syntax-cyan">ep</span>
                                    <span className="text-muted-foreground">:</span>
                                    <span className="text-foreground">{item.last_watched_episode}</span>
                                  </span>
                                )}
                                {item.last_read_chapter && (
                                  <span>
                                    <span className="text-syntax-cyan">vol</span>
                                    <span className="text-muted-foreground">:</span>
                                    <span className="text-foreground">{item.last_read_volume}</span>
                                    <span className="text-muted-foreground"> · </span>
                                    <span className="text-syntax-cyan">ch</span>
                                    <span className="text-muted-foreground">:</span>
                                    <span className="text-foreground">{item.last_read_chapter}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteProgress(item.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed">
                <Tv className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  <span className="text-syntax-cyan">// </span>no progress tracked
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {'>'} visit an anime page to start
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="readers" className="space-y-6">
            {/* Add new reader site form */}
            <Card className="border-dashed">
              <div className="terminal-header flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span className="text-muted-foreground">add_reader_site</span>
              </div>
              <CardContent className="p-4">
                <form onSubmit={addReaderSite} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="text-xs">
                        <span className="text-syntax-cyan">name</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="siteName"
                          placeholder="e.g., MangaDex"
                          value={newSiteName}
                          onChange={(e) => setNewSiteName(e.target.value)}
                          className="font-mono text-sm border-dashed bg-muted/30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteUrl" className="text-xs">
                        <span className="text-syntax-cyan">url</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">$</span>
                        <Input
                          id="siteUrl"
                          type="url"
                          placeholder="https://mangadex.org"
                          value={newSiteUrl}
                          onChange={(e) => setNewSiteUrl(e.target.value)}
                          className="font-mono text-sm border-dashed bg-muted/30"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteNotes" className="text-xs">
                      <span className="text-syntax-cyan">notes</span>
                      <span className="text-muted-foreground"> // optional</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">$</span>
                      <Input
                        id="siteNotes"
                        placeholder="e.g., Good for One Piece"
                        value={newSiteNotes}
                        onChange={(e) => setNewSiteNotes(e.target.value)}
                        className="font-mono text-sm border-dashed bg-muted/30"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="font-mono text-xs border-dashed">
                    {'>'} add_site()
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Reader sites list */}
            {readerSites.length > 0 ? (
              <div className="grid gap-3">
                {readerSites.map((site) => (
                  <Card key={site.id} className="border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0 text-sm">
                          <span className="text-syntax-cyan">name</span>
                          <span className="text-muted-foreground">: </span>
                          <span className="text-syntax-green">{site.name}</span>
                          {site.notes && (
                            <>
                              <span className="text-muted-foreground"> · </span>
                              <span className="text-syntax-cyan">notes</span>
                              <span className="text-muted-foreground">: </span>
                              <span className="text-syntax-green text-xs">{site.notes}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-dashed text-xs"
                          >
                            <a href={site.url} target="_blank" rel="noopener noreferrer" className="gap-1">
                              <ExternalLink className="w-3.5 h-3.5" />
                              open
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteReaderSite(site.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed">
                <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  <span className="text-syntax-cyan">// </span>no reader sites saved
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {'>'} add your favorite manga sites above
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-primary">mangaMapper</span>
            <span className="mx-2">—</span>
            <span>// your guide from anime to manga</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Library;
