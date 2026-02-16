import { useRef, useCallback, useEffect, useState } from 'react';
import { Position, Size } from '../types';

function getTouchDistance(touches: TouchList): number {
  if (touches.length < 2) return 0;
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return Math.hypot(dx, dy);
}

interface UsePinchResizeOptions {
  onResize: (size: Size, position: Position) => void;
  getLayout: () => { size: Size; position: Position };
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
  enabled?: boolean;
}

export const usePinchResize = ({
  onResize,
  getLayout,
  minWidth = 100,
  minHeight = 100,
  maxWidth = Infinity,
  maxHeight = Infinity,
  bounds,
  enabled = true,
}: UsePinchResizeOptions) => {
  const isPinching = useRef(false);
  const startDistance = useRef(0);
  const startSize = useRef<Size>({ width: 0, height: 0 });
  const startPosition = useRef<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement | null>(null);
  const getLayoutRef = useRef(getLayout);
  getLayoutRef.current = getLayout;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || e.touches.length !== 2) return;

      const target = e.target as HTMLElement;
      if (!elementRef.current?.contains(target)) return;

      const { size, position } = getLayoutRef.current();
      if (!size.width || !size.height) return;

      e.preventDefault();
      isPinching.current = true;
      startDistance.current = getTouchDistance(e.touches);
      startSize.current = size;
      startPosition.current = position;
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !isPinching.current || e.touches.length !== 2) return;

      e.preventDefault();

      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance < 5) return; // Ignore tiny movements

      const scale = currentDistance / startDistance.current;

      let newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startSize.current.width * scale)
      );
      let newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, startSize.current.height * scale)
      );

      // Scale from center: keep center point fixed
      const centerX = startPosition.current.x + startSize.current.width / 2;
      const centerY = startPosition.current.y + startSize.current.height / 2;
      let newX = centerX - newWidth / 2;
      let newY = centerY - newHeight / 2;

      // Apply bounds constraints
      if (bounds) {
        if (bounds.minX !== undefined) newX = Math.max(newX, bounds.minX);
        if (bounds.minY !== undefined) newY = Math.max(newY, bounds.minY);
        if (bounds.maxX !== undefined)
          newX = Math.min(newX, bounds.maxX - newWidth);
        if (bounds.maxY !== undefined)
          newY = Math.min(newY, bounds.maxY - newHeight);
      }

      onResize({ width: newWidth, height: newHeight }, { x: newX, y: newY });
    },
    [
      enabled,
      onResize,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      bounds,
    ]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isPinching.current = false;
      }
    },
    []
  );

  const [refReady, setRefReady] = useState(false);
  const setRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
    setRefReady(!!el);
  }, []);

  useEffect(() => {
    if (!enabled || !refReady) return;

    const el = elementRef.current;
    if (!el) return;

    const opts = { passive: false };

    el.addEventListener('touchstart', handleTouchStart, opts);
    document.addEventListener('touchmove', handleTouchMove, opts);
    document.addEventListener('touchend', handleTouchEnd, opts);
    document.addEventListener('touchcancel', handleTouchEnd, opts);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, refReady, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { contentRef: setRef };
};
