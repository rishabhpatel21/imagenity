import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { RegistrationForm } from './RegistrationForm';
import { SignInForm } from './SignInForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
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
  const { signUp, signIn } = useAuth();
  const { signInWithGoogle, signInWithEmail, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signup' | 'signin' | 'forgot-password'>('signup');

  const handleRegistrationComplete = async (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    mobileNumber: string;
  }) => {
    try {
      const { error: signUpError } = await signUp(formData);
      
      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          setError('This email is already registered. Please try signing in instead.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleSignIn = async (identifier: string, password: string) => {
  const [view, setView] = useState<AuthView>('signin');

  const handleGoogleSignIn = async () => {
    try {
      const { error: signInError } = await signIn({ identifier, password });
      
      if (signInError) {
        setError('Invalid credentials');
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleForgotPasswordSuccess = () => {
    setTimeout(() => {
      onClose();
    }, 3000);
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
        mode === 'signup' 
          ? "Create your account" 
          : mode === 'signin'
          ? "Sign in to your account"
          : "Reset your password"
      }
      description={
        mode === 'signup' 
          ? "Fill in your details to get started" 
          : mode === 'signin'
          ? "Welcome back! Please sign in to continue"
          : "Enter your email to receive reset instructions"
      }
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
      
      {mode === 'signup' && (
        <>
          <RegistrationForm onComplete={handleRegistrationComplete} />
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className="text-white hover:underline"
            >
              Sign in
            </button>
          </p>
        </>
      )}

      {mode === 'signin' && (
        <>
          <SignInForm onSubmit={handleSignIn} />
          <div className="mt-4 text-center text-sm text-gray-400 space-y-2">
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-white hover:underline"
              >
                Sign up
              </button>
            </p>
            <p>
              <button
                onClick={() => {
                  setMode('forgot-password');
                  setError(null);
                }}
                className="text-white hover:underline"
              >
                Forgot password?
              </button>
            </p>
          </div>
        </>
      )}

      {mode === 'forgot-password' && (
        <>
          <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
          <p className="mt-4 text-center text-sm text-gray-400">
            Remember your password?{' '}
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className="text-white hover:underline"
            >
              Sign in
            </button>
          </p>
        </>
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