import React from 'react';
import { Heart } from 'lucide-react';
import { SharedImage } from '../../types';
import { Link } from 'react-router-dom';

interface ImageCardProps {
  image: SharedImage;
}

export function ImageCard({ image }: ImageCardProps) {
  return (
    <Link 
      to={`/share/${image.public_url}`}
      className="block group relative aspect-square bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-white/5 transition-all duration-300"
    >
      <img
        src={image.image_url}
        alt={image.title}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
      />
      
      {/* Animated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-medium truncate mb-2">{image.title}</h3>
            
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
              <span className="text-sm text-gray-200">0</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}