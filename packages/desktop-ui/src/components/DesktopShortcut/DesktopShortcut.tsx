import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DesktopShortcutProps, Position } from '../../types';
import { useDesktop } from '../../context/DesktopContext';
import { useDraggable } from '../../hooks/useDraggable';
import { ShortcutContainer, ShortcutIcon, ShortcutLabel } from './DesktopShortcut.styles';

const SHORTCUT_WIDTH = 64;
const SHORTCUT_HEIGHT = 52;

export const DesktopShortcut: React.FC<DesktopShortcutProps> = ({
  id: _id,
  icon,
  label,
  initialPosition = { x: 16, y: 16 },
  onClick,
  onDoubleClick,
  width = SHORTCUT_WIDTH,
  height = SHORTCUT_HEIGHT,
  onPositionChange,
}) => {
  const { grid } = useDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLElement | null>(null);

  const [position, setPosition] = useState<Position>(() => {
    if (grid.enabled) {
      const snappedX = Math.round(initialPosition.x / grid.size) * grid.size;
      const snappedY = Math.round(initialPosition.y / grid.size) * grid.size;
      return { x: snappedX, y: snappedY };
    }
    return initialPosition;
  });

  const [bounds, setBounds] = useState<{ minX: number; minY: number; maxX: number; maxY: number } | undefined>(undefined);

  const findDesktopAndUpdateBounds = useCallback(() => {
    let element = containerRef.current?.parentElement;
    while (element && !element.hasAttribute('data-desktop')) {
      element = element.parentElement;
    }
    desktopRef.current = element || null;

    if (desktopRef.current) {
      const rect = desktopRef.current.getBoundingClientRect();
      const maxX = rect.width - width;
      const maxY = rect.height - height;

      setBounds({
        minX: 0,
        minY: 0,
        maxX: Math.max(0, maxX),
        maxY: Math.max(0, maxY),
      });
    }
  }, [width, height]);

  useEffect(() => {
    findDesktopAndUpdateBounds();
    const resizeObserver = new ResizeObserver(findDesktopAndUpdateBounds);
    if (desktopRef.current) {
      resizeObserver.observe(desktopRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [findDesktopAndUpdateBounds]);

  const snapToGrid = useCallback(
    (pos: Position): Position => {
      if (!grid.enabled) return pos;
      const snappedX = Math.round(pos.x / grid.size) * grid.size;
      const snappedY = Math.round(pos.y / grid.size) * grid.size;
      return {
        x: Math.max(0, Math.min(snappedX, bounds ? bounds.maxX : snappedX)),
        y: Math.max(0, Math.min(snappedY, bounds ? bounds.maxY : snappedY)),
      };
    },
    [grid.enabled, grid.size, bounds]
  );

  const handleDrag = useCallback((pos: Position) => {
    setPosition(pos);
  }, []);

  const handleDragEnd = useCallback(
    (pos: Position) => {
      const snapped = snapToGrid(pos);
      setPosition(snapped);
      onPositionChange?.(snapped);
    },
    [snapToGrid, onPositionChange]
  );

  const { handleMouseDown } = useDraggable({
    onDrag: handleDrag,
    onDragEnd: grid.enabled || onPositionChange ? handleDragEnd : undefined,
    enabled: true,
    bounds,
  });

  return (
    <ShortcutContainer
      ref={containerRef}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
      }}
      onMouseDown={(e) => handleMouseDown(e, position)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
    >
      <ShortcutIcon>{icon ?? '📄'}</ShortcutIcon>
      <ShortcutLabel>{label}</ShortcutLabel>
    </ShortcutContainer>
  );
};
