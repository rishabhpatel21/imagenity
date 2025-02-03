import React, { useState } from 'react';
import { Calendar, Edit2, Check, X } from 'lucide-react';

interface ProfileHeaderProps {
  email: string;
  name: string;
  avatarUrl?: string;
  imagesCount: number;
  joinDate: string;
  onUpdateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<void>;
}

export function ProfileHeader({ 
  email, 
  name, 
  avatarUrl, 
  imagesCount, 
  joinDate,
  onUpdateProfile 
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdateProfile({ name: editName });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(joinDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="gradient-animate border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-28 h-28 rounded-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-5xl font-bold text-white relative hover:scale-105 transition-transform duration-300">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-4 mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-dark-100 border border-white/10 rounded px-3 py-1 text-white text-xl"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="p-2 text-green-400 hover:bg-green-900/30 rounded-full transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(name);
                    }}
                    className="p-2 text-red-400 hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white">{name}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            
            <p className="text-gray-400 mb-4">{email}</p>
            
            <div className="flex items-center gap-8 text-gray-400">
              <div className="group cursor-pointer">
                <span className="text-lg group-hover:text-white transition-colors">
                  {imagesCount}
                </span>
                <span className="ml-2 group-hover:text-gray-300 transition-colors">
                  images
                </span>
              </div>
              
              <div className="flex items-center gap-2 group">
                <Calendar className="w-5 h-5 group-hover:text-white transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">
                  Joined {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}