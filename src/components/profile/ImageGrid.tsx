import React from 'react';
import { ImageCard } from './ImageCard';
import { SharedImage } from '../../types';

interface ImageGridProps {
  images: SharedImage[];
}

export function ImageGrid({ images }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No public images yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}