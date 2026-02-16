import React, { useEffect, useRef } from 'react';
import { WindowProps } from '../../types';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useDraggable } from '../../hooks/useDraggable';
import { useResizable } from '../../hooks/useResizable';
import { useTheme } from '../../context/DesktopContext';
import {
  WindowContainer,
  WindowContent,
  ResizeHandle,
} from './Window.styles';
import { WindowHeader } from './WindowHeader';

const LAYOUT_DEBOUNCE_MS = 300;

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  initialPosition,
  initialSize,
  onBeforeClose,
  onClose,
  onLayoutChange,
  children,
}) => {
  const windowManager = useWindowManager();
  const theme = useTheme();
  const windowRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLElement | null>(null);

  // Initialize window on mount
  useEffect(() => {
    windowManager.openWindow(id, title, initialPosition, initialSize);
    return () => {
      windowManager.closeWindow(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, title]); // Only run on mount/unmount

  const windowState = windowManager.getWindow(id);

  useEffect(() => {
    if (!onLayoutChange || !windowState || windowState.maximized) return;
    const { position, size } = windowState;
    const timeoutId = setTimeout(() => {
      onLayoutChange({ position, size });
    }, LAYOUT_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [
    onLayoutChange,
    windowState?.position.x,
    windowState?.position.y,
    windowState?.size.width,
    windowState?.size.height,
  ]);

  useEffect(() => {
    // Find desktop container for bounds
    const findDesktop = () => {
      let element = windowRef.current?.parentElement;
      while (element && !element.hasAttribute('data-desktop')) {
        element = element.parentElement;
      }
      desktopRef.current = element || null;
    };
    
    findDesktop();
    // Retry if not found immediately (in case desktop isn't mounted yet)
    if (!desktopRef.current) {
      const timeout = setTimeout(findDesktop, 0);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Calculate bounds for drag/resize
  const getBounds = () => {
    if (!desktopRef.current) return undefined;
    const rect = desktopRef.current.getBoundingClientRect();
    return {
      minX: 0,
      minY: 0,
      maxX: rect.width,
      maxY: rect.height,
    };
  };

  // Hooks must be called before any early returns to maintain idempotency
  const {
    handleMouseDown: handleDragStart,
    handleTouchStart: handleDragTouchStart,
  } = useDraggable({
    onDrag: (position) => {
      windowManager.updateWindowPosition(id, position);
    },
    enabled: windowState ? !windowState.minimized && !windowState.maximized : false,
    bounds: getBounds(),
  });

  const { handleMouseDown: handleResizeStart } = useResizable({
    onResize: (size, position) => {
      windowManager.updateWindowSize(id, size);
      windowManager.updateWindowPosition(id, position);
    },
    minWidth: 150,
    minHeight: 100,
    bounds: getBounds(),
  });

  if (!windowState) {
    return null;
  }

  const handleFocus = () => {
    windowManager.focusWindow(id);
  };

  const handleClose = () => {
    if (onBeforeClose && !onBeforeClose()) return;
    const state = windowManager.getWindow(id);
    onClose?.(state ? { position: state.position, size: state.size } : undefined);
    windowManager.closeWindow(id);
  };

  const handleMinimize = () => {
    windowManager.minimizeWindow(id);
  };

  const handleMaximize = () => {
    // Try to find desktop if not already set
    if (!desktopRef.current) {
      let element = windowRef.current?.parentElement;
      while (element && !element.hasAttribute('data-desktop')) {
        element = element.parentElement;
      }
      desktopRef.current = element || null;
    }
    
    if (!desktopRef.current) {
      return;
    }
    
    const rect = desktopRef.current.getBoundingClientRect();
    windowManager.maximizeWindow(id, {
      width: rect.width,
      height: rect.height,
    });
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    handleFocus();
    // Don't allow dragging when maximized
    if (windowState.maximized) return;
    // Get the actual rendered position from the DOM element
    let actualPosition = windowState.position;
    if (windowRef.current && desktopRef.current) {
      const windowRect = windowRef.current.getBoundingClientRect();
      const desktopRect = desktopRef.current.getBoundingClientRect();
      actualPosition = {
        x: windowRect.left - desktopRect.left,
        y: windowRect.top - desktopRect.top,
      };
    }
    handleDragStart(e, actualPosition);
  };

  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    handleFocus();
    // Don't allow dragging when maximized
    if (windowState.maximized) return;
    // Get the actual rendered position from the DOM element
    let actualPosition = windowState.position;
    if (windowRef.current && desktopRef.current) {
      const windowRect = windowRef.current.getBoundingClientRect();
      const desktopRect = desktopRef.current.getBoundingClientRect();
      actualPosition = {
        x: windowRect.left - desktopRect.left,
        y: windowRect.top - desktopRect.top,
      };
    }
    handleDragTouchStart(e, actualPosition);
  };

  if (windowState.minimized) {
    return null;
  }

  const resizeHandles: Array<'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'> = [
    'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
  ];

  return (
    <WindowContainer
      ref={windowRef}
      $position={windowState.position}
      $size={windowState.size}
      $zIndex={windowState.zIndex}
      $minimized={windowState.minimized}
      $maximized={windowState.maximized}
      $theme={theme}
      onClick={handleFocus}
    >
      <WindowHeader
        title={title}
        maximized={windowState.maximized}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={handleHeaderTouchStart}
      />
      <WindowContent $theme={theme}>
        {children}
      </WindowContent>
      {!windowState.maximized && resizeHandles.map((handle) => (
        <ResizeHandle
          key={handle}
          $handle={handle}
          $theme={theme}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleResizeStart(e, handle, windowState.size, windowState.position);
          }}
        />
      ))}
    </WindowContainer>
  );
};
