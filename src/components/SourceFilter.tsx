import { TrackingSite, StreamingService, TRACKING_SITES, STREAMING_SERVICES } from '@/types/anime';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    <div className="flex flex-col gap-4">
      {/* Tracking site toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Ranking by:</span>
        <ToggleGroup
          type="single"
          value={trackingSite}
          onValueChange={(value) => value && onTrackingSiteChange(value as TrackingSite)}
          className="justify-start"
        >
          {TRACKING_SITES.map((site) => (
            <ToggleGroupItem
              key={site.value}
              value={site.value}
              className="px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {site.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Streaming service toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Streaming on:</span>
        <ToggleGroup
          type="single"
          value={streamingService}
          onValueChange={(value) => value && onStreamingServiceChange(value as StreamingService)}
          className="justify-start flex-wrap"
        >
          {STREAMING_SERVICES.map((service) => (
            <ToggleGroupItem
              key={service.value}
              value={service.value}
              className="px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {service.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};
