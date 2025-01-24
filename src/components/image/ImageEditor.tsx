import React from 'react';
import { ImageElement } from '../../types';
import { ResizeHandle } from './ResizeHandle';

interface ImageEditorProps {
  image: ImageElement;
  onUpdate: (image: ImageElement) => void;
}

export function ImageEditor({ image, onUpdate }: ImageEditorProps) {
  const handleResize = (width: number, height: number) => {
    onUpdate({
      ...image,
      width: Math.max(50, width), // Minimum size of 50px
      height: Math.max(50, height)
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white mb-4">Image Properties</h3>
      
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">Size</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Width</label>
            <input
              type="number"
              value={Math.round(image.width)}
              onChange={(e) => handleResize(Number(e.target.value), image.height)}
              className="w-full px-2 py-1 bg-dark-100 border border-white/10 rounded text-white text-sm"
              min={50}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Height</label>
            <input
              type="number"
              value={Math.round(image.height)}
              onChange={(e) => handleResize(image.width, Number(e.target.value))}
              className="w-full px-2 py-1 bg-dark-100 border border-white/10 rounded text-white text-sm"
              min={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
}