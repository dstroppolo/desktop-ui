// Components
export { Desktop } from './components/Desktop/Desktop';
export { DesktopShortcut } from './components/DesktopShortcut/DesktopShortcut';
export { Window } from './components/Window/Window';
export { Taskbar } from './components/Taskbar/Taskbar';
export { StartMenu } from './components/StartMenu/StartMenu';
export { StartMenuItem } from './components/StartMenu/StartMenuItem';
export { StartMenuSubmenu } from './components/StartMenu/StartMenuSubmenu';
export { TextInput } from './components/TextInput/TextInput';
export { Button } from './components/Button/Button';
export { Checkbox } from './components/Checkbox/Checkbox';
export { Radio } from './components/Radio/Radio';
export { RadioGroup } from './components/Radio/RadioGroup';
export { Calendar } from './components/Calendar/Calendar';
export { DateInput } from './components/DateInput/DateInput';
export { FolderTree } from './components/FolderTree/FolderTree';
export { ResizableSplitPane } from './components/ResizableSplitPane/ResizableSplitPane';

// Context and Hooks
export { ThemeProvider, useDesktop, useTheme } from './context/DesktopContext';
export { useWindowManager } from './hooks/useWindowManager';
export { useDraggable } from './hooks/useDraggable';
export { useResizable } from './hooks/useResizable';

// Themes
export { windowsXPTheme, windows98Theme, baseTheme } from './themes';

// Types
export type {
  Theme,
  WindowState,
  WindowProps,
  DesktopProps,
  DesktopShortcutProps,
  TaskbarProps,
  StartMenuItemProps,
  StartMenuSubmenuProps,
  Position,
  Size,
  TextInputProps,
  ButtonProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  CalendarProps,
  DateInputProps,
  FolderTreeItem,
  FolderTreeProps,
  ResizableSplitPaneProps,
} from './types';
