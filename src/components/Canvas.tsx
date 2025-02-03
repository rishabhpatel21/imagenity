import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ProcessedImage, TextElement, ImageElement } from '../types';
import { DraggableText } from './DraggableText';
import { DraggableImage } from './DraggableImage';
import { useCanvasStore } from '../stores/canvasStore';

interface CanvasProps {
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
  selectedText: TextElement | null;
  selectedImage: ImageElement | null;
  onTextSelect: (text: TextElement | null) => void;
  onImageSelect: (image: ImageElement | null) => void;
  onTextUpdate: (text: TextElement) => void;
  onImageUpdate: (image: ImageElement) => void;
}

export function Canvas({
  processedImage,
  isProcessing,
  selectedText,
  selectedImage,
  onTextSelect,
  onImageSelect,
  onTextUpdate,
  onImageUpdate
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { layers } = useCanvasStore();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas size based on original image
  useEffect(() => {
    if (processedImage?.original) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = processedImage.original;
      img.onload = () => {
        if (!containerRef.current) return;
        
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let width, height;
        
        if (containerAspectRatio > imageAspectRatio) {
          height = containerHeight;
          width = height * imageAspectRatio;
        } else {
          width = containerWidth;
          height = width / imageAspectRatio;
        }
        
        setCanvasSize({ width, height });
      };
    }
  }, [processedImage?.original]);

  const handleTextMove = useCallback((id: string, x: number, y: number) => {
    const textLayer = layers.find(
      layer => layer.type === 'text' && layer.data?.id === id
    );
    if (textLayer?.data) {
      onTextUpdate({ ...textLayer.data as TextElement, x, y });
    }
  }, [layers, onTextUpdate]);

  const handleImageMove = useCallback((id: string, x: number, y: number) => {
    const imageLayer = layers.find(
      layer => layer.type === 'image' && layer.data?.id === id
    );
    if (imageLayer?.data) {
      onImageUpdate({ ...imageLayer.data as ImageElement, x, y });
    }
  }, [layers, onImageUpdate]);

  const handleImageResize = useCallback((id: string, width: number, height: number) => {
    const imageLayer = layers.find(
      layer => layer.type === 'image' && layer.data?.id === id
    );
    if (imageLayer?.data) {
      onImageUpdate({ ...imageLayer.data as ImageElement, width, height });
    }
  }, [layers, onImageUpdate]);

  const handleCanvasClick = () => {
    onTextSelect(null);
    onImageSelect(null);
  };

  if (!processedImage?.original && !isProcessing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#d8d8d8] rounded-lg border-2 border-dashed border-dark-300">
        <p className="text-gray-800">Upload an image to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-dark-100 p-4 overflow-auto">
      <div 
        ref={containerRef}
        id="canvas-container"
        className="relative bg-dark-50 rounded-lg shadow-2xl"
        style={{ 
          width: canvasSize.width || '100%',
          height: canvasSize.height || '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        onClick={handleCanvasClick}
      >
        {layers.map((layer, index) => {
          if (!layer.isVisible) return null;

          switch (layer.type) {
            case 'background':
              return processedImage?.original && (
                <img
                  key={layer.id}
                  src={processedImage.original}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ zIndex: index }}
                  crossOrigin="anonymous"
                />
              );
            case 'text':
              return layer.data && (
                <DraggableText
                  key={layer.id}
                  text={layer.data as TextElement}
                  onSelect={onTextSelect}
                  onMove={handleTextMove}
                  containerRef={containerRef}
                  isSelected={selectedText?.id === layer.data.id}
                  style={{ zIndex: index }}
                />
              );
            case 'image':
              return layer.data && (
                <DraggableImage
                  key={layer.id}
                  image={layer.data as ImageElement}
                  onSelect={onImageSelect}
                  onMove={handleImageMove}
                  onResize={handleImageResize}
                  containerRef={containerRef}
                  isSelected={selectedImage?.id === layer.data.id}
                  style={{ zIndex: index }}
                />
              );
            case 'foreground':
              return processedImage?.foreground && (
                <img
                  key={layer.id}
                  src={processedImage.foreground}
                  alt="Foreground"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ zIndex: index }}
                  crossOrigin="anonymous"
                />
              );
            default:
              return null;
          }
        })}

        {isProcessing && (
          <div className="absolute inset-0 bg-dark-50/80 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-300">Processing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}