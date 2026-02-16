export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface ShortcutLayout {
  x: number;
  y: number;
}

export interface WindowLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesktopLayout {
  version: number;
  savedAtViewport: Viewport;
  shortcuts: Record<string, ShortcutLayout>;
  windows: Record<string, WindowLayout>;
  openWindows?: string[];
  theme?: string;
}

export interface DesktopStorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}
