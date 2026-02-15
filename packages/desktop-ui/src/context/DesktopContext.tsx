import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { Theme, WindowState, Position, Size } from '../types';
import { windowsXPTheme } from '../themes';

interface WindowManager {
  windows: Map<string, WindowState>;
  maxZIndex: number;
  openWindow: (id: string, title: string, initialPosition?: Position, initialSize?: Size) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string, desktopSize: Size) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
  getWindow: (id: string) => WindowState | undefined;
  getAllWindows: () => WindowState[];
}

export interface GridSettings {
  enabled: boolean;
  size: number;
}

interface DesktopContextValue {
  theme: Theme;
  windowManager: WindowManager;
  grid: GridSettings;
}

const DesktopContext = createContext<DesktopContextValue | undefined>(undefined);

interface ThemeProviderProps {
  theme?: Theme;
  grid?: boolean;
  gridSize?: number;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = windowsXPTheme,
  grid = false,
  gridSize = 64,
  children,
}) => {
  const [windows, setWindows] = useState<Map<string, WindowState>>(new Map());
  const maxZIndexRef = useRef(1);

  const openWindow = useCallback((id: string, title: string, initialPosition?: Position, initialSize?: Size) => {
    const newZIndex = maxZIndexRef.current + 1;
    maxZIndexRef.current = newZIndex;
    setWindows((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, {
        id,
        title,
        position: initialPosition || { x: 100, y: 100 },
        size: initialSize || { width: 400, height: 300 },
        zIndex: newZIndex,
        minimized: false,
        maximized: false,
      });
      return newMap;
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const newMap = new Map(prev);
      const window = newMap.get(id);
      if (window) {
        newMap.set(id, { ...window, minimized: true });
      }
      return newMap;
    });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    const newZIndex = maxZIndexRef.current + 1;
    maxZIndexRef.current = newZIndex;
    setWindows((prev) => {
      const newMap = new Map(prev);
      const window = newMap.get(id);
      if (window) {
        newMap.set(id, { ...window, minimized: false, zIndex: newZIndex });
      }
      return newMap;
    });
  }, []);

  const maximizeWindow = useCallback((id: string, desktopSize: Size) => {
    const newZIndex = maxZIndexRef.current + 1;
    maxZIndexRef.current = newZIndex;
    setWindows((prev) => {
      const newMap = new Map(prev);
      const window = newMap.get(id);
      if (window) {
        if (window.maximized) {
          // Restore to previous position and size
          newMap.set(id, {
            ...window,
            maximized: false,
            position: window.previousPosition || window.position,
            size: window.previousSize || window.size,
            zIndex: newZIndex,
            previousPosition: undefined,
            previousSize: undefined,
          });
        } else {
          // Maximize: save current position/size and set to full screen
          newMap.set(id, {
            ...window,
            maximized: true,
            previousPosition: window.position,
            previousSize: window.size,
            position: { x: 0, y: 0 },
            size: desktopSize,
            zIndex: newZIndex,
          });
        }
      }
      return newMap;
    });
  }, []);

  const focusWindow = useCallback((id: string) => {
    const newZIndex = maxZIndexRef.current + 1;
    maxZIndexRef.current = newZIndex;
    setWindows((prev) => {
      const newMap = new Map(prev);
      const window = newMap.get(id);
      if (window && !window.minimized) {
        newMap.set(id, { ...window, zIndex: newZIndex });
      }
      return newMap;
    });
  }, []);

  const updateWindowPosition = useCallback((id: string, position: Position) => {
    setWindows((prev) => {
      const newMap = new Map(prev);
      const window = newMap.get(id);
      if (window && !window.maximized) {
        newMap.set(id, { ...window, position });
      }
      return newMap;
    });
  }, []);

  const updateWindowSize = useCallback((id: string, size: Size) => {
    setWindows((prev) => {
      const newMap = new Map(prev);
      const window = newMap.get(id);
      if (window && !window.maximized) {
        newMap.set(id, { ...window, size });
      }
      return newMap;
    });
  }, []);

  const getWindow = useCallback((id: string) => {
    return windows.get(id);
  }, [windows]);

  const getAllWindows = useCallback(() => {
    return Array.from(windows.values());
  }, [windows]);

  const windowManager: WindowManager = {
    windows,
    maxZIndex: maxZIndexRef.current,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    getWindow,
    getAllWindows,
  };

  const gridSettings: GridSettings = {
    enabled: grid,
    size: gridSize,
  };

  return (
    <DesktopContext.Provider value={{ theme, windowManager, grid: gridSettings }}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = (): DesktopContextValue => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a ThemeProvider');
  }
  return context;
};

export const useTheme = (): Theme => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};
