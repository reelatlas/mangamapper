-- Add columns for series assignment to manga_reader_sites
ALTER TABLE public.manga_reader_sites 
ADD COLUMN anime_id text NULL,
ADD COLUMN series_url text NULL;