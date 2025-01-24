import React from 'react';
import { ImagePlus } from 'lucide-react';

interface ImageUploadButtonProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadButton({ onUpload, disabled }: ImageUploadButtonProps) {
  return (
    <button
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) onUpload(file);
        };
        input.click();
      }}
      className="w-full px-4 py-2 bg-white text-black rounded-lg hover:bg-green-900/30 hover:ring-1 hover:ring-green-500/30 hover:text-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      disabled={disabled}
    >
      <ImagePlus className="w-4 h-4" />
      <span>Add Image</span>
    </button>
  );
}