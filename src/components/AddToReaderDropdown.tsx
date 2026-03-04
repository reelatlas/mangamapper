import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UserReader {
  name: string;
  url: string;
}

interface AddToReaderDropdownProps {
  animeId: string;
  onSuccess: () => void;
  linkedReaderNames?: string[];
}

export const AddToReaderDropdown = ({ animeId, onSuccess, linkedReaderNames = [] }: AddToReaderDropdownProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [userReaders, setUserReaders] = useState<UserReader[]>([]);
  const [selectedReader, setSelectedReader] = useState<UserReader | null>(null);
  const [seriesUrl, setSeriesUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchUserReaders = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('manga_reader_sites')
        .select('name, url')
        .eq('user_id', user.id);

      if (data) {
        // Get distinct readers by name, then filter out already-linked ones
        const distinctReaders = [...new Map(data.map(r => [r.name, r])).values()];
        const availableReaders = distinctReaders.filter(
          r => !linkedReaderNames.includes(r.name)
        );
        setUserReaders(availableReaders);
      }
      setHasFetched(true);
    };

    fetchUserReaders();
  }, [user, linkedReaderNames]);

  const handleSelectReader = (reader: UserReader) => {
    setSelectedReader(reader);
    // Ensure the default URL ends with a trailing slash
    const baseUrl = reader.url.endsWith('/') ? reader.url : reader.url + '/';
    setSeriesUrl(baseUrl);
  };

  const handleConfirm = async () => {
    if (!user || !selectedReader || !seriesUrl.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from('manga_reader_sites')
      .insert({
        user_id: user.id,
        name: selectedReader.name,
        url: selectedReader.url,
        anime_id: animeId,
        series_url: seriesUrl.trim()
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add series to reader",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Added to ${selectedReader.name}`
      });
      setOpen(false);
      setSelectedReader(null);
      setSeriesUrl('');
      onSuccess();
    }
  };

  const handleCancel = () => {
    setSelectedReader(null);
    setSeriesUrl('');
  };

  if (!user) return null;

  if (hasFetched && userReaders.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        <span className="text-muted-foreground">// </span>
        assign_series() → requires(
        <Link 
          to="/library" 
          state={{ openAddReader: true, preSelectAnimeId: animeId }}
          className="text-primary hover:underline"
        >
          readers
        </Link>
        )
      </p>
    );
  }

  return (
  <Popover open={open} onOpenChange={(isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedReader(null);
      setSeriesUrl('');
    }
  }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs border-dashed h-7 bg-transparent text-muted-foreground hover:text-accent-foreground hover:bg-accent"
        >
          {'>'} add_to_reader
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-background border-dashed" align="start">
        <div className="terminal-header text-xs">
          <span className="text-muted-foreground">select_</span>
        </div>
        
        {!selectedReader ? (
          <div className="p-2 space-y-1">
            {userReaders.length === 0 ? (
              <p className="text-xs text-muted-foreground p-2">
                <span className="text-syntax-cyan">// </span>
                no readers found
              </p>
            ) : (
              userReaders.map((reader) => (
                <button
                  key={reader.name}
                  onClick={() => handleSelectReader(reader)}
                  className="w-full text-left px-3 py-2 text-xs font-mono hover:bg-muted rounded transition-colors break-words"
                >
                  <span className="text-syntax-green break-all">{reader.name}</span>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="p-3 space-y-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground break-words">
                <span className="text-syntax-cyan">reader</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-syntax-green break-all">{selectedReader.name}</span>
              </p>
              <label className="text-xs text-muted-foreground">
                <span className="text-syntax-cyan">series_url</span>
              </label>
              <Input
                value={seriesUrl}
                onChange={(e) => setSeriesUrl(e.target.value)}
                placeholder="manga.line.me/title/..."
                className="font-mono text-xs h-8"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 text-xs h-7 gap-1"
                onClick={handleConfirm}
                disabled={loading || !seriesUrl.trim()}
              >
                <Check className="w-3 h-3" />
                confirm()
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 gap-1 border-dashed hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                onClick={handleCancel}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
