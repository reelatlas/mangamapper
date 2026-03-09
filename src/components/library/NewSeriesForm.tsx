import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Trash2 } from 'lucide-react';
import { SeriesCombobox } from '@/components/SeriesCombobox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectItem, SelectScrollUpButton, SelectScrollDownButton, SelectTrigger, SelectValue } from '@/components/ui/select';

import { InlineNewReaderForm } from './InlineNewReaderForm';
import type { ReaderSite, AnimeProgress, ReaderAssignment } from '@/types/library';

interface ReaderOption {
  key: string;
  name: string;
  url: string;
}

interface NewSeriesFormProps {
  userId: string;
  readerSites: ReaderSite[];
  progress: AnimeProgress[];
  onSuccess: () => void;
  onCancel: () => void;
  preSelectAnimeId?: string;
}

export const NewSeriesForm = ({ userId, readerSites, progress, onSuccess, onCancel, preSelectAnimeId }: NewSeriesFormProps) => {
  const [animeId, setAnimeId] = useState(preSelectAnimeId || '');
  const [notes, setNotes] = useState('');

  const handleAnimeSelect = async (id: string) => {
    setAnimeId(id);
    if (!id) {
      setNotes('');
      setEditReaderAssignments([{ readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false }]);
      setInitialExistingSiteIds([]);
      return;
    }

    // Populate reader assignments from existing reader sites
    const matchingReaders = readerSites.filter(s => s.anime_id === id);
    if (matchingReaders.length > 0) {
      setInitialExistingSiteIds(matchingReaders.map(r => r.id));
      setEditReaderAssignments(matchingReaders.map(r => {
        const base = r.url ? (r.url.endsWith('/') ? r.url : r.url + '/') : '';
        const suffix = base && r.series_url?.startsWith(base) ? r.series_url.slice(base.length) : '';
        return {
          readerName: r.name,
          readerUrl: r.url,
          seriesUrl: r.series_url ?? '',
          suffix,
          existingSiteId: r.id,
          userModified: false,
        };
      }));
    } else {
      setInitialExistingSiteIds([]);
      setEditReaderAssignments([{ readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false }]);
    }

    // Populate notes from progress or query DB
    const existing = progress.find(p => p.anime_id === id);
    if (existing?.notes) {
      setNotes(existing.notes);
    } else {
      // Query for non-library progress that might have notes
      const { data } = await supabase
        .from('anime_progress')
        .select('notes')
        .eq('anime_id', id)
        .eq('user_id', userId)
        .maybeSingle();
      setNotes(data?.notes || '');
    }
  };
  const [saving, setSaving] = useState(false);
  const [editReaderAssignments, setEditReaderAssignments] = useState<ReaderAssignment[]>([
    { readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false },
  ]);
  const [initialExistingSiteIds, setInitialExistingSiteIds] = useState<string[]>([]);
  const [showInlineNewReader, setShowInlineNewReader] = useState(false);
  const [newlyCreatedReader, setNewlyCreatedReader] = useState<{name: string, url: string} | null>(null);

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

  const assignedReaderKeys = editReaderAssignments
    .filter(a => a.readerName)
    .map(a => `${a.readerName.toLowerCase()}|${a.readerUrl}`);

  const handleReaderSelect = (index: number, key: string) => {
    if (key === '__new_reader__') {
      setShowInlineNewReader(true);
      return;
    }
    const option = readerOptions.find(o => o.key === key);
    if (!option) return;
    setShowInlineNewReader(false);
    const updated = [...editReaderAssignments];
    // Check if there's an existing DB record for this reader + current series
    const existingRecord = animeId ? readerSites.find(s => s.name.toLowerCase() === option.name.toLowerCase() && s.anime_id === animeId) : null;
    if (existingRecord) {
      updated[index] = {
        ...updated[index],
        readerName: option.name,
        readerUrl: option.url,
        seriesUrl: existingRecord.series_url ?? '',
        suffix: '',
        existingSiteId: existingRecord.id,
        userModified: true,
      };
    } else {
      updated[index] = {
        ...updated[index],
        readerName: option.name,
        readerUrl: option.url,
        seriesUrl: option.url ? (option.url.endsWith('/') ? option.url : option.url + '/') : '',
        suffix: '',
        userModified: true,
      };
    }
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
    if (editReaderAssignments.length === 1) {
      setEditReaderAssignments([{ readerName: '', readerUrl: '', seriesUrl: '', suffix: '', userModified: false }]);
    } else {
      setEditReaderAssignments(editReaderAssignments.filter((_, i) => i !== index));
    }
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

  const handleNewReaderCreated = (readerName: string, readerUrl: string) => {
    setNewlyCreatedReader({ name: readerName, url: readerUrl });
    setShowInlineNewReader(false);
    const baseUrl = readerUrl ? (readerUrl.endsWith('/') ? readerUrl : readerUrl + '/') : '';
    const newAssignment: ReaderAssignment = {
      readerName,
      readerUrl,
      seriesUrl: baseUrl,
      suffix: '',
      userModified: true,
    };
    const emptyIndex = editReaderAssignments.findIndex(a => !a.readerName);
    if (emptyIndex >= 0) {
      const updated = [...editReaderAssignments];
      updated[emptyIndex] = newAssignment;
      setEditReaderAssignments(updated);
    } else {
      setEditReaderAssignments([...editReaderAssignments, newAssignment]);
    }
    onSuccess(); // refresh reader sites in background
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeId) {
      toast.error('Please select a series');
      return;
    }

    setSaving(true);

    // Upsert anime_progress with in_library: true
    const { error: progressError } = await supabase
      .from('anime_progress')
      .upsert({
        user_id: userId,
        anime_id: animeId,
        in_library: true,
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,anime_id' });

    if (progressError) {
      toast.error('Failed to add series to library');
      setSaving(false);
      return;
    }

    // Insert reader assignments
    const validAssignments = editReaderAssignments.filter(a => a.readerName);
    for (const assignment of validAssignments) {
      if (assignment.existingSiteId) {
        const { error: readerError } = await supabase
          .from('manga_reader_sites')
          .update({
            name: assignment.readerName,
            url: assignment.readerUrl,
            anime_id: animeId,
            series_url: assignment.seriesUrl.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', assignment.existingSiteId);

        if (readerError) {
          toast.error('Series added but failed to update reader');
        }
      } else {
        const { error: readerError } = await supabase
          .from('manga_reader_sites')
          .insert({
            user_id: userId,
            name: assignment.readerName,
            url: assignment.readerUrl,
            anime_id: animeId,
            series_url: assignment.seriesUrl.trim() || null,
          });

        if (readerError) {
          toast.error('Series added but failed to link reader');
        }
      }
    }

    // Unlink removed reader associations
    const remainingExistingIds = validAssignments
      .filter(a => a.existingSiteId)
      .map(a => a.existingSiteId!);
    const removedIds = initialExistingSiteIds.filter(id => !remainingExistingIds.includes(id));
    if (removedIds.length > 0) {
      await supabase
        .from('manga_reader_sites')
        .update({ anime_id: null, series_url: null })
        .in('id', removedIds);
    }

    toast.success('Series added to library');
    setSaving(false);
    onSuccess();
    onCancel();
  };

  return (
    <Card className="border-dashed border-primary/50">
      <div className="terminal-header flex items-center gap-2">
        <span className="text-muted-foreground">new_series</span>
      </div>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-1.5">
            <Label className="text-xs">
              <span className="text-syntax-cyan">series</span>
            </Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 min-w-0">
                <SeriesCombobox
                  value={animeId}
                  onValueChange={handleAnimeSelect}
                  excludeIds={progress.map(p => p.anime_id)}
                  placeholder="search series"
                />
              </div>
              {animeId && (
                <Button type="button" variant="ghost" size="icon"
                  onClick={() => handleAnimeSelect('')}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* assign_to readers */}
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
                              <SelectScrollUpButton />
                              <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1 w-full min-w-[var(--radix-select-trigger-width)]">
                                {availableOptions.map(option => (
                                  <SelectItem key={option.key} value={option.key} className="text-sm">
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectPrimitive.Viewport>
                              <SelectScrollDownButton />
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
              {showInlineNewReader && (
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

          {/* Notes */}
          <div className="!mt-8 space-y-1.5">
            <Label className="text-xs">
              <span className="text-syntax-cyan">series_notes</span>
              <span className="text-muted-foreground/60"> // optional</span>
            </Label>
            <Input
              placeholder="best Berserk scans for golden age arc"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="font-mono text-sm border-dashed bg-muted/30"
            />
          </div>

          <div className="!mt-8 flex gap-2">
            <Button type="submit" disabled={saving} className="font-mono text-xs border-dashed">
              <Plus className="w-3.5 h-3.5 mr-1" />
              {saving ? 'adding...' : 'add_series()'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
              <X className="w-3.5 h-3.5 mr-1" />
              cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
