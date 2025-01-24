import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <div className="fixed inset-0 overflow-y-auto">
              <div className="min-h-full flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-md overflow-hidden bg-dark-100 border border-white/10 rounded-xl shadow-2xl"
                >
                  <div className="p-6">
                    <div className="mb-5">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">
                          {title}
                        </h2>
                        <button
                          onClick={onClose}
                          className="p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      {description && (
                        <p className="mt-1.5 text-sm text-gray-400">
                          {description}
                        </p>
                      )}
                    </div>
                    {children}
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}