import React, { useState } from 'react';
import { X, Copy, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { shareImage } from '../../utils/imageSharing';
import { Toggle } from '../Toggle';
import { Modal } from '../ui/Modal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ShareModal({ isOpen, onClose, imageUrl }: ShareModalProps) {
  const [title, setTitle] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const shareId = await shareImage({
        title,
        userId: user.id,
        isPublic
      });
      const fullUrl = `${window.location.origin}/share/${shareId}`;
      setShareUrl(fullUrl);
    } catch (error) {
      setError(error instanceof Error 
        ? error.message 
        : 'Failed to share image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Image">
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!shareUrl ? (
        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-dark-100 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-white"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Make image public
            </label>
            <Toggle enabled={isPublic} onChange={setIsPublic} />
          </div>

          <p className="text-sm text-gray-400">
            {isPublic 
              ? "Anyone with the link can view this image" 
              : "Only you can view this image"}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sharing...
              </>
            ) : (
              'Generate Share Link'
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-dark-100 rounded-lg border border-white/10">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent border-none text-white focus:ring-0 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-sm text-gray-400 text-center">
            {isPublic 
              ? "Anyone with this link can view the image"
              : "Only you can view this image"}
          </p>
        </div>
      )}
    </Modal>
  );
}