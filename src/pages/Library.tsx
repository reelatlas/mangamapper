import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getAnimeById } from '@/data/mockAnime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  
  // New reader site form
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
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <LibraryIcon className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">My library</h1>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList>
            <TabsTrigger value="progress" className="gap-2">
              <Tv className="w-4 h-4" />
              My progress
            </TabsTrigger>
            <TabsTrigger value="readers" className="gap-2">
              <Globe className="w-4 h-4" />
              Reader sites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            {progress.length > 0 ? (
              <div className="grid gap-4">
                {progress.map((item) => {
                  const anime = getAnimeById(item.anime_id);
                  if (!anime) return null;
                  
                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={anime.coverImage}
                            alt={anime.title}
                            className="w-16 h-24 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <Link to={`/anime/${anime.id}`} className="hover:text-primary">
                              <h3 className="font-semibold truncate">{anime.title}</h3>
                            </Link>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.last_watched_episode && (
                                <Badge variant="outline" className="gap-1">
                                  <Tv className="w-3 h-3" />
                                  Ep {item.last_watched_episode}
                                </Badge>
                              )}
                              {item.last_read_chapter && (
                                <Badge variant="outline" className="gap-1">
                                  <BookOpen className="w-3 h-3" />
                                  Vol. {item.last_read_volume}, Ch. {item.last_read_chapter}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProgress(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No progress tracked yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Visit an anime page to start tracking
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="readers" className="space-y-6">
            {/* Add new reader site form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add reader site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addReaderSite} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site name</Label>
                      <Input
                        id="siteName"
                        placeholder="e.g., MangaDex"
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteUrl">URL</Label>
                      <Input
                        id="siteUrl"
                        type="url"
                        placeholder="https://mangadex.org"
                        value={newSiteUrl}
                        onChange={(e) => setNewSiteUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteNotes">Notes (optional)</Label>
                    <Input
                      id="siteNotes"
                      placeholder="e.g., Good for One Piece, fast updates"
                      value={newSiteNotes}
                      onChange={(e) => setNewSiteNotes(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Add site</Button>
                </form>
              </CardContent>
            </Card>

            {/* Reader sites list */}
            {readerSites.length > 0 ? (
              <div className="grid gap-4">
                {readerSites.map((site) => (
                  <Card key={site.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{site.name}</h3>
                          {site.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{site.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={site.url} target="_blank" rel="noopener noreferrer" className="gap-1">
                              <ExternalLink className="w-4 h-4" />
                              Visit
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
              <div className="text-center py-16">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reader sites saved yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your favorite manga reading sites above
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>MangaMapper — Your guide from anime to manga</p>
        </div>
      </footer>
    </div>
  );
};

export default Library;
