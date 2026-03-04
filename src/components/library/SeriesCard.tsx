import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Tv, Trash2, ExternalLink, Glasses, X, Check } from 'lucide-react';
import { getAnimeById } from '@/data/mockAnime';
import type { AnimeProgress, ReaderSite } from '@/types/library';
import { getReadersForAnime } from '@/types/library';

interface SeriesCardProps {
  item: AnimeProgress;
  readerSites: ReaderSite[];
  onRemove: (id: string) => void;
}

export const SeriesCard = ({ item, readerSites, onRemove }: SeriesCardProps) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const anime = getAnimeById(item.anime_id);
  if (!anime) return null;

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
                  <Tv className={`w-3.5 h-3.5 shrink-0 ${item.last_watched_episode != null ? "text-primary" : "text-muted-foreground"}`} />
                  <span>
                    <span className="text-muted-foreground">ep:</span>
                    <span className={item.last_watched_episode != null ? "text-foreground" : "text-muted-foreground"}>{item.last_watched_episode ?? '—'}</span>
                  </span>
                </div>
                {anime.hasManga ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <BookOpen className={`w-3.5 h-3.5 shrink-0 ${(item.last_read_volume != null || item.last_read_chapter != null) ? "text-primary" : "text-muted-foreground"}`} />
                    <span>
                      <span className="text-muted-foreground">vol:</span>
                      <span className={item.last_read_volume != null ? "text-foreground" : "text-muted-foreground"}>{item.last_read_volume ?? '—'}</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span>
                      <span className="text-muted-foreground">ch:</span>
                      <span className={item.last_read_chapter != null ? "text-foreground" : "text-muted-foreground"}>{item.last_read_chapter ?? '—'}</span>
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
                    {getReadersForAnime(item.anime_id, readerSites).length > 0 ? (
                      <div className="flex items-center gap-1.5 min-h-5 flex-wrap">
                        <Glasses className="w-3.5 h-3.5 shrink-0 text-primary" />
                        {getReadersForAnime(item.anime_id, readerSites).map((reader) => (
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
            <div className="flex items-start">
              {confirmingDelete ? (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); setConfirmingDelete(false); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingDelete(false); }} className="text-muted-foreground hover:text-muted-foreground hover:bg-muted">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingDelete(true); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
