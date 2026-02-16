import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  DesktopLayout,
  DesktopStorageAdapter,
  Position,
  WindowLayout,
  ShortcutLayout,
} from './types';
import { localStorageAdapter } from './localStorageAdapter';

const LAYOUT_VERSION = 1;
const DEFAULT_STORAGE_KEY = 'desktop-ui-layout';
const DEBOUNCE_MS = 300;

function getViewport(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 768 };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}

function scaleLayout(
  layout: DesktopLayout,
  currentViewport: { width: number; height: number }
): DesktopLayout {
  const saved = layout.savedAtViewport;
  if (!saved || (saved.width === currentViewport.width && saved.height === currentViewport.height)) {
    return layout;
  }

  const scaleX = currentViewport.width / saved.width;
  const scaleY = currentViewport.height / saved.height;

  const scalePosition = (pos: { x: number; y: number }) => ({
    x: Math.round(pos.x * scaleX),
    y: Math.round(pos.y * scaleY),
  });

  const scaleWindowLayout = (w: WindowLayout): WindowLayout => ({
    x: Math.round(w.x * scaleX),
    y: Math.round(w.y * scaleY),
    width: Math.round(w.width * scaleX),
    height: Math.round(w.height * scaleY),
  });

  const scaledShortcuts: Record<string, ShortcutLayout> = {};
  for (const [id, pos] of Object.entries(layout.shortcuts)) {
    scaledShortcuts[id] = scalePosition(pos);
  }

  const scaledWindows: Record<string, WindowLayout> = {};
  for (const [id, w] of Object.entries(layout.windows)) {
    scaledWindows[id] = scaleWindowLayout(w);
  }

  return {
    ...layout,
    savedAtViewport: currentViewport,
    shortcuts: scaledShortcuts,
    windows: scaledWindows,
  };
}

function clampToViewport(
  layout: DesktopLayout,
  viewport: { width: number; height: number }
): DesktopLayout {
  const clamp = (n: number, max: number) => Math.max(0, Math.min(n, max));

  const clampedShortcuts: Record<string, ShortcutLayout> = {};
  for (const [id, pos] of Object.entries(layout.shortcuts)) {
    clampedShortcuts[id] = {
      x: clamp(pos.x, viewport.width - 64),
      y: clamp(pos.y, viewport.height - 52),
    };
  }

  const clampedWindows: Record<string, WindowLayout> = {};
  for (const [id, w] of Object.entries(layout.windows)) {
    clampedWindows[id] = {
      x: clamp(w.x, viewport.width - 100),
      y: clamp(w.y, viewport.height - 100),
      width: Math.min(w.width, viewport.width),
      height: Math.min(w.height, viewport.height),
    };
  }

  return {
    ...layout,
    shortcuts: clampedShortcuts,
    windows: clampedWindows,
  };
}

function loadLayoutSync(key: string): DesktopLayout | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DesktopLayout;
    if (!parsed || typeof parsed.version !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

function createEmptyLayout(viewport: { width: number; height: number }): DesktopLayout {
  return {
    version: LAYOUT_VERSION,
    savedAtViewport: viewport,
    shortcuts: {},
    windows: {},
    openWindows: [],
  };
}

export interface UseDesktopPersistenceOptions {
  storageKey?: string;
  adapter?: DesktopStorageAdapter;
}

export function useDesktopPersistence(options: UseDesktopPersistenceOptions = {}) {
  const { storageKey = DEFAULT_STORAGE_KEY, adapter = localStorageAdapter } = options;
  const viewport = getViewport();

  const [layout, setLayout] = useState<DesktopLayout>(() => {
    const raw = loadLayoutSync(storageKey);
    if (!raw) return createEmptyLayout(viewport);
    const scaled = scaleLayout(raw, viewport);
    return raw.savedAtViewport ? scaled : clampToViewport(scaled, viewport);
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingLayoutRef = useRef<DesktopLayout | null>(null);

  const saveToStorage = useCallback(
    (data: DesktopLayout) => {
      const toSave = {
        ...data,
        savedAtViewport: getViewport(),
      };
      adapter.set(storageKey, JSON.stringify(toSave));
    },
    [adapter, storageKey]
  );

  const flushSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (pendingLayoutRef.current) {
      saveToStorage(pendingLayoutRef.current);
      pendingLayoutRef.current = null;
    }
  }, [saveToStorage]);

  const debouncedSave = useCallback(
    (newLayout: DesktopLayout) => {
      pendingLayoutRef.current = newLayout;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        if (pendingLayoutRef.current) {
          saveToStorage(pendingLayoutRef.current);
          pendingLayoutRef.current = null;
        }
      }, DEBOUNCE_MS);
    },
    [saveToStorage]
  );

  useEffect(() => {
    return () => flushSave();
  }, [flushSave]);

  const saveShortcutPosition = useCallback(
    (id: string, position: Position) => {
      setLayout((prev) => {
        const next = {
          ...prev,
          shortcuts: { ...prev.shortcuts, [id]: { ...position } },
        };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  const saveWindowLayout = useCallback(
    (id: string, windowLayout: WindowLayout) => {
      setLayout((prev) => {
        const next = {
          ...prev,
          windows: { ...prev.windows, [id]: { ...windowLayout } },
        };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  const setOpenWindows = useCallback(
    (openWindows: string[]) => {
      setLayout((prev) => {
        const next = { ...prev, openWindows };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  const setTheme = useCallback(
    (theme: string) => {
      setLayout((prev) => {
        const next = { ...prev, theme };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  return {
    shortcutPositions: layout.shortcuts,
    windowLayouts: layout.windows,
    openWindows: layout.openWindows ?? [],
    theme: layout.theme,
    saveShortcutPosition,
    saveWindowLayout,
    setOpenWindows,
    setTheme,
    flushSave,
  };
}
