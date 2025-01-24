import React, { useState } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { TextElement } from '../types';
import { FONT_SIZES } from '../config/constants';
import { TextEffectsPanel } from './effects/TextEffectsPanel';
import { ColorPicker } from './ColorPicker';
import { useCanvasStore } from '../stores/canvasStore';

interface TextEditorProps {
  selectedText: TextElement | null;
  onUpdate: (updatedText: TextElement) => void;
  fonts: string[];
}

export function TextEditor({ selectedText, onUpdate, fonts }: TextEditorProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'effects'>('style');
  const { layers } = useCanvasStore();

  const handleUpdate = (updates: Partial<TextElement>) => {
    if (selectedText) {
      onUpdate({ ...selectedText, ...updates });
    }
  };

  if (!selectedText) {
    return (
      <div className="p-4 text-center text-white">
        Select a text layer to edit its properties
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex gap-2 mb-4 border-b border-white/20">
        <button
          className={`px-4 py-2 ${
            activeTab === 'style' ? 'border-b-2 border-white' : ''
          }`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'effects' ? 'border-b-2 border-white' : ''
          }`}
          onClick={() => setActiveTab('effects')}
        >
          Effects
        </button>
      </div>

      {activeTab === 'style' ? (
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              className={`p-2 rounded border ${selectedText.isBold ? 'bg-black border-white' : 'border-white/20'}`}
              onClick={() => handleUpdate({ isBold: !selectedText.isBold })}
            >
              <Bold size={20} />
            </button>
            <button
              className={`p-2 rounded border ${selectedText.isItalic ? 'bg-black border-white' : 'border-white/20'}`}
              onClick={() => handleUpdate({ isItalic: !selectedText.isItalic })}
            >
              <Italic size={20} />
            </button>
            <button
              className={`p-2 rounded border ${selectedText.isUnderline ? 'bg-black border-white' : 'border-white/20'}`}
              onClick={() => handleUpdate({ isUnderline: !selectedText.isUnderline })}
            >
              <Underline size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Text</label>
            <input
              type="text"
              value={selectedText.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              className="w-full p-2 bg-black border border-white/20 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Font Size ({selectedText.fontSize}px)
            </label>
            <input
              type="range"
              min={FONT_SIZES.min}
              max={FONT_SIZES.max}
              value={selectedText.fontSize}
              onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Font Family</label>
            <select
              value={selectedText.fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className="w-full p-2 bg-black border border-white/20 rounded text-white"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <ColorPicker
              color={selectedText.color}
              onChange={(color) => handleUpdate({ color })}
              label="Text Color"
            />
          </div>
        </div>
      ) : (
        <TextEffectsPanel
          effects={selectedText.effects || {}}
          onChange={(effects) => handleUpdate({ effects })}
        />
      )}
    </div>
  );
}