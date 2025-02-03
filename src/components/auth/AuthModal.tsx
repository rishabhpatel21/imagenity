import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';
import { RegistrationForm } from './RegistrationForm';
import { SignInForm } from './SignInForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signUp, signIn } = useAuth();
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
    </Modal>
  );
}