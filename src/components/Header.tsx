import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './header/Logo';
import { HeaderActions } from './header/HeaderActions';
import { HeaderButtons } from './header/HeaderButtons';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './auth/AuthModal';

export function Header() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="border-b border-dark-200 bg-dark-50">
      <div className="h-16 px-4 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <HeaderActions />
          
          {user ? (
            <HeaderButtons />
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] hover:bg-[#333333] transition-colors text-sm"
            >
              Sign up
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}