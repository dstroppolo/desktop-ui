import { useRef, useCallback } from 'react';
import { Position, Size } from '../types';

type ResizeHandle = 
  | 'n' | 's' | 'e' | 'w' 
  | 'ne' | 'nw' | 'se' | 'sw';

interface UseResizableOptions {
  onResize: (size: Size, position: Position) => void;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  bounds?: {
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
  };
}

export const useResizable = ({
  onResize,
  minWidth = 100,
  minHeight = 100,
  maxWidth = Infinity,
  maxHeight = Infinity,
  bounds,
}: UseResizableOptions) => {
  const isResizing = useRef(false);
  const startPos = useRef<Position>({ x: 0, y: 0 });
  const startSize = useRef<Size>({ width: 0, height: 0 });
  const startWindowPos = useRef<Position>({ x: 0, y: 0 });
  const currentHandle = useRef<ResizeHandle | null>(null);

  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    handle: ResizeHandle,
    currentSize: Size,
    currentPosition: Position
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    isResizing.current = true;
    currentHandle.current = handle;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = currentSize;
    startWindowPos.current = currentPosition;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !currentHandle.current) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;
      let newX = startWindowPos.current.x;
      let newY = startWindowPos.current.y;

      const handle = currentHandle.current;

      // Handle horizontal resizing
      if (handle.includes('e')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startSize.current.width + deltaX));
      } else if (handle.includes('w')) {
        const widthDelta = startSize.current.width - deltaX;
        if (widthDelta >= minWidth && widthDelta <= maxWidth) {
          newWidth = widthDelta;
          newX = startWindowPos.current.x + deltaX;
        }
      }

      // Handle vertical resizing
      if (handle.includes('s')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startSize.current.height + deltaY));
      } else if (handle.includes('n')) {
        const heightDelta = startSize.current.height - deltaY;
        if (heightDelta >= minHeight && heightDelta <= maxHeight) {
          newHeight = heightDelta;
          newY = startWindowPos.current.y + deltaY;
        }
      }

      // Apply bounds constraints for position
      if (bounds) {
        if (bounds.minX !== undefined) newX = Math.max(newX, bounds.minX);
        if (bounds.minY !== undefined) newY = Math.max(newY, bounds.minY);
        if (bounds.maxX !== undefined) newX = Math.min(newX, bounds.maxX - newWidth);
        if (bounds.maxY !== undefined) newY = Math.min(newY, bounds.maxY - newHeight);
      }

      onResize(
        { width: newWidth, height: newHeight },
        { x: newX, y: newY }
      );
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      currentHandle.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, minWidth, minHeight, maxWidth, maxHeight, bounds]);

  return { handleMouseDown };
};
