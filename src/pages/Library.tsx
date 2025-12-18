import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getAnimeById } from '@/data/mockAnime';
import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library as LibraryIcon, BookOpen, Tv, Globe, Plus, Trash2, ExternalLink, Hourglass, Link2, Pencil, X, Check } from 'lucide-react';
import { mockAnimeData } from '@/data/mockAnime';
import { SeriesCombobox } from '@/components/SeriesCombobox';
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
  anime_id: string | null;
  series_url: string | null;
}

interface SeriesAssignment {
  animeId: string;
  seriesUrl: string;
  suffix: string;
  existingId?: string; // tracks if this came from an existing DB entry
}

const Library = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [progress, setProgress] = useState<AnimeProgress[]>([]);
  const [readerSites, setReaderSites] = useState<ReaderSite[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add form state
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteNotes, setNewSiteNotes] = useState('');
  const [seriesAssignments, setSeriesAssignments] = useState<SeriesAssignment[]>([{ animeId: '', seriesUrl: '', suffix: '' }]);

  // Edit form state
  const [editingReaderName, setEditingReaderName] = useState<string | null>(null);
  const [editSiteName, setEditSiteName] = useState('');
  const [editSiteUrl, setEditSiteUrl] = useState('');
  const [editSiteNotes, setEditSiteNotes] = useState('');
  const [editSeriesAssignments, setEditSeriesAssignments] = useState<SeriesAssignment[]>([]);

  const activeTab = searchParams.get('tab') || 'progress';
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  const addSeriesRow = () => {
    const baseUrl = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
    setSeriesAssignments([...seriesAssignments, { animeId: '', seriesUrl: baseUrl, suffix: '' }]);
  };

  const updateSeriesAssignment = (index: number, field: 'animeId' | 'seriesUrl' | 'suffix', value: string) => {
    const updated = [...seriesAssignments];
    if (field === 'seriesUrl') {
      // When user edits seriesUrl directly, extract the suffix (part after base URL)
      const baseUrl = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
      const suffix = baseUrl && value.startsWith(baseUrl) ? value.slice(baseUrl.length) : value;
      updated[index].seriesUrl = value;
      updated[index].suffix = suffix;
    } else {
      updated[index][field] = value;
    }
    setSeriesAssignments(updated);
  };

  const handleReaderUrlChange = (newUrl: string) => {
    const oldBase = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
    const newBase = newUrl.trim() ? (newUrl.trim().endsWith('/') ? newUrl.trim() : newUrl.trim() + '/') : '';
    
    setNewSiteUrl(newUrl);
    
    // Update series URLs: keep user's suffix, just change the prefix
    setSeriesAssignments(prev => prev.map(a => {
      // If no suffix tracked yet, try to extract it from current seriesUrl
      let suffix = a.suffix;
      if (!suffix && a.seriesUrl && oldBase && a.seriesUrl.startsWith(oldBase)) {
        suffix = a.seriesUrl.slice(oldBase.length);
      } else if (!suffix && a.seriesUrl && !oldBase) {
        suffix = a.seriesUrl;
      }
      
      return {
        ...a,
        suffix: suffix,
        seriesUrl: newBase + suffix
      };
    }));
  };

  const removeSeriesRow = (index: number) => {
    if (seriesAssignments.length > 1) {
      setSeriesAssignments(seriesAssignments.filter((_, i) => i !== index));
    }
  };

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
      toast.error('Please fill in reader name and URL');
      return;
    }

    // Check if reader with same name already exists
    const existingReader = readerSites.find(
      site => site.name.toLowerCase() === newSiteName.trim().toLowerCase()
    );
    if (existingReader) {
      toast.error('A reader with this name already exists');
      return;
    }

    // Filter valid series assignments (those with an anime selected)
    const validAssignments = seriesAssignments.filter(a => a.animeId);
    
    // If no series assignments, insert one row with null anime_id
    if (validAssignments.length === 0) {
      const { error } = await supabase
        .from('manga_reader_sites')
        .insert({
          user_id: user!.id,
          name: newSiteName.trim(),
          url: newSiteUrl.trim(),
          notes: newSiteNotes.trim() || null,
          anime_id: null,
          series_url: null,
        });

      if (error) {
        toast.error('Failed to add reader site');
        return;
      }
    } else {
      // Insert one row per series assignment
      const inserts = validAssignments.map(assignment => ({
        user_id: user!.id,
        name: newSiteName.trim(),
        url: newSiteUrl.trim(),
        notes: newSiteNotes.trim() || null,
        anime_id: assignment.animeId,
        series_url: assignment.seriesUrl.trim() || null,
      }));

      const { error } = await supabase
        .from('manga_reader_sites')
        .insert(inserts);

      if (error) {
        toast.error('Failed to add reader site');
        return;
      }
    }

    toast.success('Reader site added');
    setNewSiteName('');
    setNewSiteUrl('');
    setNewSiteNotes('');
    setSeriesAssignments([{ animeId: '', seriesUrl: '', suffix: '' }]);
    fetchReaderSites();
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

  // Start editing a reader group
  const startEditingReader = (group: { name: string; url: string; notes: string | null; entries: ReaderSite[] }) => {
    setEditingReaderName(group.name.toLowerCase());
    setEditSiteName(group.name);
    setEditSiteUrl(group.url);
    setEditSiteNotes(group.notes || '');
    
    const seriesEntries = group.entries.filter(e => e.anime_id);
    if (seriesEntries.length > 0) {
      setEditSeriesAssignments(seriesEntries.map(e => ({
        animeId: e.anime_id || '',
        seriesUrl: e.series_url || '',
        suffix: '',
        existingId: e.id
      })));
    } else {
      setEditSeriesAssignments([{ animeId: '', seriesUrl: '', suffix: '' }]);
    }
  };

  const cancelEditingReader = () => {
    setEditingReaderName(null);
    setEditSiteName('');
    setEditSiteUrl('');
    setEditSiteNotes('');
    setEditSeriesAssignments([]);
  };

  const addEditSeriesRow = () => {
    const baseUrl = editSiteUrl.trim() ? (editSiteUrl.trim().endsWith('/') ? editSiteUrl.trim() : editSiteUrl.trim() + '/') : '';
    setEditSeriesAssignments([...editSeriesAssignments, { animeId: '', seriesUrl: baseUrl, suffix: '' }]);
  };

  const updateEditSeriesAssignment = (index: number, field: 'animeId' | 'seriesUrl' | 'suffix', value: string) => {
    const updated = [...editSeriesAssignments];
    if (field === 'seriesUrl') {
      const baseUrl = editSiteUrl.trim() ? (editSiteUrl.trim().endsWith('/') ? editSiteUrl.trim() : editSiteUrl.trim() + '/') : '';
      const suffix = baseUrl && value.startsWith(baseUrl) ? value.slice(baseUrl.length) : value;
      updated[index].seriesUrl = value;
      updated[index].suffix = suffix;
    } else {
      updated[index][field] = value;
    }
    setEditSeriesAssignments(updated);
  };

  const handleEditReaderUrlChange = (newUrl: string) => {
    const oldBase = editSiteUrl.trim() ? (editSiteUrl.trim().endsWith('/') ? editSiteUrl.trim() : editSiteUrl.trim() + '/') : '';
    const newBase = newUrl.trim() ? (newUrl.trim().endsWith('/') ? newUrl.trim() : newUrl.trim() + '/') : '';
    
    setEditSiteUrl(newUrl);
    
    setEditSeriesAssignments(prev => prev.map(a => {
      let suffix = a.suffix;
      if (!suffix && a.seriesUrl && oldBase && a.seriesUrl.startsWith(oldBase)) {
        suffix = a.seriesUrl.slice(oldBase.length);
      } else if (!suffix && a.seriesUrl && !oldBase) {
        suffix = a.seriesUrl;
      }
      
      return {
        ...a,
        suffix: suffix,
        seriesUrl: newBase + suffix
      };
    }));
  };

  const removeEditSeriesRow = (index: number) => {
    if (editSeriesAssignments.length > 1) {
      setEditSeriesAssignments(editSeriesAssignments.filter((_, i) => i !== index));
    }
  };

  const saveReaderEdit = async (originalEntries: ReaderSite[]) => {
    if (!editSiteName.trim() || !editSiteUrl.trim()) {
      toast.error('Please fill in reader name and URL');
      return;
    }

    // Check if new name conflicts with existing (different) reader
    const existingReader = readerSites.find(
      site => site.name.toLowerCase() === editSiteName.trim().toLowerCase() && 
              site.name.toLowerCase() !== editingReaderName
    );
    if (existingReader) {
      toast.error('A reader with this name already exists');
      return;
    }

    const validAssignments = editSeriesAssignments.filter(a => a.animeId);
    const idsToKeep: string[] = [];

    // Update or insert entries
    if (validAssignments.length === 0) {
      // No series assignments - keep one entry with null anime_id
      const existingNullEntry = originalEntries.find(e => !e.anime_id);
      if (existingNullEntry) {
        await supabase
          .from('manga_reader_sites')
          .update({
            name: editSiteName.trim(),
            url: editSiteUrl.trim(),
            notes: editSiteNotes.trim() || null,
          })
          .eq('id', existingNullEntry.id);
        idsToKeep.push(existingNullEntry.id);
      } else {
        const { data } = await supabase
          .from('manga_reader_sites')
          .insert({
            user_id: user!.id,
            name: editSiteName.trim(),
            url: editSiteUrl.trim(),
            notes: editSiteNotes.trim() || null,
            anime_id: null,
            series_url: null,
          })
          .select('id')
          .single();
        if (data) idsToKeep.push(data.id);
      }
    } else {
      // Handle each series assignment
      for (const assignment of validAssignments) {
        if (assignment.existingId) {
          // Update existing
          await supabase
            .from('manga_reader_sites')
            .update({
              name: editSiteName.trim(),
              url: editSiteUrl.trim(),
              notes: editSiteNotes.trim() || null,
              anime_id: assignment.animeId,
              series_url: assignment.seriesUrl.trim() || null,
            })
            .eq('id', assignment.existingId);
          idsToKeep.push(assignment.existingId);
        } else {
          // Insert new
          const { data } = await supabase
            .from('manga_reader_sites')
            .insert({
              user_id: user!.id,
              name: editSiteName.trim(),
              url: editSiteUrl.trim(),
              notes: editSiteNotes.trim() || null,
              anime_id: assignment.animeId,
              series_url: assignment.seriesUrl.trim() || null,
            })
            .select('id')
            .single();
          if (data) idsToKeep.push(data.id);
        }
      }
    }

    // Delete entries that are no longer needed
    const idsToDelete = originalEntries.map(e => e.id).filter(id => !idsToKeep.includes(id));
    if (idsToDelete.length > 0) {
      await supabase
        .from('manga_reader_sites')
        .delete()
        .in('id', idsToDelete);
    }

    toast.success('Reader site updated');
    cancelEditingReader();
    fetchReaderSites();
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
          <span className="text-syntax-cyan">my_library</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/30 border border-dashed">
            <TabsTrigger value="progress" className="gap-2 text-xs font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Hourglass className="w-3.5 h-3.5" />
              progress
            </TabsTrigger>
            <TabsTrigger value="readers" className="gap-2 text-xs font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-3.5 h-3.5" />
              reader_sites
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
                              <span className="text-sm text-syntax-green truncate block">
                                {anime.title}
                              </span>
                              <div className="flex flex-col gap-1.5 mt-2 text-xs">
                                {item.last_watched_episode && (
                                  <div className="flex items-center gap-1.5">
                                    <Tv className="w-3.5 h-3.5 text-primary" />
                                    <span><span className="text-muted-foreground">ep:</span><span className="text-foreground">{item.last_watched_episode}</span></span>
                                  </div>
                                )}
                                {item.last_read_chapter && (
                                  <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                                    <span><span className="text-muted-foreground">vol:</span><span className="text-foreground">{item.last_read_volume}</span></span>
                                    <span className="text-muted-foreground">·</span>
                                    <span><span className="text-muted-foreground">ch:</span><span className="text-foreground">{item.last_read_chapter}</span></span>
                                  </div>
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
                <span className="text-muted-foreground">add_reader</span>
              </div>
              <CardContent className="p-4">
                <form onSubmit={addReaderSite} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="text-xs">
                        <span className="text-syntax-cyan">reader_name</span>
                      </Label>
                      <Input
                        id="siteName"
                        placeholder="e.g., MangaDex"
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                        className="font-mono text-sm border-dashed bg-muted/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteUrl" className="text-xs">
                        <span className="text-syntax-cyan">reader_url</span>
                      </Label>
                      <Input
                        id="siteUrl"
                        type="url"
                        placeholder="https://mangadex.org"
                        value={newSiteUrl}
                        onChange={(e) => handleReaderUrlChange(e.target.value)}
                        className="font-mono text-sm border-dashed bg-muted/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteNotes" className="text-xs">
                      <span className="text-syntax-cyan">notes</span>
                      <span className="text-muted-foreground"> // optional</span>
                    </Label>
                    <Input
                      id="siteNotes"
                      placeholder="e.g., Good for One Piece"
                      value={newSiteNotes}
                      onChange={(e) => setNewSiteNotes(e.target.value)}
                      className="font-mono text-sm border-dashed bg-muted/30"
                    />
                  </div>
                  
                  {/* Series assignment section */}
                  <div className="border-t border-dashed pt-4 mt-4">
                    <p className="text-xs mb-3">
                      <span className="text-syntax-cyan">assign_to</span>
                      <span className="text-muted-foreground"> // optional</span>
                    </p>
                    <div className="space-y-3">
                      {seriesAssignments.map((assignment, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                          <div className="space-y-2">
                            {index === 0 && (
                              <Label className="text-xs">
                                <span className="text-syntax-cyan">series</span>
                              </Label>
                            )}
                            <SeriesCombobox
                              value={assignment.animeId}
                              onValueChange={(val) => updateSeriesAssignment(index, 'animeId', val)}
                              excludeIds={seriesAssignments
                                .filter((_, i) => i !== index)
                                .map(a => a.animeId)
                                .filter(Boolean)}
                            />
                          </div>
                          <div className="space-y-2">
                            {index === 0 && (
                              <Label className="text-xs">
                                <span className="text-syntax-cyan">series_url</span>
                              </Label>
                            )}
                            <Input
                              type="url"
                              placeholder="https://mangadex.org/title/..."
                              value={assignment.seriesUrl}
                              onChange={(e) => updateSeriesAssignment(index, 'seriesUrl', e.target.value)}
                              className="font-mono text-sm border-dashed bg-muted/30"
                            />
                          </div>
                          {seriesAssignments.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSeriesRow(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSeriesRow}
                        className="text-xs border-dashed"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        add_another
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed pt-4 mt-4" />
                  
                  <Button type="submit" className="font-mono text-xs border-dashed">
                    {'>'} add_reader()
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Reader sites list - grouped by name */}
            {readerSites.length > 0 ? (
              <div className="grid gap-3">
                {Object.values(
                  readerSites.reduce((acc, site) => {
                    const key = site.name.toLowerCase();
                    if (!acc[key]) {
                      acc[key] = {
                        name: site.name,
                        url: site.url,
                        notes: site.notes,
                        entries: []
                      };
                    }
                    acc[key].entries.push(site);
                    return acc;
                  }, {} as Record<string, { name: string; url: string; notes: string | null; entries: ReaderSite[] }>)
                ).map((group) => {
                  const seriesEntries = group.entries.filter(e => e.anime_id);
                  const isEditing = editingReaderName === group.name.toLowerCase();
                  
                  // Edit mode
                  if (isEditing) {
                    return (
                      <Card key={group.name} className="border-dashed border-primary/50">
                        <div className="terminal-header flex items-center gap-2">
                          <span className="text-muted-foreground">edit_reader</span>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  <span className="text-syntax-cyan">reader_name</span>
                                </Label>
                                <Input
                                  placeholder="e.g., MangaDex"
                                  value={editSiteName}
                                  onChange={(e) => setEditSiteName(e.target.value)}
                                  className="font-mono text-sm border-dashed bg-muted/30"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  <span className="text-syntax-cyan">reader_url</span>
                                </Label>
                                <Input
                                  type="url"
                                  placeholder="https://mangadex.org"
                                  value={editSiteUrl}
                                  onChange={(e) => handleEditReaderUrlChange(e.target.value)}
                                  className="font-mono text-sm border-dashed bg-muted/30"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">
                                <span className="text-syntax-cyan">notes</span>
                                <span className="text-muted-foreground"> // optional</span>
                              </Label>
                              <Input
                                placeholder="e.g., Good for One Piece"
                                value={editSiteNotes}
                                onChange={(e) => setEditSiteNotes(e.target.value)}
                                className="font-mono text-sm border-dashed bg-muted/30"
                              />
                            </div>
                            
                            {/* Series assignment section */}
                            <div className="border-t border-dashed pt-4 mt-4">
                              <p className="text-xs mb-3">
                                <span className="text-syntax-cyan">assign_to</span>
                                <span className="text-muted-foreground"> // optional</span>
                              </p>
                              <div className="space-y-3">
                                {editSeriesAssignments.map((assignment, index) => (
                                  <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                                    <div className="space-y-2">
                                      {index === 0 && (
                                        <Label className="text-xs">
                                          <span className="text-syntax-cyan">series</span>
                                        </Label>
                                      )}
                                      <SeriesCombobox
                                        value={assignment.animeId}
                                        onValueChange={(val) => updateEditSeriesAssignment(index, 'animeId', val)}
                                        excludeIds={editSeriesAssignments
                                          .filter((_, i) => i !== index)
                                          .map(a => a.animeId)
                                          .filter(Boolean)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      {index === 0 && (
                                        <Label className="text-xs">
                                          <span className="text-syntax-cyan">series_url</span>
                                        </Label>
                                      )}
                                      <Input
                                        type="url"
                                        placeholder="https://mangadex.org/title/..."
                                        value={assignment.seriesUrl}
                                        onChange={(e) => updateEditSeriesAssignment(index, 'seriesUrl', e.target.value)}
                                        className="font-mono text-sm border-dashed bg-muted/30"
                                      />
                                    </div>
                                    {editSeriesAssignments.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEditSeriesRow(index)}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addEditSeriesRow}
                                  className="text-xs border-dashed"
                                >
                                  <Plus className="w-3.5 h-3.5 mr-1" />
                                  add_another
                                </Button>
                              </div>
                            </div>
                            
                            <div className="border-t border-dashed pt-4 mt-4 flex items-center gap-2">
                              <Button 
                                onClick={() => saveReaderEdit(group.entries)} 
                                className="font-mono text-xs border-dashed"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                save_changes()
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={cancelEditingReader} 
                                className="font-mono text-xs border-dashed"
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                cancel
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  
                  // View mode
                  return (
                    <Card key={group.name} className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 text-sm space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className="text-syntax-cyan">reader_name</span>
                                <span className="text-muted-foreground">: </span>
                                <span className="text-syntax-green">{group.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="border-dashed text-xs h-6 px-2"
                                >
                                  <a href={group.url} target="_blank" rel="noopener noreferrer" className="gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    open
                                  </a>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditingReader(group)}
                                  className="text-muted-foreground hover:text-primary h-6 w-6"
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    // Delete all entries for this reader group
                                    group.entries.forEach(entry => deleteReaderSite(entry.id));
                                  }}
                                  className="text-muted-foreground hover:text-destructive h-6 w-6"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            {group.notes && (
                              <div className="text-xs">
                                <span className="text-syntax-cyan">notes</span>
                                <span className="text-muted-foreground">: </span>
                                <span className="text-muted-foreground">{group.notes}</span>
                              </div>
                            )}
                            {seriesEntries.length > 0 && (
                              <div className="border-t border-dashed pt-2 mt-2 space-y-1.5">
                                {seriesEntries.map((entry) => {
                                  const assignedAnime = mockAnimeData.find(a => a.id === entry.anime_id);
                                  if (!assignedAnime) return null;
                                  return (
                                    <div key={entry.id} className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5">
                                        <Link2 className="w-3 h-3 text-primary" />
                                        <span className="text-syntax-green text-xs">{assignedAnime.title}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {entry.series_url && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="border-dashed text-xs h-6 px-2"
                                          >
                                            <a href={entry.series_url} target="_blank" rel="noopener noreferrer" className="gap-1">
                                              <ExternalLink className="w-3 h-3" />
                                              read
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// anime-to-manga</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Library;
