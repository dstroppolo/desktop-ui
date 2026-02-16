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
  const startPointerScreenPos = useRef<Position>({ x: 0, y: 0 });
  const startWindowPos = useRef<Position>({ x: 0, y: 0 });
  const lastPosition = useRef<Position>({ x: 0, y: 0 });

  const applyBounds = useCallback((position: Position): Position => {
    let newX = position.x;
    let newY = position.y;

    if (bounds) {
      if (bounds.minX !== undefined) newX = Math.max(newX, bounds.minX);
      if (bounds.minY !== undefined) newY = Math.max(newY, bounds.minY);
      if (bounds.maxX !== undefined) newX = Math.min(newX, bounds.maxX);
      if (bounds.maxY !== undefined) newY = Math.min(newY, bounds.maxY);
    }

    return { x: newX, y: newY };
  }, [bounds]);

  const startDrag = useCallback((pointerPos: Position, initialPosition: Position) => {
    isDragging.current = true;
    startPointerScreenPos.current = pointerPos;
    startWindowPos.current = initialPosition;
    lastPosition.current = initialPosition;
  }, []);

  const updateDrag = useCallback((pointerPos: Position) => {
    if (!isDragging.current) return;

    // Calculate pointer movement delta in screen coordinates
    const deltaX = pointerPos.x - startPointerScreenPos.current.x;
    const deltaY = pointerPos.y - startPointerScreenPos.current.y;

    // Add delta to initial window position
    const nextPosition = applyBounds({
      x: startWindowPos.current.x + deltaX,
      y: startWindowPos.current.y + deltaY,
    });

    lastPosition.current = nextPosition;
    onDrag(nextPosition);
  }, [applyBounds, onDrag]);

  const finishDrag = useCallback(() => {
    if (isDragging.current && onDragEnd) {
      onDragEnd(lastPosition.current);
    }
    isDragging.current = false;
  }, [onDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent, initialPosition: Position) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();

    startDrag({ x: e.clientX, y: e.clientY }, initialPosition);

    const handleMouseMove = (event: MouseEvent) => {
      updateDrag({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      finishDrag();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [enabled, finishDrag, startDrag, updateDrag]);

  const handleTouchStart = useCallback((e: React.TouchEvent, initialPosition: Position) => {
    if (!enabled) return;
    if (e.touches.length !== 1) return;

    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    startDrag({ x: touch.clientX, y: touch.clientY }, initialPosition);

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      event.preventDefault();
      const movingTouch = event.touches[0];
      updateDrag({ x: movingTouch.clientX, y: movingTouch.clientY });
    };

    const handleTouchEnd = () => {
      finishDrag();
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  }, [enabled, finishDrag, startDrag, updateDrag]);

  return { handleMouseDown, handleTouchStart };
};
