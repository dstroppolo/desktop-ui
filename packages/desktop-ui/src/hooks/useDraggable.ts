import { useRef, useCallback } from 'react';
import { Position } from '../types';

interface UseDraggableOptions {
  onDrag: (position: Position) => void;
  /** Called when drag ends (mouse released). Use for snap-to-grid. */
  onDragEnd?: (position: Position) => void;
  enabled?: boolean;
  bounds?: {
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
  };
}

export const useDraggable = ({ onDrag, onDragEnd, enabled = true, bounds }: UseDraggableOptions) => {
  const isDragging = useRef(false);
  const startMouseScreenPos = useRef<Position>({ x: 0, y: 0 });
  const startWindowPos = useRef<Position>({ x: 0, y: 0 });
  const lastPosition = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent, initialPosition: Position) => {
    if (!enabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    
    // Store initial mouse position in screen coordinates
    startMouseScreenPos.current = { x: e.clientX, y: e.clientY };
    startWindowPos.current = initialPosition;
    lastPosition.current = initialPosition;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      // Calculate mouse movement delta in screen coordinates
      const deltaX = e.clientX - startMouseScreenPos.current.x;
      const deltaY = e.clientY - startMouseScreenPos.current.y;

      // Add delta to initial window position
      let newX = startWindowPos.current.x + deltaX;
      let newY = startWindowPos.current.y + deltaY;

      // Apply bounds constraints
      if (bounds) {
        if (bounds.minX !== undefined) newX = Math.max(newX, bounds.minX);
        if (bounds.minY !== undefined) newY = Math.max(newY, bounds.minY);
        if (bounds.maxX !== undefined) newX = Math.min(newX, bounds.maxX);
        if (bounds.maxY !== undefined) newY = Math.min(newY, bounds.maxY);
      }

      const newPosition: Position = { x: newX, y: newY };
      lastPosition.current = newPosition;
      onDrag(newPosition);
    };

    const handleMouseUp = () => {
      if (isDragging.current && onDragEnd) {
        onDragEnd(lastPosition.current);
      }
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [enabled, onDrag, onDragEnd, bounds]);

  return { handleMouseDown };
};
