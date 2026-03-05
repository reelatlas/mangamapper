import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Trash2 } from 'lucide-react';
import { SeriesCombobox } from '@/components/SeriesCombobox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ReaderSite, SeriesAssignment } from '@/types/library';

interface NewReaderFormProps {
  userId: string;
  readerSites: ReaderSite[];
  onSuccess: () => void;
  onCancel: () => void;
  preSelectAnimeId?: string;
}

export const NewReaderForm = ({ userId, readerSites, onSuccess, onCancel, preSelectAnimeId }: NewReaderFormProps) => {
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [newSiteNotes, setNewSiteNotes] = useState('');
  const [seriesAssignments, setSeriesAssignments] = useState<SeriesAssignment[]>([{
    animeId: preSelectAnimeId || '',
    seriesUrl: '',
    suffix: '',
    userModified: !!preSelectAnimeId,
  }]);

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
      if (!suffix && a.seriesUrl && oldBase && a.seriesUrl.startsWith(oldBase)) suffix = a.seriesUrl.slice(oldBase.length);
      else if (!suffix && a.seriesUrl && !oldBase) suffix = a.seriesUrl;
      return { ...a, suffix, seriesUrl: newBase + suffix };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) {
      toast.error('Please fill in reader name');
      return;
    }
    const existingReader = readerSites.find(site => site.name.toLowerCase() === newSiteName.trim().toLowerCase());
    if (existingReader) {
      toast.error('A reader with this name already exists');
      return;
    }
    const validAssignments = seriesAssignments.filter(a => a.animeId);
    if (validAssignments.length === 0) {
      const { error } = await supabase.from('manga_reader_sites').insert({
        user_id: userId, name: newSiteName.trim(), url: newSiteUrl.trim(),
        notes: newSiteNotes.trim() || null, anime_id: null, series_url: null,
      });
      if (error) { toast.error('Failed to add reader site'); return; }
    } else {
      const inserts = validAssignments.map(assignment => ({
        user_id: userId, name: newSiteName.trim(), url: newSiteUrl.trim(),
        notes: newSiteNotes.trim() || null, anime_id: assignment.animeId,
        series_url: assignment.seriesUrl.trim() || null,
      }));
      const { error } = await supabase.from('manga_reader_sites').insert(inserts);
      if (error) { toast.error('Failed to add reader site'); return; }
      // Ensure each assigned series appears in library
      for (const assignment of validAssignments) {
        await supabase.from('anime_progress').upsert(
          { user_id: userId, anime_id: assignment.animeId, in_library: true, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,anime_id' }
        );
      }
    }
    toast.success('Reader added');
    onSuccess();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Card className="border-dashed border-primary/50">
      <div className="terminal-header flex items-center gap-2">
        <span className="text-muted-foreground">new_reader</span>
      </div>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="siteName" className="text-xs">
                <span className="text-syntax-cyan">reader_name</span>
              </Label>
              <Input id="siteName" placeholder="LINE マンガ" value={newSiteName} onChange={e => setNewSiteName(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="siteUrl" className="text-xs">
                <span className="text-syntax-cyan">reader_url</span>
              </Label>
              <Input id="siteUrl" type="text" placeholder="manga.line.me" value={newSiteUrl} onChange={e => handleReaderUrlChange(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="siteNotes" className="text-xs">
              <span className="text-syntax-cyan">notes</span>
            </Label>
            <Input id="siteNotes" placeholder="reliable fan subs" value={newSiteNotes} onChange={e => setNewSiteNotes(e.target.value)} className="font-mono text-sm border-dashed bg-muted/30" />
          </div>
          
          <div className="!mt-8">
                    <p className="text-xs text-muted-foreground mb-3">assign_to <span className="text-muted-foreground/60">// optional</span></p>
                    <div className="space-y-6 sm:space-y-3">
              {seriesAssignments.map((assignment, index) => (
                <div key={index} className="space-y-1.5">
                  <Label className="text-xs sm:hidden">
                    <span className="text-syntax-cyan">series</span>
                    <span className="text-muted-foreground">{'{'}name,url{'}'}</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="min-w-0">
                      {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">series</span></Label>}
                      <SeriesCombobox value={assignment.animeId} onValueChange={val => updateSeriesAssignment(index, 'animeId', val)} excludeIds={seriesAssignments.filter((_, i) => i !== index).map(a => a.animeId).filter(Boolean)} />
                    </div>
                    <div className="min-w-0">
                      {index === 0 && <Label className="text-xs hidden sm:block mb-1.5"><span className="text-syntax-cyan">series_url</span></Label>}
                      <div className="flex items-center gap-2">
                        <Input type="text" placeholder="manga.line.me/title/..." value={assignment.seriesUrl} onChange={e => updateSeriesAssignment(index, 'seriesUrl', e.target.value)} className="font-mono text-sm border-dashed bg-muted/30 flex-1 min-w-0" />
                        {(seriesAssignments.length > 1 || assignment.userModified) && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSeriesRow(index)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={addSeriesRow} className="text-xs border-dashed">
                  <Plus className="w-3.5 h-3.5 mr-1" />add_another
                </Button>
              </div>
                    </div>
                    </div>
          
          <div className="flex gap-2 justify-end !mt-8">
            <Button type="button" variant="outline" onClick={handleCancel} className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
              <X className="w-3.5 h-3.5 mr-1" />cancel
            </Button>
            <Button type="submit" className="font-mono text-xs border-dashed">
              <Plus className="w-3.5 h-3.5 mr-1" />add_reader()
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
