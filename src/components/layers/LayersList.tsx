import React from 'react';
import { Reorder } from 'framer-motion';
import { Layer, TextElement, ImageElement } from '../../types';
import { LayerItem } from './LayerItem';
import { useCanvasStore } from '../../stores/canvasStore';

interface LayersListProps {
  selectedText: TextElement | null;
  selectedImage: ImageElement | null;
  onSelectText: (text: TextElement | null) => void;
  onSelectImage: (image: ImageElement | null) => void;
}

export function LayersList({ 
  selectedText, 
  selectedImage,
  onSelectText,
  onSelectImage 
}: LayersListProps) {
  const { 
    layers, 
    toggleLayerVisibility, 
    toggleLayerPosition, 
    reorderLayers,
    removeText,
    removeImage
  } = useCanvasStore();

  const handleReorder = (reorderedLayers: Layer[]) => {
    const movedLayer = reorderedLayers.find((layer, index) => layer.id !== layers[layers.length - 1 - index]?.id);
    if (!movedLayer) return;

    const oldIndex = layers.findIndex(layer => layer.id === movedLayer.id);
    const newIndex = layers.length - 1 - reorderedLayers.findIndex(layer => layer.id === movedLayer.id);

    if (oldIndex !== newIndex) {
      reorderLayers(oldIndex, newIndex);
    }
  };

  const handleDelete = (id: string) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;

    if (layer.type === 'text') {
      removeText(id);
      if (selectedText?.id === id) {
        onSelectText(null);
      }
    } else if (layer.type === 'image') {
      removeImage(id);
      if (selectedImage?.id === id) {
        onSelectImage(null);
      }
    }
  };

  const handleLayerClick = (layer: Layer) => {
    if (layer.type === 'text' && layer.data) {
      onSelectText(layer.data as TextElement);
      onSelectImage(null);
    } else if (layer.type === 'image' && layer.data) {
      onSelectImage(layer.data as ImageElement);
      onSelectText(null);
    }
  };

  // Reverse layers for display so higher z-index appears at top
  const displayLayers = [...layers].reverse();

  return (
    <Reorder.Group
      axis="y"
      values={displayLayers}
      onReorder={handleReorder}
      className="space-y-1"
    >
      {displayLayers.map((layer) => (
        <LayerItem
          key={layer.id}
          layer={layer}
          name={layer.type === 'text' ? layer.data?.text || 'Text Layer' : layer.type}
          isSelected={
            (layer.type === 'text' && layer.data?.id === selectedText?.id) ||
            (layer.type === 'image' && layer.data?.id === selectedImage?.id)
          }
          onVisibilityToggle={toggleLayerVisibility}
          onPositionToggle={toggleLayerPosition}
          onDelete={handleDelete}
          onClick={() => handleLayerClick(layer)}
          isDraggable={layer.type !== 'background'}
        />
      ))}
    </Reorder.Group>
  );
}