import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowUpDown, ExternalLink, Link2, Pencil, X, Check, Trash2, Plus, BookDashed, BookOpenText } from 'lucide-react';
import { mockAnimeData } from '@/data/mockAnime';
import { SeriesCombobox } from '@/components/SeriesCombobox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SortOption, SeriesAssignment, ReaderSite, AnimeProgress } from '@/types/library';
import { ViewModeToggle, type ViewMode } from './ViewModeToggle';

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

const normalizeUrl = (url: string): string => url.trim().replace(/\/+$/, '');
const isSeriesUrlDefined = (readerUrl: string, seriesUrl: string | null): boolean => {
  if (!seriesUrl) return false;
  return normalizeUrl(seriesUrl) !== normalizeUrl(readerUrl);
};

interface LibraryGroupedViewProps {
  userId: string;
  readerSites: ReaderSite[];
  progress: AnimeProgress[];
  fetchReaderSites: () => void;
  deleteReaderSite: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const LibraryGroupedView = ({ userId, readerSites, progress, fetchReaderSites, deleteReaderSite, viewMode, onViewModeChange }: LibraryGroupedViewProps) => {
  const [readerSort, setReaderSort] = useState<SortOption>(() => {
    const saved = localStorage.getItem('mangamapper-library-reader-sort');
    return ['alpha-asc', 'alpha-desc', 'date-desc', 'date-asc'].includes(saved || '') ? saved as SortOption : 'date-desc';
  });

  const [editingReaderName, setEditingReaderName] = useState<string | null>(null);
  const [editSiteName, setEditSiteName] = useState('');
  const [editSiteUrl, setEditSiteUrl] = useState('');
  const [editSiteNotes, setEditSiteNotes] = useState('');
  const [editSeriesAssignments, setEditSeriesAssignments] = useState<SeriesAssignment[]>([]);
  const [confirmingDeleteReaderId, setConfirmingDeleteReaderId] = useState<string | null>(null);

  const handleSortChange = (val: string) => {
    if (val) {
      setReaderSort(val as SortOption);
      localStorage.setItem('mangamapper-library-reader-sort', val);
    }
  };

  const sortedReaderGroups = useMemo(() => {
    const grouped = readerSites.reduce((acc, site) => {
      const key = site.name.toLowerCase();
      if (!acc[key]) {
        acc[key] = { name: site.name, url: site.url, notes: site.notes, entries: [], latestUpdatedAt: site.updated_at };
      }
      acc[key].entries.push(site);
      if (new Date(site.updated_at) > new Date(acc[key].latestUpdatedAt)) {
        acc[key].latestUpdatedAt = site.updated_at;
      }
      return acc;
    }, {} as Record<string, { name: string; url: string; notes: string | null; entries: ReaderSite[]; latestUpdatedAt: string }>);
    const groups = Object.values(grouped);
    switch (readerSort) {
      case 'alpha-asc': return groups.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc': return groups.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-asc': return groups.sort((a, b) => new Date(a.latestUpdatedAt).getTime() - new Date(b.latestUpdatedAt).getTime());
      case 'date-desc': default: return groups.sort((a, b) => new Date(b.latestUpdatedAt).getTime() - new Date(a.latestUpdatedAt).getTime());
    }
  }, [readerSites, readerSort]);

  // Unassigned series: in library but not linked to any reader
  const unassignedProgress = useMemo(() => {
    const assignedAnimeIds = new Set(readerSites.filter(s => s.anime_id).map(s => s.anime_id));
    return progress.filter(p => !assignedAnimeIds.has(p.anime_id));
  }, [progress, readerSites]);

  const startEditingReader = (group: { name: string; url: string; notes: string | null; entries: ReaderSite[] }) => {
    setConfirmingDeleteReaderId(null);
    setEditingReaderName(group.name.toLowerCase());
    setEditSiteName(group.name);
    setEditSiteUrl(group.url);
    setEditSiteNotes(group.notes || '');
    const seriesEntries = group.entries.filter(e => e.anime_id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    if (seriesEntries.length > 0) {
      setEditSeriesAssignments(seriesEntries.map(e => ({ animeId: e.anime_id || '', seriesUrl: e.series_url || '', suffix: '', existingId: e.id, userModified: true })));
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
      if (!suffix && a.seriesUrl && oldBase && a.seriesUrl.startsWith(oldBase)) suffix = a.seriesUrl.slice(oldBase.length);
      else if (!suffix && a.seriesUrl && !oldBase) suffix = a.seriesUrl;
      return { ...a, suffix, seriesUrl: newBase + suffix };
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
    const existingReader = readerSites.find(site => site.name.toLowerCase() === editSiteName.trim().toLowerCase() && site.name.toLowerCase() !== editingReaderName);
    if (existingReader) {
      toast.error('A reader with this name already exists');
      return;
    }
    const validAssignments = editSeriesAssignments.filter(a => a.animeId);
    const idsToKeep: string[] = [];
    if (validAssignments.length === 0) {
      const existingNullEntry = originalEntries.find(e => !e.anime_id);
      if (existingNullEntry) {
        await supabase.from('manga_reader_sites').update({ name: editSiteName.trim(), url: editSiteUrl.trim(), notes: editSiteNotes.trim() || null }).eq('id', existingNullEntry.id);
        idsToKeep.push(existingNullEntry.id);
      } else {
        const { data } = await supabase.from('manga_reader_sites').insert({ user_id: userId, name: editSiteName.trim(), url: editSiteUrl.trim(), notes: editSiteNotes.trim() || null, anime_id: null, series_url: null }).select('id').single();
        if (data) idsToKeep.push(data.id);
      }
    } else {
      for (const assignment of validAssignments) {
        if (assignment.existingId) {
          await supabase.from('manga_reader_sites').update({ name: editSiteName.trim(), url: editSiteUrl.trim(), notes: editSiteNotes.trim() || null, anime_id: assignment.animeId, series_url: assignment.seriesUrl.trim() || null }).eq('id', assignment.existingId);
          idsToKeep.push(assignment.existingId);
        } else {
          const { data } = await supabase.from('manga_reader_sites').insert({ user_id: userId, name: editSiteName.trim(), url: editSiteUrl.trim(), notes: editSiteNotes.trim() || null, anime_id: assignment.animeId, series_url: assignment.seriesUrl.trim() || null }).select('id').single();
          if (data) idsToKeep.push(data.id);
        }
      }
    }
    const idsToDelete = originalEntries.map(e => e.id).filter(id => !idsToKeep.includes(id));
    if (idsToDelete.length > 0) {
      await supabase.from('manga_reader_sites').delete().in('id', idsToDelete);
    }
    toast.success('Reader updated');
    cancelEditingReader();
    fetchReaderSites();
  };

  if (readerSites.length === 0 && unassignedProgress.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="ml-auto">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </div>
        </div>
        <div className="text-center py-16 border border-dashed">
          <div className="group cursor-default mx-auto mb-3 w-fit">
            <BookDashed className="w-8 h-8 text-muted-foreground group-hover:hidden" />
            <BookOpenText className="w-8 h-8 text-muted-foreground hidden group-hover:block" />
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="text-muted-foreground">// </span>no_readers_or_series
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {readerSites.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          <ToggleGroup type="single" value={readerSort} onValueChange={handleSortChange} className="gap-1">
            <ToggleGroupItem value="date-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">last_updated</ToggleGroupItem>
            <ToggleGroupItem value="date-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">first_updated</ToggleGroupItem>
          </ToggleGroup>
          <div className="w-px h-5 bg-border mx-1" />
          <ToggleGroup type="single" value={readerSort} onValueChange={handleSortChange} className="gap-1">
            <ToggleGroupItem value="alpha-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">a→z</ToggleGroupItem>
            <ToggleGroupItem value="alpha-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">z→a</ToggleGroupItem>
          </ToggleGroup>
          <div className="ml-auto">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {sortedReaderGroups.map(group => {
          const seriesEntries = group.entries.filter(e => e.anime_id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          const isEditing = editingReaderName === group.name.toLowerCase();

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
                        <Label className="text-xs"><span className="text-syntax-cyan">reader_name</span></Label>
                        <Input placeholder="LINE マンガ" value={editSiteName} onChange={e => setEditSiteName(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs"><span className="text-syntax-cyan">reader_url</span></Label>
                        <Input type="text" placeholder="manga.line.me" value={editSiteUrl} onChange={e => handleEditReaderUrlChange(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">
                        <span className="text-syntax-cyan">notes</span>
                        <span className="text-muted-foreground"> // optional</span>
                      </Label>
                      <Input placeholder="notes..." value={editSiteNotes} onChange={e => setEditSiteNotes(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30" />
                    </div>
                    <div className="border-t border-dashed pt-4 mt-4">
                      <p className="text-xs text-muted-foreground mb-3">assign_to // optional</p>
                      <div className="space-y-6 sm:space-y-3">
                        {editSeriesAssignments.map((assignment, index) => (
                          <div key={index} className="space-y-2">
                            <Label className="text-xs sm:hidden">
                              <span className="text-syntax-cyan">series</span>
                              <span className="text-muted-foreground">{'{'}name,url{'}'}</span>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="min-w-0">
                                {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">series</span></Label>}
                                <SeriesCombobox value={assignment.animeId} onValueChange={val => updateEditSeriesAssignment(index, 'animeId', val)} excludeIds={editSeriesAssignments.filter((_, i) => i !== index).map(a => a.animeId).filter(Boolean)} />
                              </div>
                              <div className="min-w-0">
                                {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">series_url</span></Label>}
                                <div className="flex items-center gap-2">
                                  <Input type="text" placeholder="manga.line.me/title/..." value={assignment.seriesUrl} onChange={e => updateEditSeriesAssignment(index, 'seriesUrl', e.target.value)} className="font-mono text-sm border-dashed bg-muted/30 flex-1 min-w-0" />
                                  {(editSeriesAssignments.length > 1 || assignment.userModified) && (
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeEditSeriesRow(index)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addEditSeriesRow} className="text-xs border-dashed">
                          <Plus className="w-3.5 h-3.5 mr-1" />add_another
                        </Button>
                      </div>
                    </div>
                    <div className="border-t border-dashed pt-4 mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button onClick={() => saveReaderEdit(group.entries)} className="font-mono text-xs border-dashed">
                          <Check className="w-3.5 h-3.5 mr-1" />save_changes()
                        </Button>
                        <Button variant="outline" onClick={cancelEditingReader} className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                          <X className="w-3.5 h-3.5 mr-1" />cancel
                        </Button>
                      </div>
                      {confirmingDeleteReaderId === group.name ? (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { group.entries.forEach(entry => deleteReaderSite(entry.id)); }} className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setConfirmingDeleteReaderId(null)} className="h-10 w-10 text-muted-foreground hover:text-muted-foreground hover:bg-muted">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" onClick={() => setConfirmingDeleteReaderId(group.name)} className="font-mono text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-3.5 h-3.5 mr-1" />delete_reader()
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
                        <Button variant="ghost" size="icon" onClick={() => startEditingReader(group)} className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-6 w-6">
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" asChild className="border-dashed text-xs h-6 px-2">
                          <a href={group.url} target="_blank" rel="noopener noreferrer" className="gap-1">
                            <ExternalLink className="w-3 h-3" />open
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
                        {seriesEntries.map(entry => {
                          const assignedAnime = mockAnimeData.find(a => a.id === entry.anime_id);
                          if (!assignedAnime) return null;
                          const hasDefinedSeriesUrl = isSeriesUrlDefined(group.url, entry.series_url);
                          return (
                            <div key={entry.id} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                                <Link2 className="w-3 h-3 text-primary flex-shrink-0" />
                                <Link to={`/anime/${assignedAnime.id}`} className="text-syntax-green text-xs hover:underline hover:text-primary transition-colors break-all">{assignedAnime.title}</Link>
                              </div>
                              <div className="flex items-center gap-1">
                                {hasDefinedSeriesUrl ? (
                                  <Button variant="outline" size="sm" asChild className="border-dashed text-xs h-6 px-2">
                                    <a href={entry.series_url!} target="_blank" rel="noopener noreferrer" className="gap-1">
                                      <ExternalLink className="w-3 h-3" />read
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-xs text-muted-foreground h-6 flex items-center">series_url(null)</span>
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

      {/* Unassigned series */}
      {unassignedProgress.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">// unassigned_series ({unassignedProgress.length})</p>
          <div className="grid gap-2">
            {unassignedProgress.map(item => {
              const anime = mockAnimeData.find(a => a.id === item.anime_id);
              if (!anime) return null;
              return (
                <Link key={item.id} to={`/anime/${anime.id}`} className="block">
                  <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={anime.coverImage} alt={anime.title} className="w-8 h-12 object-cover opacity-90 shrink-0" />
                        <span className="text-sm text-syntax-green line-clamp-1">{anime.title}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
