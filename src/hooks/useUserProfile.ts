import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  name: string;
  avatar_url: string;
  updated_at: string;
}

interface UpdateProfileData {
  name?: string;
  avatar_url?: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: UpdateProfileData) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
}