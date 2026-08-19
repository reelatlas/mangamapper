import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Glasses, ExternalLink, Pencil, Check, X, Plus, Trash2, RotateCcw } from 'lucide-react';
import { TvIcon as Tv, BookOpenIcon as BookOpen } from '@/components/icons';
import { toast } from 'sonner';
import { AnimeSeries } from '@/types/anime';
import type { ReaderSite, ReaderAssignment } from '@/types/library';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectItem, SelectScrollUpButton, SelectScrollDownButton, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InlineNewReaderForm } from '@/components/library/InlineNewReaderForm';
import { PositionLabel } from '@/components/PositionLabel';
import { formatTimestamp } from '@/lib/format';
import type { TablesInsert } from '@/integrations/supabase/types';

interface CollectionSectionProps {
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

interface ReaderOption {
  key: string;
  name: string;
  url: string;
}

export const CollectionSection = ({ anime }: CollectionSectionProps) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [inLibrary, setInLibrary] = useState(false);
  const [linkedReaders, setLinkedReaders] = useState<ReaderSite[]>([]);
  const [allReaderSites, setAllReaderSites] = useState<ReaderSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingLibrary, setTogglingLibrary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReaderHovered, setIsReaderHovered] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  // Edit state (readers only)
  const [editReaderAssignments, setEditReaderAssignments] = useState<ReaderAssignment[]>([]);
  const [saving, setSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [showInlineNewReader, setShowInlineNewReader] = useState(false);
  const [newlyCreatedReader, setNewlyCreatedReader] = useState<{ name: string; url: string } | null>(null);

  // Always-visible progress inputs
  const [watchedEpisode, setWatchedEpisode] = useState('');
  const [readVolume, setReadVolume] = useState('');
  const [readChapter, setReadChapter] = useState('');

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    const [progressRes, linkedRes, allReadersRes] = await Promise.all([
      supabase.from('anime_progress').select('*').eq('anime_id', anime.id).maybeSingle(),
      supabase.from('manga_reader_sites').select('*').eq('anime_id', anime.id).not('series_url', 'is', null),
      supabase.from('manga_reader_sites').select('*').order('created_at', { ascending: true }),
    ]);

    if (progressRes.data) {
      setProgress(progressRes.data);
      setInLibrary(progressRes.data.in_library);
    } else {
      setProgress(null);
      setInLibrary(false);
    }
    setLinkedReaders(linkedRes.data || []);
    setAllReaderSites(allReadersRes.data || []);
    setLoading(false);
  }, [user, anime.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Sync progress inputs when data loads
  useEffect(() => {
    if (progress) {
      setWatchedEpisode(progress.last_watched_episode?.toString() ?? '');
      setReadVolume(progress.last_read_volume?.toString() ?? '');
      setReadChapter(progress.last_read_chapter ?? '');
    } else {
      setWatchedEpisode('');
      setReadVolume('');
      setReadChapter('');
    }
  }, [progress]);

  const isProgressDirty = (() => {
    const origEp = progress?.last_watched_episode?.toString() ?? '';
    const origVol = progress?.last_read_volume?.toString() ?? '';
    const origCh = progress?.last_read_chapter ?? '';
    return watchedEpisode !== origEp || readVolume !== origVol || readChapter !== origCh;
  })();

  const resetProgress = () => {
    setWatchedEpisode(progress?.last_watched_episode?.toString() ?? '');
    setReadVolume(progress?.last_read_volume?.toString() ?? '');
    setReadChapter(progress?.last_read_chapter ?? '');
  };

  const saveProgress = async () => {
    if (!user) return;
    setSavingProgress(true);
    const update: TablesInsert<'anime_progress'> = {
      user_id: user.id,
      anime_id: anime.id,
      updated_at: new Date().toISOString(),
      last_watched_episode: watchedEpisode.trim() ? parseInt(watchedEpisode.trim(), 10) : null,
    };
    if (anime.hasManga) {
      update.last_read_volume = readVolume.trim() ? parseInt(readVolume.trim(), 10) : null;
      update.last_read_chapter = readChapter.trim() || null;
    }
    const { error } = await supabase.from('anime_progress').upsert(update, { onConflict: 'user_id,anime_id' });
    if (error) {
      toast.error('Failed to save progress');
    } else {
      toast.success('Progress saved');
      fetchData();
    }
    setSavingProgress(false);
  };

  const readerOptions: ReaderOption[] = useMemo(() => {
    const distinct = [...new Map(allReaderSites.map(r => [r.name.toLowerCase(), r])).values()];
    const options = distinct.map(r => ({ key: `${r.name.toLowerCase()}|${r.url}`, name: r.name, url: r.url }));
    if (newlyCreatedReader && !options.find(o => o.name.toLowerCase() === newlyCreatedReader.name.toLowerCase())) {
      options.push({ key: `${newlyCreatedReader.name.toLowerCase()}|${newlyCreatedReader.url}`, name: newlyCreatedReader.name, url: newlyCreatedReader.url });
    }
    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [allReaderSites, newlyCreatedReader]);

  const toggleLibrary = async () => {
    if (!user) return;
    setTogglingLibrary(true);

    if (inLibrary) {
      const { error } = await supabase.from('anime_progress').update({ in_library: false }).eq('anime_id', anime.id).eq('user_id', user.id);
      if (error) {
        toast.error('Failed to remove from library');
      } else {
        await supabase.from('manga_reader_sites').delete().eq('user_id', user.id).eq('anime_id', anime.id);
        toast.success('Removed from library');
        setInLibrary(false);
        setLinkedReaders([]);
      }
    } else {
      const { error } = await supabase.from('anime_progress').upsert({ user_id: user.id, anime_id: anime.id, in_library: true }, { onConflict: 'user_id,anime_id' });
      if (error) {
        toast.error('Failed to add to library');
      } else {
        toast.success('Added to library');
        setInLibrary(true);
      }
    }
    setTogglingLibrary(false);
  };

  const startEditing = () => {
    setShowInlineNewReader(false);

    if (linkedReaders.length > 0) {
      setEditReaderAssignments(linkedReaders.map(r => ({
        readerName: r.name,
        readerUrl: r.url,
        seriesUrl: r.series_url || '',
        suffix: '',
        existingSiteId: r.id,
        userModified: true,
      })));
    } else {
      setEditReaderAssignments([{ readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false }]);
    }
    setConfirmRemove(false);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setShowInlineNewReader(false);
    setConfirmRemove(false);
  };

  const addReaderRow = () => {
    setEditReaderAssignments([...editReaderAssignments, { readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false }]);
  };

  const handleReaderSelect = (index: number, key: string) => {
    if (key === '__new_reader__') { setShowInlineNewReader(true); return; }
    const option = readerOptions.find(o => o.key === key);
    if (!option) return;
    setShowInlineNewReader(false);
    const updated = [...editReaderAssignments];
    updated[index] = { ...updated[index], readerName: option.name, readerUrl: option.url, seriesUrl: option.url.endsWith('/') ? option.url : option.url + '/', suffix: '', userModified: true };
    setEditReaderAssignments(updated);
  };

  const handleNewReaderCreated = (readerName: string, readerUrl: string) => {
    setNewlyCreatedReader({ name: readerName, url: readerUrl });
    setShowInlineNewReader(false);
    const emptyIndex = editReaderAssignments.findIndex(a => !a.readerName);
    const baseUrl = readerUrl ? (readerUrl.endsWith('/') ? readerUrl : readerUrl + '/') : '';
    const newAssignment: ReaderAssignment = { readerName, readerUrl, seriesUrl: baseUrl, suffix: '', userModified: true };
    if (emptyIndex >= 0) {
      const updated = [...editReaderAssignments];
      updated[emptyIndex] = newAssignment;
      setEditReaderAssignments(updated);
    } else {
      setEditReaderAssignments([...editReaderAssignments, newAssignment]);
    }
    fetchData();
  };

  const handleSeriesUrlChange = (index: number, value: string) => {
    const updated = [...editReaderAssignments];
    const baseUrl = updated[index].readerUrl.trim();
    const base = baseUrl ? (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') : '';
    const suffix = base && value.startsWith(base) ? value.slice(base.length) : value;
    updated[index] = { ...updated[index], seriesUrl: value, suffix, userModified: true };
    setEditReaderAssignments(updated);
  };

  const removeReaderRow = (index: number) => {
    if (editReaderAssignments.length === 1) {
      setEditReaderAssignments([{ readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false }]);
    } else {
      setEditReaderAssignments(editReaderAssignments.filter((_, i) => i !== index));
    }
  };

  const saveChanges = async () => {
    if (!user) return;
    setSaving(true);

    // Diff reader assignments
    const validAssignments = editReaderAssignments.filter(a => a.readerName);
    const idsToKeep: string[] = [];

    for (const assignment of validAssignments) {
      if (assignment.existingSiteId) {
        await supabase.from('manga_reader_sites').update({ series_url: assignment.seriesUrl.trim() || null }).eq('id', assignment.existingSiteId);
        idsToKeep.push(assignment.existingSiteId);
      } else {
        const { data } = await supabase.from('manga_reader_sites').insert({
          user_id: user.id,
          name: assignment.readerName,
          url: assignment.readerUrl,
          anime_id: anime.id,
          series_url: assignment.seriesUrl.trim() || null,
        }).select('id').single();
        if (data) idsToKeep.push(data.id);
      }
    }

    const idsToDelete = linkedReaders.map(r => r.id).filter(id => !idsToKeep.includes(id));
    if (idsToDelete.length > 0) {
      await supabase.from('manga_reader_sites').delete().in('id', idsToDelete);
    }

    toast.success('Readers updated');
    setSaving(false);
    setIsEditing(false);
    fetchData();
  };

  // --- Not logged in ---
  if (!user) {
    return (
      <Card className="border-dashed">
        <div className="terminal-header">
           <span className="text-muted-foreground">library_data</span>
        </div>
        <CardContent className="py-6">
          <div className="font-mono">
            <p className="text-muted-foreground text-sm mb-4">!auth_required</p>
            <Button asChild className="border-dashed">
              <Link to="/auth" className="text-xs">{'>'} sign_in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- Loading ---
  if (loading) {
    return (
      <Card className="border-dashed">
        <div className="terminal-header">
           <span className="text-muted-foreground">library_data</span>
        </div>
        <CardContent className="p-4">
          <p className="text-muted-foreground font-mono text-sm">...loading</p>
        </CardContent>
      </Card>
    );
  }

  // --- Edit mode (readers only) ---
  if (isEditing) {
    const assignedReaderKeys = editReaderAssignments.map(a => `${a.readerName.toLowerCase()}|${a.readerUrl}`);

    return (
      <Card className="border-dashed border-primary/50">
        <div className="terminal-header flex items-center gap-2">
          <span className="text-muted-foreground">edit_readers</span>
          <span className="text-syntax-green">{'>'} <span className="truncate">{anime.title}</span></span>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Reader assignments */}
            <div>
              <p className="text-xs text-muted-foreground mb-3 font-mono">assign_to <span className="text-muted-foreground/60">// optional</span></p>
              <div className="space-y-6 sm:space-y-3">
                {editReaderAssignments.map((assignment, index) => {
                  const currentKey = assignment.readerName ? `${assignment.readerName.toLowerCase()}|${assignment.readerUrl}` : '';
                  const availableOptions = readerOptions.filter(o => o.key === currentKey || !assignedReaderKeys.includes(o.key));

                  return (
                    <div key={index} className="space-y-1.5">
                      <Label className="text-xs sm:hidden">
                        <span className="text-syntax-cyan">reader</span>
                        <span className="text-muted-foreground">{'{'}name,url{'}'}</span>
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="min-w-0">
                          {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">reader</span></Label>}
                          <Select value={currentKey} onValueChange={val => handleReaderSelect(index, val)}>
                            <SelectTrigger className="font-mono text-sm border-dashed bg-muted/30 data-[placeholder]:text-muted-foreground">
                              <SelectValue placeholder="select reader" />
                            </SelectTrigger>
                            <SelectPrimitive.Portal>
                              <SelectPrimitive.Content className="font-mono border-dashed relative z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:translate-y-1" position="popper">
                                <SelectScrollUpButton />
                                <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1 w-full min-w-[var(--radix-select-trigger-width)]">
                                  {availableOptions.map(option => (
                                    <SelectItem key={option.key} value={option.key} className="text-sm">{option.name}</SelectItem>
                                  ))}
                                </SelectPrimitive.Viewport>
                                <SelectScrollDownButton />
                                <div className="border-t border-dashed border-border" />
                                <div className="p-1">
                                  <SelectItem value="__new_reader__" className="text-sm text-primary font-medium">+ new_reader</SelectItem>
                                </div>
                              </SelectPrimitive.Content>
                            </SelectPrimitive.Portal>
                          </Select>
                        </div>
                        <div className="min-w-0">
                          {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">series_url</span></Label>}
                          <div className="flex items-center gap-2">
                            <Input type="text" placeholder="manga.line.me/title/..." value={assignment.seriesUrl} onChange={e => handleSeriesUrlChange(index, e.target.value)} className="font-mono text-sm border-dashed bg-muted/30 flex-1 min-w-0" />
                            {(editReaderAssignments.length > 1 || assignment.readerName) && (
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeReaderRow(index)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {showInlineNewReader && user && (
                  <InlineNewReaderForm userId={user.id} existingReaders={allReaderSites} onCreated={handleNewReaderCreated} onCancel={() => setShowInlineNewReader(false)} />
                )}
                {!showInlineNewReader && (
                  <Button type="button" variant="outline" size="sm" onClick={addReaderRow} className="text-xs border-dashed">
                    <Plus className="w-3.5 h-3.5 mr-1" />add_another
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="!mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={saveChanges} disabled={saving} className="font-mono text-xs border-dashed">
                <Check className="w-3.5 h-3.5 mr-1" />{saving ? 'saving...' : 'save_readers()'}
              </Button>
              <Button variant="outline" onClick={cancelEditing} className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                <X className="w-3.5 h-3.5 mr-1" />cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- View mode ---
  return (
    <Card className="border-dashed">
      <div className="terminal-header">
        <span className="text-muted-foreground">library_data</span>
      </div>
      <CardContent className="p-4 font-mono space-y-6">
        {/* Section 1: Library toggle + edit readers */}
        <div className="flex items-center justify-between">
          {inLibrary && confirmRemove ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">remove?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { toggleLibrary(); setConfirmRemove(false); }}
                disabled={togglingLibrary}
                className="h-7 w-7 p-0 hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmRemove(false)}
                className="h-7 w-7 p-0 hover:text-muted-foreground hover:bg-muted/50"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="group/lib flex items-center h-7 font-mono text-xs">
              <span className={`px-3 py-1 border border-dashed ${inLibrary ? 'text-foreground' : 'text-muted-foreground'}`}>
                {togglingLibrary ? '...' : inLibrary ? 'in_library [✓]' : 'in_library [ ]'}
              </span>
              <span
                className={`hidden group-hover/lib:inline ml-2 cursor-pointer ${inLibrary ? 'text-destructive' : 'text-primary'}`}
                onClick={inLibrary ? () => setConfirmRemove(true) : toggleLibrary}
              >
                {'>'} {inLibrary ? 'remove_from(library)' : 'add_to(library)'}
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Always-visible progress inputs */}
        {progress && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-2">
                <PositionLabel icon={Tv} label="last_watched" active={!!watchedEpisode.trim()} />
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">episode</span>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="—" value={watchedEpisode} onChange={e => setWatchedEpisode(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7" />
                    <span className="text-muted-foreground text-xs">/{anime.totalEpisodes || anime.currentEpisode}</span>
                  </div>
                </div>
              </div>

              {anime.hasManga ? (
                <div className="space-y-2">
                  <PositionLabel icon={BookOpen} label="last_read" active={!!(readVolume.trim() || readChapter.trim())} />
                  <div className="flex items-center gap-2">
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">vol</span>
                      <Input type="number" placeholder="—" value={readVolume} onChange={e => setReadVolume(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7" />
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">ch</span>
                      <Input type="number" placeholder="—" value={readChapter} onChange={e => setReadChapter(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">last_read</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">&nbsp;</span>
                    <div className="flex items-center h-7">
                      <span className="text-muted-foreground text-xs font-mono">anime_original; no_manga</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Save/reset progress (inline to the right) */}
              {isProgressDirty && (
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={saveProgress} disabled={savingProgress} className="font-mono text-xs h-7 border-dashed">
                    <Check className="w-3 h-3 mr-1" />{savingProgress ? 'saving...' : 'save_progress()'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetProgress} className="font-mono text-xs h-7 text-muted-foreground">
                    <RotateCcw className="w-3 h-3 mr-1" />reset
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 3: Reader links */}
        {inLibrary && anime.hasManga && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs">
              <Glasses className={`w-3.5 h-3.5 transition-colors ${linkedReaders.length > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`transition-colors ${linkedReaders.length > 0 ? 'text-syntax-cyan' : 'text-muted-foreground'}`}>readers</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {linkedReaders.map((reader) => (
                <Button
                  key={reader.id}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs h-7 border-dashed"
                  onClick={() => window.open(reader.series_url!, '_blank')}
                >
                  {reader.name}
                </Button>
              ))}
              {linkedReaders.length === 0 ? (
                <span
                  className="text-xs text-muted-foreground font-mono cursor-pointer"
                  onMouseEnter={() => setIsReaderHovered(true)}
                  onMouseLeave={() => setIsReaderHovered(false)}
                  onClick={startEditing}
                >
                  <span className="text-syntax-cyan">//</span> reader(null)
                  <span className={`${isReaderHovered ? 'inline' : 'hidden'} text-primary ml-2`}>{'>'} add_reader</span>
                </span>
              ) : (
                <Button variant="ghost" size="sm" onClick={startEditing} className="font-mono text-xs h-7 gap-1 text-muted-foreground">
                  <Pencil className="w-3 h-3" /> edit
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Section 4: Last saved */}
        {progress?.updated_at && (
          <span className="text-muted-foreground text-xs block">
            last_updated: <span className="text-syntax-green">{formatTimestamp(progress.updated_at)}</span>
          </span>
        )}
      </CardContent>
    </Card>
  );
};
