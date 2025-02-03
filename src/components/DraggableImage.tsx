import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ImageElement } from '../types';
import { ResizeHandle } from './image/ResizeHandle';

interface DraggableImageProps {
  image: ImageElement;
  onSelect: (image: ImageElement) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected?: boolean;
  style?: React.CSSProperties;
}

export function DraggableImage({
  image,
  onSelect,
  onMove,
  onResize,
  containerRef,
  isSelected,
  style = {}
}: DraggableImageProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(data.x, containerRect.width - image.width));
      const y = Math.max(0, Math.min(data.y, containerRect.height - image.height));
      onMove(image.id, x, y);
    }
  };

  const handleResize = (deltaWidth: number, deltaHeight: number) => {
    if (!onResize) return;
    
    const newWidth = Math.max(50, image.width + deltaWidth);
    const newHeight = Math.max(50, image.height + deltaHeight);
    
    onResize(image.id, newWidth, newHeight);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(image);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: image.x, y: image.y }}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={handleClick}
        data-image-id={image.id}
        style={{
          ...style,
          width: image.width,
          height: image.height,
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <img
          src={image.url}
          alt="Uploaded"
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {isSelected && onResize && (
          <>
            <ResizeHandle position="topLeft" onResize={handleResize} />
            <ResizeHandle position="top" onResize={handleResize} />
            <ResizeHandle position="topRight" onResize={handleResize} />
            <ResizeHandle position="right" onResize={handleResize} />
            <ResizeHandle position="bottomRight" onResize={handleResize} />
            <ResizeHandle position="bottom" onResize={handleResize} />
            <ResizeHandle position="bottomLeft" onResize={handleResize} />
            <ResizeHandle position="left" onResize={handleResize} />
          </>
        )}
      </div>
    </Draggable>
  );
}