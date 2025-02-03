import React from 'react';

type HandlePosition = 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

interface ResizeHandleProps {
  position: HandlePosition;
  onResize: (deltaWidth: number, deltaHeight: number) => void;
}

export function ResizeHandle({ position, onResize }: ResizeHandleProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      switch (position) {
        case 'topLeft':
          onResize(-deltaX, -deltaY);
          break;
        case 'topRight':
          onResize(deltaX, -deltaY);
          break;
        case 'bottomRight':
          onResize(deltaX, deltaY);
          break;
        case 'bottomLeft':
          onResize(-deltaX, deltaY);
          break;
        case 'top':
          onResize(0, -deltaY);
          break;
        case 'right':
          onResize(deltaX, 0);
          break;
        case 'bottom':
          onResize(0, deltaY);
          break;
        case 'left':
          onResize(-deltaX, 0);
          break;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getCursor = () => {
    switch (position) {
      case 'topLeft':
      case 'bottomRight':
        return 'nwse-resize';
      case 'topRight':
      case 'bottomLeft':
        return 'nesw-resize';
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'left':
      case 'right':
        return 'ew-resize';
    }
  };

  const getPosition = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '12px',
      height: '12px'
    };

    switch (position) {
      case 'topLeft':
        return { ...base, top: '-6px', left: '-6px' };
      case 'topRight':
        return { ...base, top: '-6px', right: '-6px' };
      case 'bottomRight':
        return { ...base, bottom: '-6px', right: '-6px' };
      case 'bottomLeft':
        return { ...base, bottom: '-6px', left: '-6px' };
      case 'top':
        return { ...base, top: '-6px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { ...base, right: '-6px', top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
        return { ...base, bottom: '-6px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { ...base, left: '-6px', top: '50%', transform: 'translateY(-50%)' };
    }
  };

  return (
    <div
      className="bg-white border-2 border-blue-500 rounded-full hover:bg-blue-100 transition-colors"
      style={{
        ...getPosition(),
        cursor: getCursor(),
        zIndex: 10
      }}
      onMouseDown={handleMouseDown}
    />
  );
}