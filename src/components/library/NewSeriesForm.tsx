import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { SeriesCombobox } from '@/components/SeriesCombobox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Select, SelectItem, SelectScrollUpButton, SelectScrollDownButton, SelectTrigger, SelectValue } from '@/components/ui/select';

import { InlineNewReaderForm } from './InlineNewReaderForm';
import type { ReaderSite, AnimeProgress } from '@/types/library';

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
  const [selectedReaderKey, setSelectedReaderKey] = useState('');
  const [selectedReaderName, setSelectedReaderName] = useState('');
  const [selectedReaderUrl, setSelectedReaderUrl] = useState('');
  const [seriesUrl, setSeriesUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showNewReader, setShowNewReader] = useState(false);
  const [saving, setSaving] = useState(false);
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
    return options;
  }, [readerSites, newlyCreatedReader]);

  const handleReaderChange = (key: string) => {
    if (key === '__new_reader__') {
      setShowNewReader(true);
      setSelectedReaderKey('');
      setSelectedReaderName('');
      setSelectedReaderUrl('');
    } else {
      setShowNewReader(false);
      const option = readerOptions.find(o => o.key === key);
      if (option) {
        setSelectedReaderKey(key);
        setSelectedReaderName(option.name);
        setSelectedReaderUrl(option.url);
        const baseUrl = option.url.endsWith('/') ? option.url : option.url + '/';
        setSeriesUrl(baseUrl);
      }
    }
  };

  const handleNewReaderCreated = (readerName: string, readerUrl: string) => {
    setNewlyCreatedReader({ name: readerName, url: readerUrl });
    const key = `${readerName.toLowerCase()}|${readerUrl}`;
    setSelectedReaderKey(key);
    setShowNewReader(false);
    setSelectedReaderName(readerName);
    setSelectedReaderUrl(readerUrl);
    const baseUrl = readerUrl.endsWith('/') ? readerUrl : readerUrl + '/';
    setSeriesUrl(baseUrl);
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
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,anime_id' });

    if (progressError) {
      toast.error('Failed to add series to library');
      setSaving(false);
      return;
    }

    // If reader selected, create manga_reader_sites entry
    if (selectedReaderName && selectedReaderUrl) {
      const { error: readerError } = await supabase
        .from('manga_reader_sites')
        .insert({
          user_id: userId,
          name: selectedReaderName,
          url: selectedReaderUrl,
          anime_id: animeId,
          series_url: seriesUrl.trim() || null,
          notes: notes.trim() || null,
        });

      if (readerError) {
        toast.error('Series added but failed to link reader');
      }
    }

    toast.success('Series added to library');
    setSaving(false);
    onSuccess();
    onCancel();
  };

  return (
    <Card className="border-dashed">
      <div className="terminal-header flex items-center gap-2">
        <span className="text-muted-foreground">new_series</span>
      </div>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">
              <span className="text-syntax-cyan">series</span>
            </Label>
            <SeriesCombobox
              value={animeId}
              onValueChange={setAnimeId}
              excludeIds={progress.map(p => p.anime_id)}
              placeholder="search series..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">
              <span className="text-syntax-cyan">reader</span>
              <span className="text-muted-foreground"> // optional</span>
            </Label>
            <Select value={selectedReaderKey} onValueChange={handleReaderChange}>
              <SelectTrigger className="font-mono text-sm border-dashed bg-muted/30 data-[placeholder]:text-muted-foreground">
                <SelectValue placeholder="select reader..." />
              </SelectTrigger>
              <SelectContent className="font-mono border-dashed p-0">
                <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1">
                  {readerOptions.map(option => (
                    <SelectItem key={option.key} value={option.key} className="text-sm">
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectPrimitive.Viewport>
                <SelectSeparator className="border-dashed" />
                <div className="p-1">
                  <SelectItem value="__new_reader__" className="text-sm text-primary font-medium">
                    + new_reader
                  </SelectItem>
                </div>
              </SelectContent>
            </Select>
          </div>

          {showNewReader && (
            <div className="pl-4">
              <InlineNewReaderForm
                userId={userId}
                existingReaders={readerSites}
                onCreated={handleNewReaderCreated}
                onCancel={() => setShowNewReader(false)}
              />
            </div>
          )}

          {selectedReaderName && !showNewReader && (
            <div className="space-y-2">
              <Label className="text-xs">
                <span className="text-syntax-cyan">series_url</span>
                <span className="text-muted-foreground"> // optional</span>
              </Label>
              <Input
                type="text"
                placeholder="manga.line.me/title/..."
                value={seriesUrl}
                onChange={(e) => setSeriesUrl(e.target.value)}
                className="font-mono text-sm border-dashed bg-muted/30"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs">
              <span className="text-syntax-cyan">notes</span>
              <span className="text-muted-foreground"> // optional</span>
            </Label>
            <Input
              placeholder="best Berserk scans for golden age arc"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="font-mono text-sm border-dashed bg-muted/30"
            />
          </div>

          <div className="border-t border-dashed pt-4 mt-4" />

          <div className="flex gap-2">
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
