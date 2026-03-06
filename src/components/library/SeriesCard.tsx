import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Tv, Trash2, ExternalLink, Glasses, X, Check, Pencil, Plus } from 'lucide-react';
import { getAnimeById } from '@/data/mockAnime';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectItem, SelectScrollUpButton, SelectScrollDownButton, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InlineNewReaderForm } from './InlineNewReaderForm';
import type { AnimeProgress, ReaderSite, ReaderAssignment } from '@/types/library';
import { getReadersForAnime } from '@/types/library';

interface ReaderOption {
  key: string;
  name: string;
  url: string;
}

interface SeriesCardProps {
  item?: AnimeProgress;
  animeId?: string;
  readerSites: ReaderSite[];
  onRemove: (id: string) => void;
  userId?: string;
  onSave?: () => void;
}

export const SeriesCard = ({ item, animeId, readerSites, onRemove, userId, onSave }: SeriesCardProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [editWatchedEpisode, setEditWatchedEpisode] = useState('');
  const [editReadVolume, setEditReadVolume] = useState('');
  const [editReadChapter, setEditReadChapter] = useState('');
  const [editReaderAssignments, setEditReaderAssignments] = useState<ReaderAssignment[]>([]);
  const [saving, setSaving] = useState(false);
  const [showInlineNewReader, setShowInlineNewReader] = useState(false);
  const [newlyCreatedReader, setNewlyCreatedReader] = useState<{name: string, url: string} | null>(null);

  const resolvedAnimeId = item?.anime_id ?? animeId;
  const anime = resolvedAnimeId ? getAnimeById(resolvedAnimeId) : null;

  const readerOptions: ReaderOption[] = useMemo(() => {
    const distinct = [...new Map(readerSites.map(r => [r.name.toLowerCase(), r])).values()];
    const options = distinct.map(r => ({
      key: `${r.name.toLowerCase()}|${r.url}`,
      name: r.name,
      url: r.url,
    }));
    if (newlyCreatedReader && !options.find(o => o.name.toLowerCase() === newlyCreatedReader.name.toLowerCase())) {
      options.push({
        key: `${newlyCreatedReader.name.toLowerCase()}|${newlyCreatedReader.url}`,
        name: newlyCreatedReader.name,
        url: newlyCreatedReader.url,
      });
    }
    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [readerSites, newlyCreatedReader]);

  if (!anime) return null;

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmingDelete(false);
    setShowInlineNewReader(false);
    setEditWatchedEpisode(item?.last_watched_episode?.toString() ?? '');
    setEditReadVolume(item?.last_read_volume?.toString() ?? '');
    setEditReadChapter(item?.last_read_chapter ?? '');

    const linkedReaders = getReadersForAnime(resolvedAnimeId!, readerSites);
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
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setConfirmingDelete(false);
    setShowInlineNewReader(false);
  };

  const addReaderRow = () => {
    setEditReaderAssignments([...editReaderAssignments, {
      readerName: '',
      readerUrl: '',
      seriesUrl: '',
      suffix: '',
      userModified: false,
    }]);
  };

  const handleReaderSelect = (index: number, key: string) => {
    if (key === '__new_reader__') {
      setShowInlineNewReader(true);
      return;
    }
    const option = readerOptions.find(o => o.key === key);
    if (!option) return;
    setShowInlineNewReader(false);
    const updated = [...editReaderAssignments];
    updated[index] = {
      ...updated[index],
      readerName: option.name,
      readerUrl: option.url,
      seriesUrl: option.url.endsWith('/') ? option.url : option.url + '/',
      suffix: '',
      userModified: true,
    };
    setEditReaderAssignments(updated);
  };

  const handleNewReaderCreated = (readerName: string, readerUrl: string) => {
    setNewlyCreatedReader({ name: readerName, url: readerUrl });
    setShowInlineNewReader(false);
    // Auto-select in the last empty row or add a new one
    const emptyIndex = editReaderAssignments.findIndex(a => !a.readerName);
    const key = `${readerName.toLowerCase()}|${readerUrl}`;
    const baseUrl = readerUrl ? (readerUrl.endsWith('/') ? readerUrl : readerUrl + '/') : '';
    const newAssignment: ReaderAssignment = {
      readerName,
      readerUrl,
      seriesUrl: baseUrl,
      suffix: '',
      userModified: true,
    };
    if (emptyIndex >= 0) {
      const updated = [...editReaderAssignments];
      updated[emptyIndex] = newAssignment;
      setEditReaderAssignments(updated);
    } else {
      setEditReaderAssignments([...editReaderAssignments, newAssignment]);
    }
    onSave?.(); // refresh reader sites in background
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
    if (!userId || !resolvedAnimeId) return;
    setSaving(true);

    // 1. Upsert progress
    const progressUpdate: Record<string, unknown> = {
      user_id: userId,
      anime_id: resolvedAnimeId,
      in_library: true,
      updated_at: new Date().toISOString(),
      last_watched_episode: editWatchedEpisode.trim() ? parseInt(editWatchedEpisode.trim(), 10) : null,
    };
    if (anime.hasManga) {
      progressUpdate.last_read_volume = editReadVolume.trim() ? parseInt(editReadVolume.trim(), 10) : null;
      progressUpdate.last_read_chapter = editReadChapter.trim() || null;
    }

    const { error: progressError } = await supabase
      .from('anime_progress')
      .upsert(progressUpdate as any, { onConflict: 'user_id,anime_id' });

    if (progressError) {
      toast.error('Failed to update progress');
      setSaving(false);
      return;
    }

    // 2. Diff reader assignments
    const existingLinked = getReadersForAnime(resolvedAnimeId!, readerSites);
    const validAssignments = editReaderAssignments.filter(a => a.readerName);
    const idsToKeep: string[] = [];

    for (const assignment of validAssignments) {
      if (assignment.existingSiteId) {
        // Update existing
        await supabase.from('manga_reader_sites').update({
          series_url: assignment.seriesUrl.trim() || null,
        }).eq('id', assignment.existingSiteId);
        idsToKeep.push(assignment.existingSiteId);
      } else {
        // Insert new
        const { data } = await supabase.from('manga_reader_sites').insert({
          user_id: userId,
          name: assignment.readerName,
          url: assignment.readerUrl,
          anime_id: resolvedAnimeId,
          series_url: assignment.seriesUrl.trim() || null,
        }).select('id').single();
        if (data) idsToKeep.push(data.id);
      }
    }

    // Delete removed assignments
    const idsToDelete = existingLinked.map(r => r.id).filter(id => !idsToKeep.includes(id));
    if (idsToDelete.length > 0) {
      await supabase.from('manga_reader_sites').delete().in('id', idsToDelete);
    }

    toast.success('Series updated');
    setSaving(false);
    setIsEditing(false);
    onSave?.();
  };

  // Edit mode
  if (isEditing) {
    const assignedReaderKeys = editReaderAssignments.map(a => `${a.readerName.toLowerCase()}|${a.readerUrl}`);

    return (
      <Card className="border-dashed border-primary/50 overflow-hidden">
        <div className="terminal-header flex items-center gap-2">
          <span className="text-muted-foreground">edit_series</span>
          <span className="text-syntax-green">{'>'} <span className="truncate">{anime.title}</span></span>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">

            <div className="flex flex-wrap gap-6">
              {/* last_watched */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <Tv className="w-3.5 h-3.5 text-primary" />
                  <span className="text-syntax-cyan">last_watched</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">episode</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="—"
                      value={editWatchedEpisode}
                      onChange={e => setEditWatchedEpisode(e.target.value)}
                      className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7"
                    />
                    <span className="text-muted-foreground text-xs">
                      /{anime.totalEpisodes || anime.currentEpisode}
                    </span>
                  </div>
                </div>
              </div>

              {/* last_read (only if hasManga) */}
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
                        type="number"
                        placeholder="—"
                        value={editReadVolume}
                        onChange={e => setEditReadVolume(e.target.value)}
                        className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">ch</span>
                      <Input
                        type="number"
                        placeholder="—"
                        value={editReadChapter}
                        onChange={e => setEditReadChapter(e.target.value)}
                        className="font-mono text-sm border-dashed bg-muted/30 w-24 h-7"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* assign_to readers */}
            {anime.hasManga && (
              <div className="!mt-8">
                <p className="text-xs text-muted-foreground mb-3">assign_to <span className="text-muted-foreground/60">// optional</span></p>
                <div className="space-y-6 sm:space-y-3">
                  {editReaderAssignments.map((assignment, index) => {
                    const currentKey = assignment.readerName ? `${assignment.readerName.toLowerCase()}|${assignment.readerUrl}` : '';
                    const availableOptions = readerOptions.filter(o =>
                      o.key === currentKey || !assignedReaderKeys.includes(o.key)
                    );

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
                                  <div className="h-[25px]"><SelectScrollUpButton /></div>
                                  <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1 w-full min-w-[var(--radix-select-trigger-width)]">
                                    {availableOptions.map(option => (
                                      <SelectItem key={option.key} value={option.key} className="text-sm">
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectPrimitive.Viewport>
                                  <div className="h-[25px]"><SelectScrollDownButton /></div>
                                  <div className="border-t border-dashed border-border" />
                                  <div className="p-1">
                                    <SelectItem value="__new_reader__" className="text-sm text-primary font-medium">
                                      + new_reader
                                    </SelectItem>
                                  </div>
                                </SelectPrimitive.Content>
                              </SelectPrimitive.Portal>
                            </Select>
                          </div>
                          <div className="min-w-0">
                            {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">series_url</span></Label>}
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                placeholder="manga.line.me/title/..."
                                value={assignment.seriesUrl}
                                onChange={e => handleSeriesUrlChange(index, e.target.value)}
                                className="font-mono text-sm border-dashed bg-muted/30 flex-1 min-w-0"
                              />
                              {(editReaderAssignments.length > 1 || assignment.readerName) && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeReaderRow(index)}
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                })}
                  {showInlineNewReader && userId && (
                    <InlineNewReaderForm
                      userId={userId}
                      existingReaders={readerSites}
                      onCreated={handleNewReaderCreated}
                      onCancel={() => setShowInlineNewReader(false)}
                    />
                  )}
                  {!showInlineNewReader && (
                    <Button type="button" variant="outline" size="sm" onClick={addReaderRow} className="text-xs border-dashed">
                      <Plus className="w-3.5 h-3.5 mr-1" />add_another
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="!mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button onClick={saveChanges} disabled={saving} className="font-mono text-xs border-dashed">
                  <Check className="w-3.5 h-3.5 mr-1" />{saving ? 'saving...' : 'save_changes()'}
                </Button>
                <Button variant="outline" onClick={cancelEditing} className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                  <X className="w-3.5 h-3.5 mr-1" />cancel
                </Button>
              </div>
              {item && (
                confirmingDelete ? (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { onRemove(item.id); setIsEditing(false); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setConfirmingDelete(false)} className="text-muted-foreground hover:text-muted-foreground hover:bg-muted">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" onClick={() => setConfirmingDelete(true)} className="font-mono text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5 mr-1" />delete_series()
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const linkedReaders = getReadersForAnime(resolvedAnimeId!, readerSites);

  // View mode
  return (
    <div className="block overflow-hidden">
      <Card className="group relative border-dashed hover:border-primary/50 transition-colors overflow-hidden">
        <CardContent className="p-4 overflow-hidden">
          <div className="flex items-stretch gap-4">
            {imgError ? (
              <div className="w-16 self-stretch bg-muted/50 shrink-0 overflow-hidden flex items-center justify-center p-1">
                <span className="text-[9px] text-muted-foreground line-clamp-3 text-center break-all">{anime.title}</span>
              </div>
            ) : (
              <img src={anime.coverImage} alt={anime.title} className="w-16 object-contain opacity-90 shrink-0" onError={() => setImgError(true)} />
            )}
            <div className="flex-1 min-w-0 overflow-hidden">
              <span className="text-sm text-syntax-green line-clamp-2">{anime.title}</span>
              <div className="flex flex-col gap-1.5 mt-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tv className={`w-3.5 h-3.5 shrink-0 ${item?.last_watched_episode != null ? "text-primary" : "text-muted-foreground"}`} />
                  <span>
                    <span className="text-muted-foreground">ep:</span>
                    <span className={item?.last_watched_episode != null ? "text-foreground" : "text-muted-foreground"}>{item?.last_watched_episode ?? '—'}</span>
                  </span>
                </div>
                {anime.hasManga ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <BookOpen className={`w-3.5 h-3.5 shrink-0 ${(item?.last_read_volume != null || item?.last_read_chapter != null) ? "text-primary" : "text-muted-foreground"}`} />
                    <span>
                      <span className="text-muted-foreground">vol:</span>
                      <span className={item?.last_read_volume != null ? "text-foreground" : "text-muted-foreground"}>{item?.last_read_volume ?? '—'}</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span>
                      <span className="text-muted-foreground">ch:</span>
                      <span className={item?.last_read_chapter != null ? "text-foreground" : "text-muted-foreground"}>{item?.last_read_chapter ?? '—'}</span>
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-muted-foreground">anime_original; no_manga</span>
                    </div>
                    <div className="min-h-5" />
                  </>
                )}
                {anime.hasManga && (
                  <>
                    {linkedReaders.length > 0 ? (
                      <div className="flex items-center gap-1.5 min-h-5 flex-wrap">
                         <Glasses className="w-3.5 h-3.5 shrink-0 text-primary" />
                        <span className="text-xs text-muted-foreground">
                          {linkedReaders.map(r => r.name).join(', ')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground min-h-5 flex-wrap">
                        <Glasses className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        <span><span className="text-syntax-cyan">//</span> reader(null)</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Hover overlay */}
        {confirmingDelete ? (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center gap-3 z-10">
            <span className="text-xs text-muted-foreground font-mono mr-1">delete_series?</span>
            <Button variant="ghost" size="icon" onClick={() => { if (item) { onRemove(item.id); } setConfirmingDelete(false); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8">
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmingDelete(false)} className="text-muted-foreground hover:text-muted-foreground hover:bg-muted h-8 w-8">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <div className="flex items-center gap-1 px-3">
              <Button variant="ghost" size="sm" className="font-mono text-xs gap-1" asChild>
                <Link to={`/anime/${anime.id}`}>
                  view_details
                </Link>
              </Button>
            </div>
            {linkedReaders.length > 0 && (
              <>
                <div className="h-4 w-px bg-border mx-3" />
                <div className="flex items-center gap-1 px-3">
                  {linkedReaders.length === 1 ? (
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.open(linkedReaders[0].series_url!, '_blank'); }} className="font-mono text-xs gap-1">
                      <Glasses className="w-3 h-3" />{linkedReaders[0].name}
                    </Button>
                  ) : (
                    linkedReaders.map(reader => (
                      <Button key={reader.id} variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.open(reader.series_url!, '_blank'); }} className="font-mono text-xs gap-1">
                        <Glasses className="w-3 h-3" />{reader.name}
                      </Button>
                    ))
                  )}
                </div>
              </>
            )}
            <div className="h-4 w-px bg-border mx-3" />
            <div className="flex items-center gap-1 px-3">
              {userId && (
                <Button variant="ghost" size="sm" onClick={startEditing} className="font-mono text-xs gap-1">
                  <Pencil className="w-3 h-3" />edit
                </Button>
              )}
              {item && (
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setConfirmingDelete(true); }} className="font-mono text-xs gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3 h-3" />delete
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
