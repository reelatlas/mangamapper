import { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  placeholder = "search series"
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
    ? availableAnime
        .filter(anime => anime.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.title.localeCompare(b.title))
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background font-mono border-dashed bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 min-w-0",
            open && "ring-2 ring-ring ring-offset-2 ring-offset-background"
          )}
        >
          <span className={cn(
            "truncate",
            !selectedAnime && "text-muted-foreground"
          )}>
            {selectedAnime ? selectedAnime.title : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-dashed" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="type to search" 
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
