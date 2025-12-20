import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface LocationState {
  openAddReader?: boolean;
  preSelectAnimeId?: string;
}
import { Header } from '@/components/Header';
import { useLibraryData } from '@/hooks/useLibraryData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink, Link2, Pencil, X, Check, ArrowUpDown, Glasses, EyeClosed } from 'lucide-react';
import { mockAnimeData } from '@/data/mockAnime';
import { SeriesCombobox } from '@/components/SeriesCombobox';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { SortOption, SeriesAssignment, ReaderSite } from '@/types/library';

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

const Readers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const { user } = useAuth();
  const { authLoading, loading, readerSites, fetchReaderSites, deleteReaderSite } = useLibraryData();

  const [readerSort, setReaderSort] = useState<SortOption>(() => {
    const saved = localStorage.getItem('mangamapper-library-reader-sort');
    return (['alpha-asc', 'alpha-desc', 'date-desc', 'date-asc'].includes(saved || '')) ? saved as SortOption : 'date-desc';
  });

  // Add form state
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteNotes, setNewSiteNotes] = useState('');
  const [seriesAssignments, setSeriesAssignments] = useState<SeriesAssignment[]>([{ animeId: '', seriesUrl: '', suffix: '', userModified: false }]);

  // Edit form state
  const [editingReaderName, setEditingReaderName] = useState<string | null>(null);
  const [editSiteName, setEditSiteName] = useState('');
  const [editSiteUrl, setEditSiteUrl] = useState('');
  const [editSiteNotes, setEditSiteNotes] = useState('');
  const [editSeriesAssignments, setEditSeriesAssignments] = useState<SeriesAssignment[]>([]);
  const [confirmingDeleteReaderId, setConfirmingDeleteReaderId] = useState<string | null>(null);
  const [showAddReaderForm, setShowAddReaderForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('mangamapper-library-reader-sort', readerSort);
  }, [readerSort]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Handle deep link from anime detail page
  useEffect(() => {
    if (locationState?.openAddReader) {
      setShowAddReaderForm(true);
      
      if (locationState.preSelectAnimeId) {
        setSeriesAssignments([{ 
          animeId: locationState.preSelectAnimeId, 
          seriesUrl: '', 
          suffix: '', 
          userModified: true 
        }]);
      }
      
      // Clear the state so refreshing doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [locationState]);

  const addSeriesRow = () => {
    const baseUrl = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
    setSeriesAssignments([...seriesAssignments, { animeId: '', seriesUrl: baseUrl, suffix: '', userModified: false }]);
  };

  const updateSeriesAssignment = (index: number, field: 'animeId' | 'seriesUrl' | 'suffix', value: string) => {
    const updated = [...seriesAssignments];
    if (field === 'seriesUrl') {
      const baseUrl = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
      const suffix = baseUrl && value.startsWith(baseUrl) ? value.slice(baseUrl.length) : value;
      updated[index].seriesUrl = value;
      updated[index].suffix = suffix;
      updated[index].userModified = true;
    } else if (field === 'animeId') {
      updated[index].animeId = value;
      updated[index].userModified = true;
    } else {
      updated[index][field] = value;
    }
    setSeriesAssignments(updated);
  };

  const handleReaderUrlChange = (newUrl: string) => {
    const oldBase = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
    const newBase = newUrl.trim() ? (newUrl.trim().endsWith('/') ? newUrl.trim() : newUrl.trim() + '/') : '';
    
    setNewSiteUrl(newUrl);
    
    setSeriesAssignments(prev => prev.map(a => {
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
    } else {
      const baseUrl = newSiteUrl.trim() ? (newSiteUrl.trim().endsWith('/') ? newSiteUrl.trim() : newSiteUrl.trim() + '/') : '';
      setSeriesAssignments([{ animeId: '', seriesUrl: baseUrl, suffix: '', userModified: false }]);
    }
  };

  const sortedReaderGroups = useMemo(() => {
    const grouped = readerSites.reduce((acc, site) => {
      const key = site.name.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          name: site.name,
          url: site.url,
          notes: site.notes,
          entries: [],
          latestUpdatedAt: site.updated_at
        };
      }
      acc[key].entries.push(site);
      if (new Date(site.updated_at) > new Date(acc[key].latestUpdatedAt)) {
        acc[key].latestUpdatedAt = site.updated_at;
      }
      return acc;
    }, {} as Record<string, { name: string; url: string; notes: string | null; entries: ReaderSite[]; latestUpdatedAt: string }>);

    const groups = Object.values(grouped);
    
    switch (readerSort) {
      case 'alpha-asc':
        return groups.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return groups.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-asc':
        return groups.sort((a, b) => new Date(a.latestUpdatedAt).getTime() - new Date(b.latestUpdatedAt).getTime());
      case 'date-desc':
      default:
        return groups.sort((a, b) => new Date(b.latestUpdatedAt).getTime() - new Date(a.latestUpdatedAt).getTime());
    }
  }, [readerSites, readerSort]);

  const addReaderSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteUrl.trim()) {
      toast.error('Please fill in reader name and URL');
      return;
    }

    const existingReader = readerSites.find(
      site => site.name.toLowerCase() === newSiteName.trim().toLowerCase()
    );
    if (existingReader) {
      toast.error('A reader with this name already exists');
      return;
    }

    const validAssignments = seriesAssignments.filter(a => a.animeId);
    
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
    setSeriesAssignments([{ animeId: '', seriesUrl: '', suffix: '', userModified: false }]);
    setShowAddReaderForm(false);
    fetchReaderSites();
  };

  const startEditingReader = (group: { name: string; url: string; notes: string | null; entries: ReaderSite[] }) => {
    setConfirmingDeleteReaderId(null);
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
        existingId: e.id,
        userModified: true
      })));
    } else {
      setEditSeriesAssignments([{ animeId: '', seriesUrl: '', suffix: '', userModified: false }]);
    }
  };

  const cancelEditingReader = () => {
    setEditingReaderName(null);
    setEditSiteName('');
    setEditSiteUrl('');
    setEditSiteNotes('');
    setEditSeriesAssignments([]);
    setConfirmingDeleteReaderId(null);
  };

  const cancelAddReader = () => {
    setNewSiteName('');
    setNewSiteUrl('');
    setNewSiteNotes('');
    setSeriesAssignments([{ animeId: '', seriesUrl: '', suffix: '', userModified: false }]);
    setShowAddReaderForm(false);
  };

  const addEditSeriesRow = () => {
    const baseUrl = editSiteUrl.trim() ? (editSiteUrl.trim().endsWith('/') ? editSiteUrl.trim() : editSiteUrl.trim() + '/') : '';
    setEditSeriesAssignments([...editSeriesAssignments, { animeId: '', seriesUrl: baseUrl, suffix: '', userModified: false }]);
  };

  const updateEditSeriesAssignment = (index: number, field: 'animeId' | 'seriesUrl' | 'suffix', value: string) => {
    const updated = [...editSeriesAssignments];
    if (field === 'seriesUrl') {
      const baseUrl = editSiteUrl.trim() ? (editSiteUrl.trim().endsWith('/') ? editSiteUrl.trim() : editSiteUrl.trim() + '/') : '';
      const suffix = baseUrl && value.startsWith(baseUrl) ? value.slice(baseUrl.length) : value;
      updated[index].seriesUrl = value;
      updated[index].suffix = suffix;
      updated[index].userModified = true;
    } else if (field === 'animeId') {
      updated[index].animeId = value;
      updated[index].userModified = true;
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
    } else {
      const baseUrl = editSiteUrl.trim() ? (editSiteUrl.trim().endsWith('/') ? editSiteUrl.trim() : editSiteUrl.trim() + '/') : '';
      setEditSeriesAssignments([{ animeId: '', seriesUrl: baseUrl, suffix: '', userModified: false }]);
    }
  };

  const saveReaderEdit = async (originalEntries: ReaderSite[]) => {
    if (!editSiteName.trim() || !editSiteUrl.trim()) {
      toast.error('Please fill in reader name and URL');
      return;
    }

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

    if (validAssignments.length === 0) {
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
      for (const assignment of validAssignments) {
        if (assignment.existingId) {
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
          <Glasses className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">my_readers</span>
        </div>

        <div className="space-y-6">
          {/* Add new reader site form */}
          {!showAddReaderForm ? (
            <Button
              onClick={() => setShowAddReaderForm(true)}
              variant="outline"
              className="font-mono text-xs border-dashed"
            >
              {'>'} new_reader
            </Button>
          ) : (
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
                        placeholder="LINE マンガ"
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
                        type="text"
                        placeholder="manga.line.me"
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
                      placeholder="best Berserk scans for golden age arc"
                      value={newSiteNotes}
                      onChange={(e) => setNewSiteNotes(e.target.value)}
                      className="font-mono text-sm border-dashed bg-muted/30"
                    />
                  </div>
                  
                  {/* Series assignment section */}
                  <div className="border-t border-dashed pt-4 mt-4">
                    <p className="text-xs text-muted-foreground mb-3">
                      assign_to // optional
                    </p>
                    <div className="space-y-6 sm:space-y-3">
                      {seriesAssignments.map((assignment, index) => (
                        <div key={index} className="space-y-2">
                          {/* Mobile: Combined label for each row */}
                          <Label className="text-xs sm:hidden">
                            <span className="text-syntax-cyan">series</span>
                            <span className="text-muted-foreground">{'{'}name,url{'}'}</span>
                          </Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="min-w-0">
                              {/* Desktop: Show series label only on first row */}
                              {index === 0 && (
                                <Label className="text-xs hidden sm:block mb-1.5">
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
                            <div className="min-w-0">
                              {/* Desktop: Show series_url label only on first row */}
                              {index === 0 && (
                                <Label className="text-xs hidden sm:block mb-1.5">
                                  <span className="text-syntax-cyan">series_url</span>
                                </Label>
                              )}
                              <div className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  placeholder="manga.line.me/title/..."
                                  value={assignment.seriesUrl}
                                  onChange={(e) => updateSeriesAssignment(index, 'seriesUrl', e.target.value)}
                                  className="font-mono text-sm border-dashed bg-muted/30 flex-1 min-w-0"
                                />
                                {(seriesAssignments.length > 1 || assignment.userModified) && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSeriesRow(index)}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
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
                  
                  <div className="flex gap-2">
                    <Button type="submit" className="font-mono text-xs border-dashed">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      add_reader()
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelAddReader}
                      className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reader sites list - grouped by name */}
          {readerSites.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                
                <ToggleGroup 
                  type="single" 
                  value={readerSort} 
                  onValueChange={(val) => val && setReaderSort(val as SortOption)}
                  className="gap-1"
                >
                  <ToggleGroupItem value="date-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">last_updated</ToggleGroupItem>
                  <ToggleGroupItem value="date-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">first_updated</ToggleGroupItem>
                </ToggleGroup>
                
                <div className="w-px h-5 bg-border mx-1" />
                
                <ToggleGroup 
                  type="single" 
                  value={readerSort} 
                  onValueChange={(val) => val && setReaderSort(val as SortOption)}
                  className="gap-1"
                >
                  <ToggleGroupItem value="alpha-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">a→z</ToggleGroupItem>
                  <ToggleGroupItem value="alpha-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">z→a</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="grid gap-3">
                {sortedReaderGroups.map((group) => {
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
                                  placeholder="LINE マンガ"
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
                                  type="text"
                                  placeholder="manga.line.me"
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
                                placeholder="best Berserk scans for golden age arc"
                                value={editSiteNotes}
                                onChange={(e) => setEditSiteNotes(e.target.value)}
                                className="font-mono text-sm border-dashed bg-muted/30"
                              />
                            </div>
                            
                            {/* Series assignment section */}
                            <div className="border-t border-dashed pt-4 mt-4">
                              <p className="text-xs text-muted-foreground mb-3">
                                assign_to // optional
                              </p>
                              <div className="space-y-6 sm:space-y-3">
                                {editSeriesAssignments.map((assignment, index) => (
                                  <div key={index} className="space-y-2">
                                    {/* Mobile: Combined label for each row */}
                                    <Label className="text-xs sm:hidden">
                                      <span className="text-syntax-cyan">series</span>
                                      <span className="text-muted-foreground">{'{'}name,url{'}'}</span>
                                    </Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="min-w-0">
                                        {/* Desktop: Show series label only on first row */}
                                        {index === 0 && (
                                          <Label className="text-xs hidden sm:block mb-1.5">
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
                                      <div className="min-w-0">
                                        {/* Desktop: Show series_url label only on first row */}
                                        {index === 0 && (
                                          <Label className="text-xs hidden sm:block mb-1.5">
                                            <span className="text-syntax-cyan">series_url</span>
                                          </Label>
                                        )}
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="text"
                                            placeholder="manga.line.me/title/..."
                                            value={assignment.seriesUrl}
                                            onChange={(e) => updateEditSeriesAssignment(index, 'seriesUrl', e.target.value)}
                                            className="font-mono text-sm border-dashed bg-muted/30 flex-1 min-w-0"
                                          />
                                          {(editSeriesAssignments.length > 1 || assignment.userModified) && (
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => removeEditSeriesRow(index)}
                                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
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
                            
                            <div className="border-t border-dashed pt-4 mt-4 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
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
                                  className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                                >
                                  <X className="w-3.5 h-3.5 mr-1" />
                                  cancel
                                </Button>
                              </div>
                              {confirmingDeleteReaderId === group.name ? (
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      group.entries.forEach(entry => deleteReaderSite(entry.id));
                                    }}
                                    className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setConfirmingDeleteReaderId(null)}
                                    className="h-10 w-10 text-muted-foreground hover:text-muted-foreground hover:bg-muted"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="ghost"
                                  onClick={() => setConfirmingDeleteReaderId(group.name)}
                                  className="font-mono text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                  delete_reader()
                                </Button>
                              )}
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
                              <div className="overflow-hidden min-w-0">
                                <span className="text-syntax-cyan">reader_name</span>
                                <span className="text-muted-foreground">: </span>
                                <span className="text-syntax-green break-all">{group.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditingReader(group)}
                                  className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-6 w-6"
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
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
                              </div>
                            </div>
                            {group.notes && (
                              <div className="text-xs overflow-hidden pr-28">
                                <span className="text-syntax-cyan">notes</span>
                                <span className="text-muted-foreground">: </span>
                                <span className="text-muted-foreground break-all">{group.notes}</span>
                              </div>
                            )}
                            <div className="text-xs overflow-hidden pr-28">
                              <span className="text-syntax-cyan">last_updated</span>
                              <span className="text-muted-foreground">: </span>
                              <span className="text-muted-foreground break-all">{formatTimestamp(group.latestUpdatedAt)}</span>
                            </div>
                            {seriesEntries.length > 0 && (
                              <div className="border-t border-dashed pt-2 mt-2 space-y-1.5">
                                {seriesEntries.map((entry) => {
                                  const assignedAnime = mockAnimeData.find(a => a.id === entry.anime_id);
                                  if (!assignedAnime) return null;
                                  return (
                                    <div key={entry.id} className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                                        <Link2 className="w-3 h-3 text-primary flex-shrink-0" />
                                        <Link to={`/anime/${assignedAnime.id}`} className="text-syntax-green text-xs hover:underline hover:text-primary transition-colors break-all">{assignedAnime.title}</Link>
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
            </>
          ) : (
            <div className="text-center py-16 border border-dashed">
              <EyeClosed className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                <span className="text-muted-foreground">// </span>no_reader_found
              </p>
              <button 
                onClick={() => setShowAddReaderForm(true)}
                className="text-xs text-muted-foreground mt-2 hover:text-accent transition-colors cursor-pointer"
              >
                {'>'} new_reader
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// find your next chapter</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Readers;
