import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export function ResetPassword() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-dark-100 rounded-lg shadow-xl border border-white/10 p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Your Password</h1>
        <p className="text-gray-400 mb-6">Enter your new password below.</p>
        
        <ResetPasswordForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}