import React from 'react';
import { Calendar } from 'lucide-react';

interface ProfileHeaderProps {
  email: string;
  imagesCount: number;
  joinDate: string;
}

export function ProfileHeader({ email, imagesCount, joinDate }: ProfileHeaderProps) {
  const initial = email.charAt(0).toUpperCase();
  const formattedDate = new Date(joinDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="gradient-animate border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-start gap-8">
          {/* Animated Avatar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-5xl font-bold text-white relative hover:scale-105 transition-transform duration-300">
              {initial}
            </div>
          </div>

          {/* Profile Info with Animations */}
          <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold text-white mb-2 hover:text-gray-200 transition-colors">
              {email}
            </h1>
            
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