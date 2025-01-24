import React from 'react';
import { Type, GripVertical, EyeOff, Eye, Image, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Layer } from '../../types';
import { Reorder } from 'framer-motion';

interface LayerItemProps {
  layer: Layer;
  name: string;
  isSelected: boolean;
  onVisibilityToggle: (id: string) => void;
  onPositionToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick: () => void;
  isDraggable: boolean;
}

export function LayerItem({
  layer,
  name,
  isSelected,
  onVisibilityToggle,
  onPositionToggle,
  onDelete,
  onClick,
  isDraggable
}: LayerItemProps) {
  const getIcon = () => {
    switch (layer.type) {
      case 'text':
        return <Type className="w-4 h-4 text-gray-300" />;
      case 'image':
        return <Image className="w-4 h-4 text-emerald-300" />;
      case 'background':
      case 'foreground':
        return <Image className="w-4 h-4 text-gray-300" />;
    }
  };

  const canDelete = layer.type !== 'background' && layer.type !== 'foreground';

  return (
    <Reorder.Item
      value={layer}
      dragListener={isDraggable}
      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-green-900/30 ring-1 ring-green-500/30 text-green-200' 
          : 'hover:bg-red-900/30 ring-1 ring-gray-500/30 text-gray-200'
      } ${!isDraggable ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
    >
      {isDraggable && (
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}
      {!isDraggable && <div className="w-4" />}
      {getIcon()}
      <span className="text-sm truncate flex-1">
        {name}
      </span>
      <div className="flex items-center gap-1">
        {(layer.type === 'text' || layer.type === 'image') && onPositionToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPositionToggle(layer.id);
            }}
            className="p-1 rounded-full hover:bg-black/30 transition-colors"
            title={layer.isAboveForeground ? "Move below foreground" : "Move above foreground"}
          >
            {layer.isAboveForeground ? (
              <ArrowDown className="w-4 h-4 text-blue-300" />
            ) : (
              <ArrowUp className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVisibilityToggle(layer.id);
          }}
          className="p-1 rounded-full hover:bg-black/30 transition-colors"
          title={layer.isVisible ? "Hide layer" : "Show layer"}
        >
          {!layer.isVisible ? (
            <EyeOff className="w-4 h-4 text-gray-400" />
          ) : (
            <Eye className="w-4 h-4 text-gray-300" />
          )}
        </button>
        {canDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(layer.id);
            }}
            className="p-1 rounded-full hover:bg-red-900/30 transition-colors group"
            title="Delete layer"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
          </button>
        )}
      </div>
    </Reorder.Item>
  );
}