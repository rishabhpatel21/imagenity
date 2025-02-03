import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { FcGoogle } from 'react-icons/fc';
import { SignInForm } from './SignInForm';
import { RegistrationForm } from './RegistrationForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot-password';

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AuthView>('signin');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const handleSignUp = async (data: any) => {
    try {
      await signUp(data.email, data.password);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={
        view === 'signin' ? 'Sign in to your account' :
        view === 'signup' ? 'Create an account' :
        'Reset your password'
      }
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {view === 'signin' && (
        <>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-3 mb-4"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-100 text-gray-400">Or continue with</span>
            </div>
          </div>

          <SignInForm onSubmit={handleEmailSignIn} />

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setView('forgot-password')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Forgot password?
            </button>
            <button
              onClick={() => setView('signup')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Create account
            </button>
          </div>
        </>
      )}

      {view === 'signup' && (
        <>
          <RegistrationForm onComplete={handleSignUp} />
          <button
            onClick={() => setView('signin')}
            className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Already have an account? Sign in
          </button>
        </>
      )}

      {view === 'forgot-password' && (
        <>
          <ForgotPasswordForm onSuccess={() => setView('signin')} />
          <button
            onClick={() => setView('signin')}
            className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to sign in
          </button>
        </>
      )}
    </Modal>
  );
}