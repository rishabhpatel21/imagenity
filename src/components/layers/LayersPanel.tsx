import React from 'react';
import { Layers } from 'lucide-react';
import { TextElement, ImageElement } from '../../types';
import { LayersList } from './LayersList';
import { useCanvasStore } from '../../stores/canvasStore';

interface LayersPanelProps {
  selectedText: TextElement | null;
  selectedImage: ImageElement | null;
  onSelectText: (text: TextElement | null) => void;
  onSelectImage: (image: ImageElement | null) => void;
}

export function LayersPanel({ 
  selectedText, 
  selectedImage,
  onSelectText,
  onSelectImage 
}: LayersPanelProps) {
  const { layers } = useCanvasStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-white">Layers</h3>
        </div>
        <span className="text-xs text-gray-500">{layers.length} layers</span>
      </div>

      <LayersList
        selectedText={selectedText}
        selectedImage={selectedImage}
        onSelectText={onSelectText}
        onSelectImage={onSelectImage}
      />
    </div>
  );
}