import { useState, useEffect } from 'react';
import { getUserImages } from '../utils/imageSharing';
import { useAuth } from './useAuth';
import { SharedImage } from '../types';

export function useUserImages() {
  const [images, setImages] = useState<SharedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchImages() {
      if (!user) return;
      
      try {
        setLoading(true);
        const userImages = await getUserImages(user.id);
        setImages(userImages.filter(img => img.is_public));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [user]);

  return { images, loading, error };
}