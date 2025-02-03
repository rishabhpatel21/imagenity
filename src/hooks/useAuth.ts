import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
}

interface SignInData {
  identifier: string; // Can be email or username
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    });

    if (signUpError) {
      return { error: signUpError };
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.username,
          mobile_number: data.mobileNumber
        });

      if (profileError) {
        return { error: profileError };
      }
    }

    return { data: authData };
  };

  const signIn = async ({ identifier, password }: SignInData) => {
    // First try to sign in with email
    const { data: emailData, error: emailError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password
    });

    if (!emailError) {
      return { data: emailData };
    }

    // If email sign in fails, try to find user by username
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('username', identifier)
      .single();

    if (userError) {
      return { error: emailError }; // Return original error if username not found
    }

    // Get user's email using user_id
    const { data: emailLookup, error: emailLookupError } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', userData.user_id)
      .single();

    if (emailLookupError) {
      return { error: emailLookupError };
    }

    // Try sign in with found email
    return await supabase.auth.signInWithPassword({
      email: emailLookup.email,
      password
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };
}