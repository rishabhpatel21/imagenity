import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function HeaderButtons() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate('/profile')}
        className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333333] hover:bg-[#333333] transition-colors flex items-center justify-center group"
        title="Profile"
      >
        <User className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </button>

      <button
        onClick={handleSignOut}
        className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333333] hover:bg-red-900/30 hover:border-red-500/30 transition-colors flex items-center justify-center group"
        title="Sign out"
      >
        <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
      </button>
    </div>
  );
}