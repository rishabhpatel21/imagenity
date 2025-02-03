import { useState, useEffect } from 'react';
import { fetchGoogleFonts } from '../utils/fonts/api';
import { loadFonts, getFallbackFonts } from '../utils/fonts/loader';

export function useGoogleFonts() {
  const [fonts, setFonts] = useState<string[]>(getFallbackFonts());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeFonts = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Fonts API key is missing');
        }

        // Fetch fonts from API
        const googleFonts = await fetchGoogleFonts(apiKey);
        
        if (!mounted) return;

        // Combine with system fonts and remove duplicates
        const allFonts = [...new Set([...getFallbackFonts(), ...googleFonts])];
        
        // Load fonts
        await loadFonts(googleFonts);
        
        if (!mounted) return;
        
        setFonts(allFonts);
      } catch (err) {
        console.error('Error loading fonts:', err);
        if (mounted) {
          setError('Failed to load fonts');
          // Use fallback fonts
          setFonts(getFallbackFonts());
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeFonts();

    return () => {
      mounted = false;
    };
  }, []);

  return { fonts, loading, error };
}