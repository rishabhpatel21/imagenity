import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ImageGrid } from '../components/profile/ImageGrid';
import { Navbar } from '../components/landing/Navbar';
import { useUserProfile } from '../hooks/useUserProfile';
import { Loader2 } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import '../styles/animations.css';

export function ProfilePage() {
  const { user } = useAuth();
  const { images, loading: imagesLoading, error: imagesError } = useUserImages();
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useUserProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
          <p className="text-white">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  if (profileLoading || imagesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const error = profileError || imagesError;
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
      <Navbar onSignUpClick={() => setShowAuthModal(true)} />
      <ProfileHeader 
        email={user.email || ''}
        name={profile?.name || user.user_metadata?.full_name || ''}
        avatarUrl={profile?.avatar_url || user.user_metadata?.avatar_url}
        imagesCount={images.length}
        joinDate={user.created_at}
        onUpdateProfile={updateProfile}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ImageGrid images={images} />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}