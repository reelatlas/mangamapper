-- Add updated_at column to manga_reader_sites
ALTER TABLE public.manga_reader_sites 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Set initial updated_at to created_at for existing rows
UPDATE public.manga_reader_sites 
SET updated_at = created_at;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_manga_reader_sites_updated_at
BEFORE UPDATE ON public.manga_reader_sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();