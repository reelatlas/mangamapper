import { StreamingService, STREAMING_SERVICES } from '@/types/anime';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SourceFilterProps {
  streamingService: StreamingService;
  onStreamingServiceChange: (service: StreamingService) => void;
}

export const SourceFilter = ({
  streamingService,
  onStreamingServiceChange,
}: SourceFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">streaming on:</span>
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
            className="px-3 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {service.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
