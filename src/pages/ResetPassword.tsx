import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useLoaderData } from 'react-router-dom';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface LoaderData {
  accessToken: string | null;
  refreshToken: string | null;
  type: string | null;
}

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const loaderData = useLoaderData() as LoaderData;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeSession() {
      try {
        setLoading(true);
        
        // First try to get token from loader data
        let accessToken = loaderData?.accessToken;
        let refreshToken = loaderData?.refreshToken;
        
        // If not in loader data, try to get from URL hash
        if (!accessToken) {
          const hash = location.hash;
          if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            accessToken = params.get('access_token');
            refreshToken = params.get('refresh_token');
          }
        }

        if (accessToken) {
          // Set the session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            throw sessionError;
          }
        } else {
          setError('Invalid or expired reset password link');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize session');
      } finally {
        setLoading(false);
      }
    }

    initializeSession();
  }, [location.hash, loaderData]);

  const handleSuccess = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="text-white">Initializing reset password...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-100 rounded-lg shadow-xl border border-white/10 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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
