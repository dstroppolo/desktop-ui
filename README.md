# Desktop UI Library

A React UI library that mimics a desktop operating system interface with draggable, resizable, minimizable windows, a desktop container, and a taskbar.

## Features

- **Draggable Windows**: Click and drag title bar to move windows
- **Resizable Windows**: Drag edges/corners to resize - updates actual CSS width/height so responsive content works correctly
- **Minimizable**: Minimize button sends window to taskbar
- **Closable**: Close button removes window
- **Focus Management**: Clicking window brings it to front
- **Taskbar Integration**: All windows appear in taskbar, click to restore
- **Theme System**: Easy switching between themes (Windows XP, Windows 98, etc.)

## Installation

```bash
npm install desktop-ui
```

## Basic Usage

```tsx
import { Desktop, Window, Taskbar, ThemeProvider, windowsXPTheme } from 'desktop-ui';

function App() {
  return (
    <ThemeProvider theme={windowsXPTheme}>
      <Desktop>
        <Window id="window-1" title="My Window">
          <div>Window content here</div>
        </Window>
        <Taskbar />
      </Desktop>
    </ThemeProvider>
  );
}
```

## Components

### Desktop

The top-level container that acts as the desktop background.

```tsx
<Desktop theme={windowsXPTheme}>
  {/* Windows and Taskbar go here */}
</Desktop>
```

### Window

A draggable, resizable window container.

**Props:**
- `id` (string, required): Unique identifier for the window
- `title` (string, required): Window title displayed in the header
- `initialPosition` (Position, optional): Initial window position `{ x: number, y: number }`
- `initialSize` (Size, optional): Initial window size `{ width: number, height: number }`
- `onClose` (function, optional): Callback when window is closed
- `children` (ReactNode, optional): Window content

```tsx
<Window 
  id="my-window" 
  title="My Application"
  initialPosition={{ x: 100, y: 100 }}
  initialSize={{ width: 800, height: 600 }}
  onClose={() => console.log('Window closed')}
>
  <div>Your content here</div>
</Window>
```

### Taskbar

Displays all open windows at the bottom of the desktop.

```tsx
<Taskbar />
```

## Theming

The library includes built-in themes and supports easy theme switching.

### Available Themes

- `windowsXPTheme` - Windows XP style (default)
- `windows98Theme` - Windows 98 style
- `baseTheme` - Base theme template

### Using Themes

```tsx
import { ThemeProvider, windows98Theme } from 'desktop-ui';

<ThemeProvider theme={windows98Theme}>
  <Desktop>
    {/* Your windows */}
  </Desktop>
</ThemeProvider>
```

### Creating Custom Themes

```tsx
import { Theme } from 'desktop-ui';

const myCustomTheme: Theme = {
  desktop: {
    background: '#your-color',
  },
  window: {
    backgroundColor: '#your-color',
    borderColor: '#your-color',
    // ... other theme properties
  },
  taskbar: {
    // ... taskbar theme properties
  },
};
```

## Hooks

### useWindowManager

Access the window manager to programmatically control windows.

```tsx
import { useWindowManager } from 'desktop-ui';

function MyComponent() {
  const windowManager = useWindowManager();
  
  const openNewWindow = () => {
    windowManager.openWindow('new-window', 'New Window', { x: 200, y: 200 }, { width: 400, height: 300 });
  };
  
  return <button onClick={openNewWindow}>Open Window</button>;
}
```

### useTheme

Access the current theme.

```tsx
import { useTheme } from 'desktop-ui';

function MyComponent() {
  const theme = useTheme();
  // Use theme properties
}
```

## Responsive Content

Windows use actual CSS `width` and `height` properties (not transforms), so responsive CSS, media queries, and percentage-based layouts work correctly inside windows, just as they would in a browser viewport.

## License

MIT

## Cursor Agent Section

This section was created by a cursor agent.
