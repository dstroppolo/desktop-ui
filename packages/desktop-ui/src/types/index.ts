import type React from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  title: string;
  position: Position;
  size: Size;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  previousPosition?: Position;
  previousSize?: Size;
}

export interface Theme {
  desktop: {
    background: string;
  };
  window: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
    shadow: string;
    header: {
      height: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      fontWeight: string;
      padding: string;
    };
    button: {
      size: string;
      borderRadius: string;
      hoverBackground: string;
      activeBackground: string;
      closeColor: string;
      closeHoverColor: string;
      minimizeColor: string;
      minimizeHoverColor: string;
      maximizeColor: string;
      maximizeHoverColor: string;
    };
  };
  taskbar: {
    height: string;
    backgroundColor: string;
    borderTop: string;
    item: {
      backgroundColor: string;
      hoverBackground: string;
      activeBackground: string;
      textColor: string;
      fontSize: string;
      padding: string;
      borderRadius: string;
    };
    startButton: {
      backgroundColor: string;
      hoverBackground: string;
      activeBackground: string;
      textColor: string;
      fontSize: string;
      fontWeight: string;
      padding: string;
      borderRadius: string;
      minWidth: string;
      logoColors?: {
        color1: string;
        color2: string;
      };
    };
  };
  /** Start menu styling. Optional; uses window/input defaults when not provided. */
  startMenu?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    shadow?: string;
    itemTextColor?: string;
    itemHoverBackground?: string;
    itemHoverTextColor?: string;
    itemPadding?: string;
    itemFontSize?: string;
    minWidth?: string;
  };
  /** Folder tree / file explorer sidebar styling. Optional. */
  folderTree?: {
    itemTextColor?: string;
    itemHoverBackground?: string;
    itemHoverTextColor?: string;
    itemSelectedBackground?: string;
    itemSelectedTextColor?: string;
    itemPadding?: string;
    itemFontSize?: string;
    indentSize?: number;
    expandIconColor?: string;
  };
  /** Form input styling. Optional; components use defaults when not provided. */
  input?: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
    textColor: string;
    placeholderColor: string;
    focusBorderColor?: string;
    disabledBackground?: string;
    disabledTextColor?: string;
    errorBorderColor?: string;
    checkColor?: string;
    checkBackground?: string;
    buttonBackground: string;
    buttonHoverBackground: string;
    buttonActiveBackground: string;
    buttonBorderColor: string;
    buttonTextColor: string;
    buttonDisabledBackground?: string;
    buttonSecondaryBackground?: string;
    buttonSecondaryHoverBackground?: string;
    buttonDangerBackground?: string;
    buttonDangerHoverBackground?: string;
    calendarBackground?: string;
    calendarHeaderBackground?: string;
    calendarDayHover?: string;
    calendarDaySelected?: string;
  };
}

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  width?: number;
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  label?: React.ReactNode;
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface CalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
}

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'defaultValue'
  > {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  placeholder?: string;
}

export interface FolderTreeItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: FolderTreeItem[];
}

export interface ResizableSplitPaneProps {
  /** Content for the left pane */
  left: React.ReactNode;
  /** Content for the right pane */
  right: React.ReactNode;
  /** Initial width of the left pane in pixels */
  defaultLeftWidth?: number;
  /** Minimum width of the left pane in pixels */
  minLeftWidth?: number;
  /** Maximum width of the left pane in pixels */
  maxLeftWidth?: number;
  /** Width of the resize handle in pixels */
  handleSize?: number;
}

export interface FolderTreeProps {
  /** Hierarchical list of folder/file items */
  items: FolderTreeItem[];
  /** ID of the currently selected item */
  selectedId?: string;
  /** Called when an item is selected */
  onSelect?: (item: FolderTreeItem) => void;
  /** IDs of expanded items (controlled). If not provided, expand state is internal. */
  expandedIds?: string[];
  /** Called when an item is expanded/collapsed (for controlled mode) */
  onExpandChange?: (itemId: string, expanded: boolean) => void;
  /** Default expanded IDs (uncontrolled) */
  defaultExpandedIds?: string[];
  /** Minimum width of the sidebar in pixels */
  minWidth?: number;
}

export interface WindowProps {
  id: string;
  title: string;
  initialPosition?: Position;
  initialSize?: Size;
  /** Called before closing; return false to prevent close (e.g. for unsaved changes) */
  onBeforeClose?: () => boolean;
  /** Called when closing. Receives window state (position, size) for persistence before the window is removed. */
  onClose?: (windowState?: Pick<WindowState, 'position' | 'size'>) => void;
  /** Called when window position or size changes (debounced). Use for persistence. */
  onLayoutChange?: (layout: { position: Position; size: Size }) => void;
  children?: React.ReactNode;
}

export interface DesktopProps {
  theme?: Theme;
  /** When true, enables grid layout for desktop shortcuts (snap-to-grid behavior) */
  grid?: boolean;
  /** Size of each grid cell in pixels. Used when grid is enabled. Default: 64 */
  gridSize?: number;
  children?: React.ReactNode;
}

export interface DesktopShortcutProps {
  /** Unique identifier for the shortcut */
  id: string;
  /** Icon to display (React node, e.g. emoji or img) */
  icon?: React.ReactNode;
  /** Label text below the icon */
  label: string;
  /** Initial position. Will be snapped to grid if Desktop has grid enabled */
  initialPosition?: Position;
  /** Called when shortcut is single-clicked */
  onClick?: () => void;
  /** Called when shortcut is double-clicked (single tap on touch/coarse-pointer devices) */
  onDoubleClick?: () => void;
  /** Width of the shortcut in pixels. Default: 64 */
  width?: number;
  /** Height of the shortcut in pixels. Default: 52 */
  height?: number;
  /** Called when shortcut position changes (e.g. after drag) */
  onPositionChange?: (position: Position) => void;
}

export interface TaskbarProps {
  /** Content to display in the Start menu (StartMenuItem components) */
  startMenuContent?: React.ReactNode;
}

export interface StartMenuItemProps {
  /** Icon to display (React node, e.g. emoji or img) */
  icon?: React.ReactNode;
  /** Label text */
  label: string;
  /** Called when the item is clicked */
  onClick?: () => void;
  /** Optional unique id */
  id?: string;
}

export interface StartMenuSubmenuProps {
  /** Icon to display (React node, e.g. emoji or img) */
  icon?: React.ReactNode;
  /** Label text for the submenu trigger */
  label: string;
  /** Submenu items (StartMenuItem components) - shown on hover */
  children: React.ReactNode;
  /** Optional unique id */
  id?: string;
  /** Called when a submenu item is clicked - used internally by StartMenu */
  onClose?: () => void;
}
