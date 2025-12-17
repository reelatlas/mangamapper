import { TrackingSite, StreamingService, TRACKING_SITES, STREAMING_SERVICES } from '@/types/anime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SourceFilterProps {
  trackingSite: TrackingSite;
  streamingService: StreamingService;
  onTrackingSiteChange: (site: TrackingSite) => void;
  onStreamingServiceChange: (service: StreamingService) => void;
}

export const SourceFilter = ({
  trackingSite,
  streamingService,
  onTrackingSiteChange,
  onStreamingServiceChange,
}: SourceFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Ranking by:</span>
        <Select value={trackingSite} onValueChange={(v) => onTrackingSiteChange(v as TrackingSite)}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {TRACKING_SITES.map((site) => (
              <SelectItem key={site.value} value={site.value}>
                {site.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Streaming on:</span>
        <Select value={streamingService} onValueChange={(v) => onStreamingServiceChange(v as StreamingService)}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {STREAMING_SERVICES.map((service) => (
              <SelectItem key={service.value} value={service.value}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
