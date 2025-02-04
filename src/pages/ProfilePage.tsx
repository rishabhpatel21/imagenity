import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ImageGrid } from '../components/profile/ImageGrid';
import { useUserImages } from '../hooks/useUserImages';
import { Loader2 } from 'lucide-react';
import '../styles/animations.css';

export function ProfilePage() {
  const { user } = useAuth();
  const { images, loading, error } = useUserImages();

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
          <p className="text-white">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500/50 p-6 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader 
        email={user.email || ''}
        imagesCount={images.length}
        joinDate={user.created_at}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ImageGrid images={images} />
      </div>
    </div>
  );
}