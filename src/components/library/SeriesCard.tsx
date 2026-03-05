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

  const resolvedAnimeId = item?.anime_id ?? animeId;
  const anime = resolvedAnimeId ? getAnimeById(resolvedAnimeId) : null;
  if (!anime) return null;

  const readerOptions: ReaderOption[] = useMemo(() => {
    const distinct = [...new Map(readerSites.map(r => [r.name.toLowerCase(), r])).values()];
    return distinct.map(r => ({
      key: `${r.name.toLowerCase()}|${r.url}`,
      name: r.name,
      url: r.url,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [readerSites]);

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      setEditReaderAssignments([]);
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setConfirmingDelete(false);
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
    const option = readerOptions.find(o => o.key === key);
    if (!option) return;
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

  const handleSeriesUrlChange = (index: number, value: string) => {
    const updated = [...editReaderAssignments];
    const baseUrl = updated[index].readerUrl.trim();
    const base = baseUrl ? (baseUrl.endsWith('/') ? baseUrl : baseUrl + '/') : '';
    const suffix = base && value.startsWith(base) ? value.slice(base.length) : value;
    updated[index] = { ...updated[index], seriesUrl: value, suffix, userModified: true };
    setEditReaderAssignments(updated);
  };

  const removeReaderRow = (index: number) => {
    setEditReaderAssignments(editReaderAssignments.filter((_, i) => i !== index));
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
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Series title (read-only) */}
            <div className="flex items-center gap-3 mb-2">
              {!imgError ? (
                <img src={anime.coverImage} alt={anime.title} className="w-10 h-auto object-contain opacity-90 shrink-0" onError={() => setImgError(true)} />
              ) : null}
              <span className="text-sm text-syntax-green line-clamp-2">{anime.title}</span>
            </div>

            {/* last_watched */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                <span className="text-syntax-cyan">last_watched</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">episode</Label>
                  <Input
                    type="number"
                    placeholder="—"
                    value={editWatchedEpisode}
                    onChange={e => setEditWatchedEpisode(e.target.value)}
                    className="font-mono text-sm border-dashed bg-muted/30"
                  />
                </div>
              </div>
            </div>

            {/* last_read (only if hasManga) */}
            {anime.hasManga && (
              <div className="space-y-1.5">
                <Label className="text-xs">
                  <span className="text-syntax-cyan">last_read</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">vol</Label>
                    <Input
                      type="number"
                      placeholder="—"
                      value={editReadVolume}
                      onChange={e => setEditReadVolume(e.target.value)}
                      className="font-mono text-sm border-dashed bg-muted/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">ch</Label>
                    <Input
                      type="text"
                      placeholder="—"
                      value={editReadChapter}
                      onChange={e => setEditReadChapter(e.target.value)}
                      className="font-mono text-sm border-dashed bg-muted/30"
                    />
                  </div>
                </div>
              </div>
            )}

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
                                <SelectValue placeholder="select reader..." />
                              </SelectTrigger>
                              <SelectPrimitive.Portal>
                                <SelectPrimitive.Content className="font-mono border-dashed relative z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:translate-y-1" position="popper">
                                  <SelectScrollUpButton className="h-[25px]" />
                                  <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1 w-full min-w-[var(--radix-select-trigger-width)]">
                                    {availableOptions.map(option => (
                                      <SelectItem key={option.key} value={option.key} className="text-sm">
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectPrimitive.Viewport>
                                  <SelectScrollDownButton className="h-[25px]" />
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
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeReaderRow(index)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button type="button" variant="outline" size="sm" onClick={addReaderRow} className="text-xs border-dashed">
                    <Plus className="w-3.5 h-3.5 mr-1" />add_another
                  </Button>
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
                    <Trash2 className="w-3.5 h-3.5 mr-1" />delete_from_library()
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View mode (original)
  return (
    <Link to={`/anime/${anime.id}`} className="block overflow-hidden">
      <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
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
                    {getReadersForAnime(resolvedAnimeId!, readerSites).length > 0 ? (
                      <div className="flex items-center gap-1.5 min-h-5 flex-wrap">
                        <Glasses className="w-3.5 h-3.5 shrink-0 text-primary" />
                        {getReadersForAnime(resolvedAnimeId!, readerSites).map((reader) => (
                          <Button
                            key={reader.id}
                            variant="outline"
                            size="sm"
                            className="h-5 px-1.5 text-[10px] font-mono border-dashed gap-1 max-w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(reader.series_url!, '_blank');
                            }}
                          >
                            <span className="truncate">{reader.name}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground min-h-5 flex-wrap">
                        <Glasses className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        <span>no_reader_link</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex items-start gap-1">
              {userId && (
                <Button variant="ghost" size="icon" onClick={startEditing} className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-8 w-8">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              )}
              {item && confirmingDelete ? (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); setConfirmingDelete(false); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingDelete(false); }} className="text-muted-foreground hover:text-muted-foreground hover:bg-muted">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : item ? (
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingDelete(true); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
