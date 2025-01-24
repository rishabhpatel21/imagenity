import React, { useState } from 'react';
import { Download, Share2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '../../stores/canvasStore';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';
import { ShareModal } from '../sharing/ShareModal';
import { downloadImage } from '../../utils/downloadUtils';

const resolutionOptions = [
  { label: 'HD (720p)', width: 1280, height: 720, quality: 0.8 },
  { label: 'Full HD (1080p)', width: 1920, height: 1080, quality: 0.9 },
  { label: '2K', width: 2560, height: 1440, quality: 0.95 },
  { label: '4K', width: 3840, height: 2160, quality: 1.0 }
];

export function HeaderActions() {
  const [showOptions, setShowOptions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { image } = useCanvasStore();
  const { user } = useAuth();

  const handleAction = async (type: 'download' | 'share', option?: typeof resolutionOptions[0]) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (type === 'download' && option) {
      await downloadImage(option);
      setShowOptions(false);
    } else if (type === 'share') {
      setShowShareModal(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Download Button Group */}
        <div className="flex bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#333333]">
          <button
            onClick={() => handleAction('download', resolutionOptions[1])}
            disabled={!image?.original}
            className="h-[34px] px-4 text-white hover:bg-[#333333] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="h-[34px] px-2 text-white hover:bg-[#333333] border-l border-[#333333] transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={() => handleAction('share')}
          disabled={!image?.original}
          className="h-[34px] px-4 bg-[#1a1a1a] text-white rounded-lg border border-[#333333] hover:bg-[#333333] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Resolution Options Dropdown */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg border border-[#333333] py-1 z-50"
          >
            {resolutionOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAction('download', option)}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#333333] flex items-center justify-between transition-colors"
              >
                <span>{option.label}</span>
                <span className="text-xs text-gray-500">
                  {option.width}×{option.height}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowShareModal(true);
        }}
      />

      {image?.original && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageUrl={image.original}
        />
      )}
    </div>
  );
}