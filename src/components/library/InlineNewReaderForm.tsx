import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ReaderSite } from '@/types/library';

interface InlineNewReaderFormProps {
  userId: string;
  existingReaders: ReaderSite[];
  onCreated: (readerName: string, readerUrl: string) => void;
  onCancel: () => void;
}

export const InlineNewReaderForm = ({ userId, existingReaders, onCreated, onCancel }: InlineNewReaderFormProps) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !url.trim()) {
      toast.error('Please fill in reader name and URL');
      return;
    }

    const exists = existingReaders.find(s => s.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) {
      toast.error('A reader with this name already exists');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('manga_reader_sites')
      .insert({
        user_id: userId,
        name: name.trim(),
        url: url.trim(),
        notes: notes.trim() || null,
        anime_id: null,
        series_url: null,
      });

    if (error) {
      toast.error('Failed to create reader');
      setSaving(false);
      return;
    }

    toast.success('Reader created');
    setSaving(false);
    onCreated(name.trim(), url.trim());
  };

  return (
    <div className="border border-dashed bg-muted/10">
      <div className="terminal-header flex items-center gap-2">
        <span className="text-muted-foreground">new_reader</span>
      </div>
      <div className="p-3 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">
            <span className="text-syntax-cyan">reader_name</span>
          </Label>
          <Input
            placeholder="LINE マンガ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-mono text-sm border-dashed bg-muted/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            <span className="text-syntax-cyan">reader_url</span>
          </Label>
          <Input
            type="text"
            placeholder="manga.line.me"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="font-mono text-sm border-dashed bg-muted/30"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">
          <span className="text-syntax-cyan">notes</span>
          <span className="text-muted-foreground"> // optional</span>
        </Label>
        <Input
          placeholder="notes about this reader..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="font-mono text-sm border-dashed bg-muted/30"
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" disabled={saving} onClick={handleSubmit} className="font-mono text-xs border-dashed">
          <Plus className="w-3.5 h-3.5 mr-1" />
          {saving ? 'adding...' : 'add_reader()'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} className="font-mono text-xs border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
          <X className="w-3.5 h-3.5 mr-1" />
          cancel
        </Button>
      </div>
      </div>
    </div>
  );
};
