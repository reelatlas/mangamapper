import { useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { mockAnimeData } from '@/data/mockAnime';

interface SeriesComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  excludeIds?: string[];
  placeholder?: string;
}

export function SeriesCombobox({ 
  value, 
  onValueChange, 
  excludeIds = [],
  placeholder = "search series..."
}: SeriesComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedAnime = mockAnimeData.find(anime => anime.id === value);
  
  // Filter out excluded IDs (already selected in other rows)
  const availableAnime = mockAnimeData.filter(
    anime => !excludeIds.includes(anime.id) || anime.id === value
  );

  // Only show results when user has typed at least 1 character
  const showResults = search.length >= 1;
  
  const filteredAnime = showResults
    ? availableAnime.filter(anime => 
        anime.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-mono text-sm border-dashed bg-muted/30 hover:bg-muted/50 hover:text-muted-foreground"
        >
          <span className={cn(!selectedAnime && "text-muted-foreground")}>
            {selectedAnime ? selectedAnime.title : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0 border-dashed" 
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="type to search..." 
            value={search}
            onValueChange={setSearch}
            className="font-mono text-sm"
          />
          <CommandList>
            {!showResults ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Search className="w-4 h-4 mx-auto mb-2 opacity-50" />
                start typing to search
              </div>
            ) : filteredAnime.length === 0 ? (
              <CommandEmpty>no series found</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredAnime.map((anime) => (
                  <CommandItem
                    key={anime.id}
                    value={anime.id}
                    onSelect={() => {
                      onValueChange(anime.id);
                      setOpen(false);
                      setSearch('');
                    }}
                    className="font-mono text-sm"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === anime.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {anime.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
