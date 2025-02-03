import React from 'react';
import { Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center gap-3 cursor-pointer" 
      onClick={() => navigate('/')}
    >
      <div className="relative">
        <Wand2 className="w-6 h-6 text-white animate-pulse-glow" />
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
      </div>
      <span className="font-semibold text-white">Imagenity</span>
    </div>
  );
}