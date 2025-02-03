import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { FcGoogle } from 'react-icons/fc';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Sign in to your account"
      description="Choose your preferred sign in method"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
      
      <button
        onClick={handleGoogleSignIn}
        className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3"
      >
        <FcGoogle className="w-5 h-5" />
        <span>Continue with Google</span>
      </button>
    </Modal>
  );
}