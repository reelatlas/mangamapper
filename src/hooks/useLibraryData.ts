import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AnimeProgress, ReaderSite } from '@/types/library';

export const useLibraryData = () => {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<AnimeProgress[]>([]);
  const [readerSites, setReaderSites] = useState<ReaderSite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('anime_progress')
      .select('*')
      .eq('in_library', true)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data || []);
    }
  };

  const fetchReaderSites = async () => {
    const { data, error } = await supabase
      .from('manga_reader_sites')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching reader sites:', error);
    } else {
      setReaderSites(data || []);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchProgress(), fetchReaderSites()]);
    setLoading(false);
  };

  const removeFromLibrary = async (id: string) => {
    const { error } = await supabase
      .from('anime_progress')
      .update({ in_library: false })
      .eq('id', id);

    if (error) {
      toast.error('Failed to remove from library');
    } else {
      toast.success('Removed from library');
      fetchProgress();
      fetchReaderSites();
    }
  };

  const deleteReaderSite = async (id: string) => {
    const { error } = await supabase
      .from('manga_reader_sites')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete reader site');
    } else {
      toast.success('Reader removed');
      fetchReaderSites();
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    user,
    authLoading,
    loading,
    progress,
    readerSites,
    fetchProgress,
    fetchReaderSites,
    removeFromLibrary,
    deleteReaderSite,
  };
};
