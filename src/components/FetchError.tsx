import { Button } from "@/components/ui/button";

// The failed-fetch state for a page whose query errored (P5/P6 on the UI
// side: a failure is shown as a failure, never as an empty catalog). Same
// dashed block as the pages' `anime_not_found`, so the three data states
// (loading, empty, failed) read as one family. `code` is the on-screen
// token, snake_case like the others; `detail` is optional operator text.
interface FetchErrorProps {
  code: string;
  detail?: string;
  onRetry?: () => void;
}

export const FetchError = ({ code, detail, onRetry }: FetchErrorProps) => (
  <div className="border border-dashed p-8 max-w-md mx-auto text-center" role="alert">
    <p className="text-destructive text-sm mb-4">
      <span className="text-syntax-cyan">error</span>
      <span className="text-muted-foreground">: </span>
      <span className="text-syntax-green">{code}</span>
    </p>
    {detail && <p className="text-muted-foreground text-xs mb-4">{detail}</p>}
    {onRetry && (
      <Button className="border-dashed text-xs" onClick={onRetry}>
        retry
      </Button>
    )}
  </div>
);
