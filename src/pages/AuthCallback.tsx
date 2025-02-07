import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Get registration data from localStorage
          const registrationData = localStorage.getItem('registrationData');
          if (registrationData) {
            const parsedData = JSON.parse(registrationData);
            
            // Insert user profile data
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: session.user.id,
                first_name: parsedData.firstName,
                last_name: parsedData.lastName,
                username: parsedData.username,
                mobile_number: parsedData.mobileNumber,
                company_name: parsedData.companyName || null,
                position: parsedData.position || null,
                state_name: parsedData.state,
                country_name: parsedData.country
              });

            if (profileError) {
              console.error('Error saving profile:', profileError);
              localStorage.setItem('authError', 'Failed to create user profile');
              navigate('/');
              return;
            }

            // Clear registration data from localStorage
            localStorage.removeItem('registrationData');
            
            // Redirect to editor
            navigate('/editor');
          } else {
            // For regular sign in (no registration data)
            navigate('/editor');
          }
        } catch (error) {
          console.error('Error in auth callback:', error);
          localStorage.setItem('authError', 'An unexpected error occurred');
          navigate('/');
        }
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-white">Completing sign in...</p>
      </div>
    </div>
  );
}