import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HeaderButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}

export function HeaderButton({ icon: Icon, onClick, title, disabled }: HeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center group hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
    >
      <Icon className="w-4 h-4 text-white" />
    </button>
  );
}