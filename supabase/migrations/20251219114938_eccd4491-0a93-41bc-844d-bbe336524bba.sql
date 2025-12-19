-- Drop the trigger that auto-updates updated_at on anime_progress table
DROP TRIGGER IF EXISTS update_anime_progress_updated_at ON public.anime_progress;