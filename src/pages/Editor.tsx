import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Canvas } from '../components/Canvas';
import { TextEditor } from '../components/TextEditor';
import { ImageEditor } from '../components/image/ImageEditor';
import { ImageUploadButton } from '../components/ImageUploadButton';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useGoogleFonts } from '../hooks/useGoogleFonts';
import { useCanvasStore } from '../stores/canvasStore';
import { TextElement, ImageElement } from '../types';
import { nanoid } from 'nanoid';
import { FONT_SIZES } from '../config/constants';
import { ErrorMessage } from '../components/ErrorMessage';
import { LayersPanel } from '../components/layers/LayersPanel';

export function Editor() {
  const { processedImage, isProcessing, error, processImage, cleanup, setError } = useImageProcessing();
  const { fonts, loading: fontsLoading } = useGoogleFonts();
  const [selectedText, setSelectedText] = useState<TextElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageElement | null>(null);
  const { addText, updateText, setImage, addImage, updateImage } = useCanvasStore();

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    cleanup();
    try {
      const originalUrl = URL.createObjectURL(file);
      setImage({ original: originalUrl, foreground: null });
      await processImage(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const handleAddText = () => {
    const newText: TextElement = {
      id: nanoid(),
      text: 'Double click to edit',
      x: 50,
      y: 50,
      fontSize: FONT_SIZES.defaultSize,
      color: '#ffffff',
      fontFamily: fonts[0] || 'Arial',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isVisible: true,
      effects: {}
    };
    addText(newText);
    setSelectedText(newText);
    setSelectedImage(null);
  };

  const handleAddImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const containerWidth = document.getElementById('canvas-container')?.offsetWidth || 800;
      const containerHeight = document.getElementById('canvas-container')?.offsetHeight || 600;
      
      let width = img.width;
      let height = img.height;
      const maxWidth = containerWidth * 0.8;
      const maxHeight = containerHeight * 0.8;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      const newImage: ImageElement = {
        id: nanoid(),
        url,
        width,
        height,
        x: (containerWidth - width) / 2,
        y: (containerHeight - height) / 2,
        isVisible: true
      };
      
      addImage(newImage);
      setSelectedImage(newImage);
      setSelectedText(null);
    };
  };

  const handleTextUpdate = (updatedText: TextElement) => {
    updateText(updatedText);
    setSelectedText(updatedText);
  };

  const handleImageUpdate = (updatedImage: ImageElement) => {
    updateImage(updatedImage);
    setSelectedImage(updatedImage);
  };

  return (
    <div className="h-screen flex flex-col bg-dark-100">
      <Header />
      
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-[280px] border-r border-dark-200 bg-dark-50">
          <div className="p-4 space-y-4">
            <div className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 gradient-bg opacity-20 group-hover:opacity-30 transition-opacity" />
              <label className="relative block">
                <div className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-dark-300 rounded-lg hover:border-accent-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    Upload background
                  </span>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleAddText}
                className="w-full px-4 py-2 bg-white text-black rounded-lg  hover:bg-green-900/30 hover:ring-1 hover:ring-green-500/30 hover:text-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!processedImage?.original}
              >
                Add Text
              </button>

              <ImageUploadButton
                onUpload={handleAddImage}
                disabled={!processedImage?.original}
              />
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-dark-100 p-8">
          <Canvas
            processedImage={processedImage}
            isProcessing={isProcessing}
            selectedText={selectedText}
            selectedImage={selectedImage}
            onTextSelect={(text) => {
              setSelectedText(text);
              setSelectedImage(null);
            }}
            onImageSelect={(image) => {
              setSelectedImage(image);
              setSelectedText(null);
            }}
            onTextUpdate={handleTextUpdate}
            onImageUpdate={handleImageUpdate}
          />
        </div>

        {/* Right Properties Panel */}
        <div className="w-[320px] border-l border-dark-200 bg-dark-50 flex flex-col">
          <div className="p-4 flex-1">
            <h3 className="text-sm font-medium text-white mb-4">Properties</h3>
            {selectedText && !fontsLoading && (
              <TextEditor
                selectedText={selectedText}
                onUpdate={handleTextUpdate}
                fonts={fonts}
              />
            )}
            {selectedImage && (
              <ImageEditor
                image={selectedImage}
                onUpdate={handleImageUpdate}
              />
            )}
            {!selectedText && !selectedImage && (
              <div className="text-center text-gray-400 py-4">
                Select a text or image layer to edit its properties
              </div>
            )}
          </div>

          <div className="border-t border-dark-200 p-4">
            <LayersPanel
              selectedText={selectedText}
              selectedImage={selectedImage}
              onSelectText={setSelectedText}
              onSelectImage={setSelectedImage}
            />
          </div>
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
    </div>
  );
}